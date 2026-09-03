import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { Product } from '@sanken/core';

import { api } from '@/lib/api';
import { useCartStore } from './cart-store';

jest.mock('@/lib/api', () => ({
  api: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn(), getWithMeta: jest.fn() },
}));

const mockedApi = api as jest.Mocked<typeof api>;

const product: Product = {
  id: 1,
  name: 'Creatina Monohidratada',
  slug: 'creatina-monohidratada',
  description: 'Descripción larga',
  short_description: 'Descripción corta',
  image: null,
  category: 'creatine',
  price: '79900.00',
};

const productB: Product = { ...product, id: 2, name: 'Whey Protein', price: '129900.00' };

beforeEach(() => {
  jest.clearAllMocks();
  useCartStore.setState({
    items: [],
    isHydrated: false,
    isSubmittingOrder: false,
    orderError: null,
  });
});

describe('addItem / incrementItem / decrementItem / removeItem', () => {
  it('adds a new product with the given quantity', () => {
    useCartStore.getState().addItem(product, 2);

    expect(useCartStore.getState().items).toEqual([{ product, quantity: 2 }]);
  });

  it('increases the quantity when the same product is added again', () => {
    useCartStore.getState().addItem(product, 1);
    useCartStore.getState().addItem(product, 1);

    expect(useCartStore.getState().items).toEqual([{ product, quantity: 2 }]);
  });

  it('increments and decrements the quantity of an existing item', () => {
    useCartStore.getState().addItem(product, 1);
    useCartStore.getState().incrementItem(product.id);

    expect(useCartStore.getState().items[0].quantity).toBe(2);

    useCartStore.getState().decrementItem(product.id);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it('removes the item once its quantity reaches 0', () => {
    useCartStore.getState().addItem(product, 1);
    useCartStore.getState().decrementItem(product.id);

    expect(useCartStore.getState().items).toEqual([]);
  });

  it('removeItem takes the item out regardless of quantity', () => {
    useCartStore.getState().addItem(product, 5);
    useCartStore.getState().removeItem(product.id);

    expect(useCartStore.getState().items).toEqual([]);
  });
});

describe('getSubtotal / getItemCount', () => {
  it('computes the subtotal and item count across multiple products', () => {
    useCartStore.getState().addItem(product, 2); // 79900 * 2 = 159800
    useCartStore.getState().addItem(productB, 1); // 129900 * 1 = 129900

    expect(useCartStore.getState().getSubtotal()).toBe(289700);
    expect(useCartStore.getState().getItemCount()).toBe(3);
  });
});

describe('clear', () => {
  it('empties the cart', () => {
    useCartStore.getState().addItem(product, 1);
    useCartStore.getState().clear();

    expect(useCartStore.getState().items).toEqual([]);
  });
});

describe('submitOrder', () => {
  it('sends product_id/quantity only (never price) and clears the cart on success', async () => {
    useCartStore.getState().addItem(product, 2);
    mockedApi.post.mockResolvedValueOnce({ id: 10, status: 'pending' } as never);

    const order = await useCartStore.getState().submitOrder({
      customer_name: 'Juan',
      customer_email: 'juan@example.com',
      customer_phone: '3000000000',
      department: 'Antioquia',
      city: 'Medellín',
      address: 'Calle 1',
    });

    expect(mockedApi.post).toHaveBeenCalledWith('/orders', {
      customer_name: 'Juan',
      customer_email: 'juan@example.com',
      customer_phone: '3000000000',
      department: 'Antioquia',
      city: 'Medellín',
      address: 'Calle 1',
      items: [{ product_id: product.id, quantity: 2 }],
    });
    expect(order).toEqual({ id: 10, status: 'pending' });
    expect(useCartStore.getState().items).toEqual([]);
  });

  it('keeps the cart and sets orderError on failure', async () => {
    useCartStore.getState().addItem(product, 1);
    mockedApi.post.mockRejectedValueOnce(new Error('Producto no disponible'));

    const order = await useCartStore.getState().submitOrder({
      customer_name: 'Juan',
      customer_email: 'juan@example.com',
      customer_phone: '3000000000',
      department: 'Antioquia',
      city: 'Medellín',
      address: 'Calle 1',
    });

    expect(order).toBeNull();
    expect(useCartStore.getState().orderError).toBe('Producto no disponible');
    expect(useCartStore.getState().items).toHaveLength(1);
  });
});
