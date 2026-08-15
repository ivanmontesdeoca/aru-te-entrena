export type AlumnoAdminErrorCode =
  | "ALUMNO_NOT_FOUND"
  | "ACCESS_ALREADY_EXISTS"
  | "EMAIL_ALREADY_EXISTS"
  | "ACCESS_NOT_FOUND"
  | "FIREBASE_EMAIL_EXISTS";

export class AlumnoAdminError extends Error {
  constructor(public readonly code: AlumnoAdminErrorCode, public readonly status: number) {
    super(code);
    this.name = "AlumnoAdminError";
  }
}
