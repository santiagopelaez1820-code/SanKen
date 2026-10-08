// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para importar los tipos «Order» desde «@sanken/core».
import type { Order } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';

/** "Mis pedidos" — historial de compras del usuario autenticado (GET /orders, propio, no /admin/orders). */
// Esta línea sirve para declarar la interfaz «OrdersStoreState».
interface OrdersStoreState {
  // Esta línea sirve para declarar la propiedad «orders» con el valor o tipo «Order[]».
  orders: Order[];
  // Esta línea sirve para declarar la propiedad «isLoadingOrders» con el valor o tipo «boolean».
  isLoadingOrders: boolean;
  // Esta línea sirve para declarar la propiedad «ordersError» con el valor o tipo «string | null».
  ordersError: string | null;
  // Esta línea sirve para declarar la propiedad «loadOrders» con el valor o tipo «() => Promise<void>».
  loadOrders: () => Promise<void>;

  // Esta línea sirve para declarar la propiedad «currentOrder» con el valor o tipo «Order | null».
  currentOrder: Order | null;
  // Esta línea sirve para declarar la propiedad «isLoadingOrder» con el valor o tipo «boolean».
  isLoadingOrder: boolean;
  // Esta línea sirve para declarar la propiedad «orderError» con el valor o tipo «string | null».
  orderError: string | null;
  // Esta línea sirve para declarar la propiedad «loadOrder» con el valor o tipo «(id: number) => Promise<void>».
  loadOrder: (id: number) => Promise<void>;
}

// Esta línea sirve para declarar «useOrdersStore» con el valor «create<OrdersStoreState>((set) => ({».
export const useOrdersStore = create<OrdersStoreState>((set) => ({
  // Esta línea sirve para declarar la propiedad «orders» con el valor o tipo «[]».
  orders: [],
  // Esta línea sirve para declarar la propiedad «isLoadingOrders» con el valor o tipo «false».
  isLoadingOrders: false,
  // Esta línea sirve para declarar la propiedad «ordersError» con el valor o tipo «null».
  ordersError: null,
  // Esta línea sirve para declarar la propiedad «loadOrders» con el valor o tipo «async () => {».
  loadOrders: async () => {
    // Esta línea sirve para guardar en el store: «isLoadingOrders: true, ordersError: null })…».
    set({ isLoadingOrders: true, ordersError: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<Order[]>('/orders')» y guardar el resultado en «orders».
      const orders = await api.get<Order[]>('/orders');
      // Esta línea sirve para guardar en el store: «orders, isLoadingOrders: false })…».
      set({ orders, isLoadingOrders: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «isLoadingOrders» con el valor o tipo «false».
        isLoadingOrders: false,
        // Esta línea sirve para definir «ordersError» con «err instanceof Error ? err.message : 'No…».
        ordersError: err instanceof Error ? err.message : 'No se pudieron cargar tus pedidos.',
      });
    }
  },

  // Esta línea sirve para declarar la propiedad «currentOrder» con el valor o tipo «null».
  currentOrder: null,
  // Esta línea sirve para declarar la propiedad «isLoadingOrder» con el valor o tipo «false».
  isLoadingOrder: false,
  // Esta línea sirve para declarar la propiedad «orderError» con el valor o tipo «null».
  orderError: null,
  // Esta línea sirve para declarar la propiedad «loadOrder» con el valor o tipo «async (id) => {».
  loadOrder: async (id) => {
    // currentOrder se limpia acá (no solo isLoadingOrder/orderError): la
    // pantalla de detalle usa `!currentOrder` como guard del skeleton, así
    // que si no se limpia, navegar de un pedido a otro y que el fetch nuevo
    // falle deja visible el pedido VIEJO sin ningún aviso de error.
    // Esta línea sirve para guardar en el store: «isLoadingOrder: true, orderError: null, currentOrder: null }…».
    set({ isLoadingOrder: true, orderError: null, currentOrder: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<Order>(`/orders/${id}`)» y guardar el resultado en «order».
      const order = await api.get<Order>(`/orders/${id}`);
      // Esta línea sirve para guardar en el store: «currentOrder: order, isLoadingOrder: false })…».
      set({ currentOrder: order, isLoadingOrder: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «isLoadingOrder» con el valor o tipo «false».
        isLoadingOrder: false,
        // Esta línea sirve para definir «orderError» con «err instanceof Error ? err.message : 'No…».
        orderError: err instanceof Error ? err.message : 'No se pudo cargar el pedido.',
      });
    }
  },
}));
