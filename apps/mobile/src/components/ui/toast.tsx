import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { SlideInDown, SlideOutUp } from 'react-native-reanimated';
import { CheckCircle2 } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
  durationMs?: number;
}

export function Toast({ visible, message, onHide, durationMs = 2200 }: ToastProps) {
  const theme = useTheme();

  useEffect(() => {
    if (!visible) return;
    const timeout = setTimeout(onHide, durationMs);
    return () => clearTimeout(timeout);
  }, [visible, durationMs, onHide]);

  if (!visible) return null;

  return (
    <SafeAreaView style={styles.safeArea} pointerEvents="none">
      <Animated.View
        entering={SlideInDown.duration(220)}
        exiting={SlideOutUp.duration(180)}
        style={[styles.toast, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <CheckCircle2 size={18} color={theme.accent} />
        <ThemedText type="small" style={styles.text}>
          {message}
        </ThemedText>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
    borderWidth: 1,
    maxWidth: '90%',
  },
  text: {
    flexShrink: 1,
  },
});
