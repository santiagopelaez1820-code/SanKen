import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ExerciseCatalogItem, FitnessGoal, ManualRoutinePayload, Routine, SplitType } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ListPickerModal } from '@/components/ui/list-picker-modal';
import { OptionCard } from '@/components/ui/option-card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAdminStore } from '@/store/admin-store';
import { useExerciseCatalogStore } from '@/store/exercise-catalog-store';
import { useTrainerClientsStore } from '@/store/trainer-clients-store';
import { RoutineDayEditor } from './routine-day-editor';
import { EMPTY_DAY, EMPTY_EXERCISE, GOAL_OPTIONS, SPLIT_OPTIONS, type DayFormValues } from './routine-editor-types';

interface RoutineEditorFormProps {
  /**
   * "admin" apunta a /admin/users/{userId}/routine — rutina personalizada
   * asignada por Super Admin, aislada al usuario objetivo (ver
   * apps/web RoutineEditorPage scope="admin", mismo criterio acá). Default
   * "trainer" (comportamiento existente, sin cambios).
   */
  scope?: 'trainer' | 'admin';
  mode: 'create' | 'edit';
  trainerClientId?: number;
  routineId?: number;
  /** Requerido cuando scope="admin" — identifica de quién es la rutina. */
  userId?: number;
}

interface PickerSlot {
  dayIndex: number;
  exerciseIndex: number | null;
}

function routineToDays(routine: Routine): DayFormValues[] {
  return [...routine.days]
    .sort((a, b) => a.day_order - b.day_order)
    .map((day) => ({
      label: day.label,
      target_muscle_groups: (day.target_muscle_groups ?? []).join(', '),
      exercises: [...day.exercises]
        .sort((a, b) => a.order - b.order)
        .map((ex) => ({
          exercise_id: ex.exercise.id,
          exercise_name: ex.exercise.name,
          target_sets: String(ex.target_sets),
          target_reps: ex.target_reps,
          rest_seconds: String(ex.rest_seconds),
          target_rpe: ex.target_rpe !== null ? String(ex.target_rpe) : '',
        })),
    }));
}

/**
 * Carga los datos necesarios (rutina existente en modo edición, catálogo de
 * ejercicios) y solo monta el formulario una vez que están disponibles, para
 * que el estado local pueda inicializarse directamente desde los datos ya
 * resueltos en vez de sincronizarse después vía efecto.
 */
export function RoutineEditorForm({ scope = 'trainer', mode, trainerClientId, routineId, userId }: RoutineEditorFormProps) {
  const { routineForEdit, isLoadingRoutine, loadRoutineForEdit } = useTrainerClientsStore();
  const { adminRoutineForEdit, isLoadingAdminRoutine, loadAdminRoutineForEdit } = useAdminStore();
  const loadExercises = useExerciseCatalogStore((s) => s.load);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  useEffect(() => {
    if (scope === 'admin' && userId) {
      loadAdminRoutineForEdit(userId);
    } else if (mode === 'edit' && routineId) {
      loadRoutineForEdit(routineId);
    }
  }, [scope, mode, routineId, userId, loadRoutineForEdit, loadAdminRoutineForEdit]);

  // Para scope="admin" no hay un modo explícito de create/edit por URL — se
  // carga la rutina personalizada del usuario (si existe) y de ahí sale si
  // el submit termina en POST (asignar) o PATCH (reemplazar), igual que
  // apps/web RoutineEditorPage scope="admin".
  const isLoading = scope === 'admin' ? isLoadingAdminRoutine : mode === 'edit' && isLoadingRoutine;
  const initialRoutine = scope === 'admin' ? adminRoutineForEdit : mode === 'edit' ? routineForEdit : null;

  if (isLoading) {
    return (
      <ThemedView style={styles.root}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText type="small" themeColor="textSecondary">
            Cargando rutina…
          </ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <RoutineEditorFields
      scope={scope}
      mode={mode}
      trainerClientId={trainerClientId}
      routineId={routineId}
      userId={userId}
      initialRoutine={initialRoutine}
    />
  );
}

interface RoutineEditorFieldsProps extends RoutineEditorFormProps {
  initialRoutine: Routine | null;
}

function RoutineEditorFields({ scope = 'trainer', mode, trainerClientId, routineId, userId, initialRoutine }: RoutineEditorFieldsProps) {
  const { isSubmitting, submitError, createRoutine, updateRoutine } = useTrainerClientsStore();
  const { isSubmittingAdminRoutine, adminRoutineError, saveAdminRoutine } = useAdminStore();
  const exercises = useExerciseCatalogStore((s) => s.exercises);

  const [goal, setGoal] = useState<FitnessGoal>(() => initialRoutine?.goal ?? 'gain_muscle');
  const [splitType, setSplitType] = useState<SplitType>(() => initialRoutine?.split_type ?? 'full_body');
  const [frequencyDays, setFrequencyDays] = useState(() => String(initialRoutine?.frequency_days ?? 3));
  const [durationWeeks, setDurationWeeks] = useState(() => String(initialRoutine?.duration_weeks ?? 6));
  const [days, setDays] = useState<DayFormValues[]>(() =>
    initialRoutine ? routineToDays(initialRoutine) : [EMPTY_DAY],
  );
  const [pickerSlot, setPickerSlot] = useState<PickerSlot | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  function updateDay(dayIndex: number, patch: Partial<DayFormValues>) {
    setDays((prev) => prev.map((d, i) => (i === dayIndex ? { ...d, ...patch } : d)));
  }

  function removeDay(dayIndex: number) {
    setDays((prev) => prev.filter((_, i) => i !== dayIndex));
  }

  function removeExercise(dayIndex: number, exerciseIndex: number) {
    setDays((prev) =>
      prev.map((d, i) => (i === dayIndex ? { ...d, exercises: d.exercises.filter((_, j) => j !== exerciseIndex) } : d)),
    );
  }

  function updateExerciseField(
    dayIndex: number,
    exerciseIndex: number,
    field: 'target_sets' | 'target_reps' | 'rest_seconds' | 'target_rpe',
    value: string,
  ) {
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIndex
          ? { ...d, exercises: d.exercises.map((e, j) => (j === exerciseIndex ? { ...e, [field]: value } : e)) }
          : d,
      ),
    );
  }

  function handlePickExercise(exercise: ExerciseCatalogItem) {
    if (!pickerSlot) return;
    setDays((prev) =>
      prev.map((d, i) => {
        if (i !== pickerSlot.dayIndex) return d;
        const exercises = [...d.exercises];
        if (pickerSlot.exerciseIndex === null) {
          exercises.push({ ...EMPTY_EXERCISE, exercise_id: exercise.id, exercise_name: exercise.name });
        } else {
          exercises[pickerSlot.exerciseIndex] = {
            ...exercises[pickerSlot.exerciseIndex],
            exercise_id: exercise.id,
            exercise_name: exercise.name,
          };
        }
        return { ...d, exercises };
      }),
    );
    setPickerSlot(null);
  }

  function buildPayload(): ManualRoutinePayload | null {
    const frequency = Number(frequencyDays);
    const duration = Number(durationWeeks);
    if (!Number.isFinite(frequency) || frequency < 1 || !Number.isFinite(duration) || duration < 1) {
      setFormError('Revisa los días por semana y la duración.');
      return null;
    }
    if (days.length === 0 || days.some((d) => !d.label.trim() || d.exercises.length === 0)) {
      setFormError('Cada día necesita un nombre y al menos un ejercicio.');
      return null;
    }
    if (days.some((d) => d.exercises.some((e) => e.exercise_id === 0))) {
      setFormError('Elegí un ejercicio para cada fila.');
      return null;
    }

    setFormError(null);
    return {
      goal,
      split_type: splitType,
      frequency_days: frequency,
      duration_weeks: duration,
      days: days.map((day, dayIndex) => ({
        day_order: dayIndex + 1,
        label: day.label,
        target_muscle_groups: day.target_muscle_groups
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        exercises: day.exercises.map((ex, exIndex) => ({
          exercise_id: ex.exercise_id,
          order: exIndex + 1,
          target_sets: Number(ex.target_sets) || 1,
          target_reps: ex.target_reps,
          rest_seconds: Number(ex.rest_seconds) || 0,
          target_rpe: ex.target_rpe.trim() === '' ? null : Number(ex.target_rpe),
        })),
      })),
    };
  }

  async function handleSave() {
    const payload = buildPayload();
    if (!payload) return;

    if (scope === 'admin' && userId) {
      const routine = await saveAdminRoutine(userId, payload);
      if (routine) router.replace(`/admin/usuarios/${userId}`);
      return;
    }

    if (mode === 'create' && trainerClientId) {
      const routine = await createRoutine(trainerClientId, payload);
      if (routine) router.replace(`/trainer/clients/${trainerClientId}`);
    } else if (mode === 'edit' && routineId) {
      const routine = await updateRoutine(routineId, payload);
      if (routine) router.back();
    }
  }

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
          <ThemedText type="small" themeColor="textSecondary" onPress={() => router.back()}>
            ← Volver
          </ThemedText>
          <ThemedText type="title" style={styles.pageTitle}>
            {scope === 'admin'
              ? initialRoutine
                ? 'Editar rutina personalizada'
                : 'Asignar rutina personalizada'
              : mode === 'create'
                ? 'Nueva rutina manual'
                : 'Editar rutina'}
          </ThemedText>

          <ThemedText type="smallBold">Objetivo</ThemedText>
          <ThemedView style={styles.optionList}>
            {GOAL_OPTIONS.map((opt) => (
              <OptionCard key={opt.value} label={opt.label} selected={goal === opt.value} onPress={() => setGoal(opt.value)} />
            ))}
          </ThemedView>

          <ThemedText type="smallBold" style={styles.sectionSpacer}>
            Split
          </ThemedText>
          <ThemedView style={styles.optionList}>
            {SPLIT_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                label={opt.label}
                selected={splitType === opt.value}
                onPress={() => setSplitType(opt.value)}
              />
            ))}
          </ThemedView>

          <ThemedView style={styles.fieldsRow}>
            <ThemedView style={{ flex: 1 }}>
              <TextField label="Días/semana" value={frequencyDays} onChangeText={setFrequencyDays} keyboardType="number-pad" />
            </ThemedView>
            <ThemedView style={{ flex: 1 }}>
              <TextField label="Semanas" value={durationWeeks} onChangeText={setDurationWeeks} keyboardType="number-pad" />
            </ThemedView>
          </ThemedView>

          {days.map((day, dayIndex) => (
            <RoutineDayEditor
              key={dayIndex}
              day={day}
              canRemove={days.length > 1}
              onChangeLabel={(v) => updateDay(dayIndex, { label: v })}
              onChangeMuscleGroups={(v) => updateDay(dayIndex, { target_muscle_groups: v })}
              onRemoveDay={() => removeDay(dayIndex)}
              onOpenPicker={(exerciseIndex) => setPickerSlot({ dayIndex, exerciseIndex })}
              onRemoveExercise={(exerciseIndex) => removeExercise(dayIndex, exerciseIndex)}
              onChangeExerciseField={(exerciseIndex, field, value) =>
                updateExerciseField(dayIndex, exerciseIndex, field, value)
              }
            />
          ))}

          <PrimaryButton
            label="+ Agregar día"
            variant="ghost"
            onPress={() => setDays((prev) => [...prev, EMPTY_DAY])}
          />

          {(formError || (scope === 'admin' ? adminRoutineError : submitError)) && (
            <ThemedText type="small" style={styles.error}>
              {formError ?? (scope === 'admin' ? adminRoutineError : submitError)}
            </ThemedText>
          )}

          <PrimaryButton
            label="Guardar rutina"
            loading={scope === 'admin' ? isSubmittingAdminRoutine : isSubmitting}
            onPress={handleSave}
          />
        </ScrollView>
      </SafeAreaView>

      <ListPickerModal
        visible={pickerSlot !== null}
        title="Elegir ejercicio"
        items={exercises}
        getId={(exercise) => exercise.id}
        getLabel={(exercise) => exercise.name}
        getSubtitle={(exercise) => `${exercise.primary_muscle.name} · ${exercise.equipment}`}
        searchPlaceholder="Nombre del ejercicio…"
        onSelect={handlePickExercise}
        onClose={() => setPickerSlot(null)}
      />
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
    gap: Spacing.two,
  },
  pageTitle: { fontSize: 24, lineHeight: 30, marginBottom: Spacing.two },
  optionList: { gap: Spacing.two },
  sectionSpacer: { marginTop: Spacing.two },
  fieldsRow: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.two },
  error: { color: '#FF4D5E' },
});
