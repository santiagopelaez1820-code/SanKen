import { useEffect, useMemo, useRef, useState } from 'react';
import { router } from 'expo-router';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchX, ShoppingCart } from 'lucide-react-native';
import type { ProductCategory } from '@sanken/core';

import { CATEGORY_LABELS, CategoryChips } from '@/components/store/category-chips';
import { ProductCard } from '@/components/store/product-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BackButton } from '@/components/ui/back-button';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { SearchField } from '@/components/ui/search-field';
import { Skeleton } from '@/components/ui/skeleton';
import { TutorialOverlay } from '@/components/tutorial/tutorial-overlay';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTutorial } from '@/hooks/use-tutorial';
import { filterProducts } from '@/lib/product-search';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';
import { useProductStore } from '@/store/product-store';

export default function StoreScreen() {
  const theme = useTheme();
  const userId = useAuthStore((s) => s.user?.id);
  const { products, isLoadingProducts, productsError, loadProducts } = useProductStore();
  // La hidratación del carrito corre una sola vez en store/_layout.tsx
  // (compartido por todas las pantallas de /store), no acá.
  const itemCount = useCartStore((s) => s.getItemCount());
  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const headerRef = useRef<View>(null);
  const headerListRef = useRef<View>(null);
  const cartButtonRef = useRef<View>(null);
  const tutorial = useTutorial(
    'tienda',
    [
      {
        ref: headerRef,
        title: 'Tienda SanKen',
        description: 'Suplementos y merch pensados para tu entrenamiento, con envío a todo el país.',
      },
      {
        ref: headerListRef,
        title: 'Buscá y explorá',
        description: 'Buscá por nombre o filtrá por categoría. Los destacados aparecen arriba de la lista.',
      },
      {
        ref: cartButtonRef,
        title: 'Tu carrito',
        description: 'Sumá productos acá y confirmá tu pedido cuando quieras.',
      },
    ],
    !isLoadingProducts,
    userId,
  );

  const isSearching = query.trim().length > 0;
  const featured = useMemo(() => products.slice(0, 5), [products]);
  // Búsqueda local sobre el catálogo ya cargado (GET /products no pagina):
  // sin requests extra por tecla y combinada con la categoría elegida.
  const filtered = useMemo(
    () => filterProducts(products, { category, query, categoryLabels: CATEGORY_LABELS }),
    [products, category, query],
  );

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <View ref={headerRef} style={styles.header}>
          <View style={styles.titleRow}>
            <BackButton fallbackHref="/" />
            <ThemedText type="title" accessibilityRole="header">
              Tienda
            </ThemedText>
          </View>
          <Pressable
            ref={cartButtonRef}
            onPress={() => router.push('/store/cart')}
            accessibilityLabel={itemCount > 0 ? `Ver carrito, ${itemCount} productos` : 'Ver carrito'}
            style={[styles.cartButton, { backgroundColor: theme.backgroundElement }]}>
            <ShoppingCart size={20} color={theme.text} />
            {itemCount > 0 && (
              <ThemedView style={[styles.badge, { backgroundColor: theme.accent }]}>
                <ThemedText type="small" style={styles.badgeText}>
                  {itemCount > 9 ? '9+' : itemCount}
                </ThemedText>
              </ThemedView>
            )}
          </Pressable>
        </View>

        {isLoadingProducts ? (
          <View style={styles.skeletonWrap}>
            <Skeleton height={42} borderRadius={Spacing.three} />
            <Skeleton height={120} borderRadius={Spacing.three} />
            <Skeleton height={200} borderRadius={Spacing.three} />
          </View>
        ) : productsError && products.length === 0 ? (
          // Antes un error de red acá caía en el ListEmptyComponent de la
          // grilla ("No hay productos en esta categoría") — un mensaje
          // engañoso que hacía parecer que la tienda estaba vacía en vez de
          // avisar que la carga falló.
          <ErrorState message={productsError} onRetry={loadProducts} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            columnWrapperStyle={styles.column}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            ListHeaderComponent={
              <View ref={headerListRef} style={styles.headerList}>
                <SearchField value={query} onChangeText={setQuery} placeholder="Buscar productos…" />
                {/* Con una búsqueda activa, los destacados solo empujarían
                    los resultados fuera de la pantalla. */}
                {!isSearching && featured.length > 0 && (
                  <View style={styles.section}>
                    <ThemedText type="smallBold">Destacados</ThemedText>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.featuredRow}>
                      {featured.map((product) => (
                        <View key={product.id} style={styles.featuredCard}>
                          <ProductCard product={product} onPress={() => router.push(`/store/${product.id}`)} />
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}
                <CategoryChips value={category} onChange={setCategory} />
                {isSearching && (
                  <ThemedText type="small" themeColor="textSecondary" accessibilityLiveRegion="polite">
                    {filtered.length === 1 ? '1 resultado' : `${filtered.length} resultados`}
                  </ThemedText>
                )}
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.gridItem}>
                <ProductCard product={item} onPress={() => router.push(`/store/${item.id}`)} />
              </View>
            )}
            ListEmptyComponent={
              isSearching ? (
                <EmptyState
                  icon={SearchX}
                  title={`Sin resultados para “${query.trim()}”`}
                  description={
                    category ? 'Probá con otra palabra o quitá el filtro de categoría.' : 'Probá con otra palabra.'
                  }
                  action={{ label: 'Limpiar búsqueda', onPress: () => setQuery('') }}
                />
              ) : (
                <EmptyState
                  icon={ShoppingCart}
                  title="No hay productos en esta categoría"
                  description="Probá con otra categoría."
                />
              )
            }
          />
        )}
      </SafeAreaView>

      <TutorialOverlay tutorial={tutorial} />
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
    paddingTop: Spacing.two,
    gap: Spacing.three,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  // 44x44: mínimo táctil (mismo que el carrito del detalle de producto).
  cartButton: { width: 44, height: 44, borderRadius: Spacing.three, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: '#050505', fontWeight: '700', fontSize: 10, lineHeight: 12 },
  skeletonWrap: { gap: Spacing.three },
  listContent: { gap: Spacing.three, paddingBottom: BottomTabInset + Spacing.four },
  headerList: { gap: Spacing.three, marginBottom: Spacing.one },
  section: { gap: Spacing.two },
  featuredRow: { gap: Spacing.two },
  featuredCard: { width: 164 },
  column: { gap: Spacing.three },
  gridItem: { flex: 1 },
});
