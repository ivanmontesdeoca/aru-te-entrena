import { z } from "zod";
import { isoDateSchema, optionalTextSchema, requiredTextSchema, uuidSchema } from "@/modules/shared/domain/schemas";

export const alumnoFieldsSchema = z.object({
  Documento: requiredTextSchema,
  Nombre: requiredTextSchema,
  Apellido: requiredTextSchema,
  Fecha_Nacimiento: isoDateSchema,
  Celular: requiredTextSchema,
  Mail: z.email().transform((value) => value.trim().toLowerCase()),
  Fecha_Alta: isoDateSchema,
  Objetivo: optionalTextSchema,
  Dolencia: optionalTextSchema,
  Observaciones: optionalTextSchema,
});

export const updateAlumnoSchema = alumnoFieldsSchema.extend({ Alumno_ID: uuidSchema });
export const createAccessSchema = z.object({
  Alumno_ID: uuidSchema,
  Email: z.email().transform((value) => value.trim().toLowerCase()),
});
export const accessStateSchema = z.object({ Alumno_ID: uuidSchema, Activo: z.boolean() });

export type AlumnoFields = z.infer<typeof alumnoFieldsSchema>;
