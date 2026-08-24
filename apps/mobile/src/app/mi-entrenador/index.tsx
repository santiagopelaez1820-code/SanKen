import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useChatStore } from '@/store/chat-store';
import { useMyTrainerStore } from '@/store/my-trainer-store';
import { Skeleton } from '@/components/ui/skeleton';

export default function MiEntrenadorScreen() {
  const { trainers, isLoading, error, load } = useMyTrainerStore();
  const { openConversationForTrainerClient } = useChatStore();
  const [openingId, setOpeningId] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, [load]);

  const openChat = async (trainerClientId: number) => {
    setOpeningId(trainerClientId);
    try {
      const conversationId = await openConversationForTrainerClient(trainerClientId);
      router.push(`/chat/${conversationId}`);
    } finally {
      setOpeningId(null);
    }
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <ThemedText type="title" style={styles.pageTitle}>
            Mi entrenador
          </ThemedText>

          {isLoading && (
            <Skeleton height={56} borderRadius={Spacing.three} />
          )}
          {error && (
            <ThemedText type="small" style={styles.error}>
              {error}
            </ThemedText>
          )}
          {!isLoading && trainers.length === 0 && (
            <ThemedText type="small" themeColor="textSecondary">
              Todavía no tenés un entrenador asignado.
            </ThemedText>
          )}

          {trainers.map((relationship) => (
            <ThemedView key={relationship.trainer_client_id} type="backgroundElement" style={styles.card}>
              <ThemedView style={styles.cardInfo}>
                <ThemedText type="smallBold">
                  {relationship.trainer.name}
                  {relationship.trainer.trainer_verified_at && (
                    <ThemedText type="small" themeColor="accent">
                      {' '}
                      ✓
                    </ThemedText>
                  )}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {relationship.trainer.email}
                </ThemedText>
              </ThemedView>
              <PrimaryButton
                label="Chatear"
                loading={openingId === relationship.trainer_client_id}
                onPress={() => openChat(relationship.trainer_client_id)}
              />
            </ThemedView>
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
    gap: Spacing.three,
  },
  pageTitle: { fontSize: 28, lineHeight: 34 },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  cardInfo: { flex: 1, gap: 2 },
  error: { color: '#FF4D5E' },
});
