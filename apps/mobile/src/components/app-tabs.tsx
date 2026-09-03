import { useEffect } from 'react';
import { router } from 'expo-router';
import { Tabs, TabList, TabTrigger, TabSlot, useTabTrigger } from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { BarChart3, Flag, Home, ShoppingBag, User, type LucideIcon } from 'lucide-react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { TabBarIcon } from './ui/tab-bar-icon';
import { CardShadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCartStore } from '@/store/cart-store';

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

/**
 * Botón central elevado — antes abría "Comenzar entrenamiento" (esa acción
 * se reubicó al menú "Más" y sigue disponible como CTA principal en Home);
 * ahora es el acceso a SanKen Store, la acción de mayor frecuencia después
 * de eso.
 */
function CenterAction() {
  const theme = useTheme();
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <Pressable
      onPress={() => router.push('/store')}
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
