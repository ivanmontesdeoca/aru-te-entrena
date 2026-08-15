import "server-only";
import { GoogleSheetsAlumnoRepository,GoogleSheetsEjercicioRepository,GoogleSheetsRutinaEjercicioRepository,GoogleSheetsRutinaSesionRepository } from "@/infrastructure/sheets/repositories";
import { createAiPlanningService } from "../application/ai-planning-service";
import { OpenAiPlanningGateway } from "./openai-planning-gateway";
export function getAiPlanningService(){return createAiPlanningService({alumnos:new GoogleSheetsAlumnoRepository(),catalog:new GoogleSheetsEjercicioRepository(),sessions:new GoogleSheetsRutinaSesionRepository(),items:new GoogleSheetsRutinaEjercicioRepository(),ai:new OpenAiPlanningGateway()});}
