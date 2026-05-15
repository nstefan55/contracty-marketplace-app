import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Always allow auth and onboarding paths through
  if (
    pathname.startsWith("/signin") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/onboarding")
  ) {
    return NextResponse.next();
  }

  // Cookie written server-side by /api/onboarding/set-role after a Google
  // user picks their role. Acts as an immediate bypass for the stale JWT
  // since next-auth beta doesn't reliably update the session cookie via update().
  if (req.cookies.get("onboarding_done")?.value) {
    const res = NextResponse.next();
    res.cookies.delete("onboarding_done");
    return res;
  }

  // Redirect authenticated users who haven't finished onboarding
  if (session?.user?.needsOnboarding) {
    return NextResponse.redirect(new URL("/onboarding/role", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico|images).*)"],
};