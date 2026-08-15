export class CobroAdminError extends Error { constructor(public readonly code: "COBRO_NOT_FOUND" | "ALUMNO_NOT_FOUND", public readonly status = 404) { super(code); } }
