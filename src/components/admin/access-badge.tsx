import { StatusBadge } from "@/components/ui/status-badge";
export function AccessBadge({ active }: { active: boolean | null }) {
  const label = active === null ? "Sin acceso creado" : active ? "Activo" : "Inactivo";
  return <StatusBadge label={label} tone={active === null ? "muted" : active ? "success" : "danger"} />;
}
