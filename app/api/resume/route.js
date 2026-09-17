import { NextResponse } from "next/server";
import { auth, currentUser } from "@/utils/auth";
import dbConnect from "@/utils/db";
import { Resume } from "@/utils/schema";

// GET /api/resume — retrieve candidate's stored resume & AI insights
export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase();
    const resume = await Resume.findOne({ userEmail });

    if (!resume) {
      return NextResponse.json({ resume: null });
    }

    return NextResponse.json({ resume });
  } catch (error) {
    console.warn("Error fetching resume:", error);
    return NextResponse.json({ error: "Failed to fetch resume" }, { status: 500 });
  }
}

// PUT /api/resume — update candidate's extracted profile (allowing human corrections)
export async function PUT(request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase();
    const body = await request.json();

    const updated = await Resume.findOneAndUpdate(
      { userEmail },
      {
        personal: body.personal,
        professional: body.professional,
        skills: body.skills,
        experience: body.experience,
        projects: body.projects,
        education: body.education,
        certifications: body.certifications,
        achievements: body.achievements,
        insights: body.insights,
        updatedAt: new Date()
      },
      { new: true }
    );

    return NextResponse.json({ success: true, resume: updated });
  } catch (error) {
    console.warn("Error updating resume:", error);
    return NextResponse.json({ error: "Failed to update resume" }, { status: 500 });
  }
}

// DELETE /api/resume — remove candidate's resume
export async function DELETE() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase();
    await Resume.findOneAndDelete({ userEmail });

    return NextResponse.json({ success: true, message: "Resume deleted successfully" });
  } catch (error) {
    console.warn("Error deleting resume:", error);
    return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 });
  }
}
