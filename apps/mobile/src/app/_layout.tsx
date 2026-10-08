// Esta línea sirve para importar «useEffect» desde «react».
import { useEffect } from 'react';
// Esta línea sirve para importar «DarkTheme, DefaultTheme, Stack, ThemeProvider» desde «expo-router».
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
// Esta línea sirve para importar todo el módulo como «SplashScreen» desde «expo-splash-screen».
import * as SplashScreen from 'expo-splash-screen';
// Esta línea sirve para importar «View» desde «react-native».
import { View } from 'react-native';
// Esta línea sirve para importar «GestureHandlerRootView» desde «react-native-gesture-handler».
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Esta línea sirve para importar «AnimatedSplashOverlay» desde «@/components/animated-icon».
import { AnimatedSplashOverlay } from '@/components/animated-icon';
// Esta línea sirve para importar «BottomTabBar» desde «@/components/layout/bottom-tab-bar».
import { BottomTabBar } from '@/components/layout/bottom-tab-bar';
// Esta línea sirve para importar «LegalConsentGuard» desde «@/components/legal/legal-consent-guard».
import { LegalConsentGuard } from '@/components/legal/legal-consent-guard';
// Esta línea sirve para importar «NotificationLinkHandler» desde «@/components/notification-link-handler».
import { NotificationLinkHandler } from '@/components/notification-link-handler';
// Esta línea sirve para importar «ToastHost» desde «@/components/ui/toast».
import { ToastHost } from '@/components/ui/toast';
// Esta línea sirve para importar «useResolvedColorScheme» desde «@/hooks/use-theme».
import { useResolvedColorScheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';
// Esta línea sirve para importar «useThemeStore» desde «@/store/theme-store».
import { useThemeStore } from '@/store/theme-store';

// Esta línea sirve para llamar a «SplashScreen.preventAutoHideAsync».
SplashScreen.preventAutoHideAsync();

// Esta línea sirve para declarar la función «RootLayout».
export default function RootLayout() {
  // Esta línea sirve para obtener «colorScheme» con el hook «useResolvedColorScheme».
  const colorScheme = useResolvedColorScheme();
  // Esta línea sirve para obtener «hydrate» con el hook «useAuthStore».
  const hydrate = useAuthStore((s) => s.hydrate);
  // Esta línea sirve para obtener «isHydrating» con el hook «useAuthStore».
  const isHydrating = useAuthStore((s) => s.isHydrating);
  // Esta línea sirve para obtener «hydrateTheme» con el hook «useThemeStore».
  const hydrateTheme = useThemeStore((s) => s.hydrate);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «hydrate».
    hydrate();
    // Esta línea sirve para llamar a «hydrateTheme».
    hydrateTheme();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «hydrate, hydrateTheme».
  }, [hydrate, hydrateTheme]);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para revisar si «!isHydrating».
    if (!isHydrating) {
      // Esta línea sirve para llamar a «SplashScreen.hideAsync».
      SplashScreen.hideAsync();
    }
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «isHydrating».
  }, [isHydrating]);

  // Esta línea sirve para revisar si «isHydrating».
  if (isHydrating) {
    // Esta línea sirve para devolver null.
    return null;
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «GestureHandlerRootView».
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Esta línea sirve para abrir el componente «ThemeProvider». */}
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* Esta línea sirve para abrir el componente «AnimatedSplashOverlay». */}
        <AnimatedSplashOverlay />
        {/* Esta línea sirve para abrir el componente «View». */}
        <View style={{ flex: 1 }}>
          {/* Esta línea sirve para abrir el componente «Stack». */}
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            {/* Esta línea sirve para abrir el componente «Stack.Screen». */}
            <Stack.Screen name="(app)" />
            {/* Esta línea sirve para abrir el componente «Stack.Screen». */}
            <Stack.Screen name="(auth)" />
            {/* Esta línea sirve para abrir el componente «Stack.Screen». */}
            <Stack.Screen name="onboarding" />
            {/* Esta línea sirve para abrir el componente «Stack.Screen». */}
            <Stack.Screen name="workout" />
          </Stack>
        </View>
        {/* Esta línea sirve para abrir el componente «BottomTabBar». */}
        <BottomTabBar />
        {/* Esta línea sirve para abrir el componente «LegalConsentGuard». */}
        <LegalConsentGuard />
        {/* Esta línea sirve para abrir el componente «NotificationLinkHandler». */}
        <NotificationLinkHandler />
        {/* Esta línea sirve para abrir el componente «ToastHost». */}
        <ToastHost />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
