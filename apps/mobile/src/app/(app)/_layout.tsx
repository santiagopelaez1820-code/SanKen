import { useEffect } from 'react';
import { Redirect } from 'expo-router';

import AppTabs from '@/components/app-tabs';
import { registerForPushNotificationsAsync } from '@/lib/push';
import { useAuthStore } from '@/store/auth-store';
import { useNotificationsStore } from '@/store/notifications-store';

export default function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const loadNotifications = useNotificationsStore((s) => s.load);
  const subscribeToNotifications = useNotificationsStore((s) => s.subscribe);

  useEffect(() => {
    if (!token || !user) return;
    loadNotifications();
    subscribeToNotifications();
    registerForPushNotificationsAsync();
  }, [token, user, loadNotifications, subscribeToNotifications]);

  if (!token || !user) {
    return <Redirect href="/login" />;
  }

  if (!user.onboarding_completed) {
    return <Redirect href="/onboarding" />;
  }

  return <AppTabs />;
}
