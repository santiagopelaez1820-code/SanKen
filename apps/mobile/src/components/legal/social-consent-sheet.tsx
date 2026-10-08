// Esta línea sirve para importar «useState» desde «react».
import { useState } from 'react';
// Esta línea sirve para importar «StyleSheet, View» desde «react-native».
import { StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «LEGAL_STRINGS, type ConsentType» desde «@sanken/core».
import { LEGAL_STRINGS, type ConsentType } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ConsentCheckboxes» desde «@/components/legal/consent-checkboxes».
import { ConsentCheckboxes } from '@/components/legal/consent-checkboxes';
// Esta línea sirve para importar «BottomSheet» desde «@/components/ui/bottom-sheet».
import { BottomSheet } from '@/components/ui/bottom-sheet';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';

/**
 * Se abre cuando "Continuar con Google" crearía una cuenta NUEVA: la cuenta
 * no existe todavía y no se crea hasta marcar todas las casillas. Usa el
 * estado pendingSocialConsent de auth-store (compartido por login y registro).
 */
// Esta línea sirve para declarar la función «SocialConsentSheet».
export function SocialConsentSheet({ onAuthenticated }: { onAuthenticated?: () => void }) {
  // Esta línea sirve para obtener «pending» con el hook «useAuthStore».
  const pending = useAuthStore((s) => s.pendingSocialConsent);
  // Esta línea sirve para obtener «cancel» con el hook «useAuthStore».
  const cancel = useAuthStore((s) => s.cancelGoogleConsent);

  // key: cada intento nuevo de Google arranca con las casillas desmarcadas.
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «BottomSheet».
    <BottomSheet visible={!!pending} onClose={cancel}>
      {/* Esta línea sirve para abrir el componente «SheetBody». */}
      <SheetBody key={pending?.idToken ?? 'none'} onAuthenticated={onAuthenticated} />
    </BottomSheet>
  );
}

// Esta línea sirve para declarar la función «SheetBody».
function SheetBody({ onAuthenticated }: { onAuthenticated?: () => void }) {
  // Esta línea sirve para declarar «t» con el valor «LEGAL_STRINGS.es».
  const t = LEGAL_STRINGS.es;
  // Esta línea sirve para obtener «pending» con el hook «useAuthStore».
  const pending = useAuthStore((s) => s.pendingSocialConsent);
  // Esta línea sirve para obtener «isSubmitting» con el hook «useAuthStore».
  const isSubmitting = useAuthStore((s) => s.isSubmittingGoogle);
  // Esta línea sirve para obtener «error» con el hook «useAuthStore».
  const error = useAuthStore((s) => s.error);
  // Esta línea sirve para obtener «confirm» con el hook «useAuthStore».
  const confirm = useAuthStore((s) => s.confirmGoogleConsent);
  // Esta línea sirve para obtener «cancel» con el hook «useAuthStore».
  const cancel = useAuthStore((s) => s.cancelGoogleConsent);
  // Esta línea sirve para crear el estado «values» y su función «setValues».
  const [values, setValues] = useState<Partial<Record<ConsentType, boolean>>>({});
  // Esta línea sirve para extraer «onsent» de «pending?.consents.map((c) => c.type) ?? ».
  const consents = pending?.consents.map((c) => c.type) ?? [];
  // Esta línea sirve para extraer «llChecke» de «consents.length > 0 && consents.every((t».
  const allChecked = consents.length > 0 && consents.every((type) => values[type]);

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «View».
    <View style={styles.content}>
      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="subtitle" accessibilityRole="header">
        {/* Esta línea sirve para mostrar el valor «t.socialConsentTitle». */}
        {t.socialConsentTitle}
      </ThemedText>
      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="small" themeColor="textSecondary">
        {/* Esta línea sirve para mostrar el valor «t.socialConsentDescription». */}
        {t.socialConsentDescription}
      </ThemedText>
      {/* Esta línea sirve para abrir el elemento «ConsentCheckboxes» con sus atributos en varias líneas. */}
      <ConsentCheckboxes
        // Esta línea sirve para pasar la propiedad «consents» con el valor «consents}».
        consents={consents}
        // Esta línea sirve para pasar la propiedad «values» con el valor «values}».
        values={values}
        // Esta línea sirve para pasar la propiedad «disabled» con el valor «isSubmitting}».
        disabled={isSubmitting}
        // Esta línea sirve para asignar el manejador del evento «onChange».
        onChange={(type, checked) => setValues((prev) => ({ ...prev, [type]: checked }))}
      />
      {/* Esta línea sirve para mostrar el bloque solo si «error». */}
      {error && (
        // Esta línea sirve para abrir el componente «ThemedText».
        <ThemedText type="small" style={styles.error} accessibilityRole="alert">
          {/* Esta línea sirve para mostrar el valor «error». */}
          {error}
        </ThemedText>
      )}
      {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
      <PrimaryButton
        // Esta línea sirve para pasar la propiedad «label» con el valor «t.socialConsentConfirm}».
        label={t.socialConsentConfirm}
        // Esta línea sirve para pasar la propiedad «loading» con el valor «isSubmitting}».
        loading={isSubmitting}
        // Esta línea sirve para pasar la propiedad «disabled» con el valor «!allChecked || isSubmitting}».
        disabled={!allChecked || isSubmitting}
        // Esta línea sirve para asignar el manejador del evento «onPress».
        onPress={() => {
          // Esta línea sirve para llamar a «confirm» con «values».
          confirm(values)
            // Esta línea sirve para llamar a «.then» con una función.
            .then(() => {
              // Esta línea sirve para avisar que se autenticó si ya no quedan consentimientos pendientes.
              if (!useAuthStore.getState().pendingSocialConsent) onAuthenticated?.();
            })
            // Esta línea sirve para encadenar la operación «catch».
            .catch(() => {});
        }}
      />
      {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
      <PrimaryButton label={t.cancel} variant="ghost" disabled={isSubmitting} onPress={cancel} />
    </View>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para definir el estilo «content» con «gap: Spacing.three, paddingBottom: Spacing.three }…».
  content: { gap: Spacing.three, paddingBottom: Spacing.three },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
});
