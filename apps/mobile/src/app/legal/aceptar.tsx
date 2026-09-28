import { useState } from 'react';
import { Redirect, router } from 'expo-router';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CONSENT_DOCUMENT, LEGAL_DOCUMENTS, LEGAL_STRINGS, type ConsentType } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ConsentCheckboxes } from '@/components/legal/consent-checkboxes';
import { DeleteAccountSection } from '@/components/legal/delete-account-section';
import { PrimaryButton } from '@/components/ui/primary-button';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { LEGAL_ROUTES } from '@/lib/legal-routes';
import { useAuthStore } from '@/store/auth-store';

/**
 * Re-aceptación (espejo de LegalConsentGate en la web): el usuario tiene
 * consentimientos pendientes — nunca aceptó (cuenta previa a este sistema)
 * o se publicó una versión nueva — y no puede seguir hasta aceptar o cerrar
 * sesión. Las pantallas autenticadas redirigen acá (ver (app)/_layout.tsx).
 */
export default function AcceptLegalScreen() {
  const t = LEGAL_STRINGS.es;
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAccepting = useAuthStore((s) => s.isAcceptingConsents);
  const error = useAuthStore((s) => s.error);
  const acceptPendingConsents = useAuthStore((s) => s.acceptPendingConsents);
  const logout = useAuthStore((s) => s.logout);
  const [values, setValues] = useState<Partial<Record<ConsentType, boolean>>>({});

  if (!token || !user) return <Redirect href="/login" />;

  const pending = user.pending_consents ?? [];
  if (pending.length === 0) return <Redirect href="/" />;

  const allChecked = pending.every((type) => values[type]);
  const documents = [...new Set(pending.map((type) => CONSENT_DOCUMENT[type]))];

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Image source={require('@/assets/images/logo-full.png')} style={styles.logo} resizeMode="contain" />
          <View style={styles.form}>
            <ThemedText type="subtitle" accessibilityRole="header">
              {t.reacceptTitle}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {t.reacceptDescription}
            </ThemedText>

            {documents.map((id) => (
              <ThemedText key={id} type="small">
                <ThemedText type="linkPrimary" onPress={() => router.push(LEGAL_ROUTES[id])}>
                  {t.documentNames[id]}
                </ThemedText>
                {` · ${t.reacceptNewDocument(LEGAL_DOCUMENTS[id].version)}`}
              </ThemedText>
            ))}

            <ConsentCheckboxes
              consents={pending}
              values={values}
              disabled={isAccepting}
              onChange={(type, checked) => setValues((prev) => ({ ...prev, [type]: checked }))}
            />

            {error && (
              <ThemedText type="small" style={styles.error} accessibilityRole="alert">
                {error}
              </ThemedText>
            )}

            <PrimaryButton
              label={t.reacceptConfirm}
              loading={isAccepting}
              disabled={!allChecked || isAccepting}
              onPress={() => {
                acceptPendingConsents(pending).catch(() => {});
              }}
            />
            <PrimaryButton label={t.reacceptLogout} variant="ghost" onPress={() => void logout()} />
            <DeleteAccountSection compact />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.four, gap: Spacing.four },
  logo: { width: 180, height: 120 },
  form: { alignSelf: 'stretch', maxWidth: MaxContentWidth, gap: Spacing.three },
  error: { color: '#FF4D5E' },
});
