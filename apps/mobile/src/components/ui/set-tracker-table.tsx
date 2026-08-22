import { StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import type { WorkoutSet } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface SetTrackerTableProps {
  sets: WorkoutSet[];
  targetSets: number;
  suggestedWeightKg: number | null;
  suggestedRepsForNextSet: number | null;
}

export function SetTrackerTable({ sets, targetSets, suggestedWeightKg, suggestedRepsForNextSet }: SetTrackerTableProps) {
  const theme = useTheme();
  const nextSetNumber = sets.length + 1;
  const hasUpcoming = sets.length < targetSets;

  return (
    <ThemedView type="backgroundElement" style={[styles.container, { borderColor: theme.border }]}>
      <ThemedView style={[styles.row, styles.headerRow, { borderBottomColor: theme.border }]}>
        <ThemedText type="small" themeColor="textSecondary" style={styles.colSet}>
          Serie
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.col}>
          Kg
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.col}>
          Reps
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.col}>
          RPE
        </ThemedText>
        <ThemedView style={styles.colCheck} />
      </ThemedView>

      {sets.map((set) => (
        <Animated.View
          key={set.id}
          entering={FadeInUp.duration(250)}
          style={[styles.row, { borderBottomColor: theme.border }]}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.colSet}>
            {set.set_number}
          </ThemedText>
          <ThemedText type="smallBold" style={styles.col}>
            {set.weight_kg}
          </ThemedText>
          <ThemedText type="smallBold" style={styles.col}>
            {set.reps}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.col}>
            {set.rpe ?? '—'}
          </ThemedText>
          <ThemedView style={[styles.colCheck, styles.checkCircle, { backgroundColor: `${theme.success}26` }]}>
            <Check size={12} color={theme.success} />
          </ThemedView>
        </Animated.View>
      ))}

      {hasUpcoming && (suggestedWeightKg !== null || suggestedRepsForNextSet !== null) && (
        <ThemedView style={[styles.row, styles.targetRow, { backgroundColor: `${theme.accent}0D` }]}>
          <ThemedText type="smallBold" style={[styles.colSet, { color: theme.accent }]}>
            {nextSetNumber}
          </ThemedText>
          <ThemedText type="smallBold" style={[styles.col, { color: theme.accent }]}>
            {suggestedWeightKg ?? '—'}
          </ThemedText>
          <ThemedText type="smallBold" style={[styles.col, { color: theme.accent }]}>
            {suggestedRepsForNextSet ?? '—'}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.col}>
            objetivo
          </ThemedText>
          <ThemedView style={styles.colCheck}>
            <ThemedView style={[styles.dot, { backgroundColor: theme.accent }]} />
          </ThemedView>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.three,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
    backgroundColor: 'transparent',
  },
  headerRow: {
    paddingVertical: Spacing.one,
  },
  targetRow: {
    borderBottomWidth: 0,
  },
  colSet: { width: 32 },
  col: { flex: 1 },
  colCheck: { width: 20, alignItems: 'center', backgroundColor: 'transparent' },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
