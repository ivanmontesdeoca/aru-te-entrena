import Link from "next/link";
import { CobroForm } from "@/components/admin/cobro-form";
import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/modules/auth/infrastructure/current-user";
import { getCobroAdminService } from "@/modules/cobros/infrastructure/cobro-admin-service-factory";
export default async function NuevoCobroPage(){await requireAdmin();const students=await getCobroAdminService().options();return <main className="mx-auto max-w-3xl space-y-6 px-4 py-8"><Link className="font-bold text-violet-700" href="/admin/cobros">← Volver a cobros</Link><div><p className="text-sm font-bold uppercase tracking-widest text-violet-700">Administración</p><h1 className="text-3xl font-black">Nuevo cobro</h1></div><Card><CobroForm students={students}/></Card></main>;}
