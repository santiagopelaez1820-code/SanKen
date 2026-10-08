// Esta línea sirve para importar «Stack» desde «expo-router».
import { Stack } from 'expo-router';

/**
 * Documentos legales: públicos (sin sesión), accesibles desde registro,
 * login y configuración. /legal/aceptar sí exige sesión (ver ese archivo).
 */
// Esta línea sirve para declarar la función «LegalLayout».
export default function LegalLayout() {
  // Esta línea sirve para devolver «<Stack screenOptions={{ headerShown: false }} />».
  return <Stack screenOptions={{ headerShown: false }} />;
}
