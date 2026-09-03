import { create } from 'zustand';
import type { Product, ProductCategory } from '@sanken/core';

import { api } from '@/lib/api';

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

export const useProductStore = create<ProductStoreState>((set) => ({
  products: [],
  isLoadingProducts: false,
  productsError: null,
  loadProducts: async (category) => {
    set({ isLoadingProducts: true, productsError: null });
    try {
      const query = category ? `?category=${category}` : '';
      const products = await api.get<Product[]>(`/products${query}`);
      set({ products, isLoadingProducts: false });
    } catch (err) {
      set({
        isLoadingProducts: false,
        productsError: err instanceof Error ? err.message : 'No se pudieron cargar los productos.',
      });
    }
  },

  currentProduct: null,
  isLoadingProduct: false,
  productError: null,
  loadProduct: async (id) => {
    set({ isLoadingProduct: true, productError: null });
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
