import Link from "next/link";
import { AlumnoHeader } from "@/components/alumno/alumno-header";
import { ProgressForm } from "@/components/progreso/progress-form";
import { ProgressMetrics } from "@/components/progreso/progress-metrics";
import { Card } from "@/components/ui/card";
import { getAuthenticatedAlumnoId } from "@/modules/auth/infrastructure/current-user";
import { getProgresoService } from "@/modules/progresos/infrastructure/progreso-service-factory";
export default async function HistorialPage({ params }: { params: Promise<{ rutinaId: string; rutinaEjercicioId: string }> }) { const alumnoId = await getAuthenticatedAlumnoId(); const { rutinaId, rutinaEjercicioId } = await params; const history = await getProgresoService().historyForItem(alumnoId, rutinaEjercicioId); return <><AlumnoHeader/><main className="mx-auto max-w-3xl space-y-6 px-4 py-6"><Link className="font-bold text-violet-700" href={`/entrenamientos/${rutinaId}`}>← Volver al entrenamiento</Link><div><p className="text-sm font-bold uppercase tracking-widest text-violet-700">Mi progreso</p><h1 className="text-3xl font-black">Historial del ejercicio</h1></div>{!history.length ? <Card>Todavía no registraste una marca para este ejercicio.</Card> : history.map((record) => <Card className="space-y-3" key={record.Registro_ID}><p className="font-bold"><ProgressMetrics record={record}/></p><p className="text-sm text-slate-500">{new Date(record.Fecha_Registro).toLocaleString("es-AR")}</p><ProgressForm endpoint={`/api/alumno/progresos/${record.Registro_ID}`} initial={record} method="PUT"/></Card>)}</main></>; }
