import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#ddd6fe,transparent_42%),radial-gradient(circle_at_bottom_right,#c7d2fe,transparent_38%)]" />
      <Card className="relative w-full max-w-md space-y-7 border-white/70 p-7 shadow-xl shadow-violet-950/10 sm:p-9">
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-700">{eyebrow}</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">{title}</h1>
          <p className="leading-6 text-slate-600">{description}</p>
        </div>
        {children}
      </Card>
    </main>
  );
}
