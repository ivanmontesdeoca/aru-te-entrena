import { z } from "zod";
import { catalogoIdSchema, optionalTextSchema, positiveOrderSchema, requiredTextSchema, uuidSchema } from "@/modules/shared/domain/schemas";

export const aiPlanningRequestSchema = z.object({
  Alumno_ID: uuidSchema,
  Objetivo_Sesion: z.enum(["Fuerza", "Hipertrofia", "Resistencia", "Acondicionamiento", "Movilidad", "Otro"]),
  Objetivo_Otro: z.string().trim().max(120).default(""),
  Foco: z.string().trim().min(1).max(120),
  Duracion_Minutos: z.number().int().min(10).max(240).nullable(),
  Cantidad_Bloques: z.number().int().min(1).max(12).nullable(),
  Indicaciones_Adicionales: z.string().trim().max(2000).default(""),
  Aclaracion: z.object({ pregunta: z.string().trim().min(1).max(300), respuesta: z.string().trim().min(1).max(1000) }).nullable().default(null),
}).superRefine((value, context) => { if (value.Objetivo_Sesion === "Otro" && !value.Objetivo_Otro) context.addIssue({ code: "custom", path: ["Objetivo_Otro"], message: "Ingresá el objetivo de la sesión" }); });

export const aiExerciseSchema = z.object({ Catalogo_ID: catalogoIdSchema, Orden_Ejercicio: positiveOrderSchema, Reps_Tiempo: optionalTextSchema, Series: optionalTextSchema, Carga: optionalTextSchema, Descanso: optionalTextSchema, RIR: optionalTextSchema, Observaciones: optionalTextSchema });
export const aiBlockSchema = z.object({ Tipo_Bloque: requiredTextSchema, Orden_Bloque: positiveOrderSchema, Ejercicios: z.array(aiExerciseSchema).min(1).max(30) });
export const aiProposalSchema = z.object({ Titulo: requiredTextSchema, Notas_Generales: optionalTextSchema, Duracion_Estimada_Minutos: z.number().int().positive().nullable(), Advertencia_Revision: requiredTextSchema, Bloques: z.array(aiBlockSchema).min(1).max(12) });
export const aiModelOutputSchema = z.object({ status: z.enum(["READY", "NEEDS_CLARIFICATION"]), pregunta: z.string().nullable(), opciones: z.array(z.string()).max(5), propuesta: aiProposalSchema.nullable(), motivo_insuficiente: z.string().nullable() });
export type AiPlanningRequest = z.infer<typeof aiPlanningRequestSchema>;
export type AiProposal = z.infer<typeof aiProposalSchema>;
export type AiModelOutput = z.infer<typeof aiModelOutputSchema>;
