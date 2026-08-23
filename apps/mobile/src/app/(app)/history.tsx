import { useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Dumbbell } from 'lucide-react-native';
import { getWorkoutSessionStatus, WORKOUT_SESSION_STATUS_LABEL, type WorkoutSession } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { BottomTabInset, CardShadow, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useWorkoutHistoryStore } from '@/store/workout-history-store';

const STATUS_BADGE_VARIANT: Record<ReturnType<typeof getWorkoutSessionStatus>, BadgeVariant> = {
  completed: 'success',
  active: 'accent2',
  skipped: 'neutral',
  cancelled: 'warning',
};

function formatDate(performedAt: string): string {
  return new Date(performedAt)
    .toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase();
}

function SessionRow({ session, index }: { session: WorkoutSession; index: number }) {
  const theme = useTheme();
  const status = getWorkoutSessionStatus(session);

  return (
    <Animated.View entering={FadeInUp.delay(Math.min(index, 8) * 40).duration(260)}>
      <ThemedView type="backgroundElement" style={[styles.row, CardShadow]}>
        <ThemedView style={[styles.iconCircle, { backgroundColor: theme.backgroundSelected }]}>
          <Icon icon={Dumbbell} size={18} color={theme.textSecondary} />
        </ThemedView>

        <ThemedView style={styles.info}>
          <ThemedText type="smallBold" numberOfLines={1}>
            {session.routine_day_label ?? 'Sesión libre'}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {formatDate(session.performed_at)} · {session.exercises.length} ejercicios
            {session.completed && session.duration_minutes !== null ? ` · ${session.duration_minutes} min` : ''}
          </ThemedText>
        </ThemedView>

        <Badge label={WORKOUT_SESSION_STATUS_LABEL[status]} variant={STATUS_BADGE_VARIANT[status]} />
      </ThemedView>
    </Animated.View>
  );
}

export default function HistoryScreen() {
  const { sessions, isLoading, isLoadingMore, error, load, loadMore } = useWorkoutHistoryStore();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          style={styles.list}
          data={sessions}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item, index }) => <SessionRow session={item} index={index} />}
          onEndReachedThreshold={0.4}
          onEndReached={() => loadMore()}
          contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}
          ListHeaderComponent={
            <ThemedText type="title" style={styles.pageTitle}>
              Historial
            </ThemedText>
          }
          ListEmptyComponent={
            !isLoading ? (
              <ThemedText type="small" themeColor="textSecondary">
                Todavía no registraste entrenamientos.
              </ThemedText>
            ) : null
          }
          ListFooterComponent={
            isLoading || isLoadingMore ? <ActivityIndicator style={styles.spinner} /> : null
          }
        />
        {error && (
          <ThemedText type="small" style={styles.error}>
            {error}
          </ThemedText>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  list: { alignSelf: 'stretch' },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  pageTitle: { fontSize: 28, lineHeight: 34, marginBottom: Spacing.two },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Spacing.three,
    padding: Spacing.two,
    marginBottom: Spacing.two,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
    backgroundColor: 'transparent',
  },
  spinner: { marginVertical: Spacing.three },
  error: { color: '#C9564A', textAlign: 'center', paddingHorizontal: Spacing.four, paddingBottom: Spacing.two },
});
