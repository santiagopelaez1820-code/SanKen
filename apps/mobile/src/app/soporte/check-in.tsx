// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «ScrollView, StyleSheet» desde «react-native».
import { ScrollView, StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar los tipos «AnswerCheckinResponse» desde «@sanken/core».
import type { AnswerCheckinResponse } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';
// Esta línea sirve para importar «CheckinForm» desde «@/components/support/checkin-form».
import { CheckinForm } from '@/components/support/checkin-form';
// Esta línea sirve para importar «supportStrings as t» desde «@/components/support/support-ui».
import { supportStrings as t } from '@/components/support/support-ui';
// Esta línea sirve para importar «MaxContentWidth, Spacing» desde «@/constants/theme».
import { MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';
// Esta línea sirve para importar «useSupportStore» desde «@/store/support-store».
import { useSupportStore } from '@/store/support-store';

/**
 * Destino del aviso semanal y de la tarjeta de Soporte. Se puede responder
 * aunque antes se haya tocado "Ahora no", mientras sea la misma semana.
 */
// Esta línea sirve para declarar la función «WeeklyCheckinScreen».
export default function WeeklyCheckinScreen() {
  // Esta línea sirve para obtener «userId» con el hook «useAuthStore».
  const userId = useAuthStore((s) => s.user?.id);
  // Esta línea sirve para obtener «checkin, loadCheckin» con el hook «useSupportStore».
  const { checkin, loadCheckin } = useSupportStore();
  // Esta línea sirve para crear el estado «loading» y su función «setLoading».
  const [loading, setLoading] = useState(true);
  // Esta línea sirve para crear el estado «result» y su función «setResult».
  const [result, setResult] = useState<AnswerCheckinResponse | null>(null);

  // Siempre se relee al entrar (puede venir de un push de otro día).
  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para salir de la función si «!userId».
    if (!userId) return;
    // Esta línea sirve para ejecutar «loadCheckin» sin esperar su resultado.
    void loadCheckin(userId).finally(() => setLoading(false));
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «userId, loadCheckin».
  }, [userId, loadCheckin]);

  // Esta línea sirve para extraer «urren» de «checkin?.checkin».
  const current = checkin?.checkin;

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «ScrollView». */}
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="title" style={styles.pageTitle} accessibilityRole="header">
            {/* Esta línea sirve para mostrar el contenido dinámico «{t.checkinTitle} 💪». */}
            {t.checkinTitle} 💪
          </ThemedText>

          {/* Esta línea sirve para mostrar el elemento solo si «loading». */}
          {loading && <Skeleton style={styles.skeleton} />}
          {/* Esta línea sirve para mostrar el bloque solo si «!loading && result». */}
          {!loading && result && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText accessibilityRole="alert">
              {/* Esta línea sirve para mostrar el agradecimiento, con el número de ticket si se creó. */}
              {result.ticket ? t.checkinThanksWithTicket(result.ticket.id) : t.checkinThanks}
            </ThemedText>
          )}
          {/* Esta línea sirve para mostrar el elemento solo si «!loading && !result && !current». */}
          {!loading && !result && !current && <ThemedText themeColor="textSecondary">{t.checkinUnavailable}</ThemedText>}
          {/* Esta línea sirve para mostrar el aviso de que ya respondió esta semana. */}
          {!loading && !result && current?.status === 'answered' && <ThemedText themeColor="textSecondary">{t.checkinAnswered}</ThemedText>}
          {/* Esta línea sirve para mostrar el formulario si hay un check-in sin responder. */}
          {!loading && !result && current && current.status !== 'answered' && <CheckinForm onDone={setResult} />}

          {/* Esta línea sirve para mostrar el bloque solo si «result?.ticket». */}
          {result?.ticket && (
            // Esta línea sirve para mostrar el componente «PrimaryButton».
            <PrimaryButton label={t.requestNumber(result.ticket.id)} variant="ghost" onPress={() => router.replace({ pathname: '/soporte/[ticketId]', params: { ticketId: String(result.ticket?.id) } })} />
          )}
          {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
          <PrimaryButton label={t.back} variant="ghost" onPress={() => (router.canGoBack() ? router.back() : router.replace('/soporte' as never))} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «root» con el valor o tipo «{ flex: 1 }».
  root: { flex: 1 },
  // Esta línea sirve para definir el estilo «safeArea» con «flex: 1, alignItems: 'center', width: '100%' },…».
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  // Esta línea sirve para declarar la propiedad «scrollView» con el valor o tipo «{ alignSelf: 'stretch' }».
  scrollView: { alignSelf: 'stretch' },
  // Esta línea sirve para definir el estilo «content» con «width: '100%', maxWidth: MaxContentWidth, alignSel…».
  content: { width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center', padding: Spacing.four, gap: Spacing.three },
  // Esta línea sirve para declarar la propiedad «pageTitle» con el valor o tipo «{ fontSize: 24, lineHeight: 30 }».
  pageTitle: { fontSize: 24, lineHeight: 30 },
  // Esta línea sirve para declarar la propiedad «skeleton» con el valor o tipo «{ height: 200, borderRadius: Spacing.four }».
  skeleton: { height: 200, borderRadius: Spacing.four },
});
