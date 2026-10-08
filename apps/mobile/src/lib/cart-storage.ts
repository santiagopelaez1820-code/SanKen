// Esta línea sirve para importar «Platform» desde «react-native».
import { Platform } from 'react-native';
// Esta línea sirve para importar todo el módulo como «SecureStore» desde «expo-secure-store».
import * as SecureStore from 'expo-secure-store';

// Esta línea sirve para declarar «KEY» con el valor «'sanken_cart_items'».
const KEY = 'sanken_cart_items';

// Esta línea sirve para declarar la interfaz «StoredCartItem».
export interface StoredCartItem {
  // Esta línea sirve para declarar la propiedad «productId» con el valor o tipo «number».
  productId: number;
  // Esta línea sirve para declarar la propiedad «quantity» con el valor o tipo «number».
  quantity: number;
}

/**
 * Persiste solo {productId, quantity} — nunca el precio ni el resto del
 * producto, para no arrastrar un dato desactualizado. cart-store.hydrate()
 * relee los productos reales del servidor y descarta en silencio los que
 * ya no existan o estén inactivos (mismo criterio "el servidor es la
 * fuente de verdad" que active-session-storage.ts).
 */
// Esta línea sirve para declarar «cartStorage» con el valor «{».
export const cartStorage = {
  // Esta línea sirve para declarar el método «get».
  async get(): Promise<StoredCartItem[]> {
    // Esta línea sirve para leer el carrito guardado.
    const raw =
      // Esta línea sirve para revisar si la plataforma es web.
      Platform.OS === 'web'
        // Esta línea sirve para usar el almacenamiento del navegador si existe.
        ? (typeof localStorage !== 'undefined' ? localStorage.getItem(KEY) : null)
        // Esta línea sirve para usar el almacén seguro del dispositivo en móvil.
        : await SecureStore.getItemAsync(KEY);
    // Esta línea sirve para devolver «[]» si «!raw».
    if (!raw) return [];
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para devolver «JSON.parse(raw) as StoredCartItem[]».
      return JSON.parse(raw) as StoredCartItem[];
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // Esta línea sirve para devolver «[]».
      return [];
    }
  },

  // Esta línea sirve para declarar el método «set».
  async set(items: StoredCartItem[]): Promise<void> {
    // Esta línea sirve para extraer «a» de «JSON.stringify(items)».
    const raw = JSON.stringify(items);
    // Esta línea sirve para revisar si «Platform.OS === 'web'».
    if (Platform.OS === 'web') {
      // Esta línea sirve para guardar el carrito en el almacenamiento del navegador.
      localStorage?.setItem(KEY, raw);
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }
    // Esta línea sirve para esperar el resultado de «SecureStore.setItemAsync».
    await SecureStore.setItemAsync(KEY, raw);
  },

  // Esta línea sirve para declarar el método «clear».
  async clear(): Promise<void> {
    // Esta línea sirve para revisar si «Platform.OS === 'web'».
    if (Platform.OS === 'web') {
      // Esta línea sirve para borrar el carrito del almacenamiento del navegador.
      localStorage?.removeItem(KEY);
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }
    // Esta línea sirve para esperar el resultado de «SecureStore.deleteItemAsync».
    await SecureStore.deleteItemAsync(KEY);
  },
};
