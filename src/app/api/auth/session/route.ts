import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError } from "@/modules/auth/domain/errors";
import { createAuthService } from "@/modules/auth/infrastructure/auth-service-factory";
import {
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from "@/modules/auth/infrastructure/session-cookie";
import { hasTrustedOrigin } from "@/modules/auth/infrastructure/request-origin";

const requestSchema = z.object({ idToken: z.string().min(1) });

export async function POST(request: Request) {
  if (!hasTrustedOrigin(request)) {
    return NextResponse.json({ error: "UNTRUSTED_ORIGIN" }, { status: 403 });
  }
  try {
    const { idToken } = requestSchema.parse(await request.json());
    const { cookie, user } = await createAuthService().createSession(idToken);
    const response = NextResponse.json({ role: user.role });
    response.cookies.set(SESSION_COOKIE_NAME, cookie, sessionCookieOptions());
    return response;
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.code }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
    }
    return NextResponse.json({ error: "SESSION_CREATION_FAILED" }, { status: 500 });
  }
}
