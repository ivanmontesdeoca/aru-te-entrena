import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AuthError } from "@/modules/auth/domain/errors";
import { getCurrentUser } from "@/modules/auth/infrastructure/current-user";

export default async function AlumnoLayout({ children }: { children: ReactNode }) {
  let user;
  try {
    user = await getCurrentUser();
  } catch (error) {
    if (error instanceof AuthError) redirect("/login");
    throw error;
  }
  if (user.role !== "ALUMNO") redirect("/admin");
  return children;
}
