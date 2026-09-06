import { useEffect } from 'react';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package } from 'lucide-react-native';
import { formatCurrency } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { ORDER_STATUS_BADGE_VARIANT, ORDER_STATUS_LABELS } from '@/constants/order-status';
import { useOrdersStore } from '@/store/orders-store';

export default function PedidosScreen() {
  const { orders, isLoadingOrders, loadOrders } = useOrdersStore();

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="small" themeColor="textSecondary" onPress={() => router.back()}>
          ← Volver
        </ThemedText>
        <ThemedText type="title" style={styles.title}>
          Mis pedidos
        </ThemedText>

        {isLoadingOrders ? (
          <ThemedView style={styles.skeletonWrap}>
            <Skeleton height={84} borderRadius={Spacing.three} />
            <Skeleton height={84} borderRadius={Spacing.three} />
          </ThemedView>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Todavía no hiciste ningún pedido"
            description="Cuando compres algo en la tienda, lo vas a ver acá."
            action={{ label: 'Ir a la tienda', onPress: () => router.push('/store') }}
          />
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <Pressable onPress={() => router.push(`/pedidos/${item.id}`)}>
                <ThemedView type="backgroundElement" style={styles.row}>
                  <ThemedView style={styles.rowHeader}>
                    <ThemedText type="smallBold">Pedido #{String(item.id).padStart(6, '0')}</ThemedText>
                    <Badge label={ORDER_STATUS_LABELS[item.status]} variant={ORDER_STATUS_BADGE_VARIANT[item.status]} />
                  </ThemedView>
                  <ThemedText type="small" themeColor="textSecondary">
                    {new Date(item.created_at).toLocaleDateString()} · {item.items.length}{' '}
                    {item.items.length === 1 ? 'producto' : 'productos'}
                  </ThemedText>
                  <ThemedText type="smallBold" themeColor="accent">
                    {formatCurrency(item.total)}
                  </ThemedText>
                </ThemedView>
              </Pressable>
            )}
          />
        )}
      </SafeAreaView>
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
    gap: Spacing.three,
  },
  title: { fontSize: 26, lineHeight: 32 },
  skeletonWrap: { gap: Spacing.two },
  list: { gap: Spacing.two, paddingBottom: BottomTabInset + Spacing.four },
  row: { borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.half },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
