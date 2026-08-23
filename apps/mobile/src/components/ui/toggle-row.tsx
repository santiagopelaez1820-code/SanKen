import { Switch, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon, type LucideIcon } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ToggleRowProps {
  label: string;
  description?: string;
  icon?: LucideIcon;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export function ToggleRow({ label, description, icon, value, onValueChange, disabled }: ToggleRowProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.row}>
      <ThemedView style={styles.text}>
        <ThemedView style={styles.labelRow}>
          {icon && <Icon icon={icon} size={16} color={theme.accent} />}
          <ThemedText type="default">{label}</ThemedText>
        </ThemedView>
        {description && (
          <ThemedText type="small" themeColor="textSecondary">
            {description}
          </ThemedText>
        )}
      </ThemedView>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: theme.backgroundSelected, true: theme.accent }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  text: { flex: 1, gap: Spacing.half },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, backgroundColor: 'transparent' },
});
