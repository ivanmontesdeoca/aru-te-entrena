import "server-only";
import { GoogleSheetsEjercicioRepository } from "@/infrastructure/sheets/repositories";
import { createEjercicioAdminService } from "../application/ejercicio-admin-service";
export function getEjercicioAdminService(){return createEjercicioAdminService(new GoogleSheetsEjercicioRepository());}
