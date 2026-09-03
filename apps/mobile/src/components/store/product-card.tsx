import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { ShoppingBag } from 'lucide-react-native';
import { formatCurrency, type Product } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import { useCartStore } from '@/store/cart-store';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const theme = useTheme();
  const addItem = useCartStore((s) => s.addItem);
  const imageUrl = api.mediaUrl(product.image);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <ThemedView type="backgroundElement" style={styles.inner}>
        <View style={[styles.imageWrap, { backgroundColor: theme.backgroundSelected }]}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" transition={150} />
          ) : (
            <ShoppingBag size={28} color={theme.textSecondary} />
          )}
        </View>

        <ThemedText type="smallBold" numberOfLines={1}>
          {product.name}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={2} style={styles.description}>
          {product.short_description}
        </ThemedText>

        <ThemedText type="smallBold" themeColor="accent" style={styles.price}>
          {formatCurrency(product.price)}
        </ThemedText>

        <PrimaryButton
          label="Agregar"
          variant="neutral"
          style={styles.addButton}
          onPress={(e) => {
            e.stopPropagation();
            addItem(product, 1);
          }}
        />
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { minWidth: 0 },
  pressed: { opacity: 0.85 },
  inner: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.one },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: Spacing.one,
  },
  image: { width: '100%', height: '100%' },
  description: { minHeight: 34 },
  price: { marginTop: Spacing.one },
  addButton: { paddingVertical: Spacing.two, marginTop: Spacing.one },
});
