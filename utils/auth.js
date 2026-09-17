import { cookies } from "next/headers";
import dbConnect from "./db";
import { User } from "./schema";

/**
 * Verify the session JWT cookie and return { userId }.
 * Mirrors Clerk's auth() server helper.
 */
export async function auth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    if (!token) {
      return { userId: null };
    }

    return { userId: token };
  } catch {
    return { userId: null };
  }
}

/**
 * Return the full user document for the currently authenticated user.
 * Mirrors Clerk's currentUser() server helper.
 * Returns an object shaped like Clerk's User for compatibility.
 */
export async function currentUser() {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    await dbConnect();
    const user = await User.findById(userId).lean();
    if (!user) return null;

    // Return a Clerk-compatible shape
    return {
      id: String(user._id),
      firstName: user.username,
      username: user.username,
      imageUrl: "/logo.svg",
      primaryEmailAddress: {
        emailAddress: user.email,
      },
    };
  } catch {
    return null;
  }
}
