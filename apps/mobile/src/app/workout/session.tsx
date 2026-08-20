import { useEffect, useMemo, useRef, useState } from 'react';
import { Redirect, router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LevelUpCelebration } from '@/components/gamification/level-up-celebration';
import { ExerciseVideoPlayer } from '@/components/workout/exercise-video-player';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useRoutineStore } from '@/store/routine-store';
import { useWorkoutStore } from '@/store/workout-store';

const ADVANCE_DELAY_MS = 900;

export default function WorkoutSessionScreen() {
  const {
    session,
    currentIndex,
    isSubmitting,
    error,
    lastSetWasPersonalRecord,
    gamificationResult,
    logSet,
    swapCurrentExercise,
    complete,
    cancel,
    submitFeedback,
    clearGamificationResult,
    reset,
  } = useWorkoutStore();
  const refreshRoutine = useRoutineStore((s) => s.load);

  const [weightInput, setWeightInput] = useState('');
  const [repsInput, setRepsInput] = useState('');
  const [restRemaining, setRestRemaining] = useState<number | null>(null);
  const [justSwapped, setJustSwapped] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const startedAt = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const workoutExercise = session?.exercises[currentIndex];
  const isLastExercise = session ? currentIndex === session.exercises.length - 1 : false;
  const allExercisesCompleted = session ? session.exercises.every((e) => e.all_sets_completed) : false
  const exerciseJustCompleted = workoutExercise ? workoutExercise.sets.length >= workoutExercise.target_sets : false

  const targetSetsLabel = useMemo(() => {
    if (!workoutExercise) return null;
    const rir = workoutExercise.target_rpe !== null ? (10 - workoutExercise.target_rpe).toFixed(1) : null;
    return `${workoutExercise.target_sets}×${workoutExercise.target_reps ?? '—'}${rir ? ` · RIR ${rir}` : ''}${workoutExercise.rest_seconds ? ` · ${workoutExercise.rest_seconds}s` : ''}`;
  }, [workoutExercise]);

  // Reps recomendadas para la PRÓXIMA serie de este ejercicio (índice =
  // cuántas ya se registraron) — cada serie puede tener un objetivo
  // distinto (ver ProgressiveOverloadCalculator, rampa por serie).
  const nextSetIndex = workoutExercise?.sets.length ?? 0;
  const suggestedRepsForNextSet = workoutExercise?.suggested_reps_per_set?.[nextSetIndex] ?? null;

  useEffect(() => {
    setWeightInput(workoutExercise?.suggested_weight_kg ? String(workoutExercise.suggested_weight_kg) : '');
    setJustSwapped(false);
    setRestRemaining(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workoutExercise?.id]);

  useEffect(() => {
    setRepsInput(suggestedRepsForNextSet !== null ? String(suggestedRepsForNextSet) : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workoutExercise?.id, nextSetIndex]);

  const handleSwap = async () => {
    await swapCurrentExercise();
    setJustSwapped((prev) => !prev);
  };

  const handleExit = async () => {
    setShowExitConfirm(false);
    await cancel();
    router.replace('/');
  };

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

  // Avance automático de sesión completa (sección 3 del pedido): cuando el
  // último ejercicio llega a sus 3 series, cierra la sesión solo — sin
  // esperar un "Finalizar entrenamiento" manual.
  useEffect(() => {
    if (!session || session.completed || !allExercisesCompleted || isSubmitting) return;
    const timeout = setTimeout(async () => {
      const durationMinutes = Math.max(1, Math.round((Date.now() - startedAt.current) / 60000));
      // OJO: no refrescar routine-store acá — el peso sugerido de la
      // próxima sesión recién se calcula al responder el feedback (ver
      // SubmitSessionFeedbackAction), no al completar. Refrescar antes de
      // tiempo deja el store con el peso viejo (ver handleFeedback).
      await complete(durationMinutes);
    }, ADVANCE_DELAY_MS);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allExercisesCompleted, session?.completed]);

  if (!session || !workoutExercise) {
    return <Redirect href="/" />;
  }

  const handleLogSet = async () => {
    const weight = Number(weightInput);
    const reps = Number(repsInput);
    if (!weight || !reps) return;

    await logSet(weight, reps);
    // repsInput se re-precarga solo con la sugerencia de la próxima serie
    // (ver el useEffect de nextSetIndex más arriba) — no hace falta limpiarlo acá.
    startRestTimer(workoutExercise?.rest_seconds ?? 90);
  };

  const handleFeedback = async (completedAsPlanned: boolean) => {
    await submitFeedback(completedAsPlanned);
    // Recién acá el peso sugerido de la próxima sesión ya está calculado.
    refreshRoutine();
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
          <ThemedView style={styles.header}>
            <ThemedText type="small" themeColor="textSecondary">
              {currentIndex + 1}/{session.exercises.length}
            </ThemedText>
            <PrimaryButton label="Salir" variant="ghost" onPress={() => setShowExitConfirm(true)} />
          </ThemedView>
          <ThemedText type="subtitle">{workoutExercise.exercise.name}</ThemedText>
          {targetSetsLabel && (
            <ThemedText type="small" themeColor="textSecondary">
              Objetivo: {targetSetsLabel}
            </ThemedText>
          )}
          {workoutExercise.suggested_weight_kg !== null && (
            <ThemedText type="small">
              Peso recomendado:{' '}
              <ThemedText type="smallBold" style={styles.suggested}>
                {workoutExercise.suggested_weight_kg} kg
              </ThemedText>
            </ThemedText>
          )}
          {suggestedRepsForNextSet !== null && (
            <ThemedText type="small">
              Repeticiones recomendadas:{' '}
              <ThemedText type="smallBold" style={styles.suggested}>
                {suggestedRepsForNextSet}
              </ThemedText>
            </ThemedText>
          )}

          <ExerciseVideoPlayer videoUrl={workoutExercise.exercise.video_url} />

          {workoutExercise.alternative && (
            <ThemedView style={styles.swapBlock}>
              <PrimaryButton
                label={justSwapped ? '↩️ Volver al anterior' : '🔄 Cambiar ejercicio'}
                variant="ghost"
                loading={isSubmitting}
                disabled={workoutExercise.sets.length > 0}
                onPress={handleSwap}
              />
              {workoutExercise.sets.length > 0 && (
                <ThemedText type="small" themeColor="textSecondary">
                  Ya registraste series — no se puede cambiar el ejercicio en esta sesión.
                </ThemedText>
              )}
            </ThemedView>
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

          {exerciseJustCompleted ? (
            <ThemedView style={styles.doneBanner}>
              <ThemedText type="smallBold" style={styles.doneText}>
                ✅ Ejercicio completado — {isLastExercise ? 'cerrando entrenamiento…' : 'pasando al siguiente…'}
              </ThemedText>
            </ThemedView>
          ) : (
            <>
              <ThemedView style={styles.inputsRow}>
                <ThemedView style={styles.inputHalf}>
                  <TextField label="Peso realizado (kg)" keyboardType="decimal-pad" value={weightInput} onChangeText={setWeightInput} />
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
                label={`Registrar serie ${workoutExercise.sets.length + 1} de ${workoutExercise.target_sets}`}
                loading={isSubmitting}
                disabled={!weightInput || !repsInput}
                onPress={handleLogSet}
              />
            </>
          )}

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
        </ScrollView>
      </SafeAreaView>

      <ConfirmDialog
        visible={showExitConfirm}
        title="¿Salir del entrenamiento?"
        description="Las series que ya registraste se conservan, pero esta sesión no contará como completada."
        confirmLabel="Salir"
        cancelLabel="Seguir entrenando"
        isLoading={isSubmitting}
        onConfirm={handleExit}
        onCancel={() => setShowExitConfirm(false)}
      />
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center' },
  suggested: { color: '#FF7A3D' },
  setsCard: { borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.two },
  swapBlock: { gap: Spacing.one },
  setRow: { flexDirection: 'row', justifyContent: 'space-between' },
  prBanner: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.two,
    alignItems: 'center',
    backgroundColor: 'rgba(255,122,61,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,122,61,0.35)',
  },
  prText: { color: '#FF7A3D' },
  doneBanner: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    backgroundColor: 'rgba(255,122,61,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,122,61,0.35)',
  },
  doneText: { color: '#FF7A3D', textAlign: 'center' },
  inputsRow: { flexDirection: 'row', gap: Spacing.three },
  inputHalf: { flex: 1 },
  error: { color: '#C9564A', textAlign: 'center' },
  restCard: { alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.four },
  restNumber: { fontVariant: ['tabular-nums'] },
  feedbackRow: { flexDirection: 'row', gap: Spacing.three, alignSelf: 'stretch' },
  feedbackHalf: { flex: 1 },
});
