import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div className="max-w-2xl space-y-1">{eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}<h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>{description ? <p className="text-slate-600">{description}</p> : null}</div>{actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}</header>;
}
