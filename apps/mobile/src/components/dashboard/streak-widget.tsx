import { StyleSheet } from 'react-native';
import { Flame } from 'lucide-react-native';
import type { WorkoutSession } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { apiDateKey, toDateKey } from '@/lib/calendar-grid';
import { glowShadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const DAY_LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

interface StreakWidgetProps {
  streakDays: number;
  sessions: WorkoutSession[];
}

/**
 * Fila L-M-M-J-V-S-D de la semana actual. Reutiliza `toDateKey` (mismo
 * criterio de "día" que el calendario, ver lib/calendar-grid.ts) para marcar
 * qué días de esta semana ya tienen un entrenamiento completado — no hay
 * endpoint dedicado para esto, se deriva de `workout-history-store`
 * (la misma lista que ya alimenta la pantalla de historial).
 */
export function StreakWidget({ streakDays, sessions }: StreakWidgetProps) {
  const theme = useTheme();

  if (streakDays <= 0) return null;

  const today = new Date();
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - mondayOffset);
  const weekDays = Array.from(
    { length: 7 },
    (_, i) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i),
  );

  const trainedKeys = new Set(
    sessions.filter((s) => s.completed && !s.cancelled).map((s) => apiDateKey(s.performed_at)),
  );
  const todayKey = toDateKey(today);

  return (
    <ThemedView
      type="backgroundElement"
      style={[styles.card, { borderColor: `${theme.accent}30` }, glowShadow(theme.accent)]}>
      <ThemedView style={styles.header}>
        <Flame size={18} color={theme.accent} />
        <ThemedText type="smallBold">
          Racha de {streakDays} {streakDays === 1 ? 'día' : 'días'}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.week}>
        {weekDays.map((date, i) => {
          const key = toDateKey(date);
          const trained = trainedKeys.has(key);
          const isToday = key === todayKey;
          const isFuture = date.getTime() > today.getTime();

          return (
            <ThemedView key={key} style={styles.dayColumn}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.dayLetter}>
                {DAY_LETTERS[i]}
              </ThemedText>
              <ThemedView
                style={[
                  styles.dot,
                  { borderColor: theme.border },
                  isToday && { borderColor: theme.accent },
                  trained && { backgroundColor: theme.accent, borderColor: theme.accent },
                  isFuture && styles.futureDot,
                ]}>
                {trained && (
                  <ThemedText type="small" style={styles.check}>
                    ✓
                  </ThemedText>
                )}
              </ThemedView>
            </ThemedView>
          );
        })}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.four,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  dayColumn: {
    alignItems: 'center',
    gap: Spacing.one,
    backgroundColor: 'transparent',
  },
  dayLetter: {
    fontSize: 11,
  },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  futureDot: {
    opacity: 0.4,
  },
  check: {
    fontSize: 13,
    fontWeight: '700',
    color: '#050505',
  },
});
