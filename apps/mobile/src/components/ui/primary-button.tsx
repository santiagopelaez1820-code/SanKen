import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type LucideIcon } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface PrimaryButtonProps extends PressableProps {
  label: string;
  loading?: boolean;
  icon?: LucideIcon;
  /**
   * `primary` (lima sólido) es la ÚNICA acción principal de cada
   * pantalla — no todo botón debe ser lima. `accent2` (cyan sólido) es
   * para acciones ligadas a entrenamiento/actividad. `neutral` (superficie
   * oscura/clara según tema, texto normal) es para acciones secundarias
   * que siguen siendo un botón "sólido" (ej. navegación). `ghost` es la
   * acción terciaria/cancelar de siempre.
   */
  variant?: 'primary' | 'accent2' | 'neutral' | 'ghost';
}

export function PrimaryButton({ label, loading, icon, variant = 'primary', style, disabled, ...props }: PrimaryButtonProps) {
  const theme = useTheme();
  const isGhost = variant === 'ghost';
  const isNeutral = variant === 'neutral';
  const isAccent2 = variant === 'accent2';

  const variantStyle = isGhost
    ? [styles.ghost, { borderColor: theme.accent }]
    : isNeutral
      ? [styles.neutral, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]
      : isAccent2
        ? [styles.solid, { backgroundColor: theme.accentSecondary, shadowColor: theme.accentSecondary }]
        : [styles.solid, { backgroundColor: theme.accent, shadowColor: theme.accent }];
  const labelColor = isGhost ? theme.accent : isNeutral ? theme.text : '#050505';

  return (
    <Pressable
      disabled={disabled || loading}
      style={(state) => [
        styles.base,
        variantStyle,
        (disabled || loading) && styles.disabled,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}>
      {loading ? (
        <ActivityIndicator color={labelColor} />
      ) : (
        <>
          {icon && <Icon icon={icon} size={16} color={labelColor} />}
          <ThemedText type="smallBold" style={{ color: labelColor }}>
            {label}
          </ThemedText>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    gap: Spacing.one,
    alignSelf: 'stretch',
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 6,
  },
  neutral: {
    borderWidth: 1,
  },
  ghost: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
});
