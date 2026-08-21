import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import dbConnect from "@/utils/db";
import { User } from "@/utils/schema";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request) {
  try {
    await dbConnect();

    const { username, email, password } = await request.json();

    if (!username?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Check if email is already registered
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
    });

    // Create a JWT session token (24-hour expiry)
    const token = await new SignJWT({ userId: String(user._id), email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    const response = NextResponse.json(
      { success: true, user: { id: String(user._id), username: user.username, email: user.email } },
      { status: 201 }
    );

    response.cookies.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[POST /api/auth/signup]", error);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
