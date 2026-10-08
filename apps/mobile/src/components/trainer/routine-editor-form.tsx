// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «ScrollView, StyleSheet» desde «react-native».
import { ScrollView, StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar los tipos «ExerciseCatalogItem, FitnessGoal, ManualRoutinePayload, Routine, SplitType» desde «@sanken/core».
import type { ExerciseCatalogItem, FitnessGoal, ManualRoutinePayload, Routine, SplitType } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «BackButton» desde «@/components/ui/back-button».
import { BackButton } from '@/components/ui/back-button';
// Esta línea sirve para importar «ListPickerModal» desde «@/components/ui/list-picker-modal».
import { ListPickerModal } from '@/components/ui/list-picker-modal';
// Esta línea sirve para importar «OptionCard» desde «@/components/ui/option-card».
import { OptionCard } from '@/components/ui/option-card';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «TextField» desde «@/components/ui/text-field».
import { TextField } from '@/components/ui/text-field';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useAdminStore» desde «@/store/admin-store».
import { useAdminStore } from '@/store/admin-store';
// Esta línea sirve para importar «useExerciseCatalogStore» desde «@/store/exercise-catalog-store».
import { useExerciseCatalogStore } from '@/store/exercise-catalog-store';
// Esta línea sirve para importar «useTrainerClientsStore» desde «@/store/trainer-clients-store».
import { useTrainerClientsStore } from '@/store/trainer-clients-store';
// Esta línea sirve para importar «RoutineDayEditor» desde «./routine-day-editor».
import { RoutineDayEditor } from './routine-day-editor';
// Esta línea sirve para importar «EMPTY_DAY, EMPTY_EXERCISE, GOAL_OPTIONS, SPLIT_OPTIONS, type DayFormValues» desde «./routine-editor-types».
import { EMPTY_DAY, EMPTY_EXERCISE, GOAL_OPTIONS, SPLIT_OPTIONS, type DayFormValues } from './routine-editor-types';

// Esta línea sirve para declarar la interfaz «RoutineEditorFormProps».
interface RoutineEditorFormProps {
  /**
   * "admin" apunta a /admin/users/{userId}/routine — rutina personalizada
   * asignada por Super Admin, aislada al usuario objetivo (ver
   * apps/web RoutineEditorPage scope="admin", mismo criterio acá). Default
   * "trainer" (comportamiento existente, sin cambios).
   */
  // Esta línea sirve para declarar la propiedad «scope» con el valor o tipo «'trainer' | 'admin'».
  scope?: 'trainer' | 'admin';
  // Esta línea sirve para declarar la propiedad «mode» con el valor o tipo «'create' | 'edit'».
  mode: 'create' | 'edit';
  // Esta línea sirve para declarar la propiedad «trainerClientId» con el valor o tipo «number».
  trainerClientId?: number;
  // Esta línea sirve para declarar la propiedad «routineId» con el valor o tipo «number».
  routineId?: number;
  /** Requerido cuando scope="admin" — identifica de quién es la rutina. */
  // Esta línea sirve para declarar la propiedad «userId» con el valor o tipo «number».
  userId?: number;
}

// Esta línea sirve para declarar la interfaz «PickerSlot».
interface PickerSlot {
  // Esta línea sirve para declarar la propiedad «dayIndex» con el valor o tipo «number».
  dayIndex: number;
  // Esta línea sirve para declarar la propiedad «exerciseIndex» con el valor o tipo «number | null».
  exerciseIndex: number | null;
}

// Esta línea sirve para declarar la función «routineToDays».
function routineToDays(routine: Routine): DayFormValues[] {
  // Esta línea sirve para devolver «[...routine.days]».
  return [...routine.days]
    // Esta línea sirve para encadenar la operación «sort».
    .sort((a, b) => a.day_order - b.day_order)
    // Esta línea sirve para encadenar la operación «map».
    .map((day) => ({
      // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «day.label».
      label: day.label,
      // Esta línea sirve para declarar la propiedad «target_muscle_groups» con el valor o tipo «(day.target_muscle_groups ?? []).join(', ')».
      target_muscle_groups: (day.target_muscle_groups ?? []).join(', '),
      // Esta línea sirve para declarar la propiedad «exercises» con el valor o tipo «[...day.exercises]».
      exercises: [...day.exercises]
        // Esta línea sirve para encadenar la operación «sort».
        .sort((a, b) => a.order - b.order)
        // Esta línea sirve para encadenar la operación «map».
        .map((ex) => ({
          // Esta línea sirve para declarar la propiedad «exercise_id» con el valor o tipo «ex.exercise.id».
          exercise_id: ex.exercise.id,
          // Esta línea sirve para declarar la propiedad «exercise_name» con el valor o tipo «ex.exercise.name».
          exercise_name: ex.exercise.name,
          // Esta línea sirve para declarar la propiedad «target_sets» con el valor o tipo «String(ex.target_sets)».
          target_sets: String(ex.target_sets),
          // Esta línea sirve para declarar la propiedad «target_reps» con el valor o tipo «ex.target_reps».
          target_reps: ex.target_reps,
          // Esta línea sirve para declarar la propiedad «rest_seconds» con el valor o tipo «String(ex.rest_seconds)».
          rest_seconds: String(ex.rest_seconds),
          // Esta línea sirve para definir «target_rpe» con «ex.target_rpe !== null ? String(ex.targe…».
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
// Esta línea sirve para declarar la función «RoutineEditorForm».
export function RoutineEditorForm({ scope = 'trainer', mode, trainerClientId, routineId, userId }: RoutineEditorFormProps) {
  // Esta línea sirve para obtener «routineForEdit, isLoadingRoutine, loadRoutineForEdit» con el hook «useTrainerClientsStore».
  const { routineForEdit, isLoadingRoutine, loadRoutineForEdit } = useTrainerClientsStore();
  // Esta línea sirve para obtener «adminRoutineForEdit, isLoadingAdminRoutine, loadAdminRoutineForEdit» con el hook «useAdminStore».
  const { adminRoutineForEdit, isLoadingAdminRoutine, loadAdminRoutineForEdit } = useAdminStore();
  // Esta línea sirve para obtener «loadExercises» con el hook «useExerciseCatalogStore».
  const loadExercises = useExerciseCatalogStore((s) => s.load);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «loadExercises».
    loadExercises();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «loadExercises».
  }, [loadExercises]);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para revisar si «scope === 'admin' && userId».
    if (scope === 'admin' && userId) {
      // Esta línea sirve para llamar a «loadAdminRoutineForEdit» con «userId».
      loadAdminRoutineForEdit(userId);
    // Esta línea sirve para revisar si «mode === 'edit' && routineId» cuando lo anterior no aplica.
    } else if (mode === 'edit' && routineId) {
      // Esta línea sirve para llamar a «loadRoutineForEdit» con «routineId».
      loadRoutineForEdit(routineId);
    }
  // Esta línea sirve para volver a ejecutar el efecto si cambian los datos de la rutina.
  }, [scope, mode, routineId, userId, loadRoutineForEdit, loadAdminRoutineForEdit]);

  // Para scope="admin" no hay un modo explícito de create/edit por URL — se
  // carga la rutina personalizada del usuario (si existe) y de ahí sale si
  // el submit termina en POST (asignar) o PATCH (reemplazar), igual que
  // apps/web RoutineEditorPage scope="admin".
  // Esta línea sirve para extraer «sLoadin» de «scope === 'admin' ? isLoadingAdminRoutin».
  const isLoading = scope === 'admin' ? isLoadingAdminRoutine : mode === 'edit' && isLoadingRoutine;
  // Esta línea sirve para extraer «nitialRoutin» de «scope === 'admin' ? adminRoutineForEdit ».
  const initialRoutine = scope === 'admin' ? adminRoutineForEdit : mode === 'edit' ? routineForEdit : null;

  // Esta línea sirve para revisar si «isLoading».
  if (isLoading) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el componente «ThemedView».
      <ThemedView style={styles.root}>
        {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
        <SafeAreaView style={styles.safeArea}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary">
            {/* Esta línea sirve para mostrar el texto «Cargando rutina…». */}
            Cargando rutina…
          </ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «RoutineEditorFields» con sus atributos en varias líneas.
    <RoutineEditorFields
      // Esta línea sirve para pasar la propiedad «scope» con el valor «scope}».
      scope={scope}
      // Esta línea sirve para pasar la propiedad «mode» con el valor «mode}».
      mode={mode}
      // Esta línea sirve para pasar la propiedad «trainerClientId» con el valor «trainerClientId}».
      trainerClientId={trainerClientId}
      // Esta línea sirve para pasar la propiedad «routineId» con el valor «routineId}».
      routineId={routineId}
      // Esta línea sirve para pasar la propiedad «userId» con el valor «userId}».
      userId={userId}
      // Esta línea sirve para pasar la propiedad «initialRoutine» con el valor «initialRoutine}».
      initialRoutine={initialRoutine}
    />
  );
}

// Esta línea sirve para declarar la interfaz «RoutineEditorFieldsProps».
interface RoutineEditorFieldsProps extends RoutineEditorFormProps {
  // Esta línea sirve para declarar la propiedad «initialRoutine» con el valor o tipo «Routine | null».
  initialRoutine: Routine | null;
}

// Esta línea sirve para declarar la función «RoutineEditorFields».
function RoutineEditorFields({ scope = 'trainer', mode, trainerClientId, routineId, userId, initialRoutine }: RoutineEditorFieldsProps) {
  // Esta línea sirve para obtener «isSubmitting, submitError, createRoutine, updateRoutine» con el hook «useTrainerClientsStore».
  const { isSubmitting, submitError, createRoutine, updateRoutine } = useTrainerClientsStore();
  // Esta línea sirve para obtener «isSubmittingAdminRoutine, adminRoutineError, saveAdminRoutine» con el hook «useAdminStore».
  const { isSubmittingAdminRoutine, adminRoutineError, saveAdminRoutine } = useAdminStore();
  // Esta línea sirve para obtener «exercises» con el hook «useExerciseCatalogStore».
  const exercises = useExerciseCatalogStore((s) => s.exercises);

  // Esta línea sirve para crear el estado «goal» y su función «setGoal».
  const [goal, setGoal] = useState<FitnessGoal>(() => initialRoutine?.goal ?? 'gain_muscle');
  // Esta línea sirve para crear el estado «splitType» y su función «setSplitType».
  const [splitType, setSplitType] = useState<SplitType>(() => initialRoutine?.split_type ?? 'full_body');
  // Esta línea sirve para crear el estado «frequencyDays» y su función «setFrequencyDays».
  const [frequencyDays, setFrequencyDays] = useState(() => String(initialRoutine?.frequency_days ?? 3));
  // Esta línea sirve para crear el estado «durationWeeks» y su función «setDurationWeeks».
  const [durationWeeks, setDurationWeeks] = useState(() => String(initialRoutine?.duration_weeks ?? 6));
  // Esta línea sirve para crear el estado «days» y su función «setDays».
  const [days, setDays] = useState<DayFormValues[]>(() =>
    // Esta línea sirve para partir de la rutina inicial convertida a días o de un día vacío.
    initialRoutine ? routineToDays(initialRoutine) : [EMPTY_DAY],
  );
  // Esta línea sirve para crear el estado «pickerSlot» y su función «setPickerSlot».
  const [pickerSlot, setPickerSlot] = useState<PickerSlot | null>(null);
  // Esta línea sirve para crear el estado «formError» y su función «setFormError».
  const [formError, setFormError] = useState<string | null>(null);

  // Esta línea sirve para declarar la función «updateDay».
  function updateDay(dayIndex: number, patch: Partial<DayFormValues>) {
    // Esta línea sirve para guardar en el estado con «setDays» el valor «(prev) => prev.map((d, i) => (i === dayIndex …».
    setDays((prev) => prev.map((d, i) => (i === dayIndex ? { ...d, ...patch } : d)));
  }

  // Esta línea sirve para declarar la función «removeDay».
  function removeDay(dayIndex: number) {
    // Esta línea sirve para guardar en el estado con «setDays» el valor «(prev) => prev.filter((_, i) => i !== dayInde…».
    setDays((prev) => prev.filter((_, i) => i !== dayIndex));
  }

  // Esta línea sirve para declarar la función «removeExercise».
  function removeExercise(dayIndex: number, exerciseIndex: number) {
    // Esta línea sirve para guardar en el estado con «setDays» el valor «(prev) =>…».
    setDays((prev) =>
      // Esta línea sirve para quitar el ejercicio indicado del día indicado.
      prev.map((d, i) => (i === dayIndex ? { ...d, exercises: d.exercises.filter((_, j) => j !== exerciseIndex) } : d)),
    );
  }

  // Esta línea sirve para declarar la función «updateExerciseField».
  function updateExerciseField(
    // Esta línea sirve para declarar la propiedad «dayIndex» con el valor o tipo «number».
    dayIndex: number,
    // Esta línea sirve para declarar la propiedad «exerciseIndex» con el valor o tipo «number».
    exerciseIndex: number,
    // Esta línea sirve para definir la propiedad «field» con «target_sets' | 'target_reps' | 'rest_sec…».
    field: 'target_sets' | 'target_reps' | 'rest_seconds' | 'target_rpe',
    // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «string».
    value: string,
  // Esta línea sirve para cerrar los parámetros de la función.
  ) {
    // Esta línea sirve para guardar en el estado con «setDays» el valor «(prev) =>…».
    setDays((prev) =>
      // Esta línea sirve para actualizar la lista de días a partir del estado anterior.
      prev.map((d, i) =>
        // Esta línea sirve para revisar si el día es el indicado.
        i === dayIndex
          // Esta línea sirve para reemplazar el ejercicio indicado con el campo modificado.
          ? { ...d, exercises: d.exercises.map((e, j) => (j === exerciseIndex ? { ...e, [field]: value } : e)) }
          // Esta línea sirve para dejar los demás días sin cambios.
          : d,
      ),
    );
  }

  // Esta línea sirve para declarar la función «handlePickExercise».
  function handlePickExercise(exercise: ExerciseCatalogItem) {
    // Esta línea sirve para salir de la función si «!pickerSlot».
    if (!pickerSlot) return;
    // Esta línea sirve para guardar en el estado con «setDays» el valor «(prev) =>…».
    setDays((prev) =>
      // Esta línea sirve para actualizar la lista de días a partir del estado anterior.
      prev.map((d, i) => {
        // Esta línea sirve para devolver «d» si «i !== pickerSlot.dayIndex».
        if (i !== pickerSlot.dayIndex) return d;
        // Esta línea sirve para extraer «xercise» de «[...d.exercises]».
        const exercises = [...d.exercises];
        // Esta línea sirve para revisar si «pickerSlot.exerciseIndex === null».
        if (pickerSlot.exerciseIndex === null) {
          // Esta línea sirve para agregar el ejercicio elegido al final del día.
          exercises.push({ ...EMPTY_EXERCISE, exercise_id: exercise.id, exercise_name: exercise.name });
        // Esta línea sirve para ejecutar este bloque en el caso contrario.
        } else {
          // Esta línea sirve para reemplazar el ejercicio de la posición elegida.
          exercises[pickerSlot.exerciseIndex] = {
            // Esta línea sirve para copiar las propiedades de «exercises».
            ...exercises[pickerSlot.exerciseIndex],
            // Esta línea sirve para declarar la propiedad «exercise_id» con el valor o tipo «exercise.id».
            exercise_id: exercise.id,
            // Esta línea sirve para declarar la propiedad «exercise_name» con el valor o tipo «exercise.name».
            exercise_name: exercise.name,
          };
        }
        // Esta línea sirve para devolver «{ ...d, exercises }».
        return { ...d, exercises };
      }),
    );
    // Esta línea sirve para guardar en el estado con «setPickerSlot» el valor «null)…».
    setPickerSlot(null);
  }

  // Esta línea sirve para declarar la función «buildPayload».
  function buildPayload(): ManualRoutinePayload | null {
    // Esta línea sirve para extraer «requenc» de «Number(frequencyDays)».
    const frequency = Number(frequencyDays);
    // Esta línea sirve para extraer «uratio» de «Number(durationWeeks)».
    const duration = Number(durationWeeks);
    // Esta línea sirve para validar que la frecuencia y los datos numéricos sean válidos.
    if (!Number.isFinite(frequency) || frequency < 1 || !Number.isFinite(duration) || duration < 1) {
      // Esta línea sirve para guardar en el estado con «setFormError» el valor «'Revisa los días por semana y la duración.')…».
      setFormError('Revisa los días por semana y la duración.');
      // Esta línea sirve para devolver null.
      return null;
    }
    // Esta línea sirve para validar que haya días con nombre y ejercicios.
    if (days.length === 0 || days.some((d) => !d.label.trim() || d.exercises.length === 0)) {
      // Esta línea sirve para guardar en el estado con «setFormError» el valor «'Cada día necesita un nombre y al menos un ej…».
      setFormError('Cada día necesita un nombre y al menos un ejercicio.');
      // Esta línea sirve para devolver null.
      return null;
    }
    // Esta línea sirve para validar que todos los ejercicios hayan sido elegidos.
    if (days.some((d) => d.exercises.some((e) => e.exercise_id === 0))) {
      // Esta línea sirve para guardar en el estado con «setFormError» el valor «'Elegí un ejercicio para cada fila.')…».
      setFormError('Elegí un ejercicio para cada fila.');
      // Esta línea sirve para devolver null.
      return null;
    }

    // Esta línea sirve para guardar en el estado con «setFormError» el valor «null)…».
    setFormError(null);
    // Esta línea sirve para devolver «{».
    return {
      // Esta línea sirve para incluir el valor «goal» en la lista.
      goal,
      // Esta línea sirve para declarar la propiedad «split_type» con el valor o tipo «splitType».
      split_type: splitType,
      // Esta línea sirve para declarar la propiedad «frequency_days» con el valor o tipo «frequency».
      frequency_days: frequency,
      // Esta línea sirve para declarar la propiedad «duration_weeks» con el valor o tipo «duration».
      duration_weeks: duration,
      // Esta línea sirve para declarar la propiedad «days» con el valor o tipo «days.map((day, dayIndex) => ({».
      days: days.map((day, dayIndex) => ({
        // Esta línea sirve para declarar la propiedad «day_order» con el valor o tipo «dayIndex + 1».
        day_order: dayIndex + 1,
        // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «day.label».
        label: day.label,
        // Esta línea sirve para declarar la propiedad «target_muscle_groups» con el valor o tipo «day.target_muscle_groups».
        target_muscle_groups: day.target_muscle_groups
          // Esta línea sirve para encadenar la operación «split».
          .split(',')
          // Esta línea sirve para encadenar la operación «map».
          .map((s) => s.trim())
          // Esta línea sirve para encadenar la operación «filter».
          .filter(Boolean),
        // Esta línea sirve para declarar la propiedad «exercises» con el valor o tipo «day.exercises.map((ex, exIndex) => ({».
        exercises: day.exercises.map((ex, exIndex) => ({
          // Esta línea sirve para declarar la propiedad «exercise_id» con el valor o tipo «ex.exercise_id».
          exercise_id: ex.exercise_id,
          // Esta línea sirve para declarar la propiedad «order» con el valor o tipo «exIndex + 1».
          order: exIndex + 1,
          // Esta línea sirve para declarar la propiedad «target_sets» con el valor o tipo «Number(ex.target_sets) || 1».
          target_sets: Number(ex.target_sets) || 1,
          // Esta línea sirve para declarar la propiedad «target_reps» con el valor o tipo «ex.target_reps».
          target_reps: ex.target_reps,
          // Esta línea sirve para declarar la propiedad «rest_seconds» con el valor o tipo «Number(ex.rest_seconds) || 0».
          rest_seconds: Number(ex.rest_seconds) || 0,
          // Esta línea sirve para definir «target_rpe» con «ex.target_rpe.trim() === '' ? null : Num…».
          target_rpe: ex.target_rpe.trim() === '' ? null : Number(ex.target_rpe),
        })),
      })),
    };
  }

  // Esta línea sirve para declarar la función «handleSave».
  async function handleSave() {
    // Esta línea sirve para extraer «ayloa» de «buildPayload()».
    const payload = buildPayload();
    // Esta línea sirve para salir de la función si «!payload».
    if (!payload) return;

    // Esta línea sirve para revisar si «scope === 'admin' && userId».
    if (scope === 'admin' && userId) {
      // Esta línea sirve para esperar «saveAdminRoutine(userId, payload)» y guardar el resultado en «routine».
      const routine = await saveAdminRoutine(userId, payload);
      // Esta línea sirve para llamar a «router.replace» si «routine».
      if (routine) router.replace(`/admin/usuarios/${userId}`);
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }

    // Esta línea sirve para revisar si «mode === 'create' && trainerClientId».
    if (mode === 'create' && trainerClientId) {
      // Esta línea sirve para esperar «createRoutine(trainerClientId, payload)» y guardar el resultado en «routine».
      const routine = await createRoutine(trainerClientId, payload);
      // Esta línea sirve para llamar a «router.replace» si «routine».
      if (routine) router.replace(`/trainer/clients/${trainerClientId}`);
    // Esta línea sirve para revisar si «mode === 'edit' && routineId» cuando lo anterior no aplica.
    } else if (mode === 'edit' && routineId) {
      // Esta línea sirve para esperar «updateRoutine(routineId, payload)» y guardar el resultado en «routine».
      const routine = await updateRoutine(routineId, payload);
      // Esta línea sirve para llamar a «router.back» si «routine».
      if (routine) router.back();
    }
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «ScrollView». */}
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
          {/* Esta línea sirve para abrir el componente «BackButton». */}
          <BackButton fallbackHref="/trainer" />
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="title" style={styles.pageTitle}>
            {/* Esta línea sirve para mostrar el contenido dinámico «{scope === 'admin'». */}
            {scope === 'admin'
              // Esta línea sirve para revisar si hay una rutina inicial.
              ? initialRoutine
                // Esta línea sirve para mostrar «Editar rutina personalizada».
                ? 'Editar rutina personalizada'
                // Esta línea sirve para mostrar «Asignar rutina personalizada».
                : 'Asignar rutina personalizada'
              // Esta línea sirve para revisar si el modo es crear.
              : mode === 'create'
                // Esta línea sirve para mostrar «Nueva rutina manual».
                ? 'Nueva rutina manual'
                // Esta línea sirve para mostrar «Editar rutina».
                : 'Editar rutina'}
          </ThemedText>

          {/* Esta línea sirve para mostrar el texto «Objetivo» dentro de «ThemedText». */}
          <ThemedText type="smallBold">Objetivo</ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={styles.optionList}>
            {/* Esta línea sirve para recorrer «GOAL_OPTIONS» y mostrar un bloque por elemento. */}
            {GOAL_OPTIONS.map((opt) => (
              // Esta línea sirve para mostrar el componente «OptionCard».
              <OptionCard key={opt.value} label={opt.label} selected={goal === opt.value} onPress={() => setGoal(opt.value)} />
            ))}
          </ThemedView>

          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="smallBold" style={styles.sectionSpacer}>
            {/* Esta línea sirve para mostrar el texto «Split». */}
            Split
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={styles.optionList}>
            {/* Esta línea sirve para recorrer «SPLIT_OPTIONS» y mostrar un bloque por elemento. */}
            {SPLIT_OPTIONS.map((opt) => (
              // Esta línea sirve para abrir el elemento «OptionCard» con sus atributos en varias líneas.
              <OptionCard
                // Esta línea sirve para identificar el elemento de la lista con «opt.value}».
                key={opt.value}
                // Esta línea sirve para pasar la propiedad «label» con el valor «opt.label}».
                label={opt.label}
                // Esta línea sirve para pasar la propiedad «selected» con el valor «splitType === opt.value}».
                selected={splitType === opt.value}
                // Esta línea sirve para asignar el manejador del evento «onPress».
                onPress={() => setSplitType(opt.value)}
              />
            ))}
          </ThemedView>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={styles.fieldsRow}>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={{ flex: 1 }}>
              {/* Esta línea sirve para abrir el componente «TextField». */}
              <TextField label="Días/semana" value={frequencyDays} onChangeText={setFrequencyDays} keyboardType="number-pad" />
            </ThemedView>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={{ flex: 1 }}>
              {/* Esta línea sirve para abrir el componente «TextField». */}
              <TextField label="Semanas" value={durationWeeks} onChangeText={setDurationWeeks} keyboardType="number-pad" />
            </ThemedView>
          </ThemedView>

          {/* Esta línea sirve para recorrer «days» y mostrar un bloque por elemento. */}
          {days.map((day, dayIndex) => (
            // Esta línea sirve para abrir el elemento «RoutineDayEditor» con sus atributos en varias líneas.
            <RoutineDayEditor
              // Esta línea sirve para identificar el elemento de la lista con «dayIndex}».
              key={dayIndex}
              // Esta línea sirve para pasar la propiedad «day» con el valor «day}».
              day={day}
              // Esta línea sirve para pasar la propiedad «canRemove» con el valor «days.length > 1}».
              canRemove={days.length > 1}
              // Esta línea sirve para asignar el manejador del evento «onChangeLabel».
              onChangeLabel={(v) => updateDay(dayIndex, { label: v })}
              // Esta línea sirve para asignar el manejador del evento «onChangeMuscleGroups».
              onChangeMuscleGroups={(v) => updateDay(dayIndex, { target_muscle_groups: v })}
              // Esta línea sirve para asignar el manejador del evento «onRemoveDay».
              onRemoveDay={() => removeDay(dayIndex)}
              // Esta línea sirve para asignar el manejador del evento «onOpenPicker».
              onOpenPicker={(exerciseIndex) => setPickerSlot({ dayIndex, exerciseIndex })}
              // Esta línea sirve para asignar el manejador del evento «onRemoveExercise».
              onRemoveExercise={(exerciseIndex) => removeExercise(dayIndex, exerciseIndex)}
              // Esta línea sirve para asignar el manejador del evento «onChangeExerciseField».
              onChangeExerciseField={(exerciseIndex, field, value) =>
                // Esta línea sirve para llamar a «updateExerciseField» con «dayIndex, exerciseIndex, field, value».
                updateExerciseField(dayIndex, exerciseIndex, field, value)
              }
            />
          ))}

          {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
          <PrimaryButton
            // Esta línea sirve para definir el atributo «label» con el valor «+ Agregar día».
            label="+ Agregar día"
            // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
            variant="ghost"
            // Esta línea sirve para asignar el manejador del evento «onPress».
            onPress={() => setDays((prev) => [...prev, EMPTY_DAY])}
          />

          {/* Esta línea sirve para mostrar el error del formulario o del administrador. */}
          {(formError || (scope === 'admin' ? adminRoutineError : submitError)) && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" style={styles.error}>
              {/* Esta línea sirve para mostrar el mensaje del error. */}
              {formError ?? (scope === 'admin' ? adminRoutineError : submitError)}
            </ThemedText>
          )}

          {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
          <PrimaryButton
            // Esta línea sirve para definir el atributo «label» con el valor «Guardar rutina».
            label="Guardar rutina"
            // Esta línea sirve para pasar la propiedad «loading» con el valor «scope === 'admin' ? isSubmittingAdminRoutine ».
            loading={scope === 'admin' ? isSubmittingAdminRoutine : isSubmitting}
            // Esta línea sirve para asignar el manejador del evento «onPress».
            onPress={handleSave}
          />
        </ScrollView>
      </SafeAreaView>

      {/* Esta línea sirve para abrir el elemento «ListPickerModal» con sus atributos en varias líneas. */}
      <ListPickerModal
        // Esta línea sirve para pasar la propiedad «visible» con el valor «pickerSlot !== null}».
        visible={pickerSlot !== null}
        // Esta línea sirve para definir el atributo «title» con el valor «Elegir ejercicio».
        title="Elegir ejercicio"
        // Esta línea sirve para pasar la propiedad «items» con el valor «exercises}».
        items={exercises}
        // Esta línea sirve para pasar la propiedad «getId» con el valor «(exercise) => exercise.id}».
        getId={(exercise) => exercise.id}
        // Esta línea sirve para pasar la propiedad «getLabel» con el valor «(exercise) => exercise.name}».
        getLabel={(exercise) => exercise.name}
        // Esta línea sirve para pasar la propiedad «getSubtitle» con el valor «(exercise) => `${exercise.primary_muscle.name».
        getSubtitle={(exercise) => `${exercise.primary_muscle.name} · ${exercise.equipment}`}
        // Esta línea sirve para definir el atributo «searchPlaceholder» con el valor «Nombre del ejercicio…».
        searchPlaceholder="Nombre del ejercicio…"
        // Esta línea sirve para asignar el manejador del evento «onSelect».
        onSelect={handlePickExercise}
        // Esta línea sirve para asignar el manejador del evento «onClose».
        onClose={() => setPickerSlot(null)}
      />
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «root» con el valor o tipo «{ flex: 1 }».
  root: { flex: 1 },
  // Esta línea sirve para definir el estilo «safeArea» con «flex: 1, alignItems: 'center', width: '100%' },…».
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  // Esta línea sirve para declarar la propiedad «scrollView» con el valor o tipo «{ alignSelf: 'stretch' }».
  scrollView: { alignSelf: 'stretch' },
  // Esta línea sirve para declarar la propiedad «content» con el valor o tipo «{».
  content: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «MaxContentWidth».
    maxWidth: MaxContentWidth,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.four».
    paddingHorizontal: Spacing.four,
    // Esta línea sirve para declarar la propiedad «paddingTop» con el valor o tipo «Spacing.three».
    paddingTop: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para definir el estilo «pageTitle» con «fontSize: 24, lineHeight: 30, marginBottom: Spacin…».
  pageTitle: { fontSize: 24, lineHeight: 30, marginBottom: Spacing.two },
  // Esta línea sirve para declarar la propiedad «optionList» con el valor o tipo «{ gap: Spacing.two }».
  optionList: { gap: Spacing.two },
  // Esta línea sirve para declarar la propiedad «sectionSpacer» con el valor o tipo «{ marginTop: Spacing.two }».
  sectionSpacer: { marginTop: Spacing.two },
  // Esta línea sirve para definir el estilo «fieldsRow» con «flexDirection: 'row', gap: Spacing.two, marginTop:…».
  fieldsRow: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.two },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
});
