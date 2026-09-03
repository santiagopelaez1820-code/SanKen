import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { AdminRoutineTemplate, ExerciseCatalogItem } from '@sanken/core';

import { RoutineTemplateDayEditor } from '@/components/admin/routine-template-day-editor';
import {
  buildTemplatePayload,
  EMPTY_TEMPLATE_DAY,
  EMPTY_TEMPLATE_EXERCISE,
  SPLIT_OPTIONS,
  templateToDays,
  type TemplateDayFormValues,
} from '@/components/admin/routine-template-form-types';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ListPickerModal } from '@/components/ui/list-picker-modal';
import { OptionCard } from '@/components/ui/option-card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAdminStore } from '@/store/admin-store';
import { useExerciseCatalogStore } from '@/store/exercise-catalog-store';
import { Skeleton } from '@/components/ui/skeleton';

const EMPTY_FORM = { name: '', sex: 'male' as 'male' | 'female', frequencyDays: '3', splitType: 'full_body' as const };

interface PickerSlot {
  dayIndex: number;
  exerciseIndex: number | null;
}

export default function AdminRutinasScreen() {
  const {
    routineTemplates,
    isLoadingRoutineTemplates,
    loadRoutineTemplates,
    createRoutineTemplate,
    updateRoutineTemplate,
    duplicateRoutineTemplate,
    activateRoutineTemplate,
    deactivateRoutineTemplate,
  } = useAdminStore();
  const exercises = useExerciseCatalogStore((s) => s.exercises);
  const loadExercises = useExerciseCatalogStore((s) => s.load);

  const [form, setForm] = useState(EMPTY_FORM);
  const [days, setDays] = useState<TemplateDayFormValues[]>([EMPTY_TEMPLATE_DAY]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pickerSlot, setPickerSlot] = useState<PickerSlot | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmingDeactivateId, setConfirmingDeactivateId] = useState<number | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  useEffect(() => {
    loadRoutineTemplates();
    loadExercises();
  }, [loadRoutineTemplates, loadExercises]);

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDays([EMPTY_TEMPLATE_DAY]);
    setFormError(null);
  }

  function startEdit(template: AdminRoutineTemplate) {
    setEditingId(template.id);
    setForm({
      name: template.name ?? '',
      sex: template.sex,
      frequencyDays: String(template.frequency_days),
      splitType: template.split_type as 'full_body',
    });
    setDays(templateToDays(template));
    setFormError(null);
  }

  function updateDay(dayIndex: number, patch: Partial<TemplateDayFormValues>) {
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
    field: 'default_sets' | 'default_reps' | 'rest_seconds' | 'default_rpe',
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
        const exercisesList = [...d.exercises];
        if (pickerSlot.exerciseIndex === null) {
          exercisesList.push({ ...EMPTY_TEMPLATE_EXERCISE, exercise_id: exercise.id, exercise_name: exercise.name });
        } else {
          exercisesList[pickerSlot.exerciseIndex] = {
            ...exercisesList[pickerSlot.exerciseIndex],
            exercise_id: exercise.id,
            exercise_name: exercise.name,
          };
        }
        return { ...d, exercises: exercisesList };
      }),
    );
    setPickerSlot(null);
  }

  async function handleSave() {
    const payload = buildTemplatePayload(form.name, form.sex, form.frequencyDays, form.splitType, days);
    if (!payload) {
      setFormError('Cada día necesita un nombre y al menos un ejercicio elegido.');
      return;
    }
    setFormError(null);
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateRoutineTemplate(editingId, payload);
      } else {
        await createRoutineTemplate(payload);
      }
      resetForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'No se pudo guardar la plantilla.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeactivate() {
    if (confirmingDeactivateId === null) return;
    setIsDeactivating(true);
    try {
      await deactivateRoutineTemplate(confirmingDeactivateId);
      setConfirmingDeactivateId(null);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'No se pudo desactivar.');
      setConfirmingDeactivateId(null);
    } finally {
      setIsDeactivating(false);
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
            Rutinas generales
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Plantillas que el motor asigna automáticamente según sexo y frecuencia elegida en el onboarding. Editar
            una no toca el historial de entrenamientos ya hechos por nadie.
          </ThemedText>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="smallBold">{editingId ? 'Editar plantilla' : 'Nueva plantilla'}</ThemedText>
            <TextField
              label="Nombre (opcional)"
              value={form.name}
              onChangeText={(name) => setForm({ ...form, name })}
            />

            <ThemedText type="small" themeColor="textSecondary">
              Sexo
            </ThemedText>
            <ThemedView style={styles.optionRow}>
              <ThemedView style={{ flex: 1, backgroundColor: 'transparent' }}>
                <OptionCard label="Hombre" selected={form.sex === 'male'} onPress={() => setForm({ ...form, sex: 'male' })} />
              </ThemedView>
              <ThemedView style={{ flex: 1, backgroundColor: 'transparent' }}>
                <OptionCard
                  label="Mujer"
                  selected={form.sex === 'female'}
                  onPress={() => setForm({ ...form, sex: 'female' })}
                />
              </ThemedView>
            </ThemedView>

            <TextField
              label="Días por semana"
              value={form.frequencyDays}
              onChangeText={(frequencyDays) => setForm({ ...form, frequencyDays })}
              keyboardType="number-pad"
            />

            <ThemedText type="small" themeColor="textSecondary">
              Split
            </ThemedText>
            <ThemedView style={styles.optionList}>
              {SPLIT_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  selected={form.splitType === opt.value}
                  onPress={() => setForm({ ...form, splitType: opt.value as 'full_body' })}
                />
              ))}
            </ThemedView>

            {days.map((day, dayIndex) => (
              <RoutineTemplateDayEditor
                key={dayIndex}
                day={day}
                canRemove={days.length > 1}
                onChangeLabel={(v) => updateDay(dayIndex, { label: v })}
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
              onPress={() => setDays((prev) => [...prev, EMPTY_TEMPLATE_DAY])}
            />

            {formError && (
              <ThemedText type="small" style={styles.error}>
                {formError}
              </ThemedText>
            )}

            <ThemedView style={styles.actionsRow}>
              <PrimaryButton
                label={editingId ? 'Guardar cambios' : 'Crear (queda inactiva)'}
                loading={isSubmitting}
                onPress={handleSave}
              />
              {editingId && <PrimaryButton label="Cancelar" variant="ghost" onPress={resetForm} />}
            </ThemedView>
          </ThemedView>

          {isLoadingRoutineTemplates && (
            <Skeleton height={56} borderRadius={Spacing.three} />
          )}

          {routineTemplates.map((template) => (
            <ThemedView key={template.id} type="backgroundElement" style={styles.templateCard}>
              <Pressable onPress={() => startEdit(template)}>
                <ThemedText type="small">
                  {template.name ?? `Plantilla #${template.id}`} · {template.sex === 'male' ? 'Hombre' : 'Mujer'} ·{' '}
                  {template.frequency_days} días
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {template.is_active ? '● Activa' : '○ Inactiva'}
                </ThemedText>
              </Pressable>
              <ThemedView style={styles.templateActionsRow}>
                <PrimaryButton label="Editar" variant="ghost" onPress={() => startEdit(template)} />
                <PrimaryButton label="Duplicar" variant="ghost" onPress={() => duplicateRoutineTemplate(template.id)} />
                {template.is_active ? (
                  <PrimaryButton label="Desactivar" variant="ghost" onPress={() => setConfirmingDeactivateId(template.id)} />
                ) : (
                  <PrimaryButton label="Activar" onPress={() => activateRoutineTemplate(template.id)} />
                )}
              </ThemedView>
            </ThemedView>
          ))}
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

      <ConfirmDialog
        visible={confirmingDeactivateId !== null}
        title="¿Desactivar esta plantilla?"
        description="Deja de asignarse a usuarios nuevos. Si es la única activa para ese sexo y frecuencia, el servidor va a rechazar la desactivación."
        confirmLabel="Sí, desactivar"
        isLoading={isDeactivating}
        onConfirm={handleDeactivate}
        onCancel={() => setConfirmingDeactivateId(null)}
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
    gap: Spacing.three,
  },
  pageTitle: { fontSize: 28, lineHeight: 34 },
  card: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.two },
  optionRow: { flexDirection: 'row', gap: Spacing.two, backgroundColor: 'transparent' },
  optionList: { gap: Spacing.two, backgroundColor: 'transparent' },
  actionsRow: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.two, backgroundColor: 'transparent' },
  templateCard: { borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.two },
  templateActionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, backgroundColor: 'transparent' },
  error: { color: '#FF4D5E' },
});
