import type { AlumnoRepository } from "@/modules/alumnos/domain/repository";
import type { CobroRepository } from "@/modules/cobros/domain/repository";
import type { EjercicioRepository } from "@/modules/ejercicios/domain/repository";
import type {
  PlantillaEjercicioRepository,
  PlantillaSesionRepository,
} from "@/modules/plantillas/domain/repository";
import type {
  PlantillaEjercicio,
  PlantillaSesion,
} from "@/modules/plantillas/domain/plantilla";
import type { RegistroProgresoRepository } from "@/modules/progresos/domain/repository";
import type {
  RutinaEjercicioRepository,
  RutinaSesionRepository,
} from "@/modules/rutinas/domain/repository";
import type { RutinaEjercicio, RutinaSesion } from "@/modules/rutinas/domain/rutina";
import type { UUID } from "@/modules/shared/domain/primitives";
import type { UsuarioRepository } from "@/modules/usuarios/domain/repository";
import { GoogleSheetsRepository } from "./base-repository";
import type { SheetsDataSource } from "./data-source";
import {
  alumnoMapper,
  cobroMapper,
  ejercicioMapper,
  plantillaEjercicioMapper,
  plantillaSesionMapper,
  registroProgresoMapper,
  rutinaEjercicioMapper,
  rutinaSesionMapper,
  usuarioMapper,
} from "./entity-mappers";
import { UnsupportedRepositoryOperationError } from "./errors";
import { GoogleSheetsClient } from "./google-sheets-client";
import { SHEET_NAMES } from "./sheet-names";

function defaultDataSource(): SheetsDataSource {
  return new GoogleSheetsClient();
}

export class GoogleSheetsUsuarioRepository
  extends GoogleSheetsRepository<ReturnType<typeof usuarioMapper.fromRecord>>
  implements UsuarioRepository
{
  constructor(dataSource: SheetsDataSource = defaultDataSource()) {
    super(dataSource, SHEET_NAMES.usuarios, usuarioMapper);
  }

  async findByAuthUid(uid: string) {
    return (await this.findAll()).find((usuario) => usuario.UID_Auth === uid) ?? null;
  }

  async findByEmail(email: string) {
    const normalized = email.trim().toLowerCase();
    return (
      (await this.findAll()).find((usuario) => usuario.Email.toLowerCase() === normalized) ?? null
    );
  }

  async setActive(id: UUID, active: boolean): Promise<void> {
    const usuario = await this.findById(id);
    if (!usuario) return;
    await this.update({ ...usuario, Activo: active });
  }
}

export class GoogleSheetsAlumnoRepository
  extends GoogleSheetsRepository<ReturnType<typeof alumnoMapper.fromRecord>>
  implements AlumnoRepository
{
  constructor(dataSource: SheetsDataSource = defaultDataSource()) {
    super(dataSource, SHEET_NAMES.alumnos, alumnoMapper);
  }

  async search(term: string) {
    const normalized = term.trim().toLocaleLowerCase("es");
    if (!normalized) return this.findAll();
    return (await this.findAll()).filter((alumno) =>
      [alumno.Documento, alumno.Nombre, alumno.Apellido, alumno.Mail]
        .join(" ")
        .toLocaleLowerCase("es")
        .includes(normalized),
    );
  }
}

export class GoogleSheetsCobroRepository
  extends GoogleSheetsRepository<ReturnType<typeof cobroMapper.fromRecord>>
  implements CobroRepository
{
  constructor(dataSource: SheetsDataSource = defaultDataSource()) {
    super(dataSource, SHEET_NAMES.cobros, cobroMapper);
  }

  async findByAlumno(alumnoId: UUID) {
    return (await this.findAll()).filter((cobro) => cobro.Alumno_ID === alumnoId);
  }
}

export class GoogleSheetsEjercicioRepository
  extends GoogleSheetsRepository<ReturnType<typeof ejercicioMapper.fromRecord>>
  implements EjercicioRepository
{
  constructor(dataSource: SheetsDataSource = defaultDataSource()) {
    super(dataSource, SHEET_NAMES.catalogoEjercicios, ejercicioMapper);
  }

  async findAll(options?: { includeArchived?: boolean }) {
    const ejercicios = await super.findAll();
    return options?.includeArchived ? ejercicios : ejercicios.filter((ejercicio) => ejercicio.Activo);
  }
}

export class GoogleSheetsPlantillaSesionRepository
  extends GoogleSheetsRepository<PlantillaSesion>
  implements PlantillaSesionRepository
{
  constructor(dataSource: SheetsDataSource = defaultDataSource()) {
    super(dataSource, SHEET_NAMES.plantillaSesion, plantillaSesionMapper);
  }
}

export class GoogleSheetsPlantillaEjercicioRepository
  extends GoogleSheetsRepository<PlantillaEjercicio>
  implements PlantillaEjercicioRepository
{
  constructor(dataSource: SheetsDataSource = defaultDataSource()) {
    super(dataSource, SHEET_NAMES.plantillaEjercicio, plantillaEjercicioMapper);
  }

  async findBySesion(plantillaSesionId: UUID) {
    return (await this.findAll())
      .filter((ejercicio) => ejercicio.Plantilla_Sesion_ID === plantillaSesionId)
      .sort(
        (left, right) =>
          left.Orden_Bloque - right.Orden_Bloque ||
          left.Orden_Ejercicio - right.Orden_Ejercicio,
      );
  }

  async replaceForSesion(
    plantillaSesionId: UUID,
    ejercicios: PlantillaEjercicio[],
  ): Promise<void> {
    const current = await this.findBySesion(plantillaSesionId);
    const nextIds = new Set(ejercicios.map((item) => item.Plantilla_Ejercicio_ID));
    const removed = current.filter((item) => !nextIds.has(item.Plantilla_Ejercicio_ID));
    if (removed.length) {
      throw new UnsupportedRepositoryOperationError(
        "replaceForSesion cannot remove rows because physical deletion is disabled",
      );
    }
    for (const ejercicio of ejercicios) await this.save(ejercicio);
  }
}

export class GoogleSheetsRutinaSesionRepository
  extends GoogleSheetsRepository<RutinaSesion>
  implements RutinaSesionRepository
{
  constructor(dataSource: SheetsDataSource = defaultDataSource()) {
    super(dataSource, SHEET_NAMES.rutinaSesion, rutinaSesionMapper);
  }

  async findByAlumno(alumnoId: UUID) {
    return (await this.findAll())
      .filter((rutina) => rutina.Alumno_ID === alumnoId)
      .sort((left, right) => left.Fecha.localeCompare(right.Fecha));
  }

  async markCompleted(id: UUID, completedAt: string): Promise<void> {
    const rutina = await this.findById(id);
    if (!rutina) return;
    await this.update({
      ...rutina,
      Entrenamiento_Completado: true,
      Fecha_Completado: completedAt,
    });
  }
}

export class GoogleSheetsRutinaEjercicioRepository
  extends GoogleSheetsRepository<RutinaEjercicio>
  implements RutinaEjercicioRepository
{
  constructor(dataSource: SheetsDataSource = defaultDataSource()) {
    super(dataSource, SHEET_NAMES.rutinaEjercicio, rutinaEjercicioMapper);
  }

  async findBySesion(rutinaSesionId: UUID) {
    return (await this.findAll())
      .filter((ejercicio) => ejercicio.Rutina_Sesion_ID === rutinaSesionId)
      .sort(
        (left, right) =>
          left.Orden_Bloque - right.Orden_Bloque ||
          left.Orden_Ejercicio - right.Orden_Ejercicio,
      );
  }

  async replaceForSesion(rutinaSesionId: UUID, ejercicios: RutinaEjercicio[]): Promise<void> {
    const current = await this.findBySesion(rutinaSesionId);
    const nextIds = new Set(ejercicios.map((item) => item.Rutina_Ejercicio_ID));
    const removed = current.filter((item) => !nextIds.has(item.Rutina_Ejercicio_ID));
    if (removed.length) {
      throw new UnsupportedRepositoryOperationError(
        "replaceForSesion cannot remove rows because physical deletion is disabled",
      );
    }
    for (const ejercicio of ejercicios) await this.save(ejercicio);
  }
}

export class GoogleSheetsRegistroProgresoRepository
  extends GoogleSheetsRepository<ReturnType<typeof registroProgresoMapper.fromRecord>>
  implements RegistroProgresoRepository
{
  constructor(dataSource: SheetsDataSource = defaultDataSource()) {
    super(dataSource, SHEET_NAMES.registroProgreso, registroProgresoMapper);
  }

  async findHistory(alumnoId: UUID, catalogoId: UUID) {
    return (await this.findAll())
      .filter(
        (registro) =>
          registro.Alumno_ID === alumnoId && registro.Catalogo_ID === catalogoId,
      )
      .sort((left, right) => right.Fecha_Registro.localeCompare(left.Fecha_Registro));
  }

  async findLatest(alumnoId: UUID, catalogoId: UUID) {
    return (await this.findHistory(alumnoId, catalogoId))[0] ?? null;
  }
}
