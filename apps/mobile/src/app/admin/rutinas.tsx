// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar «Pressable, ScrollView, StyleSheet» desde «react-native».
import { Pressable, ScrollView, StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar los tipos «AdminRoutineTemplate, ExerciseCatalogItem» desde «@sanken/core».
import type { AdminRoutineTemplate, ExerciseCatalogItem } from '@sanken/core';

// Esta línea sirve para importar «RoutineTemplateDayEditor» desde «@/components/admin/routine-template-day-editor».
import { RoutineTemplateDayEditor } from '@/components/admin/routine-template-day-editor';
// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «buildTemplatePayload» en la lista.
  buildTemplatePayload,
  // Esta línea sirve para incluir el valor «EMPTY_TEMPLATE_DAY» en la lista.
  EMPTY_TEMPLATE_DAY,
  // Esta línea sirve para incluir el valor «EMPTY_TEMPLATE_EXERCISE» en la lista.
  EMPTY_TEMPLATE_EXERCISE,
  // Esta línea sirve para incluir el valor «LEVEL_LABELS» en la lista.
  LEVEL_LABELS,
  // Esta línea sirve para incluir el valor «LEVEL_OPTIONS» en la lista.
  LEVEL_OPTIONS,
  // Esta línea sirve para incluir el valor «SPLIT_OPTIONS» en la lista.
  SPLIT_OPTIONS,
  // Esta línea sirve para incluir el valor «templateToDays» en la lista.
  templateToDays,
  // Esta línea sirve para importar el tipo «TemplateDayFormValues».
  type TemplateDayFormValues,
// Esta línea sirve para terminar la importación desde «@/components/admin/routine-template-form-types».
} from '@/components/admin/routine-template-form-types';
// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «BackButton» desde «@/components/ui/back-button».
import { BackButton } from '@/components/ui/back-button';
// Esta línea sirve para importar «ConfirmDialog» desde «@/components/ui/confirm-dialog».
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
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
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';

// Esta línea sirve para declarar «EMPTY_FORM» con el valor «{».
const EMPTY_FORM = {
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «''».
  name: '',
  // Esta línea sirve para declarar la propiedad «sex» con el valor o tipo «'male' as 'male' | 'female'».
  sex: 'male' as 'male' | 'female',
  // Esta línea sirve para declarar la propiedad «frequencyDays» con el valor o tipo «'3'».
  frequencyDays: '3',
  // Esta línea sirve para declarar la propiedad «level» con el valor o tipo «'intermediate' as const».
  level: 'intermediate' as const,
  // Esta línea sirve para declarar la propiedad «splitType» con el valor o tipo «'full_body' as const».
  splitType: 'full_body' as const,
};

// Esta línea sirve para declarar la interfaz «PickerSlot».
interface PickerSlot {
  // Esta línea sirve para declarar la propiedad «dayIndex» con el valor o tipo «number».
  dayIndex: number;
  // Esta línea sirve para declarar la propiedad «exerciseIndex» con el valor o tipo «number | null».
  exerciseIndex: number | null;
}

// Esta línea sirve para declarar la función «AdminRutinasScreen».
export default function AdminRutinasScreen() {
  // Esta línea sirve para abrir la desestructuración de varios valores.
  const {
    // Esta línea sirve para incluir el valor «routineTemplates» en la lista.
    routineTemplates,
    // Esta línea sirve para incluir el valor «isLoadingRoutineTemplates» en la lista.
    isLoadingRoutineTemplates,
    // Esta línea sirve para incluir el valor «loadRoutineTemplates» en la lista.
    loadRoutineTemplates,
    // Esta línea sirve para incluir el valor «createRoutineTemplate» en la lista.
    createRoutineTemplate,
    // Esta línea sirve para incluir el valor «updateRoutineTemplate» en la lista.
    updateRoutineTemplate,
    // Esta línea sirve para incluir el valor «duplicateRoutineTemplate» en la lista.
    duplicateRoutineTemplate,
    // Esta línea sirve para incluir el valor «activateRoutineTemplate» en la lista.
    activateRoutineTemplate,
    // Esta línea sirve para incluir el valor «deactivateRoutineTemplate» en la lista.
    deactivateRoutineTemplate,
  // Esta línea sirve para cerrar la desestructuración con «useAdminStore()».
  } = useAdminStore();
  // Esta línea sirve para obtener «exercises» con el hook «useExerciseCatalogStore».
  const exercises = useExerciseCatalogStore((s) => s.exercises);
  // Esta línea sirve para obtener «loadExercises» con el hook «useExerciseCatalogStore».
  const loadExercises = useExerciseCatalogStore((s) => s.load);

  // Esta línea sirve para crear el estado «form» y su función «setForm».
  const [form, setForm] = useState(EMPTY_FORM);
  // Esta línea sirve para crear el estado «days» y su función «setDays».
  const [days, setDays] = useState<TemplateDayFormValues[]>([EMPTY_TEMPLATE_DAY]);
  // Esta línea sirve para crear el estado «editingId» y su función «setEditingId».
  const [editingId, setEditingId] = useState<number | null>(null);
  // Esta línea sirve para crear el estado «pickerSlot» y su función «setPickerSlot».
  const [pickerSlot, setPickerSlot] = useState<PickerSlot | null>(null);
  // Esta línea sirve para crear el estado «formError» y su función «setFormError».
  const [formError, setFormError] = useState<string | null>(null);
  // Esta línea sirve para crear el estado «isSubmitting» y su función «setIsSubmitting».
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Esta línea sirve para crear el estado «confirmingDeactivateId» y su función «setConfirmingDeactivateId».
  const [confirmingDeactivateId, setConfirmingDeactivateId] = useState<number | null>(null);
  // Esta línea sirve para crear el estado «isDeactivating» y su función «setIsDeactivating».
  const [isDeactivating, setIsDeactivating] = useState(false);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «loadRoutineTemplates».
    loadRoutineTemplates();
    // Esta línea sirve para llamar a «loadExercises».
    loadExercises();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «loadRoutineTemplates, loadExercises».
  }, [loadRoutineTemplates, loadExercises]);

  // Esta línea sirve para declarar la función «resetForm».
  function resetForm() {
    // Esta línea sirve para guardar en el estado con «setEditingId» el valor «null)…».
    setEditingId(null);
    // Esta línea sirve para guardar en el estado con «setForm» el valor «EMPTY_FORM)…».
    setForm(EMPTY_FORM);
    // Esta línea sirve para guardar en el estado con «setDays» el valor «[EMPTY_TEMPLATE_DAY])…».
    setDays([EMPTY_TEMPLATE_DAY]);
    // Esta línea sirve para guardar en el estado con «setFormError» el valor «null)…».
    setFormError(null);
  }

  // Esta línea sirve para declarar la función «startEdit».
  function startEdit(template: AdminRoutineTemplate) {
    // Esta línea sirve para guardar en el estado con «setEditingId» el valor «template.id)…».
    setEditingId(template.id);
    // Esta línea sirve para guardar en el estado con «setForm» el valor «{…».
    setForm({
      // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «template.name ?? ''».
      name: template.name ?? '',
      // Esta línea sirve para declarar la propiedad «sex» con el valor o tipo «template.sex».
      sex: template.sex,
      // Esta línea sirve para declarar la propiedad «frequencyDays» con el valor o tipo «String(template.frequency_days)».
      frequencyDays: String(template.frequency_days),
      // Esta línea sirve para declarar la propiedad «level» con el valor o tipo «template.level as 'intermediate'».
      level: template.level as 'intermediate',
      // Esta línea sirve para declarar la propiedad «splitType» con el valor o tipo «template.split_type as 'full_body'».
      splitType: template.split_type as 'full_body',
    });
    // Esta línea sirve para guardar en el estado con «setDays» el valor «templateToDays(template))…».
    setDays(templateToDays(template));
    // Esta línea sirve para guardar en el estado con «setFormError» el valor «null)…».
    setFormError(null);
  }

  // Esta línea sirve para declarar la función «updateDay».
  function updateDay(dayIndex: number, patch: Partial<TemplateDayFormValues>) {
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
    // Esta línea sirve para definir la propiedad «field» con «default_sets' | 'default_reps' | 'rest_s…».
    field: 'default_sets' | 'default_reps' | 'rest_seconds' | 'default_rpe',
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
        // Esta línea sirve para extraer «xercisesLis» de «[...d.exercises]».
        const exercisesList = [...d.exercises];
        // Esta línea sirve para revisar si «pickerSlot.exerciseIndex === null».
        if (pickerSlot.exerciseIndex === null) {
          // Esta línea sirve para agregar el ejercicio elegido al final del día.
          exercisesList.push({ ...EMPTY_TEMPLATE_EXERCISE, exercise_id: exercise.id, exercise_name: exercise.name });
        // Esta línea sirve para ejecutar este bloque en el caso contrario.
        } else {
          // Esta línea sirve para reemplazar el ejercicio de la posición elegida.
          exercisesList[pickerSlot.exerciseIndex] = {
            // Esta línea sirve para copiar las propiedades de «exercisesList».
            ...exercisesList[pickerSlot.exerciseIndex],
            // Esta línea sirve para declarar la propiedad «exercise_id» con el valor o tipo «exercise.id».
            exercise_id: exercise.id,
            // Esta línea sirve para declarar la propiedad «exercise_name» con el valor o tipo «exercise.name».
            exercise_name: exercise.name,
          };
        }
        // Esta línea sirve para devolver «{ ...d, exercises: exercisesList }».
        return { ...d, exercises: exercisesList };
      }),
    );
    // Esta línea sirve para guardar en el estado con «setPickerSlot» el valor «null)…».
    setPickerSlot(null);
  }

  // Esta línea sirve para declarar la función «handleSave».
  async function handleSave() {
    // Esta línea sirve para extraer «ayloa» de «buildTemplatePayload(form.name, form.sex».
    const payload = buildTemplatePayload(form.name, form.sex, form.frequencyDays, form.level, form.splitType, days);
    // Esta línea sirve para revisar si «!payload».
    if (!payload) {
      // Esta línea sirve para guardar en el estado con «setFormError» el valor «'Cada día necesita un nombre y al menos un ej…».
      setFormError('Cada día necesita un nombre y al menos un ejercicio elegido.');
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }
    // Esta línea sirve para guardar en el estado con «setFormError» el valor «null)…».
    setFormError(null);
    // Esta línea sirve para guardar en el estado con «setIsSubmitting» el valor «true)…».
    setIsSubmitting(true);
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para revisar si «editingId».
      if (editingId) {
        // Esta línea sirve para esperar el resultado de «updateRoutineTemplate».
        await updateRoutineTemplate(editingId, payload);
      // Esta línea sirve para ejecutar este bloque en el caso contrario.
      } else {
        // Esta línea sirve para esperar el resultado de «createRoutineTemplate».
        await createRoutineTemplate(payload);
      }
      // Esta línea sirve para llamar a «resetForm».
      resetForm();
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el estado con «setFormError» el valor «err instanceof Error ? err.message : 'No se p…».
      setFormError(err instanceof Error ? err.message : 'No se pudo guardar la plantilla.');
    // Esta línea sirve para ejecutar siempre al terminar el bloque anterior.
    } finally {
      // Esta línea sirve para guardar en el estado con «setIsSubmitting» el valor «false)…».
      setIsSubmitting(false);
    }
  }

  // Esta línea sirve para declarar la función «handleDeactivate».
  async function handleDeactivate() {
    // Esta línea sirve para salir de la función si «confirmingDeactivateId === null».
    if (confirmingDeactivateId === null) return;
    // Esta línea sirve para guardar en el estado con «setIsDeactivating» el valor «true)…».
    setIsDeactivating(true);
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «deactivateRoutineTemplate».
      await deactivateRoutineTemplate(confirmingDeactivateId);
      // Esta línea sirve para guardar en el estado con «setConfirmingDeactivateId» el valor «null)…».
      setConfirmingDeactivateId(null);
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el estado con «setFormError» el valor «err instanceof Error ? err.message : 'No se p…».
      setFormError(err instanceof Error ? err.message : 'No se pudo desactivar.');
      // Esta línea sirve para guardar en el estado con «setConfirmingDeactivateId» el valor «null)…».
      setConfirmingDeactivateId(null);
    // Esta línea sirve para ejecutar siempre al terminar el bloque anterior.
    } finally {
      // Esta línea sirve para guardar en el estado con «setIsDeactivating» el valor «false)…».
      setIsDeactivating(false);
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
          <BackButton label="Panel admin" fallbackHref="/admin" />
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="title" style={styles.pageTitle}>
            {/* Esta línea sirve para mostrar el texto «Rutinas generales». */}
            Rutinas generales
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary">
            {/* Esta línea sirve para explicar que son las plantillas que el motor asigna automáticamente. */}
            Plantillas que el motor asigna automáticamente según sexo, frecuencia y nivel elegidos en el onboarding.
            Editar una no toca el historial de entrenamientos ya hechos por nadie.
          </ThemedText>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.card}>
            {/* Esta línea sirve para mostrar el valor «editingId ? 'Editar plantilla' : 'Nueva plantilla'» dentro de «ThemedText». */}
            <ThemedText type="smallBold">{editingId ? 'Editar plantilla' : 'Nueva plantilla'}</ThemedText>
            {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
            <TextField
              // Esta línea sirve para definir el atributo «label» con el valor «Nombre (opcional)».
              label="Nombre (opcional)"
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.name}».
              value={form.name}
              // Esta línea sirve para asignar el manejador del evento «onChangeText».
              onChangeText={(name) => setForm({ ...form, name })}
            />

            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el texto «Sexo». */}
              Sexo
            </ThemedText>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.optionRow}>
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView style={{ flex: 1, backgroundColor: 'transparent' }}>
                {/* Esta línea sirve para mostrar el componente «OptionCard». */}
                <OptionCard label="Hombre" selected={form.sex === 'male'} onPress={() => setForm({ ...form, sex: 'male' })} />
              </ThemedView>
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView style={{ flex: 1, backgroundColor: 'transparent' }}>
                {/* Esta línea sirve para abrir el elemento «OptionCard» con sus atributos en varias líneas. */}
                <OptionCard
                  // Esta línea sirve para definir el atributo «label» con el valor «Mujer».
                  label="Mujer"
                  // Esta línea sirve para pasar la propiedad «selected» con el valor «form.sex === 'female'}».
                  selected={form.sex === 'female'}
                  // Esta línea sirve para asignar el manejador del evento «onPress».
                  onPress={() => setForm({ ...form, sex: 'female' })}
                />
              </ThemedView>
            </ThemedView>

            {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
            <TextField
              // Esta línea sirve para definir el atributo «label» con el valor «Días por semana».
              label="Días por semana"
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.frequencyDays}».
              value={form.frequencyDays}
              // Esta línea sirve para asignar el manejador del evento «onChangeText».
              onChangeText={(frequencyDays) => setForm({ ...form, frequencyDays })}
              // Esta línea sirve para definir el atributo «keyboardType» con el valor «number-pad».
              keyboardType="number-pad"
            />

            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el texto «Nivel». */}
              Nivel
            </ThemedText>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.optionRow}>
              {/* Esta línea sirve para recorrer «LEVEL_OPTIONS» y mostrar un bloque por elemento. */}
              {LEVEL_OPTIONS.map((opt) => (
                // Esta línea sirve para abrir el componente «ThemedView».
                <ThemedView key={opt.value} style={{ flex: 1, backgroundColor: 'transparent' }}>
                  {/* Esta línea sirve para abrir el elemento «OptionCard» con sus atributos en varias líneas. */}
                  <OptionCard
                    // Esta línea sirve para pasar la propiedad «label» con el valor «opt.label}».
                    label={opt.label}
                    // Esta línea sirve para pasar la propiedad «selected» con el valor «form.level === opt.value}».
                    selected={form.level === opt.value}
                    // Esta línea sirve para asignar el manejador del evento «onPress».
                    onPress={() => setForm({ ...form, level: opt.value as 'intermediate' })}
                  />
                </ThemedView>
              ))}
            </ThemedView>

            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary">
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
                  // Esta línea sirve para pasar la propiedad «selected» con el valor «form.splitType === opt.value}».
                  selected={form.splitType === opt.value}
                  // Esta línea sirve para asignar el manejador del evento «onPress».
                  onPress={() => setForm({ ...form, splitType: opt.value as 'full_body' })}
                />
              ))}
            </ThemedView>

            {/* Esta línea sirve para recorrer «days» y mostrar un bloque por elemento. */}
            {days.map((day, dayIndex) => (
              // Esta línea sirve para abrir el elemento «RoutineTemplateDayEditor» con sus atributos en varias líneas.
              <RoutineTemplateDayEditor
                // Esta línea sirve para identificar el elemento de la lista con «dayIndex}».
                key={dayIndex}
                // Esta línea sirve para pasar la propiedad «day» con el valor «day}».
                day={day}
                // Esta línea sirve para pasar la propiedad «canRemove» con el valor «days.length > 1}».
                canRemove={days.length > 1}
                // Esta línea sirve para asignar el manejador del evento «onChangeLabel».
                onChangeLabel={(v) => updateDay(dayIndex, { label: v })}
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
              onPress={() => setDays((prev) => [...prev, EMPTY_TEMPLATE_DAY])}
            />

            {/* Esta línea sirve para mostrar el bloque solo si «formError». */}
            {formError && (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="small" style={styles.error}>
                {/* Esta línea sirve para mostrar el valor «formError». */}
                {formError}
              </ThemedText>
            )}

            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.actionsRow}>
              {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
              <PrimaryButton
                // Esta línea sirve para pasar la propiedad «label» con el valor «editingId ? 'Guardar cambios' : 'Crear (queda».
                label={editingId ? 'Guardar cambios' : 'Crear (queda inactiva)'}
                // Esta línea sirve para pasar la propiedad «loading» con el valor «isSubmitting}».
                loading={isSubmitting}
                // Esta línea sirve para asignar el manejador del evento «onPress».
                onPress={handleSave}
              />
              {/* Esta línea sirve para mostrar el elemento solo si «editingId». */}
              {editingId && <PrimaryButton label="Cancelar" variant="ghost" onPress={resetForm} />}
            </ThemedView>
          </ThemedView>

          {/* Esta línea sirve para mostrar el bloque solo si «isLoadingRoutineTemplates». */}
          {isLoadingRoutineTemplates && (
            // Esta línea sirve para abrir el componente «Skeleton».
            <Skeleton height={56} borderRadius={Spacing.three} />
          )}

          {/* Esta línea sirve para recorrer «routineTemplates» y mostrar un bloque por elemento. */}
          {routineTemplates.map((template) => (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView key={template.id} type="backgroundElement" style={styles.templateCard}>
              {/* Esta línea sirve para abrir el componente «Pressable» con sus propiedades. */}
              <Pressable onPress={() => startEdit(template)}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small">
                  {/* Esta línea sirve para mostrar el nombre, el sexo y el estado de la plantilla. */}
                  {template.name ?? `Plantilla #${template.id}`} · {template.sex === 'male' ? 'Hombre' : 'Mujer'} ·{' '}
                  {/* Esta línea sirve para mostrar la frecuencia y el nivel de la plantilla. */}
                  {template.frequency_days} días · {LEVEL_LABELS[template.level]}
                </ThemedText>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar el contenido dinámico «{template.is_active ? '● Activa' : '○ Inactiva'}». */}
                  {template.is_active ? '● Activa' : '○ Inactiva'}
                </ThemedText>
              </Pressable>
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView style={styles.templateActionsRow}>
                {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
                <PrimaryButton label="Editar" variant="ghost" onPress={() => startEdit(template)} />
                {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
                <PrimaryButton label="Duplicar" variant="ghost" onPress={() => duplicateRoutineTemplate(template.id)} />
                {/* Esta línea sirve para elegir entre dos bloques según «template.is_active». */}
                {template.is_active ? (
                  // Esta línea sirve para mostrar el componente «PrimaryButton».
                  <PrimaryButton label="Desactivar" variant="ghost" onPress={() => setConfirmingDeactivateId(template.id)} />
                // Esta línea sirve para mostrar el bloque alternativo.
                ) : (
                  // Esta línea sirve para mostrar el componente «PrimaryButton».
                  <PrimaryButton label="Activar" onPress={() => activateRoutineTemplate(template.id)} />
                )}
              </ThemedView>
            </ThemedView>
          ))}
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

      {/* Esta línea sirve para abrir el elemento «ConfirmDialog» con sus atributos en varias líneas. */}
      <ConfirmDialog
        // Esta línea sirve para pasar la propiedad «visible» con el valor «confirmingDeactivateId !== null}».
        visible={confirmingDeactivateId !== null}
        // Esta línea sirve para definir el atributo «title» con el valor «¿Desactivar esta plantilla?».
        title="¿Desactivar esta plantilla?"
        // Esta línea sirve para definir el atributo «description».
        description="Deja de asignarse a usuarios nuevos. Si es la única activa para ese sexo y frecuencia, el servidor va a rechazar la desactivación."
        // Esta línea sirve para definir el atributo «confirmLabel» con el valor «Sí, desactivar».
        confirmLabel="Sí, desactivar"
        // Esta línea sirve para pasar la propiedad «isLoading» con el valor «isDeactivating}».
        isLoading={isDeactivating}
        // Esta línea sirve para asignar el manejador del evento «onConfirm».
        onConfirm={handleDeactivate}
        // Esta línea sirve para asignar el manejador del evento «onCancel».
        onCancel={() => setConfirmingDeactivateId(null)}
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
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «pageTitle» con el valor o tipo «{ fontSize: 24, lineHeight: 30 }».
  pageTitle: { fontSize: 24, lineHeight: 30 },
  // Esta línea sirve para definir el estilo «card» con «borderRadius: Spacing.four, padding: Spacing.three…».
  card: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.two },
  // Esta línea sirve para definir el estilo «optionRow» con «flexDirection: 'row', gap: Spacing.two, background…».
  optionRow: { flexDirection: 'row', gap: Spacing.two, backgroundColor: 'transparent' },
  // Esta línea sirve para definir el estilo «optionList» con «gap: Spacing.two, backgroundColor: 'transparent' }…».
  optionList: { gap: Spacing.two, backgroundColor: 'transparent' },
  // Esta línea sirve para definir el estilo «actionsRow» con «flexDirection: 'row', gap: Spacing.two, marginTop:…».
  actionsRow: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.two, backgroundColor: 'transparent' },
  // Esta línea sirve para definir el estilo «templateCard» con «borderRadius: Spacing.three, padding: Spacing.thre…».
  templateCard: { borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.two },
  // Esta línea sirve para definir el estilo «templateActionsRow» con «flexDirection: 'row', flexWrap: 'wrap', gap: Spaci…».
  templateActionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, backgroundColor: 'transparent' },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
});
