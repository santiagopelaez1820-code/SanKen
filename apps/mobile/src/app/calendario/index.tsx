import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { CalendarEvent } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { monthGrid, toDateKey } from '@/lib/calendar-grid';
import { useCalendarioStore } from '@/store/calendario-store';
import { Skeleton } from '@/components/ui/skeleton';

const WEEKDAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

// workout_completed usa el acento de marca; workout_planned usa un gris
// neutro (todavía no pasó, no amerita color de marca) y reminder reusa el
// token de warning (es, conceptualmente, un aviso pendiente) — así los 3
// colores salen del sistema de tokens en vez de hex sueltos ajenos a la
// paleta negro+naranja+blanco.
function eventColor(
  type: CalendarEvent['type'],
  theme: { accent: string; textSecondary: string; warning: string },
): string {
  return { workout_completed: theme.accent, workout_planned: theme.textSecondary, reminder: theme.warning }[type];
}

export default function CalendarioScreen() {
  const theme = useTheme();
  const { month, events, isLoading, error, setMonth, load, addReminder, deleteReminder } = useCalendarioStore();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [reminderTitle, setReminderTitle] = useState('');

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const list = map.get(event.event_date) ?? [];
      list.push(event);
      map.set(event.event_date, list);
    }
    return map;
  }, [events]);

  const grid = useMemo(() => monthGrid(new Date(month.getFullYear(), month.getMonth(), 1)), [month]);
  const todayKey = toDateKey(new Date());
  const selectedEvents = selectedDate ? (eventsByDate.get(selectedDate) ?? []) : null;

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <ThemedText type="title" style={styles.pageTitle}>
            Calendario
          </ThemedText>

          <View style={styles.monthNav}>
            <Pressable
              onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
              style={[styles.navButton, { borderColor: theme.backgroundSelected }]}>
              <ThemedText type="smallBold">←</ThemedText>
            </Pressable>
            <ThemedText type="smallBold">
              {month.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
            </ThemedText>
            <Pressable
              onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
              style={[styles.navButton, { borderColor: theme.backgroundSelected }]}>
              <ThemedText type="smallBold">→</ThemedText>
            </Pressable>
          </View>

          <View style={styles.weekdayRow}>
            {WEEKDAY_LABELS.map((label, i) => (
              <ThemedText key={i} type="small" themeColor="textSecondary" style={styles.weekdayCell}>
                {label}
              </ThemedText>
            ))}
          </View>

          <View style={styles.grid}>
            {grid.map((date) => {
              const dateKey = toDateKey(date);
              const dayEvents = eventsByDate.get(dateKey) ?? [];
              const inMonth = date.getMonth() === month.getMonth();

              return (
                <Pressable
                  key={dateKey}
                  onPress={() => setSelectedDate(dateKey)}
                  style={[
                    styles.dayCell,
                    { borderColor: theme.backgroundSelected },
                    dateKey === todayKey && { borderColor: theme.accent },
                    dateKey === selectedDate && { backgroundColor: theme.backgroundSelected },
                  ]}>
                  <ThemedText type="small" themeColor={inMonth ? 'text' : 'textSecondary'}>
                    {date.getDate()}
                  </ThemedText>
                  {dayEvents.length > 0 && (
                    <View style={styles.dotsRow}>
                      {dayEvents.slice(0, 3).map((event, i) => (
                        <View key={i} style={[styles.dot, { backgroundColor: eventColor(event.type, theme) }]} />
                      ))}
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {isLoading && (
            <Skeleton height={72} borderRadius={Spacing.three} />
          )}
          {error && (
            <ThemedText type="small" style={styles.error}>
              {error}
            </ThemedText>
          )}

          {selectedDate && (
            <ThemedView type="backgroundElement" style={styles.detailCard}>
              <ThemedText type="smallBold">{selectedDate}</ThemedText>

              {selectedEvents?.length === 0 && (
                <ThemedText type="small" themeColor="textSecondary">
                  Sin eventos este día.
                </ThemedText>
              )}

              {selectedEvents?.map((event, i) => (
                <View key={i} style={styles.eventRow}>
                  <View style={styles.eventInfo}>
                    <View style={styles.eventLabel}>
                      <View style={[styles.dot, { backgroundColor: eventColor(event.type, theme) }]} />
                      <ThemedText type="small">{event.title}</ThemedText>
                    </View>
                    {event.type !== 'reminder' && event.muscle_groups.length > 0 && (
                      <ThemedText type="small" themeColor="textSecondary" style={styles.muscleGroups}>
                        {event.muscle_groups.join(' + ')}
                      </ThemedText>
                    )}
                  </View>
                  {event.type === 'reminder' && (
                    <Pressable onPress={() => deleteReminder(event.id)}>
                      <ThemedText type="small" themeColor="textSecondary">
                        Eliminar
                      </ThemedText>
                    </Pressable>
                  )}
                </View>
              ))}

              <View style={styles.addReminderRow}>
                <TextInput
                  value={reminderTitle}
                  onChangeText={setReminderTitle}
                  placeholder="Nuevo recordatorio…"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
                />
                <Pressable
                  disabled={!reminderTitle.trim()}
                  onPress={() => {
                    addReminder(selectedDate, reminderTitle.trim());
                    setReminderTitle('');
                  }}
                  style={[styles.addButton, { backgroundColor: theme.accent }, !reminderTitle.trim() && styles.disabled]}>
                  <ThemedText type="smallBold" style={{ color: '#050505' }}>
                    Agregar
                  </ThemedText>
                </Pressable>
              </View>
            </ThemedView>
          )}

          <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
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
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navButton: { borderWidth: 1, borderRadius: Spacing.two, paddingVertical: Spacing.one, paddingHorizontal: Spacing.two },
  weekdayRow: { flexDirection: 'row' },
  weekdayCell: { width: `${100 / 7}%`, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    gap: 2,
  },
  dotsRow: { flexDirection: 'row', gap: 2 },
  dot: { width: 5, height: 5, borderRadius: 2.5 },
  detailCard: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.two },
  eventRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eventInfo: { gap: 2 },
  eventLabel: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  muscleGroups: { paddingLeft: Spacing.two + 5 },
  addReminderRow: { flexDirection: 'row', gap: Spacing.two, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderRadius: Spacing.two, paddingHorizontal: Spacing.two, paddingVertical: Spacing.one },
  addButton: { borderRadius: Spacing.two, paddingHorizontal: Spacing.two, paddingVertical: Spacing.one },
  disabled: { opacity: 0.5 },
  error: { color: '#FF4D5E' },
});
