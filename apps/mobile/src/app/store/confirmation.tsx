import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2 } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon } from '@/components/ui/icon';
import { PrimaryButton } from '@/components/ui/primary-button';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function OrderConfirmationScreen() {
  const theme = useTheme();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView type="backgroundElement" style={styles.iconCircle}>
          <Icon icon={CheckCircle2} size={40} color={theme.accent} />
        </ThemedView>
        <ThemedText type="title" style={styles.title}>
          ¡Pedido realizado!
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={styles.description}>
          Tu pedido #{String(orderId ?? '').padStart(6, '0')} quedó registrado y está pendiente de confirmación.
        </ThemedText>
        <PrimaryButton label="Volver a la tienda" onPress={() => router.replace('/store')} />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  safeArea: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
  },
  iconCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, lineHeight: 34, textAlign: 'center' },
  description: { textAlign: 'center' },
});
