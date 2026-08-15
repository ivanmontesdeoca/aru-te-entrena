export class EjercicioAdminError extends Error {
  constructor(public readonly code: "EJERCICIO_NOT_FOUND", public readonly status = 404) {
    super(code); this.name = "EjercicioAdminError";
  }
}
