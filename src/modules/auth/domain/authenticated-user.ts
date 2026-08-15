import type { UUID, Role } from "@/modules/shared/domain/primitives";

export interface AuthenticatedUser {
  usuarioId: UUID;
  uidAuth: string;
  email: string;
  role: Role;
  alumnoId: UUID | null;
}
