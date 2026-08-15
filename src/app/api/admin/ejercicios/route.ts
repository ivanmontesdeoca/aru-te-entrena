import { NextRequest,NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth/infrastructure/current-user";
import { assertTrustedRequestOrigin } from "@/modules/auth/infrastructure/request-origin";
import { ejercicioFieldsSchema } from "@/modules/ejercicios/application/schemas";
import { ejercicioApiError } from "@/modules/ejercicios/infrastructure/api-response";
import { getEjercicioAdminService } from "@/modules/ejercicios/infrastructure/ejercicio-admin-service-factory";
export async function POST(request:NextRequest){try{assertTrustedRequestOrigin(request);await requireAdmin();const input=ejercicioFieldsSchema.parse(await request.json());return NextResponse.json({ejercicio:await getEjercicioAdminService().create(input)},{status:201});}catch(error){return ejercicioApiError(error);}}
