import { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SUPPORT_TICKET_STATUSES, SUPPORT_TICKET_TYPES } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge } from '@/components/ui/badge';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Skeleton } from '@/components/ui/skeleton';
import { StatTile } from '@/components/ui/stat-tile';
import { TextField } from '@/components/ui/text-field';
import { formatSupportDate, PRIORITY_BADGE, STATUS_BADGE, supportStrings } from '@/components/support/support-ui';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSupportStore } from '@/store/support-store';

const t = supportStrings;
const s = supportStrings.admin;

/** Panel de soporte (super_admin): indicadores, filtros y solicitudes. */
export default function AdminSupportScreen() {
  const theme = useTheme();
  const { adminTickets, stats, isLoadingTickets, error, loadAdmin } = useSupportStore();
  const [status, setStatus] = useState('awaiting');
  const [type, setType] = useState('');
  const [q, setQ] = useState('');
  const [user, setUser] = useState('');

  const query = new URLSearchParams({ status, ...(type ? { type } : {}), ...(q ? { q } : {}), ...(user ? { user } : {}) }).toString();

  useFocusEffect(
    useCallback(() => {
      void loadAdmin(query);
    }, [loadAdmin, query])
  );

  const chip = (selected: boolean) => [
    styles.chip,
    { borderColor: theme.backgroundSelected },
    selected && { backgroundColor: theme.backgroundSelected },
  ];

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]} keyboardShouldPersistTaps="handled">
          <ThemedText type="title" style={styles.pageTitle} accessibilityRole="header">
            {s.title}
          </ThemedText>

          {stats && (
            <View style={styles.tiles}>
              <StatTile label={s.stats.open} value={String(stats.tickets.open)} />
              <StatTile label={s.stats.inReview} value={String(stats.tickets.in_review)} />
              <StatTile label={s.stats.awaiting} value={String(stats.tickets.awaiting_staff)} />
              <StatTile label={s.stats.resolved} value={String(stats.tickets.resolved)} />
              <StatTile label={s.stats.thisWeek} value={String(stats.tickets.this_week)} />
            </View>
          )}
          {stats && (
            <ThemedView type="backgroundElement" style={styles.card}>
              <ThemedText type="smallBold">{s.stats.checkinsTitle}</ThemedText>
              {stats.checkins.weeks.map((week) => (
                <ThemedText key={week.week} type="small" themeColor="textSecondary">
                  {week.week}: {s.stats.offered} {week.offered} · {s.stats.answered} {week.answered} · {s.stats.postponed} {week.postponed}
                  {week.ignored !== null ? ` · ${s.stats.ignored} ${week.ignored}` : ''}
                  {week.response_rate !== null ? ` · ${week.response_rate}%` : ''}
                </ThemedText>
              ))}
            </ThemedView>
          )}

          <TextField label={s.search} value={q} onChangeText={setQ} autoCapitalize="none" />
          <TextField label={s.searchUser} value={user} onChangeText={setUser} autoCapitalize="none" />

          <View style={styles.chips}>
            {['awaiting', 'all', ...SUPPORT_TICKET_STATUSES].map((value) => (
              <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: status === value }} onPress={() => setStatus(value)} style={chip(status === value)}>
                <ThemedText type="small">
                  {value === 'awaiting' ? s.awaiting : value === 'all' ? s.allStatuses : t.statuses[value as keyof typeof t.statuses]}
                </ThemedText>
              </Pressable>
            ))}
          </View>
          <View style={styles.chips}>
            {['', ...SUPPORT_TICKET_TYPES].map((value) => (
              <Pressable key={value || 'all'} accessibilityRole="button" accessibilityState={{ selected: type === value }} onPress={() => setType(value)} style={chip(type === value)}>
                <ThemedText type="small">{value ? t.types[value as keyof typeof t.types] : s.allTypes}</ThemedText>
              </Pressable>
            ))}
          </View>

          {isLoadingTickets && adminTickets.length === 0 && <Skeleton height={72} />}
          {error && (
            <ThemedText type="small" style={styles.error}>
              {error}
            </ThemedText>
          )}
          {!isLoadingTickets && adminTickets.length === 0 && (
            <ThemedText type="small" themeColor="textSecondary">
              {s.empty}
            </ThemedText>
          )}

          {adminTickets.map((ticket) => (
            <Pressable key={ticket.id} accessibilityRole="link" onPress={() => router.push({ pathname: '/admin/soporte/[ticketId]', params: { ticketId: String(ticket.id) } })}>
              <ThemedView type="backgroundElement" style={styles.card}>
                <View style={styles.badges}>
                  <ThemedText type="small" themeColor="textSecondary">
                    #{ticket.id}
                  </ThemedText>
                  <Badge label={t.types[ticket.type]} variant="neutral" />
                  <Badge label={t.statuses[ticket.status]} variant={STATUS_BADGE[ticket.status]} />
                  <Badge label={t.priorities[ticket.priority]} variant={PRIORITY_BADGE[ticket.priority]} />
                </View>
                <ThemedText type="smallBold" numberOfLines={1}>
                  {ticket.subject}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {ticket.user?.name} · {formatSupportDate(ticket.last_message_at, true)}
                </ThemedText>
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
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  card: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.one },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one, minHeight: 36, justifyContent: 'center' },
  badges: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, flexWrap: 'wrap' },
  error: { color: '#FF4D5E' },
});
