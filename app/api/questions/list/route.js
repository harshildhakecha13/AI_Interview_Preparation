export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth, currentUser } from "@/utils/auth";
import dbConnect from "@/utils/db";
import { Question } from "@/utils/schema";

export async function GET(request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json([]);
    }

    await dbConnect();
    const result = await Question.find({ createdBy: email })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/questions/list]", error);
    return NextResponse.json({ error: "Failed to fetch question list" }, { status: 500 });
  }
}
