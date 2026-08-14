import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200", className)} {...props} />;
}
