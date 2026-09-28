import { Stack } from 'expo-router';

/**
 * Documentos legales: públicos (sin sesión), accesibles desde registro,
 * login y configuración. /legal/aceptar sí exige sesión (ver ese archivo).
 */
export default function LegalLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
