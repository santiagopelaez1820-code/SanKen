// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar todo el módulo como «DocumentPicker» desde «expo-document-picker».
import * as DocumentPicker from 'expo-document-picker';
// Esta línea sirve para importar «Pressable, ScrollView, StyleSheet» desde «react-native».
import { Pressable, ScrollView, StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «Animated» y «FadeIn» desde «react-native-reanimated».
import Animated, { FadeIn } from 'react-native-reanimated';
// Esta línea sirve para importar «ChevronRight, Dumbbell, Medal, Trophy, Video» desde «lucide-react-native».
import { ChevronRight, Dumbbell, Medal, Trophy, Video } from 'lucide-react-native';
// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «formatPersonalRecord» en la lista.
  formatPersonalRecord,
  // Esta línea sirve para importar el tipo «ExerciseCatalogItem».
  type ExerciseCatalogItem,
  // Esta línea sirve para importar el tipo «ExerciseRankingScope».
  type ExerciseRankingScope,
  // Esta línea sirve para importar el tipo «ExerciseRankingSex».
  type ExerciseRankingSex,
  // Esta línea sirve para importar el tipo «PrSubmission».
  type PrSubmission,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «Badge, type BadgeVariant» desde «@/components/ui/badge».
import { Badge, type BadgeVariant } from '@/components/ui/badge';
// Esta línea sirve para importar «Icon» desde «@/components/ui/icon».
import { Icon } from '@/components/ui/icon';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «TextField» desde «@/components/ui/text-field».
import { TextField } from '@/components/ui/text-field';
// Esta línea sirve para importar «ListPickerModal» desde «@/components/ui/list-picker-modal».
import { ListPickerModal } from '@/components/ui/list-picker-modal';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «parseDecimalInput» desde «@/lib/number-input».
import { parseDecimalInput } from '@/lib/number-input';
// Esta línea sirve para importar «useExerciseCatalogStore» desde «@/store/exercise-catalog-store».
import { useExerciseCatalogStore } from '@/store/exercise-catalog-store';
// Esta línea sirve para importar «useExerciseRankingsStore» desde «@/store/exercise-rankings-store».
import { useExerciseRankingsStore } from '@/store/exercise-rankings-store';
// Esta línea sirve para importar «usePersonalRecordsStore» desde «@/store/personal-records-store».
import { usePersonalRecordsStore } from '@/store/personal-records-store';
// Esta línea sirve para importar «usePrSubmissionsStore» desde «@/store/pr-submissions-store».
import { usePrSubmissionsStore } from '@/store/pr-submissions-store';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';
// Esta línea sirve para importar «ExerciseVideoPlayer» desde «@/components/workout/exercise-video-player».
import { ExerciseVideoPlayer } from '@/components/workout/exercise-video-player';

// Esta línea sirve para declarar «SUBMISSION_STATUS_LABEL» con el valor «{».
const SUBMISSION_STATUS_LABEL: Record<PrSubmission['status'], string> = {
  // Esta línea sirve para declarar la propiedad «pending» con el valor o tipo «'En revisión'».
  pending: 'En revisión',
  // Esta línea sirve para declarar la propiedad «approved» con el valor o tipo «'Aprobado'».
  approved: 'Aprobado',
  // Esta línea sirve para declarar la propiedad «rejected» con el valor o tipo «'Rechazado'».
  rejected: 'Rechazado',
};

// Esta línea sirve para declarar «SUBMISSION_STATUS_VARIANT» con el valor «{».
const SUBMISSION_STATUS_VARIANT: Record<PrSubmission['status'], BadgeVariant> = {
  // Esta línea sirve para declarar la propiedad «pending» con el valor o tipo «'neutral'».
  pending: 'neutral',
  // Esta línea sirve para declarar la propiedad «approved» con el valor o tipo «'default'».
  approved: 'default',
  // Esta línea sirve para declarar la propiedad «rejected» con el valor o tipo «'error'».
  rejected: 'error',
};

/** Mismo tope que UploadPrSubmissionVideoRequest (max:102400 KB). */
// Esta línea sirve para declarar «MAX_VIDEO_BYTES» con el valor «100 * 1024 * 1024».
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

// Esta línea sirve para declarar la interfaz «PickedVideo».
interface PickedVideo {
  // Esta línea sirve para declarar la propiedad «uri» con el valor o tipo «string».
  uri: string;
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «string».
  name: string;
  // Esta línea sirve para declarar la propiedad «mimeType» con el valor o tipo «string | null».
  mimeType: string | null;
}

/**
 * Abre el selector de videos y valida el tamaño antes de intentar subir —
 * así un video demasiado pesado da un mensaje claro en vez de un error
 * genérico del servidor. Devuelve null si el usuario canceló.
 */
// Esta línea sirve para declarar la función «pickEvidenceVideo».
async function pickEvidenceVideo(): Promise<{ video: PickedVideo } | { error: string } | null> {
  // Esta línea sirve para esperar «DocumentPicker.getDocumentAsync({ type: 'video/*',» y guardar el resultado en «result».
  const result = await DocumentPicker.getDocumentAsync({ type: 'video/*', copyToCacheDirectory: true });
  // Esta línea sirve para devolver null si «result.canceled || !result.assets[0]».
  if (result.canceled || !result.assets[0]) return null;
  // Esta línea sirve para extraer «sse» de «result.assets[0]».
  const asset = result.assets[0];
  // Esta línea sirve para revisar si «asset.size && asset.size > MAX_VIDEO_BYTES».
  if (asset.size && asset.size > MAX_VIDEO_BYTES) {
    // Esta línea sirve para devolver el error cuando el video pesa más de 100 MB.
    return { error: 'El video pesa más de 100 MB — recórtalo o grábalo en menor calidad.' };
  }
  // Esta línea sirve para devolver el video elegido con su ruta, nombre y tipo.
  return { video: { uri: asset.uri, name: asset.name, mimeType: asset.mimeType ?? null } };
}

// Esta línea sirve para declarar la función «PrSubmissionRow».
function PrSubmissionRow({ submission }: { submission: PrSubmission }) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener el estado y las acciones de las postulaciones de récord.
  const { uploadVideo, uploadingId, uploadError, failedUploadId } = usePrSubmissionsStore();
  // Esta línea sirve para extraer «sUploadin» de «uploadingId === submission.id».
  const isUploading = uploadingId === submission.id;
  // Esta línea sirve para extraer «owUploadErro» de «failedUploadId === submission.id ? uploa».
  const rowUploadError = failedUploadId === submission.id ? uploadError : null;
  // Esta línea sirve para crear el estado «pickError» y su función «setPickError».
  const [pickError, setPickError] = useState<string | null>(null);
  // Esta línea sirve para crear el estado «showVideo» y su función «setShowVideo».
  const [showVideo, setShowVideo] = useState(false);

  // Esta línea sirve para extraer «andlePic» de «async () => {».
  const handlePick = async () => {
    // Esta línea sirve para guardar en el estado con «setPickError» el valor «null)…».
    setPickError(null);
    // Esta línea sirve para esperar «pickEvidenceVideo()» y guardar el resultado en «picked».
    const picked = await pickEvidenceVideo();
    // Esta línea sirve para salir de la función si «!picked».
    if (!picked) return;
    // Esta línea sirve para revisar si «'error' in picked».
    if ('error' in picked) {
      // Esta línea sirve para guardar en el estado con «setPickError» el valor «picked.error)…».
      setPickError(picked.error);
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «uploadVideo».
      await uploadVideo(submission.id, picked.video);
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // el error ya queda expuesto vía uploadError
    }
  };

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView type="backgroundSelected" style={styles.submissionRow}>
      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView style={styles.submissionHeader}>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="small">
          {/* Esta línea sirve para mostrar el ejercicio, el peso y las repeticiones. */}
          {submission.exercise.name} — {submission.weight_kg} kg × {submission.reps}
        </ThemedText>
        {/* Esta línea sirve para abrir el componente «Badge». */}
        <Badge label={SUBMISSION_STATUS_LABEL[submission.status]} variant={SUBMISSION_STATUS_VARIANT[submission.status]} />
      </ThemedView>
      {/* Esta línea sirve para mostrar el motivo de rechazo si fue rechazada. */}
      {submission.status === 'rejected' && submission.rejection_reason && (
        // Esta línea sirve para abrir el componente «ThemedText».
        <ThemedText type="small" style={styles.error}>
          {/* Esta línea sirve para mostrar el contenido dinámico «Motivo: {submission.rejection_reason}». */}
          Motivo: {submission.rejection_reason}
        </ThemedText>
      )}
      {/* Esta línea sirve para mostrar el botón de subir video si está pendiente y sin video. */}
      {submission.status === 'pending' && !submission.video_url && (
        // Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas.
        <PrimaryButton
          // Esta línea sirve para definir el atributo «label» con el valor «Subir video de evidencia».
          label="Subir video de evidencia"
          // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
          variant="ghost"
          // Esta línea sirve para pasar la propiedad «loading» con el valor «isUploading}».
          loading={isUploading}
          // Esta línea sirve para asignar el manejador del evento «onPress».
          onPress={handlePick}
        />
      )}
      {/* Esta línea sirve para mostrar el error de selección o de subida si falta el video. */}
      {submission.status === 'pending' && !submission.video_url && (pickError || rowUploadError) && (
        // Esta línea sirve para abrir el componente «ThemedText».
        <ThemedText type="small" style={styles.error}>
          {/* Esta línea sirve para mostrar el contenido dinámico «{pickError ?? rowUploadError}». */}
          {pickError ?? rowUploadError}
        </ThemedText>
      )}
      {/* Esta línea sirve para abrir el comentario que explica por qué el video se reproduce dentro de la app. */}
      {/* Se reproduce dentro de la app (mismo player que la revisión del admin)
          // Esta línea sirve para continuar el comentario sobre el reproductor interno.
          en vez de abrir el navegador: vía el túnel ngrok gratuito, un navegador
          // Esta línea sirve para cerrar el comentario sobre la advertencia de ngrok.
          recibe la página de advertencia de ngrok en lugar del MP4. */}
      {/* Esta línea sirve para mostrar el bloque solo si «submission.video_url». */}
      {submission.video_url && (
        // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
        <Pressable
          // Esta línea sirve para asignar el manejador del evento «onPress».
          onPress={() => setShowVideo((value) => !value)}
          // Esta línea sirve para definir el atributo «accessibilityRole» con el valor «button».
          accessibilityRole="button"
          // Esta línea sirve para pasar la propiedad «accessibilityState» con el valor «{ expanded: showVideo }}».
          accessibilityState={{ expanded: showVideo }}
          // Esta línea sirve para pasar la propiedad «style» con el valor «styles.videoLink}>».
          style={styles.videoLink}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" style={{ color: theme.accent }}>
            {/* Esta línea sirve para mostrar el contenido dinámico «{showVideo ? 'Ocultar video' : 'Ver video'}». */}
            {showVideo ? 'Ocultar video' : 'Ver video'}
          </ThemedText>
        </Pressable>
      )}
      {/* Esta línea sirve para mostrar el elemento solo si «submission.video_url && showVideo». */}
      {submission.video_url && showVideo && <ExerciseVideoPlayer videoUrl={submission.video_url} />}
    </ThemedView>
  );
}

// Esta línea sirve para declarar «RANKING_SCOPES» con el valor «[».
const RANKING_SCOPES: { value: ExerciseRankingScope; label: string }[] = [
  // Esta línea sirve para agregar un elemento cuyo «value» es «'global', label: 'Global' },…».
  { value: 'global', label: 'Global' },
  // Esta línea sirve para agregar un elemento cuyo «value» es «'country', label: 'País' },…».
  { value: 'country', label: 'País' },
  // Esta línea sirve para agregar un elemento cuyo «value» es «'city', label: 'Ciudad' },…».
  { value: 'city', label: 'Ciudad' },
];

// Esta línea sirve para declarar «RANKING_SEXES» con el valor «[».
const RANKING_SEXES: { value: ExerciseRankingSex; label: string }[] = [
  // Esta línea sirve para agregar un elemento cuyo «value» es «'male', label: 'Hombres' },…».
  { value: 'male', label: 'Hombres' },
  // Esta línea sirve para agregar un elemento cuyo «value» es «'female', label: 'Mujeres' },…».
  { value: 'female', label: 'Mujeres' },
];

// Esta línea sirve para declarar «MEDAL_COLORS» con el valor «{ 1: '#D4AF37', 2: '#A8A9AD', 3: '#B08D57' }».
const MEDAL_COLORS: Record<number, string> = { 1: '#D4AF37', 2: '#A8A9AD', 3: '#B08D57' };

// Esta línea sirve para declarar la función «PersonalRecordsScreen».
export default function PersonalRecordsScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener el estado y las acciones del store de récords personales.
  const { error, isSubmitting, submitError, load, registerRecord } = usePersonalRecordsStore();
  // Esta línea sirve para obtener «exercises, load: loadExercises» con el hook «useExerciseCatalogStore».
  const { exercises, load: loadExercises } = useExerciseCatalogStore();
  // Esta línea sirve para abrir la desestructuración de varios valores.
  const {
    // Esta línea sirve para declarar la propiedad «scope» con el valor o tipo «rankingScope».
    scope: rankingScope,
    // Esta línea sirve para declarar la propiedad «sex» con el valor o tipo «rankingSex».
    sex: rankingSex,
    // Esta línea sirve para declarar la propiedad «data» con el valor o tipo «rankingData».
    data: rankingData,
    // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «isLoadingRanking».
    isLoading: isLoadingRanking,
    // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «rankingError».
    error: rankingError,
    // Esta línea sirve para declarar la propiedad «setExercise» con el valor o tipo «setRankingExercise».
    setExercise: setRankingExercise,
    // Esta línea sirve para declarar la propiedad «setScope» con el valor o tipo «setRankingScope».
    setScope: setRankingScope,
    // Esta línea sirve para declarar la propiedad «setSex» con el valor o tipo «setRankingSex».
    setSex: setRankingSex,
  // Esta línea sirve para cerrar la desestructuración con «useExerciseRankingsStore()».
  } = useExerciseRankingsStore();

  // Esta línea sirve para crear el estado «pickerVisible» y su función «setPickerVisible».
  const [pickerVisible, setPickerVisible] = useState(false);
  // Esta línea sirve para crear el estado «selectedExercise» y su función «setSelectedExercise».
  const [selectedExercise, setSelectedExercise] = useState<ExerciseCatalogItem | null>(null);
  // Esta línea sirve para crear el estado «weightInput» y su función «setWeightInput».
  const [weightInput, setWeightInput] = useState('');
  // Esta línea sirve para crear el estado «repsInput» y su función «setRepsInput».
  const [repsInput, setRepsInput] = useState('1');
  // Esta línea sirve para crear el estado «formError» y su función «setFormError».
  const [formError, setFormError] = useState<string | null>(null);
  // Esta línea sirve para crear el estado «confirmation» y su función «setConfirmation».
  const [confirmation, setConfirmation] = useState<string | null>(null);
  // Esta línea sirve para crear el estado «confirmationIsNewBest» y su función «setConfirmationIsNewBest».
  const [confirmationIsNewBest, setConfirmationIsNewBest] = useState(false);

  // Esta línea sirve para crear el estado «rankingPickerVisible» y su función «setRankingPickerVisible».
  const [rankingPickerVisible, setRankingPickerVisible] = useState(false);
  // Esta línea sirve para crear el estado «rankingExercise» y su función «setRankingExerciseItem».
  const [rankingExercise, setRankingExerciseItem] = useState<ExerciseCatalogItem | null>(null);

  // Esta línea sirve para abrir la desestructuración de varios valores.
  const {
    // Esta línea sirve para incluir el valor «submissions» en la lista.
    submissions,
    // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «isLoadingSubmissions».
    isLoading: isLoadingSubmissions,
    // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «isSubmittingSubmission».
    isSubmitting: isSubmittingSubmission,
    // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «submissionsError».
    error: submissionsError,
    // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «loadSubmissions».
    load: loadSubmissions,
    // Esta línea sirve para declarar la propiedad «submit» con el valor o tipo «submitPrSubmission».
    submit: submitPrSubmission,
    // Esta línea sirve para declarar la propiedad «uploadVideo» con el valor o tipo «uploadSubmissionVideo».
    uploadVideo: uploadSubmissionVideo,
  // Esta línea sirve para cerrar la desestructuración con «usePrSubmissionsStore()».
  } = usePrSubmissionsStore();
  // Esta línea sirve para crear el estado «submissionPickerVisible» y su función «setSubmissionPickerVisible».
  const [submissionPickerVisible, setSubmissionPickerVisible] = useState(false);
  // Esta línea sirve para crear el estado «selectedSubmissionExercise» y su función «setSelectedSubmissionExercise».
  const [selectedSubmissionExercise, setSelectedSubmissionExercise] = useState<ExerciseCatalogItem | null>(null);
  // Esta línea sirve para crear el estado «submissionWeightInput» y su función «setSubmissionWeightInput».
  const [submissionWeightInput, setSubmissionWeightInput] = useState('');
  // Esta línea sirve para crear el estado «submissionRepsInput» y su función «setSubmissionRepsInput».
  const [submissionRepsInput, setSubmissionRepsInput] = useState('1');
  // Esta línea sirve para crear el estado «submissionFormError» y su función «setSubmissionFormError».
  const [submissionFormError, setSubmissionFormError] = useState<string | null>(null);
  // Esta línea sirve para crear el estado «submissionVideo» y su función «setSubmissionVideo».
  const [submissionVideo, setSubmissionVideo] = useState<PickedVideo | null>(null);
  // Esta línea sirve para crear el estado «submissionConfirmation» y su función «setSubmissionConfirmation».
  const [submissionConfirmation, setSubmissionConfirmation] = useState<string | null>(null);
  // Esta línea sirve para crear el estado «isSendingSubmission» y su función «setIsSendingSubmission».
  const [isSendingSubmission, setIsSendingSubmission] = useState(false);

  // Esta línea sirve para extraer «andlePickSubmissionVide» de «async () => {».
  const handlePickSubmissionVideo = async () => {
    // Esta línea sirve para guardar en el estado con «setSubmissionFormError» el valor «null)…».
    setSubmissionFormError(null);
    // Esta línea sirve para esperar «pickEvidenceVideo()» y guardar el resultado en «picked».
    const picked = await pickEvidenceVideo();
    // Esta línea sirve para salir de la función si «!picked».
    if (!picked) return;
    // Esta línea sirve para revisar si «'error' in picked».
    if ('error' in picked) {
      // Esta línea sirve para guardar en el estado con «setSubmissionFormError» el valor «picked.error)…».
      setSubmissionFormError(picked.error);
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }
    // Esta línea sirve para guardar en el estado con «setSubmissionVideo» el valor «picked.video)…».
    setSubmissionVideo(picked.video);
  };

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «load».
    load();
    // Esta línea sirve para llamar a «loadExercises».
    loadExercises();
    // Esta línea sirve para llamar a «loadSubmissions».
    loadSubmissions();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «load, loadExercises, loadSubmissions».
  }, [load, loadExercises, loadSubmissions]);

  // Esta línea sirve para extraer «andleSubmitPrSubmissio» de «async () => {».
  const handleSubmitPrSubmission = async () => {
    // Esta línea sirve para extraer «eigh» de «parseDecimalInput(submissionWeightInput)».
    const weight = parseDecimalInput(submissionWeightInput);
    // Esta línea sirve para extraer «ep» de «Number(submissionRepsInput)».
    const reps = Number(submissionRepsInput);

    // Esta línea sirve para revisar si «!selectedSubmissionExercise».
    if (!selectedSubmissionExercise) {
      // Esta línea sirve para guardar en el estado con «setSubmissionFormError» el valor «'Elige un ejercicio.')…».
      setSubmissionFormError('Elige un ejercicio.');
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }
    // Esta línea sirve para validar que el peso de la postulación esté entre 0 y 1000.
    if (!submissionWeightInput || Number.isNaN(weight) || weight <= 0 || weight > 1000) {
      // Esta línea sirve para guardar en el estado con «setSubmissionFormError» el valor «'Ingresa un peso válido.')…».
      setSubmissionFormError('Ingresa un peso válido.');
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }
    // Esta línea sirve para validar que las repeticiones estén entre 1 y 50.
    if (!submissionRepsInput || Number.isNaN(reps) || reps < 1 || reps > 50) {
      // Esta línea sirve para guardar en el estado con «setSubmissionFormError» el valor «'Ingresa repeticiones válidas.')…».
      setSubmissionFormError('Ingresa repeticiones válidas.');
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }

    // Esta línea sirve para revisar si «!submissionVideo».
    if (!submissionVideo) {
      // Esta línea sirve para guardar en el estado con «setSubmissionFormError» el valor «'Adjunta un video de evidencia para que pueda…».
      setSubmissionFormError('Adjunta un video de evidencia para que puedan verificar tu PR.');
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }

    // Esta línea sirve para guardar en el estado con «setSubmissionFormError» el valor «null)…».
    setSubmissionFormError(null);
    // Esta línea sirve para guardar en el estado con «setSubmissionConfirmation» el valor «null)…».
    setSubmissionConfirmation(null);
    // Esta línea sirve para guardar en el estado con «setIsSendingSubmission» el valor «true)…».
    setIsSendingSubmission(true);
    // Esta línea sirve para esperar «submitPrSubmission({ exercise_id: selectedSubmissi» y guardar el resultado en «created».
    const created = await submitPrSubmission({ exercise_id: selectedSubmissionExercise.id, weight_kg: weight, reps });
    // Esta línea sirve para revisar si «!created».
    if (!created) {
      // Esta línea sirve para guardar en el estado con «setIsSendingSubmission» el valor «false)…».
      setIsSendingSubmission(false);
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }

    // La postulación ya existe aunque el video falle: queda en la lista de
    // abajo con su propio botón "Subir video de evidencia" para reintentar.
    // Esta línea sirve para guardar en el estado con «setSubmissionWeightInput» el valor «'')…».
    setSubmissionWeightInput('');
    // Esta línea sirve para guardar en el estado con «setSelectedSubmissionExercise» el valor «null)…».
    setSelectedSubmissionExercise(null);
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «uploadSubmissionVideo».
      await uploadSubmissionVideo(created.id, submissionVideo);
      // Esta línea sirve para guardar en el estado con «setSubmissionConfirmation» el valor «'¡Postulación enviada con su video! Te avisar…».
      setSubmissionConfirmation('¡Postulación enviada con su video! Te avisaremos cuando la revisen.');
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // Esta línea sirve para guardar en el estado con «setSubmissionFormError» el valor «'Se creó la postulación pero el video no se p…».
      setSubmissionFormError('Se creó la postulación pero el video no se pudo subir. Reintenta desde la lista de abajo.');
    }
    // Esta línea sirve para guardar en el estado con «setSubmissionVideo» el valor «null)…».
    setSubmissionVideo(null);
    // Esta línea sirve para guardar en el estado con «setIsSendingSubmission» el valor «false)…».
    setIsSendingSubmission(false);
  };

  // Esta línea sirve para extraer «andleSubmi» de «async () => {».
  const handleSubmit = async () => {
    // Esta línea sirve para guardar en el estado con «setConfirmation» el valor «null)…».
    setConfirmation(null);
    // Esta línea sirve para extraer «eigh» de «parseDecimalInput(weightInput)».
    const weight = parseDecimalInput(weightInput);
    // Esta línea sirve para extraer «ep» de «Number(repsInput)».
    const reps = Number(repsInput);

    // Esta línea sirve para revisar si «!selectedExercise».
    if (!selectedExercise) {
      // Esta línea sirve para guardar en el estado con «setFormError» el valor «'Elige un ejercicio.')…».
      setFormError('Elige un ejercicio.');
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }
    // Esta línea sirve para validar que el peso esté entre 0 y 1000.
    if (!weightInput || Number.isNaN(weight) || weight <= 0 || weight > 1000) {
      // Esta línea sirve para guardar en el estado con «setFormError» el valor «'Ingresa un peso válido.')…».
      setFormError('Ingresa un peso válido.');
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }
    // Esta línea sirve para revisar si «!repsInput || Number.isNaN(reps) || reps < 1 || reps > 50».
    if (!repsInput || Number.isNaN(reps) || reps < 1 || reps > 50) {
      // Esta línea sirve para guardar en el estado con «setFormError» el valor «'Ingresa repeticiones válidas.')…».
      setFormError('Ingresa repeticiones válidas.');
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }

    // Esta línea sirve para guardar en el estado con «setFormError» el valor «null)…».
    setFormError(null);
    // Esta línea sirve para esperar «registerRecord({ exercise_id: selectedExercise.id,» y guardar el resultado en «ok».
    const ok = await registerRecord({ exercise_id: selectedExercise.id, weight_kg: weight, reps });
    // Esta línea sirve para revisar si «ok».
    if (ok) {
      // Esta línea sirve para extraer «lastIsNewBest, lastRecord» de «usePersonalRecordsStore.getState()».
      const { lastIsNewBest, lastRecord } = usePersonalRecordsStore.getState();
      // Esta línea sirve para extraer «sNewBes» de «Boolean(lastIsNewBest)».
      const isNewBest = Boolean(lastIsNewBest);
      // Esta línea sirve para extraer «urren» de «lastRecord ? formatPersonalRecord(lastRe».
      const current = lastRecord ? formatPersonalRecord(lastRecord) : null;
      // Esta línea sirve para guardar en el estado con «setConfirmationIsNewBest» el valor «isNewBest)…».
      setConfirmationIsNewBest(isNewBest);
      // Esta línea sirve para mostrar la confirmación.
      setConfirmation(
        // Esta línea sirve para activar la opción «isNewBest».
        isNewBest
          // Esta línea sirve para felicitar por el nuevo récord con el nombre del ejercicio.
          ? `¡Nuevo récord personal! ${selectedExercise.name}: ${current ?? ''}`.trim()
          // Esta línea sirve para avisar que no supera el récord actual.
          : `No supera tu récord actual${current ? ` (${current})` : ''} — se conserva el anterior.`
      );
      // Esta línea sirve para guardar en el estado con «setWeightInput» el valor «'')…».
      setWeightInput('');
    }
  };

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el elemento «ScrollView» con sus atributos en varias líneas. */}
        <ScrollView
          // Esta línea sirve para pasar la propiedad «style» con el valor «styles.list}».
          style={styles.list}
          // Esta línea sirve para pasar la propiedad «contentContainerStyle» con el valor «[styles.content, { paddingBottom: BottomTabIn».
          contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}
          // Esta línea sirve para definir el atributo «keyboardShouldPersistTaps» con el valor «handled».
          keyboardShouldPersistTaps="handled">
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="title" style={styles.pageTitle}>
            {/* Esta línea sirve para mostrar el texto «Personal Records». */}
            Personal Records
          </ThemedText>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.formCard}>
            {/* Esta línea sirve para abrir el componente «Pressable» con sus propiedades. */}
            <Pressable style={styles.pickerRow} onPress={() => setPickerVisible(true)}>
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView style={styles.pickerRowLeft}>
                {/* Esta línea sirve para abrir el componente «Icon». */}
                <Icon icon={Dumbbell} size={16} color={theme.textSecondary} />
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" numberOfLines={1}>
                  {/* Esta línea sirve para mostrar el contenido dinámico «{selectedExercise?.name ?? 'Elegir ejercicio'}». */}
                  {selectedExercise?.name ?? 'Elegir ejercicio'}
                </ThemedText>
              </ThemedView>
              {/* Esta línea sirve para abrir el componente «Icon». */}
              <Icon icon={ChevronRight} size={16} color={theme.textSecondary} />
            </Pressable>

            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.formRow}>
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView style={styles.formRowField}>
                {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
                <TextField
                  // Esta línea sirve para definir el atributo «label» con el valor «Peso (kg)».
                  label="Peso (kg)"
                  // Esta línea sirve para pasar la propiedad «value» con el valor «weightInput}».
                  value={weightInput}
                  // Esta línea sirve para asignar el manejador del evento «onChangeText».
                  onChangeText={setWeightInput}
                  // Esta línea sirve para definir el atributo «keyboardType» con el valor «decimal-pad».
                  keyboardType="decimal-pad"
                  // Esta línea sirve para definir el atributo «placeholder» con el valor «0.0».
                  placeholder="0.0"
                />
              </ThemedView>

              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView style={styles.formRowField}>
                {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
                <TextField
                  // Esta línea sirve para definir el atributo «label» con el valor «Repeticiones».
                  label="Repeticiones"
                  // Esta línea sirve para pasar la propiedad «value» con el valor «repsInput}».
                  value={repsInput}
                  // Esta línea sirve para asignar el manejador del evento «onChangeText».
                  onChangeText={setRepsInput}
                  // Esta línea sirve para definir el atributo «keyboardType» con el valor «number-pad».
                  keyboardType="number-pad"
                  // Esta línea sirve para definir el atributo «placeholder» con el valor «1».
                  placeholder="1"
                />
              </ThemedView>
            </ThemedView>

            {/* Esta línea sirve para mostrar el bloque solo si «(formError || submitError)». */}
            {(formError || submitError) && (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="small" style={styles.error}>
                {/* Esta línea sirve para mostrar el contenido dinámico «{formError ?? submitError}». */}
                {formError ?? submitError}
              </ThemedText>
            )}
            {/* Esta línea sirve para mostrar el bloque solo si «confirmation && confirmationIsNewBest». */}
            {confirmation && confirmationIsNewBest && (
              // Esta línea sirve para abrir el componente «Animated.View».
              <Animated.View entering={FadeIn.duration(250)}>
                {/* Esta línea sirve para abrir el componente «ThemedView». */}
                <ThemedView style={[styles.confirmationBanner, { backgroundColor: `${theme.accent}1F` }]}>
                  {/* Esta línea sirve para abrir el componente «Icon». */}
                  <Icon icon={Trophy} size={16} color={theme.accent} />
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="smallBold" themeColor="accent">
                    {/* Esta línea sirve para mostrar el valor «confirmation». */}
                    {confirmation}
                  </ThemedText>
                </ThemedView>
              </Animated.View>
            )}
            {/* Esta línea sirve para mostrar el bloque solo si «confirmation && !confirmationIsNewBest». */}
            {confirmation && !confirmationIsNewBest && (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el valor «confirmation». */}
                {confirmation}
              </ThemedText>
            )}

            {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
            <PrimaryButton label="Registrar PR" loading={isSubmitting} onPress={handleSubmit} />
          </ThemedView>

          {/* Esta línea sirve para mostrar el bloque solo si «error». */}
          {error && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" style={styles.error}>
              {/* Esta línea sirve para mostrar el valor «error». */}
              {error}
            </ThemedText>
          )}

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.rankingCard}>
            {/* Esta línea sirve para mostrar el texto «Postular PR para Rankings» dentro de «ThemedText». */}
            <ThemedText type="smallBold">Postular PR para Rankings</ThemedText>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para explicar que hace falta un video de evidencia. */}
              Adjunta un video de evidencia para que un entrenador o administrador verifique tu PR. Solo los
              aprobados aparecen en Rankings públicos; tus récords personales siguen siendo privados.
            </ThemedText>

            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.field}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el texto «Ejercicio». */}
                Ejercicio
              </ThemedText>
              {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
              <PrimaryButton
                // Esta línea sirve para pasar la propiedad «label» con el valor «selectedSubmissionExercise?.name ?? 'Elegir e».
                label={selectedSubmissionExercise?.name ?? 'Elegir ejercicio'}
                // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
                variant="ghost"
                // Esta línea sirve para asignar el manejador del evento «onPress».
                onPress={() => setSubmissionPickerVisible(true)}
              />
            </ThemedView>

            {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
            <TextField
              // Esta línea sirve para definir el atributo «label» con el valor «Peso (kg)».
              label="Peso (kg)"
              // Esta línea sirve para pasar la propiedad «value» con el valor «submissionWeightInput}».
              value={submissionWeightInput}
              // Esta línea sirve para asignar el manejador del evento «onChangeText».
              onChangeText={setSubmissionWeightInput}
              // Esta línea sirve para definir el atributo «keyboardType» con el valor «decimal-pad».
              keyboardType="decimal-pad"
              // Esta línea sirve para definir el atributo «placeholder» con el valor «0.0».
              placeholder="0.0"
            />

            {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
            <TextField
              // Esta línea sirve para definir el atributo «label» con el valor «Repeticiones».
              label="Repeticiones"
              // Esta línea sirve para pasar la propiedad «value» con el valor «submissionRepsInput}».
              value={submissionRepsInput}
              // Esta línea sirve para asignar el manejador del evento «onChangeText».
              onChangeText={setSubmissionRepsInput}
              // Esta línea sirve para definir el atributo «keyboardType» con el valor «number-pad».
              keyboardType="number-pad"
              // Esta línea sirve para definir el atributo «placeholder» con el valor «1».
              placeholder="1"
            />

            {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
            <Pressable
              // Esta línea sirve para asignar el manejador del evento «onPress».
              onPress={handlePickSubmissionVideo}
              // Esta línea sirve para pasar la propiedad «disabled» con el valor «isSendingSubmission}».
              disabled={isSendingSubmission}
              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.pickerRow, submissionVideo && { borde».
              style={[styles.pickerRow, submissionVideo && { borderColor: theme.accent }]}
              // Esta línea sirve para definir el atributo «accessibilityRole» con el valor «button».
              accessibilityRole="button"
              // Esta línea sirve para definir el atributo «accessibilityLabel» con el valor «Elegir video de evidencia».
              accessibilityLabel="Elegir video de evidencia">
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView style={styles.pickerRowLeft}>
                {/* Esta línea sirve para abrir el componente «Icon». */}
                <Icon icon={Video} size={16} color={submissionVideo ? theme.accent : theme.textSecondary} />
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" numberOfLines={1} themeColor={submissionVideo ? 'text' : 'textSecondary'}>
                  {/* Esta línea sirve para mostrar el nombre del video o el texto para adjuntarlo. */}
                  {submissionVideo ? submissionVideo.name : 'Adjuntar video de evidencia'}
                </ThemedText>
              </ThemedView>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" style={{ color: theme.accent }}>
                {/* Esta línea sirve para mostrar el contenido dinámico «{submissionVideo ? 'Cambiar' : 'Elegir'}». */}
                {submissionVideo ? 'Cambiar' : 'Elegir'}
              </ThemedText>
            </Pressable>

            {/* Esta línea sirve para mostrar el bloque solo si «(submissionFormError || submissionsError)». */}
            {(submissionFormError || submissionsError) && (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="small" style={styles.error}>
                {/* Esta línea sirve para mostrar el contenido dinámico «{submissionFormError ?? submissionsError}». */}
                {submissionFormError ?? submissionsError}
              </ThemedText>
            )}
            {/* Esta línea sirve para mostrar el bloque solo si «submissionConfirmation && !submissionFormError». */}
            {submissionConfirmation && !submissionFormError && (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="small" themeColor="accent">
                {/* Esta línea sirve para mostrar el valor «submissionConfirmation». */}
                {submissionConfirmation}
              </ThemedText>
            )}

            {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
            <PrimaryButton
              // Esta línea sirve para pasar la propiedad «label» con el valor «isSendingSubmission && !isSubmittingSubmissio».
              label={isSendingSubmission && !isSubmittingSubmission ? 'Subiendo video…' : 'Postular PR'}
              // Esta línea sirve para pasar la propiedad «loading» con el valor «isSendingSubmission}».
              loading={isSendingSubmission}
              // Esta línea sirve para asignar el manejador del evento «onPress».
              onPress={handleSubmitPrSubmission}
            />

            {/* Esta línea sirve para mostrar el bloque solo si «!isLoadingSubmissions && submissions.length > 0». */}
            {!isLoadingSubmissions && submissions.length > 0 && (
              // Esta línea sirve para abrir el componente «ThemedView».
              <ThemedView style={styles.field}>
                {/* Esta línea sirve para recorrer «submissions» y mostrar un bloque por elemento. */}
                {submissions.map((submission) => (
                  // Esta línea sirve para abrir el componente «PrSubmissionRow».
                  <PrSubmissionRow key={submission.id} submission={submission} />
                ))}
              </ThemedView>
            )}
          </ThemedView>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.rankingCard}>
            {/* Esta línea sirve para mostrar el texto «Rankings por ejercicio» dentro de «ThemedText». */}
            <ThemedText type="smallBold">Rankings por ejercicio</ThemedText>

            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.field}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el texto «Ejercicio». */}
                Ejercicio
              </ThemedText>
              {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
              <PrimaryButton
                // Esta línea sirve para pasar la propiedad «label» con el valor «rankingExercise?.name ?? 'Elegir ejercicio'}».
                label={rankingExercise?.name ?? 'Elegir ejercicio'}
                // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
                variant="ghost"
                // Esta línea sirve para asignar el manejador del evento «onPress».
                onPress={() => setRankingPickerVisible(true)}
              />
            </ThemedView>

            {/* Esta línea sirve para mostrar el bloque solo si «rankingExercise». */}
            {rankingExercise && (
              // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
              <>
                {/* Esta línea sirve para abrir el componente «ThemedView». */}
                <ThemedView style={styles.chipsRow}>
                  {/* Esta línea sirve para recorrer «RANKING_SEXES» y calcular qué mostrar por elemento. */}
                  {RANKING_SEXES.map((s) => {
                    // Esta línea sirve para extraer «electe» de «s.value === rankingSex».
                    const selected = s.value === rankingSex;
                    // Esta línea sirve para devolver la interfaz del componente.
                    return (
                      // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
                      <Pressable
                        // Esta línea sirve para identificar el elemento de la lista con «s.value}».
                        key={s.value}
                        // Esta línea sirve para asignar el manejador del evento «onPress».
                        onPress={() => setRankingSex(s.value)}
                        // Esta línea sirve para pasar la propiedad «style» con el valor «[».
                        style={[
                          // Esta línea sirve para agregar el estilo «styles.chip».
                          styles.chip,
                          // Esta línea sirve para agregar un elemento cuyo «borderColor» es «selected ? theme.accent : theme.backgrou…».
                          { borderColor: selected ? theme.accent : theme.backgroundSelected },
                          // Esta línea sirve para resaltar la opción seleccionada.
                          selected && { backgroundColor: theme.backgroundSelected },
                        ]}
                      >
                        {/* Esta línea sirve para abrir el componente «ThemedText». */}
                        <ThemedText type="small" themeColor={selected ? 'text' : 'textSecondary'}>
                          {/* Esta línea sirve para mostrar el valor «s.label». */}
                          {s.label}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </ThemedView>

                {/* Esta línea sirve para abrir el componente «ThemedView». */}
                <ThemedView style={styles.chipsRow}>
                  {/* Esta línea sirve para recorrer «RANKING_SCOPES» y calcular qué mostrar por elemento. */}
                  {RANKING_SCOPES.map((s) => {
                    // Esta línea sirve para extraer «electe» de «s.value === rankingScope».
                    const selected = s.value === rankingScope;
                    // Esta línea sirve para devolver la interfaz del componente.
                    return (
                      // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
                      <Pressable
                        // Esta línea sirve para identificar el elemento de la lista con «s.value}».
                        key={s.value}
                        // Esta línea sirve para asignar el manejador del evento «onPress».
                        onPress={() => setRankingScope(s.value)}
                        // Esta línea sirve para pasar la propiedad «style» con el valor «[».
                        style={[
                          // Esta línea sirve para agregar el estilo «styles.chip».
                          styles.chip,
                          // Esta línea sirve para agregar un elemento cuyo «borderColor» es «selected ? theme.accent : theme.backgrou…».
                          { borderColor: selected ? theme.accent : theme.backgroundSelected },
                          // Esta línea sirve para resaltar la opción seleccionada.
                          selected && { backgroundColor: theme.backgroundSelected },
                        ]}
                      >
                        {/* Esta línea sirve para abrir el componente «ThemedText». */}
                        <ThemedText type="small" themeColor={selected ? 'text' : 'textSecondary'}>
                          {/* Esta línea sirve para mostrar el valor «s.label». */}
                          {s.label}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </ThemedView>

                {/* Esta línea sirve para mostrar el bloque solo si «rankingError». */}
                {rankingError && (
                  // Esta línea sirve para abrir el componente «ThemedText».
                  <ThemedText type="small" style={styles.error}>
                    {/* Esta línea sirve para mostrar el valor «rankingError». */}
                    {rankingError}
                  </ThemedText>
                )}

                {/* Esta línea sirve para mostrar el bloque solo si «isLoadingRanking». */}
                {isLoadingRanking && (
                  // Esta línea sirve para abrir el componente «Skeleton».
                  <Skeleton height={72} borderRadius={Spacing.three} />
                )}

                {/* Esta línea sirve para mostrar el bloque solo si «!isLoadingRanking». */}
                {!isLoadingRanking && (
                  // Esta línea sirve para abrir el componente «Animated.View».
                  <Animated.View key={`${rankingScope}-${rankingSex}`} entering={FadeIn.duration(220)}>
                    {/* Esta línea sirve para mostrar el bloque solo si «rankingData?.scope_label». */}
                    {rankingData?.scope_label && (
                      // Esta línea sirve para abrir el componente «ThemedText».
                      <ThemedText type="small" themeColor="textSecondary">
                        {/* Esta línea sirve para mostrar el valor «rankingData.scope_label». */}
                        {rankingData.scope_label}
                      </ThemedText>
                    )}

                    {/* Esta línea sirve para mostrar el bloque solo si «(rankingData?.entries.length ?? 0) === 0». */}
                    {(rankingData?.entries.length ?? 0) === 0 && (
                      // Esta línea sirve para abrir el componente «ThemedText».
                      <ThemedText type="small" themeColor="textSecondary">
                        {/* Esta línea sirve para avisar que no hay suficientes récords públicos. */}
                        Todavía no hay suficientes récords públicos para este ranking.
                      </ThemedText>
                    )}

                    {/* Esta línea sirve para recorrer «rankingData?.entries» y mostrar un bloque por elemento. */}
                    {rankingData?.entries.map((entry) => (
                      // Esta línea sirve para abrir el elemento «ThemedView» con sus atributos en varias líneas.
                      <ThemedView
                        // Esta línea sirve para identificar el elemento de la lista con «entry.user_id}».
                        key={entry.user_id}
                        // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.listRow, entry.is_viewer && { backgro».
                        style={[styles.listRow, entry.is_viewer && { backgroundColor: theme.backgroundSelected }]}
                      >
                        {/* Esta línea sirve para abrir el componente «ThemedView». */}
                        <ThemedView style={styles.rankRow}>
                          {/* Esta línea sirve para elegir entre dos bloques según «MEDAL_COLORS[entry.rank]». */}
                          {MEDAL_COLORS[entry.rank] ? (
                            // Esta línea sirve para abrir el componente «Icon».
                            <Icon icon={Medal} size={16} color={MEDAL_COLORS[entry.rank]} />
                          // Esta línea sirve para mostrar el bloque alternativo.
                          ) : (
                            // Esta línea sirve para abrir el componente «ThemedText».
                            <ThemedText type="small" themeColor="textSecondary" style={styles.rankNumber}>
                              {/* Esta línea sirve para mostrar el valor «entry.rank». */}
                              {entry.rank}
                            </ThemedText>
                          )}
                          {/* Esta línea sirve para mostrar el valor «entry.user_name» dentro de «ThemedText». */}
                          <ThemedText type="small">{entry.user_name}</ThemedText>
                        </ThemedView>
                        {/* Esta línea sirve para abrir el componente «ThemedText». */}
                        <ThemedText type="smallBold" style={{ color: theme.accent }}>
                          {/* Esta línea sirve para mostrar el contenido dinámico «{entry.metric_value.toLocaleString('es-AR')} kg». */}
                          {entry.metric_value.toLocaleString('es-AR')} kg
                        </ThemedText>
                      </ThemedView>
                    ))}

                    {/* Esta línea sirve para mostrar el contenido dinámico «{rankingData?.viewer &&». */}
                    {rankingData?.viewer &&
                      // Esta línea sirve para revisar si el usuario no aparece entre las entradas.
                      !rankingData.entries.some((e) => e.user_id === rankingData.viewer?.user_id) && (
                        // Esta línea sirve para abrir el componente «ThemedView».
                        <ThemedView style={[styles.listRow, styles.viewerRow, { borderColor: theme.backgroundSelected }]}>
                          {/* Esta línea sirve para abrir el componente «ThemedText» con sus propiedades. */}
                          <ThemedText type="small">Tu posición: {rankingData.viewer.rank}</ThemedText>
                          {/* Esta línea sirve para abrir el componente «ThemedText». */}
                          <ThemedText type="smallBold" style={{ color: theme.accent }}>
                            {/* Esta línea sirve para mostrar el contenido dinámico «{rankingData.viewer.metric_value.toLocaleString('es-AR')} kg». */}
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

        {/* Esta línea sirve para abrir el elemento «ListPickerModal» con sus atributos en varias líneas. */}
        <ListPickerModal
          // Esta línea sirve para pasar la propiedad «visible» con el valor «pickerVisible}».
          visible={pickerVisible}
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
          onSelect={(exercise) => {
            // Esta línea sirve para guardar en el estado con «setSelectedExercise» el valor «exercise)…».
            setSelectedExercise(exercise);
            // Esta línea sirve para guardar en el estado con «setPickerVisible» el valor «false)…».
            setPickerVisible(false);
          }}
          // Esta línea sirve para asignar el manejador del evento «onClose».
          onClose={() => setPickerVisible(false)}
        />

        {/* Esta línea sirve para abrir el elemento «ListPickerModal» con sus atributos en varias líneas. */}
        <ListPickerModal
          // Esta línea sirve para pasar la propiedad «visible» con el valor «rankingPickerVisible}».
          visible={rankingPickerVisible}
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
          onSelect={(exercise) => {
            // Esta línea sirve para guardar en el estado con «setRankingExerciseItem» el valor «exercise)…».
            setRankingExerciseItem(exercise);
            // Esta línea sirve para guardar en el estado con «setRankingExercise» el valor «exercise.id)…».
            setRankingExercise(exercise.id);
            // Esta línea sirve para guardar en el estado con «setRankingPickerVisible» el valor «false)…».
            setRankingPickerVisible(false);
          }}
          // Esta línea sirve para asignar el manejador del evento «onClose».
          onClose={() => setRankingPickerVisible(false)}
        />

        {/* Esta línea sirve para abrir el elemento «ListPickerModal» con sus atributos en varias líneas. */}
        <ListPickerModal
          // Esta línea sirve para pasar la propiedad «visible» con el valor «submissionPickerVisible}».
          visible={submissionPickerVisible}
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
          onSelect={(exercise) => {
            // Esta línea sirve para guardar en el estado con «setSelectedSubmissionExercise» el valor «exercise)…».
            setSelectedSubmissionExercise(exercise);
            // Esta línea sirve para guardar en el estado con «setSubmissionPickerVisible» el valor «false)…».
            setSubmissionPickerVisible(false);
          }}
          // Esta línea sirve para asignar el manejador del evento «onClose».
          onClose={() => setSubmissionPickerVisible(false)}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «root» con el valor o tipo «{ flex: 1 }».
  root: { flex: 1 },
  // Esta línea sirve para definir el estilo «safeArea» con «flex: 1, alignItems: 'center', width: '100%' },…».
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  // Esta línea sirve para declarar la propiedad «list» con el valor o tipo «{ alignSelf: 'stretch' }».
  list: { alignSelf: 'stretch' },
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
  // Esta línea sirve para declarar la propiedad «pageTitle» con el valor o tipo «{ fontSize: 24, lineHeight: 30 }».
  pageTitle: { fontSize: 24, lineHeight: 30 },
  // Esta línea sirve para declarar la propiedad «formCard» con el valor o tipo «{».
  formCard: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
    // Esta línea sirve para declarar la propiedad «marginBottom» con el valor o tipo «Spacing.three».
    marginBottom: Spacing.three,
  },
  // Esta línea sirve para definir el estilo «field» con «gap: Spacing.one, backgroundColor: 'transparent' }…».
  field: { gap: Spacing.one, backgroundColor: 'transparent' },
  // Columna, no fila: antes el encabezado, el botón "Subir video" y el
  // error quedaban apretados lado a lado y el botón casi no se veía.
  // Esta línea sirve para declarar la propiedad «submissionRow» con el valor o tipo «{».
  submissionRow: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «pickerRow» con el valor o tipo «{».
  pickerRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «borderColor» con el valor o tipo «'rgba(128,128,128,0.25)'».
    borderColor: 'rgba(128,128,128,0.25)',
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.three».
    paddingHorizontal: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.three».
    paddingVertical: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «pickerRowLeft» con el valor o tipo «{».
  pickerRowLeft: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «formRow» con el valor o tipo «{».
  formRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «formRowField» con el valor o tipo «{ flex: 1, backgroundColor: 'transparent' }».
  formRowField: { flex: 1, backgroundColor: 'transparent' },
  // Esta línea sirve para declarar la propiedad «confirmationBanner» con el valor o tipo «{».
  confirmationBanner: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two».
    paddingVertical: Spacing.two,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.three».
    paddingHorizontal: Spacing.three,
  },
  // Esta línea sirve para definir el estilo «rankRow» con «flexDirection: 'row', alignItems: 'center', gap: S…».
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, backgroundColor: 'transparent' },
  // Esta línea sirve para declarar la propiedad «rankNumber» con el valor o tipo «{ width: 16, textAlign: 'center' }».
  rankNumber: { width: 16, textAlign: 'center' },
  // Esta línea sirve para declarar la propiedad «submissionHeader» con el valor o tipo «{».
  submissionHeader: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «marginBottom» con el valor o tipo «Spacing.one».
    marginBottom: Spacing.one,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «videoLink» con el valor o tipo «{ alignSelf: 'flex-end' }».
  videoLink: { alignSelf: 'flex-end' },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
  // Esta línea sirve para declarar la propiedad «rankingCard» con el valor o tipo «{».
  rankingCard: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «marginTop» con el valor o tipo «Spacing.three».
    marginTop: Spacing.three,
  },
  // Esta línea sirve para definir el estilo «chipsRow» con «flexDirection: 'row', flexWrap: 'wrap', gap: Spaci…».
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, backgroundColor: 'transparent' },
  // Esta línea sirve para declarar la propiedad «chip» con el valor o tipo «{».
  chip: {
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.one».
    paddingVertical: Spacing.one,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.two».
    paddingHorizontal: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «listRow» con el valor o tipo «{».
  listRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.one».
    paddingVertical: Spacing.one,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.one».
    paddingHorizontal: Spacing.one,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.two».
    borderRadius: Spacing.two,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «viewerRow» con el valor o tipo «{».
  viewerRow: {
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «borderStyle» con el valor o tipo «'dashed'».
    borderStyle: 'dashed',
  },
});
