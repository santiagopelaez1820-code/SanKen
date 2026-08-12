import { useEffect, useMemo, useRef, useState } from 'react';
import { Redirect, router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LevelUpCelebration } from '@/components/gamification/level-up-celebration';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useRoutineStore } from '@/store/routine-store';
import { useWorkoutStore } from '@/store/workout-store';

export default function WorkoutSessionScreen() {
  const {
    session,
    routineDay,
    currentIndex,
    isSubmitting,
    error,
    lastSetWasPersonalRecord,
    gamificationResult,
    logSet,
    finishCurrentExercise,
    goToExercise,
    complete,
    submitFeedback,
    clearGamificationResult,
    reset,
  } = useWorkoutStore();
  const refreshRoutine = useRoutineStore((s) => s.load);

  const [weightInput, setWeightInput] = useState('');
  const [repsInput, setRepsInput] = useState('');
  const [restRemaining, setRestRemaining] = useState<number | null>(null);
  const startedAt = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const workoutExercise = session?.exercises[currentIndex];
  const targetExercise = routineDay?.exercises[currentIndex];
  const isLastExercise = session ? currentIndex === session.exercises.length - 1 : false;

  const targetSetsLabel = useMemo(() => {
    if (!targetExercise) return null;
    return `${targetExercise.target_sets}×${targetExercise.target_reps} · RIR ${(10 - (targetExercise.target_rpe ?? 8)).toFixed(1)} · ${targetExercise.rest_seconds}s`;
  }, [targetExercise]);

  useEffect(() => {
    const suggested = targetExercise?.suggested_weight_kg;
    setWeightInput(suggested ? String(suggested) : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRestTimer = (seconds: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRestRemaining(seconds);
    timerRef.current = setInterval(() => {
      setRestRemaining((prev) => {
        if (prev === null || prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (!session || !workoutExercise) {
    return <Redirect href="/" />;
  }

  const handleLogSet = async () => {
    const weight = Number(weightInput);
    const reps = Number(repsInput);
    if (!weight || !reps) return;

    await logSet(weight, reps);
    setRepsInput('');
    startRestTimer(targetExercise?.rest_seconds ?? 90);
  };

  const handleNextExercise = async () => {
    await finishCurrentExercise();
    setRestRemaining(null);
    setRepsInput('');
    goToExercise(currentIndex + 1);
  };

  const handleFinish = async () => {
    await finishCurrentExercise();
    const durationMinutes = Math.max(1, Math.round((Date.now() - startedAt.current) / 60000));
    await complete(durationMinutes);
    refreshRoutine();
  };

  const handleFeedback = async (completedAsPlanned: boolean) => {
    await submitFeedback(completedAsPlanned);
  };

  if (session.completed) {
    if (session.completed_as_planned === null) {
      return (
        <ThemedView style={styles.flex}>
          <LevelUpCelebration result={gamificationResult} onDismiss={clearGamificationResult} />
          <SafeAreaView style={[styles.flex, styles.centered]}>
            <ThemedText type="title" style={styles.title}>
              ¡Entrenamiento completado!
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
              ¿Pudiste completar el entrenamiento tal como estaba planeado?
            </ThemedText>
            <ThemedView style={styles.feedbackRow}>
              <ThemedView style={styles.feedbackHalf}>
                <PrimaryButton label="Sí" loading={isSubmitting} onPress={() => handleFeedback(true)} />
              </ThemedView>
              <ThemedView style={styles.feedbackHalf}>
                <PrimaryButton label="No" variant="ghost" loading={isSubmitting} onPress={() => handleFeedback(false)} />
              </ThemedView>
            </ThemedView>
          </SafeAreaView>
        </ThemedView>
      );
    }

    return (
      <ThemedView style={styles.flex}>
        <SafeAreaView style={[styles.flex, styles.centered]}>
          <ThemedText type="title" style={styles.title}>
            Buen trabajo
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
            {session.completed_as_planned
              ? 'Tu progreso quedó guardado. La próxima vez que hagas este entrenamiento, la app ajustará el peso automáticamente.'
              : 'Tu progreso quedó guardado. Mantendremos el peso la próxima vez para que puedas completarlo.'}
          </ThemedText>
          <PrimaryButton
            label="Volver a inicio"
            onPress={() => {
              reset();
              router.replace('/');
            }}
          />
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <ThemedText type="small" themeColor="textSecondary">
            {currentIndex + 1}/{session.exercises.length}
          </ThemedText>
          <ThemedText type="subtitle">{workoutExercise.exercise.name}</ThemedText>
          {targetSetsLabel && (
            <ThemedText type="small" themeColor="textSecondary">
              Objetivo: {targetSetsLabel}
            </ThemedText>
          )}

          <ThemedView type="backgroundElement" style={styles.setsCard}>
            {workoutExercise.sets.map((set) => (
              <ThemedView key={set.id} style={styles.setRow}>
                <ThemedText type="small">Serie {set.set_number}</ThemedText>
                <ThemedText type="smallBold">
                  {set.weight_kg}kg × {set.reps}
                </ThemedText>
              </ThemedView>
            ))}
            {workoutExercise.sets.length === 0 && (
              <ThemedText type="small" themeColor="textSecondary">
                Todavía no registras series de este ejercicio.
              </ThemedText>
            )}
          </ThemedView>

          {lastSetWasPersonalRecord && (
            <ThemedView style={styles.prBanner}>
              <ThemedText type="smallBold" style={styles.prText}>
                🏆 ¡Nuevo récord personal!
              </ThemedText>
            </ThemedView>
          )}

          <ThemedView style={styles.inputsRow}>
            <ThemedView style={styles.inputHalf}>
              <TextField label="Peso (kg)" keyboardType="decimal-pad" value={weightInput} onChangeText={setWeightInput} />
            </ThemedView>
            <ThemedView style={styles.inputHalf}>
              <TextField label="Repeticiones" keyboardType="number-pad" value={repsInput} onChangeText={setRepsInput} />
            </ThemedView>
          </ThemedView>

          {error && (
            <ThemedText type="small" style={styles.error}>
              {error}
            </ThemedText>
          )}

          <PrimaryButton
            label="Completar serie"
            loading={isSubmitting}
            disabled={!weightInput || !repsInput}
            onPress={handleLogSet}
          />

          {restRemaining !== null && (
            <ThemedView style={styles.restCard}>
              <ThemedText type="title" style={styles.restNumber}>
                {String(Math.floor(restRemaining / 60)).padStart(2, '0')}:{String(restRemaining % 60).padStart(2, '0')}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Descanso
              </ThemedText>
              <PrimaryButton label="Saltar descanso" variant="ghost" onPress={() => setRestRemaining(null)} />
            </ThemedView>
          )}

          <ThemedView style={styles.navRow}>
            {isLastExercise ? (
              <PrimaryButton label="Finalizar entrenamiento" loading={isSubmitting} onPress={handleFinish} />
            ) : (
              <PrimaryButton label="Siguiente ejercicio" variant="ghost" loading={isSubmitting} onPress={handleNextExercise} />
            )}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centered: { alignItems: 'center', justifyContent: 'center', padding: Spacing.four, gap: Spacing.three },
  scroll: {
    padding: Spacing.four,
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center' },
  setsCard: { borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.two },
  setRow: { flexDirection: 'row', justifyContent: 'space-between' },
  prBanner: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.two,
    alignItems: 'center',
    backgroundColor: 'rgba(201,162,39,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.35)',
  },
  prText: { color: '#C9A227' },
  inputsRow: { flexDirection: 'row', gap: Spacing.three },
  inputHalf: { flex: 1 },
  error: { color: '#C9564A', textAlign: 'center' },
  restCard: { alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.four },
  restNumber: { fontVariant: ['tabular-nums'] },
  navRow: { marginTop: Spacing.two },
  feedbackRow: { flexDirection: 'row', gap: Spacing.three, alignSelf: 'stretch' },
  feedbackHalf: { flex: 1 },
});
