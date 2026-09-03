import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';

interface ListPickerModalProps<T> {
  visible: boolean;
  title: string;
  items: T[];
  getId: (item: T) => string | number;
  getLabel: (item: T) => string;
  getSubtitle?: (item: T) => string | undefined;
  onSelect: (item: T) => void;
  onClose: () => void;
  searchPlaceholder?: string;
  /** Si se pasa, agrega una fila "Todos" arriba de la lista que llama a esto en vez de onSelect — para filtros con opción "sin elegir" (ver admin/usuarios.tsx). */
  onSelectAll?: () => void;
}

/**
 * Modal de selección con búsqueda genérico — antes existían dos copias casi
 * idénticas de esto (OptionPickerModal para país/ciudad, ExercisePickerModal
 * para ejercicios), diferenciadas solo por la forma del ítem y si mostraban
 * subtítulo/opción "Todos". Se unificaron acá.
 */
export function ListPickerModal<T>({
  visible,
  title,
  items,
  getId,
  getLabel,
  getSubtitle,
  onSelect,
  onClose,
  searchPlaceholder,
  onSelectAll,
}: ListPickerModalProps<T>) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => getLabel(item).toLowerCase().includes(q));
  }, [items, query, getLabel]);

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

          <TextField
            label="Buscar"
            value={query}
            onChangeText={setQuery}
            placeholder={searchPlaceholder}
            autoCapitalize="none"
          />

          {onSelectAll && (
            <Pressable onPress={onSelectAll} style={styles.pressableRow}>
              <ThemedView type="backgroundElement" style={styles.row}>
                <ThemedText type="default">Todos</ThemedText>
              </ThemedView>
            </Pressable>
          )}

          <FlatList
            data={filtered}
            keyExtractor={(item) => String(getId(item))}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const subtitle = getSubtitle?.(item);
              return (
                <Pressable onPress={() => onSelect(item)} style={styles.pressableRow}>
                  <ThemedView type="backgroundElement" style={styles.row}>
                    <ThemedText type="default">{getLabel(item)}</ThemedText>
                    {subtitle && (
                      <ThemedText type="small" themeColor="textSecondary">
                        {subtitle}
                      </ThemedText>
                    )}
                  </ThemedView>
                </Pressable>
              );
            }}
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
