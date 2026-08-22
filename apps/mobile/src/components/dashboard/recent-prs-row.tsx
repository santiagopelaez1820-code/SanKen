import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { Trophy } from 'lucide-react-native';
import type { PersonalRecordSummary } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EmptyState } from '@/components/ui/empty-state';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface RecentPRsRowProps {
  records: PersonalRecordSummary[];
}

export function RecentPRsRow({ records }: RecentPRsRowProps) {
  const theme = useTheme();

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedView style={styles.header}>
        <ThemedText type="smallBold">Tus PRs</ThemedText>
        <Pressable onPress={() => router.push('/prs')}>
          <ThemedText type="small" style={{ color: theme.accent }}>
            Ver todos
          </ThemedText>
        </Pressable>
      </ThemedView>

      {records.length === 0 ? (
        <EmptyState icon={Trophy} title="Sin récords todavía" description="Registra tu primer PR desde la pestaña PR." />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {records.slice(0, 6).map((record) => (
            <ThemedView key={record.id} type="backgroundSelected" style={styles.tile}>
              <Trophy size={16} color={theme.accent} />
              <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                {record.exercise_name}
              </ThemedText>
              <ThemedText type="smallBold" style={styles.value}>
                {record.value} kg
              </ThemedText>
            </ThemedView>
          ))}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  row: {
    gap: Spacing.two,
  },
  tile: {
    minWidth: 128,
    borderRadius: Spacing.three,
    padding: Spacing.two,
    gap: Spacing.half,
  },
  value: {
    fontSize: 18,
  },
});
