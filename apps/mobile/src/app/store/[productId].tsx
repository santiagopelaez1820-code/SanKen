import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingBag, ShoppingCart } from 'lucide-react-native';
import { formatCurrency } from '@sanken/core';

import { CATEGORY_LABELS } from '@/components/store/category-chips';
import { isNewProduct } from '@/components/store/product-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BackButton } from '@/components/ui/back-button';
import { ErrorState } from '@/components/ui/error-state';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Skeleton } from '@/components/ui/skeleton';
import { Stepper } from '@/components/ui/stepper';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import { useCartStore } from '@/store/cart-store';
import { useProductStore } from '@/store/product-store';
import { useToastStore } from '@/store/toast-store';

export default function ProductDetailScreen() {
  const theme = useTheme();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const id = Number(productId);

  const { currentProduct, isLoadingProduct, productError, loadProduct } = useProductStore();
  const addItem = useCartStore((s) => s.addItem);
  const itemCount = useCartStore((s) => s.getItemCount());
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) loadProduct(id);
  }, [id, loadProduct]);

  // Antes esta pantalla se quedaba en el skeleton para siempre si la carga
  // fallaba: la condición solo miraba `!currentProduct`, nunca `productError`
  // — sin conexión, el usuario veía un loader infinito sin ninguna salida.
  if (productError) {
    return (
      <ThemedView style={styles.root}>
        <SafeAreaView style={styles.safeArea}>
          <ErrorState message={productError} onRetry={() => loadProduct(id)} />
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (isLoadingProduct || !currentProduct) {
    return (
      <ThemedView style={styles.root}>
        <SafeAreaView style={styles.safeArea}>
          <Skeleton height={240} borderRadius={Spacing.four} />
        </SafeAreaView>
      </ThemedView>
    );
  }

  const product = currentProduct;
  const imageUrl = api.mediaUrl(product.image);

  const handleAdd = () => {
    addItem(product, quantity);
    useToastStore.getState().show(`✓ ${product.name} agregado`, 'success');
    // Vuelve a 1 para que agregar de nuevo no arrastre sin querer la
    // cantidad anterior — el usuario sigue viendo este mismo producto.
    setQuantity(1);
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <BackButton label="Tienda" fallbackHref="/store" />
          <Pressable
            onPress={() => router.push('/store/cart')}
            accessibilityLabel="Ver carrito"
            style={[styles.cartButton, { backgroundColor: theme.backgroundElement }]}>
            <ShoppingCart size={20} color={theme.text} />
            {itemCount > 0 && (
              <ThemedView style={[styles.cartBadge, { backgroundColor: theme.accent }]}>
                <ThemedText type="small" style={styles.cartBadgeText}>
                  {itemCount > 9 ? '9+' : itemCount}
                </ThemedText>
              </ThemedView>
            )}
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.imageWrap, { backgroundColor: theme.backgroundElement }]}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.image} contentFit="contain" transition={150} />
            ) : (
              <ShoppingBag size={40} color={theme.textSecondary} />
            )}
            {isNewProduct(product.created_at) && (
              <ThemedView style={[styles.newBadge, { backgroundColor: theme.accent }]}>
                <ThemedText type="small" style={styles.newBadgeText}>
                  🆕 Nuevo
                </ThemedText>
              </ThemedView>
            )}
          </View>

          <ThemedText type="small" themeColor="accent" style={styles.category}>
            {CATEGORY_LABELS[product.category]}
          </ThemedText>
          <ThemedText type="title" style={styles.name}>
            {product.name}
          </ThemedText>
          <ThemedText type="subtitle" themeColor="accent" style={styles.price}>
            {formatCurrency(product.price)}
          </ThemedText>

          <ThemedText type="default" themeColor="textSecondary" style={styles.description}>
            {product.description}
          </ThemedText>

          <ThemedView style={styles.quantityRow}>
            <ThemedText type="smallBold">Cantidad</ThemedText>
            <View style={styles.stepperWrap}>
              <Stepper value={quantity} min={1} max={50} onChange={setQuantity} />
            </View>
          </ThemedView>
        </ScrollView>

        <PrimaryButton label="Agregar al carrito" onPress={handleAdd} />
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
    paddingTop: Spacing.two,
    paddingBottom: BottomTabInset,
    gap: Spacing.three,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartButton: {
    // 44x44: mismo mínimo táctil que el botón de carrito de la Tienda
    // (store/index.tsx) — no achicarlo solo porque comparte fila con el
    // link de volver.
    width: 44,
    height: 44,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
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
  cartBadgeText: { color: '#050505', fontWeight: '700', fontSize: 10 },
  scrollContent: { gap: Spacing.two, paddingBottom: Spacing.four },
  // 4:3 + contain (antes 1:1 + cover): la foto entra completa sin recortar
  // y el detalle gana altura para nombre, precio y descripción.
  imageWrap: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: Spacing.two,
  },
  image: { width: '100%', height: '100%' },
  newBadge: {
    position: 'absolute',
    top: Spacing.two,
    left: Spacing.two,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
  },
  newBadgeText: { color: '#050505', fontWeight: '700', fontSize: 11 },
  category: { textTransform: 'uppercase', letterSpacing: 0.5 },
  name: { fontSize: 22, lineHeight: 28 },
  price: { fontSize: 20, lineHeight: 26 },
  description: { marginTop: Spacing.two },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.three,
    backgroundColor: 'transparent',
  },
  stepperWrap: { width: 160 },
});
