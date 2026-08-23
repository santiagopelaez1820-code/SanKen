import { useEffect, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

const PARTICLE_COUNT = 8;
const PARTICLE_OFFSETS = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const angle = (i / PARTICLE_COUNT) * 2 * Math.PI;
  return { x: Math.cos(angle) * 70, y: Math.sin(angle) * 50 };
});

interface CelebrationOverlayProps {
  show: boolean;
  children: React.ReactNode;
}

/**
 * Envuelve un banner inline (PR, serie completada) con una entrada de
 * celebración liviana: scale-in + un pequeño estallido de partículas en los
 * colores de marca. Para el momento "full-screen" (subir de nivel) se usa
 * LevelUpCelebration, que ya tiene su propio confetti a pantalla completa.
 */
export function CelebrationOverlay({ show, children }: CelebrationOverlayProps) {
  const theme = useTheme();
  const [cardAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!show) return;
    cardAnim.setValue(0);
    Animated.spring(cardAnim, { toValue: 1, useNativeDriver: true, damping: 14, stiffness: 220 }).start();
  }, [show, cardAnim]);

  if (!show) return null;

  const particleColors = [theme.accent, theme.accentSecondary, theme.text];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: cardAnim,
          transform: [{ scale: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }],
        },
      ]}>
      {PARTICLE_OFFSETS.map((offset, i) => (
        <Animated.View
          key={i}
          style={[
            styles.particle,
            { backgroundColor: particleColors[i % particleColors.length] },
            {
              opacity: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
              transform: [
                { translateX: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0, offset.x] }) },
                { translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0, offset.y] }) },
              ],
            },
          ]}
        />
      ))}
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  particle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
