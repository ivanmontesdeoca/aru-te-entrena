import type { EntityRepository, UUID } from "@/modules/shared/domain/primitives";
import type { PlantillaEjercicio, PlantillaSesion } from "./plantilla";
export interface PlantillaSesionRepository extends EntityRepository<PlantillaSesion> { findAll(): Promise<PlantillaSesion[]>; }
export interface PlantillaEjercicioRepository extends EntityRepository<PlantillaEjercicio> { findBySesion(plantillaSesionId: UUID): Promise<PlantillaEjercicio[]>; replaceForSesion(plantillaSesionId: UUID, ejercicios: PlantillaEjercicio[]): Promise<void>; }
