import type { ISODate, UUID } from "@/modules/shared/domain/primitives";
export interface Alumno { Alumno_ID: UUID; Documento: string; Nombre: string; Apellido: string; Fecha_Nacimiento: ISODate; Celular: string; Mail: string; Fecha_Alta: ISODate; Objetivo: string; Dolencia: string; Observaciones: string; }
