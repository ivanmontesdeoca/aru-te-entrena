import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { BrandLogo } from "@/components/ui/brand-logo";

export function AdminHeader() {
  const links = [["Inicio", "/admin"], ["Alumnos", "/admin/alumnos"], ["Rutinas", "/admin/rutinas"], ["Plantillas", "/admin/plantillas"], ["Ejercicios", "/admin/ejercicios"], ["Cobros", "/admin/cobros"]] as const;
  const navigation = links.map(([label, href]) => <Link key={href} className="inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-800" href={href}>{label}</Link>);
  return <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-4 py-2.5 sm:px-5"><Link aria-label="Ir al inicio administrativo" href="/admin"><BrandLogo className="hidden w-64 md:block" priority variant="horizontal"/><span className="flex items-center gap-2 md:hidden"><BrandLogo className="w-10" priority variant="isotipo"/><span className="font-extrabold text-violet-800">Aru te entrena</span></span></Link><nav className="hidden items-center gap-1 md:flex" aria-label="Navegación administrativa">{navigation}<LogoutButton /></nav><details className="relative md:hidden"><summary aria-label="Abrir menú" className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-xl border border-slate-300 px-3 font-semibold text-slate-700"><span aria-hidden>☰</span> Menú</summary><nav className="absolute right-0 z-20 mt-2 flex min-w-56 flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-xl" aria-label="Navegación administrativa móvil">{navigation}<LogoutButton /></nav></details></div></header>;
}
