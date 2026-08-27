import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';

interface Option {
  id: number;
  name: string;
}

interface OptionPickerModalProps {
  visible: boolean;
  title: string;
  options: Option[];
  onSelect: (option: Option | null) => void;
  onClose: () => void;
}

/** Selector genérico {id,name} con búsqueda — mismo shell que ExercisePickerModal, reutilizado para país/ciudad en los filtros de Super Admin. */
export function OptionPickerModal({ visible, title, options, onSelect, onClose }: OptionPickerModalProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.name.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ThemedView style={styles.root}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedView style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              {title}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" onPress={onClose}>
              Cerrar
            </ThemedText>
          </ThemedView>

          <TextField label="Buscar" value={query} onChangeText={setQuery} autoCapitalize="none" />

          <Pressable onPress={() => onSelect(null)} style={styles.pressableRow}>
            <ThemedView type="backgroundElement" style={styles.row}>
              <ThemedText type="default">Todos</ThemedText>
            </ThemedView>
          </Pressable>

          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <Pressable onPress={() => onSelect(item)} style={styles.pressableRow}>
                <ThemedView type="backgroundElement" style={styles.row}>
                  <ThemedText type="default">{item.name}</ThemedText>
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
  // El radio visual vive en `row` (aplicado al ThemedView de adentro), pero
  // en web el foco de teclado lo recibe el `Pressable` — sin este mismo
  // radio ACÁ, el navegador dibuja su anillo de foco como un rectángulo
  // recto que no sigue las esquinas redondeadas del ítem (mismo bug que en
  // primary-button.tsx).
  pressableRow: {
    borderRadius: Spacing.three,
  },
});
