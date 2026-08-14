import { z } from "zod";
import { catalogoIdSchema, optionalTextSchema, optionalUrlSchema, requiredTextSchema } from "@/modules/shared/domain/schemas";
export const ejercicioSchema = z.object({ Catalogo_ID: catalogoIdSchema, Tipo_de_Ejercicio: requiredTextSchema, Ejercicio: requiredTextSchema, Video: optionalUrlSchema, Aclaraciones: optionalTextSchema, Video_Adicional: optionalUrlSchema, Activo: z.boolean() });
