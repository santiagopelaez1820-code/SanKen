import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/store/auth-store';

export default function AdminLayout() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  if (!token || !user) {
    return <Redirect href="/login" />;
  }

  if (!user.onboarding_completed) {
    return <Redirect href="/onboarding" />;
  }

  if (user.role !== 'super_admin') {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
