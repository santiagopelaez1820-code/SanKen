import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CHECKIN_MOODS,
  SUPPORT_TICKET_PRIORITIES,
  SUPPORT_TICKET_STATUSES,
  type CheckinMood,
  type CheckinTopic,
} from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge } from '@/components/ui/badge';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Skeleton } from '@/components/ui/skeleton';
import { TextField } from '@/components/ui/text-field';
import { formatSupportDate, PRIORITY_BADGE, STATUS_BADGE, supportStrings } from '@/components/support/support-ui';
import { TicketConversation } from '@/components/support/ticket-conversation';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSupportStore } from '@/store/support-store';

const t = supportStrings;
const s = supportStrings.admin;

function contextValue(key: string, value: unknown): string {
  if (key === 'mood' && CHECKIN_MOODS.includes(value as CheckinMood)) {
    const mood = t.moods[value as CheckinMood];
    return `${mood.emoji} ${mood.label}`;
  }
  if (key === 'topic' && typeof value === 'string' && value in t.topics) return t.topics[value as CheckinTopic];
  return value === null || value === undefined ? '—' : String(value);
}

/** Detalle de una solicitud para el equipo: responder y cambiar estado/prioridad/responsable. */
export default function AdminSupportTicketScreen() {
  const theme = useTheme();
  const { ticketId } = useLocalSearchParams<{ ticketId: string }>();
  const { adminTicket, staff, isLoadingTicket, isSubmitting, error, loadAdminTicket, adminReply, adminUpdate } = useSupportStore();
  const [body, setBody] = useState('');

  useEffect(() => {
    if (ticketId) void loadAdminTicket(ticketId);
  }, [ticketId, loadAdminTicket]);

  const ticket = adminTicket && String(adminTicket.id) === ticketId ? adminTicket : null;

  const chip = (selected: boolean) => [
    styles.chip,
    { borderColor: theme.backgroundSelected },
    selected && { backgroundColor: theme.backgroundSelected },
  ];

  return (
    <ThemedView style={styles.root}>
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <PrimaryButton label={s.title} variant="ghost" onPress={() => (router.canGoBack() ? router.back() : router.replace('/admin/soporte'))} />

            {isLoadingTicket && !ticket && <Skeleton height={160} />}
            {error && (
              <ThemedText type="small" style={styles.error} accessibilityRole="alert">
                {error}
              </ThemedText>
            )}

            {ticket && (
              <>
                <View style={styles.badges}>
                  <ThemedText type="small" themeColor="textSecondary">
                    {t.requestNumber(ticket.id)}
                  </ThemedText>
                  <Badge label={t.types[ticket.type]} variant="neutral" />
                  <Badge label={t.statuses[ticket.status]} variant={STATUS_BADGE[ticket.status]} />
                  <Badge label={t.priorities[ticket.priority]} variant={PRIORITY_BADGE[ticket.priority]} />
                </View>
                <ThemedText type="subtitle" accessibilityRole="header">
                  {ticket.subject}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {ticket.user?.name} · {ticket.user?.email} · {formatSupportDate(ticket.created_at, true)}
                </ThemedText>

                <TicketConversation messages={ticket.messages ?? []} viewer="staff" />

                <TextField label={s.replyAsStaff} value={body} onChangeText={setBody} multiline maxLength={5000} />
                <PrimaryButton
                  label={t.reply}
                  loading={isSubmitting}
                  disabled={!body.trim() || isSubmitting}
                  onPress={() => {
                    adminReply(ticket.id, body.trim())
                      .then(() => setBody(''))
                      .catch(() => {});
                  }}
                />

                <ThemedText type="smallBold">{s.status}</ThemedText>
                <View style={styles.chips}>
                  {SUPPORT_TICKET_STATUSES.map((value) => (
                    <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: ticket.status === value }} disabled={isSubmitting} onPress={() => void adminUpdate(ticket.id, { status: value }).catch(() => {})} style={chip(ticket.status === value)}>
                      <ThemedText type="small">{t.statuses[value]}</ThemedText>
                    </Pressable>
                  ))}
                </View>

                <ThemedText type="smallBold">{s.priority}</ThemedText>
                <View style={styles.chips}>
                  {SUPPORT_TICKET_PRIORITIES.map((value) => (
                    <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: ticket.priority === value }} disabled={isSubmitting} onPress={() => void adminUpdate(ticket.id, { priority: value }).catch(() => {})} style={chip(ticket.priority === value)}>
                      <ThemedText type="small">{t.priorities[value]}</ThemedText>
                    </Pressable>
                  ))}
                </View>

                <ThemedText type="smallBold">{s.assignee}</ThemedText>
                <View style={styles.chips}>
                  <Pressable accessibilityRole="button" accessibilityState={{ selected: !ticket.assignee }} disabled={isSubmitting} onPress={() => void adminUpdate(ticket.id, { assigned_to: null }).catch(() => {})} style={chip(!ticket.assignee)}>
                    <ThemedText type="small">{s.unassigned}</ThemedText>
                  </Pressable>
                  {staff.map((member) => (
                    <Pressable key={member.id} accessibilityRole="button" accessibilityState={{ selected: ticket.assignee?.id === member.id }} disabled={isSubmitting} onPress={() => void adminUpdate(ticket.id, { assigned_to: member.id }).catch(() => {})} style={chip(ticket.assignee?.id === member.id)}>
                      <ThemedText type="small">{member.name}</ThemedText>
                    </Pressable>
                  ))}
                </View>

                {ticket.context && (
                  <ThemedView type="backgroundElement" style={styles.card}>
                    <ThemedText type="smallBold">{s.context}</ThemedText>
                    {Object.entries(ticket.context).map(([key, value]) => (
                      <ThemedText key={key} type="small" themeColor="textSecondary">
                        {s.contextLabels[key] ?? key}: {contextValue(key, value)}
                      </ThemedText>
                    ))}
                  </ThemedView>
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
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one, minHeight: 36, justifyContent: 'center' },
  card: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.one },
  error: { color: '#FF4D5E' },
});
