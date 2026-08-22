import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import { BarChart3, Clock, Flame, ListChecks, Lock, Trophy, Weight } from 'lucide-react-native';
import type { ProgressMetric, VolumeRange } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Skeleton } from '@/components/ui/skeleton';
import { StatTile } from '@/components/ui/stat-tile';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useDashboardStore } from '@/store/dashboard-store';
import { useGamificationStore } from '@/store/gamification-store';

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const theme = useTheme();

  return (
    <ThemedView type="backgroundElement" style={styles.segmented}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.segment, selected && { backgroundColor: theme.backgroundSelected }]}>
            <ThemedText type="small" themeColor={selected ? 'text' : 'textSecondary'}>
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </ThemedView>
  );
}

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const {
    stats,
    isLoadingStats,
    statsError,
    volumeRange,
    volume,
    isLoadingVolume,
    progressMetric,
    progress,
    isLoadingProgress,
    loadStats,
    loadVolume,
    loadProgress,
  } = useDashboardStore();
  const { summary, isLoading: isLoadingGamification, loadSummary } = useGamificationStore();

  useEffect(() => {
    loadStats();
    loadVolume();
    loadProgress();
    loadSummary();
  }, [loadStats, loadVolume, loadProgress, loadSummary]);

  const chartWidth = Math.min(width, MaxContentWidth) - Spacing.four * 2 - Spacing.three * 2;

  const barData = volume.map((v) => ({
    value: v.volume_kg,
    label: v.muscle_group.slice(0, 4),
    frontColor: theme.accentSecondary,
  }));

  const lineData = progress.map((p) => ({
    value: p.value,
    label: p.date.slice(5),
  }));

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
          <ThemedText type="title" style={styles.pageTitle}>
            Progreso
          </ThemedText>

          {statsError && (
            <ThemedText type="small" style={styles.error}>
              {statsError}
            </ThemedText>
          )}

          <ThemedView style={styles.tileGrid}>
            <StatTile
              icon={Clock}
              label="Horas entrenadas"
              value={isLoadingStats ? '…' : `${stats?.total_hours ?? 0} h`}
            />
            <StatTile icon={ListChecks} label="Series totales" value={isLoadingStats ? '…' : `${stats?.total_sets ?? 0}`} />
            <StatTile
              icon={Weight}
              label="Toneladas movidas"
              value={isLoadingStats ? '…' : `${((stats?.total_volume_kg ?? 0) / 1000).toFixed(1)} t`}
            />
            <StatTile
              icon={Flame}
              label="Racha actual"
              value={isLoadingStats ? '…' : `${stats?.current_streak_days ?? 0} días`}
              hint={stats && stats.current_streak_days > 0 ? '¡Sigue así!' : undefined}
            />
          </ThemedView>

          <ThemedView type="backgroundElement" style={[styles.card, styles.xpCard]}>
            <ProgressRing
              value={summary?.progress_pct ?? 0}
              max={1}
              size={76}
              strokeWidth={7}
              color="accent"
              label="Nivel"
              valueLabel={isLoadingGamification ? '…' : `${summary?.level ?? 1}`}
            />
            <ThemedView style={styles.xpInfo}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.eyebrow}>
                PROGRESO DE NIVEL
              </ThemedText>
              {!isLoadingGamification && (
                <ThemedText type="small" themeColor="textSecondary">
                  {`${summary?.total_xp ?? 0} / ${summary?.xp_for_next_level ?? 100} XP`}
                </ThemedText>
              )}
            </ThemedView>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedView style={styles.cardHeader}>
              <ThemedText type="smallBold">Volumen por músculo</ThemedText>
              <Segmented
                options={[
                  { label: 'Semana', value: 'weekly' as VolumeRange },
                  { label: 'Mes', value: 'monthly' as VolumeRange },
                ]}
                value={volumeRange}
                onChange={(range) => loadVolume(range)}
              />
            </ThemedView>

            {isLoadingVolume && <Skeleton height={180} borderRadius={Spacing.three} />}
            {!isLoadingVolume && barData.length === 0 && (
              <EmptyState icon={BarChart3} title="Sin datos de volumen" description="Todavía no hay entrenamientos registrados en este rango." />
            )}
            {!isLoadingVolume && barData.length > 0 && (
              <BarChart
                data={barData}
                width={chartWidth}
                height={180}
                barWidth={22}
                spacing={18}
                roundedTop
                noOfSections={4}
                yAxisTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
                xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
                yAxisColor={theme.backgroundSelected}
                xAxisColor={theme.backgroundSelected}
                hideRules
              />
            )}
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedView style={styles.cardHeader}>
              <ThemedText type="smallBold">Progreso</ThemedText>
              <Segmented
                options={[
                  { label: 'Peso', value: 'weight' as ProgressMetric },
                  { label: 'Volumen', value: 'volume' as ProgressMetric },
                ]}
                value={progressMetric}
                onChange={(metric) => loadProgress(metric)}
              />
            </ThemedView>

            {isLoadingProgress && <Skeleton height={180} borderRadius={Spacing.three} />}
            {!isLoadingProgress && lineData.length === 0 && (
              <EmptyState icon={BarChart3} title="Sin datos de progreso" description="Todavía no hay suficientes registros para esta métrica." />
            )}
            {!isLoadingProgress && lineData.length > 0 && (
              <LineChart
                data={lineData}
                width={chartWidth}
                height={180}
                thickness={2}
                color={theme.accent}
                dataPointsColor={theme.accent}
                yAxisTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
                xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
                yAxisColor={theme.backgroundSelected}
                xAxisColor={theme.backgroundSelected}
                hideRules
                curved
              />
            )}
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="smallBold">Récords recientes</ThemedText>
            {(stats?.recent_personal_records.length ?? 0) === 0 && !isLoadingStats && (
              <EmptyState icon={Trophy} title="Sin récords todavía" description="Registra tu primer PR desde la pestaña PR." />
            )}
            {stats?.recent_personal_records.map((pr) => (
              <ThemedView key={pr.id} style={styles.listRow}>
                <ThemedText type="small">{pr.exercise_name}</ThemedText>
                <ThemedText type="smallBold" style={{ color: theme.accent }}>
                  {pr.value} kg
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedView style={styles.cardHeader}>
              <ThemedText type="smallBold">Logros</ThemedText>
              {(summary?.unlocked_achievements.length ?? 0) + (summary?.locked_achievements.length ?? 0) > 0 && (
                <ThemedText type="smallBold" style={{ color: theme.accent }}>
                  {`${summary?.unlocked_achievements.length ?? 0}/${
                    (summary?.unlocked_achievements.length ?? 0) + (summary?.locked_achievements.length ?? 0)
                  }`}
                </ThemedText>
              )}
            </ThemedView>
            <ThemedView style={styles.achievementsGrid}>
              {[...(summary?.unlocked_achievements ?? []), ...(summary?.locked_achievements ?? [])].map(
                (achievement) => (
                  <ThemedView
                    key={achievement.code}
                    style={[
                      styles.achievementBadge,
                      { borderColor: achievement.unlocked ? theme.accent : theme.backgroundSelected },
                      !achievement.unlocked && styles.achievementLocked,
                    ]}>
                    <Icon
                      icon={achievement.unlocked ? Trophy : Lock}
                      size={20}
                      color={achievement.unlocked ? theme.accent : theme.textSecondary}
                    />
                    <ThemedText type="small" style={styles.achievementName}>
                      {achievement.name}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      +{achievement.xp_bonus} XP
                    </ThemedText>
                  </ThemedView>
                ),
              )}
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center' },
  scrollView: { alignSelf: 'stretch' },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  pageTitle: { fontSize: 28, lineHeight: 34, marginBottom: Spacing.one },
  error: { color: '#C9564A' },
  tileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: Spacing.three,
    padding: 2,
  },
  segment: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.one,
    backgroundColor: 'transparent',
  },
  xpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  xpInfo: {
    flex: 1,
    gap: Spacing.half,
    backgroundColor: 'transparent',
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  achievementBadge: {
    flexBasis: '30%',
    flexGrow: 1,
    alignItems: 'center',
    gap: Spacing.half,
    borderRadius: Spacing.three,
    borderWidth: 1,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.one,
    backgroundColor: 'transparent',
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementName: {
    textAlign: 'center',
  },
});
