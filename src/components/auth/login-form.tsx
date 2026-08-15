"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  inMemoryPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFirebaseClientAuth } from "@/infrastructure/firebase/client";

const serverMessages: Record<string, string> = {
  USER_NOT_REGISTERED: "La cuenta no está habilitada para usar la aplicación.",
  USER_INACTIVE: "Tu acceso está deshabilitado. Contactá a la entrenadora.",
  DUPLICATE_AUTH_USER: "La cuenta requiere revisión administrativa.",
  INVALID_TOKEN: "No pudimos validar el ingreso. Intentá nuevamente.",
};

const safeServerErrorPrefix = "ARU_AUTH:";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const auth = getFirebaseClientAuth();
    try {
      await setPersistence(auth, inMemoryPersistence);
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password,
      );
      const idToken = await credential.user.getIdToken();
      const response = await fetch("/api/auth/session", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const payload = (await response.json()) as { role?: "ADMIN" | "ALUMNO"; error?: string };
      if (!response.ok || !payload.role) {
        throw new Error(
          `${safeServerErrorPrefix}${serverMessages[payload.error ?? ""] ?? "No pudimos iniciar sesión."}`,
        );
      }
      await signOut(auth);
      router.replace(payload.role === "ADMIN" ? "/admin" : "/entrenamientos");
      router.refresh();
    } catch (reason) {
      await signOut(auth).catch(() => undefined);
      const message =
        reason instanceof Error && reason.message.startsWith(safeServerErrorPrefix)
          ? reason.message.slice(safeServerErrorPrefix.length)
          : "Email o contraseña incorrectos.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700" htmlFor="password">
          Contraseña
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      {error ? (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <Button className="w-full" disabled={loading} type="submit">
        {loading ? "Ingresando…" : "Ingresar"}
      </Button>
      <a
        className="block text-center text-sm font-semibold text-violet-700 hover:text-violet-900"
        href="/recuperar-clave"
      >
        Olvidé mi contraseña
      </a>
    </form>
  );
}
