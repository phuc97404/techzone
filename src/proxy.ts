import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isApiAdminRoute = req.nextUrl.pathname.startsWith("/api/admin");

  if (isApiAuthRoute) return NextResponse.next();

  if (isAdminRoute || isApiAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL(`/login?callbackUrl=${req.nextUrl.pathname}`, req.nextUrl));
    }

    if (req.auth?.user?.role !== "ADMIN") {
      if (isApiAdminRoute) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized access" }), { status: 403, headers: { 'Content-Type': 'application/json' } });
      }
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
