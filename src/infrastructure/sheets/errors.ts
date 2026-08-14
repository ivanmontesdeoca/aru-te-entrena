import type { SheetName } from "./sheet-names";

export class SheetsPersistenceError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = new.target.name;
  }
}

export class SheetStructureError extends SheetsPersistenceError {
  constructor(
    public readonly sheet: SheetName,
    public readonly missingHeaders: string[],
    public readonly unexpectedHeaders: string[],
    public readonly duplicateHeaders: string[],
  ) {
    super(
      `Invalid headers in ${sheet}. Missing: ${missingHeaders.join(", ") || "none"}; ` +
        `unexpected: ${unexpectedHeaders.join(", ") || "none"}; ` +
        `duplicates: ${duplicateHeaders.join(", ") || "none"}`,
    );
  }
}

export class DuplicateEntityIdError extends SheetsPersistenceError {
  constructor(
    public readonly sheet: SheetName,
    public readonly id: string,
    public readonly rowNumbers: number[],
  ) {
    super(`Duplicate ID ${id} in ${sheet} at rows ${rowNumbers.join(", ")}`);
  }
}

export class InvalidSheetRowError extends SheetsPersistenceError {
  constructor(
    public readonly sheet: SheetName,
    public readonly rowNumber: number,
    public readonly issues: string[],
    options?: ErrorOptions,
  ) {
    super(`Invalid row ${rowNumber} in ${sheet}: ${issues.join("; ")}`, options);
  }
}

export class EntityNotFoundError extends SheetsPersistenceError {
  constructor(
    public readonly sheet: SheetName,
    public readonly id: string,
  ) {
    super(`Entity ${id} was not found in ${sheet}`);
  }
}

export class UnsupportedRepositoryOperationError extends SheetsPersistenceError {}
