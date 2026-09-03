import { useEffect } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { FeedItem, NewChatMessageNotificationData } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useFeedStore } from '@/store/feed-store';
import { Skeleton } from '@/components/ui/skeleton';

function FeedRow({ item, onPress }: { item: FeedItem; onPress: (item: FeedItem) => void }) {
  const theme = useTheme();
  const unreadStyle = !item.read_at ? { backgroundColor: theme.backgroundSelected } : undefined;

  if (item.feed_type === 'news') {
    return (
      <Pressable onPress={() => onPress(item)} style={styles.pressableCard}>
        <ThemedView type="backgroundElement" style={[styles.card, unreadStyle]}>
          <ThemedText type="smallBold">{item.title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {new Date(item.created_at).toLocaleDateString('es-AR')}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {item.body}
          </ThemedText>
        </ThemedView>
      </Pressable>
    );
  }

  const data = item.data as unknown as NewChatMessageNotificationData;
  return (
    <Pressable onPress={() => onPress(item)} style={styles.pressableCard}>
      <ThemedView type="backgroundElement" style={[styles.card, unreadStyle]}>
        <ThemedText type="small" themeColor="textSecondary">
          {new Date(item.created_at).toLocaleDateString('es-AR')}
        </ThemedText>
        <ThemedText type="smallBold">{data.sender_name}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
          {data.body}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export default function NovedadesScreen() {
  const theme = useTheme();
  const { items, unreadCount, isLoading, error, load, markRead, markAllRead } = useFeedStore();

  useEffect(() => {
    load();
  }, [load]);

  const handlePress = (item: FeedItem) => {
    markRead(item);
    if (item.feed_type === 'notification') {
      const data = item.data as unknown as NewChatMessageNotificationData;
      if (data.conversation_id) router.push(`/chat/${data.conversation_id}`);
    }
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
          <ThemedView style={styles.header}>
            <ThemedText type="title" style={styles.pageTitle}>
              Novedades
            </ThemedText>
            {unreadCount > 0 && (
              <ThemedText type="small" style={{ color: theme.accent }} onPress={() => markAllRead()}>
                Marcar todo leído
              </ThemedText>
            )}
          </ThemedView>

          {isLoading && (
            <Skeleton height={72} borderRadius={Spacing.three} />
          )}

          {!isLoading && error && (
            <ThemedView style={styles.errorBlock}>
              <ThemedText type="small" style={styles.error}>
                {error}
              </ThemedText>
              <PrimaryButton label="Reintentar" variant="ghost" onPress={() => load()} />
            </ThemedView>
          )}

          {!isLoading && !error && items.length === 0 && (
            <ThemedText type="small" themeColor="textSecondary">
              No hay novedades ni notificaciones por ahora.
            </ThemedText>
          )}

          {items.map((item) => (
            <FeedRow key={`${item.feed_type}-${item.id}`} item={item} onPress={handlePress} />
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pageTitle: { fontSize: 28, lineHeight: 34 },
  card: { borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.one },
  // Mismo radio que `card` en el Pressable que lo envuelve — sin esto, el
  // anillo de foco de teclado en web se dibuja como un rectángulo recto
  // que no sigue las esquinas redondeadas de la tarjeta (mismo bug que en
  // primary-button.tsx).
  pressableCard: { borderRadius: Spacing.three },
  errorBlock: { gap: Spacing.two, alignItems: 'flex-start', backgroundColor: 'transparent' },
  error: { color: '#FF4D5E' },
});
