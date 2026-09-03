import { useEffect } from 'react';
import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';

export default function StoreLayout() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const hydrateCart = useCartStore((s) => s.hydrate);

  /**
   * Se hidrata acá (layout compartido por todas las pantallas de /store) y
   * no en index.tsx — así el carrito persistido carga bien sin importar con
   * cuál pantalla de la sección entra el usuario (ej. abre directo en
   * /store/cart), no solo cuando pasa primero por /store.
   */
  useEffect(() => {
    hydrateCart();
  }, [hydrateCart]);

  if (!token || !user) {
    return <Redirect href="/login" />;
  }

  if (!user.onboarding_completed) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[productId]" />
      <Stack.Screen name="cart" />
      <Stack.Screen name="checkout" />
      <Stack.Screen name="confirmation" />
    </Stack>
  );
}
