// Esta línea sirve para importar «Image» desde «expo-image».
import { Image } from 'expo-image';
// Esta línea sirve para importar «Pressable, StyleSheet, View» desde «react-native».
import { Pressable, StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «X» desde «lucide-react-native».
import { X } from 'lucide-react-native';
// Esta línea sirve para importar «formatCurrency» desde «@sanken/core».
import { formatCurrency } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «Stepper» desde «@/components/ui/stepper».
import { Stepper } from '@/components/ui/stepper';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar los tipos «CartItem» desde «@/store/cart-store».
import type { CartItem } from '@/store/cart-store';

// Esta línea sirve para declarar la interfaz «CartItemRowProps».
interface CartItemRowProps {
  // Esta línea sirve para declarar la propiedad «item» con el valor o tipo «CartItem».
  item: CartItem;
  // Esta línea sirve para declarar la propiedad «onIncrement» con el valor o tipo «() => void».
  onIncrement: () => void;
  // Esta línea sirve para declarar la propiedad «onDecrement» con el valor o tipo «() => void».
  onDecrement: () => void;
  // Esta línea sirve para declarar la propiedad «onRemove» con el valor o tipo «() => void».
  onRemove: () => void;
}

// Esta línea sirve para declarar la función «CartItemRow».
export function CartItemRow({ item, onIncrement, onDecrement, onRemove }: CartItemRowProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para extraer «mageUr» de «api.mediaUrl(item.product.image, 'produc».
  const imageUrl = api.mediaUrl(item.product.image, 'productThumb');
  // Esta línea sirve para extraer «ineSubtota» de «Number(item.product.price) * item.quanti».
  const lineSubtotal = Number(item.product.price) * item.quantity;

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView type="backgroundElement" style={styles.row}>
      {/* Esta línea sirve para abrir el componente «View». */}
      <View style={[styles.imageWrap, { backgroundColor: theme.backgroundSelected }]}>
        {/* Esta línea sirve para mostrar el elemento solo si «imageUrl». */}
        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" />}
      </View>

      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView style={styles.info}>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="smallBold" numberOfLines={2}>
          {/* Esta línea sirve para mostrar el valor «item.product.name». */}
          {item.product.name}
        </ThemedText>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="small" themeColor="textSecondary">
          {/* Esta línea sirve para mostrar el contenido dinámico «{formatCurrency(item.product.price)} c/u». */}
          {formatCurrency(item.product.price)} c/u
        </ThemedText>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="smallBold" themeColor="accent">
          {/* Esta línea sirve para mostrar el contenido dinámico «{formatCurrency(lineSubtotal)}». */}
          {formatCurrency(lineSubtotal)}
        </ThemedText>
      </ThemedView>

      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView style={styles.actions}>
        {/* Esta línea sirve para abrir el componente «Pressable». */}
        <Pressable onPress={onRemove} hitSlop={8}>
          {/* Esta línea sirve para abrir el componente «X». */}
          <X size={16} color={theme.textSecondary} />
        </Pressable>
        {/* Esta línea sirve para abrir el componente «View». */}
        <View style={styles.stepperWrap}>
          {/* Esta línea sirve para abrir el elemento «Stepper» con sus atributos en varias líneas. */}
          <Stepper
            // Esta línea sirve para pasar la propiedad «value» con el valor «item.quantity}».
            value={item.quantity}
            // Esta línea sirve para pasar la propiedad «min» con el valor «0}».
            min={0}
            // Esta línea sirve para pasar la propiedad «max» con el valor «50}».
            max={50}
            // Esta línea sirve para asignar el manejador del evento «onChange».
            onChange={(next) => (next > item.quantity ? onIncrement() : onDecrement())}
          />
        </View>
      </ThemedView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para definir el estilo «row» con «flexDirection: 'row', gap: Spacing.two + 4, border…».
  row: { flexDirection: 'row', gap: Spacing.two + 4, borderRadius: Spacing.three, padding: Spacing.two + 4, alignItems: 'center' },
  // Esta línea sirve para definir el estilo «imageWrap» con «width: 56, height: 56, borderRadius: Spacing.two, …».
  imageWrap: { width: 56, height: 56, borderRadius: Spacing.two, overflow: 'hidden' },
  // Esta línea sirve para declarar la propiedad «image» con el valor o tipo «{ width: '100%', height: '100%' }».
  image: { width: '100%', height: '100%' },
  // Esta línea sirve para definir el estilo «info» con «flex: 1, minWidth: 0, gap: 2, backgroundColor: 'tr…».
  info: { flex: 1, minWidth: 0, gap: 2, backgroundColor: 'transparent' },
  // Esta línea sirve para definir el estilo «actions» con «alignItems: 'flex-end', gap: Spacing.one, backgrou…».
  actions: { alignItems: 'flex-end', gap: Spacing.one, backgroundColor: 'transparent' },
  // Esta línea sirve para declarar la propiedad «stepperWrap» con el valor o tipo «{ width: 120 }».
  stepperWrap: { width: 120 },
});
