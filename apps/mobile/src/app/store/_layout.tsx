// Esta línea sirve para importar «useEffect» desde «react».
import { useEffect } from 'react';
// Esta línea sirve para importar «Redirect, Stack» desde «expo-router».
import { Redirect, Stack } from 'expo-router';

// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';
// Esta línea sirve para importar «useCartStore» desde «@/store/cart-store».
import { useCartStore } from '@/store/cart-store';

// Esta línea sirve para declarar la función «StoreLayout».
export default function StoreLayout() {
  // Esta línea sirve para obtener «user» con el hook «useAuthStore».
  const user = useAuthStore((s) => s.user);
  // Esta línea sirve para obtener «token» con el hook «useAuthStore».
  const token = useAuthStore((s) => s.token);
  // Esta línea sirve para obtener «hydrateCart» con el hook «useCartStore».
  const hydrateCart = useCartStore((s) => s.hydrate);

  /**
   * Se hidrata acá (layout compartido por todas las pantallas de /store) y
   * no en index.tsx — así el carrito persistido carga bien sin importar con
   * cuál pantalla de la sección entra el usuario (ej. abre directo en
   * /store/cart), no solo cuando pasa primero por /store.
   */
  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «hydrateCart».
    hydrateCart();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «hydrateCart».
  }, [hydrateCart]);

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
      <Stack.Screen name="[productId]" />
      {/* Esta línea sirve para abrir el componente «Stack.Screen». */}
      <Stack.Screen name="cart" />
      {/* Esta línea sirve para abrir el componente «Stack.Screen». */}
      <Stack.Screen name="checkout" />
      {/* Esta línea sirve para abrir el componente «Stack.Screen». */}
      <Stack.Screen name="confirmation" />
    </Stack>
  );
}
