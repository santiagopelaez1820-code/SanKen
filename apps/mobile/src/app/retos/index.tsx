import { useEffect } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Challenge } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useRetosStore } from '@/store/retos-store';

const METRIC_LABEL: Record<Challenge['criteria']['metric'], string> = {
  workouts_count: 'entrenamientos',
  total_volume_kg: 'kg de volumen',
};

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const theme = useTheme();
  const { activeChallengeId, leaderboard, join, openLeaderboard, closeLeaderboard } = useRetosStore();
  const expanded = activeChallengeId === challenge.id;
  const progressPct = challenge.progress_value !== null
    ? Math.min(100, Math.round((challenge.progress_value / challenge.criteria.target) * 100))
    : 0;

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.eyebrow}>
        {challenge.type === 'weekly' ? 'SEMANAL' : 'MENSUAL'}
      </ThemedText>
      <ThemedText type="subtitle">{challenge.title}</ThemedText>
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
            <ThemedView style={[styles.progressFill, { width: `${progressPct}%`, backgroundColor: theme.accent }]} />
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

      {expanded && (
        <ThemedView style={styles.leaderboard}>
          {leaderboard === null && (
            <ThemedText type="small" themeColor="textSecondary">
              Cargando…
            </ThemedText>
          )}
          {leaderboard?.length === 0 && (
            <ThemedText type="small" themeColor="textSecondary">
              Todavía nadie tiene progreso en este reto.
            </ThemedText>
          )}
          {leaderboard?.map((entry) => (
            <ThemedView
              key={entry.user_id}
              style={[styles.listRow, entry.is_viewer && { backgroundColor: theme.backgroundSelected }]}
            >
              <ThemedText type="small">
                {entry.rank}. {entry.user_name}
              </ThemedText>
              <ThemedText type="smallBold" style={{ color: theme.accent }}>
                {entry.progress_value.toLocaleString('es-AR')}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      )}
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

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="title" style={styles.pageTitle}>
            Retos
          </ThemedText>

          {error && (
            <ThemedText type="small" style={styles.error}>
              {error}
            </ThemedText>
          )}

          {isLoading && (
            <ThemedText type="small" themeColor="textSecondary">
              Cargando…
            </ThemedText>
          )}

          {!isLoading && challenges.length === 0 && (
            <ThemedText type="small" themeColor="textSecondary">
              No hay retos activos en este momento.
            </ThemedText>
          )}

          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}

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
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  eyebrow: { letterSpacing: 1 },
  progressBlock: { gap: Spacing.one },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  leaderboard: { gap: Spacing.one, borderTopWidth: 1, borderColor: 'rgba(128,128,128,0.2)', paddingTop: Spacing.two },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.one,
    borderRadius: Spacing.two,
  },
  error: { color: '#C9564A' },
});
