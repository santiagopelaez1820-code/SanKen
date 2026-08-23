import { useEffect } from 'react';
import { type DimensionValue, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: object;
}

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export function Skeleton({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonProps) {
  const theme = useTheme();
  const opacity = useSharedValue(0.5);
  const shimmer = useSharedValue(-1);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }), -1, true);
    shimmer.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }), -1, false);
  }, [opacity, shimmer]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: `${shimmer.value * 200}%` }],
  }));

  return (
    <Animated.View
      style={[
        styles.base,
        { width, height, borderRadius, backgroundColor: theme.backgroundElement },
        animatedStyle,
        style,
      ]}>
      <AnimatedGradient
        colors={['transparent', `${theme.text}14`, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.shimmer, shimmerStyle]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  shimmer: {
    ...StyleSheet.absoluteFill,
    width: '50%',
  },
});
