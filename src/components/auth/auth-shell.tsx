import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { BrandLogo } from "@/components/ui/brand-logo";

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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(105,170,162,.2),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(241,179,130,.18),transparent_38%)]" />
      <Card className="relative min-w-0 w-full max-w-md space-y-6 overflow-hidden border-white/80 p-6 shadow-xl shadow-violet-950/10 sm:p-9">
        <BrandLogo className="mx-auto w-full max-w-64" priority variant="vertical" />
        <div className="space-y-3">
          <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-violet-700">{eyebrow}</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">{title}</h1>
          <p className="leading-6 text-slate-600">{description}</p>
        </div>
        {children}
      </Card>
    </main>
  );
}
