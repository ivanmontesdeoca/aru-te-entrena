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
        <div className="flex flex-wrap gap-3"><Link className="inline-flex min-h-11 items-center rounded-lg bg-violet-700 px-4 py-2 font-semibold text-white" href="/admin/alumnos">Gestionar alumnos</Link><Link className="inline-flex min-h-11 items-center rounded-lg border border-violet-700 px-4 py-2 font-semibold text-violet-700" href="/admin/ejercicios">Gestionar ejercicios</Link><Link className="inline-flex min-h-11 items-center rounded-lg border border-violet-700 px-4 py-2 font-semibold text-violet-700" href="/admin/plantillas">Gestionar plantillas</Link></div>
      </Card>
    </main>
  );
}
