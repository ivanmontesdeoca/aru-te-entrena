export type AuthErrorCode =
  | "INVALID_TOKEN"
  | "INVALID_SESSION"
  | "USER_NOT_REGISTERED"
  | "DUPLICATE_AUTH_USER"
  | "USER_INACTIVE"
  | "ROLE_FORBIDDEN"
  | "ALUMNO_NOT_LINKED"
  | "UNTRUSTED_ORIGIN";

export class AuthError extends Error {
  constructor(
    public readonly code: AuthErrorCode,
    public readonly status: 401 | 403 | 409,
    options?: ErrorOptions,
  ) {
    super(code, options);
    this.name = "AuthError";
  }
}
