import type { UUID, Role } from "@/modules/shared/domain/primitives";
export interface Usuario { Usuario_ID: UUID; Alumno_ID: UUID | null; Email: string; Rol: Role; Activo: boolean; UID_Auth: string; }
