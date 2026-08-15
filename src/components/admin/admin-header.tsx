import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";

export function AdminHeader() {
  const links = [["Inicio", "/admin"], ["Alumnos", "/admin/alumnos"], ["Cobros", "/admin/cobros"], ["Ejercicios", "/admin/ejercicios"], ["Plantillas", "/admin/plantillas"], ["Rutinas", "/admin/rutinas"]] as const;
  const navigation = links.map(([label, href]) => <Link key={href} className="inline-flex min-h-11 items-center text-sm font-semibold text-slate-700 hover:text-violet-700" href={href}>{label}</Link>);
  return <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3"><Link aria-label="Ir al inicio administrativo" className="font-black text-violet-800" href="/admin">Aru te entrena</Link><nav className="hidden items-center gap-4 md:flex" aria-label="Navegación administrativa">{navigation}<LogoutButton /></nav><details className="relative md:hidden"><summary className="flex min-h-11 cursor-pointer list-none items-center rounded-lg border border-slate-300 px-3 font-semibold text-slate-700">Menú</summary><nav className="absolute right-0 z-20 mt-2 flex min-w-52 flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-xl" aria-label="Navegación administrativa móvil">{navigation}<LogoutButton /></nav></details></div></header>;
}
