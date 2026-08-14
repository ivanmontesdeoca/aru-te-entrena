import { ZodError } from "zod";
import type { EntityRepository } from "@/modules/shared/domain/primitives";
import type { SheetCell, SheetsDataSource, SheetTable } from "./data-source";
import {
  DuplicateEntityIdError,
  EntityNotFoundError,
  InvalidSheetRowError,
  SheetStructureError,
} from "./errors";
import type { EntitySheetMapper, SheetRecord } from "./mapper";
import type { SheetName } from "./sheet-names";

interface LoadedEntity<TEntity> {
  entity: TEntity;
  id: string;
  rowNumber: number;
}

export class GoogleSheetsRepository<TEntity> implements EntityRepository<TEntity> {
  constructor(
    protected readonly dataSource: SheetsDataSource,
    protected readonly sheet: SheetName,
    protected readonly mapper: EntitySheetMapper<TEntity>,
  ) {}

  async findAll(): Promise<TEntity[]> {
    return (await this.loadEntities()).map(({ entity }) => entity);
  }

  async findById(id: string): Promise<TEntity | null> {
    return (await this.loadEntities()).find((item) => item.id === id)?.entity ?? null;
  }

  async create(entity: TEntity): Promise<void> {
    const table = await this.loadTable();
    const loaded = this.mapEntities(table);
    const record = this.mapper.toRecord(entity);
    const id = String(record[this.mapper.idHeader] ?? "");
    const duplicate = loaded.find((item) => item.id === id);
    if (duplicate) throw new DuplicateEntityIdError(this.sheet, id, [duplicate.rowNumber]);
    await this.dataSource.appendRow(this.sheet, this.recordToRow(record, table.headers));
  }

  async update(entity: TEntity): Promise<void> {
    const table = await this.loadTable();
    const loaded = this.mapEntities(table);
    const record = this.mapper.toRecord(entity);
    const id = String(record[this.mapper.idHeader] ?? "");
    const current = loaded.find((item) => item.id === id);
    if (!current) throw new EntityNotFoundError(this.sheet, id);
    await this.dataSource.updateRow(
      this.sheet,
      current.rowNumber,
      this.recordToRow(record, table.headers),
    );
  }

  async save(entity: TEntity): Promise<void> {
    const record = this.mapper.toRecord(entity);
    const id = String(record[this.mapper.idHeader] ?? "");
    if (await this.findById(id)) await this.update(entity);
    else await this.create(entity);
  }

  protected async loadEntities(): Promise<Array<LoadedEntity<TEntity>>> {
    return this.mapEntities(await this.loadTable());
  }

  protected async loadTable(): Promise<SheetTable> {
    const table = await this.dataSource.readTable(this.sheet);
    this.validateHeaders(table.headers);
    return table;
  }

  private validateHeaders(actualHeaders: string[]): void {
    const duplicates = actualHeaders.filter(
      (header, index) => header && actualHeaders.indexOf(header) !== index,
    );
    const expected = [...this.mapper.headers];
    const missing = expected.filter((header) => !actualHeaders.includes(header));
    const unexpected = actualHeaders.filter((header) => header && !expected.includes(header));
    if (missing.length || unexpected.length || duplicates.length) {
      throw new SheetStructureError(this.sheet, missing, unexpected, [...new Set(duplicates)]);
    }
  }

  private mapEntities(table: SheetTable): Array<LoadedEntity<TEntity>> {
    const loaded: Array<LoadedEntity<TEntity>> = [];
    const ids = new Map<string, number[]>();
    for (const row of table.rows) {
      if (row.values.every((value) => value === null || String(value).trim() === "")) continue;
      const record = this.rowToRecord(table.headers, row.values);
      try {
        const entity = this.mapper.fromRecord(record);
        const id = String(record[this.mapper.idHeader] ?? "").trim();
        loaded.push({ entity, id, rowNumber: row.rowNumber });
        ids.set(id, [...(ids.get(id) ?? []), row.rowNumber]);
      } catch (error) {
        const issues =
          error instanceof ZodError
            ? error.issues.map((issue) => `${issue.path.join(".") || "row"}: ${issue.message}`)
            : [error instanceof Error ? error.message : "Unknown mapping error"];
        throw new InvalidSheetRowError(this.sheet, row.rowNumber, issues, { cause: error });
      }
    }
    for (const [id, rowNumbers] of ids) {
      if (rowNumbers.length > 1) throw new DuplicateEntityIdError(this.sheet, id, rowNumbers);
    }
    return loaded;
  }

  private rowToRecord(headers: string[], values: SheetCell[]): SheetRecord {
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  }

  private recordToRow(record: SheetRecord, headers: string[]): SheetCell[] {
    return headers.map((header) => record[header] ?? "");
  }
}
