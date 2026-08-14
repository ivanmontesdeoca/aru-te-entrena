import { z } from "zod";
import { isoDateSchema, requiredTextSchema, uuidSchema } from "@/modules/shared/domain/schemas";
export const cobroSchema = z.object({ Cobro_ID: uuidSchema, Alumno_ID: uuidSchema, Mes_Abonado: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/), Fecha_Pago: isoDateSchema.nullable(), Importe: z.number().nonnegative(), Estado_Pago: requiredTextSchema, Medio_Pago: requiredTextSchema });
