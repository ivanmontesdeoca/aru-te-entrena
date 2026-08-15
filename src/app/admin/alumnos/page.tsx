import Link from "next/link";
import { Card } from "@/components/ui/card";
import { AccessBadge } from "@/components/admin/access-badge";
import { requireAdmin } from "@/modules/auth/infrastructure/current-user";
import { getAlumnoAdminService } from "@/modules/alumnos/infrastructure/alumno-admin-service-factory";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

export default async function AlumnosPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAdmin(); const q=(await searchParams).q?.trim()??""; const entries=await getAlumnoAdminService().list(q);
  return <main className="app-page space-y-6"><PageHeader eyebrow="Administración" title="Alumnos" description="Datos, acceso y planificación de cada alumno." actions={<Link className="inline-flex min-h-11 items-center justify-center rounded-xl bg-violet-700 px-5 py-2 font-semibold text-white" href="/admin/alumnos/nuevo">Nuevo alumno</Link>}/>
    <form className="flex gap-3"><input aria-label="Buscar alumnos" className="min-h-11 flex-1 rounded-xl border border-slate-300 bg-white px-4" defaultValue={q} name="q" placeholder="Nombre, apellido, documento o email"/><button className="rounded-lg border border-violet-700 px-4 font-semibold text-violet-700">Buscar</button></form>
    <div className="grid gap-4">{entries.length?entries.map(({alumno,access})=><Card className="flex flex-col justify-between gap-4 transition hover:border-violet-300 sm:flex-row sm:items-center" key={alumno.Alumno_ID}><div><h2 className="text-lg font-bold">{alumno.Apellido}, {alumno.Nombre}</h2><p className="mt-1 text-sm text-slate-600">{alumno.Objetivo||"Sin objetivo informado"}</p><div className="mt-3"><AccessBadge active={access?.Activo??null}/></div></div><Link className="inline-flex min-h-11 items-center justify-center rounded-xl border border-violet-700 px-4 font-bold text-violet-700" href={`/admin/alumnos/${alumno.Alumno_ID}`}>Ver ficha</Link></Card>):<EmptyState icon="👥" title="No encontramos alumnos" description={q?"Probá con otro nombre, documento o email.":"Creá el primer alumno para comenzar a planificar."}/>}</div>
  </main>;
}
