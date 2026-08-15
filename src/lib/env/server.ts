import "server-only";
import { z } from "zod";

const firebaseAdminEnvSchema = z
  .object({
    FIREBASE_ADMIN_PROJECT_ID: z.string().min(1),
    GOOGLE_APPLICATION_CREDENTIALS: z.string().min(1).optional(),
    FIREBASE_ADMIN_CLIENT_EMAIL: z.string().email().optional(),
    FIREBASE_ADMIN_PRIVATE_KEY: z.string().min(1).optional(),
  })
  .superRefine((env, context) => {
    const hasApplicationCredentials = Boolean(env.GOOGLE_APPLICATION_CREDENTIALS);
    const hasLegacyCredentials = Boolean(
      env.FIREBASE_ADMIN_CLIENT_EMAIL && env.FIREBASE_ADMIN_PRIVATE_KEY,
    );
    if (!hasApplicationCredentials && !hasLegacyCredentials) {
      context.addIssue({
        code: "custom",
        message:
          "Configure GOOGLE_APPLICATION_CREDENTIALS or both legacy Firebase Admin variables",
      });
    }
  });

const googleSheetsEnvSchema = z
  .object({
  GOOGLE_SHEETS_SPREADSHEET_ID: z.string().min(1),
    GOOGLE_APPLICATION_CREDENTIALS: z.string().min(1).optional(),
    GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL: z.string().email().optional(),
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: z.string().min(1).optional(),
  })
  .superRefine((env, context) => {
    const hasApplicationCredentials = Boolean(env.GOOGLE_APPLICATION_CREDENTIALS);
    const hasLegacyCredentials = Boolean(
      env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL && env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    );

    if (!hasApplicationCredentials && !hasLegacyCredentials) {
      context.addIssue({
        code: "custom",
        message:
          "Configure GOOGLE_APPLICATION_CREDENTIALS or both legacy service account variables",
      });
    }
  });

export function getFirebaseAdminEnv() {
  const env = firebaseAdminEnvSchema.parse(process.env);
  return {
    ...env,
    FIREBASE_ADMIN_PRIVATE_KEY: env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };
}

export function getGoogleSheetsEnv() {
  const env = googleSheetsEnvSchema.parse(process.env);
  return {
    ...env,
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n",
    ),
  };
}
