// Esta línea sirve para importar «useEffect» desde «react».
import { useEffect } from 'react';
// Esta línea sirve para importar «Redirect» desde «expo-router».
import { Redirect } from 'expo-router';

// Esta línea sirve para importar «AppTabs» desde «@/components/app-tabs».
import AppTabs from '@/components/app-tabs';
// Esta línea sirve para importar «WeeklyCheckinSheet» desde «@/components/support/weekly-checkin-sheet».
import { WeeklyCheckinSheet } from '@/components/support/weekly-checkin-sheet';
// Esta línea sirve para importar «registerForPushNotificationsAsync» desde «@/lib/push».
import { registerForPushNotificationsAsync } from '@/lib/push';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';
// Esta línea sirve para importar «useFeedStore» desde «@/store/feed-store».
import { useFeedStore } from '@/store/feed-store';

// Esta línea sirve para declarar la función «AppLayout».
export default function AppLayout() {
  // Esta línea sirve para obtener «user» con el hook «useAuthStore».
  const user = useAuthStore((s) => s.user);
  // Esta línea sirve para obtener «token» con el hook «useAuthStore».
  const token = useAuthStore((s) => s.token);
  // Esta línea sirve para obtener «loadFeed» con el hook «useFeedStore».
  const loadFeed = useFeedStore((s) => s.load);
  // Esta línea sirve para obtener «subscribeToFeed» con el hook «useFeedStore».
  const subscribeToFeed = useFeedStore((s) => s.subscribe);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Con documentos pendientes el backend respondería 403 a todo esto.
    // Esta línea sirve para salir de la función si «!token || !user || user.pending_consents?.length».
    if (!token || !user || user.pending_consents?.length) return;
    // Esta línea sirve para llamar a «loadFeed».
    loadFeed();
    // Esta línea sirve para llamar a «subscribeToFeed».
    subscribeToFeed();
    // Esta línea sirve para llamar a «registerForPushNotificationsAsync» con «{ silent: true }».
    registerForPushNotificationsAsync({ silent: true });
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «token, user, loadFeed, subscribeToFeed».
  }, [token, user, loadFeed, subscribeToFeed]);

  // Esta línea sirve para revisar si «!token || !user».
  if (!token || !user) {
    // Esta línea sirve para devolver «<Redirect href="/login" />».
    return <Redirect href="/login" />;
  }

  // Documentos legales pendientes (nunca aceptados o actualizados): antes
  // que onboarding/ubicación, ninguna pantalla de la app sin aceptarlos.
  // Esta línea sirve para revisar si «user.pending_consents?.length».
  if (user.pending_consents?.length) {
    // Esta línea sirve para devolver «<Redirect href="/legal/aceptar" />».
    return <Redirect href="/legal/aceptar" />;
  }

  // Esta línea sirve para revisar si «!user.onboarding_completed».
  if (!user.onboarding_completed) {
    // Esta línea sirve para devolver «<Redirect href="/onboarding" />».
    return <Redirect href="/onboarding" />;
  }

  // Esta línea sirve para revisar si «!user.has_location».
  if (!user.has_location) {
    // Esta línea sirve para devolver «<Redirect href="/ubicacion" />».
    return <Redirect href="/ubicacion" />;
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
    <>
      {/* Esta línea sirve para abrir el componente «AppTabs». */}
      <AppTabs />
      {/* Esta línea sirve para abrir el componente «WeeklyCheckinSheet». */}
      <WeeklyCheckinSheet />
    </>
  );
}
