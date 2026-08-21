import { NextResponse } from "next/server";
import { auth, currentUser } from "@/utils/auth";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ user: null });
    }

    const user = await currentUser();
    return NextResponse.json({ user });
  } catch (error) {
    console.error("[GET /api/auth/session]", error);
    return NextResponse.json({ user: null });
  }
}
