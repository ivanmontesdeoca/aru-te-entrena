import type { EntityRepository, UUID } from "@/modules/shared/domain/primitives";
import type { Usuario } from "./usuario";
export interface UsuarioRepository extends EntityRepository<Usuario> { findByAuthUid(uid: string): Promise<Usuario | null>; findByEmail(email: string): Promise<Usuario | null>; setActive(id: UUID, active: boolean): Promise<void>; }
