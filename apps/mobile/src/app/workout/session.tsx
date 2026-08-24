import { useEffect, useMemo, useRef, useState } from 'react';
import { Redirect, router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, Dumbbell, RefreshCw, Trophy } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LevelUpCelebration } from '@/components/gamification/level-up-celebration';
import { ExerciseVideoPlayer } from '@/components/workout/exercise-video-player';
import { CelebrationOverlay } from '@/components/ui/celebration-overlay';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Icon } from '@/components/ui/icon';
import { PrimaryButton } from '@/components/ui/primary-button';
import { RestTimerRing } from '@/components/ui/rest-timer-ring';
import { SetTrackerTable } from '@/components/ui/set-tracker-table';
import { Stepper } from '@/components/ui/stepper';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useRoutineStore } from '@/store/routine-store';
import { useWorkoutStore } from '@/store/workout-store';

const ADVANCE_DELAY_MS = 900;

export default function WorkoutSessionScreen() {
  const theme = useTheme();
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

  const [weightInput, setWeightInput] = useState<number | null>(null);
  const [repsInput, setRepsInput] = useState<number | null>(null);
  const [rpeInput, setRpeInput] = useState<number | null>(null);
  const [restingUntil, setRestingUntil] = useState<number | null>(null);
  const [justSwapped, setJustSwapped] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const startedAt = useRef(Date.now());

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
    setWeightInput(workoutExercise?.suggested_weight_kg ?? null);
    setRpeInput(null);
    setJustSwapped(false);
    setRestingUntil(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workoutExercise?.id]);

  useEffect(() => {
    setRepsInput(suggestedRepsForNextSet);
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
    if (!weightInput || !repsInput) return;

    await logSet(weightInput, repsInput, rpeInput ?? undefined);
    // repsInput se re-precarga solo con la sugerencia de la próxima serie
    // (ver el useEffect de nextSetIndex más arriba) — no hace falta limpiarlo acá.
    setRpeInput(null);
    setRestingUntil(Date.now() + (workoutExercise?.rest_seconds ?? 90) * 1000);
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
            <ThemedText type="small" themeColor="textSecondary" style={styles.eyebrow}>
              Entrenamiento
            </ThemedText>
            <PrimaryButton label="Salir" variant="ghost" onPress={() => setShowExitConfirm(true)} />
          </ThemedView>

          <ThemedView style={styles.progressBar}>
            {session.exercises.map((exercise, i) => (
              <ThemedView
                key={exercise.id}
                style={[
                  styles.progressSegment,
                  {
                    backgroundColor: exercise.all_sets_completed
                      ? theme.accent
                      : i === currentIndex
                        ? theme.accentSecondary
                        : theme.backgroundSelected,
                  },
                ]}
              />
            ))}
          </ThemedView>

          <ThemedView
            style={[styles.heroCard, { backgroundColor: `${theme.accentSecondary}0F`, borderColor: `${theme.accentSecondary}30` }]}>
            <ThemedText type="small" style={[styles.eyebrow, { color: theme.accentSecondary }]}>
              EJERCICIO {currentIndex + 1} DE {session.exercises.length}
            </ThemedText>
            <ThemedText type="title" style={styles.exerciseName}>
              {workoutExercise.exercise.name}
            </ThemedText>
            {workoutExercise.exercise.primary_muscle && (
              <ThemedView style={styles.muscleRow}>
                <Icon icon={Dumbbell} size={14} color={theme.textSecondary} />
                <ThemedText type="small" themeColor="textSecondary">
                  {workoutExercise.exercise.primary_muscle}
                </ThemedText>
              </ThemedView>
            )}
            <ThemedText type="smallBold" style={[styles.serieLabel, { color: theme.accent }]}>
              SERIE {workoutExercise.sets.length + 1} DE {workoutExercise.target_sets}
            </ThemedText>
            {targetSetsLabel && (
              <ThemedText type="small" themeColor="textSecondary">
                {targetSetsLabel}
              </ThemedText>
            )}
          </ThemedView>

          {(workoutExercise.suggested_weight_kg !== null || suggestedRepsForNextSet !== null) && (
            <ThemedView style={styles.heroRow}>
              {workoutExercise.suggested_weight_kg !== null && (
                <ThemedView type="backgroundElement" style={styles.heroTile}>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.eyebrow}>
                    ▲ PESO RECOMENDADO
                  </ThemedText>
                  <ThemedText type="stat" style={[styles.heroValue, { color: theme.accent }]}>
                    {workoutExercise.suggested_weight_kg} kg
                  </ThemedText>
                </ThemedView>
              )}
              {suggestedRepsForNextSet !== null && (
                <ThemedView type="backgroundElement" style={styles.heroTile}>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.eyebrow}>
                    ▲ REPS RECOMENDADAS
                  </ThemedText>
                  <ThemedText type="stat" style={[styles.heroValue, { color: theme.accent }]}>
                    {suggestedRepsForNextSet}
                  </ThemedText>
                </ThemedView>
              )}
            </ThemedView>
          )}

          <ExerciseVideoPlayer videoUrl={workoutExercise.exercise.video_url} exerciseName={workoutExercise.exercise.name} />

          {workoutExercise.alternative && (
            <ThemedView style={styles.swapBlock}>
              <PrimaryButton
                label={justSwapped ? 'Volver al anterior' : 'Cambiar ejercicio'}
                icon={RefreshCw}
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

          {workoutExercise.sets.length > 0 && (
            <SetTrackerTable
              sets={workoutExercise.sets}
              targetSets={workoutExercise.target_sets}
              suggestedWeightKg={null}
              suggestedRepsForNextSet={null}
            />
          )}

          <CelebrationOverlay show={lastSetWasPersonalRecord}>
            <ThemedView
              style={[
                styles.prBanner,
                { backgroundColor: `${theme.accent}24`, borderColor: `${theme.accent}59` },
              ]}>
              <Icon icon={Trophy} size={16} color={theme.accent} />
              <ThemedText type="smallBold" style={[styles.eyebrow, { color: theme.accent }]}>
                RÉCORD PERSONAL
              </ThemedText>
            </ThemedView>
          </CelebrationOverlay>

          {exerciseJustCompleted ? (
            <CelebrationOverlay show>
              <ThemedView
                style={[
                  styles.doneBanner,
                  { backgroundColor: `${theme.accentSecondary}24`, borderColor: `${theme.accentSecondary}59` },
                ]}>
                <Icon icon={CheckCircle2} size={16} color={theme.accentSecondary} />
                <ThemedText type="smallBold" style={[styles.doneText, { color: theme.accentSecondary }]}>
                  Ejercicio completado — {isLastExercise ? 'cerrando entrenamiento…' : 'pasando al siguiente…'}
                </ThemedText>
              </ThemedView>
            </CelebrationOverlay>
          ) : (
            <>
              <ThemedView style={styles.inputsRow}>
                <ThemedView style={styles.inputHalf}>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.stepperLabel}>
                    Peso (kg)
                  </ThemedText>
                  <Stepper value={weightInput} onChange={setWeightInput} step={2.5} unit="kg" />
                </ThemedView>
                <ThemedView style={styles.inputHalf}>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.stepperLabel}>
                    Reps
                  </ThemedText>
                  <Stepper value={repsInput} onChange={setRepsInput} step={1} unit="reps" />
                </ThemedView>
              </ThemedView>
              <ThemedView>
                <ThemedText type="small" themeColor="textSecondary" style={styles.stepperLabel}>
                  RPE (opcional)
                </ThemedText>
                <Stepper value={rpeInput} onChange={setRpeInput} step={0.5} max={10} unit="RPE" />
              </ThemedView>

              {error && (
                <ThemedText type="small" style={styles.error}>
                  {error}
                </ThemedText>
              )}
            </>
          )}

          <RestTimerRing
            restingUntil={restingUntil}
            totalSeconds={workoutExercise?.rest_seconds ?? 90}
            onSkip={() => setRestingUntil(null)}
          />
        </ScrollView>

        {/* Fijo abajo (no scrollea con el resto) -- durante el entreno el
            usuario tiene que poder tocar "Registrar serie" sin buscarlo,
            sea cual sea la altura del contenido de arriba (video, banners). */}
        {!exerciseJustCompleted && (
          <ThemedView style={[styles.stickyFooter, { borderTopColor: theme.border, backgroundColor: theme.background }]}>
            <PrimaryButton
              label={`Registrar serie ${workoutExercise.sets.length + 1} de ${workoutExercise.target_sets}`}
              loading={isSubmitting}
              disabled={!weightInput || !repsInput}
              onPress={handleLogSet}
            />
          </ThemedView>
        )}
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
  eyebrow: { textTransform: 'uppercase', letterSpacing: 0.5 },
  progressBar: { flexDirection: 'row', gap: 6, backgroundColor: 'transparent' },
  progressSegment: { flex: 1, height: 6, borderRadius: 3 },
  heroCard: { borderRadius: Spacing.four, borderWidth: 1, padding: Spacing.four, gap: Spacing.half },
  muscleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, backgroundColor: 'transparent' },
  exerciseName: { fontSize: 28, lineHeight: 34 },
  serieLabel: { marginTop: Spacing.one, textTransform: 'uppercase', letterSpacing: 0.5 },
  heroRow: { flexDirection: 'row', gap: Spacing.two, backgroundColor: 'transparent' },
  heroTile: { flex: 1, borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.half },
  heroValue: { fontSize: 32, lineHeight: 36 },
  stickyFooter: { borderTopWidth: 1, padding: Spacing.four, paddingTop: Spacing.three },
  swapBlock: { gap: Spacing.one },
  prBanner: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.one,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.two,
    alignItems: 'center',
    borderWidth: 1,
  },
  doneBanner: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.one,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    borderWidth: 1,
  },
  doneText: { textAlign: 'center' },
  inputsRow: { flexDirection: 'row', gap: Spacing.three },
  inputHalf: { flex: 1 },
  stepperLabel: { marginBottom: Spacing.one },
  error: { color: '#FF4D5E', textAlign: 'center' },
  feedbackRow: { flexDirection: 'row', gap: Spacing.three, alignSelf: 'stretch' },
  feedbackHalf: { flex: 1 },
});
