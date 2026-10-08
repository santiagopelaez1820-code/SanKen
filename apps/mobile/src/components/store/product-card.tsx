// Esta línea sirve para importar «useState» desde «react».
import { useState } from 'react';
// Esta línea sirve para importar «Image» desde «expo-image».
import { Image } from 'expo-image';
// Esta línea sirve para importar «Pressable, StyleSheet, View» desde «react-native».
import { Pressable, StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «ShoppingBag» desde «lucide-react-native».
import { ShoppingBag } from 'lucide-react-native';
// Esta línea sirve para importar «formatCurrency, type Product» desde «@sanken/core».
import { formatCurrency, type Product } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «useCartStore» desde «@/store/cart-store».
import { useCartStore } from '@/store/cart-store';
// Esta línea sirve para importar «useToastStore» desde «@/store/toast-store».
import { useToastStore } from '@/store/toast-store';

// Esta línea sirve para declarar «NEW_PRODUCT_WINDOW_DAYS» con el valor «14».
const NEW_PRODUCT_WINDOW_DAYS = 14;

/** "Nuevo" solo mientras el producto sea reciente de verdad — se deriva de `created_at`, nunca de un flag manual. */
// Esta línea sirve para declarar la función «isNewProduct».
export function isNewProduct(createdAt: string): boolean {
  // Esta línea sirve para extraer «geM» de «Date.now() - new Date(createdAt).getTime».
  const ageMs = Date.now() - new Date(createdAt).getTime();
  // Esta línea sirve para devolver si el producto es reciente según su antigüedad.
  return ageMs >= 0 && ageMs <= NEW_PRODUCT_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}

// Esta línea sirve para declarar la interfaz «ProductCardProps».
interface ProductCardProps {
  // Esta línea sirve para declarar la propiedad «product» con el valor o tipo «Product».
  product: Product;
  // Esta línea sirve para declarar la propiedad «onPress» con el valor o tipo «() => void».
  onPress: () => void;
}

// Esta línea sirve para declarar la función «ProductCard».
export function ProductCard({ product, onPress }: ProductCardProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «addItem» con el hook «useCartStore».
  const addItem = useCartStore((s) => s.addItem);
  // Esta línea sirve para extraer «mageUr» de «api.mediaUrl(product.image, 'productCard».
  const imageUrl = api.mediaUrl(product.image, 'productCard');
  // Imagen que no carga (sin conexión, borrada, CDN caído) → mismo ícono que
  // un producto sin imagen, nunca un recuadro roto.
  // Esta línea sirve para crear el estado «failedUrl» y su función «setFailedUrl».
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Pressable» con sus propiedades.
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView type="backgroundElement" style={styles.inner}>
        {/* Esta línea sirve para abrir el componente «View». */}
        <View style={[styles.imageWrap, { backgroundColor: theme.backgroundSelected }]}>
          {/* Esta línea sirve para elegir entre dos bloques según «imageUrl && imageUrl !== failedUrl». */}
          {imageUrl && imageUrl !== failedUrl ? (
            // Esta línea sirve para abrir el elemento «Image» con sus atributos en varias líneas.
            <Image
              // Esta línea sirve para pasar la propiedad «source» con el valor «{ uri: imageUrl }}».
              source={{ uri: imageUrl }}
              // Esta línea sirve para pasar la propiedad «style» con el valor «styles.image}».
              style={styles.image}
              // Esta línea sirve para definir el atributo «contentFit» con el valor «cover».
              contentFit="cover"
              // Esta línea sirve para pasar la propiedad «transition» con el valor «150}».
              transition={150}
              // Esta línea sirve para asignar el manejador del evento «onError».
              onError={() => setFailedUrl(imageUrl)}
            />
          // Esta línea sirve para mostrar el bloque alternativo.
          ) : (
            // Esta línea sirve para abrir el componente «ShoppingBag».
            <ShoppingBag size={24} color={theme.textSecondary} />
          )}
          {/* Esta línea sirve para mostrar el bloque solo si «isNewProduct(product.created_at)». */}
          {isNewProduct(product.created_at) && (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView style={[styles.newBadge, { backgroundColor: theme.accent }]}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" style={styles.newBadgeText}>
                {/* Esta línea sirve para mostrar el contenido dinámico «🆕 Nuevo». */}
                🆕 Nuevo
              </ThemedText>
            </ThemedView>
          )}
        </View>

        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="smallBold" numberOfLines={1}>
          {/* Esta línea sirve para mostrar el valor «product.name». */}
          {product.name}
        </ThemedText>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={2} style={styles.description}>
          {/* Esta línea sirve para mostrar el valor «product.short_description». */}
          {product.short_description}
        </ThemedText>

        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="smallBold" themeColor="accent" style={styles.price}>
          {/* Esta línea sirve para mostrar el contenido dinámico «{formatCurrency(product.price)}». */}
          {formatCurrency(product.price)}
        </ThemedText>

        {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
        <PrimaryButton
          // Esta línea sirve para definir el atributo «label» con el valor «Agregar».
          label="Agregar"
          // Esta línea sirve para definir el atributo «variant» con el valor «neutral».
          variant="neutral"
          // Esta línea sirve para pasar la propiedad «style» con el valor «styles.addButton}».
          style={styles.addButton}
          // Esta línea sirve para asignar el manejador del evento «onPress».
          onPress={(e) => {
            // Esta línea sirve para llamar a «e.stopPropagation».
            e.stopPropagation();
            // Esta línea sirve para llamar a «addItem» con «product, 1».
            addItem(product, 1);
            // Esta línea sirve para mostrar el aviso de producto agregado.
            useToastStore.getState().show(`✓ ${product.name} agregado`, 'success');
          }}
        />
      </ThemedView>
    </Pressable>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «card» con el valor o tipo «{ minWidth: 0 }».
  card: { minWidth: 0 },
  // Esta línea sirve para declarar la propiedad «pressed» con el valor o tipo «{ opacity: 0.85 }».
  pressed: { opacity: 0.85 },
  // Esta línea sirve para definir el estilo «inner» con «borderRadius: Spacing.three, padding: Spacing.two …».
  inner: { borderRadius: Spacing.three, padding: Spacing.two + 2, gap: Spacing.half },
  // Esta línea sirve para declarar la propiedad «imageWrap» con el valor o tipo «{».
  imageWrap: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
    // Esta línea sirve para declarar la propiedad «aspectRatio» con el valor o tipo «1».
    aspectRatio: 1,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.two + 2».
    borderRadius: Spacing.two + 2,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
    // Esta línea sirve para declarar la propiedad «overflow» con el valor o tipo «'hidden'».
    overflow: 'hidden',
    // Esta línea sirve para declarar la propiedad «marginBottom» con el valor o tipo «Spacing.one».
    marginBottom: Spacing.one,
  },
  // Esta línea sirve para declarar la propiedad «image» con el valor o tipo «{ width: '100%', height: '100%' }».
  image: { width: '100%', height: '100%' },
  // Esta línea sirve para declarar la propiedad «newBadge» con el valor o tipo «{».
  newBadge: {
    // Esta línea sirve para declarar la propiedad «position» con el valor o tipo «'absolute'».
    position: 'absolute',
    // Esta línea sirve para declarar la propiedad «top» con el valor o tipo «Spacing.one».
    top: Spacing.one,
    // Esta línea sirve para declarar la propiedad «left» con el valor o tipo «Spacing.one».
    left: Spacing.one,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.two».
    borderRadius: Spacing.two,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.one».
    paddingHorizontal: Spacing.one,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «2».
    paddingVertical: 2,
  },
  // Esta línea sirve para definir el estilo «newBadgeText» con «color: '#050505', fontWeight: '700', fontSize: 10 …».
  newBadgeText: { color: '#050505', fontWeight: '700', fontSize: 10 },
  // Esta línea sirve para definir el estilo «description» con «minHeight: 36, fontSize: 12, lineHeight: 18 },…».
  description: { minHeight: 36, fontSize: 12, lineHeight: 18 },
  // Esta línea sirve para declarar la propiedad «price» con el valor o tipo «{ marginTop: Spacing.one }».
  price: { marginTop: Spacing.one },
  // Esta línea sirve para definir el estilo «addButton» con «paddingVertical: Spacing.two, minHeight: 36, margi…».
  addButton: { paddingVertical: Spacing.two, minHeight: 36, marginTop: Spacing.one },
});
