import { StyleSheet } from 'react-native';
import { Flame } from 'lucide-react-native';
import type { DashboardStats, GamificationSummary } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Skeleton } from '@/components/ui/skeleton';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface PerformanceHeroProps {
  stats: DashboardStats | null;
  gamification: GamificationSummary | null;
  isLoading: boolean;
}

export function PerformanceHero({ stats, gamification, isLoading }: PerformanceHeroProps) {
  const theme = useTheme();

  if (isLoading) {
    return <Skeleton height={176} borderRadius={Spacing.four} />;
  }

  const progressPct = Math.round((gamification?.progress_pct ?? 0) * 100);

  return (
    <ThemedView type="backgroundElement" style={[styles.container, { borderColor: `${theme.accent}33` }]}>
      <ProgressRing
        value={gamification?.progress_pct ?? 0}
        max={1}
        size={92}
        strokeWidth={8}
        color="accent"
        label="Nivel"
        valueLabel={`${gamification?.level ?? 1}`}
      />

      <ThemedView style={styles.info}>
        <ThemedText type="small" themeColor="textSecondary" style={styles.eyebrow}>
          Progreso de nivel
        </ThemedText>
        <ThemedText type="subtitle" style={styles.percent}>
          {progressPct}%
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {gamification?.total_xp ?? 0} / {gamification?.xp_for_next_level ?? 100} XP
        </ThemedText>

        <ThemedView style={styles.statsRow}>
          <ThemedView style={styles.statItem}>
            <Flame size={14} color={theme.accent} />
            <ThemedText type="smallBold">{stats?.current_streak_days ?? 0}</ThemedText>
          </ThemedView>
          <ThemedText type="small" themeColor="textSecondary">
            {stats?.total_hours ?? 0} h
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {((stats?.total_volume_kg ?? 0) / 1000).toFixed(1)} t
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: Spacing.four,
    borderWidth: 1,
    padding: Spacing.four,
  },
  info: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  percent: {
    fontSize: 26,
    lineHeight: 30,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginTop: Spacing.two,
    backgroundColor: 'transparent',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'transparent',
  },
});
