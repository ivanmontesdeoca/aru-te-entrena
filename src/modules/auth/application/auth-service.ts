import type { DecodedIdToken } from "firebase-admin/auth";
import type { Role } from "@/modules/shared/domain/primitives";
import type { UsuarioRepository } from "@/modules/usuarios/domain/repository";
import type { AuthenticatedUser } from "../domain/authenticated-user";
import { AuthError } from "../domain/errors";

export const SESSION_DURATION_MS = 5 * 24 * 60 * 60 * 1000;

export interface FirebaseSessionGateway {
  verifyIdToken(token: string, checkRevoked?: boolean): Promise<DecodedIdToken>;
  createSessionCookie(token: string, options: { expiresIn: number }): Promise<string>;
  verifySessionCookie(cookie: string, checkRevoked?: boolean): Promise<DecodedIdToken>;
}

export class AuthService {
  constructor(
    private readonly firebase: FirebaseSessionGateway,
    private readonly usuarios: UsuarioRepository,
  ) {}

  async createSession(idToken: string): Promise<{
    cookie: string;
    user: AuthenticatedUser;
  }> {
    let decoded: DecodedIdToken;
    try {
      decoded = await this.firebase.verifyIdToken(idToken, true);
    } catch (error) {
      throw new AuthError("INVALID_TOKEN", 401, { cause: error });
    }
    const user = await this.resolveUser(decoded.uid);
    const cookie = await this.firebase.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION_MS,
    });
    return { cookie, user };
  }

  async resolveSession(sessionCookie: string, requiredRole?: Role): Promise<AuthenticatedUser> {
    if (!sessionCookie) throw new AuthError("INVALID_SESSION", 401);
    let decoded: DecodedIdToken;
    try {
      decoded = await this.firebase.verifySessionCookie(sessionCookie, true);
    } catch (error) {
      throw new AuthError("INVALID_SESSION", 401, { cause: error });
    }
    const user = await this.resolveUser(decoded.uid);
    if (requiredRole && user.role !== requiredRole) {
      throw new AuthError("ROLE_FORBIDDEN", 403);
    }
    return user;
  }

  private async resolveUser(uid: string): Promise<AuthenticatedUser> {
    const matches = (await this.usuarios.findAll()).filter((usuario) => usuario.UID_Auth === uid);
    if (matches.length === 0) throw new AuthError("USER_NOT_REGISTERED", 403);
    if (matches.length > 1) throw new AuthError("DUPLICATE_AUTH_USER", 409);
    const usuario = matches[0];
    if (!usuario.Activo) throw new AuthError("USER_INACTIVE", 403);
    if (usuario.Rol === "ALUMNO" && !usuario.Alumno_ID) {
      throw new AuthError("ALUMNO_NOT_LINKED", 403);
    }
    return {
      usuarioId: usuario.Usuario_ID,
      uidAuth: usuario.UID_Auth,
      email: usuario.Email,
      role: usuario.Rol,
      alumnoId: usuario.Alumno_ID,
    };
  }
}
