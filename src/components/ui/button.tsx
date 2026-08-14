import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Button({ className, type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cn("inline-flex min-h-11 items-center justify-center rounded-lg bg-violet-700 px-4 py-2 font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50", className)}
      {...props}
    />
  );
}
