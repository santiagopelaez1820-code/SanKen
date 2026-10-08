// Esta línea sirve para importar «Redirect, Stack» desde «expo-router».
import { Redirect, Stack } from 'expo-router';

// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';

// Esta línea sirve para declarar la función «AuthLayout».
export default function AuthLayout() {
  // Esta línea sirve para obtener «user» con el hook «useAuthStore».
  const user = useAuthStore((s) => s.user);
  // Esta línea sirve para obtener «token» con el hook «useAuthStore».
  const token = useAuthStore((s) => s.token);

  // Esta línea sirve para revisar si «token && user».
  if (token && user) {
    // Esta línea sirve para revisar si «user.pending_consents?.length».
    if (user.pending_consents?.length) {
      // Esta línea sirve para devolver «<Redirect href="/legal/aceptar" />».
      return <Redirect href="/legal/aceptar" />;
    }
    // Esta línea sirve para redirigir al inicio o al onboarding según si lo completó.
    return <Redirect href={user.onboarding_completed ? '/' : '/onboarding'} />;
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Stack».
    <Stack screenOptions={{ headerShown: false }}>
      {/* Esta línea sirve para abrir el componente «Stack.Screen». */}
      <Stack.Screen name="login" />
      {/* Esta línea sirve para abrir el componente «Stack.Screen». */}
      <Stack.Screen name="register" />
      {/* Esta línea sirve para abrir el componente «Stack.Screen». */}
      <Stack.Screen name="verify-2fa" />
      {/* Esta línea sirve para abrir el componente «Stack.Screen». */}
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
