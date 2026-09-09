import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { ToastHost } from '@/components/ui/toast';
import { useResolvedColorScheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useResolvedColorScheme();
  const hydrate = useAuthStore((s) => s.hydrate);
  const isHydrating = useAuthStore((s) => s.isHydrating);
  const hydrateTheme = useThemeStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
    hydrateTheme();
  }, [hydrate, hydrateTheme]);

  useEffect(() => {
    if (!isHydrating) {
      SplashScreen.hideAsync();
    }
  }, [isHydrating]);

  if (isHydrating) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="(app)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="workout" />
        </Stack>
        <ToastHost />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
