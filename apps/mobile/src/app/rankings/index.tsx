import { useEffect } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RankingScope } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useRankingsStore } from '@/store/rankings-store';

const SCOPES: { value: RankingScope; label: string }[] = [
  { value: 'global', label: 'Global' },
  { value: 'city', label: 'Ciudad' },
  { value: 'country', label: 'País' },
  { value: 'gym', label: 'Gimnasio' },
  { value: 'age_bracket', label: 'Edad' },
  { value: 'sex', label: 'Sexo' },
  { value: 'strength_category', label: 'Fuerza' },
];

export default function RankingsScreen() {
  const theme = useTheme();
  const { scope, data, isLoading, error, setScope, load } = useRankingsStore();

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="title" style={styles.pageTitle}>
            Rankings
          </ThemedText>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
            {SCOPES.map((s) => {
              const selected = s.value === scope;
              return (
                <Pressable
                  key={s.value}
                  onPress={() => setScope(s.value)}
                  style={[
                    styles.chip,
                    { borderColor: selected ? theme.accent : theme.backgroundSelected },
                    selected && { backgroundColor: theme.backgroundSelected },
                  ]}
                >
                  <ThemedText type="small" themeColor={selected ? 'text' : 'textSecondary'}>
                    {s.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>

          {error && (
            <ThemedText type="small" style={styles.error}>
              {error}
            </ThemedText>
          )}

          <ThemedView type="backgroundElement" style={styles.card}>
            {data?.scope_label && (
              <ThemedText type="small" themeColor="textSecondary">
                {data.scope_label}
              </ThemedText>
            )}

            {isLoading && (
              <ThemedText type="small" themeColor="textSecondary">
                Cargando…
              </ThemedText>
            )}

            {!isLoading && (data?.entries.length ?? 0) === 0 && (
              <ThemedText type="small" themeColor="textSecondary">
                Todavía no hay suficientes datos para este ranking.
              </ThemedText>
            )}

            {!isLoading &&
              data?.entries.map((entry) => (
                <ThemedView
                  key={entry.user_id}
                  style={[styles.listRow, entry.is_viewer && { backgroundColor: theme.backgroundSelected }]}
                >
                  <ThemedText type="small">
                    {entry.rank}. {entry.user_name}
                  </ThemedText>
                  <ThemedText type="smallBold" style={{ color: theme.accent }}>
                    {entry.metric_value.toLocaleString('es-AR')} kg
                  </ThemedText>
                </ThemedView>
              ))}

            {!isLoading && data?.viewer && !data.entries.some((e) => e.user_id === data.viewer?.user_id) && (
              <ThemedView style={[styles.listRow, styles.viewerRow, { borderColor: theme.backgroundSelected }]}>
                <ThemedText type="small">Tu posición: {data.viewer.rank}</ThemedText>
                <ThemedText type="smallBold" style={{ color: theme.accent }}>
                  {data.viewer.metric_value.toLocaleString('es-AR')} kg
                </ThemedText>
              </ThemedView>
            )}
          </ThemedView>

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
  chipsRow: { gap: Spacing.two },
  chip: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
  },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.one,
    borderRadius: Spacing.two,
    backgroundColor: 'transparent',
  },
  viewerRow: {
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  error: { color: '#C9564A' },
});
