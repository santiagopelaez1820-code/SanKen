import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Camera, LogOut, Settings } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AchievementsRow } from '@/components/dashboard/achievements-row';
import { RecentPRsRow } from '@/components/dashboard/recent-prs-row';
import { AvatarEditSheet } from '@/components/profile/avatar-edit-sheet';
import { Avatar } from '@/components/ui/avatar';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Skeleton } from '@/components/ui/skeleton';
import { Icon } from '@/components/ui/icon';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';
import { useDashboardStore } from '@/store/dashboard-store';
import { useGamificationStore } from '@/store/gamification-store';

/** Trío de stats compacto — el mismo lenguaje que StatTile pero en fila, para el header del perfil. */
function StatCell({ value, label }: { value: string | number; label: string }) {
  return (
    <View style={styles.statCell}>
      <ThemedText type="subtitle" style={styles.statValue}>
        {value}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

export default function ProfileScreen() {
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { stats, isLoadingStats, loadStats } = useDashboardStore();
  const { summary, isLoading: isLoadingGamification, loadSummary } = useGamificationStore();
  const [avatarSheetVisible, setAvatarSheetVisible] = useState(false);

  useEffect(() => {
    loadStats();
    loadSummary();
  }, [loadStats, loadSummary]);

  const progressPct = Math.round((summary?.progress_pct ?? 0) * 100);
  const isLoading = isLoadingStats || isLoadingGamification;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInUp.duration(320)} style={styles.header}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.eyebrow}>
              PERFIL DE ATLETA
            </ThemedText>

            <Pressable
              onPress={() => setAvatarSheetVisible(true)}
              style={styles.avatarBlock}
              accessibilityRole="button"
              accessibilityLabel="Cambiar foto de perfil">
              {isLoading ? (
                <Skeleton height={96} width={96} borderRadius={48} />
              ) : (
                <ProgressRing
                  value={summary?.progress_pct ?? 0}
                  max={1}
                  size={104}
                  strokeWidth={7}
                  color="accent"
                  label=""
                  valueLabel=""
                  centerContent={<Avatar name={user?.name} avatarUrl={user?.avatar_url} size={76} />}
                />
              )}
              {!isLoading && (
                <ThemedView style={[styles.cameraBadge, { backgroundColor: theme.accent, borderColor: theme.background }]}>
                  <Icon icon={Camera} size={14} color="#050505" />
                </ThemedView>
              )}
            </Pressable>

            <ThemedText type="title" style={styles.name}>
              {user?.name ?? 'Atleta'}
            </ThemedText>
            <ThemedText type="small" style={[styles.level, { color: theme.accent }]}>
              NIVEL {summary?.level ?? 1} · {progressPct}% al siguiente
            </ThemedText>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(60).duration(320)}>
            <ThemedView type="backgroundElement" style={styles.statsCard}>
              <StatCell value={stats?.current_streak_days ?? 0} label="Racha" />
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <StatCell value={stats?.total_sets ?? 0} label="Series" />
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <StatCell value={`${stats?.total_hours ?? 0}h`} label="Horas" />
            </ThemedView>
          </Animated.View>

          {!isLoadingGamification && (
            <Animated.View entering={FadeInUp.delay(120).duration(320)}>
              <AchievementsRow
                achievements={[...(summary?.unlocked_achievements ?? []), ...(summary?.locked_achievements ?? [])]}
              />
            </Animated.View>
          )}

          {!isLoadingStats && (
            <Animated.View entering={FadeInUp.delay(180).duration(320)}>
              <RecentPRsRow records={stats?.recent_personal_records ?? []} />
            </Animated.View>
          )}

          <Animated.View entering={FadeInUp.delay(220).duration(320)} style={styles.actions}>
            <Pressable
              onPress={() => router.push('/settings')}
              style={[styles.actionRow, { backgroundColor: theme.backgroundElement }]}>
              <Icon icon={Settings} size={18} color={theme.text} />
              <ThemedText type="default" style={styles.actionLabel}>
                Configuración
              </ThemedText>
            </Pressable>
            <Pressable onPress={logout} style={[styles.actionRow, { backgroundColor: theme.backgroundElement }]}>
              <Icon icon={LogOut} size={18} color={theme.textSecondary} />
              <ThemedText type="default" themeColor="textSecondary" style={styles.actionLabel}>
                Cerrar sesión
              </ThemedText>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      <AvatarEditSheet
        visible={avatarSheetVisible}
        onClose={() => setAvatarSheetVisible(false)}
        hasAvatar={!!user?.avatar_url}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
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
    alignItems: 'center',
    backgroundColor: 'transparent',
    gap: Spacing.one,
  },
  eyebrow: {
    letterSpacing: 1,
  },
  avatarBlock: {
    marginTop: Spacing.two,
    marginBottom: Spacing.one,
  },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    lineHeight: 30,
  },
  level: {
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Spacing.four,
    paddingVertical: Spacing.three,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'transparent',
  },
  statValue: {
    fontSize: 20,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
  },
  actions: {
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  actionLabel: {
    flex: 1,
  },
});
