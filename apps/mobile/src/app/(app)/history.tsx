import { useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { WorkoutSession } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useWorkoutHistoryStore } from '@/store/workout-history-store';

function SessionRow({ session }: { session: WorkoutSession }) {
  const theme = useTheme();

  return (
    <ThemedView type="backgroundElement" style={styles.row}>
      <ThemedView style={styles.rowHeader}>
        <ThemedText type="smallBold">{session.routine_day_label ?? 'Sesión libre'}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {session.performed_at}
        </ThemedText>
      </ThemedView>
      <ThemedText type="small" themeColor="textSecondary">
        {session.exercises.length} ejercicios ·{' '}
        {session.completed
          ? session.duration_minutes !== null
            ? `${session.duration_minutes} min`
            : '—'
          : 'En curso'}
      </ThemedText>
      {!session.completed && (
        <ThemedText type="small" style={{ color: theme.accent }}>
          Sin completar
        </ThemedText>
      )}
    </ThemedView>
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
          data={sessions}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <SessionRow session={item} />}
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
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  pageTitle: { fontSize: 28, lineHeight: 34, marginBottom: Spacing.two },
  row: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.half,
    marginBottom: Spacing.two,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  spinner: { marginVertical: Spacing.three },
  error: { color: '#C9564A', textAlign: 'center', paddingHorizontal: Spacing.four, paddingBottom: Spacing.two },
});
