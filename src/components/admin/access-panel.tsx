"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import type { Usuario } from "@/modules/usuarios/domain/usuario";
import { getFirebaseClientAuth } from "@/infrastructure/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccessBadge } from "./access-badge";

export function AccessPanel({ alumnoId, suggestedEmail, access }: { alumnoId: string; suggestedEmail: string; access: Usuario | null }) {
  const router = useRouter(); const [message,setMessage]=useState(""); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  async function sendReset(email: string) { await sendPasswordResetEmail(getFirebaseClientAuth(), email.trim().toLowerCase()); setMessage("Firebase envió las instrucciones al email de acceso."); }
  async function create(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(""); setMessage(""); const email=String(new FormData(event.currentTarget).get("Email")??""); try { const response=await fetch(`/api/admin/alumnos/${alumnoId}/acceso`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({Email:email})}); const payload=await response.json() as {error?:string}; if(!response.ok) throw new Error(payload.error); try { await sendReset(email); } catch { setError("El acceso fue creado, pero Firebase no pudo enviar las instrucciones. Podés reenviarlas desde esta ficha."); } router.refresh(); } catch { setError("No se pudo crear el acceso. Verificá que el email no esté en uso."); } finally { setLoading(false); } }
  async function toggle() { if(!access)return; setLoading(true);setError(""); try { const response=await fetch(`/api/admin/alumnos/${alumnoId}/acceso`,{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({Activo:!access.Activo})}); if(!response.ok)throw new Error(); router.refresh(); } catch {setError("No se pudo cambiar el estado del acceso.");} finally {setLoading(false);} }
  async function resend() { if(!access)return; setLoading(true);setError("");setMessage(""); try {await sendReset(access.Email);} catch {setError("Firebase no pudo enviar las instrucciones.");} finally {setLoading(false);} }
  return <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold">Acceso a la aplicación</h2><p className="text-sm text-slate-600">{access?.Email ?? "Todavía no existe una cuenta Firebase vinculada."}</p></div><AccessBadge active={access?.Activo ?? null}/></div>
    {access ? <div className="flex flex-wrap gap-3"><Button disabled={loading} onClick={toggle} type="button">{access.Activo?"Deshabilitar":"Habilitar"}</Button><Button className="border border-violet-700 bg-white text-violet-700 hover:bg-violet-50" disabled={loading} onClick={resend} type="button">Reenviar instrucciones</Button></div> : <form className="flex flex-col gap-3 sm:flex-row" onSubmit={create}><Input defaultValue={suggestedEmail} name="Email" placeholder="email@ejemplo.com" required type="email"/><Button disabled={loading} type="submit">Crear acceso e invitar</Button></form>}
    {message?<p className="text-sm text-emerald-700" role="status">{message}</p>:null}{error?<p className="text-sm text-red-700" role="alert">{error}</p>:null}
  </section>;
}
