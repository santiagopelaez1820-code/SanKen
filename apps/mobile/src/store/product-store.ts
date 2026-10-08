// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para importar los tipos «Product, ProductCategory» desde «@sanken/core».
import type { Product, ProductCategory } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «useToastStore» desde «@/store/toast-store».
import { useToastStore } from '@/store/toast-store';

// Esta línea sirve para declarar la interfaz «ProductStoreState».
interface ProductStoreState {
  // Esta línea sirve para declarar la propiedad «products» con el valor o tipo «Product[]».
  products: Product[];
  // Esta línea sirve para declarar la propiedad «isLoadingProducts» con el valor o tipo «boolean».
  isLoadingProducts: boolean;
  // Esta línea sirve para declarar la propiedad «productsError» con el valor o tipo «string | null».
  productsError: string | null;
  // Esta línea sirve para declarar la propiedad «loadProducts» con el valor o tipo «(category?: ProductCategory) => Promise<void>».
  loadProducts: (category?: ProductCategory) => Promise<void>;

  // Esta línea sirve para declarar la propiedad «currentProduct» con el valor o tipo «Product | null».
  currentProduct: Product | null;
  // Esta línea sirve para declarar la propiedad «isLoadingProduct» con el valor o tipo «boolean».
  isLoadingProduct: boolean;
  // Esta línea sirve para declarar la propiedad «productError» con el valor o tipo «string | null».
  productError: string | null;
  // Esta línea sirve para declarar la propiedad «loadProduct» con el valor o tipo «(id: number) => Promise<void>».
  loadProduct: (id: number) => Promise<void>;
}

// Esta línea sirve para declarar «useProductStore» con el valor «create<ProductStoreState>((set, get) => ({».
export const useProductStore = create<ProductStoreState>((set, get) => ({
  // Esta línea sirve para declarar la propiedad «products» con el valor o tipo «[]».
  products: [],
  // Esta línea sirve para declarar la propiedad «isLoadingProducts» con el valor o tipo «false».
  isLoadingProducts: false,
  // Esta línea sirve para declarar la propiedad «productsError» con el valor o tipo «null».
  productsError: null,
  // Esta línea sirve para declarar la propiedad «loadProducts» con el valor o tipo «async (category) => {».
  loadProducts: async (category) => {
    // Esta línea sirve para extraer «adProduct» de «get().products.length > 0».
    const hadProducts = get().products.length > 0;
    // Esta línea sirve para guardar en el store: «isLoadingProducts: true, productsError: null })…».
    set({ isLoadingProducts: true, productsError: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para extraer «uer» de «category ? `?category=${category}` : ''».
      const query = category ? `?category=${category}` : '';
      // Esta línea sirve para esperar «api.get<Product[]>(`/products${query}`)» y guardar el resultado en «products».
      const products = await api.get<Product[]>(`/products${query}`);
      // Esta línea sirve para guardar en el store: «products, isLoadingProducts: false })…».
      set({ products, isLoadingProducts: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para extraer «essag» de «err instanceof Error ? err.message : 'No».
      const message = err instanceof Error ? err.message : 'No se pudieron cargar los productos.';
      // Igual que workout-history-store: si ya había productos cargados, la
      // pantalla de Store solo muestra el ErrorState cuando la lista está
      // vacía — sin este toast, una recarga fallida (cambiar de categoría y
      // volver, por ejemplo) queda sin ningún aviso, con la lista vieja
      // pareciendo actualizada.
      // Esta línea sirve para revisar si «hadProducts».
      if (hadProducts) {
        // Esta línea sirve para llamar a «useToastStore.getState» con «).show(message».
        useToastStore.getState().show(message);
      }
      // Esta línea sirve para guardar en el store: «isLoadingProducts: false, productsError: message })…».
      set({ isLoadingProducts: false, productsError: message });
    }
  },

  // Esta línea sirve para declarar la propiedad «currentProduct» con el valor o tipo «null».
  currentProduct: null,
  // Esta línea sirve para declarar la propiedad «isLoadingProduct» con el valor o tipo «false».
  isLoadingProduct: false,
  // Esta línea sirve para declarar la propiedad «productError» con el valor o tipo «null».
  productError: null,
  // Esta línea sirve para declarar la propiedad «loadProduct» con el valor o tipo «async (id) => {».
  loadProduct: async (id) => {
    // currentProduct se limpia acá: la pantalla de detalle usa
    // `!currentProduct` como guard del skeleton, así que si no se limpia,
    // navegar de un producto a otro y que el fetch nuevo falle deja visible
    // el producto VIEJO bajo la ruta del nuevo, sin ningún aviso de error
    // (mismo bug que tenía pedidos/[orderId].tsx antes de este fix).
    // Esta línea sirve para guardar en el store: «isLoadingProduct: true, productError: null, currentProduct: …».
    set({ isLoadingProduct: true, productError: null, currentProduct: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<Product>(`/products/${id}`)» y guardar el resultado en «product».
      const product = await api.get<Product>(`/products/${id}`);
      // Esta línea sirve para guardar en el store: «currentProduct: product, isLoadingProduct: false })…».
      set({ currentProduct: product, isLoadingProduct: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «isLoadingProduct» con el valor o tipo «false».
        isLoadingProduct: false,
        // Esta línea sirve para definir «productError» con «err instanceof Error ? err.message : 'No…».
        productError: err instanceof Error ? err.message : 'No se pudo cargar el producto.',
      });
    }
  },
}));
