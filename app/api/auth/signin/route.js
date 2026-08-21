import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import dbConnect from "@/utils/db";
import { User } from "@/utils/schema";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    if (!email?.trim() || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Create a JWT session token (24-hour expiry)
    const token = await new SignJWT({ userId: String(user._id), email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      success: true,
      user: { id: String(user._id), username: user.username, email: user.email },
    });

    response.cookies.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[POST /api/auth/signin]", error);
    return NextResponse.json({ error: "Sign in failed. Please try again." }, { status: 500 });
  }
}
