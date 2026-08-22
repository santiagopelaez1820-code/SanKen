import { Tabs, TabList, TabTrigger, TabSlot, useTabTrigger } from 'expo-router/ui';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BarChart3, Flag, History, Home, Trophy, type LucideIcon } from 'lucide-react-native';

import { ThemedText } from './themed-text';
import { TabBarIcon } from './ui/tab-bar-icon';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function TabIcon({ name, icon, label }: { name: string; icon: LucideIcon; label: string }) {
  const theme = useTheme();
  const { trigger } = useTabTrigger({ name });
  const focused = !!trigger?.isFocused;
  const color = focused ? theme.accent : theme.textSecondary;

  return (
    <View style={styles.tabContent}>
      <TabBarIcon icon={icon} focused={focused} color={color} />
      <ThemedText type="small" style={[styles.label, { color }]}>
        {label}
      </ThemedText>
    </View>
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
        <TabTrigger name="retos" href="/retos" style={styles.tab}>
          <TabIcon name="retos" icon={Flag} label="Retos" />
        </TabTrigger>
        <TabTrigger name="history" href="/history" style={styles.tab}>
          <TabIcon name="history" icon={History} label="Historial" />
        </TabTrigger>
        <TabTrigger name="prs" href="/prs" style={styles.tab}>
          <TabIcon name="prs" icon={Trophy} label="PR" />
        </TabTrigger>

        {/*
          Medidas ya no es un tab visible (vive en el menú "Más"), pero sigue
          siendo un archivo dentro de (app)/ -- con expo-router/ui, un archivo
          solo es navegable dentro de este Tabs si tiene un TabTrigger real
          dentro del TabList. Sin este trigger oculto, router.push('/measurements')
          desde el MoreMenu no tiene a dónde ir y no hace nada.
        */}
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
    borderTopWidth: 1,
    paddingTop: Spacing.two,
  },
  tab: {
    flex: 1,
  },
  hidden: {
    width: 0,
    height: 0,
    display: 'none',
  },
  tabContent: {
    alignItems: 'center',
    gap: Spacing.half,
  },
  label: {
    fontSize: 11,
  },
});
