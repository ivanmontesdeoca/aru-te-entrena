import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError } from "@/modules/auth/domain/errors";
import { getAuthenticatedAlumnoId } from "@/modules/auth/infrastructure/current-user";
import { assertTrustedRequestOrigin } from "@/modules/auth/infrastructure/request-origin";
import { ProgresoError } from "@/modules/progresos/application/errors";
import { createProgressSchema } from "@/modules/progresos/application/schemas";
import { getProgresoService } from "@/modules/progresos/infrastructure/progreso-service-factory";
export async function POST(request: Request) {
  try {
    assertTrustedRequestOrigin(request);
    const alumnoId = await getAuthenticatedAlumnoId();
    const input = createProgressSchema.parse(await request.json());
    const { Rutina_Ejercicio_ID, ...metrics } = input;
    const record = await getProgresoService().create(alumnoId, Rutina_Ejercicio_ID, metrics);
    return NextResponse.json({ record }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError || error instanceof ProgresoError) return NextResponse.json({ error: error.code }, { status: error.status });
    if (error instanceof z.ZodError) return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
    return NextResponse.json({ error: "CREATE_FAILED" }, { status: 500 });
  }
}
