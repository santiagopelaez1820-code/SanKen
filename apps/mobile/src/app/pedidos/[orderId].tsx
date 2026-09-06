import { useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Linking, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle } from 'lucide-react-native';
import { formatCurrency } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge } from '@/components/ui/badge';
import { ErrorState } from '@/components/ui/error-state';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderTimeline } from '@/components/store/order-timeline';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ORDER_STATUS_BADGE_VARIANT, ORDER_STATUS_LABELS } from '@/constants/order-status';
import { useOrdersStore } from '@/store/orders-store';

export default function PedidoDetailScreen() {
  const theme = useTheme();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const id = Number(orderId);
  const { currentOrder, isLoadingOrder, orderError, loadOrder } = useOrdersStore();

  useEffect(() => {
    if (id) loadOrder(id);
  }, [id, loadOrder]);

  if (orderError) {
    return (
      <ThemedView style={styles.root}>
        <SafeAreaView style={styles.safeArea}>
          <ErrorState message={orderError} onRetry={() => loadOrder(id)} />
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (isLoadingOrder || !currentOrder) {
    return (
      <ThemedView style={styles.root}>
        <SafeAreaView style={styles.safeArea}>
          <Skeleton height={300} borderRadius={Spacing.three} />
        </SafeAreaView>
      </ThemedView>
    );
  }

  const order = currentOrder;

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="small" themeColor="textSecondary" onPress={() => router.back()}>
          ← Mis pedidos
        </ThemedText>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.headerRow}>
            <ThemedText type="title" style={styles.title}>
              Pedido #{String(order.id).padStart(6, '0')}
            </ThemedText>
            <Badge label={ORDER_STATUS_LABELS[order.status]} variant={ORDER_STATUS_BADGE_VARIANT[order.status]} />
          </ThemedView>
          <ThemedText type="small" themeColor="textSecondary">
            {new Date(order.created_at).toLocaleString()}
          </ThemedText>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="smallBold">Seguimiento</ThemedText>
            <OrderTimeline status={order.status} />
          </ThemedView>

          {(order.tracking_number || order.carrier) && (
            <ThemedView type="backgroundElement" style={styles.card}>
              <ThemedText type="smallBold">Envío</ThemedText>
              {order.carrier && (
                <ThemedView style={styles.itemRow}>
                  <ThemedText type="small" themeColor="textSecondary">
                    Transportadora
                  </ThemedText>
                  <ThemedText type="small">{order.carrier}</ThemedText>
                </ThemedView>
              )}
              {order.tracking_number && (
                <ThemedView style={styles.itemRow}>
                  <ThemedText type="small" themeColor="textSecondary">
                    Número de guía
                  </ThemedText>
                  <ThemedText type="small">{order.tracking_number}</ThemedText>
                </ThemedView>
              )}
            </ThemedView>
          )}

          {order.customer_message && (
            <ThemedView type="backgroundElement" style={styles.card}>
              <ThemedText type="smallBold">Mensaje de SanKen</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {order.customer_message}
              </ThemedText>
            </ThemedView>
          )}

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="smallBold">Entrega</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {order.address}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {order.city}, {order.department}
            </ThemedText>
            {order.additional_info && (
              <ThemedText type="small" themeColor="textSecondary">
                {order.additional_info}
              </ThemedText>
            )}
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="smallBold">Productos</ThemedText>
            {order.items.map((item) => (
              <ThemedView key={item.id} style={styles.itemRow}>
                <ThemedText type="small" style={styles.itemName} numberOfLines={1}>
                  {item.quantity}× {item.product_name}
                </ThemedText>
                <ThemedText type="small">{formatCurrency(item.subtotal)}</ThemedText>
              </ThemedView>
            ))}
            <ThemedView style={[styles.divider, { backgroundColor: theme.border }]} />
            <ThemedView style={styles.itemRow}>
              <ThemedText type="small" themeColor="textSecondary">
                Subtotal (COP)
              </ThemedText>
              <ThemedText type="small">{formatCurrency(order.subtotal)}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.itemRow}>
              <ThemedText type="small" themeColor="textSecondary">
                Envío (COP)
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {order.shipping_cost ? formatCurrency(order.shipping_cost) : 'Por definir'}
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.itemRow}>
              <ThemedText type="smallBold">Total (COP)</ThemedText>
              <ThemedText type="smallBold" themeColor="accent">
                {formatCurrency(order.total)}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {order.support_whatsapp_url && (
            <PrimaryButton
              label="Contactar con SanKen"
              icon={MessageCircle}
              variant="accent2"
              style={styles.whatsappButton}
              onPress={() => Linking.openURL(order.support_whatsapp_url!)}
            />
          )}
        </ScrollView>
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
    paddingBottom: BottomTabInset,
    gap: Spacing.two,
  },
  scrollContent: { gap: Spacing.two, paddingBottom: Spacing.four },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: { fontSize: 24, lineHeight: 30 },
  card: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.two, marginTop: Spacing.two },
  whatsappButton: { marginTop: Spacing.three },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  itemName: { flex: 1, marginRight: Spacing.two },
  divider: { height: 1, marginVertical: Spacing.one },
});
