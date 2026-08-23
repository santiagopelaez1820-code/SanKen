import { useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ScaleSelector } from '@/components/ui/scale-selector';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { findNextDay, useRoutineStore } from '@/store/routine-store';
import { useWorkoutStore } from '@/store/workout-store';

export default function PrecheckScreen() {
  const { routine, nextDayId } = useRoutineStore();
  const { start, isSubmitting, error } = useWorkoutStore();
  const [sleepQuality, setSleepQuality] = useState<number | null>(null);
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);
  const [muscleSoreness, setMuscleSoreness] = useState<number | null>(null);

  const day = findNextDay(routine, nextDayId);

  const handleStart = async () => {
    try {
      await start(day, {
        sleep_quality: sleepQuality ?? undefined,
        energy_level: energyLevel ?? undefined,
        muscle_soreness: muscleSoreness ?? undefined,
      });
      router.replace('/workout/session');
    } catch {
      // el error queda expuesto vía workout-store.error
    }
  };

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <ThemedText type="subtitle" style={styles.title}>
            {day?.label ?? 'Entrenamiento libre'}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
            Antes de empezar, cuéntanos cómo llegas hoy.
          </ThemedText>

          <ThemedView style={styles.form}>
            <ScaleSelector label="¿Cómo dormiste?" value={sleepQuality} onChange={setSleepQuality} />
            <ScaleSelector label="Nivel de energía" value={energyLevel} onChange={setEnergyLevel} />
            <ScaleSelector label="Dolor muscular" value={muscleSoreness} onChange={setMuscleSoreness} />
          </ThemedView>

          {error && (
            <ThemedText type="small" style={styles.error}>
              {error}
            </ThemedText>
          )}

          <PrimaryButton label="Comenzar" loading={isSubmitting} onPress={handleStart} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    padding: Spacing.four,
    gap: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center' },
  form: { gap: Spacing.four },
  error: { color: '#D9534F', textAlign: 'center' },
});
