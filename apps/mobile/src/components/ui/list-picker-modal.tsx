// Esta línea sirve para importar «useMemo, useState» desde «react».
import { useMemo, useState } from 'react';
// Esta línea sirve para importar «FlatList, Modal, Pressable, StyleSheet» desde «react-native».
import { FlatList, Modal, Pressable, StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «TextField» desde «@/components/ui/text-field».
import { TextField } from '@/components/ui/text-field';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';

// Esta línea sirve para declarar las propiedades del selector de lista genérico.
interface ListPickerModalProps<T> {
  // Esta línea sirve para declarar la propiedad «visible» con el valor o tipo «boolean».
  visible: boolean;
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «string».
  title: string;
  // Esta línea sirve para declarar la propiedad «items» con el valor o tipo «T[]».
  items: T[];
  // Esta línea sirve para declarar la propiedad «getId» con el valor o tipo «(item: T) => string | number».
  getId: (item: T) => string | number;
  // Esta línea sirve para declarar la propiedad «getLabel» con el valor o tipo «(item: T) => string».
  getLabel: (item: T) => string;
  // Esta línea sirve para declarar la propiedad «getSubtitle» con el valor o tipo «(item: T) => string | undefined».
  getSubtitle?: (item: T) => string | undefined;
  // Esta línea sirve para declarar la propiedad «onSelect» con el valor o tipo «(item: T) => void».
  onSelect: (item: T) => void;
  // Esta línea sirve para declarar la propiedad «onClose» con el valor o tipo «() => void».
  onClose: () => void;
  // Esta línea sirve para declarar la propiedad «searchPlaceholder» con el valor o tipo «string».
  searchPlaceholder?: string;
  /** Si se pasa, agrega una fila "Todos" arriba de la lista que llama a esto en vez de onSelect — para filtros con opción "sin elegir" (ver admin/usuarios.tsx). */
  // Esta línea sirve para declarar la propiedad «onSelectAll» con el valor o tipo «() => void».
  onSelectAll?: () => void;
}

/**
 * Modal de selección con búsqueda genérico — antes existían dos copias casi
 * idénticas de esto (OptionPickerModal para país/ciudad, ExercisePickerModal
 * para ejercicios), diferenciadas solo por la forma del ítem y si mostraban
 * subtítulo/opción "Todos". Se unificaron acá.
 */
// Esta línea sirve para declarar la función «ListPickerModal».
export function ListPickerModal<T>({
  // Esta línea sirve para incluir el valor «visible» en la lista.
  visible,
  // Esta línea sirve para incluir el valor «title» en la lista.
  title,
  // Esta línea sirve para incluir el valor «items» en la lista.
  items,
  // Esta línea sirve para incluir el valor «getId» en la lista.
  getId,
  // Esta línea sirve para incluir el valor «getLabel» en la lista.
  getLabel,
  // Esta línea sirve para incluir el valor «getSubtitle» en la lista.
  getSubtitle,
  // Esta línea sirve para incluir el valor «onSelect» en la lista.
  onSelect,
  // Esta línea sirve para incluir el valor «onClose» en la lista.
  onClose,
  // Esta línea sirve para incluir el valor «searchPlaceholder» en la lista.
  searchPlaceholder,
  // Esta línea sirve para incluir el valor «onSelectAll» en la lista.
  onSelectAll,
// Esta línea sirve para cerrar los parámetros y declarar sus tipos.
}: ListPickerModalProps<T>) {
  // Esta línea sirve para crear el estado «query» y su función «setQuery».
  const [query, setQuery] = useState('');

  // Esta línea sirve para obtener «filtered» con el hook «useMemo».
  const filtered = useMemo(() => {
    // Esta línea sirve para declarar «q» con el valor «query.trim().toLowerCase()».
    const q = query.trim().toLowerCase();
    // Esta línea sirve para devolver «items» si «!q».
    if (!q) return items;
    // Esta línea sirve para filtrar los elementos cuya etiqueta contiene el texto buscado.
    return items.filter((item) => getLabel(item).toLowerCase().includes(q));
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «items, query, getLabel».
  }, [items, query, getLabel]);

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Modal».
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView style={styles.root}>
        {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
        <SafeAreaView style={styles.safeArea}>
          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={styles.header}>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="title" style={styles.title}>
              {/* Esta línea sirve para mostrar el valor «title». */}
              {title}
            </ThemedText>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary" onPress={onClose}>
              {/* Esta línea sirve para mostrar el texto «Cerrar». */}
              Cerrar
            </ThemedText>
          </ThemedView>

          {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
          <TextField
            // Esta línea sirve para definir el atributo «label» con el valor «Buscar».
            label="Buscar"
            // Esta línea sirve para pasar la propiedad «value» con el valor «query}».
            value={query}
            // Esta línea sirve para asignar el manejador del evento «onChangeText».
            onChangeText={setQuery}
            // Esta línea sirve para pasar la propiedad «placeholder» con el valor «searchPlaceholder}».
            placeholder={searchPlaceholder}
            // Esta línea sirve para definir el atributo «autoCapitalize» con el valor «none».
            autoCapitalize="none"
          />

          {/* Esta línea sirve para mostrar el bloque solo si «onSelectAll». */}
          {onSelectAll && (
            // Esta línea sirve para abrir el componente «Pressable».
            <Pressable onPress={onSelectAll} style={styles.pressableRow}>
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView type="backgroundElement" style={styles.row}>
                {/* Esta línea sirve para mostrar el texto «Todos» dentro de «ThemedText». */}
                <ThemedText type="default">Todos</ThemedText>
              </ThemedView>
            </Pressable>
          )}

          {/* Esta línea sirve para abrir el elemento «FlatList» con sus atributos en varias líneas. */}
          <FlatList
            // Esta línea sirve para pasar la propiedad «data» con el valor «filtered}».
            data={filtered}
            // Esta línea sirve para pasar la propiedad «keyExtractor» con el valor «(item) => String(getId(item))}».
            keyExtractor={(item) => String(getId(item))}
            // Esta línea sirve para pasar la propiedad «contentContainerStyle» con el valor «styles.list}».
            contentContainerStyle={styles.list}
            // Esta línea sirve para pasar la propiedad «renderItem» con el valor «({ item }) => {».
            renderItem={({ item }) => {
              // Esta línea sirve para extraer «ubtitl» de «getSubtitle?.(item)».
              const subtitle = getSubtitle?.(item);
              // Esta línea sirve para devolver la interfaz del componente.
              return (
                // Esta línea sirve para abrir el componente «Pressable» con sus propiedades.
                <Pressable onPress={() => onSelect(item)} style={styles.pressableRow}>
                  {/* Esta línea sirve para abrir el componente «ThemedView». */}
                  <ThemedView type="backgroundElement" style={styles.row}>
                    {/* Esta línea sirve para mostrar el valor «getLabel(item)» dentro de «ThemedText». */}
                    <ThemedText type="default">{getLabel(item)}</ThemedText>
                    {/* Esta línea sirve para mostrar el bloque solo si «subtitle». */}
                    {subtitle && (
                      // Esta línea sirve para abrir el componente «ThemedText».
                      <ThemedText type="small" themeColor="textSecondary">
                        {/* Esta línea sirve para mostrar el valor «subtitle». */}
                        {subtitle}
                      </ThemedText>
                    )}
                  </ThemedView>
                </Pressable>
              );
            }}
            // Esta línea sirve para pasar la propiedad «ListEmptyComponent» con el valor «».
            ListEmptyComponent={
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el texto «Sin resultados.». */}
                Sin resultados.
              </ThemedText>
            }
          />
        </SafeAreaView>
      </ThemedView>
    </Modal>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «root» con el valor o tipo «{ flex: 1 }».
  root: { flex: 1 },
  // Esta línea sirve para definir el estilo «safeArea» con «flex: 1, paddingHorizontal: Spacing.four, paddingT…».
  safeArea: { flex: 1, paddingHorizontal: Spacing.four, paddingTop: Spacing.three, gap: Spacing.three },
  // Esta línea sirve para definir el estilo «header» con «flexDirection: 'row', justifyContent: 'space-betwe…».
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «{ fontSize: 22, lineHeight: 28 }».
  title: { fontSize: 22, lineHeight: 28 },
  // Esta línea sirve para definir el estilo «list» con «gap: Spacing.two, paddingBottom: Spacing.four },…».
  list: { gap: Spacing.two, paddingBottom: Spacing.four },
  // Esta línea sirve para declarar la propiedad «row» con el valor o tipo «{».
  row: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.three».
    paddingHorizontal: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.three».
    paddingVertical: Spacing.three,
  },
  // El radio visual vive en `row` (aplicado al ThemedView de adentro), pero
  // en web el foco de teclado lo recibe el `Pressable` — sin este mismo
  // radio ACÁ, el navegador dibuja su anillo de foco como un rectángulo
  // recto que no sigue las esquinas redondeadas del ítem (mismo bug que en
  // primary-button.tsx).
  // Esta línea sirve para declarar la propiedad «pressableRow» con el valor o tipo «{».
  pressableRow: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
  },
});
