// Esta línea sirve para importar «useState» desde «react».
import { useState } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «FlatList, StyleSheet» desde «react-native».
import { FlatList, StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «ShoppingCart» desde «lucide-react-native».
import { ShoppingCart } from 'lucide-react-native';
// Esta línea sirve para importar «formatCurrency» desde «@sanken/core».
import { formatCurrency } from '@sanken/core';

// Esta línea sirve para importar «CartItemRow» desde «@/components/store/cart-item-row».
import { CartItemRow } from '@/components/store/cart-item-row';
// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «BackButton» desde «@/components/ui/back-button».
import { BackButton } from '@/components/ui/back-button';
// Esta línea sirve para importar «ConfirmDialog» desde «@/components/ui/confirm-dialog».
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
// Esta línea sirve para importar «EmptyState» desde «@/components/ui/empty-state».
import { EmptyState } from '@/components/ui/empty-state';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useCartStore» desde «@/store/cart-store».
import { useCartStore } from '@/store/cart-store';

// Esta línea sirve para declarar la función «CartScreen».
export default function CartScreen() {
  // Esta línea sirve para obtener «items» con el hook «useCartStore».
  const items = useCartStore((s) => s.items);
  // Esta línea sirve para obtener «incrementItem» con el hook «useCartStore».
  const incrementItem = useCartStore((s) => s.incrementItem);
  // Esta línea sirve para obtener «decrementItem» con el hook «useCartStore».
  const decrementItem = useCartStore((s) => s.decrementItem);
  // Esta línea sirve para obtener «removeItem» con el hook «useCartStore».
  const removeItem = useCartStore((s) => s.removeItem);
  // Esta línea sirve para obtener «clear» con el hook «useCartStore».
  const clear = useCartStore((s) => s.clear);
  // Esta línea sirve para obtener «subtotal» con el hook «useCartStore».
  const subtotal = useCartStore((s) => s.getSubtotal());
  // Esta línea sirve para crear el estado «confirmingClear» y su función «setConfirmingClear».
  const [confirmingClear, setConfirmingClear] = useState(false);

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «BackButton». */}
        <BackButton label="Tienda" fallbackHref="/store" />
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="title" style={styles.title}>
          {/* Esta línea sirve para mostrar el texto «Carrito». */}
          Carrito
        </ThemedText>

        {/* Esta línea sirve para elegir entre dos bloques según «items.length === 0». */}
        {items.length === 0 ? (
          // Esta línea sirve para abrir el elemento «EmptyState» con sus atributos en varias líneas.
          <EmptyState
            // Esta línea sirve para pasar la propiedad «icon» con el valor «ShoppingCart}».
            icon={ShoppingCart}
            // Esta línea sirve para definir el atributo «title» con el valor «Tu carrito está vacío».
            title="Tu carrito está vacío"
            // Esta línea sirve para definir el atributo «description».
            description="Agregá productos desde la tienda para verlos acá."
            // Esta línea sirve para pasar la propiedad «action» con el valor «{ label: 'Ir a la tienda', onPress: () => rou».
            action={{ label: 'Ir a la tienda', onPress: () => router.replace('/store') }}
          />
        // Esta línea sirve para mostrar el bloque alternativo.
        ) : (
          // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
          <>
            {/* Esta línea sirve para abrir el elemento «FlatList» con sus atributos en varias líneas. */}
            <FlatList
              // Esta línea sirve para pasar la propiedad «style» con el valor «styles.list}».
              style={styles.list}
              // Esta línea sirve para pasar la propiedad «data» con el valor «items}».
              data={items}
              // Esta línea sirve para pasar la propiedad «keyExtractor» con el valor «(item) => String(item.product.id)}».
              keyExtractor={(item) => String(item.product.id)}
              // Esta línea sirve para pasar la propiedad «contentContainerStyle» con el valor «styles.listContent}».
              contentContainerStyle={styles.listContent}
              // Esta línea sirve para pasar la propiedad «renderItem» con el valor «({ item }) => (».
              renderItem={({ item }) => (
                // Esta línea sirve para abrir el elemento «CartItemRow» con sus atributos en varias líneas.
                <CartItemRow
                  // Esta línea sirve para pasar la propiedad «item» con el valor «item}».
                  item={item}
                  // Esta línea sirve para asignar el manejador del evento «onIncrement».
                  onIncrement={() => incrementItem(item.product.id)}
                  // Esta línea sirve para asignar el manejador del evento «onDecrement».
                  onDecrement={() => decrementItem(item.product.id)}
                  // Esta línea sirve para asignar el manejador del evento «onRemove».
                  onRemove={() => removeItem(item.product.id)}
                />
              )}
            />

            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView type="backgroundElement" style={styles.summary}>
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView style={styles.summaryRow}>
                {/* Esta línea sirve para mostrar el texto «Subtotal (COP)» dentro de «ThemedText». */}
                <ThemedText type="smallBold">Subtotal (COP)</ThemedText>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="smallBold" themeColor="accent">
                  {/* Esta línea sirve para mostrar el contenido dinámico «{formatCurrency(subtotal)}». */}
                  {formatCurrency(subtotal)}
                </ThemedText>
              </ThemedView>
              {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
              <PrimaryButton label="Continuar compra" onPress={() => router.push('/store/checkout')} />
              {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
              <PrimaryButton label="Vaciar carrito" variant="ghost" onPress={() => setConfirmingClear(true)} />
            </ThemedView>
          </>
        )}
      </SafeAreaView>

      {/* Esta línea sirve para abrir el elemento «ConfirmDialog» con sus atributos en varias líneas. */}
      <ConfirmDialog
        // Esta línea sirve para pasar la propiedad «visible» con el valor «confirmingClear}».
        visible={confirmingClear}
        // Esta línea sirve para definir el atributo «title» con el valor «¿Vaciar el carrito?».
        title="¿Vaciar el carrito?"
        // Esta línea sirve para definir el atributo «description».
        description="Se van a quitar todos los productos agregados."
        // Esta línea sirve para definir el atributo «confirmLabel» con el valor «Sí, vaciar».
        confirmLabel="Sí, vaciar"
        // Esta línea sirve para asignar el manejador del evento «onConfirm».
        onConfirm={() => {
          // Esta línea sirve para llamar a «clear».
          clear();
          // Esta línea sirve para guardar en el estado con «setConfirmingClear» el valor «false)…».
          setConfirmingClear(false);
        }}
        // Esta línea sirve para asignar el manejador del evento «onCancel».
        onCancel={() => setConfirmingClear(false)}
      />
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «root» con el valor o tipo «{ flex: 1, alignItems: 'center' }».
  root: { flex: 1, alignItems: 'center' },
  // Esta línea sirve para declarar la propiedad «safeArea» con el valor o tipo «{».
  safeArea: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «MaxContentWidth».
    maxWidth: MaxContentWidth,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.four».
    paddingHorizontal: Spacing.four,
    // Esta línea sirve para declarar la propiedad «paddingTop» con el valor o tipo «Spacing.two».
    paddingTop: Spacing.two,
    // Esta línea sirve para declarar la propiedad «paddingBottom» con el valor o tipo «BottomTabInset».
    paddingBottom: BottomTabInset,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «{ fontSize: 24, lineHeight: 30 }».
  title: { fontSize: 24, lineHeight: 30 },
  // El FlatList necesita flex:1 explícito para acotarse dentro de la
  // columna y hacer scroll interno — sin esto trataba de crecer para
  // mostrar todos los items sin límite, empujando el resumen (subtotal +
  // botones) fuera de la pantalla en vez de dejarlo siempre a la vista.
  // Esta línea sirve para declarar la propiedad «list» con el valor o tipo «{ flex: 1 }».
  list: { flex: 1 },
  // Esta línea sirve para definir el estilo «listContent» con «gap: Spacing.two, paddingBottom: Spacing.three },…».
  listContent: { gap: Spacing.two, paddingBottom: Spacing.three },
  // Esta línea sirve para definir el estilo «summary» con «borderRadius: Spacing.four, padding: Spacing.three…».
  summary: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.two },
  // Esta línea sirve para declarar la propiedad «summaryRow» con el valor o tipo «{».
  summaryRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
});
