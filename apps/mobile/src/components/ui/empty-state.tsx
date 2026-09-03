import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

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
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 350, easing: Easing.out(Easing.cubic) });
  }, [progress]);

  const iconStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.8 + progress.value * 0.2 }],
  }));

  return (
    <ThemedView style={styles.container}>
      <Animated.View style={iconStyle}>
        <ThemedView type="backgroundElement" style={styles.iconCircle}>
          <Icon icon={icon} size={24} color={theme.textSecondary} />
        </ThemedView>
      </Animated.View>
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
  // EmptyState se usa dentro de cards con fondos distintos al de la
  // página (backgroundElement, tintes de acento, etc.) — sin
  // `backgroundColor: 'transparent'` en los Views puramente de layout,
  // quedaba un rectángulo del fondo general de la app encima del fondo
  // real de la card que lo contiene.
  container: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.four,
    backgroundColor: 'transparent',
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
    backgroundColor: 'transparent',
  },
});
