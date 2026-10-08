// Esta línea sirve para importar «useEffect, useMemo, useRef, useState» desde «react».
import { useEffect, useMemo, useRef, useState } from 'react';
// Esta línea sirve para importar «Redirect, router» desde «expo-router».
import { Redirect, router } from 'expo-router';
// Esta línea sirve para importar «ScrollView, StyleSheet» desde «react-native».
import { ScrollView, StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «CheckCircle2, Dumbbell, Info, RefreshCw, Trophy» desde «lucide-react-native».
import { CheckCircle2, Dumbbell, Info, RefreshCw, Trophy } from 'lucide-react-native';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «LevelUpCelebration» desde «@/components/gamification/level-up-celebration».
import { LevelUpCelebration } from '@/components/gamification/level-up-celebration';
// Esta línea sirve para importar «ExerciseVideoPlayer» desde «@/components/workout/exercise-video-player».
import { ExerciseVideoPlayer } from '@/components/workout/exercise-video-player';
// Esta línea sirve para importar «CelebrationOverlay» desde «@/components/ui/celebration-overlay».
import { CelebrationOverlay } from '@/components/ui/celebration-overlay';
// Esta línea sirve para importar «ConfirmDialog» desde «@/components/ui/confirm-dialog».
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
// Esta línea sirve para importar «Icon» desde «@/components/ui/icon».
import { Icon } from '@/components/ui/icon';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «RestTimerRing» desde «@/components/ui/rest-timer-ring».
import { RestTimerRing } from '@/components/ui/rest-timer-ring';
// Esta línea sirve para importar «SetTrackerTable» desde «@/components/ui/set-tracker-table».
import { SetTrackerTable } from '@/components/ui/set-tracker-table';
// Esta línea sirve para importar «RulerSlider» desde «@/components/ui/ruler-slider».
import { RulerSlider } from '@/components/ui/ruler-slider';
// Esta línea sirve para importar «Stepper» desde «@/components/ui/stepper».
import { Stepper } from '@/components/ui/stepper';
// Esta línea sirve para importar «MaxContentWidth, Spacing» desde «@/constants/theme».
import { MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useDashboardStore» desde «@/store/dashboard-store».
import { useDashboardStore } from '@/store/dashboard-store';
// Esta línea sirve para importar «useGamificationStore» desde «@/store/gamification-store».
import { useGamificationStore } from '@/store/gamification-store';
// Esta línea sirve para importar «useRetosStore» desde «@/store/retos-store».
import { useRetosStore } from '@/store/retos-store';
// Esta línea sirve para importar «useRoutineStore» desde «@/store/routine-store».
import { useRoutineStore } from '@/store/routine-store';
// Esta línea sirve para importar «useToastStore» desde «@/store/toast-store».
import { useToastStore } from '@/store/toast-store';
// Esta línea sirve para importar «useWorkoutHistoryStore» desde «@/store/workout-history-store».
import { useWorkoutHistoryStore } from '@/store/workout-history-store';
// Esta línea sirve para importar «useWorkoutStore» desde «@/store/workout-store».
import { useWorkoutStore } from '@/store/workout-store';

// Esta línea sirve para declarar «ADVANCE_DELAY_MS» con el valor «900».
const ADVANCE_DELAY_MS = 900;

// Esta línea sirve para declarar la función «WorkoutSessionScreen».
export default function WorkoutSessionScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para abrir la desestructuración de varios valores.
  const {
    // Esta línea sirve para incluir el valor «session» en la lista.
    session,
    // Esta línea sirve para incluir el valor «currentIndex» en la lista.
    currentIndex,
    // Esta línea sirve para incluir el valor «isSubmitting» en la lista.
    isSubmitting,
    // Esta línea sirve para incluir el valor «error» en la lista.
    error,
    // Esta línea sirve para incluir el valor «lastSetWasPersonalRecord» en la lista.
    lastSetWasPersonalRecord,
    // Esta línea sirve para incluir el valor «gamificationResult» en la lista.
    gamificationResult,
    // Esta línea sirve para incluir el valor «logSet» en la lista.
    logSet,
    // Esta línea sirve para incluir el valor «swapCurrentExercise» en la lista.
    swapCurrentExercise,
    // Esta línea sirve para incluir el valor «complete» en la lista.
    complete,
    // Esta línea sirve para incluir el valor «cancel» en la lista.
    cancel,
    // Esta línea sirve para incluir el valor «submitFeedback» en la lista.
    submitFeedback,
    // Esta línea sirve para incluir el valor «clearGamificationResult» en la lista.
    clearGamificationResult,
    // Esta línea sirve para incluir el valor «reset» en la lista.
    reset,
  // Esta línea sirve para cerrar la desestructuración con «useWorkoutStore()».
  } = useWorkoutStore();
  // Esta línea sirve para obtener «refreshRoutine» con el hook «useRoutineStore».
  const refreshRoutine = useRoutineStore((s) => s.load);
  // Esta línea sirve para obtener «refreshStats» con el hook «useDashboardStore».
  const refreshStats = useDashboardStore((s) => s.loadStats);
  // Esta línea sirve para obtener «refreshGamification» con el hook «useGamificationStore».
  const refreshGamification = useGamificationStore((s) => s.loadSummary);
  // Esta línea sirve para obtener «refreshChallenges» con el hook «useRetosStore».
  const refreshChallenges = useRetosStore((s) => s.load);
  // Esta línea sirve para obtener «refreshHistory» con el hook «useWorkoutHistoryStore».
  const refreshHistory = useWorkoutHistoryStore((s) => s.load);

  // Esta línea sirve para crear el estado «weightInput» y su función «setWeightInput».
  const [weightInput, setWeightInput] = useState<number | null>(null);
  // Esta línea sirve para crear el estado «repsInput» y su función «setRepsInput».
  const [repsInput, setRepsInput] = useState<number | null>(null);
  // Esta línea sirve para crear el estado «rpeInput» y su función «setRpeInput».
  const [rpeInput, setRpeInput] = useState<number | null>(null);
  // Esta línea sirve para crear el estado «restingUntil» y su función «setRestingUntil».
  const [restingUntil, setRestingUntil] = useState<number | null>(null);
  // Esta línea sirve para crear el estado «justSwapped» y su función «setJustSwapped».
  const [justSwapped, setJustSwapped] = useState(false);
  // Esta línea sirve para crear el estado «showExitConfirm» y su función «setShowExitConfirm».
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  // Date.now() no puede llamarse durante el render (impuro) -- se captura
  // en un efecto que corre una sola vez al montar la pantalla, no al
  // definir el ref.
  // Esta línea sirve para crear la referencia «startedAt».
  const startedAt = useRef<number | null>(null);
  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para asignar «Date.now()» a «startedAt.current».
    startedAt.current = Date.now();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «».
  }, []);

  // Esta línea sirve para extraer «orkoutExercis» de «session?.exercises[currentIndex]».
  const workoutExercise = session?.exercises[currentIndex];
  // Esta línea sirve para extraer «sLastExercis» de «session ? currentIndex === session.exerc».
  const isLastExercise = session ? currentIndex === session.exercises.length - 1 : false;
  // Esta línea sirve para extraer «llExercisesComplete» de «session ? session.exercises.every((e) =>».
  const allExercisesCompleted = session ? session.exercises.every((e) => e.all_sets_completed) : false
  // Esta línea sirve para extraer «xerciseJustComplete» de «workoutExercise ? workoutExercise.sets.l».
  const exerciseJustCompleted = workoutExercise ? workoutExercise.sets.length >= workoutExercise.target_sets : false

  // Esta línea sirve para obtener «targetSetsLabel» con el hook «useMemo».
  const targetSetsLabel = useMemo(() => {
    // Esta línea sirve para devolver null si «!workoutExercise».
    if (!workoutExercise) return null;
    // Esta línea sirve para extraer «i» de «workoutExercise.target_rpe !== null ? (1».
    const rir = workoutExercise.target_rpe !== null ? (10 - workoutExercise.target_rpe).toFixed(1) : null;
    // Esta línea sirve para devolver el texto de series, repeticiones y RIR del ejercicio.
    return `${workoutExercise.target_sets}×${workoutExercise.target_reps ?? '—'}${rir ? ` · RIR ${rir}` : ''}${workoutExercise.rest_seconds ? ` · ${workoutExercise.rest_seconds}s` : ''}`;
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «workoutExercise».
  }, [workoutExercise]);

  // Reps recomendadas para la PRÓXIMA serie de este ejercicio (índice =
  // cuántas ya se registraron) — cada serie puede tener un objetivo
  // distinto (ver ProgressiveOverloadCalculator, rampa por serie).
  // Esta línea sirve para extraer «extSetInde» de «workoutExercise?.sets.length ?? 0».
  const nextSetIndex = workoutExercise?.sets.length ?? 0;
  // Esta línea sirve para extraer «uggestedRepsForNextSe» de «workoutExercise?.suggested_reps_per_set?».
  const suggestedRepsForNextSet = workoutExercise?.suggested_reps_per_set?.[nextSetIndex] ?? null;

  // Reinicia los inputs cuando cambia el ejercicio actual -- ajuste de
  // estado durante el render en vez de un efecto (mismo patrón que
  // "Adjusting state when a prop changes" en la doc de React): compara
  // contra el id del ejercicio anterior y, si cambió, aplica el reset ya
  // en esta misma pasada de render, sin el frame de más donde se verían
  // los inputs del ejercicio anterior.
  // Esta línea sirve para crear el estado «prevExerciseId» y su función «setPrevExerciseId».
  const [prevExerciseId, setPrevExerciseId] = useState(workoutExercise?.id);
  // Esta línea sirve para revisar si «workoutExercise?.id !== prevExerciseId».
  if (workoutExercise?.id !== prevExerciseId) {
    // Esta línea sirve para guardar en el estado con «setPrevExerciseId» el valor «workoutExercise?.id)…».
    setPrevExerciseId(workoutExercise?.id);
    // Esta línea sirve para guardar en el estado con «setWeightInput» el valor «workoutExercise?.suggested_weight_kg ?? null)…».
    setWeightInput(workoutExercise?.suggested_weight_kg ?? null);
    // Esta línea sirve para guardar en el estado con «setRpeInput» el valor «null)…».
    setRpeInput(null);
    // Esta línea sirve para guardar en el estado con «setJustSwapped» el valor «false)…».
    setJustSwapped(false);
    // Esta línea sirve para guardar en el estado con «setRestingUntil» el valor «null)…».
    setRestingUntil(null);
  }

  // Mismo patrón para las reps sugeridas de la PRÓXIMA serie -- cambia con
  // el ejercicio actual o al avanzar de serie dentro del mismo ejercicio.
  // Esta línea sirve para extraer «epsKe» de «`${workoutExercise?.id}:${nextSetIndex}`».
  const repsKey = `${workoutExercise?.id}:${nextSetIndex}`;
  // Esta línea sirve para crear el estado «prevRepsKey» y su función «setPrevRepsKey».
  const [prevRepsKey, setPrevRepsKey] = useState(repsKey);
  // Esta línea sirve para revisar si «repsKey !== prevRepsKey».
  if (repsKey !== prevRepsKey) {
    // Esta línea sirve para guardar en el estado con «setPrevRepsKey» el valor «repsKey)…».
    setPrevRepsKey(repsKey);
    // Esta línea sirve para guardar en el estado con «setRepsInput» el valor «suggestedRepsForNextSet)…».
    setRepsInput(suggestedRepsForNextSet);
  }

  // Esta línea sirve para extraer «andleSwa» de «async () => {».
  const handleSwap = async () => {
    // Esta línea sirve para esperar el resultado de «swapCurrentExercise».
    await swapCurrentExercise();
    // Esta línea sirve para guardar en el estado con «setJustSwapped» el valor «(prev) => !prev)…».
    setJustSwapped((prev) => !prev);
  };

  // Esta línea sirve para extraer «andleExi» de «async () => {».
  const handleExit = async () => {
    // Esta línea sirve para guardar en el estado con «setShowExitConfirm» el valor «false)…».
    setShowExitConfirm(false);
    // Esta línea sirve para esperar el resultado de «cancel».
    await cancel();
    // Esta línea sirve para llamar a «router.replace» con «'/'».
    router.replace('/');
  };

  // Avance automático de sesión completa (sección 3 del pedido): cuando el
  // último ejercicio llega a sus 3 series, cierra la sesión solo — sin
  // esperar un "Finalizar entrenamiento" manual.
  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para salir si no se puede cerrar todavía el entrenamiento.
    if (!session || session.completed || !allExercisesCompleted || isSubmitting) return;
    // Esta línea sirve para extraer «imeou» de «setTimeout(async () => {».
    const timeout = setTimeout(async () => {
      // Esta línea sirve para extraer «urationMinute» de «Math.max(1, Math.round((Date.now() - (st».
      const durationMinutes = Math.max(1, Math.round((Date.now() - (startedAt.current ?? Date.now())) / 60000));
      // OJO: no refrescar routine-store acá — el peso sugerido de la
      // próxima sesión recién se calcula al responder el feedback (ver
      // SubmitSessionFeedbackAction), no al completar. Refrescar antes de
      // tiempo deja el store con el peso viejo (ver handleFeedback).
      // Esta línea sirve para esperar el resultado de «complete».
      await complete(durationMinutes);
    // Esta línea sirve para volver a ejecutar el efecto cuando cambian «DVANCE_DELAY_M».
    }, ADVANCE_DELAY_MS);
    // Esta línea sirve para devolver «() => clearTimeout(timeout)».
    return () => clearTimeout(timeout);
    // Esta línea sirve para volver a ejecutar el efecto cuando cambian «allExercisesCompleted, session?.completed».
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allExercisesCompleted, session?.completed]);

  // Esta línea sirve para revisar si «!session || !workoutExercise».
  if (!session || !workoutExercise) {
    // Esta línea sirve para devolver «<Redirect href="/" />».
    return <Redirect href="/" />;
  }

  // Esta línea sirve para extraer «andleLogSe» de «async () => {».
  const handleLogSet = async () => {
    // Esta línea sirve para salir de la función si «!weightInput || !repsInput».
    if (!weightInput || !repsInput) return;

    // Esta línea sirve para esperar el resultado de «logSet».
    await logSet(weightInput, repsInput, rpeInput ?? undefined);
    // repsInput se re-precarga solo con la sugerencia de la próxima serie
    // (ver el useEffect de nextSetIndex más arriba) — no hace falta limpiarlo acá.
    // Esta línea sirve para guardar en el estado con «setRpeInput» el valor «null)…».
    setRpeInput(null);
    // Esta línea sirve para guardar en el estado con «setRestingUntil» el valor «Date.now() + (workoutExercise?.rest_seconds ?…».
    setRestingUntil(Date.now() + (workoutExercise?.rest_seconds ?? 90) * 1000);
    // Esta línea sirve para llamar a «useToastStore.getState» con «).show('✓ Serie registrada', 'success'».
    useToastStore.getState().show('✓ Serie registrada', 'success');
  };

  // Esta línea sirve para extraer «andleRestFinishe» de «() => {».
  const handleRestFinished = () => {
    // Esta línea sirve para guardar en el estado con «setRestingUntil» el valor «null)…».
    setRestingUntil(null);
    // Esta línea sirve para mostrar el aviso de descanso terminado.
    useToastStore.getState().show('🔔 ¡Descanso terminado! Prepárate para la siguiente serie.');
  };

  // Esta línea sirve para extraer «andleFeedbac» de «async (completedAsPlanned: boolean) => {».
  const handleFeedback = async (completedAsPlanned: boolean) => {
    // Esta línea sirve para esperar el resultado de «submitFeedback».
    await submitFeedback(completedAsPlanned);
    // Recién acá el peso sugerido de la próxima sesión ya está calculado.
    // Esta línea sirve para llamar a «refreshRoutine».
    refreshRoutine();
    // La Home no se vuelve a montar al volver con router.replace('/') (el
    // grupo (app) ya estaba en memoria) — sin este refresh explícito se
    // vería la racha/XP/retos desactualizados hasta el próximo cold start.
    // Es exactamente lo que ya hace el backend con AggregateDailyStatsAction
    // y RecalculateChallengeProgressAction al completar la sesión: acá solo
    // le pedimos al cliente que relea ese estado ya recalculado.
    // Esta línea sirve para extraer «treakBefor» de «useDashboardStore.getState().stats?.curr».
    const streakBefore = useDashboardStore.getState().stats?.current_streak_days ?? 0;
    // Esta línea sirve para esperar el resultado de «refreshStats».
    await refreshStats();
    // Esta línea sirve para extraer «treakAfte» de «useDashboardStore.getState().stats?.curr».
    const streakAfter = useDashboardStore.getState().stats?.current_streak_days ?? 0;
    // >= 2 a propósito: el día 1 todavía no es "una racha" para el usuario,
    // solo "entrenaste hoy" (que ya festeja esta misma pantalla) — avisar
    // desde el día 2 evita un toast redundante en cada primer entrenamiento.
    // Esta línea sirve para revisar si «streakAfter > streakBefore && streakAfter >= 2».
    if (streakAfter > streakBefore && streakAfter >= 2) {
      // Esta línea sirve para mostrar el aviso de nueva racha.
      useToastStore.getState().show(`🔥 ¡Nueva racha de ${streakAfter} días!`, 'success');
    }

    // Esta línea sirve para llamar a «refreshGamification».
    refreshGamification();
    // Esta línea sirve para llamar a «refreshChallenges».
    refreshChallenges();
    // Esta línea sirve para llamar a «refreshHistory».
    refreshHistory();
  };

  // Esta línea sirve para revisar si «session.completed».
  if (session.completed) {
    // Esta línea sirve para revisar si «session.completed_as_planned === null».
    if (session.completed_as_planned === null) {
      // Esta línea sirve para devolver la interfaz del componente.
      return (
        // Esta línea sirve para abrir el componente «ThemedView».
        <ThemedView style={styles.flex}>
          {/* Esta línea sirve para abrir el componente «LevelUpCelebration». */}
          <LevelUpCelebration result={gamificationResult} onDismiss={clearGamificationResult} />
          {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
          <SafeAreaView style={[styles.flex, styles.centered]}>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="title" style={styles.title}>
              {/* Esta línea sirve para mostrar el texto «¡Entrenamiento completado!». */}
              ¡Entrenamiento completado!
            </ThemedText>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
              {/* Esta línea sirve para mostrar el texto «¿Pudiste completar el entrenamiento tal como estaba planeado?». */}
              ¿Pudiste completar el entrenamiento tal como estaba planeado?
            </ThemedText>
            {/* Esta línea sirve para mostrar el bloque solo si «error». */}
            {error && (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="small" style={styles.error}>
                {/* Esta línea sirve para mostrar el valor «error». */}
                {error}
              </ThemedText>
            )}
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.feedbackRow}>
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView style={styles.feedbackHalf}>
                {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
                <PrimaryButton label="Sí" loading={isSubmitting} onPress={() => handleFeedback(true)} />
              </ThemedView>
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView style={styles.feedbackHalf}>
                {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
                <PrimaryButton label="No" variant="ghost" loading={isSubmitting} onPress={() => handleFeedback(false)} />
              </ThemedView>
            </ThemedView>
          </SafeAreaView>
        </ThemedView>
      );
    }

    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el componente «ThemedView».
      <ThemedView style={styles.flex}>
        {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
        <SafeAreaView style={[styles.flex, styles.centered]}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="title" style={styles.title}>
            {/* Esta línea sirve para mostrar el texto «Buen trabajo». */}
            Buen trabajo
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
            {/* Esta línea sirve para mostrar el contenido dinámico «{session.completed_as_planned». */}
            {session.completed_as_planned
              // Esta línea sirve para avisar que se ajustará el peso la próxima vez.
              ? 'Tu progreso quedó guardado. La próxima vez que hagas este entrenamiento, la app ajustará el peso automáticamente.'
              // Esta línea sirve para avisar que se mantendrá el peso la próxima vez.
              : 'Tu progreso quedó guardado. Mantendremos el peso la próxima vez para que puedas completarlo.'}
          </ThemedText>
          {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
          <PrimaryButton
            // Esta línea sirve para definir el atributo «label» con el valor «Volver a inicio».
            label="Volver a inicio"
            // Esta línea sirve para asignar el manejador del evento «onPress».
            onPress={() => {
              // Esta línea sirve para llamar a «reset».
              reset();
              // Esta línea sirve para llamar a «router.replace» con «'/'».
              router.replace('/');
            }}
          />
        </SafeAreaView>
      </ThemedView>
    );
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.flex}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.flex}>
        {/* Esta línea sirve para abrir el componente «ScrollView». */}
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={styles.header}>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary" style={styles.eyebrow}>
              {/* Esta línea sirve para mostrar el texto «Entrenamiento». */}
              Entrenamiento
            </ThemedText>
            {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
            <PrimaryButton label="Salir" variant="ghost" onPress={() => setShowExitConfirm(true)} />
          </ThemedView>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={styles.progressBar}>
            {/* Esta línea sirve para recorrer «session.exercises» y mostrar un bloque por elemento. */}
            {session.exercises.map((exercise, i) => (
              // Esta línea sirve para abrir el elemento «ThemedView» con sus atributos en varias líneas.
              <ThemedView
                // Esta línea sirve para identificar el elemento de la lista con «exercise.id}».
                key={exercise.id}
                // Esta línea sirve para pasar la propiedad «style» con el valor «[».
                style={[
                  // Esta línea sirve para agregar el estilo «styles.progressSegment».
                  styles.progressSegment,
                  {
                    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «exercise.all_sets_completed».
                    backgroundColor: exercise.all_sets_completed
                      // Esta línea sirve para usar el color de acento en los ejercicios completados.
                      ? theme.accent
                      // Esta línea sirve para revisar si es el ejercicio actual.
                      : i === currentIndex
                        // Esta línea sirve para usar el color secundario en el ejercicio actual.
                        ? theme.accentSecondary
                        // Esta línea sirve para usar el color de selección en los pendientes.
                        : theme.backgroundSelected,
                  },
                ]}
              />
            ))}
          </ThemedView>

          {/* Esta línea sirve para mostrar el contenido dinámico «{session.readiness_adjusted && session.readiness_note && (». */}
          {session.readiness_adjusted && session.readiness_note && (
            // Esta línea sirve para abrir el elemento «ThemedView» con sus atributos en varias líneas.
            <ThemedView
              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.readinessBanner, { backgroundColor: `».
              style={[styles.readinessBanner, { backgroundColor: `${theme.warning}14`, borderColor: `${theme.warning}40` }]}>
              {/* Esta línea sirve para abrir el componente «Icon». */}
              <Icon icon={Info} size={16} color={theme.warning} />
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" style={styles.readinessText}>
                {/* Esta línea sirve para mostrar el valor «session.readiness_note». */}
                {session.readiness_note}
              </ThemedText>
            </ThemedView>
          )}

          {/* Esta línea sirve para abrir el elemento «ThemedView» con sus atributos en varias líneas. */}
          <ThemedView
            // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.heroCard, { backgroundColor: `${theme».
            style={[styles.heroCard, { backgroundColor: `${theme.accentSecondary}0F`, borderColor: `${theme.accentSecondary}30` }]}>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" style={[styles.eyebrow, { color: theme.accentSecondary }]}>
              {/* Esta línea sirve para mostrar el contenido dinámico «EJERCICIO {currentIndex + 1} DE {session.exercises.length}». */}
              EJERCICIO {currentIndex + 1} DE {session.exercises.length}
            </ThemedText>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="title" style={styles.exerciseName}>
              {/* Esta línea sirve para mostrar el valor «workoutExercise.exercise.name». */}
              {workoutExercise.exercise.name}
            </ThemedText>
            {/* Esta línea sirve para mostrar el bloque solo si «workoutExercise.exercise.primary_muscle». */}
            {workoutExercise.exercise.primary_muscle && (
              // Esta línea sirve para abrir el componente «ThemedView».
              <ThemedView style={styles.muscleRow}>
                {/* Esta línea sirve para abrir el componente «Icon». */}
                <Icon icon={Dumbbell} size={14} color={theme.textSecondary} />
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar el valor «workoutExercise.exercise.primary_muscle». */}
                  {workoutExercise.exercise.primary_muscle}
                </ThemedText>
              </ThemedView>
            )}
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="smallBold" style={[styles.serieLabel, { color: theme.accent }]}>
              {/* Esta línea sirve para mostrar el número de serie actual y el total objetivo. */}
              SERIE {workoutExercise.sets.length + 1} DE {workoutExercise.target_sets}
            </ThemedText>
            {/* Esta línea sirve para mostrar el bloque solo si «targetSetsLabel». */}
            {targetSetsLabel && (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el valor «targetSetsLabel». */}
                {targetSetsLabel}
              </ThemedText>
            )}
          </ThemedView>

          {/* Esta línea sirve para mostrar las sugerencias solo si hay peso o repeticiones sugeridas. */}
          {(workoutExercise.suggested_weight_kg !== null || suggestedRepsForNextSet !== null) && (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView style={styles.heroRow}>
              {/* Esta línea sirve para mostrar el bloque solo si «workoutExercise.suggested_weight_kg !== null». */}
              {workoutExercise.suggested_weight_kg !== null && (
                // Esta línea sirve para abrir el componente «ThemedView».
                <ThemedView type="backgroundElement" style={styles.heroTile}>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor="textSecondary" style={styles.eyebrow}>
                    {/* Esta línea sirve para mostrar el contenido dinámico «▲ PESO RECOMENDADO». */}
                    ▲ PESO RECOMENDADO
                  </ThemedText>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="stat" style={[styles.heroValue, { color: theme.accent }]}>
                    {/* Esta línea sirve para mostrar el contenido dinámico «{workoutExercise.suggested_weight_kg} kg». */}
                    {workoutExercise.suggested_weight_kg} kg
                  </ThemedText>
                </ThemedView>
              )}
              {/* Esta línea sirve para mostrar el bloque solo si «suggestedRepsForNextSet !== null». */}
              {suggestedRepsForNextSet !== null && (
                // Esta línea sirve para abrir el componente «ThemedView».
                <ThemedView type="backgroundElement" style={styles.heroTile}>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor="textSecondary" style={styles.eyebrow}>
                    {/* Esta línea sirve para mostrar el contenido dinámico «▲ REPS RECOMENDADAS». */}
                    ▲ REPS RECOMENDADAS
                  </ThemedText>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="stat" style={[styles.heroValue, { color: theme.accent }]}>
                    {/* Esta línea sirve para mostrar el valor «suggestedRepsForNextSet». */}
                    {suggestedRepsForNextSet}
                  </ThemedText>
                </ThemedView>
              )}
            </ThemedView>
          )}

          {/* Esta línea sirve para abrir el elemento «ExerciseVideoPlayer» con sus atributos en varias líneas. */}
          <ExerciseVideoPlayer
            // Esta línea sirve para pasar la propiedad «videoUrl» con el valor «workoutExercise.exercise.video_url}».
            videoUrl={workoutExercise.exercise.video_url}
            // Esta línea sirve para pasar la propiedad «exerciseName» con el valor «workoutExercise.exercise.name}».
            exerciseName={workoutExercise.exercise.name}
            // Esta línea sirve para activar la opción «autoPlay».
            autoPlay
          />

          {/* Esta línea sirve para mostrar el bloque solo si «workoutExercise.alternative». */}
          {workoutExercise.alternative && (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView style={styles.swapBlock}>
              {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
              <PrimaryButton
                // Esta línea sirve para pasar la propiedad «label» con el valor «justSwapped ? 'Volver al anterior' : 'Cambiar».
                label={justSwapped ? 'Volver al anterior' : 'Cambiar ejercicio'}
                // Esta línea sirve para pasar la propiedad «icon» con el valor «RefreshCw}».
                icon={RefreshCw}
                // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
                variant="ghost"
                // Esta línea sirve para pasar la propiedad «loading» con el valor «isSubmitting}».
                loading={isSubmitting}
                // Esta línea sirve para pasar la propiedad «disabled» con el valor «workoutExercise.sets.length > 0}».
                disabled={workoutExercise.sets.length > 0}
                // Esta línea sirve para asignar el manejador del evento «onPress».
                onPress={handleSwap}
              />
              {/* Esta línea sirve para mostrar el bloque solo si «workoutExercise.sets.length > 0». */}
              {workoutExercise.sets.length > 0 && (
                // Esta línea sirve para abrir el componente «ThemedText».
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para avisar que no se puede cambiar de ejercicio con series registradas. */}
                  Ya registraste series — no se puede cambiar el ejercicio en esta sesión.
                </ThemedText>
              )}
            </ThemedView>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «workoutExercise.sets.length > 0». */}
          {workoutExercise.sets.length > 0 && (
            // Esta línea sirve para abrir el elemento «SetTrackerTable» con sus atributos en varias líneas.
            <SetTrackerTable
              // Esta línea sirve para pasar la propiedad «sets» con el valor «workoutExercise.sets}».
              sets={workoutExercise.sets}
              // Esta línea sirve para pasar la propiedad «targetSets» con el valor «workoutExercise.target_sets}».
              targetSets={workoutExercise.target_sets}
              // Esta línea sirve para pasar la propiedad «suggestedWeightKg» con el valor «null}».
              suggestedWeightKg={null}
              // Esta línea sirve para pasar la propiedad «suggestedRepsForNextSet» con el valor «null}».
              suggestedRepsForNextSet={null}
            />
          )}

          {/* Esta línea sirve para abrir el componente «CelebrationOverlay». */}
          <CelebrationOverlay show={lastSetWasPersonalRecord}>
            {/* Esta línea sirve para abrir el elemento «ThemedView» con sus atributos en varias líneas. */}
            <ThemedView
              // Esta línea sirve para pasar la propiedad «style» con el valor «[».
              style={[
                // Esta línea sirve para agregar el estilo «styles.prBanner».
                styles.prBanner,
                // Esta línea sirve para agregar un elemento cuyo «backgroundColor» es «`${theme.accent}24`, borderColor: `${the…».
                { backgroundColor: `${theme.accent}24`, borderColor: `${theme.accent}59` },
              ]}>
              {/* Esta línea sirve para abrir el componente «Icon». */}
              <Icon icon={Trophy} size={16} color={theme.accent} />
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="smallBold" style={[styles.eyebrow, { color: theme.accent }]}>
                {/* Esta línea sirve para mostrar el texto «RÉCORD PERSONAL». */}
                RÉCORD PERSONAL
              </ThemedText>
            </ThemedView>
          </CelebrationOverlay>

          {/* Esta línea sirve para elegir entre dos bloques según «exerciseJustCompleted». */}
          {exerciseJustCompleted ? (
            // Esta línea sirve para abrir el componente «CelebrationOverlay».
            <CelebrationOverlay show>
              {/* Esta línea sirve para abrir el elemento «ThemedView» con sus atributos en varias líneas. */}
              <ThemedView
                // Esta línea sirve para pasar la propiedad «style» con el valor «[».
                style={[
                  // Esta línea sirve para agregar el estilo «styles.doneBanner».
                  styles.doneBanner,
                  // Esta línea sirve para agregar un elemento cuyo «backgroundColor» es «`${theme.accentSecondary}24`, borderColo…».
                  { backgroundColor: `${theme.accentSecondary}24`, borderColor: `${theme.accentSecondary}59` },
                ]}>
                {/* Esta línea sirve para abrir el componente «Icon». */}
                <Icon icon={CheckCircle2} size={16} color={theme.accentSecondary} />
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="smallBold" style={[styles.doneText, { color: theme.accentSecondary }]}>
                  {/* Esta línea sirve para mostrar que el ejercicio terminó y qué sigue. */}
                  Ejercicio completado — {isLastExercise ? 'cerrando entrenamiento…' : 'pasando al siguiente…'}
                </ThemedText>
              </ThemedView>
            </CelebrationOverlay>
          // Esta línea sirve para mostrar el bloque alternativo.
          ) : (
            // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
            <>
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView style={styles.rpeBlock}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary" style={styles.stepperLabel}>
                  {/* Esta línea sirve para mostrar el texto «Peso (kg) — deslizá la regla». */}
                  Peso (kg) — deslizá la regla
                </ThemedText>
                {/* Esta línea sirve para abrir el componente «RulerSlider». */}
                <RulerSlider value={weightInput} onChange={setWeightInput} unit="kg" />
              </ThemedView>
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView style={styles.inputsRow}>
                {/* Esta línea sirve para abrir el componente «ThemedView». */}
                <ThemedView style={styles.inputHalf}>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor="textSecondary" style={styles.stepperLabel}>
                    {/* Esta línea sirve para mostrar el texto «Reps». */}
                    Reps
                  </ThemedText>
                  {/* Esta línea sirve para abrir el componente «Stepper». */}
                  <Stepper value={repsInput} onChange={setRepsInput} step={1} unit="reps" />
                </ThemedView>
                {/* Esta línea sirve para abrir el componente «ThemedView». */}
                <ThemedView style={styles.inputHalf}>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor="textSecondary" style={styles.stepperLabel}>
                    {/* Esta línea sirve para mostrar el texto «RPE (opcional)». */}
                    RPE (opcional)
                  </ThemedText>
                  {/* Esta línea sirve para abrir el componente «Stepper». */}
                  <Stepper value={rpeInput} onChange={setRpeInput} step={0.5} max={10} unit="RPE" />
                </ThemedView>
              </ThemedView>

              {/* Esta línea sirve para mostrar el bloque solo si «error». */}
              {error && (
                // Esta línea sirve para abrir el componente «ThemedText».
                <ThemedText type="small" style={styles.error}>
                  {/* Esta línea sirve para mostrar el valor «error». */}
                  {error}
                </ThemedText>
              )}
            </>
          )}

          {/* Esta línea sirve para abrir el elemento «RestTimerRing» con sus atributos en varias líneas. */}
          <RestTimerRing
            // Esta línea sirve para pasar la propiedad «restingUntil» con el valor «restingUntil}».
            restingUntil={restingUntil}
            // Esta línea sirve para pasar la propiedad «totalSeconds» con el valor «workoutExercise?.rest_seconds ?? 90}».
            totalSeconds={workoutExercise?.rest_seconds ?? 90}
            // Esta línea sirve para asignar el manejador del evento «onSkip».
            onSkip={() => setRestingUntil(null)}
            // Esta línea sirve para asignar el manejador del evento «onFinish».
            onFinish={handleRestFinished}
          />
        </ScrollView>

        {/* Esta línea sirve para abrir el comentario que explica por qué el botón queda fijo abajo. */}
        {/* Fijo abajo (no scrollea con el resto) -- durante el entreno el
            // Esta línea sirve para continuar el comentario sobre el botón de registrar serie.
            usuario tiene que poder tocar "Registrar serie" sin buscarlo,
            // Esta línea sirve para cerrar el comentario sobre la altura del contenido.
            sea cual sea la altura del contenido de arriba (video, banners). */}
        {/* Esta línea sirve para mostrar el bloque solo si «!exerciseJustCompleted». */}
        {!exerciseJustCompleted && (
          // Esta línea sirve para abrir el componente «ThemedView».
          <ThemedView style={[styles.stickyFooter, { borderTopColor: theme.border, backgroundColor: theme.background }]}>
            {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
            <PrimaryButton
              // Esta línea sirve para pasar la propiedad «label» con el valor «`Registrar serie ${workoutExercise.sets.lengt».
              label={`Registrar serie ${workoutExercise.sets.length + 1} de ${workoutExercise.target_sets}`}
              // Esta línea sirve para pasar la propiedad «loading» con el valor «isSubmitting}».
              loading={isSubmitting}
              // Esta línea sirve para pasar la propiedad «disabled» con el valor «!weightInput || !repsInput}».
              disabled={!weightInput || !repsInput}
              // Esta línea sirve para asignar el manejador del evento «onPress».
              onPress={handleLogSet}
            />
          </ThemedView>
        )}
      </SafeAreaView>

      {/* Esta línea sirve para abrir el elemento «ConfirmDialog» con sus atributos en varias líneas. */}
      <ConfirmDialog
        // Esta línea sirve para pasar la propiedad «visible» con el valor «showExitConfirm}».
        visible={showExitConfirm}
        // Esta línea sirve para definir el atributo «title» con el valor «¿Salir del entrenamiento?».
        title="¿Salir del entrenamiento?"
        // Esta línea sirve para definir el atributo «description».
        description="Las series que ya registraste se conservan, pero esta sesión no contará como completada."
        // Esta línea sirve para definir el atributo «confirmLabel» con el valor «Salir».
        confirmLabel="Salir"
        // Esta línea sirve para definir el atributo «cancelLabel» con el valor «Seguir entrenando».
        cancelLabel="Seguir entrenando"
        // Esta línea sirve para pasar la propiedad «isLoading» con el valor «isSubmitting}».
        isLoading={isSubmitting}
        // Esta línea sirve para asignar el manejador del evento «onConfirm».
        onConfirm={handleExit}
        // Esta línea sirve para asignar el manejador del evento «onCancel».
        onCancel={() => setShowExitConfirm(false)}
      />
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «{ flex: 1 }».
  flex: { flex: 1 },
  // Esta línea sirve para definir el estilo «centered» con «alignItems: 'center', justifyContent: 'center', pa…».
  centered: { alignItems: 'center', justifyContent: 'center', padding: Spacing.four, gap: Spacing.three },
  // Esta línea sirve para declarar la propiedad «scroll» con el valor o tipo «{».
  scroll: {
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.four».
    padding: Spacing.four,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «MaxContentWidth».
    maxWidth: MaxContentWidth,
    // Esta línea sirve para declarar la propiedad «alignSelf» con el valor o tipo «'center'».
    alignSelf: 'center',
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
  },
  // Esta línea sirve para definir el estilo «header» con «flexDirection: 'row', alignItems: 'center', justif…».
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «{ textAlign: 'center' }».
  title: { textAlign: 'center' },
  // Esta línea sirve para declarar la propiedad «subtitle» con el valor o tipo «{ textAlign: 'center' }».
  subtitle: { textAlign: 'center' },
  // Esta línea sirve para definir el estilo «eyebrow» con «textTransform: 'uppercase', letterSpacing: 0.5 },…».
  eyebrow: { textTransform: 'uppercase', letterSpacing: 0.5 },
  // Esta línea sirve para definir el estilo «progressBar» con «flexDirection: 'row', gap: 6, backgroundColor: 'tr…».
  progressBar: { flexDirection: 'row', gap: 6, backgroundColor: 'transparent' },
  // Esta línea sirve para declarar la propiedad «progressSegment» con el valor o tipo «{ flex: 1, height: 6, borderRadius: 3 }».
  progressSegment: { flex: 1, height: 6, borderRadius: 3 },
  // Esta línea sirve para declarar la propiedad «readinessBanner» con el valor o tipo «{».
  readinessBanner: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'flex-start'».
    alignItems: 'flex-start',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «readinessText» con el valor o tipo «{ flex: 1 }».
  readinessText: { flex: 1 },
  // Esta línea sirve para definir el estilo «heroCard» con «borderRadius: Spacing.four, borderWidth: 1, paddin…».
  heroCard: { borderRadius: Spacing.four, borderWidth: 1, padding: Spacing.three, gap: Spacing.half },
  // Esta línea sirve para definir el estilo «muscleRow» con «flexDirection: 'row', alignItems: 'center', gap: S…».
  muscleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, backgroundColor: 'transparent' },
  // Esta línea sirve para declarar la propiedad «exerciseName» con el valor o tipo «{ fontSize: 24, lineHeight: 30 }».
  exerciseName: { fontSize: 24, lineHeight: 30 },
  // Esta línea sirve para definir el estilo «serieLabel» con «marginTop: Spacing.one, textTransform: 'uppercase'…».
  serieLabel: { marginTop: Spacing.one, textTransform: 'uppercase', letterSpacing: 0.5 },
  // Esta línea sirve para definir el estilo «heroRow» con «flexDirection: 'row', gap: Spacing.two, background…».
  heroRow: { flexDirection: 'row', gap: Spacing.two, backgroundColor: 'transparent' },
  // Esta línea sirve para definir el estilo «heroTile» con «flex: 1, borderRadius: Spacing.three, padding: Spa…».
  heroTile: { flex: 1, borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.half },
  // Esta línea sirve para declarar la propiedad «heroValue» con el valor o tipo «{ fontSize: 32, lineHeight: 36 }».
  heroValue: { fontSize: 32, lineHeight: 36 },
  // Esta línea sirve para definir el estilo «stickyFooter» con «borderTopWidth: 1, padding: Spacing.four, paddingT…».
  stickyFooter: { borderTopWidth: 1, padding: Spacing.four, paddingTop: Spacing.three },
  // Estos, a diferencia de muscleRow/heroRow arriba, no tenían
  // `backgroundColor: 'transparent'` — como viven dentro de `heroCard`
  // (tinte de accentSecondary), sin el override quedaban con un
  // rectángulo del color de fondo general de la app encima del tinte.
  // Esta línea sirve para definir el estilo «swapBlock» con «gap: Spacing.one, backgroundColor: 'transparent' }…».
  swapBlock: { gap: Spacing.one, backgroundColor: 'transparent' },
  // Esta línea sirve para declarar la propiedad «prBanner» con el valor o tipo «{».
  prBanner: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.one».
    gap: Spacing.one,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two».
    paddingVertical: Spacing.two,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
  },
  // Esta línea sirve para declarar la propiedad «doneBanner» con el valor o tipo «{».
  doneBanner: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.one».
    gap: Spacing.one,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.three».
    paddingVertical: Spacing.three,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
  },
  // Esta línea sirve para declarar la propiedad «doneText» con el valor o tipo «{ textAlign: 'center' }».
  doneText: { textAlign: 'center' },
  // Esta línea sirve para definir el estilo «inputsRow» con «flexDirection: 'row', gap: Spacing.three, backgrou…».
  inputsRow: { flexDirection: 'row', gap: Spacing.three, backgroundColor: 'transparent' },
  // Esta línea sirve para declarar la propiedad «inputHalf» con el valor o tipo «{ flex: 1, backgroundColor: 'transparent' }».
  inputHalf: { flex: 1, backgroundColor: 'transparent' },
  // Esta línea sirve para declarar la propiedad «rpeBlock» con el valor o tipo «{ backgroundColor: 'transparent' }».
  rpeBlock: { backgroundColor: 'transparent' },
  // Esta línea sirve para declarar la propiedad «stepperLabel» con el valor o tipo «{ marginBottom: Spacing.one }».
  stepperLabel: { marginBottom: Spacing.one },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E', textAlign: 'center' }».
  error: { color: '#FF4D5E', textAlign: 'center' },
  // Esta línea sirve para definir el estilo «feedbackRow» con «flexDirection: 'row', gap: Spacing.three, alignSel…».
  feedbackRow: { flexDirection: 'row', gap: Spacing.three, alignSelf: 'stretch' },
  // Esta línea sirve para declarar la propiedad «feedbackHalf» con el valor o tipo «{ flex: 1 }».
  feedbackHalf: { flex: 1 },
});
