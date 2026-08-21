import { useEffect, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ExerciseCatalogItem, ExerciseRankingScope, ExerciseRankingSex, PersonalRecordSummary, PrSubmission } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { ExercisePickerModal } from '@/components/trainer/exercise-picker-modal';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import { useExerciseCatalogStore } from '@/store/exercise-catalog-store';
import { useExerciseRankingsStore } from '@/store/exercise-rankings-store';
import { usePersonalRecordsStore } from '@/store/personal-records-store';
import { usePrSubmissionsStore } from '@/store/pr-submissions-store';

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

function PrSubmissionRow({ submission }: { submission: PrSubmission }) {
  const theme = useTheme();
  const { uploadVideo, uploadingId, uploadError } = usePrSubmissionsStore();
  const isUploading = uploadingId === submission.id;

  const handlePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'video/*' });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    try {
      await uploadVideo(submission.id, { uri: asset.uri, name: asset.name, mimeType: asset.mimeType ?? null });
    } catch {
      // el error ya queda expuesto vía uploadError
    }
  };

  return (
    <ThemedView type="backgroundElement" style={styles.row}>
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
      {submission.status === 'pending' && !submission.video_url && uploadError && (
        <ThemedText type="small" style={styles.error}>
          {uploadError}
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

const MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

function RecordRow({ record }: { record: PersonalRecordSummary }) {
  return (
    <ThemedView type="backgroundElement" style={styles.row}>
      <ThemedText type="small">{record.exercise_name}</ThemedText>
      <ThemedView style={styles.rowValue}>
        <ThemedText type="smallBold" themeColor="accent">
          🏆 {record.value} kg
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {record.achieved_at}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

export default function PersonalRecordsScreen() {
  const theme = useTheme();
  const { records, isLoading, error, isSubmitting, submitError, load, registerRecord } = usePersonalRecordsStore();
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
  } = usePrSubmissionsStore();
  const [submissionPickerVisible, setSubmissionPickerVisible] = useState(false);
  const [selectedSubmissionExercise, setSelectedSubmissionExercise] = useState<ExerciseCatalogItem | null>(null);
  const [submissionWeightInput, setSubmissionWeightInput] = useState('');
  const [submissionRepsInput, setSubmissionRepsInput] = useState('1');
  const [submissionFormError, setSubmissionFormError] = useState<string | null>(null);

  useEffect(() => {
    load();
    loadExercises();
    loadSubmissions();
  }, [load, loadExercises, loadSubmissions]);

  const handleSubmitPrSubmission = async () => {
    const weight = Number(submissionWeightInput.replace(',', '.'));
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

    setSubmissionFormError(null);
    const ok = await submitPrSubmission({ exercise_id: selectedSubmissionExercise.id, weight_kg: weight, reps });
    if (ok) {
      setSubmissionWeightInput('');
      setSelectedSubmissionExercise(null);
    }
  };

  const handleSubmit = async () => {
    setConfirmation(null);
    const weight = Number(weightInput.replace(',', '.'));
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
      const isNewBest = Boolean(usePersonalRecordsStore.getState().lastIsNewBest);
      setConfirmationIsNewBest(isNewBest);
      setConfirmation(
        isNewBest
          ? '🏆 ¡Nuevo récord personal!'
          : 'Registrado — no supera tu récord actual, se conserva el anterior.'
      );
      setWeightInput('');
    }
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          style={styles.list}
          data={records}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <RecordRow record={item} />}
          contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}
          ListHeaderComponent={
            <>
              <ThemedText type="title" style={styles.pageTitle}>
                PR
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
                Registra tu mejor levantamiento por ejercicio — independiente de tu entrenamiento.
              </ThemedText>

              <ThemedView type="backgroundElement" style={styles.formCard}>
                <ThemedView style={styles.field}>
                  <ThemedText type="small" themeColor="textSecondary">
                    Ejercicio
                  </ThemedText>
                  <PrimaryButton
                    label={selectedExercise?.name ?? 'Elegir ejercicio'}
                    variant="ghost"
                    onPress={() => setPickerVisible(true)}
                  />
                </ThemedView>

                <TextField
                  label="Peso (kg)"
                  value={weightInput}
                  onChangeText={setWeightInput}
                  keyboardType="decimal-pad"
                  placeholder="0.0"
                />

                <TextField
                  label="Repeticiones"
                  value={repsInput}
                  onChangeText={setRepsInput}
                  keyboardType="number-pad"
                  placeholder="1"
                />

                {(formError || submitError) && (
                  <ThemedText type="small" style={styles.error}>
                    {formError ?? submitError}
                  </ThemedText>
                )}
                {confirmation && (
                  <ThemedText
                    type={confirmationIsNewBest ? 'smallBold' : 'small'}
                    themeColor={confirmationIsNewBest ? 'accent' : 'textSecondary'}>
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
            </>
          }
          ListEmptyComponent={
            !isLoading ? (
              <ThemedText type="small" themeColor="textSecondary">
                Todavía no tienes récords registrados.
              </ThemedText>
            ) : null
          }
          ListFooterComponent={
            <>
            <ThemedView type="backgroundElement" style={styles.rankingCard}>
              <ThemedText type="smallBold">Postular PR para Rankings</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Solo los PR aprobados por un administrador, con video de evidencia, aparecen en Rankings públicos. Tus
                récords de arriba son privados y no se ven afectados por esto.
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

              {(submissionFormError || submissionsError) && (
                <ThemedText type="small" style={styles.error}>
                  {submissionFormError ?? submissionsError}
                </ThemedText>
              )}

              <PrimaryButton label="Postular PR" loading={isSubmittingSubmission} onPress={handleSubmitPrSubmission} />

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
                    <ThemedText type="small" themeColor="textSecondary">
                      Cargando…
                    </ThemedText>
                  )}

                  {!isLoadingRanking && rankingData?.scope_label && (
                    <ThemedText type="small" themeColor="textSecondary">
                      {rankingData.scope_label}
                    </ThemedText>
                  )}

                  {!isLoadingRanking && (rankingData?.entries.length ?? 0) === 0 && (
                    <ThemedText type="small" themeColor="textSecondary">
                      Todavía no hay suficientes récords públicos para este ranking.
                    </ThemedText>
                  )}

                  {!isLoadingRanking &&
                    rankingData?.entries.map((entry) => (
                      <ThemedView
                        key={entry.user_id}
                        style={[styles.listRow, entry.is_viewer && { backgroundColor: theme.backgroundSelected }]}
                      >
                        <ThemedText type="small">
                          {MEDALS[entry.rank] ?? entry.rank}. {entry.user_name}
                        </ThemedText>
                        <ThemedText type="smallBold" style={{ color: theme.accent }}>
                          {entry.metric_value.toLocaleString('es-AR')} kg
                        </ThemedText>
                      </ThemedView>
                    ))}

                  {!isLoadingRanking &&
                    rankingData?.viewer &&
                    !rankingData.entries.some((e) => e.user_id === rankingData.viewer?.user_id) && (
                      <ThemedView style={[styles.listRow, styles.viewerRow, { borderColor: theme.backgroundSelected }]}>
                        <ThemedText type="small">Tu posición: {rankingData.viewer.rank}</ThemedText>
                        <ThemedText type="smallBold" style={{ color: theme.accent }}>
                          {rankingData.viewer.metric_value.toLocaleString('es-AR')} kg
                        </ThemedText>
                      </ThemedView>
                    )}
                </>
              )}
            </ThemedView>
            </>
          }
        />

        <ExercisePickerModal
          visible={pickerVisible}
          exercises={exercises}
          onSelect={(exercise) => {
            setSelectedExercise(exercise);
            setPickerVisible(false);
          }}
          onClose={() => setPickerVisible(false)}
        />

        <ExercisePickerModal
          visible={rankingPickerVisible}
          exercises={exercises}
          onSelect={(exercise) => {
            setRankingExerciseItem(exercise);
            setRankingExercise(exercise.id);
            setRankingPickerVisible(false);
          }}
          onClose={() => setRankingPickerVisible(false)}
        />

        <ExercisePickerModal
          visible={submissionPickerVisible}
          exercises={exercises}
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
  subtitle: { marginBottom: Spacing.two },
  formCard: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  field: { gap: Spacing.one },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: Spacing.three,
    padding: Spacing.three,
    marginBottom: Spacing.two,
  },
  rowValue: { alignItems: 'flex-end' },
  submissionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.one },
  videoLink: { alignSelf: 'flex-end' },
  error: { color: '#C9564A' },
  rankingCard: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
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
