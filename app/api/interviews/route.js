import { NextResponse } from "next/server";
import { auth, currentUser } from "@/utils/auth";
import dbConnect from "@/utils/db";
import { MockInterview, Resume } from "@/utils/schema";
import { createChatSession } from "@/utils/GeminiAIModal";
import { rateLimit } from "@/utils/rateLimit";
import { v4 as uuidv4 } from "uuid";

// POST /api/interviews — generate personalized questions via Gemini and save interview
export async function POST(request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 10 new interviews per minute per user
    const rl = rateLimit(`create-interview:${userId}`, { limit: 10, windowMs: 60_000 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before creating another interview." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const body = await request.json();
    const {
      jobPosition,
      jobDesc,
      jobExperience,
      interviewType = "Technical",
      difficulty = "Medium",
      questionsCount = 5,
      duration = "20 min",
      resumeUsed = true,
      jdUsed = false,
      jobDescriptionFull = "",
      voiceEnabled = true,
      cameraEnabled = true
    } = body;

    // Validate
    if (!jobPosition?.trim() || !jobDesc?.trim() || !jobExperience?.toString().trim()) {
      return NextResponse.json({ error: "Job role, description/tech stack, and experience are required" }, { status: 400 });
    }
    const expNum = parseInt(jobExperience);
    if (isNaN(expNum) || expNum < 0 || expNum > 50) {
      return NextResponse.json(
        { error: "Years of experience must be between 0 and 50" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitize = (str) =>
      str ? str.replace(/[<>{}]/g, "").trim().substring(0, 4000) : "";
    const position = sanitize(jobPosition);
    const description = sanitize(jobDesc);
    const experience = sanitize(String(jobExperience));
    const fullJd = sanitize(jobDescriptionFull);

    await dbConnect();
    const userEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase();

    // Fetch candidate resume if available
    let resumeContext = "";
    if (resumeUsed) {
      const resume = await Resume.findOne({ userEmail });
      if (resume) {
        resumeContext = `
CANDIDATE RESUME SUMMARY:
Name: ${resume.personal?.name || user.username}
Current Role: ${resume.professional?.currentRole || position}
Years of Experience: ${resume.professional?.totalExperience || experience}
Skills: ${JSON.stringify(resume.skills || {})}
Recent Projects: ${JSON.stringify((resume.projects || []).slice(0, 3))}
Recent Experience: ${JSON.stringify((resume.experience || []).slice(0, 2))}
Interview-Worthy Claims: ${JSON.stringify((resume.insights?.interviewWorthyClaims || []).map(c => c.claim))}
`;
      }
    }

    const totalQuestions = Math.min(Math.max(parseInt(questionsCount) || 5, 3), 15);

    // Dynamic prompt with Resume + JD + Difficulty + Interview Type
    const prompt = `You are a Principal Hiring Engineer and Director of Talent conducting an elite mock interview.
Target Job Position: ${position}
Tech Stack / Description: ${description}
${fullJd ? `Full Job Description Requirements:\n${fullJd}\n` : ""}
Experience Level: ${experience} Years
Interview Track: ${interviewType} (e.g. Technical, Behavioral, System Design, Coding, HR, Mixed)
Interview Difficulty: ${difficulty} (Easy, Medium, Hard, Expert)
${resumeContext ? `${resumeContext}\nCRITICAL INSTRUCTION: You have read the candidate's resume above! Formulate questions directly targeting their actual claimed projects, technologies, and achievements. Instead of asking basic textbook questions (e.g. "What is React?"), ask realistic, senior-level situational questions (e.g. "In your e-commerce project with React and Node, how did you architect state synchronization and caching?").` : "Formulate realistic, high-signal engineering interview questions reflecting this seniority and difficulty level."}

Generate exactly ${totalQuestions} interview questions and ideal answers.
Provide a valid JSON array with this exact schema:
[
  {
    "Question": "The specific question text here?",
    "Answer": "A comprehensive, high-standard answer outlining key concepts, trade-offs, and expected candidate depth.",
    "category": "${interviewType}",
    "topic": "e.g. System Scalability / Frontend State / Concurrency"
  }
]

Do NOT return markdown backticks or commentary. Only return the raw JSON array.`;

    const session = createChatSession();
    const aiResult = await session.sendMessage({ message: prompt });
    let responseText = aiResult.text;

    // Clean and validate JSON
    const cleanedResponse = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .replace(/^\s*[\r\n]/gm, "")
      .trim();

    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(cleanedResponse);
    } catch (parseErr) {
      console.warn("AI JSON Parse Error:", parseErr, cleanedResponse);
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 502 }
      );
    }

    if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      return NextResponse.json(
        { error: "Invalid AI response format. Please try again." },
        { status: 502 }
      );
    }

    const mockId = uuidv4();
    const createdAt = new Date().toISOString().split("T")[0];

    const mockInterview = await MockInterview.create({
      mockId,
      jsonMockResp: cleanedResponse,
      jobPosition: position,
      jobDesc: description,
      jobExperience: experience,
      createdBy: userEmail,
      createdAt,
      interviewType,
      difficulty,
      duration,
      questionsCount: parsedQuestions.length,
      voiceEnabled: !!voiceEnabled,
      cameraEnabled: !!cameraEnabled,
      resumeUsed: !!resumeContext,
      jdUsed: !!fullJd
    });

    return NextResponse.json({ mockId, interview: mockInterview }, { status: 201 });
  } catch (error) {
    console.warn("[POST /api/interviews]", error);
    const errMessage = error?.message || String(error);
    if (errMessage.includes("API key not valid") || errMessage.includes("API_KEY_INVALID") || errMessage.includes("API key")) {
      return NextResponse.json(
        { error: "Your Gemini API Key is invalid or has not been configured yet. Please configure GEMINI_API_KEY in the environment settings." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error?.message || "Failed to create interview. Please try again." },
      { status: 500 }
    );
  }
}
