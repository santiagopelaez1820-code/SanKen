import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingCart } from 'lucide-react-native';
import type { ProductCategory } from '@sanken/core';

import { CategoryChips } from '@/components/store/category-chips';
import { ProductCard } from '@/components/store/product-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCartStore } from '@/store/cart-store';
import { useProductStore } from '@/store/product-store';

export default function StoreScreen() {
  const theme = useTheme();
  const { products, isLoadingProducts, loadProducts } = useProductStore();
  // La hidratación del carrito corre una sola vez en store/_layout.tsx
  // (compartido por todas las pantallas de /store), no acá.
  const itemCount = useCartStore((s) => s.getItemCount());
  const [category, setCategory] = useState<ProductCategory | null>(null);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const featured = useMemo(() => products.slice(0, 5), [products]);
  const filtered = useMemo(
    () => (category ? products.filter((p) => p.category === category) : products),
    [products, category],
  );

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <ThemedText type="small" themeColor="textSecondary" style={styles.eyebrow}>
              SANKEN
            </ThemedText>
            <ThemedText type="title" style={styles.title}>
              Store
            </ThemedText>
          </View>
          <Pressable
            onPress={() => router.push('/store/cart')}
            accessibilityLabel="Ver carrito"
            style={[styles.cartButton, { backgroundColor: theme.backgroundElement }]}>
            <ShoppingCart size={22} color={theme.text} />
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
            <Skeleton height={140} borderRadius={Spacing.four} />
            <Skeleton height={220} borderRadius={Spacing.four} />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            columnWrapperStyle={styles.column}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <View style={styles.headerList}>
                {featured.length > 0 && (
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
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.gridItem}>
                <ProductCard product={item} onPress={() => router.push(`/store/${item.id}`)} />
              </View>
            )}
            ListEmptyComponent={
              <EmptyState
                icon={ShoppingCart}
                title="No hay productos en esta categoría"
                description="Probá con otra categoría."
              />
            }
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  eyebrow: { textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 28, lineHeight: 32 },
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
  badgeText: { color: '#050505', fontWeight: '700', fontSize: 10 },
  skeletonWrap: { gap: Spacing.three },
  listContent: { gap: Spacing.three, paddingBottom: BottomTabInset + Spacing.four },
  headerList: { gap: Spacing.three, marginBottom: Spacing.one },
  section: { gap: Spacing.two },
  featuredRow: { gap: Spacing.two },
  featuredCard: { width: 180 },
  column: { gap: Spacing.three },
  gridItem: { flex: 1 },
});
