import { NextResponse } from "next/server";
import { auth, currentUser } from "@/utils/auth";
import dbConnect from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
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

    const { id } = params;
    const body = await request.json();
    const { jobPosition, jobDesc, jobExperience, conversationHistory, lastUserAnswer } = body;

    // Rate limit: 40 chat turns per 5 minutes per user
    const rl = rateLimit(`chat-interview:${userId}`, { limit: 40, windowMs: 5 * 60_000 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    // Build adaptive conversational prompt
    const systemPrompt = `You are a real, friendly, yet rigorous Senior Technical Interviewer conducting a live 1-on-1 voice interview.
Job Role: ${jobPosition || "Software Engineer"}
Tech Stack / Description: ${jobDesc || "General Software Engineering"}
Experience Level: ${jobExperience || "2"} Years

Your goal is to conduct a natural, unscripted, dynamic conversational interview. 
Guidelines for your response:
1. Briefly acknowledge or give quick feedback on the candidate's last answer (1 natural sentence).
2. If their answer was incomplete or interesting, ask a quick relevant follow-up question, OR transition naturally to the next key topic for this job role.
3. Keep your spoken response natural, conversational, and concise (2 to 3 sentences maximum), suitable for text-to-speech. Do not output markdown, bullet points, or code blocks.
4. Also evaluate the last candidate response objectively for technical accuracy and communication.

Respond strictly in this JSON format:
{
  "aiSpeech": "Nice explanation of React state! Now, how do you handle asynchronous side effects like data fetching in your components?",
  "rating": 7.5,
  "feedback": "Good answer on state management, but should mention useEffect dependencies.",
  "isInterviewComplete": false
}`;

    const chatSession = createChatSession();
    
    // Construct conversation string for context
    const historyText = (conversationHistory || [])
      .map(item => `${item.sender === "ai" ? "Interviewer" : "Candidate"}: ${item.text}`)
      .join("\n");
    const previousAiQuestions = (conversationHistory || [])
      .filter(item => item.sender === "ai")
      .map(item => item.text)
      .join("\n- ");

    const fullPrompt = `${systemPrompt}

Never ask a question that is the same as, or substantially similar to, one already asked. Choose a new topic or a deeper aspect of the role. Previous interviewer prompts:
- ${previousAiQuestions || "None"}

Recent Interview Conversation History:
${historyText}

Candidate's Latest Spoken Answer:
"${lastUserAnswer}"

Generate the next conversational interviewer response:`;

    let responseText;
    let isFallbackResponse = false;
    const fallbackQuestions = [
      "What is one challenging technical problem you solved recently, and how did you approach it?",
      "How do you test and validate your work before releasing it?",
      "Tell me about a time you had to improve the performance or reliability of a system.",
      "How do you investigate a bug when the cause is not immediately obvious?",
      "How do you explain a technical tradeoff to a non-technical teammate or stakeholder?",
    ];
    const normalizeText = (text) => String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9? ]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    const extractQuestions = (text) => normalizeText(text)
      .match(/[^?]+\?/g)
      ?.map(question => question.trim()) || [];
    const normalizedPreviousQuestions = (conversationHistory || [])
      .filter(item => item.sender === "ai")
      .flatMap(item => extractQuestions(item.text));
    const nextFallbackQuestion = fallbackQuestions.find((question) => {
      const normalizedQuestion = normalizeText(question);
      return !normalizedPreviousQuestions.includes(normalizedQuestion);
    }) || fallbackQuestions[0];

    try {
      const aiResult = await chatSession.sendMessage(fullPrompt);
      responseText = aiResult.response.text();
    } catch (error) {
      const isQuotaError = error?.status === 429 || error?.message?.includes("Too Many Requests");
      if (!isQuotaError) throw error;

      console.warn("[POST /api/interviews/[id]/chat] Gemini quota exhausted; using fallback response");
      responseText = JSON.stringify({
        aiSpeech: `Thank you for that response. ${nextFallbackQuestion}`,
        rating: 6,
        feedback: "Response recorded. AI evaluation is temporarily unavailable because the generation quota has been reached.",
        isInterviewComplete: false,
      });
      isFallbackResponse = true;
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
        aiSpeech: `Thank you for that response. ${nextFallbackQuestion}`,
        rating: 6,
        feedback: "Response recorded.",
        isInterviewComplete: false
      };
    }

    const generatedQuestions = extractQuestions(chatJson.aiSpeech);
    if (generatedQuestions.some(question => normalizedPreviousQuestions.includes(question))) {
      chatJson.aiSpeech = `Thanks for explaining that. ${nextFallbackQuestion}`;
    }

    // Persist answer and evaluation record into DB if user answered something meaningful
    if (lastUserAnswer && lastUserAnswer.trim().length > 3) {
      await dbConnect();
      const userEmail = user.primaryEmailAddress?.emailAddress ?? "";
      const createdAt = new Date().toISOString().split("T")[0];

      await UserAnswer.create({
        mockIdRef: id,
        question: conversationHistory?.filter(m => m.sender === "ai")?.slice(-1)[0]?.text || "Conversational Question",
        correctAns: "Dynamic Conversational Response",
        userAns: lastUserAnswer,
        feedback: chatJson.feedback || "Evaluated during live conversational session.",
        rating: String(chatJson.rating || "6"),
        userEmail,
        createdAt,
      });
    }

    return NextResponse.json({
      aiSpeech: chatJson.aiSpeech,
      rating: chatJson.rating,
      feedback: chatJson.feedback,
      isInterviewComplete: chatJson.isInterviewComplete || false,
      degraded: isFallbackResponse,
    });

  } catch (error) {
    console.error("[POST /api/interviews/[id]/chat]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
