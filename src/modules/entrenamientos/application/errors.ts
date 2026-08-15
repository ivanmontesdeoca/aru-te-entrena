export class EntrenamientoAlumnoError extends Error {
  constructor(public readonly code: "RUTINA_NOT_FOUND" | "RUTINA_FORBIDDEN", public readonly status = 404) { super(code); }
}
