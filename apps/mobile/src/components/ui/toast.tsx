import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { CheckCircle2 } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { CardShadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useToastStore } from '@/store/toast-store';

/** Montado una sola vez en el root layout — cualquier pantalla dispara un toast con `useToastStore.getState().show(...)`. */
export function ToastHost() {
  const theme = useTheme();
  const toast = useToastStore((s) => s.toast);

  if (!toast) return null;

  return (
    <SafeAreaView pointerEvents="none" style={styles.wrapper}>
      <Animated.View
        key={toast.id}
        entering={FadeInDown.duration(220)}
        exiting={FadeOutUp.duration(180)}
        style={[styles.toast, { backgroundColor: theme.cardElevated, borderColor: theme.border }, CardShadow]}>
        {toast.variant === 'success' && <CheckCircle2 size={18} color={theme.success} />}
        <ThemedText type="small" style={styles.text}>
          {toast.message}
        </ThemedText>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
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
    maxWidth: 420,
  },
  text: { flexShrink: 1 },
});
