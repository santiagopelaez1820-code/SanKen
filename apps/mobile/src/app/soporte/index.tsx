import { useCallback } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, HeartPulse } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatSupportDate, STATUS_BADGE, supportStrings as t } from '@/components/support/support-ui';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSupportStore } from '@/store/support-store';

/** Soporte: solicitudes propias, nueva solicitud y acceso al check-in semanal. */
export default function SupportScreen() {
  const theme = useTheme();
  const { tickets, isLoadingTickets, error, loadTickets, checkin } = useSupportStore();
  const checkinOpen = checkin?.checkin && checkin.checkin.status !== 'answered';

  // Se recarga al volver a la pantalla (p. ej. tras crear o responder una solicitud).
  useFocusEffect(
    useCallback(() => {
      void loadTickets();
    }, [loadTickets])
  );

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
          <ThemedText type="title" style={styles.pageTitle} accessibilityRole="header">
            {t.sectionTitle}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {t.sectionSubtitle}
          </ThemedText>

          <PrimaryButton label={t.newRequest} onPress={() => router.push('/soporte/nueva')} />

          {checkinOpen && (
            <Pressable accessibilityRole="link" onPress={() => router.push('/soporte/check-in')}>
              <ThemedView type="backgroundElement" style={[styles.card, styles.row, { borderColor: theme.accent, borderWidth: 1 }]}>
                <Icon icon={HeartPulse} size={20} color={theme.accent} />
                <View style={styles.flex}>
                  <ThemedText type="smallBold">{t.checkinTitle}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {t.checkinCta}
                  </ThemedText>
                </View>
                <Icon icon={ChevronRight} size={18} color={theme.textSecondary} />
              </ThemedView>
            </Pressable>
          )}

          <ThemedText type="smallBold" themeColor="textSecondary">
            {t.myRequests}
          </ThemedText>

          {isLoadingTickets && tickets.length === 0 && <Skeleton style={styles.skeleton} />}
          {error && (
            <ThemedText type="small" style={styles.error}>
              {error}
            </ThemedText>
          )}
          {!isLoadingTickets && tickets.length === 0 && !error && (
            <ThemedText type="small" themeColor="textSecondary">
              {t.emptyRequests}
            </ThemedText>
          )}

          {tickets.map((ticket) => (
            <Pressable key={ticket.id} accessibilityRole="link" onPress={() => router.push({ pathname: '/soporte/[ticketId]', params: { ticketId: String(ticket.id) } })}>
              <ThemedView type="backgroundElement" style={[styles.card, styles.row]}>
                <View style={styles.flex}>
                  <View style={styles.badges}>
                    <ThemedText type="small" themeColor="textSecondary">
                      #{ticket.id}
                    </ThemedText>
                    <Badge label={t.types[ticket.type]} variant="neutral" />
                    <Badge label={t.statuses[ticket.status]} variant={STATUS_BADGE[ticket.status]} />
                  </View>
                  <ThemedText type="smallBold" numberOfLines={1}>
                    {ticket.subject}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {ticket.status === 'answered' && ticket.last_message_by_staff ? `${t.newReply} · ` : ''}
                    {t.lastActivity(formatSupportDate(ticket.last_message_at))}
                  </ThemedText>
                </View>
                <Icon icon={ChevronRight} size={18} color={theme.textSecondary} />
              </ThemedView>
            </Pressable>
          ))}

          <PrimaryButton label={t.back} variant="ghost" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  scrollView: { alignSelf: 'stretch' },
  content: { width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center', paddingHorizontal: Spacing.four, paddingTop: Spacing.three, gap: Spacing.three },
  pageTitle: { fontSize: 24, lineHeight: 30 },
  card: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.one },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  flex: { flex: 1, gap: Spacing.one },
  badges: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, flexWrap: 'wrap' },
  skeleton: { height: 72, borderRadius: Spacing.four },
  error: { color: '#FF4D5E' },
});
