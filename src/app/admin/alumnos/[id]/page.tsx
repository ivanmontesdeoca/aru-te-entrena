import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { AlumnoForm } from "@/components/admin/alumno-form";
import { AccessPanel } from "@/components/admin/access-panel";
import { AlumnoProgressPanel } from "@/components/admin/alumno-progress-panel";
import { requireAdmin } from "@/modules/auth/infrastructure/current-user";
import { AlumnoAdminError } from "@/modules/alumnos/application/errors";
import { getAlumnoAdminService } from "@/modules/alumnos/infrastructure/alumno-admin-service-factory";
import { getProgresoService } from "@/modules/progresos/infrastructure/progreso-service-factory";
import { getCobroAdminService } from "@/modules/cobros/infrastructure/cobro-admin-service-factory";

export default async function AlumnoPage({ params }: { params: Promise<{ id: string }> }) { await requireAdmin(); const {id}=await params; let entry; try { entry=await getAlumnoAdminService().get(id); } catch(error) { if(error instanceof AlumnoAdminError&&error.code==="ALUMNO_NOT_FOUND")notFound(); throw error; } const[progress,cobros]=await Promise.all([getProgresoService().listAdmin(id),getCobroAdminService().recentForStudent(id)]);
  return <main className="mx-auto max-w-4xl space-y-6 px-5 py-8"><Link className="text-sm font-semibold text-violet-700" href="/admin/alumnos">← Volver a alumnos</Link><div><p className="text-sm font-bold uppercase tracking-widest text-violet-700">Ficha del alumno</p><h1 className="text-3xl font-black">{entry.alumno.Nombre} {entry.alumno.Apellido}</h1></div><AccessPanel access={entry.access} alumnoId={entry.alumno.Alumno_ID} suggestedEmail={entry.alumno.Mail}/><Card><h2 className="mb-5 text-xl font-bold">Datos personales y entrenamiento</h2><AlumnoForm alumno={entry.alumno}/></Card><Card className="space-y-3"><div className="flex justify-between gap-3"><h2 className="text-xl font-bold">Cobros</h2><Link className="text-sm font-bold text-violet-700" href={`/admin/cobros?alumno=${id}&mes=all`}>Ver todos</Link></div>{!cobros.length?<p className="text-slate-600">No hay cobros registrados.</p>:cobros.map(cobro=><div className="flex flex-wrap justify-between gap-2 border-t pt-3 text-sm" key={cobro.Cobro_ID}><span>{cobro.Mes_Abonado} · {cobro.Estado_Pago}</span><strong>{new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS"}).format(cobro.Importe)}</strong></div>)}</Card><AlumnoProgressPanel entries={progress}/></main>;
}
