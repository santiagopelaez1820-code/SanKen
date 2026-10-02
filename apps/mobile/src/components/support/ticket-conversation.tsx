import { StyleSheet, View } from 'react-native';
import type { SupportTicketMessage } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatSupportDate, supportStrings as t } from '@/components/support/support-ui';

/** Historial de la conversación (espejo de TicketConversation de la web). */
export function TicketConversation({ messages, viewer }: { messages: SupportTicketMessage[]; viewer: 'user' | 'staff' }) {
  const theme = useTheme();

  return (
    <View style={styles.list} accessibilityLabel={t.conversation}>
      {messages.map((message) => {
        const mine = viewer === 'staff' ? message.is_staff : !message.is_staff;
        const author = message.is_staff
          ? message.author_name
            ? `${message.author_name} · ${t.staffName}`
            : t.staffName
          : viewer === 'user'
            ? t.youName
            : (message.author_name ?? t.admin.user);

        return (
          <View key={message.id} style={[styles.item, mine ? styles.mine : styles.theirs]}>
            <ThemedView
              type={message.is_staff ? undefined : 'backgroundElement'}
              style={[
                styles.bubble,
                message.is_staff && { borderColor: theme.accent, borderWidth: 1, backgroundColor: `${theme.accent}1A` },
              ]}
            >
              <ThemedText type="small" selectable>
                {message.body}
              </ThemedText>
            </ThemedView>
            <ThemedText type="small" themeColor="textSecondary" style={styles.meta}>
              {author} · {formatSupportDate(message.created_at, true)}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.three },
  item: { gap: Spacing.half, maxWidth: '88%' },
  mine: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  theirs: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubble: { borderRadius: 16, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two },
  meta: { fontSize: 12 },
});
