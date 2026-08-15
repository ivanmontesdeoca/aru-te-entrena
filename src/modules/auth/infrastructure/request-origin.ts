import { AuthError } from "../domain/errors";

export function hasTrustedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function assertTrustedRequestOrigin(request: Request): void {
  if (!hasTrustedOrigin(request)) throw new AuthError("UNTRUSTED_ORIGIN", 403);
}
