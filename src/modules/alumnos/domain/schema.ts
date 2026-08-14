import { z } from "zod";
import { isoDateSchema, optionalTextSchema, requiredTextSchema, uuidSchema } from "@/modules/shared/domain/schemas";
export const alumnoSchema = z.object({ Alumno_ID: uuidSchema, Documento: requiredTextSchema, Nombre: requiredTextSchema, Apellido: requiredTextSchema, Fecha_Nacimiento: isoDateSchema, Celular: requiredTextSchema, Mail: z.email(), Fecha_Alta: isoDateSchema, Objetivo: optionalTextSchema, Dolencia: optionalTextSchema, Observaciones: optionalTextSchema });
