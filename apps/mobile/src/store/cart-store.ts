import { create } from 'zustand';
import type { CreateOrderPayload, Order, Product } from '@sanken/core';

import { api } from '@/lib/api';
import { cartStorage } from '@/lib/cart-storage';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStoreState {
  items: CartItem[];
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  addItem: (product: Product, quantity?: number) => void;
  incrementItem: (productId: number) => void;
  decrementItem: (productId: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;

  isSubmittingOrder: boolean;
  orderError: string | null;
  submitOrder: (payload: Omit<CreateOrderPayload, 'items'>) => Promise<Order | null>;
}

function persist(items: CartItem[]) {
  return cartStorage.set(items.map((i) => ({ productId: i.product.id, quantity: i.quantity })));
}

export const useCartStore = create<CartStoreState>((set, get) => ({
  items: [],
  isHydrated: false,

  /**
   * Relee del servidor los productos guardados localmente — nunca confía
   * en el precio persistido (podría estar desactualizado). Descarta en
   * silencio los productos que ya no existan o estén inactivos.
   */
  hydrate: async () => {
    const stored = await cartStorage.get();
    if (stored.length === 0) {
      set({ isHydrated: true });
      return;
    }
    try {
      const products = await api.get<Product[]>('/products');
      const byId = new Map(products.map((p) => [p.id, p]));
      const items = stored
        .map((entry) => {
          const product = byId.get(entry.productId);
          return product ? { product, quantity: entry.quantity } : null;
        })
        .filter((item): item is CartItem => item !== null);
      set({ items, isHydrated: true });
      await persist(items);
    } catch {
      set({ isHydrated: true });
    }
  },

  addItem: (product, quantity = 1) => {
    const items = get().items;
    const existing = items.find((i) => i.product.id === product.id);
    const next = existing
      ? items.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i))
      : [...items, { product, quantity }];
    set({ items: next });
    persist(next);
  },

  incrementItem: (productId) => {
    const next = get().items.map((i) => (i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i));
    set({ items: next });
    persist(next);
  },

  decrementItem: (productId) => {
    const next = get()
      .items.map((i) => (i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i))
      .filter((i) => i.quantity > 0);
    set({ items: next });
    persist(next);
  },

  removeItem: (productId) => {
    const next = get().items.filter((i) => i.product.id !== productId);
    set({ items: next });
    persist(next);
  },

  clear: () => {
    set({ items: [] });
    cartStorage.clear();
  },

  getSubtotal: () => get().items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0),
  getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  isSubmittingOrder: false,
  orderError: null,
  submitOrder: async (payload) => {
    set({ isSubmittingOrder: true, orderError: null });
    try {
      const items = get().items.map((i) => ({ product_id: i.product.id, quantity: i.quantity }));
      const order = await api.post<Order>('/orders', { ...payload, items });
      set({ isSubmittingOrder: false });
      get().clear();
      return order;
    } catch (err) {
      set({
        isSubmittingOrder: false,
        orderError: err instanceof Error ? err.message : 'No se pudo realizar el pedido.',
      });
      return null;
    }
  },
}));
