import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LEGAL_STRINGS, type ConsentType } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ConsentCheckboxes } from '@/components/legal/consent-checkboxes';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Spacing } from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';

/**
 * Se abre cuando "Continuar con Google" crearía una cuenta NUEVA: la cuenta
 * no existe todavía y no se crea hasta marcar todas las casillas. Usa el
 * estado pendingSocialConsent de auth-store (compartido por login y registro).
 */
export function SocialConsentSheet({ onAuthenticated }: { onAuthenticated?: () => void }) {
  const pending = useAuthStore((s) => s.pendingSocialConsent);
  const cancel = useAuthStore((s) => s.cancelGoogleConsent);

  // key: cada intento nuevo de Google arranca con las casillas desmarcadas.
  return (
    <BottomSheet visible={!!pending} onClose={cancel}>
      <SheetBody key={pending?.idToken ?? 'none'} onAuthenticated={onAuthenticated} />
    </BottomSheet>
  );
}

function SheetBody({ onAuthenticated }: { onAuthenticated?: () => void }) {
  const t = LEGAL_STRINGS.es;
  const pending = useAuthStore((s) => s.pendingSocialConsent);
  const isSubmitting = useAuthStore((s) => s.isSubmittingGoogle);
  const error = useAuthStore((s) => s.error);
  const confirm = useAuthStore((s) => s.confirmGoogleConsent);
  const cancel = useAuthStore((s) => s.cancelGoogleConsent);
  const [values, setValues] = useState<Partial<Record<ConsentType, boolean>>>({});
  const consents = pending?.consents.map((c) => c.type) ?? [];
  const allChecked = consents.length > 0 && consents.every((type) => values[type]);

  return (
    <View style={styles.content}>
      <ThemedText type="subtitle" accessibilityRole="header">
        {t.socialConsentTitle}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {t.socialConsentDescription}
      </ThemedText>
      <ConsentCheckboxes
        consents={consents}
        values={values}
        disabled={isSubmitting}
        onChange={(type, checked) => setValues((prev) => ({ ...prev, [type]: checked }))}
      />
      {error && (
        <ThemedText type="small" style={styles.error} accessibilityRole="alert">
          {error}
        </ThemedText>
      )}
      <PrimaryButton
        label={t.socialConsentConfirm}
        loading={isSubmitting}
        disabled={!allChecked || isSubmitting}
        onPress={() => {
          confirm(values)
            .then(() => {
              if (!useAuthStore.getState().pendingSocialConsent) onAuthenticated?.();
            })
            .catch(() => {});
        }}
      />
      <PrimaryButton label={t.cancel} variant="ghost" disabled={isSubmitting} onPress={cancel} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.three, paddingBottom: Spacing.three },
  error: { color: '#FF4D5E' },
});
