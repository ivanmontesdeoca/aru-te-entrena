import type { EntityRepository } from "@/modules/shared/domain/primitives";
import type { Ejercicio } from "./ejercicio";
export interface EjercicioRepository extends EntityRepository<Ejercicio> { findAll(options?: { includeArchived?: boolean }): Promise<Ejercicio[]>; }
