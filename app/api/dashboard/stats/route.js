export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth, currentUser } from "@/utils/auth";
import dbConnect from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";

export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = user.primaryEmailAddress?.emailAddress ?? "";
    if (!userEmail) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }

    await dbConnect();

    // 1. Fetch total interviews
    const totalInterviews = await MockInterview.countDocuments({ createdBy: userEmail });

    // 2. Fetch all user answers to calculate stats
    const userAnswers = await UserAnswer.find({ userEmail: userEmail }).lean();

    const totalQuestionsAnswered = userAnswers.length;

    let averageScore = 0;
    let highestScore = 0;
    let ratingsSum = 0;
    let validRatingsCount = 0;

    userAnswers.forEach((ans) => {
      // rating is stored as a string, e.g. "8" or "8.5" or "9/10"
      if (ans.rating) {
        // extract the numeric part if it's like "8/10"
        const cleanRatingStr = ans.rating.split("/")[0].trim();
        const num = parseFloat(cleanRatingStr);
        if (!isNaN(num)) {
          ratingsSum += num;
          validRatingsCount++;
          if (num > highestScore) {
            highestScore = num;
          }
        }
      }
    });

    if (validRatingsCount > 0) {
      averageScore = parseFloat((ratingsSum / validRatingsCount).toFixed(1));
    }

    // 3. Role breakdown
    const interviews = await MockInterview.find({ createdBy: userEmail }).select("jobPosition").lean();
    const rolesMap = {};
    interviews.forEach((item) => {
      const pos = item.jobPosition || "Unknown";
      rolesMap[pos] = (rolesMap[pos] || 0) + 1;
    });

    const rolesBreakdown = Object.entries(rolesMap).map(([role, count]) => ({
      role,
      count,
    })).sort((a, b) => b.count - a.count).slice(0, 5);

    return NextResponse.json({
      totalInterviews,
      totalQuestionsAnswered,
      averageScore,
      highestScore,
      rolesBreakdown,
    });
  } catch (error) {
    console.error("[GET /api/dashboard/stats]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
