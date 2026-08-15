import Link from "next/link";
import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/modules/auth/infrastructure/current-user";

export default async function AdminPage() {
  const user = await requireAdmin();
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-5 py-10">
      <Card className="space-y-5">
        <p className="text-sm font-bold uppercase tracking-widest text-violet-700">Área administrativa</p>
        <h1 className="text-3xl font-bold">Hola, entrenadora</h1>
        <p className="text-slate-600">Sesión activa como {user.email}.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{[["Gestionar alumnos", "/admin/alumnos"], ["Gestionar cobros", "/admin/cobros"], ["Gestionar ejercicios", "/admin/ejercicios"], ["Gestionar plantillas", "/admin/plantillas"], ["Gestionar rutinas", "/admin/rutinas"]].map(([label, href], index) => <Link key={href} className={`inline-flex min-h-11 items-center rounded-lg px-4 py-2 font-semibold ${index === 0 ? "bg-violet-700 text-white" : "border border-violet-700 text-violet-700"}`} href={href}>{label}</Link>)}</div>
      </Card>
    </main>
  );
}
