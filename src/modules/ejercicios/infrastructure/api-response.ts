import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AuthError } from "@/modules/auth/domain/errors";
import { EjercicioAdminError } from "../application/errors";
export function ejercicioApiError(error:unknown){if(error instanceof AuthError)return NextResponse.json({error:error.code},{status:error.status});if(error instanceof EjercicioAdminError)return NextResponse.json({error:error.code},{status:error.status});if(error instanceof ZodError)return NextResponse.json({error:"INVALID_DATA",issues:error.flatten().fieldErrors},{status:400});return NextResponse.json({error:"INTERNAL_ERROR"},{status:500});}
