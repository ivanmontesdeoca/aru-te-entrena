import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AuthError } from "@/modules/auth/domain/errors";
import { getCurrentUser } from "@/modules/auth/infrastructure/current-user";

export default async function ProgresoLayout({ children }: { children: ReactNode }) {
  try { const user = await getCurrentUser(); if (user.role !== "ALUMNO") redirect("/admin"); }
  catch (error) { if (error instanceof AuthError) redirect("/login"); throw error; }
  return children;
}
