// Esta línea sirve para importar «getApps, initializeApp, type FirebaseOptions» desde «firebase/app».
import { getApps, initializeApp, type FirebaseOptions } from "firebase/app"
// Esta línea sirve para importar «getAuth» desde «firebase/auth».
import { getAuth } from "firebase/auth"

// Esta línea sirve para declarar «firebaseConfig» con el valor «{».
const firebaseConfig: FirebaseOptions = {
  // Esta línea sirve para declarar la propiedad «apiKey» con el valor o tipo «import.meta.env.VITE_FIREBASE_API_KEY».
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // Esta línea sirve para declarar la propiedad «authDomain» con el valor o tipo «import.meta.env.VITE_FIREBASE_AUTH_DOMAIN».
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // Esta línea sirve para declarar la propiedad «projectId» con el valor o tipo «import.meta.env.VITE_FIREBASE_PROJECT_ID».
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // Esta línea sirve para declarar la propiedad «storageBucket» con el valor o tipo «import.meta.env.VITE_FIREBASE_STORAGE_BUCKET».
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  // Esta línea sirve para leer el identificador de mensajería de Firebase del entorno.
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  // Esta línea sirve para declarar la propiedad «appId» con el valor o tipo «import.meta.env.VITE_FIREBASE_APP_ID».
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Esta línea sirve para extraer «p» de «getApps().length ? getApps()[0]! : initi».
const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig)

/**
 * Firebase acá es solo un puente momentáneo (proveedor → credencial → ID
 * Token → se manda al backend y se descarta) — la sesión real de SanKen
 * sigue siendo el token de Sanctum en el cookie/store, no una sesión propia
 * de Firebase. Mismo criterio que apps/mobile/src/lib/firebase.ts.
 */
// Esta línea sirve para declarar «firebaseAuth» con el valor «getAuth(app)».
export const firebaseAuth = getAuth(app)
