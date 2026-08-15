import { cn } from "@/lib/cn";

export function StatusBadge({ label, tone = "muted" }: { label: string; tone?: "success" | "warning" | "danger" | "muted" }) {
  return <span className={cn("status-pill", `status-${tone}`)}>{label}</span>;
}
