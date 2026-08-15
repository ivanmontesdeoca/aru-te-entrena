import { NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth/infrastructure/current-user";
import { assertTrustedRequestOrigin } from "@/modules/auth/infrastructure/request-origin";
import { cobroFieldsSchema } from "@/modules/cobros/application/schemas";
import { cobroApiError } from "@/modules/cobros/infrastructure/api-response";
import { getCobroAdminService } from "@/modules/cobros/infrastructure/cobro-admin-service-factory";
export async function POST(request:Request){try{assertTrustedRequestOrigin(request);await requireAdmin();const input=cobroFieldsSchema.parse(await request.json());return NextResponse.json({cobro:await getCobroAdminService().create(input)},{status:201});}catch(error){return cobroApiError(error);}}
