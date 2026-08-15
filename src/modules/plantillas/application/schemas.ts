import { z } from "zod";
import { catalogoIdSchema, optionalTextSchema, positiveOrderSchema, requiredTextSchema, uuidSchema } from "@/modules/shared/domain/schemas";
export const plantillaFieldsSchema=z.object({Nombre_Plantilla:requiredTextSchema,Objetivo:requiredTextSchema,Grupo_Muscular_1:requiredTextSchema,Grupo_Muscular_2:optionalTextSchema,Notas:optionalTextSchema});
export const plantillaExerciseInputSchema=z.object({Plantilla_Ejercicio_ID:uuidSchema.optional(),Tipo_Bloque:requiredTextSchema,Orden_Bloque:positiveOrderSchema,Orden_Ejercicio:positiveOrderSchema,Catalogo_ID:catalogoIdSchema,Reps_Tiempo:optionalTextSchema,Series:optionalTextSchema,Carga:optionalTextSchema,Descanso:optionalTextSchema,RIR:optionalTextSchema,Observaciones:optionalTextSchema});
export const savePlantillaSchema=z.object({session:plantillaFieldsSchema,exercises:z.array(plantillaExerciseInputSchema).max(300)});
export type PlantillaFields=z.infer<typeof plantillaFieldsSchema>;export type PlantillaExerciseInput=z.infer<typeof plantillaExerciseInputSchema>;
