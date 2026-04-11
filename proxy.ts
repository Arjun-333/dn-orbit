import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req: NextRequest & { auth: any }) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isOnboardingRoute = nextUrl.pathname === "/onboarding";

  // 1. Admin Protection
  if (isAdminRoute) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));
    if (user?.role !== "admin") return NextResponse.redirect(new URL("/", nextUrl));
  }

  // 2. Dashboard Protection
  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // 3. Onboarding Redirect
  if (isLoggedIn && !user?.usn) {
    if (!isOnboardingRoute && !nextUrl.pathname.startsWith("/api")) {
      return NextResponse.redirect(new URL("/onboarding", nextUrl));
    }
  }

  // 4. Onboarding Complete Check
  if (isLoggedIn && user?.usn && isOnboardingRoute) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};