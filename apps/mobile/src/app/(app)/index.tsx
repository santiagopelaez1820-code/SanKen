import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, type View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Dumbbell, Menu } from 'lucide-react-native';
import { estimateWorkoutMinutes } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ChallengesRow } from '@/components/dashboard/challenges-row';
import { PerformanceHero } from '@/components/dashboard/performance-hero';
import { StreakWidget } from '@/components/dashboard/streak-widget';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreMenu } from '@/components/layout/more-menu';
import { TutorialOverlay } from '@/components/tutorial/tutorial-overlay';
import { BottomTabInset, glowShadow, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTutorial } from '@/hooks/use-tutorial';
import { api } from '@/lib/api';
import { apiDateKey, toDateKey } from '@/lib/calendar-grid';
import { useAuthStore } from '@/store/auth-store';
import { useDashboardStore } from '@/store/dashboard-store';
import { useFeedStore } from '@/store/feed-store';
import { useGamificationStore } from '@/store/gamification-store';
import { findNearestChallenge, useRetosStore } from '@/store/retos-store';
import { findNextDay, useRoutineStore } from '@/store/routine-store';
import { useWorkoutHistoryStore } from '@/store/workout-history-store';
import { useWorkoutStore } from '@/store/workout-store';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function HomeScreen() {
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const { routine, nextDayId, isLoading, hasNoRoutine, error, load } = useRoutineStore();
  const unreadFeedCount = useFeedStore((s) => s.unreadCount);
  const resumeWorkout = useWorkoutStore((s) => s.resume);
  const { stats, isLoadingStats, loadStats } = useDashboardStore();
  const { summary, isLoading: isLoadingGamification, loadSummary } = useGamificationStore();
  const { sessions, load: loadHistory } = useWorkoutHistoryStore();
  const { challenges, load: loadChallenges } = useRetosStore();
  const [confirmingSkip, setConfirmingSkip] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);

  const brandCardRef = useRef<View>(null);
  const menuButtonRef = useRef<View>(null);
  const tutorial = useTutorial(
    'inicio',
    [
      {
        ref: brandCardRef,
        title: '¡Bienvenido a SanKen! 👋',
        description: 'Este es tu punto de partida: acá vas a ver tu entrenamiento del día, tu racha y tu progreso general.',
      },
      {
        ref: menuButtonRef,
        title: 'Todo lo demás está acá',
        description: 'Desde este menú accedés a Nutrición, Calendario, Chat, Mi Entrenador y más opciones.',
      },
      {
        title: 'Explorá la barra inferior',
        description: 'Progreso, Tienda, Retos y tu Perfil están siempre a un toque de distancia, abajo de la pantalla.',
      },
    ],
    !isLoading,
    user?.id,
  );

  useEffect(() => {
    load();
    loadStats();
    loadSummary();
    loadHistory();
    loadChallenges();
  }, [load, loadStats, loadSummary, loadHistory, loadChallenges]);

  useEffect(() => {
    // Si la app se cerró a mitad de un entrenamiento, retoma esa sesión en
    // vez de dejar que el usuario tenga que empezar una nueva desde cero
    // (sección 3 del pedido: cerrar/recargar no debe perder el progreso).
    resumeWorkout().then((resumed) => {
      if (resumed) router.replace('/workout/session');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const day = findNextDay(routine, nextDayId);

  // "Ya entrenaste hoy" se deriva del historial real (no de si `day`/`nextDayId`
  // ya rotó al próximo entrenamiento) — un split de 4 días rota el día
  // siguiente apenas se completa uno, así que sin esto la Home seguiría
  // mostrando "Comenzar" para el día ya entrenado en vez de felicitar al
  // usuario por el que sí completó.
  const todayKey = toDateKey(new Date());
  const todaysSession = sessions.find((s) => s.completed && !s.cancelled && apiDateKey(s.performed_at) === todayKey);
  const nearestChallenge = findNearestChallenge(challenges);

  const handleSkip = async () => {
    setIsSkipping(true);
    try {
      await api.post('/workout-sessions/skip', { routine_day_id: day?.id ?? null });
      setConfirmingSkip(false);
      await load();
    } finally {
      setIsSkipping(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.header}>
          <ThemedView style={{ backgroundColor: 'transparent' }}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.greetingLabel}>
              {greeting().toUpperCase()}
            </ThemedText>
            <ThemedText type="title" style={styles.title}>
              {user?.name.split(' ')[0]}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              ¿Listo para entrenar?
            </ThemedText>
          </ThemedView>
          <Pressable
            ref={menuButtonRef}
            onPress={() => setMoreMenuVisible(true)}
            style={[styles.menuButton, { backgroundColor: theme.backgroundElement }]}>
            <Menu size={20} color={theme.text} />
            {unreadFeedCount > 0 && (
              <ThemedView style={[styles.menuBadge, { backgroundColor: theme.accent, borderColor: theme.background }]} />
            )}
          </Pressable>
        </ThemedView>

        <Animated.View entering={FadeInUp.duration(360)}>
          <ThemedView
            ref={brandCardRef}
            type="backgroundElement"
            style={[styles.brandCard, { borderColor: `${theme.accent}30` }, glowShadow(theme.accent)]}>
            <LinearGradient
              colors={[`${theme.accent}33`, `${theme.accent}00`]}
              start={{ x: 0.15, y: 0 }}
              end={{ x: 0.85, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Image source={require('@/assets/images/logo-full.png')} style={styles.brandLogo} resizeMode="contain" />
            <ThemedView style={styles.brandSloganRow}>
              {['ENTRENA', 'PROGRESA', 'SUPÉRATE'].map((word, i) => (
                <ThemedView key={word} style={styles.brandSloganItem}>
                  {i > 0 && (
                    <ThemedView style={[styles.brandDot, { backgroundColor: theme.accent }]} />
                  )}
                  <ThemedText type="small" style={[styles.brandSloganWord, { color: theme.accent }]}>
                    {word}
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>
        </Animated.View>

        {error && !isLoading && (
          <ThemedView type="backgroundElement" style={styles.card}>
            <ErrorState message={error} onRetry={load} />
          </ThemedView>
        )}

        {isLoading && <Skeleton height={200} borderRadius={Spacing.four} />}

        {hasNoRoutine && !isLoading && (
          <ThemedView type="backgroundElement" style={styles.card}>
            <EmptyState
              icon={Dumbbell}
              title="Generando tu plan"
              description="Todavía estamos armando tu rutina. Vuelve en un momento."
            />
          </ThemedView>
        )}

        {todaysSession ? (
          <Animated.View entering={FadeInUp.delay(0).duration(320)}>
            <ThemedView
              style={[
                styles.todayCard,
                { backgroundColor: `${theme.success}12`, borderColor: `${theme.success}35` },
                glowShadow(theme.success),
              ]}>
              <ThemedText type="smallBold" style={[styles.eyebrow, { color: theme.success }]}>
                ENTRENAMIENTO DE HOY
              </ThemedText>
              <ThemedText type="title" style={styles.todayTitle}>
                ¡Excelente trabajo! 💪
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.completedSubtitle}>
                {todaysSession.routine_day_label ?? 'Entrenamiento'} completado
              </ThemedText>

              <ThemedView style={styles.todayStats}>
                <ThemedView style={styles.todayStat}>
                  <ThemedText type="title" style={styles.todayStatValue}>
                    {todaysSession.duration_minutes ?? 0}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.todayStatLabel}>
                    MIN
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.todayStat}>
                  <ThemedText type="title" style={styles.todayStatValue}>
                    {todaysSession.exercises.length}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.todayStatLabel}>
                    EJERCICIOS
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </Animated.View>
        ) : (
          day && (
            <Animated.View entering={FadeInUp.delay(0).duration(320)}>
              <ThemedView
                style={[
                  styles.todayCard,
                  { backgroundColor: `${theme.accent}12`, borderColor: `${theme.accent}35` },
                  glowShadow(theme.accent),
                ]}>
                <ThemedText type="smallBold" style={[styles.eyebrow, { color: theme.accent }]}>
                  ENTRENAMIENTO DE HOY
                </ThemedText>
                <ThemedText type="title" style={styles.todayTitle}>
                  {day.label}
                </ThemedText>

                <ThemedView style={styles.todayStats}>
                  <ThemedView style={styles.todayStat}>
                    <ThemedText type="title" style={styles.todayStatValue}>
                      {estimateWorkoutMinutes(day)}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" style={styles.todayStatLabel}>
                      MIN
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.todayStat}>
                    <ThemedText type="title" style={styles.todayStatValue}>
                      {day.exercises.length}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" style={styles.todayStatLabel}>
                      EJERCICIOS
                    </ThemedText>
                  </ThemedView>
                </ThemedView>

                <ThemedView style={styles.spacer} />
                <PrimaryButton label="Comenzar" onPress={() => router.push('/workout/precheck')} />
                <ThemedView style={styles.buttonGap} />
                <PrimaryButton
                  label="Saltar entrenamiento"
                  variant="ghost"
                  onPress={() => setConfirmingSkip(true)}
                />
              </ThemedView>
            </Animated.View>
          )
        )}

        {(stats?.current_streak_days ?? 0) > 0 && (
          <Animated.View entering={FadeInUp.delay(40).duration(320)}>
            <StreakWidget streakDays={stats?.current_streak_days ?? 0} sessions={sessions} />
          </Animated.View>
        )}

        <Animated.View entering={FadeInUp.delay(60).duration(320)}>
          <PerformanceHero stats={stats} gamification={summary} isLoading={isLoadingStats || isLoadingGamification} />
        </Animated.View>

        {nearestChallenge && (
          <Animated.View entering={FadeInUp.delay(90).duration(280)}>
            <ThemedView
              style={[styles.challengeBanner, { backgroundColor: `${theme.accent}14`, borderColor: `${theme.accent}35` }]}>
              <ThemedText type="small" style={{ color: theme.accent }}>
                🎯 Te falta 1 entrenamiento para completar “{nearestChallenge.title}”.
              </ThemedText>
            </ThemedView>
          </Animated.View>
        )}

        <Animated.View entering={FadeInUp.delay(120).duration(320)}>
          <ChallengesRow />
        </Animated.View>

        <ConfirmDialog
          visible={confirmingSkip}
          title="¿Seguro que quieres saltar este entrenamiento?"
          description="No se va a registrar como completado — pasa directo al siguiente entrenamiento de tu rutina."
          confirmLabel="Sí, saltar"
          isLoading={isSkipping}
          onConfirm={handleSkip}
          onCancel={() => setConfirmingSkip(false)}
        />

        </ScrollView>
      </SafeAreaView>

      <MoreMenu
        visible={moreMenuVisible}
        onClose={() => setMoreMenuVisible(false)}
        unreadFeedCount={unreadFeedCount}
      />

      <TutorialOverlay tutorial={tutorial} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  scrollView: { alignSelf: 'stretch' },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  greetingLabel: {
    letterSpacing: 1,
    marginBottom: 2,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  brandCard: {
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: Spacing.four,
    borderWidth: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    overflow: 'hidden',
  },
  brandLogo: { width: 192, height: 131 },
  brandSloganRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  brandSloganItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  brandSloganWord: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginHorizontal: Spacing.one,
  },
  brandDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  centerText: { textAlign: 'center' },
  card: {
    borderRadius: Spacing.four,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    alignItems: 'center',
  },
  todayCard: {
    borderRadius: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    borderWidth: 1,
  },
  todayTitle: {
    fontSize: 26,
    lineHeight: 31,
    marginBottom: Spacing.three,
  },
  completedSubtitle: {
    marginTop: -Spacing.two,
    marginBottom: Spacing.three,
  },
  challengeBanner: {
    borderRadius: Spacing.three,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  todayStats: {
    flexDirection: 'row',
    gap: Spacing.five,
    backgroundColor: 'transparent',
  },
  todayStat: {
    backgroundColor: 'transparent',
  },
  todayStatValue: {
    fontSize: 24,
    lineHeight: 28,
  },
  todayStatLabel: {
    letterSpacing: 0.5,
    fontSize: 11,
  },
  eyebrow: {
    letterSpacing: 1,
    marginBottom: Spacing.one,
  },
  // `ThemedView` sin `type` pinta `theme.background` (el fondo general de
  // la app) por default — correcto para un contenedor de pantalla, pero
  // acá son simples espaciadores DENTRO de la card cian traslúcida
  // (`todayCard`). Sin este override quedaba un rectángulo del color de
  // fondo general de la app, mal encajado, arriba y abajo de "Comenzar" —
  // el mismo mecanismo que causaba el rectángulo reportado.
  spacer: { height: Spacing.three, backgroundColor: 'transparent' },
  buttonGap: { height: Spacing.two, backgroundColor: 'transparent' },
});
