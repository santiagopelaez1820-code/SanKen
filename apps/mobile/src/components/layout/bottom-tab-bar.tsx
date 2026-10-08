// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar «router, usePathname, type Href» desde «expo-router».
import { router, usePathname, type Href } from 'expo-router';
// Esta línea sirve para importar «Keyboard, Platform, Pressable, StyleSheet, View» desde «react-native».
import { Keyboard, Platform, Pressable, StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «useSafeAreaInsets» desde «react-native-safe-area-context».
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Esta línea sirve para importar «Animated» y «useAnimatedStyle, useSharedValue, withSpring» desde «react-native-reanimated».
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
// Esta línea sirve para importar «BarChart3, Home, ShoppingBag, Trophy, User, type LucideIcon» desde «lucide-react-native».
import { BarChart3, Home, ShoppingBag, Trophy, User, type LucideIcon } from 'lucide-react-native';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «TabBarIcon» desde «@/components/ui/tab-bar-icon».
import { TabBarIcon } from '@/components/ui/tab-bar-icon';
// Esta línea sirve para importar «CardShadow, Spacing» desde «@/constants/theme».
import { CardShadow, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';
// Esta línea sirve para importar «useCartStore» desde «@/store/cart-store».
import { useCartStore } from '@/store/cart-store';

/**
 * Rutas donde la barra NO aparece: flujos previos a entrar a la app (auth,
 * consentimiento legal, onboarding, ubicación) y la sesión de entrenamiento
 * en curso, que tiene sus propios controles abajo y su propio "Salir" con
 * confirmación — un toque accidental en la barra no debe sacarte de la serie.
 */
// Esta línea sirve para declarar «HIDDEN_ROUTE_PREFIXES» con el valor «[».
const HIDDEN_ROUTE_PREFIXES = [
  // Esta línea sirve para incluir el texto o las clases «/login…».
  '/login',
  // Esta línea sirve para incluir el texto o las clases «/register…».
  '/register',
  // Esta línea sirve para incluir el texto o las clases «/forgot-password…».
  '/forgot-password',
  // Esta línea sirve para incluir el texto o las clases «/verify-2fa…».
  '/verify-2fa',
  // Esta línea sirve para incluir el texto o las clases «/onboarding…».
  '/onboarding',
  // Esta línea sirve para incluir el texto o las clases «/ubicacion…».
  '/ubicacion',
  // Esta línea sirve para incluir el texto o las clases «/legal/aceptar…».
  '/legal/aceptar',
  // Esta línea sirve para incluir el texto o las clases «/workout/session…».
  '/workout/session',
];

// Esta línea sirve para declarar la función «TabItem».
function TabItem({ href, icon, label, focused }: { href: Href; icon: LucideIcon; label: string; focused: boolean }) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para extraer «olo» de «focused ? theme.accent : theme.textSecon».
  const color = focused ? theme.accent : theme.textSecondary;
  // Esta línea sirve para obtener «progress» con el hook «useSharedValue».
  const progress = useSharedValue(focused ? 1 : 0);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para animar el progreso de la pestaña con un resorte.
    progress.value = withSpring(focused ? 1 : 0, { damping: 14, stiffness: 220 });
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «focused, progress».
  }, [focused, progress]);

  // Esta línea sirve para obtener «iconWrapStyle» con el hook «useAnimatedStyle».
  const iconWrapStyle = useAnimatedStyle(() => ({
    // Esta línea sirve para declarar la propiedad «transform» con el valor o tipo «[{ scale: 1 + progress.value * 0.14 }]».
    transform: [{ scale: 1 + progress.value * 0.14 }],
  }));
  // Esta línea sirve para obtener «dotStyle» con el hook «useAnimatedStyle».
  const dotStyle = useAnimatedStyle(() => ({
    // Esta línea sirve para declarar la propiedad «opacity» con el valor o tipo «progress.value».
    opacity: progress.value,
    // Esta línea sirve para declarar la propiedad «transform» con el valor o tipo «[{ scale: progress.value }]».
    transform: [{ scale: progress.value }],
  }));

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
    <Pressable
      // Esta línea sirve para asignar el manejador del evento «onPress».
      onPress={() => {
        // Esta línea sirve para llamar a «router.navigate» si «!focused».
        if (!focused) router.navigate(href);
      }}
      // Esta línea sirve para pasar la propiedad «style» con el valor «styles.tab}».
      style={styles.tab}
      // Esta línea sirve para definir el atributo «accessibilityRole» con el valor «tab».
      accessibilityRole="tab"
      // Esta línea sirve para pasar la propiedad «accessibilityState» con el valor «{ selected: focused }}».
      accessibilityState={{ selected: focused }}
      // Esta línea sirve para pasar la propiedad «accessibilityLabel» con el valor «label}>».
      accessibilityLabel={label}>
      {/* Esta línea sirve para abrir el componente «View». */}
      <View style={styles.tabContent}>
        {/* Esta línea sirve para abrir el componente «Animated.View». */}
        <Animated.View style={iconWrapStyle}>
          {/* Esta línea sirve para abrir el componente «TabBarIcon». */}
          <TabBarIcon icon={icon} focused={focused} color={color} />
        </Animated.View>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="small" style={[styles.label, { color }]}>
          {/* Esta línea sirve para mostrar el valor «label». */}
          {label}
        </ThemedText>
        {/* Esta línea sirve para abrir el componente «Animated.View». */}
        <Animated.View style={[styles.dot, { backgroundColor: theme.accent }, dotStyle]} />
      </View>
    </Pressable>
  );
}

/** Botón central elevado: acceso a la Tienda SanKen, con el contador del carrito. */
// Esta línea sirve para declarar la función «CenterAction».
function CenterAction({ focused }: { focused: boolean }) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «itemCount» con el hook «useCartStore».
  const itemCount = useCartStore((s) => s.getItemCount());

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
    <Pressable
      // Esta línea sirve para asignar el manejador del evento «onPress».
      onPress={() => {
        // Esta línea sirve para llamar a «router.navigate» si «!focused».
        if (!focused) router.navigate('/store');
      }}
      // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.fab, { backgroundColor: theme.accent,».
      style={[styles.fab, { backgroundColor: theme.accent, borderColor: theme.background }, CardShadow]}
      // Esta línea sirve para definir el atributo «accessibilityLabel» con el valor «Tienda SanKen».
      accessibilityLabel="Tienda SanKen">
      {/* Esta línea sirve para abrir el componente «ShoppingBag». */}
      <ShoppingBag size={24} color={theme.background} strokeWidth={2.3} />
      {/* Esta línea sirve para mostrar el bloque solo si «itemCount > 0». */}
      {itemCount > 0 && (
        // Esta línea sirve para abrir el componente «ThemedView».
        <ThemedView style={[styles.fabBadge, { backgroundColor: theme.error, borderColor: theme.background }]}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" style={styles.fabBadgeText}>
            {/* Esta línea sirve para mostrar el contador con tope en 9+. */}
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
// Esta línea sirve para declarar la función «BottomTabBar».
export function BottomTabBar() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «insets» con el hook «useSafeAreaInsets».
  const insets = useSafeAreaInsets();
  // Esta línea sirve para obtener «pathname» con el hook «usePathname».
  const pathname = usePathname();
  // Esta línea sirve para obtener «user» con el hook «useAuthStore».
  const user = useAuthStore((s) => s.user);
  // Esta línea sirve para obtener «token» con el hook «useAuthStore».
  const token = useAuthStore((s) => s.token);
  // Esta línea sirve para crear el estado «keyboardVisible» y su función «setKeyboardVisible».
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Con el teclado abierto la barra quedaría apoyada encima de él
    // (Android redimensiona la ventana) robándole espacio al input.
    // Esta línea sirve para extraer «ho» de «Keyboard.addListener('keyboardDidShow', ».
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    // Esta línea sirve para extraer «id» de «Keyboard.addListener('keyboardDidHide', ».
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    // Esta línea sirve para devolver «() => {».
    return () => {
      // Esta línea sirve para llamar a «show.remove».
      show.remove();
      // Esta línea sirve para llamar a «hide.remove».
      hide.remove();
    };
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «».
  }, []);

  // Esta línea sirve para devolver null si «Platform.OS === 'web'».
  if (Platform.OS === 'web') return null;
  // Esta línea sirve para devolver null si «!token || !user».
  if (!token || !user) return null;
  // Esta línea sirve para ocultar la barra si el usuario tiene consentimientos pendientes o falta el onboarding.
  if (user.pending_consents?.length || !user.onboarding_completed || !user.has_location) return null;
  // Esta línea sirve para ocultar la barra en las rutas que no la usan.
  if (HIDDEN_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;
  // Esta línea sirve para devolver null si «keyboardVisible».
  if (keyboardVisible) return null;

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «View» con sus atributos en varias líneas.
    <View
      // Esta línea sirve para pasar la propiedad «style» con el valor «[».
      style={[
        // Esta línea sirve para agregar el estilo «styles.bar».
        styles.bar,
        {
          // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «theme.background».
          backgroundColor: theme.background,
          // Esta línea sirve para declarar la propiedad «borderTopColor» con el valor o tipo «theme.border».
          borderTopColor: theme.border,
          // Esta línea sirve para declarar la propiedad «paddingBottom» con el valor o tipo «Math.max(insets.bottom, Spacing.two)».
          paddingBottom: Math.max(insets.bottom, Spacing.two),
        },
      ]}>
      {/* Esta línea sirve para abrir el componente «TabItem». */}
      <TabItem href="/" icon={Home} label="Inicio" focused={pathname === '/'} />
      {/* Esta línea sirve para abrir el componente «TabItem». */}
      <TabItem href="/dashboard" icon={BarChart3} label="Progreso" focused={pathname === '/dashboard'} />

      {/* Esta línea sirve para abrir el componente «View». */}
      <View style={styles.fabSlot}>
        {/* Esta línea sirve para abrir el componente «CenterAction». */}
        <CenterAction focused={pathname === '/store'} />
      </View>

      {/* Esta línea sirve para abrir el componente «TabItem». */}
      <TabItem href="/prs" icon={Trophy} label="PR" focused={pathname === '/prs'} />
      {/* Esta línea sirve para abrir el componente «TabItem». */}
      <TabItem href="/profile" icon={User} label="Perfil" focused={pathname === '/profile'} />
    </View>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «bar» con el valor o tipo «{».
  bar: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «borderTopWidth» con el valor o tipo «1».
    borderTopWidth: 1,
    // Esta línea sirve para declarar la propiedad «paddingTop» con el valor o tipo «Spacing.two».
    paddingTop: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «tab» con el valor o tipo «{».
  tab: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
  },
  // Esta línea sirve para declarar la propiedad «fabSlot» con el valor o tipo «{».
  fabSlot: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «64».
    width: 64,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
  },
  // Esta línea sirve para declarar la propiedad «fab» con el valor o tipo «{».
  fab: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «52».
    width: 52,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «52».
    height: 52,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «16».
    borderRadius: 16,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
    // Esta línea sirve para declarar la propiedad «marginTop» con el valor o tipo «-30».
    marginTop: -30,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «3».
    borderWidth: 3,
  },
  // Esta línea sirve para declarar la propiedad «fabBadge» con el valor o tipo «{».
  fabBadge: {
    // Esta línea sirve para declarar la propiedad «position» con el valor o tipo «'absolute'».
    position: 'absolute',
    // Esta línea sirve para declarar la propiedad «top» con el valor o tipo «-4».
    top: -4,
    // Esta línea sirve para declarar la propiedad «right» con el valor o tipo «-4».
    right: -4,
    // Esta línea sirve para declarar la propiedad «minWidth» con el valor o tipo «18».
    minWidth: 18,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «18».
    height: 18,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «9».
    borderRadius: 9,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «2».
    borderWidth: 2,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «4».
    paddingHorizontal: 4,
  },
  // Esta línea sirve para declarar la propiedad «fabBadgeText» con el valor o tipo «{».
  fabBadgeText: {
    // Esta línea sirve para declarar la propiedad «color» con el valor o tipo «'#FFFFFF'».
    color: '#FFFFFF',
    // Esta línea sirve para declarar la propiedad «fontWeight» con el valor o tipo «'700'».
    fontWeight: '700',
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «10».
    fontSize: 10,
    // Esta línea sirve para declarar la propiedad «lineHeight» con el valor o tipo «12».
    lineHeight: 12,
  },
  // Esta línea sirve para declarar la propiedad «tabContent» con el valor o tipo «{».
  tabContent: {
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.half».
    gap: Spacing.half,
    // Esta línea sirve para declarar la propiedad «position» con el valor o tipo «'relative'».
    position: 'relative',
    // Esta línea sirve para declarar la propiedad «paddingBottom» con el valor o tipo «Spacing.one».
    paddingBottom: Spacing.one,
  },
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «{».
  label: {
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «11».
    fontSize: 11,
    // Esta línea sirve para declarar la propiedad «lineHeight» con el valor o tipo «14».
    lineHeight: 14,
  },
  // Esta línea sirve para declarar la propiedad «dot» con el valor o tipo «{».
  dot: {
    // Esta línea sirve para declarar la propiedad «position» con el valor o tipo «'absolute'».
    position: 'absolute',
    // Esta línea sirve para declarar la propiedad «bottom» con el valor o tipo «0».
    bottom: 0,
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «4».
    width: 4,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «4».
    height: 4,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «2».
    borderRadius: 2,
  },
});
