import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingBag } from 'lucide-react-native';
import { formatCurrency } from '@sanken/core';

import { CATEGORY_LABELS } from '@/components/store/category-chips';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Skeleton } from '@/components/ui/skeleton';
import { Stepper } from '@/components/ui/stepper';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import { useCartStore } from '@/store/cart-store';
import { useProductStore } from '@/store/product-store';

export default function ProductDetailScreen() {
  const theme = useTheme();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const id = Number(productId);

  const { currentProduct, isLoadingProduct, loadProduct } = useProductStore();
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) loadProduct(id);
  }, [id, loadProduct]);

  if (isLoadingProduct || !currentProduct) {
    return (
      <ThemedView style={styles.root}>
        <SafeAreaView style={styles.safeArea}>
          <Skeleton height={280} borderRadius={Spacing.four} />
        </SafeAreaView>
      </ThemedView>
    );
  }

  const product = currentProduct;
  const imageUrl = api.mediaUrl(product.image);

  const handleAdd = () => {
    addItem(product, quantity);
    router.push('/store/cart');
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="small" themeColor="textSecondary" onPress={() => router.back()}>
          ← Tienda
        </ThemedText>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.imageWrap, { backgroundColor: theme.backgroundElement }]}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" transition={150} />
            ) : (
              <ShoppingBag size={48} color={theme.textSecondary} />
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
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset,
    gap: Spacing.three,
  },
  scrollContent: { gap: Spacing.two, paddingBottom: Spacing.four },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: Spacing.two,
  },
  image: { width: '100%', height: '100%' },
  category: { textTransform: 'uppercase', letterSpacing: 0.5 },
  name: { fontSize: 26, lineHeight: 32 },
  price: { fontSize: 24, lineHeight: 30 },
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
