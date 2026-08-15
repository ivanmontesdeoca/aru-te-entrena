import Link from "next/link";
import { Card } from "@/components/ui/card";
import { AlumnoForm } from "@/components/admin/alumno-form";
import { requireAdmin } from "@/modules/auth/infrastructure/current-user";

export default async function NuevoAlumnoPage() { await requireAdmin(); return <main className="mx-auto max-w-4xl space-y-6 px-5 py-8"><Link className="text-sm font-semibold text-violet-700" href="/admin/alumnos">← Volver a alumnos</Link><div><p className="text-sm font-bold uppercase tracking-widest text-violet-700">Nuevo registro</p><h1 className="text-3xl font-black">Crear alumno</h1><p className="text-slate-600">El acceso a la aplicación se crea después, únicamente si lo habilitás.</p></div><Card><AlumnoForm/></Card></main>; }
