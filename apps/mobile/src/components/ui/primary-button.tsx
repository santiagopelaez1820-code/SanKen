import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

interface PrimaryButtonProps extends PressableProps {
  label: string;
  loading?: boolean;
  variant?: 'primary' | 'ghost';
}

export function PrimaryButton({ label, loading, variant = 'primary', style, disabled, ...props }: PrimaryButtonProps) {
  const isGhost = variant === 'ghost';

  return (
    <Pressable
      disabled={disabled || loading}
      style={(state) => [
        styles.base,
        isGhost ? styles.ghost : styles.primary,
        (disabled || loading) && styles.disabled,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}>
      {loading ? (
        <ActivityIndicator color={isGhost ? '#C9A227' : '#0A0A09'} />
      ) : (
        <ThemedText type="smallBold" style={isGhost ? styles.ghostLabel : styles.primaryLabel}>
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'stretch',
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#C9A227',
  },
  primaryLabel: {
    color: '#0A0A09',
  },
  ghost: {
    borderWidth: 1,
    borderColor: '#C9A227',
    backgroundColor: 'transparent',
  },
  ghostLabel: {
    color: '#C9A227',
  },
  disabled: {
    opacity: 0.5,
  },
});
