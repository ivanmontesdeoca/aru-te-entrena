import { AuthError } from "../domain/errors";
import { getAppOrigin } from "@/lib/env/server";

export function hasTrustedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";
  try {
    const expectedOrigin = process.env.NODE_ENV === "production"
      ? getAppOrigin()
      : new URL(request.url).origin;
    return Boolean(expectedOrigin) && new URL(origin).origin === expectedOrigin;
  } catch {
    return false;
  }
}

export function assertTrustedRequestOrigin(request: Request): void {
  if (!hasTrustedOrigin(request)) throw new AuthError("UNTRUSTED_ORIGIN", 403);
}
