import Link from "next/link";
import { Card } from "@/components/ui/card";
import { AccessBadge } from "@/components/admin/access-badge";
import { requireAdmin } from "@/modules/auth/infrastructure/current-user";
import { getAlumnoAdminService } from "@/modules/alumnos/infrastructure/alumno-admin-service-factory";

export default async function AlumnosPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAdmin(); const q=(await searchParams).q?.trim()??""; const entries=await getAlumnoAdminService().list(q);
  return <main className="mx-auto max-w-6xl space-y-6 px-5 py-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-widest text-violet-700">Administración</p><h1 className="text-3xl font-black">Alumnos</h1></div><Link className="inline-flex min-h-11 items-center justify-center rounded-lg bg-violet-700 px-4 py-2 font-semibold text-white" href="/admin/alumnos/nuevo">Nuevo alumno</Link></div>
    <form className="flex gap-3"><input aria-label="Buscar alumnos" className="min-h-11 flex-1 rounded-xl border border-slate-300 bg-white px-4" defaultValue={q} name="q" placeholder="Nombre, apellido, documento o email"/><button className="rounded-lg border border-violet-700 px-4 font-semibold text-violet-700">Buscar</button></form>
    <div className="grid gap-4">{entries.length?entries.map(({alumno,access})=><Link href={`/admin/alumnos/${alumno.Alumno_ID}`} key={alumno.Alumno_ID}><Card className="flex flex-col justify-between gap-3 transition hover:border-violet-300 sm:flex-row sm:items-center"><div><h2 className="font-bold">{alumno.Apellido}, {alumno.Nombre}</h2><p className="text-sm text-slate-600">DNI {alumno.Documento} · {alumno.Mail}</p></div><AccessBadge active={access?.Activo??null}/></Card></Link>):<Card><p className="text-slate-600">No se encontraron alumnos.</p></Card>}</div>
  </main>;
}
