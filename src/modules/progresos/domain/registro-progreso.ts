import type { ISODateTime, UUID } from "@/modules/shared/domain/primitives";
export interface RegistroProgreso { Registro_ID: UUID; Alumno_ID: UUID; Rutina_Ejercicio_ID: UUID; Catalogo_ID: UUID; Fecha_Registro: ISODateTime; Meta_Peso: number | null; Meta_Repeticiones: number | null; Meta_Tiempo: number | null; }
