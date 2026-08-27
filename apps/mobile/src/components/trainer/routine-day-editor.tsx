import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import type { DayFormValues, ExerciseFormValues } from './routine-editor-types';

type ExerciseNumericField = 'target_sets' | 'target_reps' | 'rest_seconds' | 'target_rpe';

interface RoutineDayEditorProps {
  day: DayFormValues;
  canRemove: boolean;
  onChangeLabel: (value: string) => void;
  onChangeMuscleGroups: (value: string) => void;
  onRemoveDay: () => void;
  onOpenPicker: (exerciseIndex: number | null) => void;
  onRemoveExercise: (exerciseIndex: number) => void;
  onChangeExerciseField: (exerciseIndex: number, field: ExerciseNumericField, value: string) => void;
}

export function RoutineDayEditor({
  day,
  canRemove,
  onChangeLabel,
  onChangeMuscleGroups,
  onRemoveDay,
  onOpenPicker,
  onRemoveExercise,
  onChangeExerciseField,
}: RoutineDayEditorProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedView style={styles.headerRow}>
        <ThemedView style={{ flex: 1, backgroundColor: 'transparent' }}>
          <TextField label="Nombre del día" value={day.label} onChangeText={onChangeLabel} placeholder="Ej. Push" />
        </ThemedView>
        {canRemove && (
          <ThemedText type="small" style={styles.removeLink} onPress={onRemoveDay}>
            Quitar día
          </ThemedText>
        )}
      </ThemedView>

      <TextField
        label="Grupos musculares (separados por coma)"
        value={day.target_muscle_groups}
        onChangeText={onChangeMuscleGroups}
        placeholder="chest, back"
        autoCapitalize="none"
      />

      {day.exercises.map((exercise: ExerciseFormValues, exerciseIndex) => (
        <ThemedView key={exerciseIndex} type="background" style={styles.exerciseRow}>
          <Pressable onPress={() => onOpenPicker(exerciseIndex)}>
            <ThemedText type="smallBold">{exercise.exercise_name || 'Elegir ejercicio…'}</ThemedText>
          </Pressable>

          <ThemedView style={styles.fieldsRow}>
            <ThemedView style={styles.fieldThird}>
              <TextField
                label="Series"
                value={exercise.target_sets}
                onChangeText={(v) => onChangeExerciseField(exerciseIndex, 'target_sets', v)}
                keyboardType="number-pad"
              />
            </ThemedView>
            <ThemedView style={styles.fieldThird}>
              <TextField
                label="Reps"
                value={exercise.target_reps}
                onChangeText={(v) => onChangeExerciseField(exerciseIndex, 'target_reps', v)}
                placeholder="8-12"
              />
            </ThemedView>
            <ThemedView style={styles.fieldThird}>
              <TextField
                label="Descanso (s)"
                value={exercise.rest_seconds}
                onChangeText={(v) => onChangeExerciseField(exerciseIndex, 'rest_seconds', v)}
                keyboardType="number-pad"
              />
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.fieldsRow}>
            <ThemedView style={styles.fieldThird}>
              <TextField
                label="RPE (opcional)"
                value={exercise.target_rpe}
                onChangeText={(v) => onChangeExerciseField(exerciseIndex, 'target_rpe', v)}
                keyboardType="decimal-pad"
              />
            </ThemedView>
            <ThemedText type="small" style={styles.removeLink} onPress={() => onRemoveExercise(exerciseIndex)}>
              Quitar ejercicio
            </ThemedText>
          </ThemedView>
        </ThemedView>
      ))}

      <PrimaryButton label="+ Agregar ejercicio" variant="ghost" onPress={() => onOpenPicker(null)} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.two, backgroundColor: 'transparent' },
  removeLink: { color: '#FF4D5E' },
  exerciseRow: {
    borderRadius: Spacing.three,
    padding: Spacing.two,
    gap: Spacing.two,
  },
  fieldsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.two, backgroundColor: 'transparent' },
  fieldThird: { flex: 1, backgroundColor: 'transparent' },
});
