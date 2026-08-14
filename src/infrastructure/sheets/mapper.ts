import type { ZodType } from "zod";
import type { SheetCell } from "./data-source";

export type SheetRecord = Record<string, SheetCell>;

export interface EntitySheetMapper<TEntity> {
  readonly headers: readonly string[];
  readonly idHeader: string;
  fromRecord(record: SheetRecord): TEntity;
  toRecord(entity: TEntity): SheetRecord;
}

export function parseBoolean(value: SheetCell): boolean {
  if (typeof value === "boolean") return value;
  const normalized = String(value).trim().toUpperCase();
  if (["TRUE", "VERDADERO", "1"].includes(normalized)) return true;
  if (["FALSE", "FALSO", "0"].includes(normalized)) return false;
  throw new Error(`Expected boolean, received ${String(value)}`);
}

export function parseNumber(value: SheetCell): number {
  if (typeof value === "number") return value;
  const normalized = String(value).trim().replace(",", ".");
  if (!normalized) throw new Error("Expected number, received an empty value");
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) throw new Error(`Expected number, received ${String(value)}`);
  return parsed;
}

export function parseNullableNumber(value: SheetCell): number | null {
  return value === null || String(value).trim() === "" ? null : parseNumber(value);
}

export function parseNullableString(value: SheetCell): string | null {
  const parsed = value === null ? "" : String(value).trim();
  return parsed ? parsed : null;
}

export function asString(value: SheetCell): string {
  return value === null ? "" : String(value).trim();
}

export function validateEntity<TEntity>(schema: ZodType<TEntity>, candidate: unknown): TEntity {
  return schema.parse(candidate);
}

export function toSheetCell(value: unknown): SheetCell {
  if (value === null || value === undefined) return "";
  if (["string", "number", "boolean"].includes(typeof value)) return value as SheetCell;
  throw new Error(`Unsupported sheet cell type: ${typeof value}`);
}
