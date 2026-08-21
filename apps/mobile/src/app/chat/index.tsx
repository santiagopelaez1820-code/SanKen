import { useEffect } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useChatStore } from '@/store/chat-store';

export default function ChatInboxScreen() {
  const theme = useTheme();
  const { conversations, isLoadingInbox, inboxError, loadInbox } = useChatStore();

  useEffect(() => {
    loadInbox();
  }, [loadInbox]);

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <ThemedText type="title" style={styles.pageTitle}>
            Chat
          </ThemedText>

          {isLoadingInbox && (
            <ThemedText type="small" themeColor="textSecondary">
              Cargando…
            </ThemedText>
          )}
          {inboxError && (
            <ThemedText type="small" style={styles.error}>
              {inboxError}
            </ThemedText>
          )}
          {!isLoadingInbox && conversations.length === 0 && (
            <ThemedText type="small" themeColor="textSecondary">
              Todavía no tenés conversaciones.
            </ThemedText>
          )}

          {conversations.map((conversation) => (
            <Pressable
              key={conversation.id}
              onPress={() => router.push(`/chat/${conversation.id}`)}
              style={[styles.row, { borderColor: theme.backgroundSelected }]}
            >
              <ThemedView style={styles.rowInfo}>
                <ThemedText type="smallBold">{conversation.other_party.name}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                  {conversation.last_message?.body ?? 'Sin mensajes todavía'}
                </ThemedText>
              </ThemedView>
              {conversation.unread_count > 0 && (
                <ThemedView style={[styles.badge, { backgroundColor: theme.accent }]}>
                  <ThemedText type="small" style={styles.badgeLabel}>
                    {conversation.unread_count}
                  </ThemedText>
                </ThemedView>
              )}
            </Pressable>
          ))}

          <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  scrollView: { alignSelf: 'stretch' },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  pageTitle: { fontSize: 28, lineHeight: 34, marginBottom: Spacing.one },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
  rowInfo: { flex: 1, gap: 2, marginRight: Spacing.two },
  badge: { minWidth: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  badgeLabel: { color: '#050505' },
  error: { color: '#C9564A' },
});
