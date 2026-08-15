import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
export function AlumnoHeader() { return <header className="border-b border-violet-100 bg-white/95"><div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3"><Link className="font-black text-violet-800" href="/entrenamientos">Aru te entrena</Link><nav className="flex items-center gap-3" aria-label="Navegación del alumno"><Link className="text-sm font-semibold text-slate-700" href="/entrenamientos">Mis entrenamientos</Link><LogoutButton /></nav></div></header>; }
