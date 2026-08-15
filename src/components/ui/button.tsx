import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Button({ className, type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cn("inline-flex min-h-11 items-center justify-center rounded-xl bg-violet-700 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:-translate-y-px hover:bg-violet-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0", className)}
      {...props}
    />
  );
}
