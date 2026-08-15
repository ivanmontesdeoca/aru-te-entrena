import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { requireAdmin } from "@/modules/auth/infrastructure/current-user";
import { getAlumnoAdminService } from "@/modules/alumnos/infrastructure/alumno-admin-service-factory";
import { getCobroAdminService } from "@/modules/cobros/infrastructure/cobro-admin-service-factory";
import { getRutinaAdminService } from "@/modules/rutinas/infrastructure/rutina-admin-service-factory";

const quickLinks = [["👥", "Alumnos", "Personas, fichas y accesos", "/admin/alumnos"], ["🏋", "Rutinas", "Planificar entrenamientos", "/admin/rutinas"], ["📋", "Plantillas", "Sesiones reutilizables", "/admin/plantillas"], ["💪", "Ejercicios", "Administrar el catálogo", "/admin/ejercicios"], ["💳", "Cobros", "Seguimiento de cuotas", "/admin/cobros"], ["✨", "Crear con IA", "Generar una propuesta supervisada", "/admin/rutinas/nueva?modo=ia"]] as const;

export default async function AdminPage() {
  await requireAdmin();
  const currentMonth = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires", year: "numeric", month: "2-digit" }).format(new Date());
  const [students, payments, routines] = await Promise.all([getAlumnoAdminService().list(), getCobroAdminService().list({ month: currentMonth }), getRutinaAdminService().list()]);
  const activeIds = new Set(students.filter((entry) => entry.access?.Activo).map((entry) => entry.alumno.Alumno_ID));
  const today = new Date(); today.setHours(0, 0, 0, 0); const limit = new Date(today); limit.setDate(limit.getDate() + 7);
  const lastByStudent = new Map<string, string>();
  for (const { session } of routines) if (!lastByStudent.has(session.Alumno_ID)) lastByStudent.set(session.Alumno_ID, session.Fecha);
  const expiring = [...lastByStudent].filter(([id, date]) => { const end = new Date(`${date}T00:00:00`); return activeIds.has(id) && end >= today && end <= limit; }).length;
  const paid = payments.entries.filter(({ cobro }) => cobro.Estado_Pago === "PAGADO").length;
  return <main className="app-page space-y-9"><PageHeader eyebrow="Panel de gestión" title="Hola, Aru 👋" description="Todo lo importante del estudio, en un solo lugar." /><section aria-labelledby="month-summary" className="space-y-3"><div className="flex items-center justify-between"><h2 id="month-summary" className="text-xl font-bold">Resumen del mes</h2><span className="text-sm text-slate-500">{currentMonth}</span></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><StatCard accent="aqua" label="Alumnos activos" value={activeIds.size}/><StatCard accent="green" label="Cuotas pagadas" value={paid}/><StatCard accent="warm" label="Cuotas pendientes" value={payments.summary.pendientes}/><StatCard accent="sage" label="Planificaciones por vencer" value={expiring}/></div></section><section aria-labelledby="quick-access" className="space-y-3"><h2 id="quick-access" className="text-xl font-bold">Accesos rápidos</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{quickLinks.map(([icon,title,description,href])=><Link key={href+title} href={href}><Card className="group h-full transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md"><span aria-hidden className="text-2xl">{icon}</span><h3 className="mt-4 text-lg font-bold group-hover:text-violet-800">{title}</h3><p className="mt-1 text-sm text-slate-600">{description}</p><span className="mt-4 inline-flex text-sm font-bold text-violet-700">Abrir →</span></Card></Link>)}</div></section></main>;
}

function StatCard({label,value,accent}:{label:string;value:number;accent:"green"|"warm"|"aqua"|"sage"}) { const colors={green:"bg-emerald-50 text-emerald-800",warm:"bg-orange-50 text-orange-800",aqua:"bg-cyan-50 text-cyan-900",sage:"bg-lime-50 text-lime-900"}; const [bg,text]=colors[accent].split(" "); return <Card className="relative overflow-hidden"><span className={`absolute inset-y-0 left-0 w-1.5 ${bg}`}/><p className="text-sm font-medium text-slate-600">{label}</p><p className={`mt-2 text-3xl font-extrabold ${text}`}>{value}</p></Card>; }
