import "server-only";
import { GoogleSheetsAlumnoRepository, GoogleSheetsCobroRepository } from "@/infrastructure/sheets/repositories";
import { createCobroAdminService } from "../application/cobro-admin-service";
export function getCobroAdminService(){return createCobroAdminService({cobros:new GoogleSheetsCobroRepository(),alumnos:new GoogleSheetsAlumnoRepository()});}
