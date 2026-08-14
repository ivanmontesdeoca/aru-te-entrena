import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirebaseAdminEnv } from "@/lib/env/server";

export function getFirebaseAdminAuth() {
  const env = getFirebaseAdminEnv();
  const app = getApps()[0] ?? initializeApp({
    credential: cert({
      projectId: env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: env.FIREBASE_ADMIN_PRIVATE_KEY,
    }),
  });
  return getAuth(app);
}
