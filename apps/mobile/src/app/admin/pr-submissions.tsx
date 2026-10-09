// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «Pressable, ScrollView, StyleSheet, TextInput, View» desde «react-native».
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar los tipos «PrSubmissionStatus» desde «@sanken/core».
import type { PrSubmissionStatus } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «ExerciseVideoPlayer» desde «@/components/workout/exercise-video-player».
import { ExerciseVideoPlayer } from '@/components/workout/exercise-video-player';
// Esta línea sirve para importar «Badge» desde «@/components/ui/badge».
import { Badge } from '@/components/ui/badge';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useAdminStore» desde «@/store/admin-store».
import { useAdminStore } from '@/store/admin-store';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';

// Esta línea sirve para declarar «STATUS_TABS» con el valor «[».
const STATUS_TABS: { label: string; value: PrSubmissionStatus | 'all' }[] = [
  // Esta línea sirve para agregar un elemento cuyo «label» es «'Pendientes', value: 'pending' },…».
  { label: 'Pendientes', value: 'pending' },
  // Esta línea sirve para agregar un elemento cuyo «label» es «'Aprobados', value: 'approved' },…».
  { label: 'Aprobados', value: 'approved' },
  // Esta línea sirve para agregar un elemento cuyo «label» es «'Rechazados', value: 'rejected' },…».
  { label: 'Rechazados', value: 'rejected' },
  // Esta línea sirve para agregar un elemento cuyo «label» es «'Todos', value: 'all' },…».
  { label: 'Todos', value: 'all' },
];

// Esta línea sirve para declarar la función «AdminPrSubmissionsScreen».
export default function AdminPrSubmissionsScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener las postulaciones y las acciones del store de administración.
  const { prSubmissions, isLoadingPrSubmissions, reviewError, loadPrSubmissions, reviewPrSubmission } =
    // Esta línea sirve para llamar a «useAdminStore».
    useAdminStore();
  // Esta línea sirve para crear el estado «status» y su función «setStatus».
  const [status, setStatus] = useState<PrSubmissionStatus | 'all'>('pending');
  // Esta línea sirve para crear el estado «reasonBySubmission» y su función «setReasonBySubmission».
  const [reasonBySubmission, setReasonBySubmission] = useState<Record<number, string>>({});
  // Esta línea sirve para crear el estado «reviewingId» y su función «setReviewingId».
  const [reviewingId, setReviewingId] = useState<number | null>(null);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «loadPrSubmissions» con «status».
    loadPrSubmissions(status);
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «status, loadPrSubmissions».
  }, [status, loadPrSubmissions]);

  // Esta línea sirve para extraer «andleRevie» de «async (id: number, reviewStatus: 'approv».
  const handleReview = async (id: number, reviewStatus: 'approved' | 'rejected') => {
    // Esta línea sirve para guardar en el estado con «setReviewingId» el valor «id)…».
    setReviewingId(id);
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «reviewPrSubmission».
      await reviewPrSubmission(id, reviewStatus, reasonBySubmission[id]);
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // el error ya queda expuesto vía reviewError
    // Esta línea sirve para ejecutar siempre al terminar el bloque anterior.
    } finally {
      // Esta línea sirve para guardar en el estado con «setReviewingId» el valor «null)…».
      setReviewingId(null);
    }
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
            {/* Esta línea sirve para mostrar el texto «PR pendientes de revisión». */}
            PR pendientes de revisión
          </ThemedText>

          {/* Esta línea sirve para abrir el componente «View». */}
          <View style={styles.tabsRow}>
            {/* Esta línea sirve para recorrer «STATUS_TABS» y calcular qué mostrar por elemento. */}
            {STATUS_TABS.map((tab) => {
              // Esta línea sirve para extraer «electe» de «tab.value === status».
              const selected = tab.value === status;
              // Esta línea sirve para devolver la interfaz del componente.
              return (
                // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
                <Pressable
                  // Esta línea sirve para identificar el elemento de la lista con «tab.value}».
                  key={tab.value}
                  // Esta línea sirve para asignar el manejador del evento «onPress».
                  onPress={() => setStatus(tab.value)}
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
                    {/* Esta línea sirve para mostrar el valor «tab.label». */}
                    {tab.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          {/* Esta línea sirve para mostrar el bloque solo si «isLoadingPrSubmissions». */}
          {isLoadingPrSubmissions && (
            // Esta línea sirve para abrir el componente «Skeleton».
            <Skeleton height={56} borderRadius={Spacing.three} />
          )}
          {/* Esta línea sirve para mostrar el contenido dinámico «{!isLoadingPrSubmissions && prSubmissions.length === 0 && (». */}
          {!isLoadingPrSubmissions && prSubmissions.length === 0 && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el texto «Sin postulaciones acá.». */}
              Sin postulaciones acá.
            </ThemedText>
          )}

          {/* Esta línea sirve para recorrer «prSubmissions» y mostrar un bloque por elemento. */}
          {prSubmissions.map((submission) => (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView key={submission.id} type="backgroundElement" style={styles.card}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small">
                {/* Esta línea sirve para mostrar quién postuló, el ejercicio y la marca. */}
                {submission.user.name} postuló {submission.exercise.name} — {submission.weight_kg} kg ×{' '}
                {/* Esta línea sirve para mostrar el contenido dinámico «{submission.reps} (1RM est.: {submission.estimated_1rm} kg)». */}
                {submission.reps} (1RM est.: {submission.estimated_1rm} kg)
              </ThemedText>

              {/* Esta línea sirve para elegir entre dos bloques según «submission.video_url». */}
              {submission.video_url ? (
                // Esta línea sirve para abrir el componente «ExerciseVideoPlayer».
                <ExerciseVideoPlayer videoUrl={submission.video_url} />
              // Esta línea sirve para mostrar el bloque alternativo.
              ) : (
                // Esta línea sirve para abrir el componente «ThemedText».
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar el texto «Todavía no subió el video de evidencia.». */}
                  Todavía no subió el video de evidencia.
                </ThemedText>
              )}

              {/* Esta línea sirve para elegir entre dos bloques según «submission.status === 'pending'». */}
              {submission.status === 'pending' ? (
                // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
                <>
                  {/* Esta línea sirve para abrir el elemento «TextInput» con sus atributos en varias líneas. */}
                  <TextInput allowFontScaling={false}
                    // Esta línea sirve para pasar la propiedad «value» con el valor «reasonBySubmission[submission.id] ?? ''}».
                    value={reasonBySubmission[submission.id] ?? ''}
                    // Esta línea sirve para asignar el manejador del evento «onChangeText».
                    onChangeText={(text) => setReasonBySubmission({ ...reasonBySubmission, [submission.id]: text })}
                    // Esta línea sirve para definir el atributo «placeholder» con el valor «Motivo de rechazo (obligatorio si rechazás)».
                    placeholder="Motivo de rechazo (obligatorio si rechazás)"
                    // Esta línea sirve para pasar la propiedad «placeholderTextColor» con el valor «theme.textSecondary}».
                    placeholderTextColor={theme.textSecondary}
                    // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.input, { borderColor: theme.backgroun».
                    style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
                  />
                  {/* Esta línea sirve para mostrar el bloque solo si «reviewError». */}
                  {reviewError && (
                    // Esta línea sirve para abrir el componente «ThemedText».
                    <ThemedText type="small" style={styles.error}>
                      {/* Esta línea sirve para mostrar el valor «reviewError». */}
                      {reviewError}
                    </ThemedText>
                  )}
                  {/* Esta línea sirve para abrir el componente «View». */}
                  <View style={styles.actionsRow}>
                    {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
                    <PrimaryButton
                      // Esta línea sirve para definir el atributo «label» con el valor «Aprobar».
                      label="Aprobar"
                      // Esta línea sirve para pasar la propiedad «loading» con el valor «reviewingId === submission.id}».
                      loading={reviewingId === submission.id}
                      // Esta línea sirve para pasar la propiedad «disabled» con el valor «!submission.video_url}».
                      disabled={!submission.video_url}
                      // Esta línea sirve para asignar el manejador del evento «onPress».
                      onPress={() => handleReview(submission.id, 'approved')}
                    />
                    {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
                    <PrimaryButton
                      // Esta línea sirve para definir el atributo «label» con el valor «Rechazar».
                      label="Rechazar"
                      // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
                      variant="ghost"
                      // Esta línea sirve para pasar la propiedad «loading» con el valor «reviewingId === submission.id}».
                      loading={reviewingId === submission.id}
                      // Esta línea sirve para pasar la propiedad «disabled» con el valor «!reasonBySubmission[submission.id]?.trim()}».
                      disabled={!reasonBySubmission[submission.id]?.trim()}
                      // Esta línea sirve para asignar el manejador del evento «onPress».
                      onPress={() => handleReview(submission.id, 'rejected')}
                    />
                  </View>
                </>
              // Esta línea sirve para mostrar el bloque alternativo.
              ) : (
                // Esta línea sirve para abrir el componente «View».
                <View style={styles.reviewedRow}>
                  {/* Esta línea sirve para abrir el elemento «Badge» con sus atributos en varias líneas. */}
                  <Badge
                    // Esta línea sirve para pasar la propiedad «label» con el valor «submission.status === 'approved' ? 'Aprobado'».
                    label={submission.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                    // Esta línea sirve para pasar la propiedad «variant» con el valor «submission.status === 'approved' ? 'default' ».
                    variant={submission.status === 'approved' ? 'default' : 'error'}
                  />
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor="textSecondary">
                    {/* Esta línea sirve para mostrar el contenido dinámico «por {submission.reviewed_by?.name}». */}
                    por {submission.reviewed_by?.name}
                    {/* Esta línea sirve para mostrar el motivo de rechazo si existe. */}
                    {submission.rejection_reason && ` — "${submission.rejection_reason}"`}
                  </ThemedText>
                </View>
              )}
            </ThemedView>
          ))}

          {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
          <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «root» con el valor o tipo «{ flex: 1 }».
  root: { flex: 1 },
  // Esta línea sirve para definir el estilo «reviewedRow» con «flexDirection: 'row', alignItems: 'center', gap: S…».
  reviewedRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, backgroundColor: 'transparent' },
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
  // Esta línea sirve para definir el estilo «tabsRow» con «flexDirection: 'row', flexWrap: 'wrap', gap: Spaci…».
  tabsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  // Esta línea sirve para definir el estilo «chip» con «borderWidth: 1, borderRadius: Spacing.two, padding…».
  chip: { borderWidth: 1, borderRadius: Spacing.two, paddingVertical: Spacing.one, paddingHorizontal: Spacing.two },
  // Esta línea sirve para definir el estilo «card» con «borderRadius: Spacing.three, padding: Spacing.thre…».
  card: { borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.two },
  // Esta línea sirve para definir el estilo «input» con «borderWidth: 1, borderRadius: Spacing.two, padding…».
  input: { borderWidth: 1, borderRadius: Spacing.two, paddingHorizontal: Spacing.two, paddingVertical: Spacing.two },
  // Esta línea sirve para declarar la propiedad «actionsRow» con el valor o tipo «{ flexDirection: 'row', gap: Spacing.two }».
  actionsRow: { flexDirection: 'row', gap: Spacing.two },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
});
