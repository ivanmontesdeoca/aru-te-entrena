import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AuthError } from "@/modules/auth/domain/errors";
import { AlumnoAdminError } from "../application/errors";

export function alumnoApiError(error: unknown) {
  if (error instanceof AuthError) return NextResponse.json({ error: error.code }, { status: error.status });
  if (error instanceof AlumnoAdminError) return NextResponse.json({ error: error.code }, { status: error.status });
  if (error instanceof ZodError) return NextResponse.json({ error: "INVALID_DATA", issues: error.flatten().fieldErrors }, { status: 400 });
  return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
}
