import { useEffect } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { StatTile } from '@/components/ui/stat-tile';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAdminStore } from '@/store/admin-store';

export default function AdminStatsScreen() {
  const { stats, isLoadingStats, loadStats } = useAdminStore();

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
          <ThemedText type="title" style={styles.pageTitle}>
            Métricas globales
          </ThemedText>

          {isLoadingStats && (
            <ThemedText type="small" themeColor="textSecondary">
              Cargando…
            </ThemedText>
          )}

          {stats && (
            <ThemedView style={styles.tileGrid}>
              <StatTile label="Usuarios totales" value={`${stats.total_users}`} />
              <StatTile label="Nuevos (7 días)" value={`${stats.new_users_7d}`} />
              <StatTile label="Entrenadores" value={`${stats.trainers_count}`} />
              <StatTile label="Baneados" value={`${stats.banned_users_count}`} />
              <StatTile label="Reportes pendientes" value={`${stats.pending_reports_count}`} />
              <StatTile label="Retención" value={`${stats.retention_pct}%`} />
              <StatTile label="DAU" value={`${stats.dau}`} />
              <StatTile label="WAU" value={`${stats.wau}`} />
              <StatTile label="MAU" value={`${stats.mau}`} />
            </ThemedView>
          )}

          <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  pageTitle: { fontSize: 28, lineHeight: 34 },
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, backgroundColor: 'transparent' },
});
