import { useEffect } from 'react';
import { router } from 'expo-router';
import { Tabs, TabList, TabTrigger, TabSlot, useTabTrigger } from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { BarChart3, Dumbbell, Flag, Home, User, type LucideIcon } from 'lucide-react-native';

import { ThemedText } from './themed-text';
import { TabBarIcon } from './ui/tab-bar-icon';
import { CardShadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function TabIcon({ name, icon, label }: { name: string; icon: LucideIcon; label: string }) {
  const theme = useTheme();
  const { trigger } = useTabTrigger({ name });
  const focused = !!trigger?.isFocused;
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
    <View style={styles.tabContent}>
      <Animated.View style={iconWrapStyle}>
        <TabBarIcon icon={icon} focused={focused} color={color} />
      </Animated.View>
      <ThemedText type="small" style={[styles.label, { color }]}>
        {label}
      </ThemedText>
      <Animated.View style={[styles.dot, { backgroundColor: theme.accent }, dotStyle]} />
    </View>
  );
}

/** Botón central elevado — acción de mayor frecuencia (comenzar entrenamiento), no un tab más. */
function CenterAction() {
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => router.push('/workout/precheck')}
      style={[styles.fab, { backgroundColor: theme.accent, borderColor: theme.background }, CardShadow]}
      accessibilityLabel="Comenzar entrenamiento">
      <Dumbbell size={24} color={theme.background} strokeWidth={2.3} />
    </Pressable>
  );
}

export default function AppTabs() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs style={styles.tabs}>
      <TabSlot style={styles.slot} />
      <TabList
        style={[
          styles.bar,
          {
            backgroundColor: theme.background,
            borderTopColor: theme.border,
            paddingBottom: Math.max(insets.bottom, Spacing.two),
          },
        ]}>
        <TabTrigger name="index" href="/" style={styles.tab}>
          <TabIcon name="index" icon={Home} label="Inicio" />
        </TabTrigger>
        <TabTrigger name="dashboard" href="/dashboard" style={styles.tab}>
          <TabIcon name="dashboard" icon={BarChart3} label="Progreso" />
        </TabTrigger>

        <View style={styles.fabSlot}>
          <CenterAction />
        </View>

        <TabTrigger name="retos" href="/retos" style={styles.tab}>
          <TabIcon name="retos" icon={Flag} label="Retos" />
        </TabTrigger>
        <TabTrigger name="profile" href="/profile" style={styles.tab}>
          <TabIcon name="profile" icon={User} label="Perfil" />
        </TabTrigger>

        {/*
          Historial/PR/Medidas ya no son tabs visibles (viven en el perfil y
          en el menú "Más"), pero siguen siendo archivos dentro de (app)/ --
          con expo-router/ui, un archivo solo es navegable dentro de este
          Tabs si tiene un TabTrigger real dentro del TabList. Sin estos
          triggers ocultos, router.push() a esas rutas no tendría a dónde ir.
        */}
        <TabTrigger name="history" href="/history" style={styles.hidden} />
        <TabTrigger name="prs" href="/prs" style={styles.hidden} />
        <TabTrigger name="measurements" href="/measurements" style={styles.hidden} />
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabs: { flex: 1 },
  slot: { flex: 1 },
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
  hidden: {
    width: 0,
    height: 0,
    display: 'none',
  },
  tabContent: {
    alignItems: 'center',
    gap: Spacing.half,
    position: 'relative',
    paddingBottom: Spacing.one,
  },
  label: {
    fontSize: 11,
  },
  dot: {
    position: 'absolute',
    bottom: 0,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
