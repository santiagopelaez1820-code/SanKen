import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge } from '@/components/ui/badge';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Skeleton } from '@/components/ui/skeleton';
import { TextField } from '@/components/ui/text-field';
import { formatSupportDate, STATUS_BADGE, supportStrings as t } from '@/components/support/support-ui';
import { TicketConversation } from '@/components/support/ticket-conversation';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useSupportStore } from '@/store/support-store';

/** Conversación de una solicitud propia (destino también de la notificación de respuesta). */
export default function SupportTicketScreen() {
  const { ticketId } = useLocalSearchParams<{ ticketId: string }>();
  const { ticket, isLoadingTicket, isSubmitting, error, loadTicket, reply, closeTicket } = useSupportStore();
  const [body, setBody] = useState('');

  useEffect(() => {
    if (ticketId) void loadTicket(ticketId);
  }, [ticketId, loadTicket]);

  const current = ticket && String(ticket.id) === ticketId ? ticket : null;

  return (
    <ThemedView style={styles.root}>
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <PrimaryButton label={t.myRequests} variant="ghost" onPress={() => (router.canGoBack() ? router.back() : router.replace('/soporte' as never))} />

            {isLoadingTicket && !current && <Skeleton style={styles.skeleton} />}
            {error && !current && (
              <ThemedText type="small" style={styles.error}>
                {error}
              </ThemedText>
            )}

            {current && (
              <>
                <View style={styles.badges}>
                  <ThemedText type="small" themeColor="textSecondary">
                    {t.requestNumber(current.id)}
                  </ThemedText>
                  <Badge label={t.types[current.type]} variant="neutral" />
                  <Badge label={t.statuses[current.status]} variant={STATUS_BADGE[current.status]} />
                </View>
                <ThemedText type="subtitle" accessibilityRole="header">
                  {current.subject}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {t.createdOn(formatSupportDate(current.created_at, true))}
                  {current.source === 'weekly_checkin' ? ` · ${t.fromCheckin}` : ''}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" accessibilityLiveRegion="polite">
                  {t.statusHints[current.status]}
                </ThemedText>

                <TicketConversation messages={current.messages ?? []} viewer="user" />

                {error && (
                  <ThemedText type="small" style={styles.error} accessibilityRole="alert">
                    {error}
                  </ThemedText>
                )}

                {current.status === 'closed' ? (
                  <ThemedText type="small" themeColor="textSecondary">
                    {t.closedNotice}
                  </ThemedText>
                ) : (
                  <>
                    <TextField label={t.reply} placeholder={t.replyPlaceholder} value={body} onChangeText={setBody} multiline maxLength={5000} />
                    <PrimaryButton
                      label={t.reply}
                      loading={isSubmitting}
                      disabled={!body.trim() || isSubmitting}
                      onPress={() => {
                        reply(current.id, body.trim())
                          .then(() => setBody(''))
                          .catch(() => {});
                      }}
                    />
                    <PrimaryButton label={t.closeRequest} variant="ghost" disabled={isSubmitting} onPress={() => void closeTicket(current.id).catch(() => {})} />
                  </>
                )}
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  scrollView: { alignSelf: 'stretch' },
  content: { width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center', padding: Spacing.four, gap: Spacing.three },
  badges: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, flexWrap: 'wrap' },
  skeleton: { height: 160, borderRadius: Spacing.four },
  error: { color: '#FF4D5E' },
});
