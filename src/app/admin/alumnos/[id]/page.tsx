import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { AlumnoForm } from "@/components/admin/alumno-form";
import { AccessPanel } from "@/components/admin/access-panel";
import { requireAdmin } from "@/modules/auth/infrastructure/current-user";
import { AlumnoAdminError } from "@/modules/alumnos/application/errors";
import { getAlumnoAdminService } from "@/modules/alumnos/infrastructure/alumno-admin-service-factory";

export default async function AlumnoPage({ params }: { params: Promise<{ id: string }> }) { await requireAdmin(); const {id}=await params; let entry; try { entry=await getAlumnoAdminService().get(id); } catch(error) { if(error instanceof AlumnoAdminError&&error.code==="ALUMNO_NOT_FOUND")notFound(); throw error; }
  return <main className="mx-auto max-w-4xl space-y-6 px-5 py-8"><Link className="text-sm font-semibold text-violet-700" href="/admin/alumnos">← Volver a alumnos</Link><div><p className="text-sm font-bold uppercase tracking-widest text-violet-700">Ficha del alumno</p><h1 className="text-3xl font-black">{entry.alumno.Nombre} {entry.alumno.Apellido}</h1></div><AccessPanel access={entry.access} alumnoId={entry.alumno.Alumno_ID} suggestedEmail={entry.alumno.Mail}/><Card><h2 className="mb-5 text-xl font-bold">Datos personales y entrenamiento</h2><AlumnoForm alumno={entry.alumno}/></Card></main>;
}
