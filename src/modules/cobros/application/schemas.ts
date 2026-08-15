import { z } from "zod";
import { isoDateSchema, uuidSchema } from "@/modules/shared/domain/schemas";
export const estadoPagoSchema = z.enum(["PAGADO", "PENDIENTE"]);
export const medioPagoSchema = z.enum(["EFECTIVO", "TRANSFERENCIA"]);
export const cobroFieldsSchema = z.object({ Alumno_ID: uuidSchema, Mes_Abonado: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/), Fecha_Pago: z.union([isoDateSchema, z.null()]), Importe: z.number().finite().nonnegative(), Estado_Pago: estadoPagoSchema, Medio_Pago: medioPagoSchema }).strict().superRefine((value, context) => { if (value.Estado_Pago === "PAGADO" && value.Fecha_Pago === null) context.addIssue({ code: "custom", path: ["Fecha_Pago"], message: "Un pago registrado como PAGADO requiere fecha" }); });
export type CobroFields = z.infer<typeof cobroFieldsSchema>;
