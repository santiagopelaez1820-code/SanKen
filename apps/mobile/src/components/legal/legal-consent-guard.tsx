// Esta línea sirve para importar «useEffect» desde «react».
import { useEffect } from 'react';
// Esta línea sirve para importar «router, useSegments» desde «expo-router».
import { router, useSegments } from 'expo-router';

// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';

/**
 * Guardia global (montada en el layout raíz): si el usuario tiene
 * documentos legales pendientes, lo manda a /legal/aceptar desde CUALQUIER
 * sección — no solo desde las pestañas principales —, incluidos enlaces
 * directos a /settings, /store, /chat, notificaciones push, etc. Solo deja
 * pasar /legal/* (leer los documentos, aceptar) y las pantallas de login.
 *
 * El backend bloquea igual toda ruta mientras tanto
 * (EnsureLegalConsentsAccepted); esto evita mostrar pantallas que solo
 * recibirían 403.
 */
// Esta línea sirve para declarar la función «LegalConsentGuard».
export function LegalConsentGuard() {
  // Esta línea sirve para obtener «segments» con el hook «useSegments».
  const segments = useSegments();
  // Esta línea sirve para obtener «hasPending» con el hook «useAuthStore».
  const hasPending = useAuthStore((s) => !!s.token && !!s.user?.pending_consents?.length);
  // Esta línea sirve para extraer «ectio» de «segments[0]».
  const section = segments[0];

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para salir si no hay pendientes o si ya está en una pantalla legal o de autenticación.
    if (!hasPending || section === 'legal' || section === '(auth)') return;
    // Esta línea sirve para llamar a «router.replace» con «'/legal/aceptar'».
    router.replace('/legal/aceptar');
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «hasPending, section».
  }, [hasPending, section]);

  // Esta línea sirve para devolver null.
  return null;
}
