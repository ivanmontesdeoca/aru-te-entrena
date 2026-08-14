import type { CatalogoId, ISODate, UUID } from "@/modules/shared/domain/primitives";
export interface PlantillaSesion { Plantilla_Sesion_ID: UUID; Fecha_Carga: ISODate; Nombre_Plantilla: string; Objetivo: string; Grupo_Muscular_1: string; Grupo_Muscular_2: string; Notas: string; }
export interface PlantillaEjercicio { Plantilla_Ejercicio_ID: UUID; Plantilla_Sesion_ID: UUID; Tipo_Bloque: string; Orden_Bloque: number; Orden_Ejercicio: number; Catalogo_ID: CatalogoId; Reps_Tiempo: string; Series: string; Carga: string; Descanso: string; RIR: string; Observaciones: string; }
