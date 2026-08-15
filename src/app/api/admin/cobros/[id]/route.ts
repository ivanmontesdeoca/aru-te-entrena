import { NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth/infrastructure/current-user";
import { assertTrustedRequestOrigin } from "@/modules/auth/infrastructure/request-origin";
import { cobroFieldsSchema } from "@/modules/cobros/application/schemas";
import { cobroApiError } from "@/modules/cobros/infrastructure/api-response";
import { getCobroAdminService } from "@/modules/cobros/infrastructure/cobro-admin-service-factory";
export async function PUT(request:Request,context:{params:Promise<{id:string}>}){try{assertTrustedRequestOrigin(request);await requireAdmin();const input=cobroFieldsSchema.parse(await request.json());const{id}=await context.params;return NextResponse.json({cobro:await getCobroAdminService().update(id,input)});}catch(error){return cobroApiError(error);}}
