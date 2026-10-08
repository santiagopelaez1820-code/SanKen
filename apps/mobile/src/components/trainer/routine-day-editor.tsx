// Esta línea sirve para importar «Pressable, StyleSheet» desde «react-native».
import { Pressable, StyleSheet } from 'react-native';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «TextField» desde «@/components/ui/text-field».
import { TextField } from '@/components/ui/text-field';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar los tipos «DayFormValues, ExerciseFormValues» desde «./routine-editor-types».
import type { DayFormValues, ExerciseFormValues } from './routine-editor-types';

// Esta línea sirve para declarar los campos numéricos de un ejercicio.
type ExerciseNumericField = 'target_sets' | 'target_reps' | 'rest_seconds' | 'target_rpe';

// Esta línea sirve para declarar la interfaz «RoutineDayEditorProps».
interface RoutineDayEditorProps {
  // Esta línea sirve para declarar la propiedad «day» con el valor o tipo «DayFormValues».
  day: DayFormValues;
  // Esta línea sirve para declarar la propiedad «canRemove» con el valor o tipo «boolean».
  canRemove: boolean;
  // Esta línea sirve para declarar la propiedad «onChangeLabel» con el valor o tipo «(value: string) => void».
  onChangeLabel: (value: string) => void;
  // Esta línea sirve para declarar la propiedad «onChangeMuscleGroups» con el valor o tipo «(value: string) => void».
  onChangeMuscleGroups: (value: string) => void;
  // Esta línea sirve para declarar la propiedad «onRemoveDay» con el valor o tipo «() => void».
  onRemoveDay: () => void;
  // Esta línea sirve para declarar la propiedad «onOpenPicker» con el valor o tipo «(exerciseIndex: number | null) => void».
  onOpenPicker: (exerciseIndex: number | null) => void;
  // Esta línea sirve para declarar la propiedad «onRemoveExercise» con el valor o tipo «(exerciseIndex: number) => void».
  onRemoveExercise: (exerciseIndex: number) => void;
  // Esta línea sirve para definir «onChangeExerciseField» con «(exerciseIndex: number, field: ExerciseN…».
  onChangeExerciseField: (exerciseIndex: number, field: ExerciseNumericField, value: string) => void;
}

// Esta línea sirve para declarar la función «RoutineDayEditor».
export function RoutineDayEditor({
  // Esta línea sirve para incluir el valor «day» en la lista.
  day,
  // Esta línea sirve para incluir el valor «canRemove» en la lista.
  canRemove,
  // Esta línea sirve para incluir el valor «onChangeLabel» en la lista.
  onChangeLabel,
  // Esta línea sirve para incluir el valor «onChangeMuscleGroups» en la lista.
  onChangeMuscleGroups,
  // Esta línea sirve para incluir el valor «onRemoveDay» en la lista.
  onRemoveDay,
  // Esta línea sirve para incluir el valor «onOpenPicker» en la lista.
  onOpenPicker,
  // Esta línea sirve para incluir el valor «onRemoveExercise» en la lista.
  onRemoveExercise,
  // Esta línea sirve para incluir el valor «onChangeExerciseField» en la lista.
  onChangeExerciseField,
// Esta línea sirve para cerrar los parámetros con el tipo «RoutineDayEditorProps» y abrir el cuerpo.
}: RoutineDayEditorProps) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView type="backgroundElement" style={styles.card}>
      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView style={styles.headerRow}>
        {/* Esta línea sirve para abrir el componente «ThemedView». */}
        <ThemedView style={{ flex: 1, backgroundColor: 'transparent' }}>
          {/* Esta línea sirve para abrir el componente «TextField». */}
          <TextField label="Nombre del día" value={day.label} onChangeText={onChangeLabel} placeholder="Ej. Push" />
        </ThemedView>
        {/* Esta línea sirve para mostrar el bloque solo si «canRemove». */}
        {canRemove && (
          // Esta línea sirve para abrir el componente «ThemedText».
          <ThemedText type="small" style={styles.removeLink} onPress={onRemoveDay}>
            {/* Esta línea sirve para mostrar el texto «Quitar día». */}
            Quitar día
          </ThemedText>
        )}
      </ThemedView>

      {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
      <TextField
        // Esta línea sirve para definir el atributo «label» con el valor «Grupos musculares (separados por coma)».
        label="Grupos musculares (separados por coma)"
        // Esta línea sirve para pasar la propiedad «value» con el valor «day.target_muscle_groups}».
        value={day.target_muscle_groups}
        // Esta línea sirve para asignar el manejador del evento «onChangeText».
        onChangeText={onChangeMuscleGroups}
        // Esta línea sirve para definir el atributo «placeholder» con el valor «chest, back».
        placeholder="chest, back"
        // Esta línea sirve para definir el atributo «autoCapitalize» con el valor «none».
        autoCapitalize="none"
      />

      {/* Esta línea sirve para recorrer «day.exercises» y mostrar un bloque por elemento. */}
      {day.exercises.map((exercise: ExerciseFormValues, exerciseIndex) => (
        // Esta línea sirve para abrir el componente «ThemedView».
        <ThemedView key={exerciseIndex} type="background" style={styles.exerciseRow}>
          {/* Esta línea sirve para abrir el componente «Pressable» con sus propiedades. */}
          <Pressable onPress={() => onOpenPicker(exerciseIndex)}>
            {/* Esta línea sirve para mostrar el valor «exercise.exercise_name || 'Elegir ejercicio…'» dentro de «ThemedText». */}
            <ThemedText type="smallBold">{exercise.exercise_name || 'Elegir ejercicio…'}</ThemedText>
          </Pressable>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={styles.fieldsRow}>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.fieldThird}>
              {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
              <TextField
                // Esta línea sirve para definir el atributo «label» con el valor «Series».
                label="Series"
                // Esta línea sirve para pasar la propiedad «value» con el valor «exercise.target_sets}».
                value={exercise.target_sets}
                // Esta línea sirve para asignar el manejador del evento «onChangeText».
                onChangeText={(v) => onChangeExerciseField(exerciseIndex, 'target_sets', v)}
                // Esta línea sirve para definir el atributo «keyboardType» con el valor «number-pad».
                keyboardType="number-pad"
              />
            </ThemedView>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.fieldThird}>
              {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
              <TextField
                // Esta línea sirve para definir el atributo «label» con el valor «Reps».
                label="Reps"
                // Esta línea sirve para pasar la propiedad «value» con el valor «exercise.target_reps}».
                value={exercise.target_reps}
                // Esta línea sirve para asignar el manejador del evento «onChangeText».
                onChangeText={(v) => onChangeExerciseField(exerciseIndex, 'target_reps', v)}
                // Esta línea sirve para definir el atributo «placeholder» con el valor «8-12».
                placeholder="8-12"
              />
            </ThemedView>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.fieldThird}>
              {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
              <TextField
                // Esta línea sirve para definir el atributo «label» con el valor «Descanso (s)».
                label="Descanso (s)"
                // Esta línea sirve para pasar la propiedad «value» con el valor «exercise.rest_seconds}».
                value={exercise.rest_seconds}
                // Esta línea sirve para asignar el manejador del evento «onChangeText».
                onChangeText={(v) => onChangeExerciseField(exerciseIndex, 'rest_seconds', v)}
                // Esta línea sirve para definir el atributo «keyboardType» con el valor «number-pad».
                keyboardType="number-pad"
              />
            </ThemedView>
          </ThemedView>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={styles.fieldsRow}>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.fieldThird}>
              {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
              <TextField
                // Esta línea sirve para definir el atributo «label» con el valor «RPE (opcional)».
                label="RPE (opcional)"
                // Esta línea sirve para pasar la propiedad «value» con el valor «exercise.target_rpe}».
                value={exercise.target_rpe}
                // Esta línea sirve para asignar el manejador del evento «onChangeText».
                onChangeText={(v) => onChangeExerciseField(exerciseIndex, 'target_rpe', v)}
                // Esta línea sirve para definir el atributo «keyboardType» con el valor «decimal-pad».
                keyboardType="decimal-pad"
              />
            </ThemedView>
            {/* Esta línea sirve para abrir el componente «ThemedText» con sus propiedades. */}
            <ThemedText type="small" style={styles.removeLink} onPress={() => onRemoveExercise(exerciseIndex)}>
              {/* Esta línea sirve para mostrar el texto «Quitar ejercicio». */}
              Quitar ejercicio
            </ThemedText>
          </ThemedView>
        </ThemedView>
      ))}

      {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
      <PrimaryButton label="+ Agregar ejercicio" variant="ghost" onPress={() => onOpenPicker(null)} />
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «card» con el valor o tipo «{».
  card: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «marginTop» con el valor o tipo «Spacing.two».
    marginTop: Spacing.two,
  },
  // Esta línea sirve para definir el estilo «headerRow» con «flexDirection: 'row', alignItems: 'flex-end', gap:…».
  headerRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.two, backgroundColor: 'transparent' },
  // Esta línea sirve para declarar la propiedad «removeLink» con el valor o tipo «{ color: '#FF4D5E' }».
  removeLink: { color: '#FF4D5E' },
  // Esta línea sirve para declarar la propiedad «exerciseRow» con el valor o tipo «{».
  exerciseRow: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.two».
    padding: Spacing.two,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para definir el estilo «fieldsRow» con «flexDirection: 'row', alignItems: 'flex-end', gap:…».
  fieldsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.two, backgroundColor: 'transparent' },
  // Esta línea sirve para declarar la propiedad «fieldThird» con el valor o tipo «{ flex: 1, backgroundColor: 'transparent' }».
  fieldThird: { flex: 1, backgroundColor: 'transparent' },
});
