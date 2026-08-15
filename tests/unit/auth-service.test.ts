import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { describe, it } from "node:test";
import type { DecodedIdToken } from "firebase-admin/auth";
import { AuthService, type FirebaseSessionGateway } from "@/modules/auth/application/auth-service";
import { AuthError } from "@/modules/auth/domain/errors";
import type { Usuario } from "@/modules/usuarios/domain/usuario";
import type { UsuarioRepository } from "@/modules/usuarios/domain/repository";

class FakeFirebase implements FirebaseSessionGateway {
  async getUser(): Promise<{ customClaims?: Record<string, unknown> }> { return {}; }
  async verifyIdToken(token: string): Promise<DecodedIdToken> {
    if (token === "invalid") throw new Error("invalid");
    return { uid: token } as DecodedIdToken;
  }

  async createSessionCookie(token: string): Promise<string> {
    return `session:${token}`;
  }

  async verifySessionCookie(cookie: string): Promise<DecodedIdToken> {
    if (!cookie.startsWith("session:")) throw new Error("invalid");
    return { uid: cookie.slice("session:".length) } as DecodedIdToken;
  }
}

class MemoryUsuarioRepository implements UsuarioRepository {
  constructor(private readonly usuarios: Usuario[]) {}
  async findAll() { return this.usuarios; }
  async findById(id: string) { return this.usuarios.find((item) => item.Usuario_ID === id) ?? null; }
  async create(entity: Usuario) { this.usuarios.push(entity); }
  async update(entity: Usuario) { const index = this.usuarios.findIndex((item) => item.Usuario_ID === entity.Usuario_ID); if (index >= 0) this.usuarios[index] = entity; }
  async save(entity: Usuario) { if (await this.findById(entity.Usuario_ID)) await this.update(entity); else await this.create(entity); }
  async findByAuthUid(uid: string) { return this.usuarios.find((item) => item.UID_Auth === uid) ?? null; }
  async findByEmail(email: string) { return this.usuarios.find((item) => item.Email === email) ?? null; }
  async setActive(id: string, active: boolean) { const item = await this.findById(id); if (item) item.Activo = active; }
}

function usuario(overrides: Partial<Usuario> = {}): Usuario {
  return {
    Usuario_ID: randomUUID(),
    Alumno_ID: null,
    Email: "admin@example.invalid",
    Rol: "ADMIN",
    Activo: true,
    UID_Auth: "uid-admin",
    ...overrides,
  };
}

describe("AuthService", () => {
  it("creates a server session and resolves the ADMIN role", async () => {
    const service = new AuthService(new FakeFirebase(), new MemoryUsuarioRepository([usuario()]));
    const result = await service.createSession("uid-admin");
    assert.equal(result.cookie, "session:uid-admin");
    assert.equal(result.user.role, "ADMIN");
  });

  it("rejects an inactive user even with a valid Firebase session", async () => {
    const service = new AuthService(
      new FakeFirebase(),
      new MemoryUsuarioRepository([usuario({ Activo: false })]),
    );
    await assert.rejects(
      () => service.resolveSession("session:uid-admin"),
      (error: unknown) => error instanceof AuthError && error.code === "USER_INACTIVE",
    );
  });

  it("rejects duplicated UID mappings", async () => {
    const service = new AuthService(
      new FakeFirebase(),
      new MemoryUsuarioRepository([usuario(), usuario({ Usuario_ID: randomUUID() })]),
    );
    await assert.rejects(
      () => service.resolveSession("session:uid-admin"),
      (error: unknown) => error instanceof AuthError && error.code === "DUPLICATE_AUTH_USER",
    );
  });

  it("enforces role boundaries", async () => {
    const service = new AuthService(new FakeFirebase(), new MemoryUsuarioRepository([usuario()]));
    await assert.rejects(
      () => service.resolveSession("session:uid-admin", "ALUMNO"),
      (error: unknown) => error instanceof AuthError && error.code === "ROLE_FORBIDDEN",
    );
  });

  it("returns Alumno_ID only from the authenticated Usuarios mapping", async () => {
    const alumnoId = randomUUID();
    const service = new AuthService(
      new FakeFirebase(),
      new MemoryUsuarioRepository([
        usuario({ Rol: "ALUMNO", Alumno_ID: alumnoId, UID_Auth: "uid-alumno" }),
      ]),
    );
    const resolved = await service.resolveSession("session:uid-alumno", "ALUMNO");
    assert.equal(resolved.alumnoId, alumnoId);
  });

  it("rejects missing and invalid sessions", async () => {
    const service = new AuthService(new FakeFirebase(), new MemoryUsuarioRepository([usuario()]));
    await assert.rejects(() => service.resolveSession(""), AuthError);
    await assert.rejects(() => service.resolveSession("invalid"), AuthError);
  });
});
