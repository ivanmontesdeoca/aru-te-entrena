import type { EntityRepository } from "@/modules/shared/domain/primitives";
import type { Alumno } from "./alumno";
export interface AlumnoRepository extends EntityRepository<Alumno> { findAll(): Promise<Alumno[]>; search(term: string): Promise<Alumno[]>; }
