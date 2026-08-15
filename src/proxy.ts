import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/modules/auth/infrastructure/session-cookie";

export function proxy(request: NextRequest) {
  if (!request.cookies.has(SESSION_COOKIE_NAME)) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/entrenamientos/:path*", "/api/admin/:path*", "/api/alumno/:path*"],
};
