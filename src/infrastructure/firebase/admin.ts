import "server-only";
import { applicationDefault, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirebaseAdminEnv } from "@/lib/env/server";

export function getFirebaseAdminAuth() {
  const env = getFirebaseAdminEnv();
  const credential = env.GOOGLE_APPLICATION_CREDENTIALS
    ? applicationDefault()
    : cert({
        projectId: env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: env.FIREBASE_ADMIN_PRIVATE_KEY,
      });
  const app =
    (getApps().some((candidate) => candidate.name === "[DEFAULT]") ? getApp() : null) ??
    initializeApp({
      credential,
      projectId: env.FIREBASE_ADMIN_PROJECT_ID,
    });
  return getAuth(app);
}
