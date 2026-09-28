import { useEffect } from 'react';
import { Redirect } from 'expo-router';

import AppTabs from '@/components/app-tabs';
import { registerForPushNotificationsAsync } from '@/lib/push';
import { useAuthStore } from '@/store/auth-store';
import { useFeedStore } from '@/store/feed-store';

export default function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const loadFeed = useFeedStore((s) => s.load);
  const subscribeToFeed = useFeedStore((s) => s.subscribe);

  useEffect(() => {
    // Con documentos pendientes el backend respondería 403 a todo esto.
    if (!token || !user || user.pending_consents?.length) return;
    loadFeed();
    subscribeToFeed();
    registerForPushNotificationsAsync({ silent: true });
  }, [token, user, loadFeed, subscribeToFeed]);

  if (!token || !user) {
    return <Redirect href="/login" />;
  }

  // Documentos legales pendientes (nunca aceptados o actualizados): antes
  // que onboarding/ubicación, ninguna pantalla de la app sin aceptarlos.
  if (user.pending_consents?.length) {
    return <Redirect href="/legal/aceptar" />;
  }

  if (!user.onboarding_completed) {
    return <Redirect href="/onboarding" />;
  }

  if (!user.has_location) {
    return <Redirect href="/ubicacion" />;
  }

  return <AppTabs />;
}
