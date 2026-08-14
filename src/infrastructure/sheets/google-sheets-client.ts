import "server-only";
import { google, type sheets_v4 } from "googleapis";
import { getServerEnv } from "@/lib/env/server";
import type { SheetName } from "./sheet-names";

export class GoogleSheetsClient {
  private readonly spreadsheetId: string;
  private readonly api: sheets_v4.Sheets;

  constructor() {
    const env = getServerEnv();
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
        private_key: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    this.spreadsheetId = env.GOOGLE_SHEETS_SPREADSHEET_ID;
    this.api = google.sheets({ version: "v4", auth });
  }

  async readRows(sheet: SheetName): Promise<string[][]> {
    const response = await this.api.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `'${sheet}'`,
    });
    return (response.data.values ?? []).map((row) => row.map(String));
  }

  async appendRow(sheet: SheetName, values: readonly unknown[]): Promise<void> {
    await this.api.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: `'${sheet}'!A:A`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [Array.from(values)] },
    });
  }

  async updateRow(sheet: SheetName, rowNumber: number, values: readonly unknown[]): Promise<void> {
    if (!Number.isInteger(rowNumber) || rowNumber < 2) throw new Error("Invalid data row number");
    await this.api.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `'${sheet}'!A${rowNumber}`,
      valueInputOption: "RAW",
      requestBody: { values: [Array.from(values)] },
    });
  }
}
