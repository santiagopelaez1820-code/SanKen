import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { Product } from '@sanken/core';

import { api } from '@/lib/api';
import { useProductStore } from './product-store';

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

beforeEach(() => {
  jest.clearAllMocks();
  useProductStore.setState({
    products: [],
    isLoadingProducts: false,
    productsError: null,
    currentProduct: null,
    isLoadingProduct: false,
    productError: null,
  });
});

describe('loadProducts', () => {
  it('loads the full catalog when no category is given', async () => {
    mockedApi.get.mockResolvedValueOnce([product]);

    await useProductStore.getState().loadProducts();

    expect(mockedApi.get).toHaveBeenCalledWith('/products');
    expect(useProductStore.getState().products).toEqual([product]);
  });

  it('appends the category filter when given', async () => {
    mockedApi.get.mockResolvedValueOnce([product]);

    await useProductStore.getState().loadProducts('creatine');

    expect(mockedApi.get).toHaveBeenCalledWith('/products?category=creatine');
  });

  it('sets productsError on failure', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('Sin conexión'));

    await useProductStore.getState().loadProducts();

    expect(useProductStore.getState().productsError).toBe('Sin conexión');
    expect(useProductStore.getState().products).toEqual([]);
  });
});

describe('loadProduct', () => {
  it('loads a single product by id', async () => {
    mockedApi.get.mockResolvedValueOnce(product);

    await useProductStore.getState().loadProduct(1);

    expect(mockedApi.get).toHaveBeenCalledWith('/products/1');
    expect(useProductStore.getState().currentProduct).toEqual(product);
  });
});
