"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { getFirebaseClientAuth } from "@/infrastructure/firebase/client";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
      await signOut(getFirebaseClientAuth()).catch(() => undefined);
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <Button className="bg-slate-800 hover:bg-slate-950" disabled={loading} onClick={logout}>
      {loading ? "Saliendo…" : "Cerrar sesión"}
    </Button>
  );
}
