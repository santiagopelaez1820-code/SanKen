// Esta línea sirve para importar «Platform» desde «react-native».
import { Platform } from 'react-native';
// Esta línea sirve para importar «getApps, initializeApp, type FirebaseOptions» desde «firebase/app».
import { getApps, initializeApp, type FirebaseOptions } from 'firebase/app';
// Esta línea sirve para importar «getAuth, inMemoryPersistence, initializeAuth, type Auth» desde «firebase/auth».
import { getAuth, inMemoryPersistence, initializeAuth, type Auth } from 'firebase/auth';

// Esta línea sirve para declarar «firebaseConfig» con el valor «{».
const firebaseConfig: FirebaseOptions = {
  // Esta línea sirve para declarar la propiedad «apiKey» con el valor o tipo «process.env.EXPO_PUBLIC_FIREBASE_API_KEY».
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  // Esta línea sirve para declarar la propiedad «authDomain» con el valor o tipo «process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN».
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // Esta línea sirve para declarar la propiedad «projectId» con el valor o tipo «process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID».
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  // Esta línea sirve para definir «storageBucket» con «process.env.EXPO_PUBLIC_FIREBASE_STORAGE…».
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  // Esta línea sirve para definir «messagingSenderId» con «process.env.EXPO_PUBLIC_FIREBASE_MESSAGI…».
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  // Esta línea sirve para declarar la propiedad «appId» con el valor o tipo «process.env.EXPO_PUBLIC_FIREBASE_APP_ID».
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Esta línea sirve para extraer «p» de «getApps().length ? getApps()[0]! : initi».
const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);

/**
 * Firebase acá es solo un puente momentáneo (proveedor → credencial →
 * ID Token → se manda al backend y se descarta) — la sesión real de SanKen
 * sigue siendo el token de Sanctum en `tokenStorage`. Por eso en nativo se
 * usa persistencia en memoria a propósito: no necesitamos que Firebase
 * recuerde una sesión propia entre aperturas de la app. `initializeAuth`
 * solo puede llamarse una vez por app — con Fast Refresh en desarrollo el
 * módulo puede re-evaluarse, así que si ya estaba inicializado se cae a
 * `getAuth()` en vez de romper con "Auth already initialized".
 */
// Esta línea sirve para declarar la función «createAuth».
function createAuth(): Auth {
  // Esta línea sirve para revisar si «Platform.OS === 'web'».
  if (Platform.OS === 'web') {
    // Esta línea sirve para devolver «getAuth(app)».
    return getAuth(app);
  }

  // Esta línea sirve para intentar ejecutar el bloque siguiente.
  try {
    // Esta línea sirve para inicializar la autenticación con persistencia en memoria.
    return initializeAuth(app, { persistence: inMemoryPersistence });
  // Esta línea sirve para capturar cualquier error del bloque anterior.
  } catch {
    // Esta línea sirve para devolver «getAuth(app)».
    return getAuth(app);
  }
}

// Esta línea sirve para declarar «firebaseAuth» con el valor «createAuth()».
export const firebaseAuth = createAuth();
