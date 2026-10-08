// Esta línea sirve para importar «useState» desde «react».
import { useState } from 'react';
// Esta línea sirve para importar «Redirect, router» desde «expo-router».
import { Redirect, router } from 'expo-router';
// Esta línea sirve para importar «Image, ScrollView, StyleSheet, View» desde «react-native».
import { Image, ScrollView, StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «CONSENT_DOCUMENT, LEGAL_DOCUMENTS, LEGAL_STRINGS, type ConsentType» desde «@sanken/core».
import { CONSENT_DOCUMENT, LEGAL_DOCUMENTS, LEGAL_STRINGS, type ConsentType } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «ConsentCheckboxes» desde «@/components/legal/consent-checkboxes».
import { ConsentCheckboxes } from '@/components/legal/consent-checkboxes';
// Esta línea sirve para importar «DeleteAccountSection» desde «@/components/legal/delete-account-section».
import { DeleteAccountSection } from '@/components/legal/delete-account-section';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «MaxContentWidth, Spacing» desde «@/constants/theme».
import { MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «LEGAL_ROUTES» desde «@/lib/legal-routes».
import { LEGAL_ROUTES } from '@/lib/legal-routes';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';

/**
 * Re-aceptación (espejo de LegalConsentGate en la web): el usuario tiene
 * consentimientos pendientes — nunca aceptó (cuenta previa a este sistema)
 * o se publicó una versión nueva — y no puede seguir hasta aceptar o cerrar
 * sesión. Las pantallas autenticadas redirigen acá (ver (app)/_layout.tsx).
 */
// Esta línea sirve para declarar la función «AcceptLegalScreen».
export default function AcceptLegalScreen() {
  // Esta línea sirve para declarar «t» con el valor «LEGAL_STRINGS.es».
  const t = LEGAL_STRINGS.es;
  // Esta línea sirve para obtener «user» con el hook «useAuthStore».
  const user = useAuthStore((s) => s.user);
  // Esta línea sirve para obtener «token» con el hook «useAuthStore».
  const token = useAuthStore((s) => s.token);
  // Esta línea sirve para obtener «isAccepting» con el hook «useAuthStore».
  const isAccepting = useAuthStore((s) => s.isAcceptingConsents);
  // Esta línea sirve para obtener «error» con el hook «useAuthStore».
  const error = useAuthStore((s) => s.error);
  // Esta línea sirve para obtener «acceptPendingConsents» con el hook «useAuthStore».
  const acceptPendingConsents = useAuthStore((s) => s.acceptPendingConsents);
  // Esta línea sirve para obtener «logout» con el hook «useAuthStore».
  const logout = useAuthStore((s) => s.logout);
  // Esta línea sirve para crear el estado «values» y su función «setValues».
  const [values, setValues] = useState<Partial<Record<ConsentType, boolean>>>({});

  // Esta línea sirve para devolver «<Redirect href="/login" />» si «!token || !user».
  if (!token || !user) return <Redirect href="/login" />;

  // Esta línea sirve para extraer «endin» de «user.pending_consents ?? []».
  const pending = user.pending_consents ?? [];
  // Esta línea sirve para devolver «<Redirect href="/" />» si «pending.length === 0».
  if (pending.length === 0) return <Redirect href="/" />;

  // Esta línea sirve para extraer «llChecke» de «pending.every((type) => values[type])».
  const allChecked = pending.every((type) => values[type]);
  // Esta línea sirve para extraer «ocument» de «[...new Set(pending.map((type) => CONSEN».
  const documents = [...new Set(pending.map((type) => CONSENT_DOCUMENT[type]))];

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.flex}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.flex}>
        {/* Esta línea sirve para abrir el componente «ScrollView». */}
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Esta línea sirve para abrir el componente «Image». */}
          <Image source={require('@/assets/images/logo-full.png')} style={styles.logo} resizeMode="contain" />
          {/* Esta línea sirve para abrir el componente «View». */}
          <View style={styles.form}>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="subtitle" accessibilityRole="header">
              {/* Esta línea sirve para mostrar el valor «t.reacceptTitle». */}
              {t.reacceptTitle}
            </ThemedText>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el valor «t.reacceptDescription». */}
              {t.reacceptDescription}
            </ThemedText>

            {/* Esta línea sirve para recorrer «documents» y mostrar un bloque por elemento. */}
            {documents.map((id) => (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText key={id} type="small">
                {/* Esta línea sirve para abrir el componente «ThemedText» con sus propiedades. */}
                <ThemedText type="linkPrimary" onPress={() => router.push(LEGAL_ROUTES[id])}>
                  {/* Esta línea sirve para mostrar el contenido dinámico «{t.documentNames[id]}». */}
                  {t.documentNames[id]}
                </ThemedText>
                {/* Esta línea sirve para mostrar el contenido dinámico «{` · ${t.reacceptNewDocument(LEGAL_DOCUMENTS[id].version)}`}». */}
                {` · ${t.reacceptNewDocument(LEGAL_DOCUMENTS[id].version)}`}
              </ThemedText>
            ))}

            {/* Esta línea sirve para abrir el elemento «ConsentCheckboxes» con sus atributos en varias líneas. */}
            <ConsentCheckboxes
              // Esta línea sirve para pasar la propiedad «consents» con el valor «pending}».
              consents={pending}
              // Esta línea sirve para pasar la propiedad «values» con el valor «values}».
              values={values}
              // Esta línea sirve para pasar la propiedad «disabled» con el valor «isAccepting}».
              disabled={isAccepting}
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
              // Esta línea sirve para pasar la propiedad «label» con el valor «t.reacceptConfirm}».
              label={t.reacceptConfirm}
              // Esta línea sirve para pasar la propiedad «loading» con el valor «isAccepting}».
              loading={isAccepting}
              // Esta línea sirve para pasar la propiedad «disabled» con el valor «!allChecked || isAccepting}».
              disabled={!allChecked || isAccepting}
              // Esta línea sirve para asignar el manejador del evento «onPress».
              onPress={() => {
                // Esta línea sirve para llamar a «acceptPendingConsents» con «pending).catch(() => {}».
                acceptPendingConsents(pending).catch(() => {});
              }}
            />
            {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
            <PrimaryButton label={t.reacceptLogout} variant="ghost" onPress={() => void logout()} />
            {/* Esta línea sirve para abrir el componente «DeleteAccountSection». */}
            <DeleteAccountSection compact />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «{ flex: 1 }».
  flex: { flex: 1 },
  // Esta línea sirve para definir el estilo «scroll» con «flexGrow: 1, justifyContent: 'center', alignItems:…».
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.four, gap: Spacing.three },
  // Esta línea sirve para declarar la propiedad «logo» con el valor o tipo «{ width: 180, height: 120 }».
  logo: { width: 180, height: 120 },
  // Esta línea sirve para definir el estilo «form» con «alignSelf: 'stretch', maxWidth: MaxContentWidth, g…».
  form: { alignSelf: 'stretch', maxWidth: MaxContentWidth, gap: Spacing.three },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
});
