import { NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  expiredSessionCookieOptions,
} from "@/modules/auth/infrastructure/session-cookie";
import { hasTrustedOrigin } from "@/modules/auth/infrastructure/request-origin";

export async function POST(request: Request) {
  if (!hasTrustedOrigin(request)) {
    return NextResponse.json({ error: "UNTRUSTED_ORIGIN" }, { status: 403 });
  }
  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(SESSION_COOKIE_NAME, "", expiredSessionCookieOptions());
  return response;
}
