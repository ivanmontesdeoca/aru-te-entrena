"use client";

import { useState, type FormEvent } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFirebaseClientAuth } from "@/infrastructure/firebase/client";

export function PasswordResetForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(getFirebaseClientAuth(), email.trim().toLowerCase());
    } catch {
      // Always return the same result to avoid revealing whether an account exists.
    } finally {
      setSent(true);
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="space-y-5">
        <p className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800" role="status">
          Si existe una cuenta con ese email, Firebase enviará las instrucciones para recuperar el
          acceso.
        </p>
        <a className="block text-center font-semibold text-violet-700" href="/login">
          Volver al ingreso
        </a>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <Button className="w-full" disabled={loading} type="submit">
        {loading ? "Enviando…" : "Enviar instrucciones"}
      </Button>
      <a className="block text-center text-sm font-semibold text-violet-700" href="/login">
        Volver al ingreso
      </a>
    </form>
  );
}
