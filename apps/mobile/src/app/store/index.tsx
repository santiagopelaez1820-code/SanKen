// Esta línea sirve para importar «useEffect, useMemo, useRef, useState» desde «react».
import { useEffect, useMemo, useRef, useState } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «FlatList, Pressable, ScrollView, StyleSheet, View» desde «react-native».
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «SearchX, ShoppingCart» desde «lucide-react-native».
import { SearchX, ShoppingCart } from 'lucide-react-native';
// Esta línea sirve para importar los tipos «ProductCategory» desde «@sanken/core».
import type { ProductCategory } from '@sanken/core';

// Esta línea sirve para importar «CATEGORY_LABELS, CategoryChips» desde «@/components/store/category-chips».
import { CATEGORY_LABELS, CategoryChips } from '@/components/store/category-chips';
// Esta línea sirve para importar «ProductCard» desde «@/components/store/product-card».
import { ProductCard } from '@/components/store/product-card';
import { SourcingBanner } from '@/components/store/sourcing-banner';
// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «BackButton» desde «@/components/ui/back-button».
import { BackButton } from '@/components/ui/back-button';
// Esta línea sirve para importar «EmptyState» desde «@/components/ui/empty-state».
import { EmptyState } from '@/components/ui/empty-state';
// Esta línea sirve para importar «ErrorState» desde «@/components/ui/error-state».
import { ErrorState } from '@/components/ui/error-state';
// Esta línea sirve para importar «SearchField» desde «@/components/ui/search-field».
import { SearchField } from '@/components/ui/search-field';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';
// Esta línea sirve para importar «TutorialOverlay» desde «@/components/tutorial/tutorial-overlay».
import { TutorialOverlay } from '@/components/tutorial/tutorial-overlay';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useTutorial» desde «@/hooks/use-tutorial».
import { useTutorial } from '@/hooks/use-tutorial';
// Esta línea sirve para importar «filterProducts» desde «@/lib/product-search».
import { filterProducts } from '@/lib/product-search';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';
// Esta línea sirve para importar «useCartStore» desde «@/store/cart-store».
import { useCartStore } from '@/store/cart-store';
// Esta línea sirve para importar «useProductStore» desde «@/store/product-store».
import { useProductStore } from '@/store/product-store';

// Esta línea sirve para declarar la función «StoreScreen».
export default function StoreScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «userId» con el hook «useAuthStore».
  const userId = useAuthStore((s) => s.user?.id);
  // Esta línea sirve para obtener «products, isLoadingProducts, productsError, loadProducts» con el hook «useProductStore».
  const { products, isLoadingProducts, productsError, loadProducts } = useProductStore();
  // La hidratación del carrito corre una sola vez en store/_layout.tsx
  // (compartido por todas las pantallas de /store), no acá.
  // Esta línea sirve para obtener «itemCount» con el hook «useCartStore».
  const itemCount = useCartStore((s) => s.getItemCount());
  // Esta línea sirve para crear el estado «category» y su función «setCategory».
  const [category, setCategory] = useState<ProductCategory | null>(null);
  // Esta línea sirve para crear el estado «query» y su función «setQuery».
  const [query, setQuery] = useState('');

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «loadProducts».
    loadProducts();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «loadProducts».
  }, [loadProducts]);

  // Esta línea sirve para crear la referencia «headerRef».
  const headerRef = useRef<View>(null);
  // Esta línea sirve para crear la referencia «headerListRef».
  const headerListRef = useRef<View>(null);
  // Esta línea sirve para crear la referencia «cartButtonRef».
  const cartButtonRef = useRef<View>(null);
  // Esta línea sirve para obtener «tutorial» con el hook «useTutorial».
  const tutorial = useTutorial(
    // Esta línea sirve para incluir el texto o las clases «tienda…».
    'tienda',
    [
      {
        // Esta línea sirve para declarar la propiedad «ref» con el valor o tipo «headerRef».
        ref: headerRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «'Tienda SanKen'».
        title: 'Tienda SanKen',
        // Esta línea sirve para definir la propiedad «description» con «Suplementos y merch pensados para tu ent…».
        description: 'Suplementos y merch pensados para tu entrenamiento, con envío a todo el país.',
      },
      {
        // Esta línea sirve para declarar la propiedad «ref» con el valor o tipo «headerListRef».
        ref: headerListRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «'Buscá y explorá'».
        title: 'Buscá y explorá',
        // Esta línea sirve para definir la propiedad «description» con «Buscá por nombre o filtrá por categoría.…».
        description: 'Buscá por nombre o filtrá por categoría. Los destacados aparecen arriba de la lista.',
      },
      {
        // Esta línea sirve para declarar la propiedad «ref» con el valor o tipo «cartButtonRef».
        ref: cartButtonRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «'Tu carrito'».
        title: 'Tu carrito',
        // Esta línea sirve para definir la propiedad «description» con «Sumá productos acá y confirmá tu pedido …».
        description: 'Sumá productos acá y confirmá tu pedido cuando quieras.',
      },
    ],
    // Esta línea sirve para indicar que la carga ya terminó.
    !isLoadingProducts,
    // Esta línea sirve para incluir el valor «userId» en la lista.
    userId,
  );

  // Esta línea sirve para extraer «sSearchin» de «query.trim().length > 0».
  const isSearching = query.trim().length > 0;
  // Esta línea sirve para obtener «featured» con el hook «useMemo».
  const featured = useMemo(() => products.slice(0, 5), [products]);
  // Búsqueda local sobre el catálogo ya cargado (GET /products no pagina):
  // sin requests extra por tecla y combinada con la categoría elegida.
  // Esta línea sirve para obtener «filtered» con el hook «useMemo».
  const filtered = useMemo(
    // Esta línea sirve para filtrar los productos por categoría y búsqueda.
    () => filterProducts(products, { category, query, categoryLabels: CATEGORY_LABELS }),
    // Esta línea sirve para volver a calcular cuando cambian los productos, la categoría o la búsqueda.
    [products, category, query],
  );

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «View». */}
        <View ref={headerRef} style={styles.header}>
          {/* Esta línea sirve para abrir el componente «View». */}
          <View style={styles.titleRow}>
            {/* Esta línea sirve para abrir el componente «BackButton». */}
            <BackButton fallbackHref="/" />
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="title" accessibilityRole="header">
              {/* Esta línea sirve para mostrar el texto «Tienda». */}
              Tienda
            </ThemedText>
          </View>
          {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
          <Pressable
            // Esta línea sirve para conectar la referencia «cartButtonRef}» con el elemento.
            ref={cartButtonRef}
            // Esta línea sirve para asignar el manejador del evento «onPress».
            onPress={() => router.push('/store/cart')}
            // Esta línea sirve para pasar la propiedad «accessibilityLabel» con el valor «itemCount > 0 ? `Ver carrito, ${itemCount} pr».
            accessibilityLabel={itemCount > 0 ? `Ver carrito, ${itemCount} productos` : 'Ver carrito'}
            // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.cartButton, { backgroundColor: theme.».
            style={[styles.cartButton, { backgroundColor: theme.backgroundElement }]}>
            {/* Esta línea sirve para abrir el componente «ShoppingCart». */}
            <ShoppingCart size={20} color={theme.text} />
            {/* Esta línea sirve para mostrar el bloque solo si «itemCount > 0». */}
            {itemCount > 0 && (
              // Esta línea sirve para abrir el componente «ThemedView».
              <ThemedView style={[styles.badge, { backgroundColor: theme.accent }]}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" style={styles.badgeText}>
                  {/* Esta línea sirve para mostrar el contador de productos con tope en 9+. */}
                  {itemCount > 9 ? '9+' : itemCount}
                </ThemedText>
              </ThemedView>
            )}
          </Pressable>
        </View>

        {/* Esta línea sirve para elegir entre dos bloques según «isLoadingProducts». */}
        {isLoadingProducts ? (
          // Esta línea sirve para abrir el componente «View».
          <View style={styles.skeletonWrap}>
            {/* Esta línea sirve para abrir el componente «Skeleton». */}
            <Skeleton height={42} borderRadius={Spacing.three} />
            {/* Esta línea sirve para abrir el componente «Skeleton». */}
            <Skeleton height={120} borderRadius={Spacing.three} />
            {/* Esta línea sirve para abrir el componente «Skeleton». */}
            <Skeleton height={200} borderRadius={Spacing.three} />
          </View>
        // Esta línea sirve para mostrar el error si falló la carga y no hay productos.
        ) : productsError && products.length === 0 ? (
          // Antes un error de red acá caía en el ListEmptyComponent de la
          // grilla ("No hay productos en esta categoría") — un mensaje
          // engañoso que hacía parecer que la tienda estaba vacía en vez de
          // avisar que la carga falló.
          // Esta línea sirve para abrir el componente «ErrorState».
          <ErrorState message={productsError} onRetry={loadProducts} />
        // Esta línea sirve para mostrar el bloque alternativo.
        ) : (
          // Esta línea sirve para abrir el elemento «FlatList» con sus atributos en varias líneas.
          <FlatList
            // Esta línea sirve para pasar la propiedad «data» con el valor «filtered}».
            data={filtered}
            // Esta línea sirve para pasar la propiedad «keyExtractor» con el valor «(item) => String(item.id)}».
            keyExtractor={(item) => String(item.id)}
            // Esta línea sirve para pasar la propiedad «numColumns» con el valor «2}».
            numColumns={2}
            // Esta línea sirve para pasar la propiedad «columnWrapperStyle» con el valor «styles.column}».
            columnWrapperStyle={styles.column}
            // Esta línea sirve para pasar la propiedad «contentContainerStyle» con el valor «styles.listContent}».
            contentContainerStyle={styles.listContent}
            // Esta línea sirve para definir el atributo «keyboardShouldPersistTaps» con el valor «handled».
            keyboardShouldPersistTaps="handled"
            // Esta línea sirve para definir el atributo «keyboardDismissMode» con el valor «on-drag».
            keyboardDismissMode="on-drag"
            // Esta línea sirve para pasar la propiedad «ListHeaderComponent» con el valor «».
            ListHeaderComponent={
              // Esta línea sirve para abrir el componente «View».
              <View ref={headerListRef} style={styles.headerList}>
                {/* Esta línea sirve para abrir el componente «SearchField». */}
                <SearchField value={query} onChangeText={setQuery} placeholder="Buscar productos…" />
                <SourcingBanner />
                {/* Esta línea sirve para mostrar el contenido dinámico «{/* Con una búsqueda activa, los destacados solo empujarían». */}
                {/* Con una búsqueda activa, los destacados solo empujarían
                    // Esta línea sirve para cerrar el comentario sobre los resultados fuera de pantalla.
                    los resultados fuera de la pantalla. */}
                {/* Esta línea sirve para mostrar el bloque solo si «!isSearching && featured.length > 0». */}
                {!isSearching && featured.length > 0 && (
                  // Esta línea sirve para abrir el componente «View».
                  <View style={styles.section}>
                    {/* Esta línea sirve para mostrar el texto «Destacados» dentro de «ThemedText». */}
                    <ThemedText type="smallBold">Destacados</ThemedText>
                    {/* Esta línea sirve para abrir el elemento «ScrollView» con sus atributos en varias líneas. */}
                    <ScrollView
                      // Esta línea sirve para activar la opción «horizontal».
                      horizontal
                      // Esta línea sirve para pasar la propiedad «showsHorizontalScrollIndicator» con el valor «false}».
                      showsHorizontalScrollIndicator={false}
                      // Esta línea sirve para pasar la propiedad «contentContainerStyle» con el valor «styles.featuredRow}>».
                      contentContainerStyle={styles.featuredRow}>
                      {/* Esta línea sirve para recorrer «featured» y mostrar un bloque por elemento. */}
                      {featured.map((product) => (
                        // Esta línea sirve para abrir el componente «View».
                        <View key={product.id} style={styles.featuredCard}>
                          {/* Esta línea sirve para mostrar el componente «ProductCard». */}
                          <ProductCard product={product} onPress={() => router.push(`/store/${product.id}`)} />
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}
                {/* Esta línea sirve para abrir el componente «CategoryChips». */}
                <CategoryChips value={category} onChange={setCategory} />
                {/* Esta línea sirve para mostrar el bloque solo si «isSearching». */}
                {isSearching && (
                  // Esta línea sirve para abrir el componente «ThemedText».
                  <ThemedText type="small" themeColor="textSecondary" accessibilityLiveRegion="polite">
                    {/* Esta línea sirve para mostrar la cantidad de resultados. */}
                    {filtered.length === 1 ? '1 resultado' : `${filtered.length} resultados`}
                  </ThemedText>
                )}
              </View>
            }
            // Esta línea sirve para pasar la propiedad «renderItem» con el valor «({ item }) => (».
            renderItem={({ item }) => (
              // Esta línea sirve para abrir el componente «View».
              <View style={styles.gridItem}>
                {/* Esta línea sirve para mostrar el componente «ProductCard». */}
                <ProductCard product={item} onPress={() => router.push(`/store/${item.id}`)} />
              </View>
            )}
            // Esta línea sirve para pasar la propiedad «ListEmptyComponent» con el valor «».
            ListEmptyComponent={
              // Esta línea sirve para revisar si el usuario está buscando.
              isSearching ? (
                // Esta línea sirve para abrir el elemento «EmptyState» con sus atributos en varias líneas.
                <EmptyState
                  // Esta línea sirve para pasar la propiedad «icon» con el valor «SearchX}».
                  icon={SearchX}
                  // Esta línea sirve para pasar la propiedad «title» con el valor «`Sin resultados para “${query.trim()}”`}».
                  title={`Sin resultados para “${query.trim()}”`}
                  // Esta línea sirve para pasar la propiedad «description» con el valor «».
                  description={
                    // Esta línea sirve para sugerir otra palabra o quitar el filtro de categoría.
                    category ? 'Probá con otra palabra o quitá el filtro de categoría.' : 'Probá con otra palabra.'
                  }
                  // Esta línea sirve para pasar la propiedad «action» con el valor «{ label: 'Limpiar búsqueda', onPress: () => s».
                  action={{ label: 'Limpiar búsqueda', onPress: () => setQuery('') }}
                />
              // Esta línea sirve para mostrar el bloque alternativo.
              ) : (
                // Esta línea sirve para abrir el elemento «EmptyState» con sus atributos en varias líneas.
                <EmptyState
                  // Esta línea sirve para pasar la propiedad «icon» con el valor «ShoppingCart}».
                  icon={ShoppingCart}
                  // Esta línea sirve para definir el atributo «title» con el valor «No hay productos en esta categoría».
                  title="No hay productos en esta categoría"
                  // Esta línea sirve para definir el atributo «description» con el valor «Probá con otra categoría.».
                  description="Probá con otra categoría."
                />
              )
            }
          />
        )}
      </SafeAreaView>

      {/* Esta línea sirve para abrir el componente «TutorialOverlay». */}
      <TutorialOverlay tutorial={tutorial} />
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
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
  },
  // Esta línea sirve para definir el estilo «header» con «flexDirection: 'row', justifyContent: 'space-betwe…».
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  // Esta línea sirve para definir el estilo «titleRow» con «flexDirection: 'row', alignItems: 'center', gap: S…».
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  // 44x44: mínimo táctil (mismo que el carrito del detalle de producto).
  // Esta línea sirve para definir el estilo «cartButton» con «width: 44, height: 44, borderRadius: Spacing.three…».
  cartButton: { width: 44, height: 44, borderRadius: Spacing.three, alignItems: 'center', justifyContent: 'center' },
  // Esta línea sirve para declarar la propiedad «badge» con el valor o tipo «{».
  badge: {
    // Esta línea sirve para declarar la propiedad «position» con el valor o tipo «'absolute'».
    position: 'absolute',
    // Esta línea sirve para declarar la propiedad «top» con el valor o tipo «-4».
    top: -4,
    // Esta línea sirve para declarar la propiedad «right» con el valor o tipo «-4».
    right: -4,
    // Esta línea sirve para declarar la propiedad «minWidth» con el valor o tipo «18».
    minWidth: 18,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «18».
    height: 18,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «9».
    borderRadius: 9,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «4».
    paddingHorizontal: 4,
  },
  // Esta línea sirve para definir el estilo «badgeText» con «color: '#050505', fontWeight: '700', fontSize: 10,…».
  badgeText: { color: '#050505', fontWeight: '700', fontSize: 10, lineHeight: 12 },
  // Esta línea sirve para declarar la propiedad «skeletonWrap» con el valor o tipo «{ gap: Spacing.three }».
  skeletonWrap: { gap: Spacing.three },
  // Esta línea sirve para definir el estilo «listContent» con «gap: Spacing.three, paddingBottom: BottomTabInset …».
  listContent: { gap: Spacing.three, paddingBottom: BottomTabInset + Spacing.four },
  // Esta línea sirve para definir el estilo «headerList» con «gap: Spacing.three, marginBottom: Spacing.one },…».
  headerList: { gap: Spacing.three, marginBottom: Spacing.one },
  // Esta línea sirve para declarar la propiedad «section» con el valor o tipo «{ gap: Spacing.two }».
  section: { gap: Spacing.two },
  // Esta línea sirve para declarar la propiedad «featuredRow» con el valor o tipo «{ gap: Spacing.two }».
  featuredRow: { gap: Spacing.two },
  // Esta línea sirve para declarar la propiedad «featuredCard» con el valor o tipo «{ width: 164 }».
  featuredCard: { width: 164 },
  // Esta línea sirve para declarar la propiedad «column» con el valor o tipo «{ gap: Spacing.three }».
  column: { gap: Spacing.three },
  // Esta línea sirve para declarar la propiedad «gridItem» con el valor o tipo «{ flex: 1 }».
  gridItem: { flex: 1 },
});
