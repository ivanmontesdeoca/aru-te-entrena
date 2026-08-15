import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { SESSION_DURATION_MS } from "../application/auth-service";

export const SESSION_COOKIE_NAME = "aru_session";

export function sessionCookieOptions(): Partial<ResponseCookie> {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_DURATION_MS / 1000),
  };
}

export function expiredSessionCookieOptions(): Partial<ResponseCookie> {
  return {
    ...sessionCookieOptions(),
    maxAge: 0,
    expires: new Date(0),
  };
}
