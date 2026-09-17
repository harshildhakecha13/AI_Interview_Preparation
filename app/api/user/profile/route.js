import { NextResponse } from "next/server";
import { auth, currentUser } from "@/utils/auth";
import dbConnect from "@/utils/db";
import { UserProfile, Resume } from "@/utils/schema";

export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase();

    let profile = await UserProfile.findOne({ userEmail });
    const resume = await Resume.findOne({ userEmail });

    if (!profile) {
      profile = await UserProfile.create({
        userEmail,
        fullName: user.username || "",
        targetRole: "Full Stack Developer",
        experienceLevel: "Mid-Level",
        preferredInterviewType: "Technical",
        skills: ["React", "Node.js", "TypeScript", "Next.js", "MongoDB"],
        targetCompanies: ["Google", "Stripe", "Amazon"],
        onboardingCompleted: false,
        readinessScore: 72
      });
    }

    return NextResponse.json({
      profile,
      hasResume: !!resume,
      resumeFileName: resume?.fileName || null,
      userName: user.username || profile.fullName || "Candidate"
    });
  } catch (error) {
    console.warn("Error fetching user profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

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

    const {
      fullName,
      targetRole,
      experienceLevel,
      preferredInterviewType,
      skills,
      targetCompanies,
      linkedIn,
      onboardingCompleted
    } = body;

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userEmail },
      {
        fullName: fullName || user.username || "",
        targetRole: targetRole || "Full Stack Developer",
        experienceLevel: experienceLevel || "Mid-Level",
        preferredInterviewType: preferredInterviewType || "Technical",
        skills: Array.isArray(skills) ? skills : [],
        targetCompanies: Array.isArray(targetCompanies) ? targetCompanies : [],
        linkedIn: linkedIn || "",
        onboardingCompleted: onboardingCompleted !== undefined ? onboardingCompleted : true,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.warn("Error updating user profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
