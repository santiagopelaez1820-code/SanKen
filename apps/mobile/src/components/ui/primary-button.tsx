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
        <ActivityIndicator color={isGhost ? '#FF7A3D' : '#070B14'} />
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
    backgroundColor: '#FF7A3D',
    shadowColor: '#FF7A3D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryLabel: {
    color: '#070B14',
  },
  ghost: {
    borderWidth: 1,
    borderColor: '#FF7A3D',
    backgroundColor: 'transparent',
  },
  ghostLabel: {
    color: '#FF7A3D',
  },
  disabled: {
    opacity: 0.5,
  },
});
