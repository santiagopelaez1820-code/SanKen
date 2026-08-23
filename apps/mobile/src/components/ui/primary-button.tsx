import { ActivityIndicator, Pressable, StyleSheet, type GestureResponderEvent, type PressableProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

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

const PRESS_SPRING = { damping: 16, stiffness: 320 };

export function PrimaryButton({
  label,
  loading,
  icon,
  variant = 'primary',
  style,
  disabled,
  onPressIn,
  onPressOut,
  ...props
}: PrimaryButtonProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const isGhost = variant === 'ghost';
  const isNeutral = variant === 'neutral';
  const isAccent2 = variant === 'accent2';
  const isSolid = !isGhost && !isNeutral;
  const labelColor = isGhost ? theme.accent : isNeutral ? theme.text : '#050505';
  const glowColor = isAccent2 ? theme.accentSecondary : theme.accent;

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePressIn = (e: GestureResponderEvent) => {
    scale.value = withSpring(0.97, PRESS_SPRING);
    onPressIn?.(e);
  };
  const handlePressOut = (e: GestureResponderEvent) => {
    scale.value = withSpring(1, PRESS_SPRING);
    onPressOut?.(e);
  };

  const content = loading ? (
    <ActivityIndicator color={labelColor} />
  ) : (
    <>
      {icon && <Icon icon={icon} size={16} color={labelColor} />}
      <ThemedText type="smallBold" style={{ color: labelColor }}>
        {label}
      </ThemedText>
    </>
  );

  if (isSolid) {
    return (
      <Animated.View style={[animatedStyle, (disabled || loading) && styles.disabled]}>
        <Pressable
          disabled={disabled || loading}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          {...props}>
          <LinearGradient
            colors={[glowColor, `${glowColor}D9`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.base, styles.solid, { shadowColor: glowColor }, style as object]}>
            {content}
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  }

  const staticVariantStyle = isGhost
    ? [styles.ghost, { borderColor: theme.accent }]
    : [styles.neutral, { backgroundColor: theme.backgroundElement, borderColor: theme.border }];

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        disabled={disabled || loading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.base, staticVariantStyle, (disabled || loading) && styles.disabled, style as object]}
        {...props}>
        {content}
      </Pressable>
    </Animated.View>
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
