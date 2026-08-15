import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireAdmin } from "@/modules/auth/infrastructure/current-user";
import { assertTrustedRequestOrigin } from "@/modules/auth/infrastructure/request-origin";
import { AiPlanningError } from "@/modules/ai-planning/application/errors";
import { aiPlanningRequestSchema } from "@/modules/ai-planning/domain/schemas";
import { getAiPlanningService } from "@/modules/ai-planning/infrastructure/service-factory";
export async function POST(request:Request){try{assertTrustedRequestOrigin(request);await requireAdmin();const input=aiPlanningRequestSchema.parse(await request.json());const result=await getAiPlanningService().generate(input);console.info("ai_planning",{success:true,model:result.usage.model,latencyMs:result.usage.latencyMs,inputTokens:result.usage.inputTokens,outputTokens:result.usage.outputTokens});return NextResponse.json(result);}catch(error){if(error instanceof AiPlanningError){console.info("ai_planning",{success:false,code:error.code});return NextResponse.json({error:error.code},{status:error.status});}if(error instanceof ZodError)return NextResponse.json({error:"INVALID_DATA",issues:error.flatten().fieldErrors},{status:400});return NextResponse.json({error:"INTERNAL_ERROR"},{status:500});}}
