import { StyleSheet } from 'react-native';
import { AlertCircle } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ErrorStateProps {
  /** Mensaje ya en español y legible (los stores lo arman con un fallback humano si la API no da uno) — nunca un código HTTP crudo. */
  message: string;
  onRetry: () => void;
}

/** Mismo lenguaje visual que EmptyState — un error de red no debería sentirse como una pantalla distinta del resto de la app. */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedView type="backgroundElement" style={styles.iconCircle}>
        <AlertCircle size={24} color={theme.error} />
      </ThemedView>
      <ThemedText type="smallBold" style={styles.centerText}>
        No pudimos completar esta acción
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
        {message}
      </ThemedText>
      <ThemedView style={styles.actionWrap}>
        <PrimaryButton label="Reintentar" variant="neutral" onPress={onRetry} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.four,
    backgroundColor: 'transparent',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  actionWrap: {
    marginTop: Spacing.one,
    minWidth: 160,
    backgroundColor: 'transparent',
  },
});
