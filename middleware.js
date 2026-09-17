import { NextResponse } from "next/server";

const protectedPaths = ["/dashboard"];
const authPaths = ["/sign-in", "/sign-up"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));

  const token = request.cookies.get("session_token")?.value;

  let isAuthenticated = !!token;

  // Redirect unauthenticated users trying to access protected routes
  if (isProtected && !isAuthenticated) {
    const signInUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect already-authenticated users away from auth pages
  if (isAuthPage && isAuthenticated) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
