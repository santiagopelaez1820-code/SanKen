import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Dumbbell, Menu } from 'lucide-react-native';
import { estimateWorkoutMinutes } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AchievementsRow } from '@/components/dashboard/achievements-row';
import { PerformanceHero } from '@/components/dashboard/performance-hero';
import { RecentPRsRow } from '@/components/dashboard/recent-prs-row';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreMenu } from '@/components/layout/more-menu';
import { BottomTabInset, CardShadow, glowShadow, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { useDashboardStore } from '@/store/dashboard-store';
import { useFeedStore } from '@/store/feed-store';
import { useGamificationStore } from '@/store/gamification-store';
import { findNextDay, useRoutineStore } from '@/store/routine-store';
import { useWorkoutStore } from '@/store/workout-store';

export default function HomeScreen() {
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const { routine, nextDayId, isLoading, hasNoRoutine, error, load } = useRoutineStore();
  const unreadFeedCount = useFeedStore((s) => s.unreadCount);
  const resumeWorkout = useWorkoutStore((s) => s.resume);
  const { stats, isLoadingStats, loadStats } = useDashboardStore();
  const { summary, isLoading: isLoadingGamification, loadSummary } = useGamificationStore();
  const [confirmingSkip, setConfirmingSkip] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);

  useEffect(() => {
    load();
    loadStats();
    loadSummary();
  }, [load, loadStats, loadSummary]);

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
          <ThemedText type="title" style={styles.title}>
            Hola, {user?.name.split(' ')[0]}
          </ThemedText>
          <Pressable
            onPress={() => setMoreMenuVisible(true)}
            style={[styles.menuButton, { backgroundColor: theme.backgroundElement }]}>
            <Menu size={20} color={theme.text} />
            {unreadFeedCount > 0 && (
              <ThemedView style={[styles.menuBadge, { backgroundColor: theme.accent, borderColor: theme.background }]} />
            )}
          </Pressable>
        </ThemedView>

        <Animated.View entering={FadeInUp.delay(0).duration(320)}>
          <PerformanceHero stats={stats} gamification={summary} isLoading={isLoadingStats || isLoadingGamification} />
        </Animated.View>

        {error && (
          <ThemedText type="small" style={styles.error}>
            {error}
          </ThemedText>
        )}

        {isLoading && <Skeleton height={140} borderRadius={Spacing.four} />}

        {hasNoRoutine && !isLoading && (
          <ThemedView type="backgroundElement" style={styles.card}>
            <EmptyState
              icon={Dumbbell}
              title="Generando tu plan"
              description="Todavía estamos armando tu rutina. Vuelve en un momento."
            />
          </ThemedView>
        )}

        {day && (
          <Animated.View entering={FadeInUp.delay(60).duration(320)}>
            <ThemedView
              style={[
                styles.todayCard,
                { backgroundColor: `${theme.accentSecondary}14`, borderColor: `${theme.accentSecondary}40` },
                glowShadow(theme.accentSecondary),
              ]}>
              <ThemedText type="smallBold" style={[styles.eyebrow, { color: theme.accentSecondary }]}>
                ENTRENAMIENTO DE HOY
              </ThemedText>
              <ThemedText type="subtitle">{day.label}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {day.exercises.length} ejercicios · ~{estimateWorkoutMinutes(day)} min
              </ThemedText>
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
        )}

        {!isLoadingStats && (
          <Animated.View entering={FadeInUp.delay(120).duration(320)}>
            <RecentPRsRow records={stats?.recent_personal_records ?? []} />
          </Animated.View>
        )}

        {!isLoadingGamification && (
          <Animated.View entering={FadeInUp.delay(180).duration(320)}>
            <AchievementsRow
              achievements={[...(summary?.unlocked_achievements ?? []), ...(summary?.locked_achievements ?? [])]}
            />
          </Animated.View>
        )}

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
  centerText: { textAlign: 'center' },
  error: { color: '#C9564A', textAlign: 'center' },
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
  eyebrow: {
    letterSpacing: 1,
    marginBottom: Spacing.one,
  },
  spacer: { height: Spacing.three },
  buttonGap: { height: Spacing.two },
});
