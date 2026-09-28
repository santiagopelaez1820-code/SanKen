import { useEffect, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ChevronRight, Dumbbell, Medal, Trophy, Video } from 'lucide-react-native';
import {
  formatPersonalRecord,
  type ExerciseCatalogItem,
  type ExerciseRankingScope,
  type ExerciseRankingSex,
  type PrSubmission,
} from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { ListPickerModal } from '@/components/ui/list-picker-modal';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import { parseDecimalInput } from '@/lib/number-input';
import { useExerciseCatalogStore } from '@/store/exercise-catalog-store';
import { useExerciseRankingsStore } from '@/store/exercise-rankings-store';
import { usePersonalRecordsStore } from '@/store/personal-records-store';
import { usePrSubmissionsStore } from '@/store/pr-submissions-store';
import { Skeleton } from '@/components/ui/skeleton';

const SUBMISSION_STATUS_LABEL: Record<PrSubmission['status'], string> = {
  pending: 'En revisión',
  approved: 'Aprobado',
  rejected: 'Rechazado',
};

const SUBMISSION_STATUS_VARIANT: Record<PrSubmission['status'], BadgeVariant> = {
  pending: 'neutral',
  approved: 'default',
  rejected: 'error',
};

/** Mismo tope que UploadPrSubmissionVideoRequest (max:102400 KB). */
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

interface PickedVideo {
  uri: string;
  name: string;
  mimeType: string | null;
}

/**
 * Abre el selector de videos y valida el tamaño antes de intentar subir —
 * así un video demasiado pesado da un mensaje claro en vez de un error
 * genérico del servidor. Devuelve null si el usuario canceló.
 */
async function pickEvidenceVideo(): Promise<{ video: PickedVideo } | { error: string } | null> {
  const result = await DocumentPicker.getDocumentAsync({ type: 'video/*', copyToCacheDirectory: true });
  if (result.canceled || !result.assets[0]) return null;
  const asset = result.assets[0];
  if (asset.size && asset.size > MAX_VIDEO_BYTES) {
    return { error: 'El video pesa más de 100 MB — recórtalo o grábalo en menor calidad.' };
  }
  return { video: { uri: asset.uri, name: asset.name, mimeType: asset.mimeType ?? null } };
}

function PrSubmissionRow({ submission }: { submission: PrSubmission }) {
  const theme = useTheme();
  const { uploadVideo, uploadingId, uploadError, failedUploadId } = usePrSubmissionsStore();
  const isUploading = uploadingId === submission.id;
  const rowUploadError = failedUploadId === submission.id ? uploadError : null;
  const [pickError, setPickError] = useState<string | null>(null);

  const handlePick = async () => {
    setPickError(null);
    const picked = await pickEvidenceVideo();
    if (!picked) return;
    if ('error' in picked) {
      setPickError(picked.error);
      return;
    }
    try {
      await uploadVideo(submission.id, picked.video);
    } catch {
      // el error ya queda expuesto vía uploadError
    }
  };

  return (
    <ThemedView type="backgroundSelected" style={styles.submissionRow}>
      <ThemedView style={styles.submissionHeader}>
        <ThemedText type="small">
          {submission.exercise.name} — {submission.weight_kg} kg × {submission.reps}
        </ThemedText>
        <Badge label={SUBMISSION_STATUS_LABEL[submission.status]} variant={SUBMISSION_STATUS_VARIANT[submission.status]} />
      </ThemedView>
      {submission.status === 'rejected' && submission.rejection_reason && (
        <ThemedText type="small" style={styles.error}>
          Motivo: {submission.rejection_reason}
        </ThemedText>
      )}
      {submission.status === 'pending' && !submission.video_url && (
        <PrimaryButton
          label="Subir video de evidencia"
          variant="ghost"
          loading={isUploading}
          onPress={handlePick}
        />
      )}
      {submission.status === 'pending' && !submission.video_url && (pickError || rowUploadError) && (
        <ThemedText type="small" style={styles.error}>
          {pickError ?? rowUploadError}
        </ThemedText>
      )}
      {submission.video_url && (
        <Pressable
          onPress={() => {
            const url = api.mediaUrl(submission.video_url) ?? (submission.video_url as string);
            openBrowserAsync(url, { presentationStyle: WebBrowserPresentationStyle.AUTOMATIC });
          }}
          style={styles.videoLink}>
          <ThemedText type="small" style={{ color: theme.accent }}>
            Ver video
          </ThemedText>
        </Pressable>
      )}
    </ThemedView>
  );
}

const RANKING_SCOPES: { value: ExerciseRankingScope; label: string }[] = [
  { value: 'global', label: 'Global' },
  { value: 'country', label: 'País' },
  { value: 'city', label: 'Ciudad' },
];

const RANKING_SEXES: { value: ExerciseRankingSex; label: string }[] = [
  { value: 'male', label: 'Hombres' },
  { value: 'female', label: 'Mujeres' },
];

const MEDAL_COLORS: Record<number, string> = { 1: '#D4AF37', 2: '#A8A9AD', 3: '#B08D57' };

export default function PersonalRecordsScreen() {
  const theme = useTheme();
  const { error, isSubmitting, submitError, load, registerRecord } = usePersonalRecordsStore();
  const { exercises, load: loadExercises } = useExerciseCatalogStore();
  const {
    scope: rankingScope,
    sex: rankingSex,
    data: rankingData,
    isLoading: isLoadingRanking,
    error: rankingError,
    setExercise: setRankingExercise,
    setScope: setRankingScope,
    setSex: setRankingSex,
  } = useExerciseRankingsStore();

  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseCatalogItem | null>(null);
  const [weightInput, setWeightInput] = useState('');
  const [repsInput, setRepsInput] = useState('1');
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [confirmationIsNewBest, setConfirmationIsNewBest] = useState(false);

  const [rankingPickerVisible, setRankingPickerVisible] = useState(false);
  const [rankingExercise, setRankingExerciseItem] = useState<ExerciseCatalogItem | null>(null);

  const {
    submissions,
    isLoading: isLoadingSubmissions,
    isSubmitting: isSubmittingSubmission,
    error: submissionsError,
    load: loadSubmissions,
    submit: submitPrSubmission,
    uploadVideo: uploadSubmissionVideo,
  } = usePrSubmissionsStore();
  const [submissionPickerVisible, setSubmissionPickerVisible] = useState(false);
  const [selectedSubmissionExercise, setSelectedSubmissionExercise] = useState<ExerciseCatalogItem | null>(null);
  const [submissionWeightInput, setSubmissionWeightInput] = useState('');
  const [submissionRepsInput, setSubmissionRepsInput] = useState('1');
  const [submissionFormError, setSubmissionFormError] = useState<string | null>(null);
  const [submissionVideo, setSubmissionVideo] = useState<PickedVideo | null>(null);
  const [submissionConfirmation, setSubmissionConfirmation] = useState<string | null>(null);
  const [isSendingSubmission, setIsSendingSubmission] = useState(false);

  const handlePickSubmissionVideo = async () => {
    setSubmissionFormError(null);
    const picked = await pickEvidenceVideo();
    if (!picked) return;
    if ('error' in picked) {
      setSubmissionFormError(picked.error);
      return;
    }
    setSubmissionVideo(picked.video);
  };

  useEffect(() => {
    load();
    loadExercises();
    loadSubmissions();
  }, [load, loadExercises, loadSubmissions]);

  const handleSubmitPrSubmission = async () => {
    const weight = parseDecimalInput(submissionWeightInput);
    const reps = Number(submissionRepsInput);

    if (!selectedSubmissionExercise) {
      setSubmissionFormError('Elige un ejercicio.');
      return;
    }
    if (!submissionWeightInput || Number.isNaN(weight) || weight <= 0 || weight > 1000) {
      setSubmissionFormError('Ingresa un peso válido.');
      return;
    }
    if (!submissionRepsInput || Number.isNaN(reps) || reps < 1 || reps > 50) {
      setSubmissionFormError('Ingresa repeticiones válidas.');
      return;
    }

    if (!submissionVideo) {
      setSubmissionFormError('Adjunta un video de evidencia para que puedan verificar tu PR.');
      return;
    }

    setSubmissionFormError(null);
    setSubmissionConfirmation(null);
    setIsSendingSubmission(true);
    const created = await submitPrSubmission({ exercise_id: selectedSubmissionExercise.id, weight_kg: weight, reps });
    if (!created) {
      setIsSendingSubmission(false);
      return;
    }

    // La postulación ya existe aunque el video falle: queda en la lista de
    // abajo con su propio botón "Subir video de evidencia" para reintentar.
    setSubmissionWeightInput('');
    setSelectedSubmissionExercise(null);
    try {
      await uploadSubmissionVideo(created.id, submissionVideo);
      setSubmissionConfirmation('¡Postulación enviada con su video! Te avisaremos cuando la revisen.');
    } catch {
      setSubmissionFormError('Se creó la postulación pero el video no se pudo subir. Reintenta desde la lista de abajo.');
    }
    setSubmissionVideo(null);
    setIsSendingSubmission(false);
  };

  const handleSubmit = async () => {
    setConfirmation(null);
    const weight = parseDecimalInput(weightInput);
    const reps = Number(repsInput);

    if (!selectedExercise) {
      setFormError('Elige un ejercicio.');
      return;
    }
    if (!weightInput || Number.isNaN(weight) || weight <= 0 || weight > 1000) {
      setFormError('Ingresa un peso válido.');
      return;
    }
    if (!repsInput || Number.isNaN(reps) || reps < 1 || reps > 50) {
      setFormError('Ingresa repeticiones válidas.');
      return;
    }

    setFormError(null);
    const ok = await registerRecord({ exercise_id: selectedExercise.id, weight_kg: weight, reps });
    if (ok) {
      const { lastIsNewBest, lastRecord } = usePersonalRecordsStore.getState();
      const isNewBest = Boolean(lastIsNewBest);
      const current = lastRecord ? formatPersonalRecord(lastRecord) : null;
      setConfirmationIsNewBest(isNewBest);
      setConfirmation(
        isNewBest
          ? `¡Nuevo récord personal! ${selectedExercise.name}: ${current ?? ''}`.trim()
          : `No supera tu récord actual${current ? ` (${current})` : ''} — se conserva el anterior.`
      );
      setWeightInput('');
    }
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.list}
          contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}
          keyboardShouldPersistTaps="handled">
          <ThemedText type="title" style={styles.pageTitle}>
            Personal Records
          </ThemedText>

          <ThemedView type="backgroundElement" style={styles.formCard}>
            <Pressable style={styles.pickerRow} onPress={() => setPickerVisible(true)}>
              <ThemedView style={styles.pickerRowLeft}>
                <Icon icon={Dumbbell} size={16} color={theme.textSecondary} />
                <ThemedText type="small" numberOfLines={1}>
                  {selectedExercise?.name ?? 'Elegir ejercicio'}
                </ThemedText>
              </ThemedView>
              <Icon icon={ChevronRight} size={16} color={theme.textSecondary} />
            </Pressable>

            <ThemedView style={styles.formRow}>
              <ThemedView style={styles.formRowField}>
                <TextField
                  label="Peso (kg)"
                  value={weightInput}
                  onChangeText={setWeightInput}
                  keyboardType="decimal-pad"
                  placeholder="0.0"
                />
              </ThemedView>

              <ThemedView style={styles.formRowField}>
                <TextField
                  label="Repeticiones"
                  value={repsInput}
                  onChangeText={setRepsInput}
                  keyboardType="number-pad"
                  placeholder="1"
                />
              </ThemedView>
            </ThemedView>

            {(formError || submitError) && (
              <ThemedText type="small" style={styles.error}>
                {formError ?? submitError}
              </ThemedText>
            )}
            {confirmation && confirmationIsNewBest && (
              <Animated.View entering={FadeIn.duration(250)}>
                <ThemedView style={[styles.confirmationBanner, { backgroundColor: `${theme.accent}1F` }]}>
                  <Icon icon={Trophy} size={16} color={theme.accent} />
                  <ThemedText type="smallBold" themeColor="accent">
                    {confirmation}
                  </ThemedText>
                </ThemedView>
              </Animated.View>
            )}
            {confirmation && !confirmationIsNewBest && (
              <ThemedText type="small" themeColor="textSecondary">
                {confirmation}
              </ThemedText>
            )}

            <PrimaryButton label="Registrar PR" loading={isSubmitting} onPress={handleSubmit} />
          </ThemedView>

          {error && (
            <ThemedText type="small" style={styles.error}>
              {error}
            </ThemedText>
          )}

          <ThemedView type="backgroundElement" style={styles.rankingCard}>
            <ThemedText type="smallBold">Postular PR para Rankings</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Adjunta un video de evidencia para que un entrenador o administrador verifique tu PR. Solo los
              aprobados aparecen en Rankings públicos; tus récords personales siguen siendo privados.
            </ThemedText>

            <ThemedView style={styles.field}>
              <ThemedText type="small" themeColor="textSecondary">
                Ejercicio
              </ThemedText>
              <PrimaryButton
                label={selectedSubmissionExercise?.name ?? 'Elegir ejercicio'}
                variant="ghost"
                onPress={() => setSubmissionPickerVisible(true)}
              />
            </ThemedView>

            <TextField
              label="Peso (kg)"
              value={submissionWeightInput}
              onChangeText={setSubmissionWeightInput}
              keyboardType="decimal-pad"
              placeholder="0.0"
            />

            <TextField
              label="Repeticiones"
              value={submissionRepsInput}
              onChangeText={setSubmissionRepsInput}
              keyboardType="number-pad"
              placeholder="1"
            />

            <Pressable
              onPress={handlePickSubmissionVideo}
              disabled={isSendingSubmission}
              style={[styles.pickerRow, submissionVideo && { borderColor: theme.accent }]}
              accessibilityRole="button"
              accessibilityLabel="Elegir video de evidencia">
              <ThemedView style={styles.pickerRowLeft}>
                <Icon icon={Video} size={16} color={submissionVideo ? theme.accent : theme.textSecondary} />
                <ThemedText type="small" numberOfLines={1} themeColor={submissionVideo ? 'text' : 'textSecondary'}>
                  {submissionVideo ? submissionVideo.name : 'Adjuntar video de evidencia'}
                </ThemedText>
              </ThemedView>
              <ThemedText type="small" style={{ color: theme.accent }}>
                {submissionVideo ? 'Cambiar' : 'Elegir'}
              </ThemedText>
            </Pressable>

            {(submissionFormError || submissionsError) && (
              <ThemedText type="small" style={styles.error}>
                {submissionFormError ?? submissionsError}
              </ThemedText>
            )}
            {submissionConfirmation && !submissionFormError && (
              <ThemedText type="small" themeColor="accent">
                {submissionConfirmation}
              </ThemedText>
            )}

            <PrimaryButton
              label={isSendingSubmission && !isSubmittingSubmission ? 'Subiendo video…' : 'Postular PR'}
              loading={isSendingSubmission}
              onPress={handleSubmitPrSubmission}
            />

            {!isLoadingSubmissions && submissions.length > 0 && (
              <ThemedView style={styles.field}>
                {submissions.map((submission) => (
                  <PrSubmissionRow key={submission.id} submission={submission} />
                ))}
              </ThemedView>
            )}
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.rankingCard}>
            <ThemedText type="smallBold">Rankings por ejercicio</ThemedText>

            <ThemedView style={styles.field}>
              <ThemedText type="small" themeColor="textSecondary">
                Ejercicio
              </ThemedText>
              <PrimaryButton
                label={rankingExercise?.name ?? 'Elegir ejercicio'}
                variant="ghost"
                onPress={() => setRankingPickerVisible(true)}
              />
            </ThemedView>

            {rankingExercise && (
              <>
                <ThemedView style={styles.chipsRow}>
                  {RANKING_SEXES.map((s) => {
                    const selected = s.value === rankingSex;
                    return (
                      <Pressable
                        key={s.value}
                        onPress={() => setRankingSex(s.value)}
                        style={[
                          styles.chip,
                          { borderColor: selected ? theme.accent : theme.backgroundSelected },
                          selected && { backgroundColor: theme.backgroundSelected },
                        ]}
                      >
                        <ThemedText type="small" themeColor={selected ? 'text' : 'textSecondary'}>
                          {s.label}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </ThemedView>

                <ThemedView style={styles.chipsRow}>
                  {RANKING_SCOPES.map((s) => {
                    const selected = s.value === rankingScope;
                    return (
                      <Pressable
                        key={s.value}
                        onPress={() => setRankingScope(s.value)}
                        style={[
                          styles.chip,
                          { borderColor: selected ? theme.accent : theme.backgroundSelected },
                          selected && { backgroundColor: theme.backgroundSelected },
                        ]}
                      >
                        <ThemedText type="small" themeColor={selected ? 'text' : 'textSecondary'}>
                          {s.label}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </ThemedView>

                {rankingError && (
                  <ThemedText type="small" style={styles.error}>
                    {rankingError}
                  </ThemedText>
                )}

                {isLoadingRanking && (
                  <Skeleton height={72} borderRadius={Spacing.three} />
                )}

                {!isLoadingRanking && (
                  <Animated.View key={`${rankingScope}-${rankingSex}`} entering={FadeIn.duration(220)}>
                    {rankingData?.scope_label && (
                      <ThemedText type="small" themeColor="textSecondary">
                        {rankingData.scope_label}
                      </ThemedText>
                    )}

                    {(rankingData?.entries.length ?? 0) === 0 && (
                      <ThemedText type="small" themeColor="textSecondary">
                        Todavía no hay suficientes récords públicos para este ranking.
                      </ThemedText>
                    )}

                    {rankingData?.entries.map((entry) => (
                      <ThemedView
                        key={entry.user_id}
                        style={[styles.listRow, entry.is_viewer && { backgroundColor: theme.backgroundSelected }]}
                      >
                        <ThemedView style={styles.rankRow}>
                          {MEDAL_COLORS[entry.rank] ? (
                            <Icon icon={Medal} size={16} color={MEDAL_COLORS[entry.rank]} />
                          ) : (
                            <ThemedText type="small" themeColor="textSecondary" style={styles.rankNumber}>
                              {entry.rank}
                            </ThemedText>
                          )}
                          <ThemedText type="small">{entry.user_name}</ThemedText>
                        </ThemedView>
                        <ThemedText type="smallBold" style={{ color: theme.accent }}>
                          {entry.metric_value.toLocaleString('es-AR')} kg
                        </ThemedText>
                      </ThemedView>
                    ))}

                    {rankingData?.viewer &&
                      !rankingData.entries.some((e) => e.user_id === rankingData.viewer?.user_id) && (
                        <ThemedView style={[styles.listRow, styles.viewerRow, { borderColor: theme.backgroundSelected }]}>
                          <ThemedText type="small">Tu posición: {rankingData.viewer.rank}</ThemedText>
                          <ThemedText type="smallBold" style={{ color: theme.accent }}>
                            {rankingData.viewer.metric_value.toLocaleString('es-AR')} kg
                          </ThemedText>
                        </ThemedView>
                      )}
                  </Animated.View>
                )}
              </>
            )}
          </ThemedView>
        </ScrollView>

        <ListPickerModal
          visible={pickerVisible}
          title="Elegir ejercicio"
          items={exercises}
          getId={(exercise) => exercise.id}
          getLabel={(exercise) => exercise.name}
          getSubtitle={(exercise) => `${exercise.primary_muscle.name} · ${exercise.equipment}`}
          searchPlaceholder="Nombre del ejercicio…"
          onSelect={(exercise) => {
            setSelectedExercise(exercise);
            setPickerVisible(false);
          }}
          onClose={() => setPickerVisible(false)}
        />

        <ListPickerModal
          visible={rankingPickerVisible}
          title="Elegir ejercicio"
          items={exercises}
          getId={(exercise) => exercise.id}
          getLabel={(exercise) => exercise.name}
          getSubtitle={(exercise) => `${exercise.primary_muscle.name} · ${exercise.equipment}`}
          searchPlaceholder="Nombre del ejercicio…"
          onSelect={(exercise) => {
            setRankingExerciseItem(exercise);
            setRankingExercise(exercise.id);
            setRankingPickerVisible(false);
          }}
          onClose={() => setRankingPickerVisible(false)}
        />

        <ListPickerModal
          visible={submissionPickerVisible}
          title="Elegir ejercicio"
          items={exercises}
          getId={(exercise) => exercise.id}
          getLabel={(exercise) => exercise.name}
          getSubtitle={(exercise) => `${exercise.primary_muscle.name} · ${exercise.equipment}`}
          searchPlaceholder="Nombre del ejercicio…"
          onSelect={(exercise) => {
            setSelectedSubmissionExercise(exercise);
            setSubmissionPickerVisible(false);
          }}
          onClose={() => setSubmissionPickerVisible(false)}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  list: { alignSelf: 'stretch' },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  pageTitle: { fontSize: 28, lineHeight: 34 },
  formCard: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  field: { gap: Spacing.one, backgroundColor: 'transparent' },
  // Columna, no fila: antes el encabezado, el botón "Subir video" y el
  // error quedaban apretados lado a lado y el botón casi no se veía.
  submissionRow: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.25)',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  pickerRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flex: 1,
    backgroundColor: 'transparent',
  },
  formRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  formRowField: { flex: 1, backgroundColor: 'transparent' },
  confirmationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, backgroundColor: 'transparent' },
  rankNumber: { width: 16, textAlign: 'center' },
  submissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.one,
    backgroundColor: 'transparent',
  },
  videoLink: { alignSelf: 'flex-end' },
  error: { color: '#FF4D5E' },
  rankingCard: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, backgroundColor: 'transparent' },
  chip: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.one,
    borderRadius: Spacing.two,
    backgroundColor: 'transparent',
  },
  viewerRow: {
    borderWidth: 1,
    borderStyle: 'dashed',
  },
});
