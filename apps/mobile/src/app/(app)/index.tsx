import { useEffect } from 'react';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { estimateWorkoutMinutes } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';
import { useNotificationsStore } from '@/store/notifications-store';
import { findNextDay, useRoutineStore } from '@/store/routine-store';

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { routine, nextDayId, isLoading, hasNoRoutine, error, load } = useRoutineStore();
  const unreadNotifications = useNotificationsStore((s) => s.unreadCount);

  useEffect(() => {
    load();
  }, [load]);

  const day = findNextDay(routine, nextDayId);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
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
          <ThemedView style={styles.todayCard}>
            <ThemedText type="small" style={styles.eyebrow}>
              ENTRENAMIENTO DE HOY
            </ThemedText>
            <ThemedText type="subtitle">{day.label}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {day.exercises.length} ejercicios · ~{estimateWorkoutMinutes(day)} min
            </ThemedText>
            <ThemedView style={styles.spacer} />
            <PrimaryButton label="Comenzar" onPress={() => router.push('/workout/precheck')} />
          </ThemedView>
        )}

        {user?.role === 'trainer' && (
          <PrimaryButton label="Mis clientes" variant="ghost" onPress={() => router.push('/trainer')} />
        )}

        {user?.role !== 'trainer' && (
          <PrimaryButton label="Mi entrenador" variant="ghost" onPress={() => router.push('/mi-entrenador')} />
        )}

        <PrimaryButton label="Chat" variant="ghost" onPress={() => router.push('/chat')} />

        <PrimaryButton
          label={unreadNotifications > 0 ? `Notificaciones (${unreadNotifications})` : 'Notificaciones'}
          variant="ghost"
          onPress={() => router.push('/notificaciones')}
        />

        <PrimaryButton label="Rankings" variant="ghost" onPress={() => router.push('/rankings')} />

        <PrimaryButton label="Retos" variant="ghost" onPress={() => router.push('/retos')} />

        <PrimaryButton label="Calendario" variant="ghost" onPress={() => router.push('/calendario')} />

        <PrimaryButton label="Nutrición" variant="ghost" onPress={() => router.push('/nutricion')} />

        <PrimaryButton label="Novedades" variant="ghost" onPress={() => router.push('/noticias')} />

        {user?.role === 'admin' && (
          <PrimaryButton label="Panel admin" variant="ghost" onPress={() => router.push('/admin')} />
        )}

        <PrimaryButton label="Configuración" variant="ghost" onPress={() => router.push('/settings')} />

        <PrimaryButton label="Cerrar sesión" variant="ghost" onPress={() => logout()} />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'stretch',
    justifyContent: 'center',
    gap: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
    width: '100%',
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
    backgroundColor: 'rgba(201,162,39,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.25)',
  },
  eyebrow: {
    color: '#C9A227',
    letterSpacing: 1,
    marginBottom: Spacing.one,
  },
  spacer: { height: Spacing.three },
});
