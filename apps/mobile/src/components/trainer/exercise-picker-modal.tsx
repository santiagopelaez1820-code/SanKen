import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ExerciseCatalogItem } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';

interface ExercisePickerModalProps {
  visible: boolean;
  exercises: ExerciseCatalogItem[];
  onSelect: (exercise: ExerciseCatalogItem) => void;
  onClose: () => void;
}

export function ExercisePickerModal({ visible, exercises, onSelect, onClose }: ExercisePickerModalProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return exercises;
    return exercises.filter((e) => e.name.toLowerCase().includes(q));
  }, [exercises, query]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ThemedView style={styles.root}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedView style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Elegir ejercicio
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" onPress={onClose}>
              Cerrar
            </ThemedText>
          </ThemedView>

          <TextField
            label="Buscar"
            value={query}
            onChangeText={setQuery}
            placeholder="Nombre del ejercicio…"
            autoCapitalize="none"
          />

          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <Pressable onPress={() => onSelect(item)} style={styles.pressableRow}>
                <ThemedView type="backgroundElement" style={styles.row}>
                  <ThemedText type="default">{item.name}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {item.primary_muscle.name} · {item.equipment}
                  </ThemedText>
                </ThemedView>
              </Pressable>
            )}
            ListEmptyComponent={
              <ThemedText type="small" themeColor="textSecondary">
                Sin resultados.
              </ThemedText>
            }
          />
        </SafeAreaView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four, paddingTop: Spacing.three, gap: Spacing.three },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, lineHeight: 28 },
  list: { gap: Spacing.two, paddingBottom: Spacing.four },
  row: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  // Mismo radio que `row` (ver el comentario equivalente en
  // option-picker-modal.tsx) para que el anillo de foco en web siga las
  // esquinas redondeadas en vez de dibujar un rectángulo recto.
  pressableRow: {
    borderRadius: Spacing.three,
  },
});
