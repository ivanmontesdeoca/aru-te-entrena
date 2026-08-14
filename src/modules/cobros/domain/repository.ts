import type { EntityRepository, UUID } from "@/modules/shared/domain/primitives";
import type { Cobro } from "./cobro";
export interface CobroRepository extends EntityRepository<Cobro> { findByAlumno(alumnoId: UUID): Promise<Cobro[]>; }
