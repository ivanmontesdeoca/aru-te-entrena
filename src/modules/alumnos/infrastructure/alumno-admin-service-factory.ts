import "server-only";
import { getFirebaseAdminAuth } from "@/infrastructure/firebase/admin";
import { GoogleSheetsAlumnoRepository, GoogleSheetsUsuarioRepository } from "@/infrastructure/sheets/repositories";
import { createAlumnoAdminService } from "../application/alumno-admin-service";

export function getAlumnoAdminService() {
  const auth = getFirebaseAdminAuth();
  return createAlumnoAdminService({
    alumnos: new GoogleSheetsAlumnoRepository(),
    usuarios: new GoogleSheetsUsuarioRepository(),
    firebase: {
      createUser: async (email) => auth.createUser({ email, emailVerified: false, disabled: false }),
      deleteUser: (uid) => auth.deleteUser(uid),
      revokeRefreshTokens: (uid) => auth.revokeRefreshTokens(uid),
    },
  });
}
