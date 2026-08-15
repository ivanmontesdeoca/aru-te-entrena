import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { AlumnoForm } from "@/components/admin/alumno-form";
import { AccessPanel } from "@/components/admin/access-panel";
import { AlumnoProgressPanel } from "@/components/admin/alumno-progress-panel";
import { requireAdmin } from "@/modules/auth/infrastructure/current-user";
import { AlumnoAdminError } from "@/modules/alumnos/application/errors";
import { getAlumnoAdminService } from "@/modules/alumnos/infrastructure/alumno-admin-service-factory";
import { getProgresoService } from "@/modules/progresos/infrastructure/progreso-service-factory";
import { getCobroAdminService } from "@/modules/cobros/infrastructure/cobro-admin-service-factory";

export default async function AlumnoPage({params}:{params:Promise<{id:string}>}) {
  await requireAdmin();const{id}=await params;let entry;try{entry=await getAlumnoAdminService().get(id)}catch(error){if(error instanceof AlumnoAdminError&&error.code==="ALUMNO_NOT_FOUND")notFound();throw error}const[progress,cobros]=await Promise.all([getProgresoService().listAdmin(id),getCobroAdminService().recentForStudent(id)]);
  const currentMonth=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Argentina/Buenos_Aires",year:"numeric",month:"2-digit"}).format(new Date());const currentPayment=cobros.find(cobro=>cobro.Mes_Abonado===currentMonth);
  return <main className="app-page max-w-5xl space-y-6"><Link className="brand-link inline-flex min-h-11 items-center text-sm font-semibold" href="/admin/alumnos">← Volver a alumnos</Link><Card className="sticky top-[4.25rem] z-20 border-violet-100 bg-white/95 backdrop-blur"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="eyebrow">Ficha del alumno</p><h1 className="mt-1 text-3xl font-extrabold">{entry.alumno.Nombre} {entry.alumno.Apellido}</h1><p className="mt-1 text-slate-600">{entry.alumno.Objetivo||"Sin objetivo informado"}</p></div><div className="flex flex-wrap gap-2"><StatusBadge label={entry.access?.Activo?"Acceso activo":entry.access?"Acceso inactivo":"Sin acceso"} tone={entry.access?.Activo?"success":entry.access?"danger":"muted"}/><StatusBadge label={currentPayment?.Estado_Pago==="PAGADO"?"Cuota vigente":"Cuota pendiente"} tone={currentPayment?.Estado_Pago==="PAGADO"?"success":"warning"}/></div></div><nav aria-label="Secciones de la ficha" className="mt-5 flex gap-1 overflow-x-auto border-t border-slate-100 pt-3">{[["Datos","datos"],["Rutinas","rutinas"],["Progreso","progreso"],["Cobros","cobros"],["Acceso","acceso"]].map(([label,anchor])=><a className="inline-flex min-h-11 shrink-0 items-center rounded-lg px-3 text-sm font-bold text-slate-600 hover:bg-violet-50 hover:text-violet-800" href={`#${anchor}`} key={anchor}>{label}</a>)}</nav></Card>
    <section id="datos"><Card><h2 className="mb-5 text-xl font-bold">Datos personales y entrenamiento</h2><AlumnoForm alumno={entry.alumno}/></Card></section>
    <section id="rutinas"><Card className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="text-xl font-bold">Rutinas</h2><p className="text-sm text-slate-600">Consultá o creá la planificación del alumno.</p></div><Link className="brand-link inline-flex min-h-11 items-center font-bold" href={`/admin/rutinas?alumno=${id}`}>Ver rutinas →</Link></Card></section>
    <section id="progreso"><AlumnoProgressPanel entries={progress}/></section>
    <section id="cobros"><Card className="space-y-3"><div className="flex justify-between gap-3"><h2 className="text-xl font-bold">Cobros</h2><Link className="brand-link text-sm font-bold" href={`/admin/cobros?alumno=${id}&mes=all`}>Ver todos</Link></div>{!cobros.length?<p className="text-slate-600">No hay cobros registrados.</p>:cobros.map(cobro=><div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-sm" key={cobro.Cobro_ID}><span>{cobro.Mes_Abonado}</span><StatusBadge label={cobro.Estado_Pago} tone={cobro.Estado_Pago==="PAGADO"?"success":"warning"}/><strong>{new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS"}).format(cobro.Importe)}</strong></div>)}</Card></section>
    <section id="acceso"><AccessPanel access={entry.access} alumnoId={entry.alumno.Alumno_ID} suggestedEmail={entry.alumno.Mail}/></section>
  </main>;
}
