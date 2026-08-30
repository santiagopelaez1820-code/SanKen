import { useState } from 'react';
import { router } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingCart } from 'lucide-react-native';
import { formatCurrency } from '@sanken/core';

import { CartItemRow } from '@/components/store/cart-item-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { PrimaryButton } from '@/components/ui/primary-button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useCartStore } from '@/store/cart-store';

export default function CartScreen() {
  const items = useCartStore((s) => s.items);
  const incrementItem = useCartStore((s) => s.incrementItem);
  const decrementItem = useCartStore((s) => s.decrementItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const [confirmingClear, setConfirmingClear] = useState(false);

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="small" themeColor="textSecondary" onPress={() => router.back()}>
          ← Tienda
        </ThemedText>
        <ThemedText type="title" style={styles.title}>
          Carrito
        </ThemedText>

        {items.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="Tu carrito está vacío"
            description="Agregá productos desde la tienda para verlos acá."
            action={{ label: 'Ir a la tienda', onPress: () => router.replace('/store') }}
          />
        ) : (
          <>
            <FlatList
              data={items}
              keyExtractor={(item) => String(item.product.id)}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <CartItemRow
                  item={item}
                  onIncrement={() => incrementItem(item.product.id)}
                  onDecrement={() => decrementItem(item.product.id)}
                  onRemove={() => removeItem(item.product.id)}
                />
              )}
            />

            <ThemedView type="backgroundElement" style={styles.summary}>
              <ThemedView style={styles.summaryRow}>
                <ThemedText type="smallBold">Subtotal</ThemedText>
                <ThemedText type="smallBold" themeColor="accent">
                  {formatCurrency(subtotal)}
                </ThemedText>
              </ThemedView>
              <PrimaryButton label="Continuar compra" onPress={() => router.push('/store/checkout')} />
              <PrimaryButton label="Vaciar carrito" variant="ghost" onPress={() => setConfirmingClear(true)} />
            </ThemedView>
          </>
        )}
      </SafeAreaView>

      <ConfirmDialog
        visible={confirmingClear}
        title="¿Vaciar el carrito?"
        description="Se van a quitar todos los productos agregados."
        confirmLabel="Sí, vaciar"
        onConfirm={() => {
          clear();
          setConfirmingClear(false);
        }}
        onCancel={() => setConfirmingClear(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center' },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset,
    gap: Spacing.two,
  },
  title: { fontSize: 26, lineHeight: 32 },
  list: { gap: Spacing.two, paddingBottom: Spacing.three },
  summary: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.two },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
