import { useEffect } from 'react';
import { router, useSegments } from 'expo-router';

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
export function LegalConsentGuard() {
  const segments = useSegments();
  const hasPending = useAuthStore((s) => !!s.token && !!s.user?.pending_consents?.length);
  const section = segments[0];

  useEffect(() => {
    if (!hasPending || section === 'legal' || section === '(auth)') return;
    router.replace('/legal/aceptar');
  }, [hasPending, section]);

  return null;
}
