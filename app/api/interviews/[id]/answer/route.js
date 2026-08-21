import { NextResponse } from "next/server";
import { auth, currentUser } from "@/utils/auth";
import dbConnect from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { createChatSession } from "@/utils/GeminiAIModal";
import { rateLimit } from "@/utils/rateLimit";

// POST /api/interviews/[id]/answer — evaluate answer with Gemini and save to DB
export async function POST(request, { params }) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 30 answers per 5 minutes per user
    const rl = rateLimit(`record-answer:${userId}`, { limit: 30, windowMs: 5 * 60_000 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { question, correctAns, userAns } = body;

    if (!question || !userAns) {
      return NextResponse.json({ error: "question and userAns are required" }, { status: 400 });
    }

    // Build Gemini feedback prompt for accurate, detailed scoring
    const feedbackPrompt = `You are a Senior Technical Interviewer evaluating a candidate's response.
Question Asked: "${question}"
Candidate's Answer: "${userAns}"
Ideal Model Answer: "${correctAns}"

Strictly and accurately evaluate the candidate's answer across 4 key dimensions:
1. Technical Accuracy (Is the answer factually correct and technically sound?)
2. Communication Clarity (Is the answer structured, clear, and concise?)
3. Problem Solving & Depth (Does it demonstrate real understanding or just surface keywords?)
4. Tone & Professionalism (Is it confident and articulate?)

Calculate an objective Overall Score out of 10 based on the quality of the answer. Be realistic: penalize vague, off-topic, or empty answers (give 1-4 for weak answers). Give high scores (8-10) only for accurate, detailed answers.

Respond ONLY with valid JSON in this exact structure:
{
  "rating": 7.5,
  "technicalScore": 7,
  "communicationScore": 8,
  "problemSolvingScore": 7,
  "strengths": "Clear explanation of core concept with good vocabulary.",
  "areasForImprovement": "Should mention edge cases and performance implications.",
  "feedback": "Detailed 3-4 sentence analysis explaining why this score was assigned and how to improve."
}`;

    const session = createChatSession();
    const aiResult = await session.sendMessage(feedbackPrompt);
    let responseText = aiResult.response.text();

    const cleanedResponse = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let feedbackJson;
    try {
      feedbackJson = JSON.parse(cleanedResponse);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI feedback. Please try again." },
        { status: 502 }
      );
    }

    await dbConnect();
    const userEmail = user.primaryEmailAddress?.emailAddress ?? "";
    const createdAt = new Date().toISOString().split("T")[0];

    const fullFeedbackText = typeof feedbackJson === "object"
      ? (feedbackJson.feedback || JSON.stringify(feedbackJson))
      : String(feedbackJson);

    await UserAnswer.create({
      mockIdRef: id,
      question,
      correctAns: correctAns ?? "",
      userAns,
      feedback: fullFeedbackText,
      rating: String(feedbackJson?.rating ?? "0"),
      userEmail,
      createdAt,
    });

    return NextResponse.json({
      feedback: fullFeedbackText,
      rating: feedbackJson.rating,
      details: feedbackJson,
    });
  } catch (error) {
    console.error("[POST /api/interviews/[id]/answer]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
