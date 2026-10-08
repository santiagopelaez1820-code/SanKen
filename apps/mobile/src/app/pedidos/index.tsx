// Esta línea sirve para importar «useEffect» desde «react».
import { useEffect } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «FlatList, Pressable, StyleSheet» desde «react-native».
import { FlatList, Pressable, StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «Package» desde «lucide-react-native».
import { Package } from 'lucide-react-native';
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
// Esta línea sirve para importar «EmptyState» desde «@/components/ui/empty-state».
import { EmptyState } from '@/components/ui/empty-state';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «ORDER_STATUS_BADGE_VARIANT, ORDER_STATUS_LABELS» desde «@/constants/order-status».
import { ORDER_STATUS_BADGE_VARIANT, ORDER_STATUS_LABELS } from '@/constants/order-status';
// Esta línea sirve para importar «useOrdersStore» desde «@/store/orders-store».
import { useOrdersStore } from '@/store/orders-store';

// Esta línea sirve para declarar la función «PedidosScreen».
export default function PedidosScreen() {
  // Esta línea sirve para obtener «orders, isLoadingOrders, loadOrders» con el hook «useOrdersStore».
  const { orders, isLoadingOrders, loadOrders } = useOrdersStore();

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «loadOrders».
    loadOrders();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «loadOrders».
  }, [loadOrders]);

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «BackButton». */}
        <BackButton fallbackHref="/profile" />
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="title" style={styles.title}>
          {/* Esta línea sirve para mostrar el texto «Mis pedidos». */}
          Mis pedidos
        </ThemedText>

        {/* Esta línea sirve para elegir entre dos bloques según «isLoadingOrders». */}
        {isLoadingOrders ? (
          // Esta línea sirve para abrir el componente «ThemedView».
          <ThemedView style={styles.skeletonWrap}>
            {/* Esta línea sirve para abrir el componente «Skeleton». */}
            <Skeleton height={84} borderRadius={Spacing.three} />
            {/* Esta línea sirve para abrir el componente «Skeleton». */}
            <Skeleton height={84} borderRadius={Spacing.three} />
          </ThemedView>
        // Esta línea sirve para mostrar el estado vacío si no hay pedidos.
        ) : orders.length === 0 ? (
          // Esta línea sirve para abrir el elemento «EmptyState» con sus atributos en varias líneas.
          <EmptyState
            // Esta línea sirve para pasar la propiedad «icon» con el valor «Package}».
            icon={Package}
            // Esta línea sirve para definir el atributo «title» con el valor «Todavía no hiciste ningún pedido».
            title="Todavía no hiciste ningún pedido"
            // Esta línea sirve para definir el atributo «description».
            description="Cuando compres algo en la tienda, lo vas a ver acá."
            // Esta línea sirve para pasar la propiedad «action» con el valor «{ label: 'Ir a la tienda', onPress: () => rou».
            action={{ label: 'Ir a la tienda', onPress: () => router.push('/store') }}
          />
        // Esta línea sirve para mostrar el bloque alternativo.
        ) : (
          // Esta línea sirve para abrir el elemento «FlatList» con sus atributos en varias líneas.
          <FlatList
            // Esta línea sirve para pasar la propiedad «data» con el valor «orders}».
            data={orders}
            // Esta línea sirve para pasar la propiedad «keyExtractor» con el valor «(item) => String(item.id)}».
            keyExtractor={(item) => String(item.id)}
            // Esta línea sirve para pasar la propiedad «contentContainerStyle» con el valor «styles.list}».
            contentContainerStyle={styles.list}
            // Esta línea sirve para pasar la propiedad «renderItem» con el valor «({ item }) => (».
            renderItem={({ item }) => (
              // Esta línea sirve para abrir el componente «Pressable» con sus propiedades.
              <Pressable onPress={() => router.push(`/pedidos/${item.id}`)}>
                {/* Esta línea sirve para abrir el componente «ThemedView». */}
                <ThemedView type="backgroundElement" style={styles.row}>
                  {/* Esta línea sirve para abrir el componente «ThemedView». */}
                  <ThemedView style={styles.rowHeader}>
                    {/* Esta línea sirve para abrir el componente «ThemedText» con sus propiedades. */}
                    <ThemedText type="smallBold">Pedido #{String(item.id).padStart(6, '0')}</ThemedText>
                    {/* Esta línea sirve para abrir el componente «Badge». */}
                    <Badge label={ORDER_STATUS_LABELS[item.status]} variant={ORDER_STATUS_BADGE_VARIANT[item.status]} />
                  </ThemedView>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor="textSecondary">
                    {/* Esta línea sirve para mostrar la fecha y la cantidad de productos del pedido. */}
                    {new Date(item.created_at).toLocaleDateString()} · {item.items.length}{' '}
                    {/* Esta línea sirve para mostrar el contenido dinámico «{item.items.length === 1 ? 'producto' : 'productos'}». */}
                    {item.items.length === 1 ? 'producto' : 'productos'}
                  </ThemedText>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="smallBold" themeColor="accent">
                    {/* Esta línea sirve para mostrar el contenido dinámico «{formatCurrency(item.total)}». */}
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
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «{ fontSize: 24, lineHeight: 30 }».
  title: { fontSize: 24, lineHeight: 30 },
  // Esta línea sirve para declarar la propiedad «skeletonWrap» con el valor o tipo «{ gap: Spacing.two }».
  skeletonWrap: { gap: Spacing.two },
  // Esta línea sirve para definir el estilo «list» con «gap: Spacing.two, paddingBottom: BottomTabInset + …».
  list: { gap: Spacing.two, paddingBottom: BottomTabInset + Spacing.four },
  // Esta línea sirve para definir el estilo «row» con «borderRadius: Spacing.three, padding: Spacing.thre…».
  row: { borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.half },
  // Esta línea sirve para declarar la propiedad «rowHeader» con el valor o tipo «{».
  rowHeader: {
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
