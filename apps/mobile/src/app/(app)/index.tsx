// Esta línea sirve para importar «useEffect, useRef, useState» desde «react».
import { useEffect, useRef, useState } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «Image, Pressable, ScrollView, StyleSheet, View» desde «react-native».
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «LinearGradient» desde «expo-linear-gradient».
import { LinearGradient } from 'expo-linear-gradient';
// Esta línea sirve para importar «Animated» y «FadeInUp» desde «react-native-reanimated».
import Animated, { FadeInUp } from 'react-native-reanimated';
// Esta línea sirve para importar «Dumbbell, Menu, Moon, Sun» desde «lucide-react-native».
import { Dumbbell, Menu, Moon, Sun } from 'lucide-react-native';
// Esta línea sirve para importar «estimateWorkoutMinutes, formatUnlockCountdown» desde «@sanken/core».
import { estimateWorkoutMinutes, formatUnlockCountdown } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «ChallengesRow» desde «@/components/dashboard/challenges-row».
import { ChallengesRow } from '@/components/dashboard/challenges-row';
// Esta línea sirve para importar «DailyTipCard» desde «@/components/dashboard/daily-tip-card».
import { DailyTipCard } from '@/components/dashboard/daily-tip-card';
// Esta línea sirve para importar «PerformanceHero» desde «@/components/dashboard/performance-hero».
import { PerformanceHero } from '@/components/dashboard/performance-hero';
// Esta línea sirve para importar «StreakWidget» desde «@/components/dashboard/streak-widget».
import { StreakWidget } from '@/components/dashboard/streak-widget';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «ConfirmDialog» desde «@/components/ui/confirm-dialog».
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
// Esta línea sirve para importar «EmptyState» desde «@/components/ui/empty-state».
import { EmptyState } from '@/components/ui/empty-state';
// Esta línea sirve para importar «ErrorState» desde «@/components/ui/error-state».
import { ErrorState } from '@/components/ui/error-state';
// Esta línea sirve para importar «Icon» desde «@/components/ui/icon».
import { Icon } from '@/components/ui/icon';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';
// Esta línea sirve para importar «AnimatedLogoMark» desde «@/components/brand/animated-logo-mark».
import { AnimatedLogoMark } from '@/components/brand/animated-logo-mark';
// Esta línea sirve para importar «MoreMenu» desde «@/components/layout/more-menu».
import { MoreMenu } from '@/components/layout/more-menu';
// Esta línea sirve para importar «TutorialOverlay» desde «@/components/tutorial/tutorial-overlay».
import { TutorialOverlay } from '@/components/tutorial/tutorial-overlay';
// Esta línea sirve para importar «glowShadow, MaxContentWidth, Spacing» desde «@/constants/theme».
import { glowShadow, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useResolvedColorScheme, useTheme» desde «@/hooks/use-theme».
import { useResolvedColorScheme, useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useTutorial» desde «@/hooks/use-tutorial».
import { useTutorial } from '@/hooks/use-tutorial';
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';
// Esta línea sirve para importar «useDashboardStore» desde «@/store/dashboard-store».
import { useDashboardStore } from '@/store/dashboard-store';
// Esta línea sirve para importar «useFeedStore» desde «@/store/feed-store».
import { useFeedStore } from '@/store/feed-store';
// Esta línea sirve para importar «useGamificationStore» desde «@/store/gamification-store».
import { useGamificationStore } from '@/store/gamification-store';
// Esta línea sirve para importar «findNearestChallenge, useRetosStore» desde «@/store/retos-store».
import { findNearestChallenge, useRetosStore } from '@/store/retos-store';
// Esta línea sirve para importar «findNextDay, useRoutineStore» desde «@/store/routine-store».
import { findNextDay, useRoutineStore } from '@/store/routine-store';
// Esta línea sirve para importar «useThemeStore» desde «@/store/theme-store».
import { useThemeStore } from '@/store/theme-store';
// Esta línea sirve para importar «useWorkoutHistoryStore» desde «@/store/workout-history-store».
import { useWorkoutHistoryStore } from '@/store/workout-history-store';
// Esta línea sirve para importar «useWorkoutStore» desde «@/store/workout-store».
import { useWorkoutStore } from '@/store/workout-store';

/** Ancho del isotipo animado de la tarjeta de marca. */
// Esta línea sirve para declarar «BRAND_MARK_WIDTH» con el valor «76».
const BRAND_MARK_WIDTH = 76;

// Esta línea sirve para declarar la función «greeting».
function greeting() {
  // Esta línea sirve para extraer «ou» de «new Date().getHours()».
  const hour = new Date().getHours();
  // Esta línea sirve para devolver «'Buenos días'» si «hour < 12».
  if (hour < 12) return 'Buenos días';
  // Esta línea sirve para devolver «'Buenas tardes'» si «hour < 19».
  if (hour < 19) return 'Buenas tardes';
  // Esta línea sirve para devolver «'Buenas noches'».
  return 'Buenas noches';
}

// Esta línea sirve para declarar la función «HomeScreen».
export default function HomeScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «isDark» con el hook «useResolvedColorScheme».
  const isDark = useResolvedColorScheme() === 'dark';
  // Esta línea sirve para obtener «setThemeMode» con el hook «useThemeStore».
  const setThemeMode = useThemeStore((s) => s.setMode);
  // Esta línea sirve para obtener «user» con el hook «useAuthStore».
  const user = useAuthStore((s) => s.user);
  // Esta línea sirve para obtener la rutina, el bloqueo diario y las acciones del store de rutina.
  const { routine, nextDayId, dailyLock, isLoading, hasNoRoutine, error, load } = useRoutineStore();
  // Esta línea sirve para obtener «unreadFeedCount» con el hook «useFeedStore».
  const unreadFeedCount = useFeedStore((s) => s.unreadCount);
  // Esta línea sirve para obtener «resumeWorkout» con el hook «useWorkoutStore».
  const resumeWorkout = useWorkoutStore((s) => s.resume);
  // Esta línea sirve para obtener «stats, isLoadingStats, loadStats» con el hook «useDashboardStore».
  const { stats, isLoadingStats, loadStats } = useDashboardStore();
  // Esta línea sirve para obtener el resumen de gamificación y su estado de carga.
  const { summary, isLoading: isLoadingGamification, loadSummary } = useGamificationStore();
  // Esta línea sirve para obtener «sessions, load: loadHistory» con el hook «useWorkoutHistoryStore».
  const { sessions, load: loadHistory } = useWorkoutHistoryStore();
  // Esta línea sirve para obtener «challenges, load: loadChallenges» con el hook «useRetosStore».
  const { challenges, load: loadChallenges } = useRetosStore();
  // Esta línea sirve para crear el estado «confirmingSkip» y su función «setConfirmingSkip».
  const [confirmingSkip, setConfirmingSkip] = useState(false);
  // Esta línea sirve para crear el estado «isSkipping» y su función «setIsSkipping».
  const [isSkipping, setIsSkipping] = useState(false);
  // Esta línea sirve para crear el estado «moreMenuVisible» y su función «setMoreMenuVisible».
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);

  // Esta línea sirve para crear la referencia «brandCardRef».
  const brandCardRef = useRef<View>(null);
  // Esta línea sirve para crear la referencia «menuButtonRef».
  const menuButtonRef = useRef<View>(null);
  // Esta línea sirve para obtener «tutorial» con el hook «useTutorial».
  const tutorial = useTutorial(
    // Esta línea sirve para incluir el texto o las clases «inicio…».
    'inicio',
    [
      {
        // Esta línea sirve para declarar la propiedad «ref» con el valor o tipo «brandCardRef».
        ref: brandCardRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «'¡Bienvenido a SanKen! 👋'».
        title: '¡Bienvenido a SanKen! 👋',
        // Esta línea sirve para definir la propiedad «description» con «Este es tu punto de partida: acá vas a v…».
        description: 'Este es tu punto de partida: acá vas a ver tu entrenamiento del día, tu racha y tu progreso general.',
      },
      {
        // Esta línea sirve para declarar la propiedad «ref» con el valor o tipo «menuButtonRef».
        ref: menuButtonRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «'Todo lo demás está acá'».
        title: 'Todo lo demás está acá',
        // Esta línea sirve para definir la propiedad «description» con «Desde este menú accedés a Nutrición, Cal…».
        description: 'Desde este menú accedés a Nutrición, Calendario, Chat, Mi Entrenador y más opciones.',
      },
      {
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «'Explorá la barra inferior'».
        title: 'Explorá la barra inferior',
        // Esta línea sirve para definir la propiedad «description» con «Progreso, Tienda, PR y tu Perfil están s…».
        description: 'Progreso, Tienda, PR y tu Perfil están siempre a un toque de distancia, abajo de la pantalla.',
      },
    ],
    // Esta línea sirve para indicar que la carga ya terminó.
    !isLoading,
    // Esta línea sirve para pasar el id del usuario.
    user?.id,
  );

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «load».
    load();
    // Esta línea sirve para llamar a «loadStats».
    loadStats();
    // Esta línea sirve para llamar a «loadSummary».
    loadSummary();
    // Esta línea sirve para llamar a «loadHistory».
    loadHistory();
    // Esta línea sirve para llamar a «loadChallenges».
    loadChallenges();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «load, loadStats, loadSummary, loadHistory, loadChallenges».
  }, [load, loadStats, loadSummary, loadHistory, loadChallenges]);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Si la app se cerró a mitad de un entrenamiento, retoma esa sesión en
    // vez de dejar que el usuario tenga que empezar una nueva desde cero
    // (sección 3 del pedido: cerrar/recargar no debe perder el progreso).
    // Esta línea sirve para reanudar un entrenamiento en curso si existe.
    resumeWorkout().then((resumed) => {
      // Esta línea sirve para navegar a la sesión de entrenamiento si se reanudó.
      if (resumed) router.replace('/workout/session');
    });
    // Esta línea sirve para volver a ejecutar el efecto cuando cambian «».
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Esta línea sirve para extraer «a» de «findNextDay(routine, nextDayId)».
  const day = findNextDay(routine, nextDayId);

  // El backend (daily_lock, ver DetermineDailyLockStatusAction en la API) es
  // la única autoridad sobre si hoy ya se "gastó" el turno — nunca se deriva
  // de la fecha local del dispositivo. Cuando locked=true por haber
  // completado, la sesión de hoy es siempre la más reciente no cancelada
  // (no puede haber ninguna con performed_at más nueva que la de hoy).
  // Esta línea sirve para extraer «odaysSessio» de «dailyLock.reason === 'completed' ? sessi».
  const todaysSession = dailyLock.reason === 'completed' ? sessions.find((s) => s.completed && !s.cancelled) ?? null : null;
  // Esta línea sirve para extraer «earestChalleng» de «findNearestChallenge(challenges)».
  const nearestChallenge = findNearestChallenge(challenges);

  // El valor en sí se deriva en cada render a partir de dailyLock (nunca se
  // guarda en estado aparte, evita duplicar la fuente de verdad) — este
  // estado solo fuerza un re-render cada 30s mientras está bloqueado para
  // refrescar ese cálculo. Puramente visual: cuando llega a 0 volvemos a
  // pedir /routines/active para confirmar el desbloqueo real en vez de
  // confiar en el conteo del propio dispositivo (que el usuario podría
  // haber atrasado/adelantado).
  // Esta línea sirve para extraer «, forceCountdownTick» de «useState(0)».
  const [, forceCountdownTick] = useState(0);
  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para salir de la función si «!dailyLock.locked || !dailyLock.unlocks_at».
    if (!dailyLock.locked || !dailyLock.unlocks_at) return;
    // Esta línea sirve para extraer «nterva» de «setInterval(() => {».
    const interval = setInterval(() => {
      // Esta línea sirve para revisar si «formatUnlockCountdown(dailyLock.unlocks_at)».
      if (formatUnlockCountdown(dailyLock.unlocks_at)) {
        // Esta línea sirve para llamar a «forceCountdownTick» con «(n) => n + 1».
        forceCountdownTick((n) => n + 1);
      // Esta línea sirve para ejecutar este bloque en el caso contrario.
      } else {
        // Esta línea sirve para llamar a «load».
        load();
      }
    // Esta línea sirve para volver a ejecutar el efecto cuando cambian «0_00».
    }, 30_000);
    // Esta línea sirve para devolver «() => clearInterval(interval)».
    return () => clearInterval(interval);
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «dailyLock.locked, dailyLock.unlocks_at, load».
  }, [dailyLock.locked, dailyLock.unlocks_at, load]);
  // Esta línea sirve para extraer «ountdow» de «dailyLock.locked ? formatUnlockCountdown».
  const countdown = dailyLock.locked ? formatUnlockCountdown(dailyLock.unlocks_at) : null;

  // Esta línea sirve para extraer «andleSki» de «async () => {».
  const handleSkip = async () => {
    // Esta línea sirve para guardar en el estado con «setIsSkipping» el valor «true)…».
    setIsSkipping(true);
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «api.post».
      await api.post('/workout-sessions/skip', { routine_day_id: day?.id ?? null });
      // Esta línea sirve para guardar en el estado con «setConfirmingSkip» el valor «false)…».
      setConfirmingSkip(false);
      // Esta línea sirve para esperar el resultado de «load».
      await load();
    // Esta línea sirve para ejecutar siempre al terminar el bloque anterior.
    } finally {
      // Esta línea sirve para guardar en el estado con «setIsSkipping» el valor «false)…».
      setIsSkipping(false);
    }
  };

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.container}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «ScrollView». */}
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Esta línea sirve para abrir el componente «ThemedView». */}
        <ThemedView style={styles.header}>
          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={{ backgroundColor: 'transparent' }}>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary" style={styles.greetingLabel}>
              {/* Esta línea sirve para mostrar el contenido dinámico «{greeting().toUpperCase()}». */}
              {greeting().toUpperCase()}
            </ThemedText>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="title" style={styles.title}>
              {/* Esta línea sirve para mostrar el contenido dinámico «{user?.name.split(' ')[0]}». */}
              {user?.name.split(' ')[0]}
            </ThemedText>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el texto «¿Listo para entrenar?». */}
              ¿Listo para entrenar?
            </ThemedText>
          </ThemedView>
          {/* Esta línea sirve para abrir el componente «View». */}
          <View style={styles.headerActions}>
            {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
            <Pressable
              // Esta línea sirve para asignar el manejador del evento «onPress».
              onPress={() => setThemeMode(isDark ? 'light' : 'dark')}
              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.menuButton, { backgroundColor: theme.».
              style={[styles.menuButton, { backgroundColor: theme.backgroundElement }]}
              // Esta línea sirve para pasar la propiedad «accessibilityLabel» con el valor «isDark ? 'Cambiar a modo claro' : 'Cambiar a ».
              accessibilityLabel={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
              {/* Esta línea sirve para abrir el componente «Icon». */}
              <Icon icon={isDark ? Sun : Moon} size={20} color={theme.text} />
            </Pressable>
            {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
            <Pressable
              // Esta línea sirve para conectar la referencia «menuButtonRef}» con el elemento.
              ref={menuButtonRef}
              // Esta línea sirve para asignar el manejador del evento «onPress».
              onPress={() => setMoreMenuVisible(true)}
              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.menuButton, { backgroundColor: theme.».
              style={[styles.menuButton, { backgroundColor: theme.backgroundElement }]}>
              {/* Esta línea sirve para abrir el componente «Menu». */}
              <Menu size={20} color={theme.text} />
              {/* Esta línea sirve para mostrar el bloque solo si «unreadFeedCount > 0». */}
              {unreadFeedCount > 0 && (
                // Esta línea sirve para abrir el componente «ThemedView».
                <ThemedView style={[styles.menuBadge, { backgroundColor: theme.accent, borderColor: theme.background }]} />
              )}
            </Pressable>
          </View>
        </ThemedView>

        {/* Tarjeta de marca compacta: logo + lema centrados, siempre visible. */}
        {/* Esta línea sirve para abrir el componente «Animated.View». */}
        <Animated.View entering={FadeInUp.duration(360)}>
          {/* Esta línea sirve para abrir el elemento «ThemedView» con sus atributos en varias líneas. */}
          <ThemedView
            // Esta línea sirve para conectar la referencia «brandCardRef}» con el elemento.
            ref={brandCardRef}
            // Esta línea sirve para definir el atributo «type» con el valor «backgroundElement».
            type="backgroundElement"
            // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.brandCard, { borderColor: `${theme.ac».
            style={[styles.brandCard, { borderColor: `${theme.accent}30` }, glowShadow(theme.accent)]}>
            {/* Esta línea sirve para abrir el elemento «LinearGradient» con sus atributos en varias líneas. */}
            <LinearGradient
              // Esta línea sirve para pasar la propiedad «colors» con el valor «[`${theme.accent}33`, `${theme.accent}00`]}».
              colors={[`${theme.accent}33`, `${theme.accent}00`]}
              // Esta línea sirve para pasar la propiedad «start» con el valor «{ x: 0, y: 0 }}».
              start={{ x: 0, y: 0 }}
              // Esta línea sirve para pasar la propiedad «end» con el valor «{ x: 1, y: 1 }}».
              end={{ x: 1, y: 1 }}
              // Esta línea sirve para pasar la propiedad «style» con el valor «StyleSheet.absoluteFill}».
              style={StyleSheet.absoluteFill}
            />
            {/* Esta línea sirve para mostrar el contenido dinámico «{/* Isotipo que se redibuja en bucle (misma técnica que la». */}
            {/* Isotipo que se redibuja en bucle (misma técnica que la
                // Esta línea sirve para continuar el comentario sobre el isotipo animado y el wordmark.
                intro de apertura) + el wordmark real debajo — la misma
                // Esta línea sirve para cerrar el comentario sobre la composición del logo.
                composición que logo-full.png. */}
            {/* Esta línea sirve para abrir el componente «View». */}
            <View style={styles.brandLogo} accessible accessibilityLabel="SanKen">
              {/* Esta línea sirve para abrir el componente «AnimatedLogoMark». */}
              <AnimatedLogoMark width={BRAND_MARK_WIDTH} onLight={!isDark} />
              {/* Esta línea sirve para abrir el elemento «Image» con sus atributos en varias líneas. */}
              <Image
                // Esta línea sirve para pasar la propiedad «source» con el valor «require('@/assets/images/brand-wordmark.png')».
                source={require('@/assets/images/brand-wordmark.png')}
                // Esta línea sirve para pasar la propiedad «style» con el valor «styles.brandWordmark}».
                style={styles.brandWordmark}
                // Esta línea sirve para definir el atributo «resizeMode» con el valor «contain».
                resizeMode="contain"
              />
            </View>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.brandSloganColumn}>
              {/* Esta línea sirve para recorrer «['ENTRENA', 'PROGRESA', 'SUPÉRATE']» y mostrar un bloque por elemento. */}
              {['ENTRENA', 'PROGRESA', 'SUPÉRATE'].map((word) => (
                // Esta línea sirve para abrir el componente «ThemedText».
                <ThemedText key={word} type="caption" style={[styles.brandSloganWord, { color: theme.accent }]}>
                  {/* Esta línea sirve para mostrar el valor «word». */}
                  {word}
                </ThemedText>
              ))}
            </ThemedView>
          </ThemedView>
        </Animated.View>

        {/* Esta línea sirve para mostrar el bloque solo si «error && !isLoading». */}
        {error && !isLoading && (
          // Esta línea sirve para abrir el componente «ThemedView».
          <ThemedView type="backgroundElement" style={styles.card}>
            {/* Esta línea sirve para abrir el componente «ErrorState». */}
            <ErrorState message={error} onRetry={load} />
          </ThemedView>
        )}

        {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
        {isLoading && <Skeleton height={168} borderRadius={Spacing.four} />}

        {/* Esta línea sirve para mostrar el bloque solo si «hasNoRoutine && !isLoading». */}
        {hasNoRoutine && !isLoading && (
          // Esta línea sirve para abrir el componente «ThemedView».
          <ThemedView type="backgroundElement" style={styles.card}>
            {/* Esta línea sirve para abrir el elemento «EmptyState» con sus atributos en varias líneas. */}
            <EmptyState
              // Esta línea sirve para pasar la propiedad «icon» con el valor «Dumbbell}».
              icon={Dumbbell}
              // Esta línea sirve para definir el atributo «title» con el valor «Generando tu plan».
              title="Generando tu plan"
              // Esta línea sirve para definir el atributo «description».
              description="Todavía estamos armando tu rutina. Vuelve en un momento."
            />
          </ThemedView>
        )}

        {/* Esta línea sirve para elegir entre dos bloques según «dailyLock.locked». */}
        {dailyLock.locked ? (
          // Esta línea sirve para abrir el componente «Animated.View».
          <Animated.View entering={FadeInUp.delay(0).duration(320)}>
            {/* Esta línea sirve para abrir el elemento «ThemedView» con sus atributos en varias líneas. */}
            <ThemedView
              // Esta línea sirve para pasar la propiedad «style» con el valor «[».
              style={[
                // Esta línea sirve para agregar el estilo «styles.todayCard».
                styles.todayCard,
                // Esta línea sirve para agregar un elemento cuyo «backgroundColor» es «`${theme.success}12`, borderColor: `${th…».
                { backgroundColor: `${theme.success}12`, borderColor: `${theme.success}35` },
                // Esta línea sirve para aplicar el brillo verde de éxito.
                glowShadow(theme.success),
              ]}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="smallBold" style={[styles.eyebrow, { color: theme.success }]}>
                {/* Esta línea sirve para mostrar el texto «ENTRENAMIENTO DE HOY». */}
                ENTRENAMIENTO DE HOY
              </ThemedText>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="title" style={styles.todayTitle}>
                {/* Esta línea sirve para mostrar si el entrenamiento fue saltado o completado. */}
                {dailyLock.reason === 'skipped' ? 'Entrenamiento saltado' : '¡Excelente trabajo! 💪'}
              </ThemedText>

              {/* Esta línea sirve para mostrar el bloque solo si «todaysSession». */}
              {todaysSession && (
                // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
                <>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor="textSecondary" style={styles.completedSubtitle}>
                    {/* Esta línea sirve para mostrar el nombre del día completado. */}
                    {todaysSession.routine_day_label ?? 'Entrenamiento'} completado
                  </ThemedText>

                  {/* Esta línea sirve para abrir el componente «ThemedView». */}
                  <ThemedView style={styles.todayStats}>
                    {/* Esta línea sirve para abrir el componente «ThemedView». */}
                    <ThemedView style={styles.todayStat}>
                      {/* Esta línea sirve para abrir el componente «ThemedText». */}
                      <ThemedText type="title" style={styles.todayStatValue}>
                        {/* Esta línea sirve para mostrar el contenido dinámico «{todaysSession.duration_minutes ?? 0}». */}
                        {todaysSession.duration_minutes ?? 0}
                      </ThemedText>
                      {/* Esta línea sirve para abrir el componente «ThemedText». */}
                      <ThemedText type="small" themeColor="textSecondary" style={styles.todayStatLabel}>
                        {/* Esta línea sirve para mostrar el texto «MIN». */}
                        MIN
                      </ThemedText>
                    </ThemedView>
                    {/* Esta línea sirve para abrir el componente «ThemedView». */}
                    <ThemedView style={styles.todayStat}>
                      {/* Esta línea sirve para abrir el componente «ThemedText». */}
                      <ThemedText type="title" style={styles.todayStatValue}>
                        {/* Esta línea sirve para mostrar el valor «todaysSession.exercises.length». */}
                        {todaysSession.exercises.length}
                      </ThemedText>
                      {/* Esta línea sirve para abrir el componente «ThemedText». */}
                      <ThemedText type="small" themeColor="textSecondary" style={styles.todayStatLabel}>
                        {/* Esta línea sirve para mostrar el texto «EJERCICIOS». */}
                        EJERCICIOS
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </>
              )}

              {/* Esta línea sirve para abrir el elemento «ThemedView» con sus atributos en varias líneas. */}
              <ThemedView
                // Esta línea sirve para pasar la propiedad «style» con el valor «[».
                style={[
                  // Esta línea sirve para agregar el estilo «styles.lockBanner».
                  styles.lockBanner,
                  // Esta línea sirve para agregar un elemento cuyo «backgroundColor» es «`${theme.textSecondary}14`, borderColor:…».
                  { backgroundColor: `${theme.textSecondary}14`, borderColor: `${theme.textSecondary}30` },
                ]}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="smallBold" style={{ color: theme.textSecondary }}>
                  {/* Esta línea sirve para mostrar el contenido dinámico «🔒 Próximo entrenamiento bloqueado». */}
                  🔒 Próximo entrenamiento bloqueado
                </ThemedText>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar la hora de desbloqueo y la cuenta regresiva. */}
                  Se desbloquea a las 00:00{countdown ? ` · Disponible en ${countdown}` : ''}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </Animated.View>
        // Esta línea sirve para mostrar el bloque alternativo.
        ) : (
          // Esta línea sirve para mostrar la tarjeta del día solo si hay día de entrenamiento.
          day && (
            // Esta línea sirve para abrir el componente «Animated.View».
            <Animated.View entering={FadeInUp.delay(0).duration(320)}>
              {/* Esta línea sirve para abrir el elemento «ThemedView» con sus atributos en varias líneas. */}
              <ThemedView
                // Esta línea sirve para pasar la propiedad «style» con el valor «[».
                style={[
                  // Esta línea sirve para agregar el estilo «styles.todayCard».
                  styles.todayCard,
                  // Esta línea sirve para agregar un elemento cuyo «backgroundColor» es «`${theme.accent}12`, borderColor: `${the…».
                  { backgroundColor: `${theme.accent}12`, borderColor: `${theme.accent}35` },
                  // Esta línea sirve para aplicar el brillo del color de acento.
                  glowShadow(theme.accent),
                ]}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="smallBold" style={[styles.eyebrow, { color: theme.accent }]}>
                  {/* Esta línea sirve para mostrar el texto «ENTRENAMIENTO DE HOY». */}
                  ENTRENAMIENTO DE HOY
                </ThemedText>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="title" style={styles.todayTitle}>
                  {/* Esta línea sirve para mostrar el valor «day.label». */}
                  {day.label}
                </ThemedText>

                {/* Esta línea sirve para abrir el componente «ThemedView». */}
                <ThemedView style={styles.todayStats}>
                  {/* Esta línea sirve para abrir el componente «ThemedView». */}
                  <ThemedView style={styles.todayStat}>
                    {/* Esta línea sirve para abrir el componente «ThemedText». */}
                    <ThemedText type="title" style={styles.todayStatValue}>
                      {/* Esta línea sirve para mostrar el contenido dinámico «{estimateWorkoutMinutes(day)}». */}
                      {estimateWorkoutMinutes(day)}
                    </ThemedText>
                    {/* Esta línea sirve para abrir el componente «ThemedText». */}
                    <ThemedText type="small" themeColor="textSecondary" style={styles.todayStatLabel}>
                      {/* Esta línea sirve para mostrar el texto «MIN». */}
                      MIN
                    </ThemedText>
                  </ThemedView>
                  {/* Esta línea sirve para abrir el componente «ThemedView». */}
                  <ThemedView style={styles.todayStat}>
                    {/* Esta línea sirve para abrir el componente «ThemedText». */}
                    <ThemedText type="title" style={styles.todayStatValue}>
                      {/* Esta línea sirve para mostrar el valor «day.exercises.length». */}
                      {day.exercises.length}
                    </ThemedText>
                    {/* Esta línea sirve para abrir el componente «ThemedText». */}
                    <ThemedText type="small" themeColor="textSecondary" style={styles.todayStatLabel}>
                      {/* Esta línea sirve para mostrar el texto «EJERCICIOS». */}
                      EJERCICIOS
                    </ThemedText>
                  </ThemedView>
                </ThemedView>

                {/* Esta línea sirve para abrir el componente «ThemedView». */}
                <ThemedView style={styles.spacer} />
                {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
                <PrimaryButton label="Comenzar" onPress={() => router.push('/workout/precheck')} />
                {/* Esta línea sirve para abrir el componente «ThemedView». */}
                <ThemedView style={styles.buttonGap} />
                {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
                <PrimaryButton
                  // Esta línea sirve para definir el atributo «label» con el valor «Saltar entrenamiento».
                  label="Saltar entrenamiento"
                  // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
                  variant="ghost"
                  // Esta línea sirve para asignar el manejador del evento «onPress».
                  onPress={() => setConfirmingSkip(true)}
                />
              </ThemedView>
            </Animated.View>
          )
        )}

        {/* Esta línea sirve para mostrar el bloque solo si «(stats?.current_streak_days ?? 0) > 0». */}
        {(stats?.current_streak_days ?? 0) > 0 && (
          // Esta línea sirve para abrir el componente «Animated.View».
          <Animated.View entering={FadeInUp.delay(40).duration(320)}>
            {/* Esta línea sirve para abrir el componente «StreakWidget». */}
            <StreakWidget streakDays={stats?.current_streak_days ?? 0} sessions={sessions} />
          </Animated.View>
        )}

        {/* Esta línea sirve para abrir el componente «Animated.View». */}
        <Animated.View entering={FadeInUp.delay(60).duration(320)}>
          {/* Esta línea sirve para abrir el componente «PerformanceHero». */}
          <PerformanceHero stats={stats} gamification={summary} isLoading={isLoadingStats || isLoadingGamification} />
        </Animated.View>

        {/* Esta línea sirve para mostrar el bloque solo si «nearestChallenge». */}
        {nearestChallenge && (
          // Esta línea sirve para abrir el componente «Animated.View».
          <Animated.View entering={FadeInUp.delay(90).duration(280)}>
            {/* Esta línea sirve para abrir el elemento «ThemedView» con sus atributos en varias líneas. */}
            <ThemedView
              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.challengeBanner, { backgroundColor: `».
              style={[styles.challengeBanner, { backgroundColor: `${theme.accent}14`, borderColor: `${theme.accent}35` }]}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" style={{ color: theme.accent }}>
                {/* Esta línea sirve para avisar que falta un entrenamiento para completar el reto. */}
                🎯 Te falta 1 entrenamiento para completar “{nearestChallenge.title}”.
              </ThemedText>
            </ThemedView>
          </Animated.View>
        )}

        {/* Esta línea sirve para abrir el componente «Animated.View». */}
        <Animated.View entering={FadeInUp.delay(100).duration(320)}>
          {/* Esta línea sirve para abrir el componente «DailyTipCard». */}
          <DailyTipCard />
        </Animated.View>

        {/* Esta línea sirve para abrir el componente «Animated.View». */}
        <Animated.View entering={FadeInUp.delay(120).duration(320)}>
          {/* Esta línea sirve para abrir el componente «ChallengesRow». */}
          <ChallengesRow />
        </Animated.View>

        {/* Esta línea sirve para abrir el elemento «ConfirmDialog» con sus atributos en varias líneas. */}
        <ConfirmDialog
          // Esta línea sirve para pasar la propiedad «visible» con el valor «confirmingSkip}».
          visible={confirmingSkip}
          // Esta línea sirve para definir el atributo «title».
          title="¿Seguro que quieres saltar este entrenamiento?"
          // Esta línea sirve para definir el atributo «description».
          description="No se va a registrar como completado — pasa directo al siguiente entrenamiento de tu rutina."
          // Esta línea sirve para definir el atributo «confirmLabel» con el valor «Sí, saltar».
          confirmLabel="Sí, saltar"
          // Esta línea sirve para pasar la propiedad «isLoading» con el valor «isSkipping}».
          isLoading={isSkipping}
          // Esta línea sirve para asignar el manejador del evento «onConfirm».
          onConfirm={handleSkip}
          // Esta línea sirve para asignar el manejador del evento «onCancel».
          onCancel={() => setConfirmingSkip(false)}
        />

        </ScrollView>
      </SafeAreaView>

      {/* Esta línea sirve para abrir el elemento «MoreMenu» con sus atributos en varias líneas. */}
      <MoreMenu
        // Esta línea sirve para pasar la propiedad «visible» con el valor «moreMenuVisible}».
        visible={moreMenuVisible}
        // Esta línea sirve para asignar el manejador del evento «onClose».
        onClose={() => setMoreMenuVisible(false)}
        // Esta línea sirve para pasar la propiedad «unreadFeedCount» con el valor «unreadFeedCount}».
        unreadFeedCount={unreadFeedCount}
      />

      {/* Esta línea sirve para abrir el componente «TutorialOverlay». */}
      <TutorialOverlay tutorial={tutorial} />
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «container» con el valor o tipo «{».
  container: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
  },
  // Esta línea sirve para declarar la propiedad «safeArea» con el valor o tipo «{».
  safeArea: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
  },
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
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingTop» con el valor o tipo «Spacing.three».
    paddingTop: Spacing.three,
    // Sin BottomTabInset: la barra inferior global (BottomTabBar) ocupa su
    // propio espacio debajo de la pantalla, no flota encima del contenido.
    // Esta línea sirve para declarar la propiedad «paddingBottom» con el valor o tipo «Spacing.three».
    paddingBottom: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «header» con el valor o tipo «{».
  header: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «greetingLabel» con el valor o tipo «{».
  greetingLabel: {
    // Esta línea sirve para declarar la propiedad «letterSpacing» con el valor o tipo «1».
    letterSpacing: 1,
    // Esta línea sirve para declarar la propiedad «marginBottom» con el valor o tipo «2».
    marginBottom: 2,
  },
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «{».
  title: {
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «24».
    fontSize: 24,
    // Esta línea sirve para declarar la propiedad «lineHeight» con el valor o tipo «30».
    lineHeight: 30,
  },
  // Esta línea sirve para declarar la propiedad «headerActions» con el valor o tipo «{».
  headerActions: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «menuButton» con el valor o tipo «{».
  menuButton: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «40».
    width: 40,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «40».
    height: 40,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «20».
    borderRadius: 20,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
  // Esta línea sirve para declarar la propiedad «menuBadge» con el valor o tipo «{».
  menuBadge: {
    // Esta línea sirve para declarar la propiedad «position» con el valor o tipo «'absolute'».
    position: 'absolute',
    // Esta línea sirve para declarar la propiedad «top» con el valor o tipo «2».
    top: 2,
    // Esta línea sirve para declarar la propiedad «right» con el valor o tipo «2».
    right: 2,
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «10».
    width: 10,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «10».
    height: 10,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «5».
    borderRadius: 5,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1.5».
    borderWidth: 1.5,
  },
  // Esta línea sirve para declarar la propiedad «brandCard» con el valor o tipo «{».
  brandCard: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.three».
    paddingHorizontal: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two».
    paddingVertical: Spacing.two,
    // Esta línea sirve para declarar la propiedad «overflow» con el valor o tipo «'hidden'».
    overflow: 'hidden',
  },
  // Esta línea sirve para declarar la propiedad «brandLogo» con el valor o tipo «{ alignItems: 'center', gap: 4 }».
  brandLogo: { alignItems: 'center', gap: 4 },
  // Proporción real de brand-wordmark.png (865×127).
  // Esta línea sirve para definir el estilo «brandWordmark» con «width: BRAND_MARK_WIDTH, height: BRAND_MARK_WIDTH …».
  brandWordmark: { width: BRAND_MARK_WIDTH, height: BRAND_MARK_WIDTH / (865 / 127) },
  // Esta línea sirve para declarar la propiedad «brandSloganColumn» con el valor o tipo «{».
  brandSloganColumn: {
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «brandSloganWord» con el valor o tipo «{».
  brandSloganWord: {
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «10».
    fontSize: 10,
    // Esta línea sirve para declarar la propiedad «lineHeight» con el valor o tipo «13».
    lineHeight: 13,
    // Esta línea sirve para declarar la propiedad «fontWeight» con el valor o tipo «'800'».
    fontWeight: '800',
    // Esta línea sirve para declarar la propiedad «letterSpacing» con el valor o tipo «2».
    letterSpacing: 2,
  },
  // Esta línea sirve para declarar la propiedad «centerText» con el valor o tipo «{ textAlign: 'center' }».
  centerText: { textAlign: 'center' },
  // Esta línea sirve para declarar la propiedad «card» con el valor o tipo «{».
  card: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.three».
    paddingHorizontal: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.three».
    paddingVertical: Spacing.three,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
  },
  // Esta línea sirve para declarar la propiedad «todayCard» con el valor o tipo «{».
  todayCard: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.four».
    paddingHorizontal: Spacing.four,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.four».
    paddingVertical: Spacing.four,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
  },
  // Esta línea sirve para declarar la propiedad «todayTitle» con el valor o tipo «{».
  todayTitle: {
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «24».
    fontSize: 24,
    // Esta línea sirve para declarar la propiedad «lineHeight» con el valor o tipo «30».
    lineHeight: 30,
    // Esta línea sirve para declarar la propiedad «marginBottom» con el valor o tipo «Spacing.three».
    marginBottom: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «completedSubtitle» con el valor o tipo «{».
  completedSubtitle: {
    // Esta línea sirve para declarar la propiedad «marginTop» con el valor o tipo «-Spacing.one».
    marginTop: -Spacing.one,
    // Esta línea sirve para declarar la propiedad «marginBottom» con el valor o tipo «Spacing.two».
    marginBottom: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «lockBanner» con el valor o tipo «{».
  lockBanner: {
    // Esta línea sirve para declarar la propiedad «marginTop» con el valor o tipo «Spacing.two».
    marginTop: Spacing.two,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.three».
    paddingHorizontal: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two».
    paddingVertical: Spacing.two,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «2».
    gap: 2,
  },
  // Esta línea sirve para declarar la propiedad «challengeBanner» con el valor o tipo «{».
  challengeBanner: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.three».
    paddingHorizontal: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two».
    paddingVertical: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «todayStats» con el valor o tipo «{».
  todayStats: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.four».
    gap: Spacing.four,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «todayStat» con el valor o tipo «{».
  todayStat: {
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «todayStatValue» con el valor o tipo «{».
  todayStatValue: {
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «26».
    fontSize: 26,
    // Esta línea sirve para declarar la propiedad «lineHeight» con el valor o tipo «30».
    lineHeight: 30,
  },
  // Esta línea sirve para declarar la propiedad «todayStatLabel» con el valor o tipo «{».
  todayStatLabel: {
    // Esta línea sirve para declarar la propiedad «letterSpacing» con el valor o tipo «0.5».
    letterSpacing: 0.5,
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «11».
    fontSize: 11,
  },
  // Esta línea sirve para declarar la propiedad «eyebrow» con el valor o tipo «{».
  eyebrow: {
    // Esta línea sirve para declarar la propiedad «letterSpacing» con el valor o tipo «1».
    letterSpacing: 1,
    // Esta línea sirve para declarar la propiedad «marginBottom» con el valor o tipo «Spacing.one».
    marginBottom: Spacing.one,
  },
  // `ThemedView` sin `type` pinta `theme.background` (el fondo general de
  // la app) por default — correcto para un contenedor de pantalla, pero
  // acá son simples espaciadores DENTRO de la card cian traslúcida
  // (`todayCard`). Sin este override quedaba un rectángulo del color de
  // fondo general de la app, mal encajado, arriba y abajo de "Comenzar" —
  // el mismo mecanismo que causaba el rectángulo reportado.
  // Esta línea sirve para definir el estilo «spacer» con «height: Spacing.three, backgroundColor: 'transpare…».
  spacer: { height: Spacing.three, backgroundColor: 'transparent' },
  // Esta línea sirve para definir el estilo «buttonGap» con «height: Spacing.two, backgroundColor: 'transparent…».
  buttonGap: { height: Spacing.two, backgroundColor: 'transparent' },
});
