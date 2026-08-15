"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Alumno } from "@/modules/alumnos/domain/alumno";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const fields = [
  ["Documento", "Documento", "text"], ["Nombre", "Nombre", "text"], ["Apellido", "Apellido", "text"],
  ["Fecha_Nacimiento", "Fecha de nacimiento", "date"], ["Celular", "Celular", "tel"],
  ["Mail", "Email", "email"], ["Fecha_Alta", "Fecha de alta", "date"],
] as const;

type FormValue = Omit<Alumno, "Alumno_ID">;

export function AlumnoForm({ alumno }: { alumno?: Alumno }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setSaving(true);
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const url = alumno ? `/api/admin/alumnos/${alumno.Alumno_ID}` : "/api/admin/alumnos";
    try {
      const response = await fetch(url, { method: alumno ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      const payload = await response.json() as { alumno?: Alumno; error?: string };
      if (!response.ok || !payload.alumno) throw new Error(payload.error ?? "No se pudo guardar el alumno.");
      router.replace(`/admin/alumnos/${payload.alumno.Alumno_ID}`); router.refresh();
    } catch { setError("Revisá los datos e intentá nuevamente."); } finally { setSaving(false); }
  }

  const initial = (alumno ?? { Documento:"", Nombre:"", Apellido:"", Fecha_Nacimiento:"", Celular:"", Mail:"", Fecha_Alta:new Date().toISOString().slice(0,10), Objetivo:"", Dolencia:"", Observaciones:"" }) as FormValue;
  return <form className="space-y-6" onSubmit={submit}>
    <div className="grid gap-4 sm:grid-cols-2">{fields.map(([name,label,type]) => <label className="space-y-2 text-sm font-semibold text-slate-700" key={name}>{label}<Input defaultValue={initial[name]} name={name} required type={type} /></label>)}</div>
    <div className="grid gap-4">{([['Objetivo','Objetivo'],['Dolencia','Dolencia'],['Observaciones','Observaciones']] as const).map(([name,label]) => <label className="space-y-2 text-sm font-semibold text-slate-700" key={name}>{label}<textarea className="min-h-24 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-violet-500" defaultValue={initial[name]} name={name} /></label>)}</div>
    {error ? <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p> : null}
    <Button disabled={saving} type="submit">{saving ? "Guardando…" : alumno ? "Guardar cambios" : "Crear alumno"}</Button>
  </form>;
}
