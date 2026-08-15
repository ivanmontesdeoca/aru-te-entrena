import { LogoutButton } from "@/components/auth/logout-button";
import { Card } from "@/components/ui/card";
import { requireAlumno } from "@/modules/auth/infrastructure/current-user";

export default async function EntrenamientosPage() {
  const user = await requireAlumno();
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 py-10">
      <Card className="space-y-5">
        <p className="text-sm font-bold uppercase tracking-widest text-violet-700">Mis entrenamientos</p>
        <h1 className="text-3xl font-bold">Tu espacio de entrenamiento</h1>
        <p className="text-slate-600">Sesión activa como {user.email}. Las rutinas se incorporarán en próximas etapas.</p>
        <LogoutButton />
      </Card>
    </main>
  );
}
