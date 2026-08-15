import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth/infrastructure/current-user";
import { assertTrustedRequestOrigin } from "@/modules/auth/infrastructure/request-origin";
import { updateAlumnoSchema } from "@/modules/alumnos/application/schemas";
import { alumnoApiError } from "@/modules/alumnos/infrastructure/api-response";
import { getAlumnoAdminService } from "@/modules/alumnos/infrastructure/alumno-admin-service-factory";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    assertTrustedRequestOrigin(request);
    await requireAdmin();
    const { id } = await context.params;
    const input = updateAlumnoSchema.parse({ ...(await request.json()), Alumno_ID: id });
    return NextResponse.json({ alumno: await getAlumnoAdminService().update(input) });
  } catch (error) { return alumnoApiError(error); }
}
