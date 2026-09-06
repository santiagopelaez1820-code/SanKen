import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { Order } from '@sanken/core';

import { api } from '@/lib/api';
import { useOrdersStore } from './orders-store';

jest.mock('@/lib/api', () => ({
  api: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn(), getWithMeta: jest.fn() },
}));

const mockedApi = api as jest.Mocked<typeof api>;

const order: Order = {
  id: 1,
  user_id: 5,
  status: 'pending',
  customer_name: 'Juan Pérez',
  customer_email: 'juan@example.com',
  customer_phone: '3000000000',
  customer_whatsapp: '3000000000',
  department: 'Antioquia',
  city: 'Medellín',
  address: 'Calle 10 # 20-30',
  additional_info: null,
  subtotal: '90000.00',
  shipping_cost: null,
  total: '90000.00',
  tracking_number: null,
  carrier: null,
  customer_message: null,
  support_whatsapp_url: null,
  items: [],
  created_at: '2026-08-30T00:00:00Z',
  updated_at: '2026-08-30T00:00:00Z',
};

beforeEach(() => {
  jest.clearAllMocks();
  useOrdersStore.setState({
    orders: [],
    isLoadingOrders: false,
    ordersError: null,
    currentOrder: null,
    isLoadingOrder: false,
    orderError: null,
  });
});

describe('loadOrders', () => {
  it('loads the current users order history', async () => {
    mockedApi.get.mockResolvedValueOnce([order]);

    await useOrdersStore.getState().loadOrders();

    expect(mockedApi.get).toHaveBeenCalledWith('/orders');
    expect(useOrdersStore.getState().orders).toEqual([order]);
  });

  it('sets ordersError on failure', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('Sin conexión'));

    await useOrdersStore.getState().loadOrders();

    expect(useOrdersStore.getState().ordersError).toBe('Sin conexión');
    expect(useOrdersStore.getState().orders).toEqual([]);
  });
});

describe('loadOrder', () => {
  it('loads a single order by id', async () => {
    mockedApi.get.mockResolvedValueOnce(order);

    await useOrdersStore.getState().loadOrder(1);

    expect(mockedApi.get).toHaveBeenCalledWith('/orders/1');
    expect(useOrdersStore.getState().currentOrder).toEqual(order);
  });

  it('sets orderError on failure', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('No encontrado'));

    await useOrdersStore.getState().loadOrder(999);

    expect(useOrdersStore.getState().orderError).toBe('No encontrado');
    expect(useOrdersStore.getState().currentOrder).toBeNull();
  });
});
