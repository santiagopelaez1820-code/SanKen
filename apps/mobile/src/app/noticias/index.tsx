import { useEffect } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useNewsStore } from '@/store/news-store';

export default function NoticiasScreen() {
  const { news, isLoading, load } = useNewsStore();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
          <ThemedText type="title" style={styles.pageTitle}>
            Novedades
          </ThemedText>

          {isLoading && (
            <ThemedText type="small" themeColor="textSecondary">
              Cargando…
            </ThemedText>
          )}
          {!isLoading && news.length === 0 && (
            <ThemedText type="small" themeColor="textSecondary">
              No hay novedades por ahora.
            </ThemedText>
          )}

          {news.map((item) => (
            <ThemedView key={item.id} type="backgroundElement" style={styles.card}>
              <ThemedText type="smallBold">{item.title}</ThemedText>
              {item.published_at && (
                <ThemedText type="small" themeColor="textSecondary">
                  {new Date(item.published_at).toLocaleDateString('es-AR')}
                </ThemedText>
              )}
              <ThemedText type="small" themeColor="textSecondary">
                {item.body}
              </ThemedText>
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
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  pageTitle: { fontSize: 28, lineHeight: 34 },
  card: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.one },
});
