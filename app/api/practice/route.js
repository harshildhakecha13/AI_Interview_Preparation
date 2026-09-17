import { NextResponse } from "next/server";
import { auth, currentUser } from "@/utils/auth";
import dbConnect from "@/utils/db";
import { UserAnswer, MockInterview, SavedQuestion, Resume } from "@/utils/schema";

export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase();

    // Fetch user answers to detect weak areas
    const answers = await UserAnswer.find({ userEmail }).sort({ _id: -1 }).limit(30);
    const resume = await Resume.findOne({ userEmail });
    const savedQuestions = await SavedQuestion.find({ userEmail }).sort({ createdAt: -1 });

    // Aggregate weak areas
    const weakAnswers = answers.filter(a => {
      const r = parseFloat(a.rating);
      return !isNaN(r) && r < 7.5;
    });

    // Default practice modules tailored to modern software roles
    const practiceModules = [
      {
        id: "sys-design",
        title: "System Design & Distributed Systems",
        category: "System Design",
        questionsCount: 8,
        difficulty: "Hard",
        description: "Practice microservices, message queues, distributed caching, and database partitioning under high concurrency.",
        skills: ["Microservices", "Redis", "Kafka", "PostgreSQL Sharding"],
        reason: weakAnswers.some(a => (a.question || "").toLowerCase().includes("design") || (a.question || "").toLowerCase().includes("scale"))
          ? "Repeated low score in system scalability questions."
          : "Essential for senior technical readiness."
      },
      {
        id: "cloud-aws",
        title: "Cloud Infrastructure & AWS Resilience",
        category: "Technical",
        questionsCount: 6,
        difficulty: "Medium",
        description: "Defend your cloud choices: VPC setup, serverless vs containers, CI/CD pipelines, and disaster recovery.",
        skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
        reason: resume?.insights?.weakAreas?.[0] || "Identified as a high-value interview topic for your target role."
      },
      {
        id: "perf-scaling",
        title: "Concurrency & API Performance",
        category: "Coding & Architecture",
        questionsCount: 7,
        difficulty: "Hard",
        description: "Handling bottlenecks, thread pool starvation, event loop lag, and database indexing strategies.",
        skills: ["Node.js", "MongoDB Indexing", "Connection Pooling"],
        reason: "Matches claims in your extracted resume projects."
      },
      {
        id: "behavioral-leadership",
        title: "Behavioral & Conflict Resolution (STAR)",
        category: "Behavioral",
        questionsCount: 5,
        difficulty: "Medium",
        description: "Deliver crisp STAR responses on architectural disagreements, tight deadlines, and cross-functional leadership.",
        skills: ["STAR Method", "Engineering Leadership", "Stakeholder Communication"],
        reason: "Critical 15-20% weight in comprehensive interview loops."
      }
    ];

    return NextResponse.json({
      practiceModules,
      savedQuestions,
      totalSaved: savedQuestions.length,
      weakQuestionsCount: weakAnswers.length
    });
  } catch (error) {
    console.warn("Practice API error:", error);
    return NextResponse.json({ error: "Failed to load practice data" }, { status: 500 });
  }
}

// POST /api/practice — save or remove question from personal library
export async function POST(request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase();
    const body = await request.json();

    const { action, question, category, difficulty, technology, idealAnswer } = body;

    if (action === "remove") {
      await SavedQuestion.findOneAndDelete({ userEmail, question });
      return NextResponse.json({ success: true, removed: true });
    }

    const saved = await SavedQuestion.findOneAndUpdate(
      { userEmail, question },
      {
        userEmail,
        question,
        category: category || "Technical",
        difficulty: difficulty || "Medium",
        technology: technology || "General",
        idealAnswer: idealAnswer || "",
        createdAt: new Date()
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, savedQuestion: saved });
  } catch (error) {
    console.warn("Save question error:", error);
    return NextResponse.json({ error: "Failed to save question" }, { status: 500 });
  }
}
