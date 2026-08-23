import { Modal, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Mismo shell que LevelUpCelebration (Modal nativo, sin Reanimated) — reutilizable para cualquier "¿Seguro?" antes de una acción. */
export function ConfirmDialog({
  visible,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const theme = useTheme();

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <ThemedView style={styles.backdrop}>
        <ThemedView style={[styles.card, { backgroundColor: theme.background, borderColor: theme.backgroundSelected }]}>
          <ThemedText type="subtitle" style={styles.title}>
            {title}
          </ThemedText>
          {description && (
            <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
              {description}
            </ThemedText>
          )}
          <ThemedView style={styles.actions}>
            <ThemedView style={styles.actionHalf}>
              <PrimaryButton label={cancelLabel} variant="ghost" onPress={onCancel} disabled={isLoading} />
            </ThemedView>
            <ThemedView style={styles.actionHalf}>
              <PrimaryButton label={confirmLabel} onPress={onConfirm} loading={isLoading} />
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: Spacing.four,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: Spacing.four,
    borderWidth: 1,
    gap: Spacing.two,
    padding: Spacing.four,
  },
  title: { textAlign: 'center' },
  description: { textAlign: 'center' },
  actions: { flexDirection: 'row', gap: Spacing.three, marginTop: Spacing.two },
  actionHalf: { flex: 1 },
});
