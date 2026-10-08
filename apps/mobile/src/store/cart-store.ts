// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para importar los tipos «CreateOrderPayload, Order, Product» desde «@sanken/core».
import type { CreateOrderPayload, Order, Product } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «cartStorage» desde «@/lib/cart-storage».
import { cartStorage } from '@/lib/cart-storage';

// Esta línea sirve para declarar la interfaz «CartItem».
export interface CartItem {
  // Esta línea sirve para declarar la propiedad «product» con el valor o tipo «Product».
  product: Product;
  // Esta línea sirve para declarar la propiedad «quantity» con el valor o tipo «number».
  quantity: number;
}

// Esta línea sirve para declarar la interfaz «CartStoreState».
interface CartStoreState {
  // Esta línea sirve para declarar la propiedad «items» con el valor o tipo «CartItem[]».
  items: CartItem[];
  // Esta línea sirve para declarar la propiedad «isHydrated» con el valor o tipo «boolean».
  isHydrated: boolean;
  // Esta línea sirve para declarar la propiedad «hydrate» con el valor o tipo «() => Promise<void>».
  hydrate: () => Promise<void>;
  // Esta línea sirve para declarar la propiedad «addItem» con el valor o tipo «(product: Product, quantity?: number) => void».
  addItem: (product: Product, quantity?: number) => void;
  // Esta línea sirve para declarar la propiedad «incrementItem» con el valor o tipo «(productId: number) => void».
  incrementItem: (productId: number) => void;
  // Esta línea sirve para declarar la propiedad «decrementItem» con el valor o tipo «(productId: number) => void».
  decrementItem: (productId: number) => void;
  // Esta línea sirve para declarar la propiedad «removeItem» con el valor o tipo «(productId: number) => void».
  removeItem: (productId: number) => void;
  // Esta línea sirve para declarar la propiedad «clear» con el valor o tipo «() => void».
  clear: () => void;
  // Esta línea sirve para declarar la propiedad «getSubtotal» con el valor o tipo «() => number».
  getSubtotal: () => number;
  // Esta línea sirve para declarar la propiedad «getItemCount» con el valor o tipo «() => number».
  getItemCount: () => number;

  // Esta línea sirve para declarar la propiedad «isSubmittingOrder» con el valor o tipo «boolean».
  isSubmittingOrder: boolean;
  // Esta línea sirve para declarar la propiedad «orderError» con el valor o tipo «string | null».
  orderError: string | null;
  // Esta línea sirve para definir «submitOrder» con «(payload: Omit<CreateOrderPayload, 'item…».
  submitOrder: (payload: Omit<CreateOrderPayload, 'items'>) => Promise<Order | null>;
}

// Esta línea sirve para declarar la función «persist».
function persist(items: CartItem[]) {
  // Esta línea sirve para guardar en el almacenamiento solo el id y la cantidad de cada producto.
  return cartStorage.set(items.map((i) => ({ productId: i.product.id, quantity: i.quantity })));
}

// Esta línea sirve para declarar «useCartStore» con el valor «create<CartStoreState>((set, get) => ({».
export const useCartStore = create<CartStoreState>((set, get) => ({
  // Esta línea sirve para declarar la propiedad «items» con el valor o tipo «[]».
  items: [],
  // Esta línea sirve para declarar la propiedad «isHydrated» con el valor o tipo «false».
  isHydrated: false,

  /**
   * Relee del servidor los productos guardados localmente — nunca confía
   * en el precio persistido (podría estar desactualizado). Descarta en
   * silencio los productos que ya no existan o estén inactivos.
   */
  // Esta línea sirve para declarar la propiedad «hydrate» con el valor o tipo «async () => {».
  hydrate: async () => {
    // Esta línea sirve para esperar «cartStorage.get()» y guardar el resultado en «stored».
    const stored = await cartStorage.get();
    // Esta línea sirve para revisar si «stored.length === 0».
    if (stored.length === 0) {
      // Esta línea sirve para guardar en el store: «isHydrated: true })…».
      set({ isHydrated: true });
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<Product[]>('/products')» y guardar el resultado en «products».
      const products = await api.get<Product[]>('/products');
      // Esta línea sirve para extraer «yI» de «new Map(products.map((p) => [p.id, p]))».
      const byId = new Map(products.map((p) => [p.id, p]));
      // Esta línea sirve para extraer «tem» de «stored».
      const items = stored
        // Esta línea sirve para encadenar la operación «map».
        .map((entry) => {
          // Esta línea sirve para extraer «roduc» de «byId.get(entry.productId)».
          const product = byId.get(entry.productId);
          // Esta línea sirve para devolver el producto con su cantidad o null si ya no existe.
          return product ? { product, quantity: entry.quantity } : null;
        })
        // Esta línea sirve para encadenar la operación «filter».
        .filter((item): item is CartItem => item !== null);
      // Esta línea sirve para guardar en el store: «items, isHydrated: true })…».
      set({ items, isHydrated: true });
      // Esta línea sirve para esperar el resultado de «persist».
      await persist(items);
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // Esta línea sirve para guardar en el store: «isHydrated: true })…».
      set({ isHydrated: true });
    }
  },

  // Esta línea sirve para declarar la propiedad «addItem» con el valor o tipo «(product, quantity = 1) => {».
  addItem: (product, quantity = 1) => {
    // Esta línea sirve para extraer «tem» de «get().items».
    const items = get().items;
    // Esta línea sirve para extraer «xistin» de «items.find((i) => i.product.id === produ».
    const existing = items.find((i) => i.product.id === product.id);
    // Esta línea sirve para extraer «ex» de «existing».
    const next = existing
      // Esta línea sirve para sumar la cantidad si el producto ya está en el carrito.
      ? items.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i))
      // Esta línea sirve para agregar el producto nuevo si no estaba.
      : [...items, { product, quantity }];
    // Esta línea sirve para guardar en el store: «items: next })…».
    set({ items: next });
    // Esta línea sirve para llamar a «persist» con «next».
    persist(next);
  },

  // Esta línea sirve para declarar la propiedad «incrementItem» con el valor o tipo «(productId) => {».
  incrementItem: (productId) => {
    // Esta línea sirve para extraer «ex» de «get().items.map((i) => (i.product.id ===».
    const next = get().items.map((i) => (i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i));
    // Esta línea sirve para guardar en el store: «items: next })…».
    set({ items: next });
    // Esta línea sirve para llamar a «persist» con «next».
    persist(next);
  },

  // Esta línea sirve para declarar la propiedad «decrementItem» con el valor o tipo «(productId) => {».
  decrementItem: (productId) => {
    // Esta línea sirve para extraer «ex» de «get()».
    const next = get()
      // Esta línea sirve para restar uno a la cantidad del producto indicado.
      .items.map((i) => (i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i))
      // Esta línea sirve para encadenar la operación «filter».
      .filter((i) => i.quantity > 0);
    // Esta línea sirve para guardar en el store: «items: next })…».
    set({ items: next });
    // Esta línea sirve para llamar a «persist» con «next».
    persist(next);
  },

  // Esta línea sirve para declarar la propiedad «removeItem» con el valor o tipo «(productId) => {».
  removeItem: (productId) => {
    // Esta línea sirve para extraer «ex» de «get().items.filter((i) => i.product.id !».
    const next = get().items.filter((i) => i.product.id !== productId);
    // Esta línea sirve para guardar en el store: «items: next })…».
    set({ items: next });
    // Esta línea sirve para llamar a «persist» con «next».
    persist(next);
  },

  // Esta línea sirve para declarar la propiedad «clear» con el valor o tipo «() => {».
  clear: () => {
    // Esta línea sirve para guardar en el store: «items: [] })…».
    set({ items: [] });
    // Esta línea sirve para llamar a «cartStorage.clear».
    cartStorage.clear();
  },

  // Esta línea sirve para definir «getSubtotal» con «() => get().items.reduce((sum, i) => sum…».
  getSubtotal: () => get().items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0),
  // Esta línea sirve para definir «getItemCount» con «() => get().items.reduce((sum, i) => sum…».
  getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  // Esta línea sirve para declarar la propiedad «isSubmittingOrder» con el valor o tipo «false».
  isSubmittingOrder: false,
  // Esta línea sirve para declarar la propiedad «orderError» con el valor o tipo «null».
  orderError: null,
  // Esta línea sirve para declarar la propiedad «submitOrder» con el valor o tipo «async (payload) => {».
  submitOrder: async (payload) => {
    // Esta línea sirve para guardar en el store: «isSubmittingOrder: true, orderError: null })…».
    set({ isSubmittingOrder: true, orderError: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para extraer «tem» de «get().items.map((i) => ({ product_id: i.».
      const items = get().items.map((i) => ({ product_id: i.product.id, quantity: i.quantity }));
      // Esta línea sirve para esperar «api.post<Order>('/orders', { ...payload, items })» y guardar el resultado en «order».
      const order = await api.post<Order>('/orders', { ...payload, items });
      // Esta línea sirve para guardar en el store: «isSubmittingOrder: false })…».
      set({ isSubmittingOrder: false });
      // Esta línea sirve para llamar a «get» con «).clear(».
      get().clear();
      // Esta línea sirve para devolver «order».
      return order;
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «isSubmittingOrder» con el valor o tipo «false».
        isSubmittingOrder: false,
        // Esta línea sirve para definir «orderError» con «err instanceof Error ? err.message : 'No…».
        orderError: err instanceof Error ? err.message : 'No se pudo realizar el pedido.',
      });
      // Esta línea sirve para devolver null.
      return null;
    }
  },
}));
