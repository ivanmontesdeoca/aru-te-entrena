import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cert, deleteApp, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirebaseAdminAuth } from "@/infrastructure/firebase/admin";
import { GoogleSheetsUsuarioRepository } from "@/infrastructure/sheets/repositories";
import { AuthService } from "@/modules/auth/application/auth-service";
import { AuthError } from "@/modules/auth/domain/errors";

describe("Firebase Admin and Usuarios integration", () => {
  it("resolves ADMIN, enforces Activo and rejects invalid sessions", async () => {
    const firebase = getFirebaseAdminAuth();
    const usuarios = new GoogleSheetsUsuarioRepository();
    const admins = (await usuarios.findAll()).filter(
      (usuario) => usuario.Rol === "ADMIN" && usuario.Activo,
    );
    assert.equal(admins.length, 1, "Expected exactly one active ADMIN for this integration test");
    const admin = admins[0];
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    assert.ok(credentialsPath, "GOOGLE_APPLICATION_CREDENTIALS is required");
    const signerApp = initializeApp(
      {
        credential: cert(credentialsPath),
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      },
      "integration-token-signer",
    );
    const customToken = await getAuth(signerApp).createCustomToken(admin.UID_Auth);
    await deleteApp(signerApp);
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${encodeURIComponent(process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "")}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: customToken, returnSecureToken: true }),
      },
    );
    assert.equal(response.ok, true, "Custom-token exchange failed");
    const payload = (await response.json()) as { idToken: string };
    const service = new AuthService(firebase, usuarios);
    const session = await service.createSession(payload.idToken);
    assert.equal(session.user.role, "ADMIN");
    assert.equal(session.user.usuarioId, admin.Usuario_ID);
    assert.equal((await service.resolveSession(session.cookie, "ADMIN")).role, "ADMIN");

    try {
      await usuarios.setActive(admin.Usuario_ID, false);
      await assert.rejects(
        () => service.resolveSession(session.cookie),
        (error: unknown) => error instanceof AuthError && error.code === "USER_INACTIVE",
      );
    } finally {
      await usuarios.setActive(admin.Usuario_ID, true);
    }

    assert.equal((await service.resolveSession(session.cookie, "ADMIN")).role, "ADMIN");
    await assert.rejects(
      () => service.resolveSession("invalid-session"),
      (error: unknown) => error instanceof AuthError && error.code === "INVALID_SESSION",
    );
  });
});
