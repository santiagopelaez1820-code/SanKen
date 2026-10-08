// Esta línea sirve para importar «useEffect» desde «react».
import { useEffect } from 'react';
// Esta línea sirve para importar «useLocalSearchParams» desde «expo-router».
import { useLocalSearchParams } from 'expo-router';
// Esta línea sirve para importar «Linking, ScrollView, StyleSheet» desde «react-native».
import { Linking, ScrollView, StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «MessageCircle» desde «lucide-react-native».
import { MessageCircle } from 'lucide-react-native';
// Esta línea sirve para importar «formatCurrency» desde «@sanken/core».
import { formatCurrency } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «BackButton» desde «@/components/ui/back-button».
import { BackButton } from '@/components/ui/back-button';
// Esta línea sirve para importar «Badge» desde «@/components/ui/badge».
import { Badge } from '@/components/ui/badge';
// Esta línea sirve para importar «ErrorState» desde «@/components/ui/error-state».
import { ErrorState } from '@/components/ui/error-state';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';
// Esta línea sirve para importar «OrderTimeline» desde «@/components/store/order-timeline».
import { OrderTimeline } from '@/components/store/order-timeline';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «ORDER_STATUS_BADGE_VARIANT, ORDER_STATUS_LABELS» desde «@/constants/order-status».
import { ORDER_STATUS_BADGE_VARIANT, ORDER_STATUS_LABELS } from '@/constants/order-status';
// Esta línea sirve para importar «useOrdersStore» desde «@/store/orders-store».
import { useOrdersStore } from '@/store/orders-store';

// Esta línea sirve para declarar la función «PedidoDetailScreen».
export default function PedidoDetailScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para extraer «orderId» de «useLocalSearchParams<{ orderId: string }».
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  // Esta línea sirve para extraer «» de «Number(orderId)».
  const id = Number(orderId);
  // Esta línea sirve para obtener «currentOrder, isLoadingOrder, orderError, loadOrder» con el hook «useOrdersStore».
  const { currentOrder, isLoadingOrder, orderError, loadOrder } = useOrdersStore();

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «loadOrder» si «id».
    if (id) loadOrder(id);
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «id, loadOrder».
  }, [id, loadOrder]);

  // Esta línea sirve para revisar si «orderError».
  if (orderError) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el componente «ThemedView».
      <ThemedView style={styles.root}>
        {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
        <SafeAreaView style={styles.safeArea}>
          {/* Esta línea sirve para mostrar el componente «ErrorState». */}
          <ErrorState message={orderError} onRetry={() => loadOrder(id)} />
        </SafeAreaView>
      </ThemedView>
    );
  }

  // Esta línea sirve para revisar si «isLoadingOrder || !currentOrder».
  if (isLoadingOrder || !currentOrder) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el componente «ThemedView».
      <ThemedView style={styles.root}>
        {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
        <SafeAreaView style={styles.safeArea}>
          {/* Esta línea sirve para abrir el componente «Skeleton». */}
          <Skeleton height={300} borderRadius={Spacing.three} />
        </SafeAreaView>
      </ThemedView>
    );
  }

  // Esta línea sirve para extraer «rde» de «currentOrder».
  const order = currentOrder;

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «BackButton». */}
        <BackButton label="Mis pedidos" fallbackHref="/pedidos" />

        {/* Esta línea sirve para abrir el componente «ScrollView». */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={styles.headerRow}>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="title" style={styles.title}>
              {/* Esta línea sirve para mostrar el contenido dinámico «Pedido #{String(order.id).padStart(6, '0')}». */}
              Pedido #{String(order.id).padStart(6, '0')}
            </ThemedText>
            {/* Esta línea sirve para abrir el componente «Badge». */}
            <Badge label={ORDER_STATUS_LABELS[order.status]} variant={ORDER_STATUS_BADGE_VARIANT[order.status]} />
          </ThemedView>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary">
            {/* Esta línea sirve para mostrar el contenido dinámico «{new Date(order.created_at).toLocaleString()}». */}
            {new Date(order.created_at).toLocaleString()}
          </ThemedText>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.card}>
            {/* Esta línea sirve para mostrar el texto «Seguimiento» dentro de «ThemedText». */}
            <ThemedText type="smallBold">Seguimiento</ThemedText>
            {/* Esta línea sirve para abrir el componente «OrderTimeline». */}
            <OrderTimeline status={order.status} />
          </ThemedView>

          {/* Esta línea sirve para mostrar el bloque solo si «(order.tracking_number || order.carrier)». */}
          {(order.tracking_number || order.carrier) && (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView type="backgroundElement" style={styles.card}>
              {/* Esta línea sirve para mostrar el texto «Envío» dentro de «ThemedText». */}
              <ThemedText type="smallBold">Envío</ThemedText>
              {/* Esta línea sirve para mostrar el bloque solo si «order.carrier». */}
              {order.carrier && (
                // Esta línea sirve para abrir el componente «ThemedView».
                <ThemedView style={styles.itemRow}>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor="textSecondary">
                    {/* Esta línea sirve para mostrar el texto «Transportadora». */}
                    Transportadora
                  </ThemedText>
                  {/* Esta línea sirve para mostrar el valor «order.carrier» dentro de «ThemedText». */}
                  <ThemedText type="small">{order.carrier}</ThemedText>
                </ThemedView>
              )}
              {/* Esta línea sirve para mostrar el bloque solo si «order.tracking_number». */}
              {order.tracking_number && (
                // Esta línea sirve para abrir el componente «ThemedView».
                <ThemedView style={styles.itemRow}>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor="textSecondary">
                    {/* Esta línea sirve para mostrar el texto «Número de guía». */}
                    Número de guía
                  </ThemedText>
                  {/* Esta línea sirve para mostrar el valor «order.tracking_number» dentro de «ThemedText». */}
                  <ThemedText type="small">{order.tracking_number}</ThemedText>
                </ThemedView>
              )}
            </ThemedView>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «order.customer_message». */}
          {order.customer_message && (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView type="backgroundElement" style={styles.card}>
              {/* Esta línea sirve para mostrar el texto «Mensaje de SanKen» dentro de «ThemedText». */}
              <ThemedText type="smallBold">Mensaje de SanKen</ThemedText>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el valor «order.customer_message». */}
                {order.customer_message}
              </ThemedText>
            </ThemedView>
          )}

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.card}>
            {/* Esta línea sirve para mostrar el texto «Entrega» dentro de «ThemedText». */}
            <ThemedText type="smallBold">Entrega</ThemedText>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el valor «order.address». */}
              {order.address}
            </ThemedText>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el contenido dinámico «{order.city}, {order.department}». */}
              {order.city}, {order.department}
            </ThemedText>
            {/* Esta línea sirve para mostrar el bloque solo si «order.additional_info». */}
            {order.additional_info && (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el valor «order.additional_info». */}
                {order.additional_info}
              </ThemedText>
            )}
          </ThemedView>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.card}>
            {/* Esta línea sirve para mostrar el texto «Productos» dentro de «ThemedText». */}
            <ThemedText type="smallBold">Productos</ThemedText>
            {/* Esta línea sirve para recorrer «order.items» y mostrar un bloque por elemento. */}
            {order.items.map((item) => (
              // Esta línea sirve para abrir el componente «ThemedView».
              <ThemedView key={item.id} style={styles.itemRow}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" style={styles.itemName} numberOfLines={1}>
                  {/* Esta línea sirve para mostrar el contenido dinámico «{item.quantity}× {item.product_name}». */}
                  {item.quantity}× {item.product_name}
                </ThemedText>
                {/* Esta línea sirve para mostrar el valor «formatCurrency(item.subtotal)» dentro de «ThemedText». */}
                <ThemedText type="small">{formatCurrency(item.subtotal)}</ThemedText>
              </ThemedView>
            ))}
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={[styles.divider, { backgroundColor: theme.border }]} />
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.itemRow}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el texto «Subtotal (COP)». */}
                Subtotal (COP)
              </ThemedText>
              {/* Esta línea sirve para mostrar el valor «formatCurrency(order.subtotal)» dentro de «ThemedText». */}
              <ThemedText type="small">{formatCurrency(order.subtotal)}</ThemedText>
            </ThemedView>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.itemRow}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el texto «Envío (COP)». */}
                Envío (COP)
              </ThemedText>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el costo de envío o «Por definir». */}
                {order.shipping_cost ? formatCurrency(order.shipping_cost) : 'Por definir'}
              </ThemedText>
            </ThemedView>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.itemRow}>
              {/* Esta línea sirve para mostrar el texto «Total (COP)» dentro de «ThemedText». */}
              <ThemedText type="smallBold">Total (COP)</ThemedText>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="smallBold" themeColor="accent">
                {/* Esta línea sirve para mostrar el contenido dinámico «{formatCurrency(order.total)}». */}
                {formatCurrency(order.total)}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Esta línea sirve para mostrar el bloque solo si «order.support_whatsapp_url». */}
          {order.support_whatsapp_url && (
            // Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas.
            <PrimaryButton
              // Esta línea sirve para definir el atributo «label» con el valor «Contactar con SanKen».
              label="Contactar con SanKen"
              // Esta línea sirve para pasar la propiedad «icon» con el valor «MessageCircle}».
              icon={MessageCircle}
              // Esta línea sirve para definir el atributo «variant» con el valor «accent2».
              variant="accent2"
              // Esta línea sirve para pasar la propiedad «style» con el valor «styles.whatsappButton}».
              style={styles.whatsappButton}
              // Esta línea sirve para asignar el manejador del evento «onPress».
              onPress={() => Linking.openURL(order.support_whatsapp_url!)}
            />
          )}
        </ScrollView>
      </SafeAreaView>
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
    // Esta línea sirve para declarar la propiedad «paddingTop» con el valor o tipo «Spacing.three».
    paddingTop: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingBottom» con el valor o tipo «BottomTabInset».
    paddingBottom: BottomTabInset,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para definir el estilo «scrollContent» con «gap: Spacing.two, paddingBottom: Spacing.four },…».
  scrollContent: { gap: Spacing.two, paddingBottom: Spacing.four },
  // Esta línea sirve para declarar la propiedad «headerRow» con el valor o tipo «{».
  headerRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «{ fontSize: 24, lineHeight: 30 }».
  title: { fontSize: 24, lineHeight: 30 },
  // Esta línea sirve para definir el estilo «card» con «borderRadius: Spacing.four, padding: Spacing.three…».
  card: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.two, marginTop: Spacing.two },
  // Esta línea sirve para declarar la propiedad «whatsappButton» con el valor o tipo «{ marginTop: Spacing.three }».
  whatsappButton: { marginTop: Spacing.three },
  // Esta línea sirve para declarar la propiedad «itemRow» con el valor o tipo «{».
  itemRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «itemName» con el valor o tipo «{ flex: 1, marginRight: Spacing.two }».
  itemName: { flex: 1, marginRight: Spacing.two },
  // Esta línea sirve para declarar la propiedad «divider» con el valor o tipo «{ height: 1, marginVertical: Spacing.one }».
  divider: { height: 1, marginVertical: Spacing.one },
});
