import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function EmptyState({ icon = "○", title, description, action }: { icon?: string; title: string; description: string; action?: ReactNode }) {
  return <Card className="flex min-h-48 flex-col items-center justify-center gap-3 border-dashed text-center"><span aria-hidden className="text-3xl text-violet-700">{icon}</span><div><h2 className="text-lg font-bold">{title}</h2><p className="mt-1 max-w-lg text-sm text-slate-600">{description}</p></div>{action}</Card>;
}
