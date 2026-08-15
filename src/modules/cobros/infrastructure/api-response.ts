import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError } from "@/modules/auth/domain/errors";
import { CobroAdminError } from "../application/errors";
export function cobroApiError(error:unknown){if(error instanceof AuthError||error instanceof CobroAdminError)return NextResponse.json({error:error.code},{status:error.status});if(error instanceof z.ZodError)return NextResponse.json({error:"INVALID_REQUEST",issues:error.issues},{status:400});return NextResponse.json({error:"COBRO_OPERATION_FAILED"},{status:500});}
