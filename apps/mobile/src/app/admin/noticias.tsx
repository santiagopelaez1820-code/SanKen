import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAdminStore } from '@/store/admin-store';

export default function AdminNoticiasScreen() {
  const theme = useTheme();
  const { news, isLoadingNews, loadNews, createNews, toggleNewsPublish, deleteNews } = useAdminStore();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const submit = async () => {
    await createNews(title, body);
    setTitle('');
    setBody('');
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
          <ThemedText type="title" style={styles.pageTitle}>
            Noticias
          </ThemedText>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="smallBold">Nueva noticia</ThemedText>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Título"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
            />
            <TextInput
              value={body}
              onChangeText={setBody}
              placeholder="Contenido"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
              multiline
            />
            <PrimaryButton label="Crear borrador" onPress={submit} disabled={!title.trim() || !body.trim()} />
          </ThemedView>

          {isLoadingNews && (
            <ThemedText type="small" themeColor="textSecondary">
              Cargando…
            </ThemedText>
          )}

          {news.map((item) => (
            <ThemedView key={item.id} type="backgroundElement" style={styles.card}>
              <ThemedText type="smallBold">{item.title}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {item.body}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {item.published ? 'Publicada' : 'Borrador'}
              </ThemedText>
              <View style={styles.actionsRow}>
                <PrimaryButton
                  label={item.published ? 'Despublicar' : 'Publicar'}
                  variant="ghost"
                  onPress={() => toggleNewsPublish(item.id, !item.published)}
                />
                <PrimaryButton label="Borrar" variant="ghost" onPress={() => deleteNews(item.id)} />
              </View>
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
  card: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.two },
  input: { borderWidth: 1, borderRadius: Spacing.two, paddingHorizontal: Spacing.two, paddingVertical: Spacing.two },
  actionsRow: { flexDirection: 'row', gap: Spacing.two },
});
