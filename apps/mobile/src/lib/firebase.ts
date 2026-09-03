import { Platform } from 'react-native';
import { getApps, initializeApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, inMemoryPersistence, initializeAuth, type Auth } from 'firebase/auth';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

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
function createAuth(): Auth {
  if (Platform.OS === 'web') {
    return getAuth(app);
  }

  try {
    return initializeAuth(app, { persistence: inMemoryPersistence });
  } catch {
    return getAuth(app);
  }
}

export const firebaseAuth = createAuth();
