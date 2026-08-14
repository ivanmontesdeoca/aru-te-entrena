import { z } from "zod";
import { isoDateTimeSchema, uuidSchema } from "@/modules/shared/domain/schemas";
const optionalMetric = z.number().nonnegative().finite().nullable();
export const registroProgresoSchema = z.object({ Registro_ID: uuidSchema, Alumno_ID: uuidSchema, Rutina_Ejercicio_ID: uuidSchema, Catalogo_ID: uuidSchema, Fecha_Registro: isoDateTimeSchema, Meta_Peso: optionalMetric, Meta_Repeticiones: z.number().int().nonnegative().nullable(), Meta_Tiempo: optionalMetric }).superRefine((v, ctx) => { if (v.Meta_Peso === null && v.Meta_Repeticiones === null && v.Meta_Tiempo === null) ctx.addIssue({ code: "custom", message: "Debe informarse al menos una métrica" }); });
