import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError } from "@/modules/auth/domain/errors";
import { requireAdmin } from "@/modules/auth/infrastructure/current-user";
import { assertTrustedRequestOrigin } from "@/modules/auth/infrastructure/request-origin";
import { ProgresoError } from "@/modules/progresos/application/errors";
import { progressMetricsSchema } from "@/modules/progresos/application/schemas";
import { getProgresoService } from "@/modules/progresos/infrastructure/progreso-service-factory";
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) { try { assertTrustedRequestOrigin(request); await requireAdmin(); const input = progressMetricsSchema.parse(await request.json()); const { id } = await context.params; return NextResponse.json({ record: await getProgresoService().updateAdmin(id, input) }); } catch (error) { if (error instanceof AuthError || error instanceof ProgresoError) return NextResponse.json({ error: error.code }, { status: error.status }); if (error instanceof z.ZodError) return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 }); return NextResponse.json({ error: "UPDATE_FAILED" }, { status: 500 }); } }
