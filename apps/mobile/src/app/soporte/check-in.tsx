import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { AnswerCheckinResponse } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckinForm } from '@/components/support/checkin-form';
import { supportStrings as t } from '@/components/support/support-ui';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';
import { useSupportStore } from '@/store/support-store';

/**
 * Destino del aviso semanal y de la tarjeta de Soporte. Se puede responder
 * aunque antes se haya tocado "Ahora no", mientras sea la misma semana.
 */
export default function WeeklyCheckinScreen() {
  const userId = useAuthStore((s) => s.user?.id);
  const { checkin, loadCheckin } = useSupportStore();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AnswerCheckinResponse | null>(null);

  // Siempre se relee al entrar (puede venir de un push de otro día).
  useEffect(() => {
    if (!userId) return;
    void loadCheckin(userId).finally(() => setLoading(false));
  }, [userId, loadCheckin]);

  const current = checkin?.checkin;

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ThemedText type="title" style={styles.pageTitle} accessibilityRole="header">
            {t.checkinTitle} 💪
          </ThemedText>

          {loading && <Skeleton style={styles.skeleton} />}
          {!loading && result && (
            <ThemedText accessibilityRole="alert">
              {result.ticket ? t.checkinThanksWithTicket(result.ticket.id) : t.checkinThanks}
            </ThemedText>
          )}
          {!loading && !result && !current && <ThemedText themeColor="textSecondary">{t.checkinUnavailable}</ThemedText>}
          {!loading && !result && current?.status === 'answered' && <ThemedText themeColor="textSecondary">{t.checkinAnswered}</ThemedText>}
          {!loading && !result && current && current.status !== 'answered' && <CheckinForm onDone={setResult} />}

          {result?.ticket && (
            <PrimaryButton label={t.requestNumber(result.ticket.id)} variant="ghost" onPress={() => router.replace({ pathname: '/soporte/[ticketId]', params: { ticketId: String(result.ticket?.id) } })} />
          )}
          <PrimaryButton label={t.back} variant="ghost" onPress={() => (router.canGoBack() ? router.back() : router.replace('/soporte' as never))} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  scrollView: { alignSelf: 'stretch' },
  content: { width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center', padding: Spacing.four, gap: Spacing.three },
  pageTitle: { fontSize: 24, lineHeight: 30 },
  skeleton: { height: 200, borderRadius: Spacing.four },
});
