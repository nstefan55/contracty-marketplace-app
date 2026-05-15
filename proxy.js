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
  // user picks their role. Acts as a bypass while the JWT is still stale.
  // Only consumed once the JWT itself reflects needsOnboarding: false so
  // it survives multiple requests until update() has propagated.
  if (req.cookies.get("onboarding_done")?.value) {
    const res = NextResponse.next();
    if (!session?.user?.needsOnboarding) {
      res.cookies.delete("onboarding_done");
    }
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