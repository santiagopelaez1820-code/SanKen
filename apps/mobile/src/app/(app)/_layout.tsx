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
    if (!token || !user) return;
    loadFeed();
    subscribeToFeed();
    registerForPushNotificationsAsync();
  }, [token, user, loadFeed, subscribeToFeed]);

  if (!token || !user) {
    return <Redirect href="/login" />;
  }

  if (!user.onboarding_completed) {
    return <Redirect href="/onboarding" />;
  }

  if (!user.has_location) {
    return <Redirect href="/ubicacion" />;
  }

  return <AppTabs />;
}
