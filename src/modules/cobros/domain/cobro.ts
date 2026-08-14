import type { ISODate, UUID } from "@/modules/shared/domain/primitives";
export interface Cobro { Cobro_ID: UUID; Alumno_ID: UUID; Mes_Abonado: string; Fecha_Pago: ISODate | null; Importe: number; Estado_Pago: string; Medio_Pago: string; }
