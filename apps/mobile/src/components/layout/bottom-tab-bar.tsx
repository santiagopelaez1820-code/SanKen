import { useEffect, useState } from 'react';
import { router, usePathname, type Href } from 'expo-router';
import { Keyboard, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { BarChart3, Home, ShoppingBag, Trophy, User, type LucideIcon } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TabBarIcon } from '@/components/ui/tab-bar-icon';
import { CardShadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';

/**
 * Rutas donde la barra NO aparece: flujos previos a entrar a la app (auth,
 * consentimiento legal, onboarding, ubicación) y la sesión de entrenamiento
 * en curso, que tiene sus propios controles abajo y su propio "Salir" con
 * confirmación — un toque accidental en la barra no debe sacarte de la serie.
 */
const HIDDEN_ROUTE_PREFIXES = [
  '/login',
  '/register',
  '/forgot-password',
  '/verify-2fa',
  '/onboarding',
  '/ubicacion',
  '/legal/aceptar',
  '/workout/session',
];

function TabItem({ href, icon, label, focused }: { href: Href; icon: LucideIcon; label: string; focused: boolean }) {
  const theme = useTheme();
  const color = focused ? theme.accent : theme.textSecondary;
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, { damping: 14, stiffness: 220 });
  }, [focused, progress]);

  const iconWrapStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + progress.value * 0.14 }],
  }));
  const dotStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: progress.value }],
  }));

  return (
    <Pressable
      onPress={() => {
        if (!focused) router.navigate(href);
      }}
      style={styles.tab}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}>
      <View style={styles.tabContent}>
        <Animated.View style={iconWrapStyle}>
          <TabBarIcon icon={icon} focused={focused} color={color} />
        </Animated.View>
        <ThemedText type="small" style={[styles.label, { color }]}>
          {label}
        </ThemedText>
        <Animated.View style={[styles.dot, { backgroundColor: theme.accent }, dotStyle]} />
      </View>
    </Pressable>
  );
}

/** Botón central elevado: acceso a la Tienda SanKen, con el contador del carrito. */
function CenterAction({ focused }: { focused: boolean }) {
  const theme = useTheme();
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <Pressable
      onPress={() => {
        if (!focused) router.navigate('/store');
      }}
      style={[styles.fab, { backgroundColor: theme.accent, borderColor: theme.background }, CardShadow]}
      accessibilityLabel="Tienda SanKen">
      <ShoppingBag size={24} color={theme.background} strokeWidth={2.3} />
      {itemCount > 0 && (
        <ThemedView style={[styles.fabBadge, { backgroundColor: theme.error, borderColor: theme.background }]}>
          <ThemedText type="small" style={styles.fabBadgeText}>
            {itemCount > 9 ? '9+' : itemCount}
          </ThemedText>
        </ThemedView>
      )}
    </Pressable>
  );
}

/**
 * Barra inferior global (Inicio · Progreso · Tienda · PR · Perfil). Se monta
 * una sola vez en el layout raíz, debajo del Stack, así queda visible en
 * todos los módulos (tienda, nutrición, chat, admin…) y no solo en las
 * pantallas del grupo (app). Va en el flujo del layout, no flotando: las
 * pantallas con CTA fijo abajo (carrito, checkout) quedan encima de ella
 * sin taparse. En web la navegación es el header de app-tabs.web.tsx.
 */
export function BottomTabBar() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    // Con el teclado abierto la barra quedaría apoyada encima de él
    // (Android redimensiona la ventana) robándole espacio al input.
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  if (Platform.OS === 'web') return null;
  if (!token || !user) return null;
  if (user.pending_consents?.length || !user.onboarding_completed || !user.has_location) return null;
  if (HIDDEN_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;
  if (keyboardVisible) return null;

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          paddingBottom: Math.max(insets.bottom, Spacing.two),
        },
      ]}>
      <TabItem href="/" icon={Home} label="Inicio" focused={pathname === '/'} />
      <TabItem href="/dashboard" icon={BarChart3} label="Progreso" focused={pathname === '/dashboard'} />

      <View style={styles.fabSlot}>
        <CenterAction focused={pathname === '/store'} />
      </View>

      <TabItem href="/prs" icon={Trophy} label="PR" focused={pathname === '/prs'} />
      <TabItem href="/profile" icon={User} label="Perfil" focused={pathname === '/profile'} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: Spacing.two,
  },
  tab: {
    flex: 1,
  },
  fabSlot: {
    width: 64,
    alignItems: 'center',
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
    borderWidth: 3,
  },
  fabBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  fabBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 10,
    lineHeight: 12,
  },
  tabContent: {
    alignItems: 'center',
    gap: Spacing.half,
    position: 'relative',
    paddingBottom: Spacing.one,
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
  },
  dot: {
    position: 'absolute',
    bottom: 0,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
