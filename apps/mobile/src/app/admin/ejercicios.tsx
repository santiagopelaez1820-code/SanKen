// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar todo el módulo como «DocumentPicker» desde «expo-document-picker».
import * as DocumentPicker from 'expo-document-picker';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «Pressable, ScrollView, StyleSheet, TextInput, View» desde «react-native».
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar los tipos «AdminExercise» desde «@sanken/core».
import type { AdminExercise } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «ConfirmDialog» desde «@/components/ui/confirm-dialog».
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
// Esta línea sirve para importar «ListPickerModal» desde «@/components/ui/list-picker-modal».
import { ListPickerModal } from '@/components/ui/list-picker-modal';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useAdminStore» desde «@/store/admin-store».
import { useAdminStore } from '@/store/admin-store';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';

// Esta línea sirve para declarar «EQUIPMENT_OPTIONS» con el valor «[».
const EQUIPMENT_OPTIONS = [
  // Esta línea sirve para incluir el texto o las clases «barbell…».
  'barbell', 'dumbbells', 'bench', 'squat_rack', 'pull_up_bar',
  // Esta línea sirve para incluir el texto o las clases «cables…».
  'cables', 'machines', 'kettlebells', 'resistance_bands', 'bodyweight_only',
];
// Esta línea sirve para declarar «LEVEL_OPTIONS» con el valor «['beginner', 'intermediate', 'advanced']».
const LEVEL_OPTIONS = ['beginner', 'intermediate', 'advanced'];
// Esta línea sirve para declarar «TYPE_OPTIONS» con el valor «['compound', 'isolation', 'cardio', 'mobility']».
const TYPE_OPTIONS = ['compound', 'isolation', 'cardio', 'mobility'];

// Esta línea sirve para declarar la función «ChipRow».
function ChipRow({
  // Esta línea sirve para incluir el valor «options» en la lista.
  options,
  // Esta línea sirve para incluir el valor «value» en la lista.
  value,
  // Esta línea sirve para incluir el valor «onChange» en la lista.
  onChange,
// Esta línea sirve para cerrar la desestructuración y abrir los tipos.
}: {
  // Esta línea sirve para declarar la propiedad «options» con el valor o tipo «string[]».
  options: string[];
  // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «string».
  value: string;
  // Esta línea sirve para declarar la propiedad «onChange» con el valor o tipo «(value: string) => void».
  onChange: (value: string) => void;
// Esta línea sirve para cerrar los parámetros y abrir el cuerpo.
}) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «View».
    <View style={styles.chipRow}>
      {/* Esta línea sirve para recorrer «options» y calcular qué mostrar por elemento. */}
      {options.map((option) => {
        // Esta línea sirve para extraer «electe» de «option === value».
        const selected = option === value;
        // Esta línea sirve para devolver la interfaz del componente.
        return (
          // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
          <Pressable
            // Esta línea sirve para identificar el elemento de la lista con «option}».
            key={option}
            // Esta línea sirve para asignar el manejador del evento «onPress».
            onPress={() => onChange(option)}
            // Esta línea sirve para pasar la propiedad «style» con el valor «[».
            style={[
              // Esta línea sirve para agregar el estilo «styles.chip».
              styles.chip,
              // Esta línea sirve para agregar un elemento cuyo «borderColor» es «theme.backgroundSelected },…».
              { borderColor: theme.backgroundSelected },
              // Esta línea sirve para resaltar la opción seleccionada.
              selected && { backgroundColor: theme.backgroundSelected },
            ]}>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor={selected ? 'text' : 'textSecondary'}>
              {/* Esta línea sirve para mostrar el valor «option». */}
              {option}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

// Esta línea sirve para declarar «EMPTY_FORM» con el valor «{».
const EMPTY_FORM = {
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «''».
  name: '',
  // Esta línea sirve para declarar la propiedad «primary_muscle_id» con el valor o tipo «''».
  primary_muscle_id: '',
  // Esta línea sirve para declarar la propiedad «equipment» con el valor o tipo «'barbell'».
  equipment: 'barbell',
  // Esta línea sirve para declarar la propiedad «level» con el valor o tipo «'beginner'».
  level: 'beginner',
  // Esta línea sirve para declarar la propiedad «type» con el valor o tipo «'compound'».
  type: 'compound',
  // Esta línea sirve para declarar la propiedad «instructions» con el valor o tipo «''».
  instructions: '',
  // Esta línea sirve para declarar la propiedad «alternative_exercise_id» con el valor o tipo «''».
  alternative_exercise_id: '',
};

/**
 * El admin elige el archivo desde su dispositivo (expo-document-picker) —
 * sin búsqueda automática, sin YouTube, sin APIs externas. El backend
 * garantiza el reemplazo seguro (sube y confirma antes de borrar el
 * anterior), ver AdminExerciseController::uploadVideo.
 */
// Esta línea sirve para declarar la función «ExerciseVideoRow».
function ExerciseVideoRow({ exercise }: { exercise: AdminExercise }) {
  // Esta línea sirve para obtener «uploadExerciseVideo, deleteExerciseVideo» con el hook «useAdminStore».
  const { uploadExerciseVideo, deleteExerciseVideo } = useAdminStore();
  // Esta línea sirve para crear el estado «isUploading» y su función «setIsUploading».
  const [isUploading, setIsUploading] = useState(false);
  // Esta línea sirve para crear el estado «error» y su función «setError».
  const [error, setError] = useState<string | null>(null);
  // Esta línea sirve para crear el estado «confirmingDelete» y su función «setConfirmingDelete».
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  // Esta línea sirve para crear el estado «isDeleting» y su función «setIsDeleting».
  const [isDeleting, setIsDeleting] = useState(false);

  // Esta línea sirve para extraer «andlePic» de «async () => {».
  const handlePick = async () => {
    // Esta línea sirve para guardar en el estado con «setError» el valor «null)…».
    setError(null);
    // Esta línea sirve para esperar «DocumentPicker.getDocumentAsync({ type: 'video/*' » y guardar el resultado en «result».
    const result = await DocumentPicker.getDocumentAsync({ type: 'video/*' });
    // Esta línea sirve para salir de la función si «result.canceled || !result.assets[0]».
    if (result.canceled || !result.assets[0]) return;

    // Esta línea sirve para extraer «sse» de «result.assets[0]».
    const asset = result.assets[0];
    // Esta línea sirve para guardar en el estado con «setIsUploading» el valor «true)…».
    setIsUploading(true);
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «uploadExerciseVideo».
      await uploadExerciseVideo(exercise.id, { uri: asset.uri, name: asset.name, mimeType: asset.mimeType ?? null });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el estado con «setError» el valor «err instanceof Error ? err.message : 'No se p…».
      setError(err instanceof Error ? err.message : 'No se pudo subir el video.');
    // Esta línea sirve para ejecutar siempre al terminar el bloque anterior.
    } finally {
      // Esta línea sirve para guardar en el estado con «setIsUploading» el valor «false)…».
      setIsUploading(false);
    }
  };

  // Esta línea sirve para extraer «andleDelet» de «async () => {».
  const handleDelete = async () => {
    // Esta línea sirve para guardar en el estado con «setIsDeleting» el valor «true)…».
    setIsDeleting(true);
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «deleteExerciseVideo».
      await deleteExerciseVideo(exercise.id);
      // Esta línea sirve para guardar en el estado con «setConfirmingDelete» el valor «false)…».
      setConfirmingDelete(false);
    // Esta línea sirve para ejecutar siempre al terminar el bloque anterior.
    } finally {
      // Esta línea sirve para guardar en el estado con «setIsDeleting» el valor «false)…».
      setIsDeleting(false);
    }
  };

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.videoRow}>
      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="small" themeColor="textSecondary">
        {/* Esta línea sirve para mostrar el contenido dinámico «{exercise.video_url ? '✅ Disponible' : '❌ Sin video'}». */}
        {exercise.video_url ? '✅ Disponible' : '❌ Sin video'}
      </ThemedText>
      {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
      <PrimaryButton
        // Esta línea sirve para pasar la propiedad «label» con el valor «isUploading ? 'Subiendo…' : exercise.video_ur».
        label={isUploading ? 'Subiendo…' : exercise.video_url ? 'Reemplazar' : 'Subir'}
        // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
        variant="ghost"
        // Esta línea sirve para pasar la propiedad «loading» con el valor «isUploading}».
        loading={isUploading}
        // Esta línea sirve para asignar el manejador del evento «onPress».
        onPress={handlePick}
      />
      {/* Esta línea sirve para mostrar el bloque solo si «exercise.video_url». */}
      {exercise.video_url && (
        // Esta línea sirve para mostrar el componente «PrimaryButton».
        <PrimaryButton label="Eliminar" variant="ghost" onPress={() => setConfirmingDelete(true)} />
      )}
      {/* Esta línea sirve para mostrar el bloque solo si «error». */}
      {error && (
        // Esta línea sirve para abrir el componente «ThemedText».
        <ThemedText type="small" style={styles.error}>
          {/* Esta línea sirve para mostrar el valor «error». */}
          {error}
        </ThemedText>
      )}

      {/* Esta línea sirve para abrir el elemento «ConfirmDialog» con sus atributos en varias líneas. */}
      <ConfirmDialog
        // Esta línea sirve para pasar la propiedad «visible» con el valor «confirmingDelete}».
        visible={confirmingDelete}
        // Esta línea sirve para pasar la propiedad «title» con el valor «`¿Eliminar el video de ${exercise.name}?`}».
        title={`¿Eliminar el video de ${exercise.name}?`}
        // Esta línea sirve para definir el atributo «description».
        description="El ejercicio se queda sin video pero sigue funcionando normalmente."
        // Esta línea sirve para definir el atributo «confirmLabel» con el valor «Sí, eliminar».
        confirmLabel="Sí, eliminar"
        // Esta línea sirve para pasar la propiedad «isLoading» con el valor «isDeleting}».
        isLoading={isDeleting}
        // Esta línea sirve para asignar el manejador del evento «onConfirm».
        onConfirm={handleDelete}
        // Esta línea sirve para asignar el manejador del evento «onCancel».
        onCancel={() => setConfirmingDelete(false)}
      />
    </ThemedView>
  );
}

// Esta línea sirve para declarar la función «AdminEjerciciosScreen».
export default function AdminEjerciciosScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener los ejercicios y las acciones del store de administración.
  const { exercises, muscleGroups, isLoadingExercises, loadExercises, createExercise, updateExercise, deactivateExercise } =
    // Esta línea sirve para llamar a «useAdminStore».
    useAdminStore();
  // Esta línea sirve para crear el estado «form» y su función «setForm».
  const [form, setForm] = useState(EMPTY_FORM);
  // Esta línea sirve para crear el estado «editingId» y su función «setEditingId».
  const [editingId, setEditingId] = useState<number | null>(null);
  // Esta línea sirve para crear el estado «alternativePickerVisible» y su función «setAlternativePickerVisible».
  const [alternativePickerVisible, setAlternativePickerVisible] = useState(false);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «loadExercises».
    loadExercises();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «loadExercises».
  }, [loadExercises]);

  // Esta línea sirve para extraer «tartEdi» de «(exercise: AdminExercise) => {».
  const startEdit = (exercise: AdminExercise) => {
    // Esta línea sirve para guardar en el estado con «setEditingId» el valor «exercise.id)…».
    setEditingId(exercise.id);
    // Esta línea sirve para guardar en el estado con «setForm» el valor «{…».
    setForm({
      // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «exercise.name».
      name: exercise.name,
      // Esta línea sirve para declarar la propiedad «primary_muscle_id» con el valor o tipo «String(exercise.primary_muscle_id)».
      primary_muscle_id: String(exercise.primary_muscle_id),
      // Esta línea sirve para declarar la propiedad «equipment» con el valor o tipo «exercise.equipment».
      equipment: exercise.equipment,
      // Esta línea sirve para declarar la propiedad «level» con el valor o tipo «exercise.level».
      level: exercise.level,
      // Esta línea sirve para declarar la propiedad «type» con el valor o tipo «exercise.type».
      type: exercise.type,
      // Esta línea sirve para declarar la propiedad «instructions» con el valor o tipo «exercise.instructions ?? ''».
      instructions: exercise.instructions ?? '',
      // Esta línea sirve para definir «alternative_exercise_id» con «exercise.alternatives[0] ? String(exerci…».
      alternative_exercise_id: exercise.alternatives[0] ? String(exercise.alternatives[0].id) : '',
    });
  };

  // Esta línea sirve para extraer «electedAlternativ» de «exercises.find((e) => String(e.id) === f».
  const selectedAlternative = exercises.find((e) => String(e.id) === form.alternative_exercise_id);

  // Esta línea sirve para extraer «ubmi» de «async () => {».
  const submit = async () => {
    // Esta línea sirve para extraer «ayloa» de «{».
    const payload = {
      // Esta línea sirve para copiar las propiedades de «form».
      ...form,
      // Esta línea sirve para declarar la propiedad «primary_muscle_id» con el valor o tipo «Number(form.primary_muscle_id)».
      primary_muscle_id: Number(form.primary_muscle_id),
      // Esta línea sirve para definir «alternative_exercise_id» con «form.alternative_exercise_id ? Number(fo…».
      alternative_exercise_id: form.alternative_exercise_id ? Number(form.alternative_exercise_id) : null,
    };
    // Esta línea sirve para revisar si «editingId».
    if (editingId) {
      // Esta línea sirve para esperar el resultado de «updateExercise».
      await updateExercise(editingId, payload);
    // Esta línea sirve para ejecutar este bloque en el caso contrario.
    } else {
      // Esta línea sirve para esperar el resultado de «createExercise».
      await createExercise(payload);
    }
    // Esta línea sirve para guardar en el estado con «setEditingId» el valor «null)…».
    setEditingId(null);
    // Esta línea sirve para guardar en el estado con «setForm» el valor «EMPTY_FORM)…».
    setForm(EMPTY_FORM);
  };

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «ScrollView». */}
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="title" style={styles.pageTitle}>
            {/* Esta línea sirve para mostrar el texto «Ejercicios». */}
            Ejercicios
          </ThemedText>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.card}>
            {/* Esta línea sirve para mostrar el valor «editingId ? 'Editar ejercicio' : 'Nuevo ejercicio'» dentro de «ThemedText». */}
            <ThemedText type="smallBold">{editingId ? 'Editar ejercicio' : 'Nuevo ejercicio'}</ThemedText>
            {/* Esta línea sirve para abrir el elemento «TextInput» con sus atributos en varias líneas. */}
            <TextInput
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.name}».
              value={form.name}
              // Esta línea sirve para asignar el manejador del evento «onChangeText».
              onChangeText={(name) => setForm({ ...form, name })}
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Nombre».
              placeholder="Nombre"
              // Esta línea sirve para pasar la propiedad «placeholderTextColor» con el valor «theme.textSecondary}».
              placeholderTextColor={theme.textSecondary}
              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.input, { borderColor: theme.backgroun».
              style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
            />
            {/* Esta línea sirve para abrir el elemento «ChipRow» con sus atributos en varias líneas. */}
            <ChipRow
              // Esta línea sirve para pasar la propiedad «options» con el valor «muscleGroups.map((m) => String(m.id))}».
              options={muscleGroups.map((m) => String(m.id))}
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.primary_muscle_id}».
              value={form.primary_muscle_id}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(primary_muscle_id) => setForm({ ...form, primary_muscle_id })}
            />
            {/* Esta línea sirve para mostrar el componente «ChipRow». */}
            <ChipRow options={EQUIPMENT_OPTIONS} value={form.equipment} onChange={(equipment) => setForm({ ...form, equipment })} />
            {/* Esta línea sirve para mostrar el componente «ChipRow». */}
            <ChipRow options={LEVEL_OPTIONS} value={form.level} onChange={(level) => setForm({ ...form, level })} />
            {/* Esta línea sirve para mostrar el componente «ChipRow». */}
            <ChipRow options={TYPE_OPTIONS} value={form.type} onChange={(type) => setForm({ ...form, type })} />
            {/* Esta línea sirve para abrir el elemento «TextInput» con sus atributos en varias líneas. */}
            <TextInput
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.instructions}».
              value={form.instructions}
              // Esta línea sirve para asignar el manejador del evento «onChangeText».
              onChangeText={(instructions) => setForm({ ...form, instructions })}
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Instrucciones (opcional)».
              placeholder="Instrucciones (opcional)"
              // Esta línea sirve para pasar la propiedad «placeholderTextColor» con el valor «theme.textSecondary}».
              placeholderTextColor={theme.textSecondary}
              // Esta línea sirve para activar la opción «multiline».
              multiline
              // Esta línea sirve para pasar la propiedad «numberOfLines» con el valor «3}».
              numberOfLines={3}
              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.input, styles.textarea, { borderColor».
              style={[styles.input, styles.textarea, { borderColor: theme.backgroundSelected, color: theme.text }]}
            />
            {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
            <Pressable
              // Esta línea sirve para asignar el manejador del evento «onPress».
              onPress={() => setAlternativePickerVisible(true)}
              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.input, { borderColor: theme.backgroun».
              style={[styles.input, { borderColor: theme.backgroundSelected, justifyContent: 'center' }]}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor={selectedAlternative ? 'text' : 'textSecondary'}>
                {/* Esta línea sirve para mostrar la alternativa elegida o el texto para elegir una. */}
                {selectedAlternative ? `Alternativa (A/B): ${selectedAlternative.name}` : 'Sin ejercicio alternativo (A/B)'}
              </ThemedText>
            </Pressable>
            {/* Esta línea sirve para abrir el componente «View». */}
            <View style={styles.actionsRow}>
              {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
              <PrimaryButton
                // Esta línea sirve para pasar la propiedad «label» con el valor «editingId ? 'Guardar cambios' : 'Crear'}».
                label={editingId ? 'Guardar cambios' : 'Crear'}
                // Esta línea sirve para asignar el manejador del evento «onPress».
                onPress={submit}
                // Esta línea sirve para pasar la propiedad «disabled» con el valor «!form.name || !form.primary_muscle_id}».
                disabled={!form.name || !form.primary_muscle_id}
              />
              {/* Esta línea sirve para mostrar el bloque solo si «editingId». */}
              {editingId && (
                // Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas.
                <PrimaryButton
                  // Esta línea sirve para definir el atributo «label» con el valor «Cancelar».
                  label="Cancelar"
                  // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
                  variant="ghost"
                  // Esta línea sirve para asignar el manejador del evento «onPress».
                  onPress={() => {
                    // Esta línea sirve para guardar en el estado con «setEditingId» el valor «null)…».
                    setEditingId(null);
                    // Esta línea sirve para guardar en el estado con «setForm» el valor «EMPTY_FORM)…».
                    setForm(EMPTY_FORM);
                  }}
                />
              )}
            </View>
          </ThemedView>

          {/* Esta línea sirve para mostrar el bloque solo si «isLoadingExercises». */}
          {isLoadingExercises && (
            // Esta línea sirve para abrir el componente «Skeleton».
            <Skeleton height={56} borderRadius={Spacing.three} />
          )}

          {/* Esta línea sirve para recorrer «exercises» y mostrar un bloque por elemento. */}
          {exercises.map((exercise) => (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView key={exercise.id} type="backgroundElement" style={styles.exerciseCard}>
              {/* Esta línea sirve para abrir el componente «View». */}
              <View style={styles.exerciseRow}>
                {/* Esta línea sirve para abrir el componente «Pressable» con sus propiedades. */}
                <Pressable onPress={() => startEdit(exercise)} style={styles.exerciseInfo}>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor={exercise.is_active ? 'text' : 'textSecondary'}>
                    {/* Esta línea sirve para mostrar el nombre, el músculo, el equipo y el nivel del ejercicio. */}
                    {exercise.name} · {exercise.primary_muscle.name} · {exercise.equipment}
                    {/* Esta línea sirve para mostrar el nombre de la primera alternativa si existe. */}
                    {exercise.alternatives[0] && ` · alt: ${exercise.alternatives[0].name}`}
                    {/* Esta línea sirve para mostrar el contenido dinámico «{!exercise.is_active && ' · inactivo'}». */}
                    {!exercise.is_active && ' · inactivo'}
                  </ThemedText>
                </Pressable>
                {/* Esta línea sirve para mostrar el bloque solo si «exercise.is_active». */}
                {exercise.is_active && (
                  // Esta línea sirve para abrir el componente «Pressable» con sus propiedades.
                  <Pressable onPress={() => deactivateExercise(exercise.id)}>
                    {/* Esta línea sirve para abrir el componente «ThemedText». */}
                    <ThemedText type="small" themeColor="textSecondary">
                      {/* Esta línea sirve para mostrar el texto «Desactivar». */}
                      Desactivar
                    </ThemedText>
                  </Pressable>
                )}
              </View>
              {/* Esta línea sirve para abrir el componente «ExerciseVideoRow». */}
              <ExerciseVideoRow exercise={exercise} />
            </ThemedView>
          ))}

          {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
          <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>

      {/* Esta línea sirve para abrir el elemento «ListPickerModal» con sus atributos en varias líneas. */}
      <ListPickerModal
        // Esta línea sirve para pasar la propiedad «visible» con el valor «alternativePickerVisible}».
        visible={alternativePickerVisible}
        // Esta línea sirve para definir el atributo «title» con el valor «Ejercicio alternativo (A/B)».
        title="Ejercicio alternativo (A/B)"
        // Esta línea sirve para pasar la propiedad «items» con el valor «exercises.filter((e) => e.id !== editingId)}».
        items={exercises.filter((e) => e.id !== editingId)}
        // Esta línea sirve para pasar la propiedad «getId» con el valor «(exercise) => exercise.id}».
        getId={(exercise) => exercise.id}
        // Esta línea sirve para pasar la propiedad «getLabel» con el valor «(exercise) => exercise.name}».
        getLabel={(exercise) => exercise.name}
        // Esta línea sirve para pasar la propiedad «getSubtitle» con el valor «(exercise) => `${exercise.primary_muscle.name».
        getSubtitle={(exercise) => `${exercise.primary_muscle.name} · ${exercise.equipment}`}
        // Esta línea sirve para definir el atributo «searchPlaceholder» con el valor «Nombre del ejercicio…».
        searchPlaceholder="Nombre del ejercicio…"
        // Esta línea sirve para asignar el manejador del evento «onSelect».
        onSelect={(exercise) => {
          // Esta línea sirve para guardar en el estado con «setForm» el valor «(prev) => ({ ...prev, alternative_exercise_id…».
          setForm((prev) => ({ ...prev, alternative_exercise_id: String(exercise.id) }));
          // Esta línea sirve para guardar en el estado con «setAlternativePickerVisible» el valor «false)…».
          setAlternativePickerVisible(false);
        }}
        // Esta línea sirve para asignar el manejador del evento «onSelectAll».
        onSelectAll={() => {
          // Esta línea sirve para guardar en el estado con «setForm» el valor «(prev) => ({ ...prev, alternative_exercise_id…».
          setForm((prev) => ({ ...prev, alternative_exercise_id: '' }));
          // Esta línea sirve para guardar en el estado con «setAlternativePickerVisible» el valor «false)…».
          setAlternativePickerVisible(false);
        }}
        // Esta línea sirve para asignar el manejador del evento «onClose».
        onClose={() => setAlternativePickerVisible(false)}
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
  // Esta línea sirve para definir el estilo «input» con «borderWidth: 1, borderRadius: Spacing.two, padding…».
  input: { borderWidth: 1, borderRadius: Spacing.two, paddingHorizontal: Spacing.two, paddingVertical: Spacing.two },
  // Esta línea sirve para declarar la propiedad «textarea» con el valor o tipo «{ minHeight: 72, textAlignVertical: 'top' }».
  textarea: { minHeight: 72, textAlignVertical: 'top' },
  // Esta línea sirve para definir el estilo «chipRow» con «flexDirection: 'row', flexWrap: 'wrap', gap: Spaci…».
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one },
  // Esta línea sirve para definir el estilo «chip» con «borderWidth: 1, borderRadius: Spacing.two, padding…».
  chip: { borderWidth: 1, borderRadius: Spacing.two, paddingVertical: Spacing.half, paddingHorizontal: Spacing.two },
  // Esta línea sirve para declarar la propiedad «actionsRow» con el valor o tipo «{ flexDirection: 'row', gap: Spacing.two }».
  actionsRow: { flexDirection: 'row', gap: Spacing.two },
  // Esta línea sirve para declarar la propiedad «exerciseCard» con el valor o tipo «{».
  exerciseCard: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «exerciseRow» con el valor o tipo «{».
  exerciseRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
  },
  // Esta línea sirve para declarar la propiedad «exerciseInfo» con el valor o tipo «{ flex: 1 }».
  exerciseInfo: { flex: 1 },
  // Esta línea sirve para definir el estilo «videoRow» con «flexDirection: 'row', flexWrap: 'wrap', alignItems…».
  videoRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: Spacing.two, backgroundColor: 'transparent' },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
});
