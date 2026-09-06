import { create } from 'zustand';
import type { Order } from '@sanken/core';

import { api } from '@/lib/api';

/** "Mis pedidos" — historial de compras del usuario autenticado (GET /orders, propio, no /admin/orders). */
interface OrdersStoreState {
  orders: Order[];
  isLoadingOrders: boolean;
  ordersError: string | null;
  loadOrders: () => Promise<void>;

  currentOrder: Order | null;
  isLoadingOrder: boolean;
  orderError: string | null;
  loadOrder: (id: number) => Promise<void>;
}

export const useOrdersStore = create<OrdersStoreState>((set) => ({
  orders: [],
  isLoadingOrders: false,
  ordersError: null,
  loadOrders: async () => {
    set({ isLoadingOrders: true, ordersError: null });
    try {
      const orders = await api.get<Order[]>('/orders');
      set({ orders, isLoadingOrders: false });
    } catch (err) {
      set({
        isLoadingOrders: false,
        ordersError: err instanceof Error ? err.message : 'No se pudieron cargar tus pedidos.',
      });
    }
  },

  currentOrder: null,
  isLoadingOrder: false,
  orderError: null,
  loadOrder: async (id) => {
    // currentOrder se limpia acá (no solo isLoadingOrder/orderError): la
    // pantalla de detalle usa `!currentOrder` como guard del skeleton, así
    // que si no se limpia, navegar de un pedido a otro y que el fetch nuevo
    // falle deja visible el pedido VIEJO sin ningún aviso de error.
    set({ isLoadingOrder: true, orderError: null, currentOrder: null });
    try {
      const order = await api.get<Order>(`/orders/${id}`);
      set({ currentOrder: order, isLoadingOrder: false });
    } catch (err) {
      set({
        isLoadingOrder: false,
        orderError: err instanceof Error ? err.message : 'No se pudo cargar el pedido.',
      });
    }
  },
}));
