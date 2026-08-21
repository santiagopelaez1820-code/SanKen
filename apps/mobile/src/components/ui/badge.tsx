import { StyleSheet, View, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type BadgeVariant = 'default' | 'accent2' | 'success' | 'warning' | 'error' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'neutral', style }: BadgeProps) {
  const theme = useTheme();

  const colorByVariant: Record<BadgeVariant, string> = {
    default: theme.accent,
    accent2: theme.accentSecondary,
    success: theme.success,
    warning: theme.warning,
    error: theme.error,
    neutral: theme.textSecondary,
  };
  const color = colorByVariant[variant];

  return (
    <View style={[styles.badge, { backgroundColor: `${color}26` }, style]}>
      <ThemedText type="small" style={{ color }}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
});
