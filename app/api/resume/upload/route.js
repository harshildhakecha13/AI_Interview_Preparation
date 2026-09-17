import { NextResponse } from "next/server";
import { auth, currentUser } from "@/utils/auth";
import dbConnect from "@/utils/db";
import { Resume, UserProfile } from "@/utils/schema";
import { ai } from "@/utils/GeminiAIModal";

export const maxDuration = 60; // Allow sufficient time for AI resume parsing

export async function POST(request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase();
    const formData = await request.formData();
    const file = formData.get("file");
    const textOverride = formData.get("text");

    let contents = [];
    let fileName = "resume.txt";
    let fileSize = "";

    const extractionPrompt = `You are an elite Executive Technical Recruiter and Resume Intelligence AI.
Analyze the provided resume with extreme precision and depth.

Extract and structure ALL information into a valid JSON object matching this schema:
{
  "personal": {
    "name": "Candidate Name",
    "email": "email@example.com",
    "phone": "phone number",
    "location": "City, Country"
  },
  "professional": {
    "summary": "2-3 sentence executive summary",
    "currentRole": "Current or most recent job title",
    "totalExperience": "e.g. 4 Years",
    "previousCompanies": ["Company A", "Company B"],
    "jobTitles": ["Software Engineer", "Senior Developer"]
  },
  "skills": {
    "languages": ["JavaScript", "TypeScript", "Python"],
    "frameworks": ["React", "Next.js", "Express", "Node.js"],
    "databases": ["MongoDB", "PostgreSQL", "Redis"],
    "cloud": ["AWS", "Google Cloud"],
    "devops": ["Docker", "Kubernetes", "CI/CD", "Git"],
    "tools": ["Jira", "Webpack", "Tailwind CSS"]
  },
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "duration": "e.g. Jan 2022 - Present",
      "responsibilities": ["Led frontend redesign", "Mentored 3 juniors"],
      "achievements": ["Boosted conversion by 28%"]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "technologies": ["React", "Node.js"],
      "description": "Brief project overview",
      "responsibilities": "What candidate specifically did",
      "results": "Outcome or metrics achieved"
    }
  ],
  "education": [
    {
      "degree": "B.S. in Computer Science",
      "institution": "University Name",
      "year": "2021"
    }
  ],
  "certifications": ["AWS Solutions Architect", "CKA"],
  "achievements": ["Hackathon Winner 2023"],
  "insights": {
    "strengths": [
      "Strong full-stack architecture depth with modern JavaScript ecosystem",
      "Clear metrics-driven project impact"
    ],
    "weakAreas": [
      "Limited mention of automated testing or unit testing coverage",
      "Could elaborate more on system scaling under high concurrency"
    ],
    "importantTechnologies": ["React", "Node.js", "TypeScript", "AWS"],
    "relevantProjects": ["E-Commerce Microservices", "Real-Time Chat"],
    "relevantExperience": ["Full Stack Developer at Tech Corp"],
    "interviewWorthyClaims": [
      {
        "claim": "Built API handling 10,000 requests/minute",
        "warning": "AI interviewer may drill down into caching, load balancing, and concurrency bottlenecks."
      },
      {
        "claim": "Reduced latency by 45% using Redis caching",
        "warning": "Expect questions on cache invalidation strategies and eviction policies."
      }
    ]
  }
}

Return strictly valid JSON only. Do not wrap in markdown or backticks.`;

    if (file && typeof file === "object" && file.size > 0) {
      fileName = file.name || "resume.pdf";
      fileSize = `${(file.size / 1024).toFixed(1)} KB`;
      const arrayBuffer = await file.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString("base64");
      const mimeType = file.type || (fileName.endsWith(".pdf") ? "application/pdf" : "text/plain");

      if (mimeType === "application/pdf") {
        contents = [
          {
            inlineData: {
              mimeType: "application/pdf",
              data: base64Data
            }
          },
          extractionPrompt
        ];
      } else {
        const textContent = Buffer.from(arrayBuffer).toString("utf-8");
        contents = [
          `Resume Document Content:\n${textContent}\n\n${extractionPrompt}`
        ];
      }
    } else if (textOverride && textOverride.trim()) {
      fileName = "Pasted_Resume.txt";
      fileSize = `${(textOverride.length / 1024).toFixed(1)} KB`;
      contents = [
        `Resume Text Content:\n${textOverride}\n\n${extractionPrompt}`
      ];
    } else {
      return NextResponse.json({ error: "Please upload a resume file or paste resume text" }, { status: 400 });
    }

    // Call Gemini to parse and extract resume
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents
    });

    let rawText = response.text || "";
    const cleanJson = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let extractedData;
    try {
      extractedData = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.warn("JSON Parse Error on Resume Extract:", parseErr);
      return NextResponse.json({ error: "Failed to parse structured resume data. Please try again." }, { status: 502 });
    }

    await dbConnect();

    // Store or update in MongoDB
    const resumeDoc = await Resume.findOneAndUpdate(
      { userEmail },
      {
        userEmail,
        fileName,
        fileSize,
        rawText: textOverride || fileName,
        personal: extractedData.personal || {},
        professional: extractedData.professional || {},
        skills: extractedData.skills || {},
        experience: extractedData.experience || [],
        projects: extractedData.projects || [],
        education: extractedData.education || [],
        certifications: extractedData.certifications || [],
        achievements: extractedData.achievements || [],
        insights: extractedData.insights || {},
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // Update UserProfile skills & role if empty
    if (extractedData.professional?.currentRole) {
      await UserProfile.findOneAndUpdate(
        { userEmail },
        {
          targetRole: extractedData.professional.currentRole,
          fullName: extractedData.personal?.name || user.username || "",
          $addToSet: {
            skills: { $each: [...(extractedData.skills?.languages || []), ...(extractedData.skills?.frameworks || [])] }
          }
        }
      );
    }

    return NextResponse.json({
      success: true,
      resume: resumeDoc
    });

  } catch (error) {
    console.warn("Resume upload error:", error);
    return NextResponse.json({ error: error?.message || "Failed to process resume" }, { status: 500 });
  }
}
