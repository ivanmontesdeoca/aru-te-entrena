import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { describe, it } from "node:test";
import type { Alumno } from "@/modules/alumnos/domain/alumno";
import { GoogleSheetsRepository } from "@/infrastructure/sheets/base-repository";
import type {
  SheetCell,
  SheetsDataSource,
  SheetTable,
} from "@/infrastructure/sheets/data-source";
import { alumnoMapper } from "@/infrastructure/sheets/entity-mappers";
import {
  DuplicateEntityIdError,
  InvalidSheetRowError,
  SheetStructureError,
} from "@/infrastructure/sheets/errors";
import { SHEET_NAMES, type SheetName } from "@/infrastructure/sheets/sheet-names";

class MemorySheetsDataSource implements SheetsDataSource {
  appended: SheetCell[][] = [];
  updated: Array<{ rowNumber: number; values: SheetCell[] }> = [];

  constructor(public table: SheetTable) {}

  async readTable(_sheet: SheetName): Promise<SheetTable> {
    void _sheet;
    return structuredClone(this.table);
  }

  async appendRow(_sheet: SheetName, values: readonly SheetCell[]): Promise<void> {
    this.appended.push([...values]);
  }

  async updateRow(
    _sheet: SheetName,
    rowNumber: number,
    values: readonly SheetCell[],
  ): Promise<void> {
    this.updated.push({ rowNumber, values: [...values] });
  }

  async batchUpdateRows(
    sheet: SheetName,
    rows: ReadonlyArray<{ rowNumber: number; values: readonly SheetCell[] }>,
  ): Promise<void> {
    for (const row of rows) await this.updateRow(sheet, row.rowNumber, row.values);
  }
}

const alumnoId = randomUUID();
const alumno: Alumno = {
  Alumno_ID: alumnoId,
  Documento: "ARU_TEST_DOC",
  Nombre: "ARU_TEST",
  Apellido: "Persistencia",
  Fecha_Nacimiento: "1990-01-01",
  Celular: "000000",
  Mail: "aru.test@example.invalid",
  Fecha_Alta: "2026-08-14",
  Objetivo: "Prueba",
  Dolencia: "",
  Observaciones: "ARU_TEST",
};

function rowFor(entity: Alumno, headers = [...alumnoMapper.headers]): SheetCell[] {
  const record = alumnoMapper.toRecord(entity);
  return headers.map((header) => record[header] ?? "");
}

describe("GoogleSheetsRepository", () => {
  it("maps rows by header name even when columns are reordered", async () => {
    const headers = [...alumnoMapper.headers].reverse();
    const source = new MemorySheetsDataSource({
      headers,
      rows: [{ rowNumber: 2, values: rowFor(alumno, headers) }],
    });
    const repository = new GoogleSheetsRepository(source, SHEET_NAMES.alumnos, alumnoMapper);
    assert.deepEqual(await repository.findById(alumnoId), alumno);
  });

  it("reports missing headers", async () => {
    const source = new MemorySheetsDataSource({ headers: ["Alumno_ID"], rows: [] });
    const repository = new GoogleSheetsRepository(source, SHEET_NAMES.alumnos, alumnoMapper);
    await assert.rejects(() => repository.findAll(), SheetStructureError);
  });

  it("reports duplicated IDs and their rows", async () => {
    const headers = [...alumnoMapper.headers];
    const source = new MemorySheetsDataSource({
      headers,
      rows: [
        { rowNumber: 2, values: rowFor(alumno) },
        { rowNumber: 5, values: rowFor(alumno) },
      ],
    });
    const repository = new GoogleSheetsRepository(source, SHEET_NAMES.alumnos, alumnoMapper);
    await assert.rejects(
      () => repository.findAll(),
      (error: unknown) =>
        error instanceof DuplicateEntityIdError && error.rowNumbers.join(",") === "2,5",
    );
  });

  it("reports invalid rows with the physical row number", async () => {
    const headers = [...alumnoMapper.headers];
    const invalid = { ...alumno, Mail: "not-an-email" };
    const source = new MemorySheetsDataSource({
      headers,
      rows: [{ rowNumber: 7, values: rowFor(invalid) }],
    });
    const repository = new GoogleSheetsRepository(source, SHEET_NAMES.alumnos, alumnoMapper);
    await assert.rejects(
      () => repository.findAll(),
      (error: unknown) => error instanceof InvalidSheetRowError && error.rowNumber === 7,
    );
  });

  it("creates rows following the live header order", async () => {
    const headers = [...alumnoMapper.headers].reverse();
    const source = new MemorySheetsDataSource({ headers, rows: [] });
    const repository = new GoogleSheetsRepository(source, SHEET_NAMES.alumnos, alumnoMapper);
    await repository.create(alumno);
    assert.deepEqual(source.appended[0], rowFor(alumno, headers));
  });

  it("updates the exact row containing the entity ID", async () => {
    const headers = [...alumnoMapper.headers];
    const source = new MemorySheetsDataSource({
      headers,
      rows: [{ rowNumber: 9, values: rowFor(alumno) }],
    });
    const repository = new GoogleSheetsRepository(source, SHEET_NAMES.alumnos, alumnoMapper);
    const updated = { ...alumno, Objetivo: "ARU_TEST_UPDATED" };
    await repository.update(updated);
    assert.equal(source.updated[0]?.rowNumber, 9);
    assert.deepEqual(source.updated[0]?.values, rowFor(updated));
  });
});
