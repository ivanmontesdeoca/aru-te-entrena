import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EjercicioForm } from "@/components/admin/ejercicio-form";
import { requireAdmin } from "@/modules/auth/infrastructure/current-user";
export default async function NuevoEjercicioPage(){await requireAdmin();return <main className="mx-auto max-w-4xl space-y-6 px-5 py-8"><Link className="text-sm font-semibold text-violet-700" href="/admin/ejercicios">← Volver al catálogo</Link><div><p className="text-sm font-bold uppercase tracking-widest text-violet-700">Nuevo registro</p><h1 className="text-3xl font-black">Crear ejercicio</h1><p className="text-slate-600">El identificador y el estado activo se asignan automáticamente.</p></div><Card><EjercicioForm/></Card></main>;}
