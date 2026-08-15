export function AccessBadge({ active }: { active: boolean | null }) {
  const label = active === null ? "Sin acceso creado" : active ? "Activo" : "Inactivo";
  const style = active === null ? "bg-slate-100 text-slate-700" : active ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800";
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${style}`}>{label}</span>;
}
