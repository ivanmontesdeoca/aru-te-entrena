import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, describe, it } from "node:test";
import { google } from "googleapis";
import type { Alumno } from "@/modules/alumnos/domain/alumno";
import type { Cobro } from "@/modules/cobros/domain/cobro";
import type { Ejercicio } from "@/modules/ejercicios/domain/ejercicio";
import type { PlantillaEjercicio, PlantillaSesion } from "@/modules/plantillas/domain/plantilla";
import type { RegistroProgreso } from "@/modules/progresos/domain/registro-progreso";
import type { RutinaEjercicio, RutinaSesion } from "@/modules/rutinas/domain/rutina";
import type { Usuario } from "@/modules/usuarios/domain/usuario";
import {
  GoogleSheetsAlumnoRepository,
  GoogleSheetsCobroRepository,
  GoogleSheetsEjercicioRepository,
  GoogleSheetsPlantillaEjercicioRepository,
  GoogleSheetsPlantillaSesionRepository,
  GoogleSheetsRegistroProgresoRepository,
  GoogleSheetsRutinaEjercicioRepository,
  GoogleSheetsRutinaSesionRepository,
  GoogleSheetsUsuarioRepository,
} from "@/infrastructure/sheets/repositories";
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
} from "@/infrastructure/sheets/entity-mappers";
import { SHEET_NAMES, type SheetName } from "@/infrastructure/sheets/sheet-names";

interface LifecycleRepository<TEntity> {
  findAll(): Promise<TEntity[]>;
  findById(id: string): Promise<TEntity | null>;
  create(entity: TEntity): Promise<void>;
  update(entity: TEntity): Promise<void>;
}

const created: Array<{ sheet: SheetName; id: string; columnCount: number }> = [];

async function verifyLifecycle<TEntity>(
  repository: LifecycleRepository<TEntity>,
  sheet: SheetName,
  columnCount: number,
  id: string,
  initial: TEntity,
  updated: TEntity,
  verifyUpdated: (entity: TEntity) => void,
): Promise<void> {
  created.push({ sheet, id, columnCount });
  await repository.create(initial);
  assert.ok((await repository.findAll()).length > 0);
  assert.ok(await repository.findById(id));
  await repository.update(updated);
  const recovered = await repository.findById(id);
  assert.ok(recovered);
  verifyUpdated(recovered);
}

function columnName(columnNumber: number): string {
  let result = "";
  for (let current = columnNumber; current > 0; current = Math.floor((current - 1) / 26)) {
    result = String.fromCharCode(((current - 1) % 26) + 65) + result;
  }
  return result;
}

async function cleanupCreatedRows(): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID is required");
  const auth = new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const api = google.sheets({ version: "v4", auth });
  for (const item of created) {
    const response = await api.spreadsheets.values.get({
      spreadsheetId,
      range: `'${item.sheet}'!A2:A`,
    });
    const rows = response.data.values ?? [];
    const indexes = rows
      .map((row, index) => ({ id: String(row[0] ?? ""), rowNumber: index + 2 }))
      .filter((row) => row.id === item.id);
    for (const match of indexes) {
      await api.spreadsheets.values.clear({
        spreadsheetId,
        range: `'${item.sheet}'!A${match.rowNumber}:${columnName(item.columnCount)}${match.rowNumber}`,
      });
    }
  }
}

after(async () => {
  await cleanupCreatedRows();
});

describe("Google Sheets repositories integration", () => {
  it("creates, reads, lists and updates all nine entities", async () => {
    const alumnoId = randomUUID();
    const catalogoId = `ARU_TEST_CATALOG_${randomUUID()}`;
    const plantillaSesionId = randomUUID();
    const plantillaEjercicioId = randomUUID();
    const rutinaSesionId = randomUUID();
    const rutinaEjercicioId = randomUUID();

    const usuario: Usuario = {
      Usuario_ID: randomUUID(),
      Alumno_ID: alumnoId,
      Email: `aru.test.${randomUUID()}@example.invalid`,
      Rol: "ALUMNO",
      Activo: true,
      UID_Auth: `ARU_TEST_UID_${randomUUID()}`,
    };
    await verifyLifecycle(
      new GoogleSheetsUsuarioRepository(),
      SHEET_NAMES.usuarios,
      usuarioMapper.headers.length,
      usuario.Usuario_ID,
      usuario,
      { ...usuario, Activo: false },
      (value) => assert.equal(value.Activo, false),
    );

    const alumno: Alumno = {
      Alumno_ID: alumnoId,
      Documento: `ARU_TEST_${randomUUID()}`,
      Nombre: "ARU_TEST",
      Apellido: "Persistencia",
      Fecha_Nacimiento: "1990-01-01",
      Celular: "0000000000",
      Mail: `aru.test.${randomUUID()}@example.invalid`,
      Fecha_Alta: "2026-08-14",
      Objetivo: "ARU_TEST_CREATE",
      Dolencia: "",
      Observaciones: "Registro temporal de integración",
    };
    await verifyLifecycle(
      new GoogleSheetsAlumnoRepository(),
      SHEET_NAMES.alumnos,
      alumnoMapper.headers.length,
      alumno.Alumno_ID,
      alumno,
      { ...alumno, Objetivo: "ARU_TEST_UPDATE" },
      (value) => assert.equal(value.Objetivo, "ARU_TEST_UPDATE"),
    );

    const cobro: Cobro = {
      Cobro_ID: randomUUID(),
      Alumno_ID: alumnoId,
      Mes_Abonado: "2026-08",
      Fecha_Pago: "2026-08-14",
      Importe: 12345.67,
      Estado_Pago: "ARU_TEST",
      Medio_Pago: "ARU_TEST",
    };
    await verifyLifecycle(
      new GoogleSheetsCobroRepository(),
      SHEET_NAMES.cobros,
      cobroMapper.headers.length,
      cobro.Cobro_ID,
      cobro,
      { ...cobro, Importe: 23456.78 },
      (value) => assert.equal(value.Importe, 23456.78),
    );

    const ejercicio: Ejercicio = {
      Catalogo_ID: catalogoId,
      Tipo_de_Ejercicio: "ARU_TEST",
      Ejercicio: "ARU_TEST Ejercicio temporal",
      Video: "",
      Aclaraciones: "ARU_TEST_CREATE",
      Video_Adicional: "",
      Activo: true,
    };
    await verifyLifecycle(
      new GoogleSheetsEjercicioRepository(),
      SHEET_NAMES.catalogoEjercicios,
      ejercicioMapper.headers.length,
      ejercicio.Catalogo_ID,
      ejercicio,
      { ...ejercicio, Aclaraciones: "ARU_TEST_UPDATE" },
      (value) => assert.equal(value.Aclaraciones, "ARU_TEST_UPDATE"),
    );

    const plantillaSesion: PlantillaSesion = {
      Plantilla_Sesion_ID: plantillaSesionId,
      Fecha_Carga: "2026-08-14",
      Nombre_Plantilla: "ARU_TEST Plantilla temporal",
      Objetivo: "ARU_TEST",
      Grupo_Muscular_1: "ARU_TEST",
      Grupo_Muscular_2: "",
      Notas: "ARU_TEST_CREATE",
    };
    await verifyLifecycle(
      new GoogleSheetsPlantillaSesionRepository(),
      SHEET_NAMES.plantillaSesion,
      plantillaSesionMapper.headers.length,
      plantillaSesion.Plantilla_Sesion_ID,
      plantillaSesion,
      { ...plantillaSesion, Notas: "ARU_TEST_UPDATE" },
      (value) => assert.equal(value.Notas, "ARU_TEST_UPDATE"),
    );

    const plantillaEjercicio: PlantillaEjercicio = {
      Plantilla_Ejercicio_ID: plantillaEjercicioId,
      Plantilla_Sesion_ID: plantillaSesionId,
      Tipo_Bloque: "ARU_TEST",
      Orden_Bloque: 1,
      Orden_Ejercicio: 1,
      Catalogo_ID: catalogoId,
      Reps_Tiempo: "10",
      Series: "3",
      Carga: "ARU_TEST_CREATE",
      Descanso: "60",
      RIR: "2",
      Observaciones: "ARU_TEST",
    };
    await verifyLifecycle(
      new GoogleSheetsPlantillaEjercicioRepository(),
      SHEET_NAMES.plantillaEjercicio,
      plantillaEjercicioMapper.headers.length,
      plantillaEjercicio.Plantilla_Ejercicio_ID,
      plantillaEjercicio,
      { ...plantillaEjercicio, Carga: "ARU_TEST_UPDATE" },
      (value) => assert.equal(value.Carga, "ARU_TEST_UPDATE"),
    );

    const rutinaSesion: RutinaSesion = {
      Rutina_Sesion_ID: rutinaSesionId,
      Alumno_ID: alumnoId,
      Dia_Entrenamiento_Semana: "Día 1",
      Fecha: "2026-08-14",
      Titulo: "ARU_TEST_CREATE",
      Notas_Generales: "ARU_TEST",
      Plantilla_Sesion_Origen_ID: plantillaSesionId,
      Entrenamiento_Completado: false,
      Fecha_Completado: null,
    };
    await verifyLifecycle(
      new GoogleSheetsRutinaSesionRepository(),
      SHEET_NAMES.rutinaSesion,
      rutinaSesionMapper.headers.length,
      rutinaSesion.Rutina_Sesion_ID,
      rutinaSesion,
      { ...rutinaSesion, Titulo: "ARU_TEST_UPDATE" },
      (value) => assert.equal(value.Titulo, "ARU_TEST_UPDATE"),
    );

    const rutinaEjercicio: RutinaEjercicio = {
      Rutina_Ejercicio_ID: rutinaEjercicioId,
      Rutina_Sesion_ID: rutinaSesionId,
      Catalogo_ID: catalogoId,
      Tipo_Bloque: "ARU_TEST",
      Orden_Bloque: 1,
      Orden_Ejercicio: 1,
      Instrumento_Alternativo: "",
      Reps_Tiempo: "10",
      Series: "3",
      Carga: "10 kg",
      Descanso: "60",
      RIR: "2",
      Observaciones: "ARU_TEST_CREATE",
    };
    await verifyLifecycle(
      new GoogleSheetsRutinaEjercicioRepository(),
      SHEET_NAMES.rutinaEjercicio,
      rutinaEjercicioMapper.headers.length,
      rutinaEjercicio.Rutina_Ejercicio_ID,
      rutinaEjercicio,
      { ...rutinaEjercicio, Series: "4" },
      (value) => assert.equal(value.Series, "4"),
    );

    const progreso: RegistroProgreso = {
      Registro_ID: randomUUID(),
      Alumno_ID: alumnoId,
      Rutina_Ejercicio_ID: rutinaEjercicioId,
      Catalogo_ID: catalogoId,
      Fecha_Registro: "2026-08-14T12:00:00.000Z",
      Meta_Peso: 10.5,
      Meta_Repeticiones: 8,
      Meta_Tiempo: 60.25,
    };
    await verifyLifecycle(
      new GoogleSheetsRegistroProgresoRepository(),
      SHEET_NAMES.registroProgreso,
      registroProgresoMapper.headers.length,
      progreso.Registro_ID,
      progreso,
      { ...progreso, Meta_Peso: 11.5 },
      (value) => assert.equal(value.Meta_Peso, 11.5),
    );
  });
});
