import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth/infrastructure/current-user";
import { assertTrustedRequestOrigin } from "@/modules/auth/infrastructure/request-origin";
import { accessStateSchema, createAccessSchema } from "@/modules/alumnos/application/schemas";
import { alumnoApiError } from "@/modules/alumnos/infrastructure/api-response";
import { getAlumnoAdminService } from "@/modules/alumnos/infrastructure/alumno-admin-service-factory";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    assertTrustedRequestOrigin(request); await requireAdmin();
    const { id } = await context.params;
    const input = createAccessSchema.parse({ ...(await request.json()), Alumno_ID: id });
    const access = await getAlumnoAdminService().createAccess(input.Alumno_ID, input.Email);
    return NextResponse.json({ access }, { status: 201 });
  } catch (error) { return alumnoApiError(error); }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    assertTrustedRequestOrigin(request); await requireAdmin();
    const { id } = await context.params;
    const input = accessStateSchema.parse({ ...(await request.json()), Alumno_ID: id });
    const access = await getAlumnoAdminService().setAccess(input.Alumno_ID, input.Activo);
    return NextResponse.json({ access });
  } catch (error) { return alumnoApiError(error); }
}
