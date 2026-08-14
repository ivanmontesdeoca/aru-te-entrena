import type { EntityRepository, UUID } from "@/modules/shared/domain/primitives";
import type { RegistroProgreso } from "./registro-progreso";
export interface RegistroProgresoRepository extends EntityRepository<RegistroProgreso> { findHistory(alumnoId: UUID, catalogoId: UUID): Promise<RegistroProgreso[]>; findLatest(alumnoId: UUID, catalogoId: UUID): Promise<RegistroProgreso | null>; }
