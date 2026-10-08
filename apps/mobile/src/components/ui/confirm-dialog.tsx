// Esta línea sirve para importar «Modal, StyleSheet» desde «react-native».
import { Modal, StyleSheet } from 'react-native';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar la interfaz «ConfirmDialogProps».
interface ConfirmDialogProps {
  // Esta línea sirve para declarar la propiedad «visible» con el valor o tipo «boolean».
  visible: boolean;
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «string».
  title: string;
  // Esta línea sirve para declarar la propiedad «description» con el valor o tipo «string».
  description?: string;
  // Esta línea sirve para declarar la propiedad «confirmLabel» con el valor o tipo «string».
  confirmLabel?: string;
  // Esta línea sirve para declarar la propiedad «cancelLabel» con el valor o tipo «string».
  cancelLabel?: string;
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «boolean».
  isLoading?: boolean;
  // Esta línea sirve para declarar la propiedad «onConfirm» con el valor o tipo «() => void».
  onConfirm: () => void;
  // Esta línea sirve para declarar la propiedad «onCancel» con el valor o tipo «() => void».
  onCancel: () => void;
}

/** Mismo shell que LevelUpCelebration (Modal nativo, sin Reanimated) — reutilizable para cualquier "¿Seguro?" antes de una acción. */
// Esta línea sirve para declarar la función «ConfirmDialog».
export function ConfirmDialog({
  // Esta línea sirve para incluir el valor «visible» en la lista.
  visible,
  // Esta línea sirve para incluir el valor «title» en la lista.
  title,
  // Esta línea sirve para incluir el valor «description» en la lista.
  description,
  // Esta línea sirve para incluir el valor «confirmLabel» en la lista.
  confirmLabel = 'Confirmar',
  // Esta línea sirve para incluir el valor «cancelLabel» en la lista.
  cancelLabel = 'Cancelar',
  // Esta línea sirve para incluir el valor «isLoading» en la lista.
  isLoading = false,
  // Esta línea sirve para incluir el valor «onConfirm» en la lista.
  onConfirm,
  // Esta línea sirve para incluir el valor «onCancel» en la lista.
  onCancel,
// Esta línea sirve para cerrar los parámetros con el tipo «ConfirmDialogProps» y abrir el cuerpo.
}: ConfirmDialogProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Modal».
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView style={styles.backdrop}>
        {/* Esta línea sirve para abrir el componente «ThemedView». */}
        <ThemedView style={[styles.card, { backgroundColor: theme.background, borderColor: theme.backgroundSelected }]}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="subtitle" style={styles.title}>
            {/* Esta línea sirve para mostrar el valor «title». */}
            {title}
          </ThemedText>
          {/* Esta línea sirve para mostrar el bloque solo si «description». */}
          {description && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
              {/* Esta línea sirve para mostrar el valor «description». */}
              {description}
            </ThemedText>
          )}
          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={styles.actions}>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.actionHalf}>
              {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
              <PrimaryButton label={cancelLabel} variant="ghost" onPress={onCancel} disabled={isLoading} />
            </ThemedView>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.actionHalf}>
              {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
              <PrimaryButton label={confirmLabel} onPress={onConfirm} loading={isLoading} />
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «backdrop» con el valor o tipo «{».
  backdrop: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'rgba(0,0,0,0.6)'».
    backgroundColor: 'rgba(0,0,0,0.6)',
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.four».
    padding: Spacing.four,
  },
  // Esta línea sirve para declarar la propiedad «card» con el valor o tipo «{».
  card: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «360».
    maxWidth: 360,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.four».
    padding: Spacing.four,
  },
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «{ textAlign: 'center' }».
  title: { textAlign: 'center' },
  // Esta línea sirve para declarar la propiedad «description» con el valor o tipo «{ textAlign: 'center' }».
  description: { textAlign: 'center' },
  // Esta línea sirve para definir el estilo «actions» con «flexDirection: 'row', gap: Spacing.three, marginTo…».
  actions: { flexDirection: 'row', gap: Spacing.three, marginTop: Spacing.two },
  // Esta línea sirve para declarar la propiedad «actionHalf» con el valor o tipo «{ flex: 1 }».
  actionHalf: { flex: 1 },
});
