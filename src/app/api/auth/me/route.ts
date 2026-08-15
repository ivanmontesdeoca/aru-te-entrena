import { NextResponse } from "next/server";
import { AuthError } from "@/modules/auth/domain/errors";
import { getCurrentUser } from "@/modules/auth/infrastructure/current-user";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({
      email: user.email,
      role: user.role,
      alumnoId: user.role === "ALUMNO" ? user.alumnoId : null,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.code }, { status: error.status });
    }
    return NextResponse.json({ error: "AUTH_CHECK_FAILED" }, { status: 500 });
  }
}
