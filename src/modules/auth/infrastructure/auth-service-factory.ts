import "server-only";
import { getFirebaseAdminAuth } from "@/infrastructure/firebase/admin";
import { GoogleSheetsUsuarioRepository } from "@/infrastructure/sheets/repositories";
import { AuthService } from "../application/auth-service";

export function createAuthService(): AuthService {
  return new AuthService(getFirebaseAdminAuth(), new GoogleSheetsUsuarioRepository());
}
