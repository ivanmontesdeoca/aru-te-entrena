import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError } from "@/modules/auth/domain/errors";
import { getAuthenticatedAlumnoId } from "@/modules/auth/infrastructure/current-user";
import { assertTrustedRequestOrigin } from "@/modules/auth/infrastructure/request-origin";
import { EntrenamientoAlumnoError } from "@/modules/entrenamientos/application/errors";
import { getEntrenamientoAlumnoService } from "@/modules/entrenamientos/infrastructure/entrenamiento-alumno-service-factory";
const inputSchema = z.object({ completed: z.boolean() }).strict();
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) { try { assertTrustedRequestOrigin(request); const alumnoId = await getAuthenticatedAlumnoId(); const { id } = await context.params; const input = inputSchema.parse(await request.json()); const session = await getEntrenamientoAlumnoService().setCompleted(alumnoId, id, input.completed); return NextResponse.json({ session }); } catch (error) { if (error instanceof AuthError || error instanceof EntrenamientoAlumnoError) return NextResponse.json({ error: error.code }, { status: error.status }); if (error instanceof z.ZodError) return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 }); return NextResponse.json({ error: "UPDATE_FAILED" }, { status: 500 }); } }
