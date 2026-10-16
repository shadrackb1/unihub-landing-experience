import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, getFirestore, memoryLocalCache, type Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import fallbackConfig from "../../../firebase-applet-config.json";

const env = import.meta.env;
const fallback = fallbackConfig as Record<string, string>;

const firebaseConfig = {
  apiKey: env["VITE_FIREBASE_API_KEY"] || fallback["apiKey"],
  authDomain: env["VITE_FIREBASE_AUTH_DOMAIN"] || fallback["authDomain"],
  projectId: env["VITE_FIREBASE_PROJECT_ID"] || fallback["projectId"],
  storageBucket: env["VITE_FIREBASE_STORAGE_BUCKET"] || fallback["storageBucket"],
  messagingSenderId: env["VITE_FIREBASE_MESSAGING_SENDER_ID"] || fallback["messagingSenderId"],
  appId: env["VITE_FIREBASE_APP_ID"] || fallback["appId"],
};

export const app = getApps()[0] ?? initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);

const databaseId =
  (env["VITE_FIREBASE_FIRESTORE_DATABASE_ID"] as string | undefined) || fallback["firestoreDatabaseId"] || undefined;

function createDb(): Firestore {
  try {
    return initializeFirestore(
      app,
      { experimentalForceLongPolling: true, localCache: memoryLocalCache() },
      databaseId,
    );
  } catch {
    // Already initialized (hot reload / second import) — reuse it.
    return databaseId ? getFirestore(app, databaseId) : getFirestore(app);
  }
}

export const db = createDb();
