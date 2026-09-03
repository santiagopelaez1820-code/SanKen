import { getApps, initializeApp, type FirebaseOptions } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig)

/**
 * Firebase acá es solo un puente momentáneo (proveedor → credencial → ID
 * Token → se manda al backend y se descarta) — la sesión real de SanKen
 * sigue siendo el token de Sanctum en el cookie/store, no una sesión propia
 * de Firebase. Mismo criterio que apps/mobile/src/lib/firebase.ts.
 */
export const firebaseAuth = getAuth(app)
