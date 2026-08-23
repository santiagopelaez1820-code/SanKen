import { StyleSheet } from 'react-native';
import { TrendingDown, TrendingUp } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon, type LucideIcon } from '@/components/ui/icon';
import { CardShadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface StatTileProps {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  trend?: { delta: string; direction: 'up' | 'down' };
}

export function StatTile({ label, value, hint, icon, trend }: StatTileProps) {
  const theme = useTheme();

  return (
    <ThemedView type="backgroundElement" style={styles.tile}>
      {(icon || trend) && (
        <ThemedView style={styles.topRow}>
          {icon && <Icon icon={icon} size={18} color={theme.textSecondary} />}
          {trend && (
            <ThemedView style={styles.trend}>
              {trend.direction === 'up' ? (
                <TrendingUp size={12} color={theme.success} />
              ) : (
                <TrendingDown size={12} color={theme.textSecondary} />
              )}
              <ThemedText
                type="small"
                themeColor={trend.direction === 'up' ? 'success' : 'textSecondary'}
                style={styles.trendText}>
                {trend.delta}
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      )}
      <ThemedText type="stat" style={styles.value}>
        {value}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.label}>
        {label}
      </ThemedText>
      {hint && (
        <ThemedText type="small" themeColor="accent">
          {hint}
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexBasis: '47%',
    flexGrow: 1,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    gap: Spacing.half,
    ...CardShadow,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'transparent',
  },
  trendText: {
    fontWeight: '600',
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 34,
    lineHeight: 38,
  },
});
