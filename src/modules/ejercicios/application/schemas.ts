import { z } from "zod";
import { catalogoIdSchema, optionalTextSchema, optionalUrlSchema, requiredTextSchema } from "@/modules/shared/domain/schemas";

export const ejercicioFieldsSchema = z.object({
  Tipo_de_Ejercicio: requiredTextSchema,
  Ejercicio: requiredTextSchema,
  Video: optionalUrlSchema,
  Aclaraciones: optionalTextSchema,
  Video_Adicional: optionalUrlSchema,
});

export const updateEjercicioSchema = ejercicioFieldsSchema.extend({ Catalogo_ID: catalogoIdSchema });
export const ejercicioStateSchema = z.object({ Catalogo_ID: catalogoIdSchema, Activo: z.boolean() });
export type EjercicioFields = z.infer<typeof ejercicioFieldsSchema>;
