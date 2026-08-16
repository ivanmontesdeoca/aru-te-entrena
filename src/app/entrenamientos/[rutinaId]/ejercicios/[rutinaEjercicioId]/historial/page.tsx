import Link from "next/link";
import { AlumnoHeader } from "@/components/alumno/alumno-header";
import { ProgressForm } from "@/components/progreso/progress-form";
import { ProgressMetrics } from "@/components/progreso/progress-metrics";
import { Card } from "@/components/ui/card";
import { getAuthenticatedAlumnoId } from "@/modules/auth/infrastructure/current-user";
import { getProgresoService } from "@/modules/progresos/infrastructure/progreso-service-factory";

export default async function HistorialPage({ params }: { params: Promise<{ rutinaId: string; rutinaEjercicioId: string }> }) {
  const alumnoId=await getAuthenticatedAlumnoId(); const{rutinaId,rutinaEjercicioId}=await params;
  const {history,catalog}=await getProgresoService().historyDetailForItem(alumnoId,rutinaEjercicioId); const name=catalog?.Ejercicio??"Ejercicio";
  return <><AlumnoHeader/><main className="mx-auto max-w-3xl space-y-6 px-4 py-6"><Link className="font-bold text-violet-700" href={`/entrenamientos/${rutinaId}`}>← Volver al entrenamiento</Link><div><h1 className="text-3xl font-black">{name}</h1><p className="mt-1 text-lg font-bold text-slate-600">Historial de marcas</p></div>{!history.length?<Card>Todavía no registraste una marca para este ejercicio.</Card>:history.map(record=><Card className="space-y-3" key={record.Registro_ID}><h2 className="font-extrabold">{name}</h2><p className="font-bold"><ProgressMetrics record={record}/></p><p className="text-sm text-slate-500">{new Date(record.Fecha_Registro).toLocaleString("es-AR")}</p><ProgressForm endpoint={`/api/alumno/progresos/${record.Registro_ID}`} initial={record} method="PUT"/></Card>)}</main></>;
}
