import type { SheetName } from "./sheet-names";

export type SheetCell = string | number | boolean | null;

export interface SheetTable {
  headers: string[];
  rows: Array<{ rowNumber: number; values: SheetCell[] }>;
}

export interface SheetsDataSource {
  readTable(sheet: SheetName): Promise<SheetTable>;
  appendRow(sheet: SheetName, values: readonly SheetCell[]): Promise<void>;
  updateRow(sheet: SheetName, rowNumber: number, values: readonly SheetCell[]): Promise<void>;
}
