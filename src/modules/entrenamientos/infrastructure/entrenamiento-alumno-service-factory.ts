import "server-only";
import { GoogleSheetsEjercicioRepository, GoogleSheetsRutinaEjercicioRepository, GoogleSheetsRutinaSesionRepository } from "@/infrastructure/sheets/repositories";
import { createEntrenamientoAlumnoService } from "../application/entrenamiento-alumno-service";
export function getEntrenamientoAlumnoService() { return createEntrenamientoAlumnoService({ sessions: new GoogleSheetsRutinaSesionRepository(), items: new GoogleSheetsRutinaEjercicioRepository(), catalog: new GoogleSheetsEjercicioRepository() }); }
