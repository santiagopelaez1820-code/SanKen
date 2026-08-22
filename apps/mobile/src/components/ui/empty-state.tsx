import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon, type LucideIcon } from '@/components/ui/icon';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onPress: () => void };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedView type="backgroundElement" style={styles.iconCircle}>
        <Icon icon={icon} size={24} color={theme.textSecondary} />
      </ThemedView>
      <ThemedText type="smallBold" style={styles.centerText}>
        {title}
      </ThemedText>
      {description && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
          {description}
        </ThemedText>
      )}
      {action && (
        <ThemedView style={styles.actionWrap}>
          <PrimaryButton label={action.label} variant="neutral" onPress={action.onPress} />
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.four,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  actionWrap: {
    marginTop: Spacing.one,
    minWidth: 160,
  },
});
