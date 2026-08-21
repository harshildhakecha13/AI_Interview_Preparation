export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth, currentUser } from "@/utils/auth";
import dbConnect from "@/utils/db";
import { MockInterview } from "@/utils/schema";

// GET /api/interviews/list — fetch all interviews for the currently logged-in user
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
    const result = await MockInterview.find({ createdBy: userEmail })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/interviews/list]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
