import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getOptionalCurrentUser } from "@/modules/auth/infrastructure/current-user";

export default async function LoginPage() {
  const user = await getOptionalCurrentUser();
  if (user) redirect(user.role === "ADMIN" ? "/admin" : "/entrenamientos");
  return (
    <AuthShell
      eyebrow="Acceso a tu espacio"
      title="Bienvenido de nuevo"
      description="Ingresá para consultar y administrar tus entrenamientos."
    >
      <LoginForm />
    </AuthShell>
  );
}
