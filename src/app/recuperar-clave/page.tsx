import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordResetForm } from "@/components/auth/password-reset-form";

export default function PasswordResetPage() {
  return (
    <AuthShell
      eyebrow="Recuperar acceso"
      title="Restablecé tu contraseña"
      description="Ingresá tu email y te enviaremos instrucciones seguras desde Firebase."
    >
      <PasswordResetForm />
    </AuthShell>
  );
}
