// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar «router, useLocalSearchParams» desde «expo-router».
import { router, useLocalSearchParams } from 'expo-router';
// Esta línea sirve para importar «Image» desde «expo-image».
import { Image } from 'expo-image';
// Esta línea sirve para importar «Pressable, ScrollView, StyleSheet, View» desde «react-native».
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «ShoppingBag, ShoppingCart» desde «lucide-react-native».
import { ShoppingBag, ShoppingCart } from 'lucide-react-native';
// Esta línea sirve para importar «formatCurrency» desde «@sanken/core».
import { formatCurrency } from '@sanken/core';

// Esta línea sirve para importar «CATEGORY_LABELS» desde «@/components/store/category-chips».
import { CATEGORY_LABELS } from '@/components/store/category-chips';
// Esta línea sirve para importar «isNewProduct» desde «@/components/store/product-card».
import { isNewProduct } from '@/components/store/product-card';
// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «BackButton» desde «@/components/ui/back-button».
import { BackButton } from '@/components/ui/back-button';
// Esta línea sirve para importar «ErrorState» desde «@/components/ui/error-state».
import { ErrorState } from '@/components/ui/error-state';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';
// Esta línea sirve para importar «Stepper» desde «@/components/ui/stepper».
import { Stepper } from '@/components/ui/stepper';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «useCartStore» desde «@/store/cart-store».
import { useCartStore } from '@/store/cart-store';
// Esta línea sirve para importar «useProductStore» desde «@/store/product-store».
import { useProductStore } from '@/store/product-store';
// Esta línea sirve para importar «useToastStore» desde «@/store/toast-store».
import { useToastStore } from '@/store/toast-store';

// Esta línea sirve para declarar la función «ProductDetailScreen».
export default function ProductDetailScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para extraer «productId» de «useLocalSearchParams<{ productId: string».
  const { productId } = useLocalSearchParams<{ productId: string }>();
  // Esta línea sirve para extraer «» de «Number(productId)».
  const id = Number(productId);

  // Esta línea sirve para obtener «currentProduct, isLoadingProduct, productError, loadProduct» con el hook «useProductStore».
  const { currentProduct, isLoadingProduct, productError, loadProduct } = useProductStore();
  // Esta línea sirve para obtener «addItem» con el hook «useCartStore».
  const addItem = useCartStore((s) => s.addItem);
  // Esta línea sirve para obtener «itemCount» con el hook «useCartStore».
  const itemCount = useCartStore((s) => s.getItemCount());
  // Esta línea sirve para crear el estado «quantity» y su función «setQuantity».
  const [quantity, setQuantity] = useState(1);
  // Esta línea sirve para crear el estado «failedImageUrl» y su función «setFailedImageUrl».
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «loadProduct» si «id».
    if (id) loadProduct(id);
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «id, loadProduct».
  }, [id, loadProduct]);

  // Antes esta pantalla se quedaba en el skeleton para siempre si la carga
  // fallaba: la condición solo miraba `!currentProduct`, nunca `productError`
  // — sin conexión, el usuario veía un loader infinito sin ninguna salida.
  // Esta línea sirve para revisar si «productError».
  if (productError) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el componente «ThemedView».
      <ThemedView style={styles.root}>
        {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
        <SafeAreaView style={styles.safeArea}>
          {/* Esta línea sirve para mostrar el componente «ErrorState». */}
          <ErrorState message={productError} onRetry={() => loadProduct(id)} />
        </SafeAreaView>
      </ThemedView>
    );
  }

  // Esta línea sirve para revisar si «isLoadingProduct || !currentProduct».
  if (isLoadingProduct || !currentProduct) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el componente «ThemedView».
      <ThemedView style={styles.root}>
        {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
        <SafeAreaView style={styles.safeArea}>
          {/* Esta línea sirve para abrir el componente «Skeleton». */}
          <Skeleton height={240} borderRadius={Spacing.four} />
        </SafeAreaView>
      </ThemedView>
    );
  }

  // Esta línea sirve para extraer «roduc» de «currentProduct».
  const product = currentProduct;
  // Esta línea sirve para extraer «mageUr» de «api.mediaUrl(product.image, 'productDeta».
  const imageUrl = api.mediaUrl(product.image, 'productDetail');

  // Esta línea sirve para extraer «andleAd» de «() => {».
  const handleAdd = () => {
    // Esta línea sirve para llamar a «addItem» con «product, quantity».
    addItem(product, quantity);
    // Esta línea sirve para mostrar el aviso de producto agregado.
    useToastStore.getState().show(`✓ ${product.name} agregado`, 'success');
    // Vuelve a 1 para que agregar de nuevo no arrastre sin querer la
    // cantidad anterior — el usuario sigue viendo este mismo producto.
    // Esta línea sirve para guardar en el estado con «setQuantity» el valor «1)…».
    setQuantity(1);
  };

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «View». */}
        <View style={styles.topBar}>
          {/* Esta línea sirve para abrir el componente «BackButton». */}
          <BackButton label="Tienda" fallbackHref="/store" />
          {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
          <Pressable
            // Esta línea sirve para asignar el manejador del evento «onPress».
            onPress={() => router.push('/store/cart')}
            // Esta línea sirve para definir el atributo «accessibilityLabel» con el valor «Ver carrito».
            accessibilityLabel="Ver carrito"
            // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.cartButton, { backgroundColor: theme.».
            style={[styles.cartButton, { backgroundColor: theme.backgroundElement }]}>
            {/* Esta línea sirve para abrir el componente «ShoppingCart». */}
            <ShoppingCart size={20} color={theme.text} />
            {/* Esta línea sirve para mostrar el bloque solo si «itemCount > 0». */}
            {itemCount > 0 && (
              // Esta línea sirve para abrir el componente «ThemedView».
              <ThemedView style={[styles.cartBadge, { backgroundColor: theme.accent }]}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" style={styles.cartBadgeText}>
                  {/* Esta línea sirve para mostrar el contador de productos con tope en 9+. */}
                  {itemCount > 9 ? '9+' : itemCount}
                </ThemedText>
              </ThemedView>
            )}
          </Pressable>
        </View>

        {/* Esta línea sirve para abrir el componente «ScrollView». */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Esta línea sirve para abrir el componente «View». */}
          <View style={[styles.imageWrap, { backgroundColor: theme.backgroundElement }]}>
            {/* Esta línea sirve para elegir entre dos bloques según «imageUrl && imageUrl !== failedImageUrl». */}
            {imageUrl && imageUrl !== failedImageUrl ? (
              // Esta línea sirve para abrir el elemento «Image» con sus atributos en varias líneas.
              <Image
                // Esta línea sirve para pasar la propiedad «source» con el valor «{ uri: imageUrl }}».
                source={{ uri: imageUrl }}
                // Esta línea sirve para pasar la propiedad «style» con el valor «styles.image}».
                style={styles.image}
                // Esta línea sirve para definir el atributo «contentFit» con el valor «contain».
                contentFit="contain"
                // Esta línea sirve para pasar la propiedad «transition» con el valor «150}».
                transition={150}
                // Esta línea sirve para asignar el manejador del evento «onError».
                onError={() => setFailedImageUrl(imageUrl)}
              />
            // Esta línea sirve para mostrar el bloque alternativo.
            ) : (
              // Esta línea sirve para abrir el componente «ShoppingBag».
              <ShoppingBag size={40} color={theme.textSecondary} />
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
          <ThemedText type="small" themeColor="accent" style={styles.category}>
            {/* Esta línea sirve para mostrar el contenido dinámico «{CATEGORY_LABELS[product.category]}». */}
            {CATEGORY_LABELS[product.category]}
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="title" style={styles.name}>
            {/* Esta línea sirve para mostrar el valor «product.name». */}
            {product.name}
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="subtitle" themeColor="accent" style={styles.price}>
            {/* Esta línea sirve para mostrar el contenido dinámico «{formatCurrency(product.price)}». */}
            {formatCurrency(product.price)}
          </ThemedText>

          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="default" themeColor="textSecondary" style={styles.description}>
            {/* Esta línea sirve para mostrar el valor «product.description». */}
            {product.description}
          </ThemedText>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={styles.quantityRow}>
            {/* Esta línea sirve para mostrar el texto «Cantidad» dentro de «ThemedText». */}
            <ThemedText type="smallBold">Cantidad</ThemedText>
            {/* Esta línea sirve para abrir el componente «View». */}
            <View style={styles.stepperWrap}>
              {/* Esta línea sirve para abrir el componente «Stepper». */}
              <Stepper value={quantity} min={1} max={50} onChange={setQuantity} />
            </View>
          </ThemedView>
        </ScrollView>

        {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
        <PrimaryButton label="Agregar al carrito" onPress={handleAdd} />
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
    // Esta línea sirve para declarar la propiedad «paddingTop» con el valor o tipo «Spacing.two».
    paddingTop: Spacing.two,
    // Esta línea sirve para declarar la propiedad «paddingBottom» con el valor o tipo «BottomTabInset».
    paddingBottom: BottomTabInset,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «topBar» con el valor o tipo «{».
  topBar: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
  },
  // Esta línea sirve para declarar la propiedad «cartButton» con el valor o tipo «{».
  cartButton: {
    // 44x44: mismo mínimo táctil que el botón de carrito de la Tienda
    // (store/index.tsx) — no achicarlo solo porque comparte fila con el
    // link de volver.
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «44».
    width: 44,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «44».
    height: 44,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
  // Esta línea sirve para declarar la propiedad «cartBadge» con el valor o tipo «{».
  cartBadge: {
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
  // Esta línea sirve para definir el estilo «cartBadgeText» con «color: '#050505', fontWeight: '700', fontSize: 10 …».
  cartBadgeText: { color: '#050505', fontWeight: '700', fontSize: 10 },
  // Esta línea sirve para definir el estilo «scrollContent» con «gap: Spacing.two, paddingBottom: Spacing.four },…».
  scrollContent: { gap: Spacing.two, paddingBottom: Spacing.four },
  // 4:3 + contain (antes 1:1 + cover): la foto entra completa sin recortar
  // y el detalle gana altura para nombre, precio y descripción.
  // Esta línea sirve para declarar la propiedad «imageWrap» con el valor o tipo «{».
  imageWrap: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
    // Esta línea sirve para declarar la propiedad «aspectRatio» con el valor o tipo «4 / 3».
    aspectRatio: 4 / 3,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
    // Esta línea sirve para declarar la propiedad «overflow» con el valor o tipo «'hidden'».
    overflow: 'hidden',
    // Esta línea sirve para declarar la propiedad «marginBottom» con el valor o tipo «Spacing.two».
    marginBottom: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «image» con el valor o tipo «{ width: '100%', height: '100%' }».
  image: { width: '100%', height: '100%' },
  // Esta línea sirve para declarar la propiedad «newBadge» con el valor o tipo «{».
  newBadge: {
    // Esta línea sirve para declarar la propiedad «position» con el valor o tipo «'absolute'».
    position: 'absolute',
    // Esta línea sirve para declarar la propiedad «top» con el valor o tipo «Spacing.two».
    top: Spacing.two,
    // Esta línea sirve para declarar la propiedad «left» con el valor o tipo «Spacing.two».
    left: Spacing.two,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.two».
    borderRadius: Spacing.two,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.two».
    paddingHorizontal: Spacing.two,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «3».
    paddingVertical: 3,
  },
  // Esta línea sirve para definir el estilo «newBadgeText» con «color: '#050505', fontWeight: '700', fontSize: 11 …».
  newBadgeText: { color: '#050505', fontWeight: '700', fontSize: 11 },
  // Esta línea sirve para definir el estilo «category» con «textTransform: 'uppercase', letterSpacing: 0.5 },…».
  category: { textTransform: 'uppercase', letterSpacing: 0.5 },
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «{ fontSize: 22, lineHeight: 28 }».
  name: { fontSize: 22, lineHeight: 28 },
  // Esta línea sirve para declarar la propiedad «price» con el valor o tipo «{ fontSize: 20, lineHeight: 26 }».
  price: { fontSize: 20, lineHeight: 26 },
  // Esta línea sirve para declarar la propiedad «description» con el valor o tipo «{ marginTop: Spacing.two }».
  description: { marginTop: Spacing.two },
  // Esta línea sirve para declarar la propiedad «quantityRow» con el valor o tipo «{».
  quantityRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «marginTop» con el valor o tipo «Spacing.three».
    marginTop: Spacing.three,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «stepperWrap» con el valor o tipo «{ width: 160 }».
  stepperWrap: { width: 160 },
});
