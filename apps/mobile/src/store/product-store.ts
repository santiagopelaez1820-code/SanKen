import { create } from 'zustand';
import type { Product, ProductCategory } from '@sanken/core';

import { api } from '@/lib/api';
import { useToastStore } from '@/store/toast-store';

interface ProductStoreState {
  products: Product[];
  isLoadingProducts: boolean;
  productsError: string | null;
  loadProducts: (category?: ProductCategory) => Promise<void>;

  currentProduct: Product | null;
  isLoadingProduct: boolean;
  productError: string | null;
  loadProduct: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductStoreState>((set, get) => ({
  products: [],
  isLoadingProducts: false,
  productsError: null,
  loadProducts: async (category) => {
    const hadProducts = get().products.length > 0;
    set({ isLoadingProducts: true, productsError: null });
    try {
      const query = category ? `?category=${category}` : '';
      const products = await api.get<Product[]>(`/products${query}`);
      set({ products, isLoadingProducts: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudieron cargar los productos.';
      // Igual que workout-history-store: si ya había productos cargados, la
      // pantalla de Store solo muestra el ErrorState cuando la lista está
      // vacía — sin este toast, una recarga fallida (cambiar de categoría y
      // volver, por ejemplo) queda sin ningún aviso, con la lista vieja
      // pareciendo actualizada.
      if (hadProducts) {
        useToastStore.getState().show(message);
      }
      set({ isLoadingProducts: false, productsError: message });
    }
  },

  currentProduct: null,
  isLoadingProduct: false,
  productError: null,
  loadProduct: async (id) => {
    // currentProduct se limpia acá: la pantalla de detalle usa
    // `!currentProduct` como guard del skeleton, así que si no se limpia,
    // navegar de un producto a otro y que el fetch nuevo falle deja visible
    // el producto VIEJO bajo la ruta del nuevo, sin ningún aviso de error
    // (mismo bug que tenía pedidos/[orderId].tsx antes de este fix).
    set({ isLoadingProduct: true, productError: null, currentProduct: null });
    try {
      const product = await api.get<Product>(`/products/${id}`);
      set({ currentProduct: product, isLoadingProduct: false });
    } catch (err) {
      set({
        isLoadingProduct: false,
        productError: err instanceof Error ? err.message : 'No se pudo cargar el producto.',
      });
    }
  },
}));
