import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth/infrastructure/current-user";
import { assertTrustedRequestOrigin } from "@/modules/auth/infrastructure/request-origin";
import { alumnoFieldsSchema } from "@/modules/alumnos/application/schemas";
import { alumnoApiError } from "@/modules/alumnos/infrastructure/api-response";
import { getAlumnoAdminService } from "@/modules/alumnos/infrastructure/alumno-admin-service-factory";

export async function POST(request: NextRequest) {
  try {
    assertTrustedRequestOrigin(request);
    await requireAdmin();
    const input = alumnoFieldsSchema.parse(await request.json());
    const alumno = await getAlumnoAdminService().create(input);
    return NextResponse.json({ alumno }, { status: 201 });
  } catch (error) { return alumnoApiError(error); }
}
