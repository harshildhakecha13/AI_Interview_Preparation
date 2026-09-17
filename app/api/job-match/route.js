import { NextResponse } from "next/server";
import { auth, currentUser } from "@/utils/auth";
import dbConnect from "@/utils/db";
import { JobMatch, Resume } from "@/utils/schema";
import { ai } from "@/utils/GeminiAIModal";

export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase();
    const matches = await JobMatch.find({ userEmail }).sort({ createdAt: -1 }).limit(10);

    return NextResponse.json({ matches });
  } catch (error) {
    console.warn("Error getting job matches:", error);
    return NextResponse.json({ error: "Failed to fetch job matches" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase();
    const body = await request.json();
    const { jobTitle, company, rawJD } = body;

    if (!rawJD || rawJD.trim().length < 20) {
      return NextResponse.json({ error: "Please provide a valid Job Description" }, { status: 400 });
    }

    await dbConnect();
    const resume = await Resume.findOne({ userEmail });

    // Format candidate's resume context for comparison
    const candidateSummary = resume ? `
Candidate Name: ${resume.personal?.name || user.username}
Current Role: ${resume.professional?.currentRole || "Engineer"}
Experience: ${resume.professional?.totalExperience || "Not specified"}
Skills: ${JSON.stringify(resume.skills || {})}
Recent Experience: ${JSON.stringify((resume.experience || []).slice(0, 3))}
Projects: ${JSON.stringify((resume.projects || []).slice(0, 3))}
` : "Candidate has not uploaded a resume yet. Evaluate based on standard general profile.";

    const prompt = `You are an expert Technical Hiring Manager and Career Intelligence AI.
Analyze this Job Description and compare it against the Candidate's Resume.

Job Title: ${jobTitle || "Software Engineer"}
Company: ${company || "Target Company"}
Job Description:
"""
${rawJD.substring(0, 4000)}
"""

Candidate Resume Summary:
"""
${candidateSummary}
"""

Perform a deep architectural analysis and provide a valid JSON object matching this schema:
{
  "analysis": {
    "requiredSkills": ["TypeScript", "Next.js", "Docker"],
    "preferredSkills": ["GraphQL", "Kubernetes"],
    "experienceReq": "3+ years in full stack web development",
    "responsibilities": ["Design scalable REST APIs", "Lead frontend architecture"],
    "technologies": ["React", "Node.js", "PostgreSQL", "AWS"],
    "domainKnowledge": ["Distributed Systems", "Web Performance"],
    "seniority": "Senior / Lead"
  },
  "match": {
    "overallMatch": 82,
    "skillsMatch": 85,
    "experienceMatch": 80,
    "technologyMatch": 88,
    "responsibilityMatch": 75,
    "missingSkills": ["GraphQL", "Kubernetes"],
    "strongMatches": ["React", "Node.js", "TypeScript", "REST APIs"],
    "interviewTopics": [
      "Deep dive into microservices communication patterns",
      "Explain state management tradeoffs in large React apps",
      "Scaling Node.js backend under high concurrent traffic"
    ]
  }
}

Return strictly valid JSON only. All match percentages must be realistic integers between 30 and 98.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [prompt]
    });

    const cleanJson = (response.text || "")
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleanJson);

    const matchDoc = await JobMatch.create({
      userEmail,
      jobTitle: jobTitle || parsed.analysis?.seniority || "Target Role",
      company: company || "",
      rawJD,
      analysis: parsed.analysis || {},
      match: parsed.match || {}
    });

    return NextResponse.json({
      success: true,
      jobMatch: matchDoc
    });

  } catch (error) {
    console.warn("Job Match error:", error);
    return NextResponse.json({ error: error?.message || "Failed to analyze Job Description" }, { status: 500 });
  }
}
