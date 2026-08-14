import { z } from "zod";
import { optionalTextSchema, optionalUrlSchema, requiredTextSchema, uuidSchema } from "@/modules/shared/domain/schemas";
export const ejercicioSchema = z.object({ Catalogo_ID: uuidSchema, Tipo_de_Ejercicio: requiredTextSchema, Ejercicio: requiredTextSchema, Video: optionalUrlSchema, Aclaraciones: optionalTextSchema, Video_Adicional: optionalUrlSchema, Activo: z.boolean() });
