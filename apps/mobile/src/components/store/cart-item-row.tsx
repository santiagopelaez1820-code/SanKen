import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { X } from 'lucide-react-native';
import { formatCurrency } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Stepper } from '@/components/ui/stepper';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import type { CartItem } from '@/store/cart-store';

interface CartItemRowProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export function CartItemRow({ item, onIncrement, onDecrement, onRemove }: CartItemRowProps) {
  const theme = useTheme();
  const imageUrl = api.mediaUrl(item.product.image);
  const lineSubtotal = Number(item.product.price) * item.quantity;

  return (
    <ThemedView type="backgroundElement" style={styles.row}>
      <View style={[styles.imageWrap, { backgroundColor: theme.backgroundSelected }]}>
        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" />}
      </View>

      <ThemedView style={styles.info}>
        <ThemedText type="smallBold" numberOfLines={2}>
          {item.product.name}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {formatCurrency(item.product.price)} c/u
        </ThemedText>
        <ThemedText type="smallBold" themeColor="accent">
          {formatCurrency(lineSubtotal)}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.actions}>
        <Pressable onPress={onRemove} hitSlop={8}>
          <X size={16} color={theme.textSecondary} />
        </Pressable>
        <View style={styles.stepperWrap}>
          <Stepper
            value={item.quantity}
            min={0}
            max={50}
            onChange={(next) => (next > item.quantity ? onIncrement() : onDecrement())}
          />
        </View>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.three, borderRadius: Spacing.three, padding: Spacing.three, alignItems: 'center' },
  imageWrap: { width: 64, height: 64, borderRadius: Spacing.two, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  info: { flex: 1, minWidth: 0, gap: 2, backgroundColor: 'transparent' },
  actions: { alignItems: 'flex-end', gap: Spacing.one, backgroundColor: 'transparent' },
  stepperWrap: { width: 120 },
});
