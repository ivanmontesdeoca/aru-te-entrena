import { LogoutButton } from "@/components/auth/logout-button";
import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/modules/auth/infrastructure/current-user";

export default async function AdminPage() {
  const user = await requireAdmin();
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-5 py-10">
      <Card className="space-y-5">
        <p className="text-sm font-bold uppercase tracking-widest text-violet-700">Área administrativa</p>
        <h1 className="text-3xl font-bold">Hola, entrenadora</h1>
        <p className="text-slate-600">Sesión activa como {user.email}. Los módulos administrativos se implementarán en próximas etapas.</p>
        <LogoutButton />
      </Card>
    </main>
  );
}
