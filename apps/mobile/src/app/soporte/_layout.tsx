import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/store/auth-store';

/** Soporte: solo con sesión y onboarding completo (mismo criterio que Configuración). */
export default function SupportLayout() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  if (!token || !user) {
    return <Redirect href="/login" />;
  }

  if (!user.onboarding_completed) {
    return <Redirect href="/onboarding" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
