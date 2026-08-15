"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export function ExerciseStateButton({id,active}:{id:string;active:boolean}){const router=useRouter();const[loading,setLoading]=useState(false);const[error,setError]=useState("");async function toggle(){setLoading(true);setError("");try{const response=await fetch(`/api/admin/ejercicios/${encodeURIComponent(id)}`,{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({Activo:!active})});if(!response.ok)throw new Error();router.refresh();}catch{setError("No se pudo cambiar el estado.");}finally{setLoading(false);}}return <div className="space-y-2"><Button className={active?"bg-amber-600 hover:bg-amber-700":"bg-emerald-700 hover:bg-emerald-800"} disabled={loading} onClick={toggle}>{active?"Archivar ejercicio":"Reactivar ejercicio"}</Button>{error?<p className="text-sm text-red-700" role="alert">{error}</p>:null}</div>;}
