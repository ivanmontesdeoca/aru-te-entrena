import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import type { Role } from "@/modules/shared/domain/primitives";
import type { AuthenticatedUser } from "../domain/authenticated-user";
import { AuthError } from "../domain/errors";
import { createAuthService } from "./auth-service-factory";
import { SESSION_COOKIE_NAME } from "./session-cookie";

export const getCurrentUser = cache(async (): Promise<AuthenticatedUser> => {
  const cookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value ?? "";
  return createAuthService().resolveSession(cookie);
});

export async function getOptionalCurrentUser(): Promise<AuthenticatedUser | null> {
  try {
    return await getCurrentUser();
  } catch (error) {
    if (error instanceof AuthError) return null;
    throw error;
  }
}

export async function requireRole(role: Role): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();
  if (user.role !== role) throw new AuthError("ROLE_FORBIDDEN", 403);
  return user;
}

export function requireAdmin(): Promise<AuthenticatedUser> {
  return requireRole("ADMIN");
}

export function requireAlumno(): Promise<AuthenticatedUser> {
  return requireRole("ALUMNO");
}

export async function getAuthenticatedAlumnoId(): Promise<string> {
  const user = await requireAlumno();
  if (!user.alumnoId) throw new AuthError("ALUMNO_NOT_LINKED", 403);
  return user.alumnoId;
}
