import { useEffect } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NewChatMessageNotificationData } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useNotificationsStore } from '@/store/notifications-store';

export default function NotificacionesScreen() {
  const theme = useTheme();
  const { notifications, unreadCount, isLoading, load, markRead, markAllRead } = useNotificationsStore();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedView style={styles.header}>
            <ThemedText type="title" style={styles.pageTitle}>
              Notificaciones
            </ThemedText>
            {unreadCount > 0 && (
              <ThemedText type="small" style={{ color: theme.accent }} onPress={() => markAllRead()}>
                Marcar todas leídas
              </ThemedText>
            )}
          </ThemedView>

          {isLoading && (
            <ThemedText type="small" themeColor="textSecondary">
              Cargando…
            </ThemedText>
          )}
          {!isLoading && notifications.length === 0 && (
            <ThemedText type="small" themeColor="textSecondary">
              No tenés notificaciones.
            </ThemedText>
          )}

          {notifications.map((notification) => {
            const data = notification.data as unknown as NewChatMessageNotificationData;
            return (
              <Pressable
                key={notification.id}
                onPress={() => {
                  markRead(notification.id);
                  if (data.conversation_id) router.push(`/chat/${data.conversation_id}`);
                }}
                style={[
                  styles.row,
                  { borderColor: theme.backgroundSelected },
                  !notification.read_at && { backgroundColor: theme.backgroundSelected },
                ]}
              >
                <ThemedText type="smallBold">{data.sender_name}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                  {data.body}
                </ThemedText>
              </Pressable>
            );
          })}

          <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pageTitle: { fontSize: 28, lineHeight: 34 },
  row: { borderWidth: 1, borderRadius: Spacing.three, padding: Spacing.three, gap: 2 },
});
