import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/store/auth-store';

export default function AuthLayout() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  if (token && user) {
    return <Redirect href={user.onboarding_completed ? '/' : '/onboarding'} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="verify-2fa" />
    </Stack>
  );
}
