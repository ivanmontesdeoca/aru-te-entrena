import Link from "next/link";
import { notFound } from "next/navigation";
import { CobroForm } from "@/components/admin/cobro-form";
import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/modules/auth/infrastructure/current-user";
import { CobroAdminError } from "@/modules/cobros/application/errors";
import { getCobroAdminService } from "@/modules/cobros/infrastructure/cobro-admin-service-factory";
export default async function EditarCobroPage({params}:{params:Promise<{id:string}>}){await requireAdmin();const{id}=await params;let detail;try{detail=await getCobroAdminService().get(id);}catch(error){if(error instanceof CobroAdminError)notFound();throw error;}return <main className="mx-auto max-w-3xl space-y-6 px-4 py-8"><Link className="font-bold text-violet-700" href="/admin/cobros">← Volver a cobros</Link><div><p className="text-sm font-bold uppercase tracking-widest text-violet-700">Administración</p><h1 className="text-3xl font-black">Editar cobro</h1></div><Card><CobroForm cobro={detail.cobro} students={detail.students}/></Card></main>;}
