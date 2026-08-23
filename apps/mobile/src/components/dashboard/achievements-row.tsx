import { ScrollView, StyleSheet } from 'react-native';
import { Lock, Trophy } from 'lucide-react-native';
import type { Achievement } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface AchievementsRowProps {
  achievements: Achievement[];
}

export function AchievementsRow({ achievements }: AchievementsRowProps) {
  const theme = useTheme();
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedView style={styles.header}>
        <ThemedText type="smallBold">Logros</ThemedText>
        {achievements.length > 0 && (
          <ThemedText type="smallBold" style={{ color: theme.accent }}>
            {unlockedCount}/{achievements.length}
          </ThemedText>
        )}
      </ThemedView>

      {achievements.length === 0 ? (
        <ThemedText type="small" themeColor="textSecondary">
          Todavía no hay logros disponibles.
        </ThemedText>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {achievements.map((achievement) => (
            <ThemedView
              key={achievement.code}
              style={[
                styles.badge,
                { borderColor: achievement.unlocked ? theme.accent : theme.backgroundSelected },
                !achievement.unlocked && styles.locked,
              ]}>
              <Icon
                icon={achievement.unlocked ? Trophy : Lock}
                size={20}
                color={achievement.unlocked ? theme.accent : theme.textSecondary}
              />
              <ThemedText type="small" style={styles.name} numberOfLines={1}>
                {achievement.name}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                +{achievement.xp_bonus} XP
              </ThemedText>
            </ThemedView>
          ))}
        </ScrollView>
      )}
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
  badge: {
    width: 96,
    alignItems: 'center',
    gap: Spacing.half,
    borderRadius: Spacing.three,
    borderWidth: 1,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.one,
  },
  locked: {
    opacity: 0.5,
  },
  name: {
    textAlign: 'center',
  },
});
