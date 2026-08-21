import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { estimateWorkoutMinutes } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { useFeedStore } from '@/store/feed-store';
import { findNextDay, useRoutineStore } from '@/store/routine-store';
import { useWorkoutStore } from '@/store/workout-store';

export default function HomeScreen() {
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { routine, nextDayId, isLoading, hasNoRoutine, error, load } = useRoutineStore();
  const unreadFeedCount = useFeedStore((s) => s.unreadCount);
  const resumeWorkout = useWorkoutStore((s) => s.resume);
  const [confirmingSkip, setConfirmingSkip] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

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
        <ThemedView style={styles.heroSection}>
          <ThemedText type="title" style={styles.title}>
            Hola, {user?.name.split(' ')[0]}
          </ThemedText>
        </ThemedView>

        {isLoading && (
          <ThemedText type="small" themeColor="textSecondary">
            Cargando tu plan…
          </ThemedText>
        )}

        {error && (
          <ThemedText type="small" style={styles.error}>
            {error}
          </ThemedText>
        )}

        {hasNoRoutine && !isLoading && (
          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
              Todavía estamos generando tu plan. Vuelve en un momento.
            </ThemedText>
          </ThemedView>
        )}

        {day && (
          <ThemedView
            style={[
              styles.todayCard,
              { backgroundColor: `${theme.accentSecondary}14`, borderColor: `${theme.accentSecondary}40` },
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

        {user?.role === 'trainer' && (
          <PrimaryButton label="Mis clientes" variant="ghost" onPress={() => router.push('/trainer')} />
        )}

        {user?.role !== 'trainer' && (
          <PrimaryButton label="Mi entrenador" variant="ghost" onPress={() => router.push('/mi-entrenador')} />
        )}

        <PrimaryButton label="Chat" variant="ghost" onPress={() => router.push('/chat')} />

        <PrimaryButton
          label={unreadFeedCount > 0 ? `Novedades (${unreadFeedCount})` : 'Novedades'}
          variant="ghost"
          onPress={() => router.push('/novedades')}
        />

        <PrimaryButton label="Retos" variant="ghost" onPress={() => router.push('/retos')} />

        <PrimaryButton label="Calendario" variant="ghost" onPress={() => router.push('/calendario')} />

        <PrimaryButton label="Nutrición" variant="ghost" onPress={() => router.push('/nutricion')} />

        {user?.role === 'super_admin' && (
          <PrimaryButton label="Super Admin" variant="ghost" onPress={() => router.push('/admin')} />
        )}

        <PrimaryButton label="Configuración" variant="ghost" onPress={() => router.push('/settings')} />

        <PrimaryButton label="Cerrar sesión" variant="ghost" onPress={() => logout()} />
        </ScrollView>
      </SafeAreaView>
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
  heroSection: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
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
