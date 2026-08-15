import { NextRequest,NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth/infrastructure/current-user";
import { assertTrustedRequestOrigin } from "@/modules/auth/infrastructure/request-origin";
import { ejercicioFieldsSchema,ejercicioStateSchema } from "@/modules/ejercicios/application/schemas";
import { ejercicioApiError } from "@/modules/ejercicios/infrastructure/api-response";
import { getEjercicioAdminService } from "@/modules/ejercicios/infrastructure/ejercicio-admin-service-factory";
export async function PUT(request:NextRequest,context:{params:Promise<{id:string}>}){try{assertTrustedRequestOrigin(request);await requireAdmin();const {id}=await context.params;const input=ejercicioFieldsSchema.parse(await request.json());return NextResponse.json({ejercicio:await getEjercicioAdminService().update(id,input)});}catch(error){return ejercicioApiError(error);}}
export async function PATCH(request:NextRequest,context:{params:Promise<{id:string}>}){try{assertTrustedRequestOrigin(request);await requireAdmin();const {id}=await context.params;const input=ejercicioStateSchema.parse({...(await request.json()),Catalogo_ID:id});return NextResponse.json({ejercicio:await getEjercicioAdminService().setActive(id,input.Activo)});}catch(error){return ejercicioApiError(error);}}
