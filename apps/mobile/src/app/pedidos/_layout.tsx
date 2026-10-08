// Esta línea sirve para importar «Redirect, Stack» desde «expo-router».
import { Redirect, Stack } from 'expo-router';

// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';

// Esta línea sirve para declarar la función «PedidosLayout».
export default function PedidosLayout() {
  // Esta línea sirve para obtener «user» con el hook «useAuthStore».
  const user = useAuthStore((s) => s.user);
  // Esta línea sirve para obtener «token» con el hook «useAuthStore».
  const token = useAuthStore((s) => s.token);

  // Esta línea sirve para revisar si «!token || !user».
  if (!token || !user) {
    // Esta línea sirve para devolver «<Redirect href="/login" />».
    return <Redirect href="/login" />;
  }

  // Esta línea sirve para revisar si «!user.onboarding_completed».
  if (!user.onboarding_completed) {
    // Esta línea sirve para devolver «<Redirect href="/onboarding" />».
    return <Redirect href="/onboarding" />;
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Stack».
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      {/* Esta línea sirve para abrir el componente «Stack.Screen». */}
      <Stack.Screen name="index" />
      {/* Esta línea sirve para abrir el componente «Stack.Screen». */}
      <Stack.Screen name="[orderId]" />
    </Stack>
  );
}
