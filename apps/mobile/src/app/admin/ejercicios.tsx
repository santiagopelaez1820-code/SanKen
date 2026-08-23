import { useEffect, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { AdminExercise } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAdminStore } from '@/store/admin-store';
import { Skeleton } from '@/components/ui/skeleton';

const EQUIPMENT_OPTIONS = [
  'barbell', 'dumbbells', 'bench', 'squat_rack', 'pull_up_bar',
  'cables', 'machines', 'kettlebells', 'resistance_bands', 'bodyweight_only',
];
const LEVEL_OPTIONS = ['beginner', 'intermediate', 'advanced'];
const TYPE_OPTIONS = ['compound', 'isolation', 'cardio', 'mobility'];

function ChipRow({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.chipRow}>
      {options.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[
              styles.chip,
              { borderColor: theme.backgroundSelected },
              selected && { backgroundColor: theme.backgroundSelected },
            ]}>
            <ThemedText type="small" themeColor={selected ? 'text' : 'textSecondary'}>
              {option}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const EMPTY_FORM = { name: '', primary_muscle_id: '', equipment: 'barbell', level: 'beginner', type: 'compound' };

/**
 * El admin elige el archivo desde su dispositivo (expo-document-picker) —
 * sin búsqueda automática, sin YouTube, sin APIs externas. El backend
 * garantiza el reemplazo seguro (sube y confirma antes de borrar el
 * anterior), ver AdminExerciseController::uploadVideo.
 */
function ExerciseVideoRow({ exercise }: { exercise: AdminExercise }) {
  const { uploadExerciseVideo, deleteExerciseVideo } = useAdminStore();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePick = async () => {
    setError(null);
    const result = await DocumentPicker.getDocumentAsync({ type: 'video/*' });
    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    setIsUploading(true);
    try {
      await uploadExerciseVideo(exercise.id, { uri: asset.uri, name: asset.name, mimeType: asset.mimeType ?? null });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir el video.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteExerciseVideo(exercise.id);
      setConfirmingDelete(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ThemedView style={styles.videoRow}>
      <ThemedText type="small" themeColor="textSecondary">
        {exercise.video_url ? '✅ Disponible' : '❌ Sin video'}
      </ThemedText>
      <PrimaryButton
        label={isUploading ? 'Subiendo…' : exercise.video_url ? 'Reemplazar' : 'Subir'}
        variant="ghost"
        loading={isUploading}
        onPress={handlePick}
      />
      {exercise.video_url && (
        <PrimaryButton label="Eliminar" variant="ghost" onPress={() => setConfirmingDelete(true)} />
      )}
      {error && (
        <ThemedText type="small" style={styles.error}>
          {error}
        </ThemedText>
      )}

      <ConfirmDialog
        visible={confirmingDelete}
        title={`¿Eliminar el video de ${exercise.name}?`}
        description="El ejercicio se queda sin video pero sigue funcionando normalmente."
        confirmLabel="Sí, eliminar"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </ThemedView>
  );
}

export default function AdminEjerciciosScreen() {
  const theme = useTheme();
  const { exercises, muscleGroups, isLoadingExercises, loadExercises, createExercise, updateExercise, deactivateExercise } =
    useAdminStore();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  const startEdit = (exercise: AdminExercise) => {
    setEditingId(exercise.id);
    setForm({
      name: exercise.name,
      primary_muscle_id: String(exercise.primary_muscle_id),
      equipment: exercise.equipment,
      level: exercise.level,
      type: exercise.type,
    });
  };

  const submit = async () => {
    const payload = { ...form, primary_muscle_id: Number(form.primary_muscle_id) };
    if (editingId) {
      await updateExercise(editingId, payload);
    } else {
      await createExercise(payload);
    }
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
          <ThemedText type="title" style={styles.pageTitle}>
            Ejercicios
          </ThemedText>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="smallBold">{editingId ? 'Editar ejercicio' : 'Nuevo ejercicio'}</ThemedText>
            <TextInput
              value={form.name}
              onChangeText={(name) => setForm({ ...form, name })}
              placeholder="Nombre"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
            />
            <ChipRow
              options={muscleGroups.map((m) => String(m.id))}
              value={form.primary_muscle_id}
              onChange={(primary_muscle_id) => setForm({ ...form, primary_muscle_id })}
            />
            <ChipRow options={EQUIPMENT_OPTIONS} value={form.equipment} onChange={(equipment) => setForm({ ...form, equipment })} />
            <ChipRow options={LEVEL_OPTIONS} value={form.level} onChange={(level) => setForm({ ...form, level })} />
            <ChipRow options={TYPE_OPTIONS} value={form.type} onChange={(type) => setForm({ ...form, type })} />
            <View style={styles.actionsRow}>
              <PrimaryButton
                label={editingId ? 'Guardar cambios' : 'Crear'}
                onPress={submit}
                disabled={!form.name || !form.primary_muscle_id}
              />
              {editingId && (
                <PrimaryButton
                  label="Cancelar"
                  variant="ghost"
                  onPress={() => {
                    setEditingId(null);
                    setForm(EMPTY_FORM);
                  }}
                />
              )}
            </View>
          </ThemedView>

          {isLoadingExercises && (
            <Skeleton height={56} borderRadius={Spacing.three} />
          )}

          {exercises.map((exercise) => (
            <ThemedView key={exercise.id} type="backgroundElement" style={styles.exerciseCard}>
              <View style={styles.exerciseRow}>
                <Pressable onPress={() => startEdit(exercise)} style={styles.exerciseInfo}>
                  <ThemedText type="small" themeColor={exercise.is_active ? 'text' : 'textSecondary'}>
                    {exercise.name} · {exercise.primary_muscle.name} · {exercise.equipment}
                    {!exercise.is_active && ' · inactivo'}
                  </ThemedText>
                </Pressable>
                {exercise.is_active && (
                  <Pressable onPress={() => deactivateExercise(exercise.id)}>
                    <ThemedText type="small" themeColor="textSecondary">
                      Desactivar
                    </ThemedText>
                  </Pressable>
                )}
              </View>
              <ExerciseVideoRow exercise={exercise} />
            </ThemedView>
          ))}

          <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>
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
  input: { borderWidth: 1, borderRadius: Spacing.two, paddingHorizontal: Spacing.two, paddingVertical: Spacing.two },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one },
  chip: { borderWidth: 1, borderRadius: Spacing.two, paddingVertical: Spacing.half, paddingHorizontal: Spacing.two },
  actionsRow: { flexDirection: 'row', gap: Spacing.two },
  exerciseCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exerciseInfo: { flex: 1 },
  videoRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: Spacing.two },
  error: { color: '#D9534F' },
});
