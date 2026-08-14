import type { EntityRepository, UUID } from "@/modules/shared/domain/primitives";
import type { RutinaEjercicio, RutinaSesion } from "./rutina";
export interface RutinaSesionRepository extends EntityRepository<RutinaSesion> { findByAlumno(alumnoId: UUID): Promise<RutinaSesion[]>; markCompleted(id: UUID, completedAt: string): Promise<void>; }
export interface RutinaEjercicioRepository extends EntityRepository<RutinaEjercicio> { findBySesion(rutinaSesionId: UUID): Promise<RutinaEjercicio[]>; replaceForSesion(rutinaSesionId: UUID, ejercicios: RutinaEjercicio[]): Promise<void>; }
