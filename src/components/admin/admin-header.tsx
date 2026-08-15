import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";

export function AdminHeader() {
  return <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4"><Link className="font-black text-violet-800" href="/admin">Aru te entrena</Link><nav className="flex flex-wrap items-center gap-3"><Link className="text-sm font-semibold text-slate-700 hover:text-violet-700" href="/admin/alumnos">Alumnos</Link><Link className="text-sm font-semibold text-slate-700 hover:text-violet-700" href="/admin/ejercicios">Ejercicios</Link><LogoutButton /></nav></div></header>;
}
