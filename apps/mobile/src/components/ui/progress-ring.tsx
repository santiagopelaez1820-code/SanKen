import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  /** Progreso actual, 0..max */
  value: number;
  max: number;
  /** Color del trazo — lima (progreso) o cyan (entrenamiento/actividad) */
  color?: 'accent' | 'accentSecondary';
  size?: number;
  strokeWidth?: number;
  label: string;
  valueLabel: string;
}

export function ProgressRing({
  value,
  max,
  color = 'accent',
  size = 120,
  strokeWidth = 10,
  label,
  valueLabel,
}: ProgressRingProps) {
  const theme = useTheme();
  const pct = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeColor = color === 'accent' ? theme.accent : theme.accentSecondary;

  const [animated] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animated, {
      toValue: pct,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [animated, pct]);

  const strokeDashoffset = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.container}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} style={styles.svg}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={theme.border}
            strokeWidth={strokeWidth}
          />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            originX={size / 2}
            originY={size / 2}
            rotation={-90}
          />
        </Svg>
        <View style={styles.centerLabel}>
          <ThemedText type="smallBold" style={styles.value}>
            {valueLabel}
          </ThemedText>
        </View>
      </View>
      <ThemedText type="small" themeColor="textSecondary" style={styles.label}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  svg: {
    position: 'absolute',
  },
  centerLabel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 18,
    fontVariant: ['tabular-nums'],
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
});
