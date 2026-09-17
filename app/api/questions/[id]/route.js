import { NextResponse } from "next/server";
import { auth } from "@/utils/auth";
import dbConnect from "@/utils/db";
import { Question } from "@/utils/schema";

export async function GET(request, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await dbConnect();
    const result = await Question.findOne({ mockId: id }).lean();

    if (!result) {
      return NextResponse.json({ error: "Questions not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(`[GET /api/questions/${params.id}]`, error);
    return NextResponse.json({ error: "Failed to fetch questions details" }, { status: 500 });
  }
}
