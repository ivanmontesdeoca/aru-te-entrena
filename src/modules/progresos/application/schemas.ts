import { z } from "zod";
const nullableMetric = z.number().finite().nonnegative().nullable();
const metricShape = { Meta_Peso: nullableMetric, Meta_Repeticiones: z.number().int().nonnegative().nullable(), Meta_Tiempo: nullableMetric };
const requireMetric = (value: { Meta_Peso: number | null; Meta_Repeticiones: number | null; Meta_Tiempo: number | null }, context: z.RefinementCtx) => { if (value.Meta_Peso === null && value.Meta_Repeticiones === null && value.Meta_Tiempo === null) context.addIssue({ code: "custom", message: "Ingresá al menos una métrica" }); };
export const progressMetricsSchema = z.object(metricShape).strict().superRefine(requireMetric);
export const createProgressSchema = z.object({ ...metricShape, Rutina_Ejercicio_ID: z.string().uuid() }).strict().superRefine(requireMetric);
export type ProgressMetrics = z.infer<typeof progressMetricsSchema>;
