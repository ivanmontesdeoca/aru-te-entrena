import Link from "next/link";
import { AlumnoHeader } from "@/components/alumno/alumno-header";
import { ProgressMetrics } from "@/components/progreso/progress-metrics";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getAuthenticatedAlumnoId } from "@/modules/auth/infrastructure/current-user";
import { getProgresoService } from "@/modules/progresos/infrastructure/progreso-service-factory";

export default async function ProgresoPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const alumnoId = await getAuthenticatedAlumnoId(); const { q = "" } = await searchParams;
  const rows = await getProgresoService().listForAlumno(alumnoId); const groups = new Map<string, typeof rows>();
  for (const row of rows) { const current=groups.get(row.record.Catalogo_ID)??[]; current.push(row); groups.set(row.record.Catalogo_ID,current); }
  const entries=[...groups.values()].filter(group=>(group[0].catalog?.Ejercicio??"").toLocaleLowerCase("es").includes(q.trim().toLocaleLowerCase("es")));
  return <><AlumnoHeader/><main className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6 sm:py-10"><header><p className="eyebrow">Mi progreso</p><h1 className="text-3xl font-extrabold">Todas tus marcas</h1></header><form><input className="min-h-11 w-full rounded-xl border border-slate-300 px-4" defaultValue={q} name="q" placeholder="Buscar ejercicio"/></form>{entries.length?<div className="grid gap-3 sm:grid-cols-2">{entries.map(group=>{const latest=group[0],href=latest.sessionId?`/entrenamientos/${latest.sessionId}/ejercicios/${latest.record.Rutina_Ejercicio_ID}/historial`:"/entrenamientos";return <Card className="space-y-2" key={latest.record.Catalogo_ID}><h2 className="text-lg font-extrabold">{latest.catalog?.Ejercicio??"Ejercicio"}</h2><p><strong>Última marca:</strong> <ProgressMetrics record={latest.record}/></p><p className="text-sm text-slate-500">{new Date(latest.record.Fecha_Registro).toLocaleDateString("es-AR")} · {group.length} {group.length===1?"registro":"registros"}</p><Link className="brand-link inline-flex min-h-11 items-center font-bold" href={href}>Ver historial →</Link></Card>})}</div>:<EmptyState icon="↗" title="Sin marcas" description="Todavía no hay registros que coincidan."/>}</main></>;
}
