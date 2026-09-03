import { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Flame } from 'lucide-react-native';
import type { Challenge } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { CardShadow, glowShadow, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useRetosStore } from '@/store/retos-store';
import { Skeleton } from '@/components/ui/skeleton';

function ProgressFill({ pct, color }: { pct: number; color: string }) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(pct, { duration: 700 });
  }, [pct, width]);

  const style = useAnimatedStyle(() => ({ width: `${width.value}%` }));

  return <Animated.View style={[styles.progressFill, { backgroundColor: color }, style]} />;
}

const METRIC_LABEL: Record<Challenge['criteria']['metric'], string> = {
  workouts_count: 'entrenamientos',
  total_volume_kg: 'kg de volumen',
};

function daysRemaining(endsAt: string): number {
  const ms = new Date(endsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

function Leaderboard() {
  const theme = useTheme();
  const leaderboard = useRetosStore((s) => s.leaderboard);

  return (
    <ThemedView style={styles.leaderboard}>
      {leaderboard === null && <Skeleton height={72} borderRadius={Spacing.three} />}
      {leaderboard?.length === 0 && (
        <ThemedText type="small" themeColor="textSecondary">
          Todavía nadie tiene progreso en este reto.
        </ThemedText>
      )}
      {leaderboard?.map((entry) => (
        <ThemedView
          key={entry.user_id}
          style={[styles.listRow, entry.is_viewer && { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText type="small">
            {entry.rank}. {entry.user_name}
          </ThemedText>
          <ThemedText type="smallBold" style={{ color: theme.accent }}>
            {entry.progress_value.toLocaleString('es-AR')}
          </ThemedText>
        </ThemedView>
      ))}
    </ThemedView>
  );
}

function ChallengeHero({ challenge }: { challenge: Challenge }) {
  const theme = useTheme();
  const { activeChallengeId, join, openLeaderboard, closeLeaderboard } = useRetosStore();
  const expanded = activeChallengeId === challenge.id;
  const progressPct = challenge.progress_value !== null
    ? Math.min(100, Math.round((challenge.progress_value / challenge.criteria.target) * 100))
    : 0;
  const daysLeft = daysRemaining(challenge.ends_at);

  return (
    <ThemedView
      style={[
        styles.hero,
        { borderColor: `${theme.accent}40`, backgroundColor: `${theme.accent}14` },
        glowShadow(theme.accent),
      ]}>
      <ThemedView style={styles.heroHeader}>
        <ThemedView style={[styles.heroIcon, { backgroundColor: `${theme.accent}26` }]}>
          <Flame size={20} color={theme.accent} />
        </ThemedView>
        <ThemedView style={styles.heroTitleBlock}>
          <ThemedText type="smallBold" style={[styles.eyebrow, { color: theme.accent }]}>
            TU DESAFÍO ACTUAL
          </ThemedText>
          <ThemedText type="subtitle" style={styles.heroTitle}>
            {challenge.title}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedText type="small" themeColor="textSecondary">
        {challenge.description}
      </ThemedText>

      {challenge.joined && (
        <ThemedView style={styles.progressBlock}>
          <ThemedView style={[styles.progressTrack, { backgroundColor: theme.backgroundSelected }]}>
            <ProgressFill pct={progressPct} color={theme.accent} />
          </ThemedView>
          <ThemedView style={styles.progressRow}>
            <ThemedText type="smallBold">
              {challenge.progress_value ?? 0} / {challenge.criteria.target} {METRIC_LABEL[challenge.criteria.metric]}
            </ThemedText>
            {challenge.completed ? (
              <ThemedText type="smallBold" style={{ color: theme.accent }}>
                ¡Completado!
              </ThemedText>
            ) : (
              <ThemedText type="small" themeColor="textSecondary">
                {daysLeft} días restantes
              </ThemedText>
            )}
          </ThemedView>
        </ThemedView>
      )}

      {!challenge.joined && (
        <ThemedText type="small" themeColor="textSecondary">
          {daysLeft} días restantes
        </ThemedText>
      )}

      {challenge.joined ? (
        <PrimaryButton
          label={expanded ? 'Ocultar tabla' : 'Ver tabla'}
          variant="ghost"
          onPress={() => (expanded ? closeLeaderboard() : openLeaderboard(challenge.id))}
        />
      ) : (
        <PrimaryButton label="Unirme" onPress={() => join(challenge.id)} />
      )}

      {expanded && <Leaderboard />}
    </ThemedView>
  );
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const theme = useTheme();
  const { activeChallengeId, join, openLeaderboard, closeLeaderboard } = useRetosStore();
  const expanded = activeChallengeId === challenge.id;
  const progressPct = challenge.progress_value !== null
    ? Math.min(100, Math.round((challenge.progress_value / challenge.criteria.target) * 100))
    : 0;

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.eyebrow}>
        {challenge.type === 'weekly' ? 'SEMANAL' : 'MENSUAL'}
      </ThemedText>
      <ThemedText type="smallBold">{challenge.title}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {challenge.description}
      </ThemedText>

      {challenge.joined && (
        <ThemedView style={styles.progressBlock}>
          <ThemedView style={styles.progressRow}>
            <ThemedText type="small" themeColor="textSecondary">
              {challenge.progress_value ?? 0} / {challenge.criteria.target} {METRIC_LABEL[challenge.criteria.metric]}
            </ThemedText>
            {challenge.completed && (
              <ThemedText type="smallBold" style={{ color: theme.accent }}>
                ¡Completado!
              </ThemedText>
            )}
          </ThemedView>
          <ThemedView style={[styles.progressTrack, { backgroundColor: theme.backgroundSelected }]}>
            <ProgressFill pct={progressPct} color={theme.accent} />
          </ThemedView>
        </ThemedView>
      )}

      {challenge.joined ? (
        <PrimaryButton
          label={expanded ? 'Ocultar tabla' : 'Ver tabla'}
          variant="ghost"
          onPress={() => (expanded ? closeLeaderboard() : openLeaderboard(challenge.id))}
        />
      ) : (
        <PrimaryButton label="Unirme" onPress={() => join(challenge.id)} />
      )}

      {expanded && <Leaderboard />}
    </ThemedView>
  );
}

export default function RetosScreen() {
  const { challenges, isLoading, error, load, closeLeaderboard } = useRetosStore();

  useEffect(() => {
    load();
    return () => closeLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sorted = [...challenges].sort(
    (a, b) => new Date(a.ends_at).getTime() - new Date(b.ends_at).getTime(),
  );
  const current = sorted.find((c) => c.joined && !c.completed) ?? sorted[0];
  const rest = sorted.filter((c) => c.id !== current?.id);

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <ThemedText type="title" style={styles.pageTitle}>
            Retos
          </ThemedText>

          {error && (
            <ThemedText type="small" style={styles.error}>
              {error}
            </ThemedText>
          )}

          {isLoading && <Skeleton height={140} borderRadius={Spacing.four} />}

          {!isLoading && sorted.length === 0 && (
            <ThemedText type="small" themeColor="textSecondary">
              No hay retos activos en este momento.
            </ThemedText>
          )}

          {current && (
            <Animated.View entering={FadeInUp.delay(0).duration(320)}>
              <ChallengeHero challenge={current} />
            </Animated.View>
          )}

          {rest.map((challenge, index) => (
            <Animated.View key={challenge.id} entering={FadeInUp.delay(80 + index * 60).duration(280)}>
              <ChallengeCard challenge={challenge} />
            </Animated.View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  scrollView: { alignSelf: 'stretch' },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  pageTitle: { fontSize: 28, lineHeight: 34 },
  hero: {
    borderRadius: Spacing.four,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitleBlock: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  heroTitle: {
    fontSize: 22,
    lineHeight: 28,
  },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.two,
    ...CardShadow,
  },
  eyebrow: { letterSpacing: 1 },
  progressBlock: { gap: Spacing.one, backgroundColor: 'transparent' },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent' },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  leaderboard: {
    gap: Spacing.one,
    borderTopWidth: 1,
    borderColor: 'rgba(128,128,128,0.2)',
    paddingTop: Spacing.two,
    backgroundColor: 'transparent',
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.one,
    borderRadius: Spacing.two,
  },
  error: { color: '#FF4D5E' },
});
