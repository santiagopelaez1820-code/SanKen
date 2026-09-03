import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const KEY = 'sanken_cart_items';

export interface StoredCartItem {
  productId: number;
  quantity: number;
}

/**
 * Persiste solo {productId, quantity} — nunca el precio ni el resto del
 * producto, para no arrastrar un dato desactualizado. cart-store.hydrate()
 * relee los productos reales del servidor y descarta en silencio los que
 * ya no existan o estén inactivos (mismo criterio "el servidor es la
 * fuente de verdad" que active-session-storage.ts).
 */
export const cartStorage = {
  async get(): Promise<StoredCartItem[]> {
    const raw =
      Platform.OS === 'web'
        ? (typeof localStorage !== 'undefined' ? localStorage.getItem(KEY) : null)
        : await SecureStore.getItemAsync(KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as StoredCartItem[];
    } catch {
      return [];
    }
  },

  async set(items: StoredCartItem[]): Promise<void> {
    const raw = JSON.stringify(items);
    if (Platform.OS === 'web') {
      localStorage?.setItem(KEY, raw);
      return;
    }
    await SecureStore.setItemAsync(KEY, raw);
  },

  async clear(): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage?.removeItem(KEY);
      return;
    }
    await SecureStore.deleteItemAsync(KEY);
  },
};
