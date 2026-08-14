import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  FIREBASE_ADMIN_PROJECT_ID: z.string().min(1),
  FIREBASE_ADMIN_CLIENT_EMAIL: z.string().email(),
  FIREBASE_ADMIN_PRIVATE_KEY: z.string().min(1),
  GOOGLE_SHEETS_SPREADSHEET_ID: z.string().min(1),
  GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL: z.string().email(),
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: z.string().min(1),
});

export function getServerEnv() {
  const env = serverEnvSchema.parse(process.env);
  return {
    ...env,
    FIREBASE_ADMIN_PRIVATE_KEY: env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };
}
