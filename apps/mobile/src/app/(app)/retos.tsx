// Esta línea sirve para importar «useEffect, useRef» desde «react».
import { useEffect, useRef } from 'react';
// Esta línea sirve para importar «ScrollView, StyleSheet, View» desde «react-native».
import { ScrollView, StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar las utilidades de animación de React Native Reanimated.
import Animated, { FadeInUp, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
// Esta línea sirve para importar «Flag, Flame» desde «lucide-react-native».
import { Flag, Flame } from 'lucide-react-native';
// Esta línea sirve para importar los tipos «Challenge» desde «@sanken/core».
import type { Challenge } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «ChallengeCompleteCelebration» desde «@/components/gamification/challenge-complete-celebration».
import { ChallengeCompleteCelebration } from '@/components/gamification/challenge-complete-celebration';
// Esta línea sirve para importar «EmptyState» desde «@/components/ui/empty-state».
import { EmptyState } from '@/components/ui/empty-state';
// Esta línea sirve para importar «ErrorState» desde «@/components/ui/error-state».
import { ErrorState } from '@/components/ui/error-state';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «TutorialOverlay» desde «@/components/tutorial/tutorial-overlay».
import { TutorialOverlay } from '@/components/tutorial/tutorial-overlay';
// Esta línea sirve para importar «CardShadow, glowShadow, MaxContentWidth, Spacing» desde «@/constants/theme».
import { CardShadow, glowShadow, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useTutorial» desde «@/hooks/use-tutorial».
import { useTutorial } from '@/hooks/use-tutorial';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';
// Esta línea sirve para importar «useRetosStore» desde «@/store/retos-store».
import { useRetosStore } from '@/store/retos-store';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';

// Esta línea sirve para declarar la función «ProgressFill».
function ProgressFill({ pct, color }: { pct: number; color: string }) {
  // Esta línea sirve para obtener «width» con el hook «useSharedValue».
  const width = useSharedValue(0);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para asignar «withTiming(pct, { duration: 700 })» a «width.value».
    width.value = withTiming(pct, { duration: 700 });
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «pct, width».
  }, [pct, width]);

  // Esta línea sirve para obtener «style» con el hook «useAnimatedStyle».
  const style = useAnimatedStyle(() => ({ width: `${width.value}%` }));

  // Esta línea sirve para devolver la barra de progreso animada con el color y el estilo recibidos.
  return <Animated.View style={[styles.progressFill, { backgroundColor: color }, style]} />;
}

// Esta línea sirve para declarar «METRIC_LABEL» con el valor «{».
const METRIC_LABEL: Record<Challenge['criteria']['metric'], string> = {
  // Esta línea sirve para declarar la propiedad «workouts_count» con el valor o tipo «'entrenamientos'».
  workouts_count: 'entrenamientos',
  // Esta línea sirve para declarar la propiedad «total_volume_kg» con el valor o tipo «'kg de volumen'».
  total_volume_kg: 'kg de volumen',
};

// Esta línea sirve para declarar la función «daysRemaining».
function daysRemaining(endsAt: string): number {
  // Esta línea sirve para extraer «» de «new Date(endsAt).getTime() - Date.now()».
  const ms = new Date(endsAt).getTime() - Date.now();
  // Esta línea sirve para devolver «Math.max(0, Math.ceil(ms / 86_400_000))».
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

// Esta línea sirve para declarar la función «Leaderboard».
function Leaderboard() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «leaderboard» con el hook «useRetosStore».
  const leaderboard = useRetosStore((s) => s.leaderboard);

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.leaderboard}>
      {/* Esta línea sirve para mostrar el elemento solo si «leaderboard === null». */}
      {leaderboard === null && <Skeleton height={72} borderRadius={Spacing.three} />}
      {/* Esta línea sirve para mostrar el bloque solo si «leaderboard?.length === 0». */}
      {leaderboard?.length === 0 && (
        // Esta línea sirve para abrir el componente «ThemedText».
        <ThemedText type="small" themeColor="textSecondary">
          {/* Esta línea sirve para mostrar el texto «Todavía nadie tiene progreso en este reto.». */}
          Todavía nadie tiene progreso en este reto.
        </ThemedText>
      )}
      {/* Esta línea sirve para recorrer «leaderboard?» y mostrar un bloque por elemento. */}
      {leaderboard?.map((entry) => (
        // Esta línea sirve para abrir el elemento «ThemedView» con sus atributos en varias líneas.
        <ThemedView
          // Esta línea sirve para identificar el elemento de la lista con «entry.user_id}».
          key={entry.user_id}
          // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.listRow, entry.is_viewer && { backgro».
          style={[styles.listRow, entry.is_viewer && { backgroundColor: theme.backgroundSelected }]}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small">
            {/* Esta línea sirve para mostrar el contenido dinámico «{entry.rank}. {entry.user_name}». */}
            {entry.rank}. {entry.user_name}
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="smallBold" style={{ color: theme.accent }}>
            {/* Esta línea sirve para mostrar el contenido dinámico «{entry.progress_value.toLocaleString('es-AR')}». */}
            {entry.progress_value.toLocaleString('es-AR')}
          </ThemedText>
        </ThemedView>
      ))}
    </ThemedView>
  );
}

// Esta línea sirve para declarar la función «ChallengeHero».
function ChallengeHero({ challenge }: { challenge: Challenge }) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener el reto activo y las acciones del store de retos.
  const { activeChallengeId, join, openLeaderboard, closeLeaderboard } = useRetosStore();
  // Esta línea sirve para extraer «xpande» de «activeChallengeId === challenge.id».
  const expanded = activeChallengeId === challenge.id;
  // Esta línea sirve para extraer «rogressPc» de «challenge.progress_value !== null».
  const progressPct = challenge.progress_value !== null
    // Esta línea sirve para calcular el porcentaje de progreso.
    ? Math.min(100, Math.round((challenge.progress_value / challenge.criteria.target) * 100))
    // Esta línea sirve para usar cero si el usuario no tiene progreso.
    : 0;
  // Esta línea sirve para extraer «aysLef» de «daysRemaining(challenge.ends_at)».
  const daysLeft = daysRemaining(challenge.ends_at);

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «ThemedView» con sus atributos en varias líneas.
    <ThemedView
      // Esta línea sirve para pasar la propiedad «style» con el valor «[».
      style={[
        // Esta línea sirve para agregar el estilo «styles.hero».
        styles.hero,
        // Esta línea sirve para agregar un elemento cuyo «borderColor» es «`${theme.accent}40`, backgroundColor: `$…».
        { borderColor: `${theme.accent}40`, backgroundColor: `${theme.accent}14` },
        // Esta línea sirve para aplicar el brillo del color de acento.
        glowShadow(theme.accent),
      ]}>
      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView style={styles.heroHeader}>
        {/* Esta línea sirve para abrir el componente «ThemedView». */}
        <ThemedView style={[styles.heroIcon, { backgroundColor: `${theme.accent}26` }]}>
          {/* Esta línea sirve para abrir el componente «Flame». */}
          <Flame size={20} color={theme.accent} />
        </ThemedView>
        {/* Esta línea sirve para abrir el componente «ThemedView». */}
        <ThemedView style={styles.heroTitleBlock}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="smallBold" style={[styles.eyebrow, { color: theme.accent }]}>
            {/* Esta línea sirve para mostrar el texto «TU DESAFÍO ACTUAL». */}
            TU DESAFÍO ACTUAL
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="subtitle" style={styles.heroTitle}>
            {/* Esta línea sirve para mostrar el valor «challenge.title». */}
            {challenge.title}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="small" themeColor="textSecondary">
        {/* Esta línea sirve para mostrar el valor «challenge.description». */}
        {challenge.description}
      </ThemedText>

      {/* Esta línea sirve para mostrar el bloque solo si «challenge.joined». */}
      {challenge.joined && (
        // Esta línea sirve para abrir el componente «ThemedView».
        <ThemedView style={styles.progressBlock}>
          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={[styles.progressTrack, { backgroundColor: theme.backgroundSelected }]}>
            {/* Esta línea sirve para abrir el componente «ProgressFill». */}
            <ProgressFill pct={progressPct} color={theme.accent} />
          </ThemedView>
          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={styles.progressRow}>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="smallBold">
              {/* Esta línea sirve para mostrar el progreso, la meta y la métrica del reto. */}
              {challenge.progress_value ?? 0} / {challenge.criteria.target} {METRIC_LABEL[challenge.criteria.metric]}
            </ThemedText>
            {/* Esta línea sirve para elegir entre dos bloques según «challenge.completed». */}
            {challenge.completed ? (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="smallBold" style={{ color: theme.accent }}>
                {/* Esta línea sirve para mostrar el texto «¡Completado!». */}
                ¡Completado!
              </ThemedText>
            // Esta línea sirve para mostrar el bloque alternativo.
            ) : (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el contenido dinámico «{daysLeft} días restantes». */}
                {daysLeft} días restantes
              </ThemedText>
            )}
          </ThemedView>
        </ThemedView>
      )}

      {/* Esta línea sirve para mostrar el bloque solo si «!challenge.joined». */}
      {!challenge.joined && (
        // Esta línea sirve para abrir el componente «ThemedText».
        <ThemedText type="small" themeColor="textSecondary">
          {/* Esta línea sirve para mostrar el contenido dinámico «{daysLeft} días restantes». */}
          {daysLeft} días restantes
        </ThemedText>
      )}

      {/* Esta línea sirve para elegir entre dos bloques según «challenge.joined». */}
      {challenge.joined ? (
        // Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas.
        <PrimaryButton
          // Esta línea sirve para pasar la propiedad «label» con el valor «expanded ? 'Ocultar tabla' : 'Ver tabla'}».
          label={expanded ? 'Ocultar tabla' : 'Ver tabla'}
          // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
          variant="ghost"
          // Esta línea sirve para asignar el manejador del evento «onPress».
          onPress={() => (expanded ? closeLeaderboard() : openLeaderboard(challenge.id))}
        />
      // Esta línea sirve para mostrar el bloque alternativo.
      ) : (
        // Esta línea sirve para mostrar el componente «PrimaryButton».
        <PrimaryButton label="Unirme" onPress={() => join(challenge.id)} />
      )}

      {/* Esta línea sirve para mostrar el elemento solo si «expanded». */}
      {expanded && <Leaderboard />}
    </ThemedView>
  );
}

// Esta línea sirve para declarar la función «ChallengeCard».
function ChallengeCard({ challenge }: { challenge: Challenge }) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener el reto activo y las acciones del store de retos.
  const { activeChallengeId, join, openLeaderboard, closeLeaderboard } = useRetosStore();
  // Esta línea sirve para extraer «xpande» de «activeChallengeId === challenge.id».
  const expanded = activeChallengeId === challenge.id;
  // Esta línea sirve para extraer «rogressPc» de «challenge.progress_value !== null».
  const progressPct = challenge.progress_value !== null
    // Esta línea sirve para calcular el porcentaje de progreso.
    ? Math.min(100, Math.round((challenge.progress_value / challenge.criteria.target) * 100))
    // Esta línea sirve para usar cero si el usuario no tiene progreso.
    : 0;

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView type="backgroundElement" style={styles.card}>
      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="small" themeColor="textSecondary" style={styles.eyebrow}>
        {/* Esta línea sirve para mostrar el contenido dinámico «{challenge.type === 'weekly' ? 'SEMANAL' : 'MENSUAL'}». */}
        {challenge.type === 'weekly' ? 'SEMANAL' : 'MENSUAL'}
      </ThemedText>
      {/* Esta línea sirve para mostrar el valor «challenge.title» dentro de «ThemedText». */}
      <ThemedText type="smallBold">{challenge.title}</ThemedText>
      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="small" themeColor="textSecondary">
        {/* Esta línea sirve para mostrar el valor «challenge.description». */}
        {challenge.description}
      </ThemedText>

      {/* Esta línea sirve para mostrar el bloque solo si «challenge.joined». */}
      {challenge.joined && (
        // Esta línea sirve para abrir el componente «ThemedView».
        <ThemedView style={styles.progressBlock}>
          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={styles.progressRow}>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el progreso, la meta y la métrica del reto. */}
              {challenge.progress_value ?? 0} / {challenge.criteria.target} {METRIC_LABEL[challenge.criteria.metric]}
            </ThemedText>
            {/* Esta línea sirve para mostrar el bloque solo si «challenge.completed». */}
            {challenge.completed && (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="smallBold" style={{ color: theme.accent }}>
                {/* Esta línea sirve para mostrar el texto «¡Completado!». */}
                ¡Completado!
              </ThemedText>
            )}
          </ThemedView>
          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={[styles.progressTrack, { backgroundColor: theme.backgroundSelected }]}>
            {/* Esta línea sirve para abrir el componente «ProgressFill». */}
            <ProgressFill pct={progressPct} color={theme.accent} />
          </ThemedView>
        </ThemedView>
      )}

      {/* Esta línea sirve para elegir entre dos bloques según «challenge.joined». */}
      {challenge.joined ? (
        // Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas.
        <PrimaryButton
          // Esta línea sirve para pasar la propiedad «label» con el valor «expanded ? 'Ocultar tabla' : 'Ver tabla'}».
          label={expanded ? 'Ocultar tabla' : 'Ver tabla'}
          // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
          variant="ghost"
          // Esta línea sirve para asignar el manejador del evento «onPress».
          onPress={() => (expanded ? closeLeaderboard() : openLeaderboard(challenge.id))}
        />
      // Esta línea sirve para mostrar el bloque alternativo.
      ) : (
        // Esta línea sirve para mostrar el componente «PrimaryButton».
        <PrimaryButton label="Unirme" onPress={() => join(challenge.id)} />
      )}

      {/* Esta línea sirve para mostrar el elemento solo si «expanded». */}
      {expanded && <Leaderboard />}
    </ThemedView>
  );
}

// Esta línea sirve para declarar la función «RetosScreen».
export default function RetosScreen() {
  // Esta línea sirve para obtener «userId» con el hook «useAuthStore».
  const userId = useAuthStore((s) => s.user?.id);
  // Esta línea sirve para obtener los retos y las acciones del store de retos.
  const { challenges, isLoading, error, load, closeLeaderboard, justCompleted, dismissCelebration } = useRetosStore();

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «load».
    load();
    // Esta línea sirve para devolver «() => closeLeaderboard()».
    return () => closeLeaderboard();
    // Esta línea sirve para volver a ejecutar el efecto cuando cambian «».
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Esta línea sirve para crear la referencia «titleRef».
  const titleRef = useRef<View>(null);
  // Esta línea sirve para obtener «tutorial» con el hook «useTutorial».
  const tutorial = useTutorial(
    // Esta línea sirve para incluir el texto o las clases «retos…».
    'retos',
    [
      {
        // Esta línea sirve para declarar la propiedad «ref» con el valor o tipo «titleRef».
        ref: titleRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «'Retos SanKen'».
        title: 'Retos SanKen',
        // Esta línea sirve para definir la propiedad «description» con «Desafíos semanales y mensuales para mant…».
        description: 'Desafíos semanales y mensuales para mantenerte motivado, con tabla de posiciones en vivo.',
      },
      {
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «'Unite y trackeá tu progreso'».
        title: 'Unite y trackeá tu progreso',
        // Esta línea sirve para definir la propiedad «description» con «Al unirte a un reto, tu avance se calcul…».
        description: 'Al unirte a un reto, tu avance se calcula solo con cada entrenamiento que ya registrás.',
      },
      {
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «'¡Celebralo al completarlo!'».
        title: '¡Celebralo al completarlo!',
        // Esta línea sirve para definir la propiedad «description» con «Cuando cumplas el objetivo vas a ver una…».
        description: 'Cuando cumplas el objetivo vas a ver una celebración especial 🎉 y quedás en el ranking.',
      },
    ],
    // Esta línea sirve para indicar que la carga ya terminó.
    !isLoading,
    // Esta línea sirve para incluir el valor «userId» en la lista.
    userId,
  );

  // Esta línea sirve para extraer «orte» de «[...challenges].sort(».
  const sorted = [...challenges].sort(
    // Esta línea sirve para ordenar por fecha de fin ascendente.
    (a, b) => new Date(a.ends_at).getTime() - new Date(b.ends_at).getTime(),
  );
  // Esta línea sirve para extraer «urren» de «sorted.find((c) => c.joined && !c.comple».
  const current = sorted.find((c) => c.joined && !c.completed) ?? sorted[0];
  // Esta línea sirve para extraer «es» de «sorted.filter((c) => c.id !== current?.i».
  const rest = sorted.filter((c) => c.id !== current?.id);

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «ChallengeCompleteCelebration». */}
      <ChallengeCompleteCelebration challenge={justCompleted} onDismiss={dismissCelebration} />
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «ScrollView». */}
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          {/* Esta línea sirve para abrir el componente «View». */}
          <View ref={titleRef}>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="title" style={styles.pageTitle}>
              {/* Esta línea sirve para mostrar el texto «Retos». */}
              Retos
            </ThemedText>
          </View>

          {/* Esta línea sirve para mostrar el elemento solo si «error && !isLoading». */}
          {error && !isLoading && <ErrorState message={error} onRetry={load} />}

          {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
          {isLoading && <Skeleton height={140} borderRadius={Spacing.four} />}

          {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && !error && sorted.length === 0». */}
          {!isLoading && !error && sorted.length === 0 && (
            // Esta línea sirve para abrir el elemento «EmptyState» con sus atributos en varias líneas.
            <EmptyState
              // Esta línea sirve para pasar la propiedad «icon» con el valor «Flag}».
              icon={Flag}
              // Esta línea sirve para definir el atributo «title» con el valor «No hay retos activos en este momento».
              title="No hay retos activos en este momento"
              // Esta línea sirve para definir el atributo «description».
              description="Vuelve pronto — se generan nuevos retos cada semana y cada mes."
            />
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «current». */}
          {current && (
            // Esta línea sirve para abrir el componente «Animated.View».
            <Animated.View entering={FadeInUp.delay(0).duration(320)}>
              {/* Esta línea sirve para abrir el componente «ChallengeHero». */}
              <ChallengeHero challenge={current} />
            </Animated.View>
          )}

          {/* Esta línea sirve para recorrer «rest» y mostrar un bloque por elemento. */}
          {rest.map((challenge, index) => (
            // Esta línea sirve para abrir el componente «Animated.View».
            <Animated.View key={challenge.id} entering={FadeInUp.delay(80 + index * 60).duration(280)}>
              {/* Esta línea sirve para abrir el componente «ChallengeCard». */}
              <ChallengeCard challenge={challenge} />
            </Animated.View>
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* Esta línea sirve para abrir el componente «TutorialOverlay». */}
      <TutorialOverlay tutorial={tutorial} />
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
  // Esta línea sirve para declarar la propiedad «hero» con el valor o tipo «{».
  hero: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «heroHeader» con el valor o tipo «{».
  heroHeader: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «heroIcon» con el valor o tipo «{».
  heroIcon: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «38».
    width: 38,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «38».
    height: 38,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «19».
    borderRadius: 19,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
  // Esta línea sirve para declarar la propiedad «heroTitleBlock» con el valor o tipo «{».
  heroTitleBlock: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «heroTitle» con el valor o tipo «{».
  heroTitle: {
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «19».
    fontSize: 19,
    // Esta línea sirve para declarar la propiedad «lineHeight» con el valor o tipo «24».
    lineHeight: 24,
  },
  // Esta línea sirve para declarar la propiedad «card» con el valor o tipo «{».
  card: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para copiar las propiedades de «CardShadow».
    ...CardShadow,
  },
  // Esta línea sirve para declarar la propiedad «eyebrow» con el valor o tipo «{ letterSpacing: 1 }».
  eyebrow: { letterSpacing: 1 },
  // Esta línea sirve para definir el estilo «progressBlock» con «gap: Spacing.one, backgroundColor: 'transparent' }…».
  progressBlock: { gap: Spacing.one, backgroundColor: 'transparent' },
  // Esta línea sirve para definir el estilo «progressRow» con «flexDirection: 'row', justifyContent: 'space-betwe…».
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent' },
  // Esta línea sirve para definir el estilo «progressTrack» con «height: 6, borderRadius: 3, overflow: 'hidden' },…».
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  // Esta línea sirve para declarar la propiedad «progressFill» con el valor o tipo «{ height: '100%', borderRadius: 3 }».
  progressFill: { height: '100%', borderRadius: 3 },
  // Esta línea sirve para declarar la propiedad «leaderboard» con el valor o tipo «{».
  leaderboard: {
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.one».
    gap: Spacing.one,
    // Esta línea sirve para declarar la propiedad «borderTopWidth» con el valor o tipo «1».
    borderTopWidth: 1,
    // Esta línea sirve para declarar la propiedad «borderColor» con el valor o tipo «'rgba(128,128,128,0.2)'».
    borderColor: 'rgba(128,128,128,0.2)',
    // Esta línea sirve para declarar la propiedad «paddingTop» con el valor o tipo «Spacing.two».
    paddingTop: Spacing.two,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
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
  },
});
