import "server-only";
import { GoogleSheetsEjercicioRepository, GoogleSheetsRegistroProgresoRepository, GoogleSheetsRutinaEjercicioRepository, GoogleSheetsRutinaSesionRepository } from "@/infrastructure/sheets/repositories";
import { createProgresoService } from "../application/progreso-service";
export function getProgresoService() { return createProgresoService({ progress: new GoogleSheetsRegistroProgresoRepository(), items: new GoogleSheetsRutinaEjercicioRepository(), sessions: new GoogleSheetsRutinaSesionRepository(), catalog: new GoogleSheetsEjercicioRepository() }); }
