import { NextResponse } from "next/server";
import { auth, currentUser } from "@/utils/auth";
import dbConnect from "@/utils/db";
import { UserAnswer, Resume, MockInterview } from "@/utils/schema";
import { createChatSession } from "@/utils/GeminiAIModal";
import { rateLimit } from "@/utils/rateLimit";

// POST /api/interviews/[id]/chat — Dynamic conversational 1-on-1 interview response generator
export async function POST(request, { params }) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      jobPosition,
      jobDesc,
      jobExperience,
      conversationHistory,
      lastUserAnswer,
      interviewPhase = "Technical"
    } = body;

    // Rate limit: 60 chat turns per 5 minutes per user
    const rl = rateLimit(`chat-interview:${userId}`, { limit: 60, windowMs: 5 * 60_000 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    await dbConnect();
    const userEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase() ?? "";

    // Fetch resume and interview context if available
    const [resume, interview] = await Promise.all([
      Resume.findOne({ userEmail }),
      MockInterview.findOne({ mockId: id })
    ]);

    const candidateClaims = (resume?.insights?.interviewWorthyClaims || []).map(c => c.claim).join("; ");
    const candidateProjects = (resume?.projects || []).map(p => `${p.name} (${(p.technologies || []).join(", ")})`).join("; ");

    // Build adaptive conversational prompt
    const systemPrompt = `You are a Principal Engineering Interviewer conducting a realistic, adaptive 1-on-1 voice interview.
Job Role: ${jobPosition || interview?.jobPosition || "Software Engineer"}
Tech Stack / Description: ${jobDesc || interview?.jobDesc || "Full Stack Engineering"}
Experience Level: ${jobExperience || interview?.jobExperience || "3"} Years
Track/Difficulty: ${interview?.interviewType || "Technical"} - ${interview?.difficulty || "Medium"}
Current Phase: ${interviewPhase}
${candidateClaims ? `Candidate's Resume Claims: ${candidateClaims}` : ""}
${candidateProjects ? `Candidate's Resume Projects: ${candidateProjects}` : ""}

DYNAMIC EVALUATION & ADAPTIVE DECISION RULES:
1. Analyze the candidate's last spoken answer thoroughly:
   - Is it strong, weak, missing technical depth, or vague?
   - Did they mention a specific technology, caching tool (e.g. Redis), or metric without explaining how they handled it?
   - If they made a bold claim, test it (e.g. "How did you handle cache invalidation?" or "How did you measure that 30% speedup?").
2. Decision:
   - If answer is incomplete, vague, or mentions an interesting architectural choice: DECIDE TO ASK A DIRECT FOLLOW-UP ("decision": "follow_up").
   - If the answer was thorough and solid: DECIDE TO TRANSITION TO THE NEXT KEY TOPIC ("decision": "next_topic").
3. Voice-friendly delivery: Keep your spoken question ("aiSpeech") concise, professional, and natural (2 to 3 sentences maximum, without markdown or bullets).
4. Provide structured scoring & feedback for their answer:
   - "rating": numeric score out of 10 (e.g. 7.5)
   - "decision": "follow_up" or "next_topic"
   - "strongPoints": 1-2 bullet points
   - "couldImprove": 1-2 bullet points
   - "idealAnswerSummary": 1-2 sentence high-level ideal answer
   - "topic": Current topic name

Respond strictly in this JSON format:
{
  "aiSpeech": "Spoken interviewer response and next question here...",
  "decision": "follow_up",
  "rating": 8.0,
  "feedback": "Concise summary of their answer quality.",
  "strongPoints": ["Good grasp of Redis caching"],
  "couldImprove": ["Needs to elaborate on TTL and invalidation strategy"],
  "idealAnswerSummary": "A strong answer should outline cache-aside pattern with specific invalidation triggers.",
  "topic": "System Scalability",
  "isInterviewComplete": false
}`;

    const chatSession = createChatSession();

    const historyText = (conversationHistory || [])
      .map(item => `${item.sender === "ai" ? "Interviewer" : "Candidate"}: ${item.text}`)
      .join("\n");

    const fullPrompt = `${systemPrompt}

Recent Interview Conversation History:
${historyText}

Candidate's Latest Answer:
"${lastUserAnswer}"

Generate the next adaptive interviewer response and structured evaluation:`;

    let responseText;
    try {
      const aiResult = await chatSession.sendMessage({ message: fullPrompt });
      responseText = aiResult.text;
    } catch (error) {
      console.warn("[POST /api/interviews/[id]/chat] Gemini error; using fallback follow-up", error);
      responseText = JSON.stringify({
        aiSpeech: "That is interesting. Could you elaborate on how you handled edge cases and performance bottlenecks in that approach?",
        decision: "follow_up",
        rating: 7.0,
        feedback: "Answer received and logged.",
        strongPoints: ["Addressed the core concept"],
        couldImprove: ["Elaborate on edge cases"],
        idealAnswerSummary: "Include specific metrics, trade-offs, and failure mode analysis.",
        topic: "Technical Architecture",
        isInterviewComplete: false,
      });
    }

    const cleanedResponse = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let chatJson;
    try {
      chatJson = JSON.parse(cleanedResponse);
    } catch {
      chatJson = {
        aiSpeech: "Thank you. Can you tell me about the most challenging bug you encountered in this area and how you resolved it?",
        decision: "next_topic",
        rating: 7.0,
        feedback: "Candidate answer logged.",
        strongPoints: ["Clear communication"],
        couldImprove: ["Provide deeper architectural examples"],
        idealAnswerSummary: "Demonstrate deep understanding of system tradeoffs.",
        topic: "Problem Solving",
        isInterviewComplete: false
      };
    }

    // Persist answer and evaluation record into DB
    if (lastUserAnswer && lastUserAnswer.trim().length > 3) {
      const createdAt = new Date().toISOString().split("T")[0];
      const previousAiQuestion = conversationHistory?.filter(m => m.sender === "ai")?.slice(-1)[0]?.text || "Technical Question";

      await UserAnswer.create({
        mockIdRef: id,
        question: previousAiQuestion,
        correctAns: chatJson.idealAnswerSummary || "Detailed technical rationale and tradeoffs.",
        userAns: lastUserAnswer,
        feedback: chatJson.feedback || "Evaluated during live conversational session.",
        rating: String(chatJson.rating || "7.0"),
        userEmail,
        createdAt,
        strongPoints: chatJson.strongPoints || [],
        couldImprove: chatJson.couldImprove || [],
        idealAnswer: chatJson.idealAnswerSummary || "",
        communication: {
          wordCount: lastUserAnswer.split(/\s+/).length,
          decision: chatJson.decision,
          topic: chatJson.topic
        }
      });
    }

    return NextResponse.json({
      aiSpeech: chatJson.aiSpeech,
      decision: chatJson.decision || "next_topic",
      rating: chatJson.rating || 7.0,
      feedback: chatJson.feedback,
      strongPoints: chatJson.strongPoints || [],
      couldImprove: chatJson.couldImprove || [],
      idealAnswerSummary: chatJson.idealAnswerSummary || "",
      topic: chatJson.topic || "Technical Knowledge",
      isInterviewComplete: chatJson.isInterviewComplete || false,
    });

  } catch (error) {
    console.warn("[POST /api/interviews/[id]/chat]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
