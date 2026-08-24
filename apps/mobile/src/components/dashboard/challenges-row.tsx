import { useEffect } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Flag } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Skeleton } from '@/components/ui/skeleton';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useRetosStore } from '@/store/retos-store';

function daysLeft(endsAt: string) {
  return Math.max(0, Math.ceil((new Date(endsAt).getTime() - Date.now()) / 86_400_000));
}

/** Vista previa de retos activos en Home — el detalle completo vive en la pestaña Retos. */
export function ChallengesRow() {
  const theme = useTheme();
  const { challenges, isLoading, load } = useRetosStore();

  useEffect(() => {
    load();
  }, [load]);

  if (isLoading) return <Skeleton height={168} borderRadius={Spacing.four} />;

  const active = challenges.filter((c) => !c.completed).slice(0, 6);
  if (active.length === 0) return null;

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedView style={styles.header}>
        <ThemedText type="smallBold">Retos activos</ThemedText>
        <Pressable onPress={() => router.push('/retos')}>
          <ThemedText type="small" style={{ color: theme.accent }}>
            Ver todos
          </ThemedText>
        </Pressable>
      </ThemedView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {active.map((challenge) => (
          <Pressable
            key={challenge.id}
            onPress={() => router.push('/retos')}
            style={({ pressed }) => [
              styles.tile,
              { backgroundColor: theme.backgroundSelected },
              pressed && styles.pressed,
            ]}>
            <ThemedView style={styles.tileHeader}>
              <Flag size={13} color={theme.accent} />
              <ThemedText type="small" themeColor="textSecondary" style={styles.tileMeta}>
                {challenge.type === 'weekly' ? 'Semanal' : 'Mensual'} · {daysLeft(challenge.ends_at)}d
              </ThemedText>
            </ThemedView>
            <ThemedText type="smallBold" numberOfLines={2} style={styles.tileTitle}>
              {challenge.title}
            </ThemedText>
            {challenge.joined ? (
              <View style={[styles.track, { backgroundColor: theme.background }]}>
                <View
                  style={[
                    styles.fill,
                    {
                      backgroundColor: theme.accent,
                      width: `${Math.min(100, Math.round(((challenge.progress_value ?? 0) / challenge.criteria.target) * 100))}%`,
                    },
                  ]}
                />
              </View>
            ) : (
              <ThemedText type="small" style={{ color: theme.accent }}>
                Unirme →
              </ThemedText>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  row: {
    gap: Spacing.two,
  },
  tile: {
    width: 176,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'transparent',
  },
  tileMeta: {
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    fontSize: 10,
  },
  tileTitle: {
    minHeight: 34,
  },
  pressed: {
    opacity: 0.8,
  },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
});
