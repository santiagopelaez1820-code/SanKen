import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, View, type GestureResponderEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ChevronLeft } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface BackButtonProps {
  /** Texto junto a la flecha (ej. "Tienda"). Sin label queda solo el ícono, del mismo tamaño que los botones de header (carrito). */
  label?: string;
  /**
   * A dónde ir si no hay historial (deep link / notificación que abrió la
   * pantalla directo) — mismo criterio `canGoBack() ? back() : replace()`
   * que ya usaban soporte y legal.
   */
  fallbackHref: Href;
}

/** Mismo resorte que PrimaryButton/GoogleSignInButton — toda la app "responde" igual al tocar. */
const PRESS_SPRING = { damping: 16, stiffness: 320 };

/**
 * Botón de volver de la app: chevron cian (acento de marca) dentro de un
 * chip teñido, sobre una superficie `backgroundElement` con borde sutil —
 * el mismo lenguaje que el botón de carrito y los chips de categoría. El
 * back de Android lo sigue resolviendo el Stack de expo-router; esto es la
 * affordance visible.
 */
export function BackButton({ label, fallbackHref }: BackButtonProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePressIn = (_e: GestureResponderEvent) => {
    // eslint-disable-next-line react-hooks/immutability -- mutar .value es la API real de Reanimated para shared values
    scale.value = withSpring(0.94, PRESS_SPRING);
  };
  const handlePressOut = (_e: GestureResponderEvent) => {
    // eslint-disable-next-line react-hooks/immutability -- mutar .value es la API real de Reanimated para shared values
    scale.value = withSpring(1, PRESS_SPRING);
  };

  return (
    <Animated.View style={[styles.wrap, animatedStyle]}>
      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.replace(fallbackHref))}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel={label ? `Volver a ${label}` : 'Volver'}
        style={[
          styles.base,
          label ? styles.withLabel : styles.iconOnly,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        ]}>
        <View style={[styles.chip, { backgroundColor: `${theme.accent}1F` }]}>
          <Icon icon={ChevronLeft} size={18} color={theme.accent} strokeWidth={2.6} />
        </View>
        {label && (
          <ThemedText type="smallBold" style={styles.label} numberOfLines={1}>
            {label}
          </ThemedText>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'flex-start' },
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    // Mismo radio que el botón de carrito (Spacing.three) — los dos viven
    // en el mismo header y deben verse de la misma familia.
    borderRadius: Spacing.three,
  },
  withLabel: {
    height: 40,
    gap: Spacing.two,
    paddingLeft: Spacing.one + 1,
    paddingRight: Spacing.three,
  },
  // 44x44: mínimo táctil y mismo tamaño que el botón de carrito.
  iconOnly: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  chip: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { lineHeight: 18 },
});
