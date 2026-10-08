// Esta línea sirve para importar «beforeEach, describe, expect, it, jest» desde «@jest/globals».
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
// Esta línea sirve para importar los tipos «Product» desde «@sanken/core».
import type { Product } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «useProductStore» desde «./product-store».
import { useProductStore } from './product-store';

// Esta línea sirve para simular el módulo «@/lib/api» en la prueba.
jest.mock('@/lib/api', () => ({
  // Esta línea sirve para definir el estilo «api» con «get: jest.fn(), post: jest.fn(), patch: jest.fn(),…».
  api: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn(), getWithMeta: jest.fn() },
}));

// Esta línea sirve para declarar «mockedApi» con el valor «api as jest.Mocked<typeof api>».
const mockedApi = api as jest.Mocked<typeof api>;

// Esta línea sirve para declarar el dato de ejemplo «product» de tipo «Product».
const product: Product = {
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «1».
  id: 1,
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «'Creatina Monohidratada'».
  name: 'Creatina Monohidratada',
  // Esta línea sirve para declarar la propiedad «slug» con el valor o tipo «'creatina-monohidratada'».
  slug: 'creatina-monohidratada',
  // Esta línea sirve para declarar la propiedad «description» con el valor o tipo «'Descripción larga'».
  description: 'Descripción larga',
  // Esta línea sirve para declarar la propiedad «short_description» con el valor o tipo «'Descripción corta'».
  short_description: 'Descripción corta',
  // Esta línea sirve para declarar la propiedad «image» con el valor o tipo «null».
  image: null,
  // Esta línea sirve para declarar la propiedad «category» con el valor o tipo «'creatine'».
  category: 'creatine',
  // Esta línea sirve para declarar la propiedad «price» con el valor o tipo «'79900.00'».
  price: '79900.00',
  // Esta línea sirve para declarar la propiedad «created_at» con el valor o tipo «'2026-01-01T00:00:00Z'».
  created_at: '2026-01-01T00:00:00Z',
};

// Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
beforeEach(() => {
  // Esta línea sirve para llamar a «jest.clearAllMocks».
  jest.clearAllMocks();
  // Esta línea sirve para fijar el estado inicial del store para la prueba.
  useProductStore.setState({
    // Esta línea sirve para declarar la propiedad «products» con el valor o tipo «[]».
    products: [],
    // Esta línea sirve para declarar la propiedad «isLoadingProducts» con el valor o tipo «false».
    isLoadingProducts: false,
    // Esta línea sirve para declarar la propiedad «productsError» con el valor o tipo «null».
    productsError: null,
    // Esta línea sirve para declarar la propiedad «currentProduct» con el valor o tipo «null».
    currentProduct: null,
    // Esta línea sirve para declarar la propiedad «isLoadingProduct» con el valor o tipo «false».
    isLoadingProduct: false,
    // Esta línea sirve para declarar la propiedad «productError» con el valor o tipo «null».
    productError: null,
  });
});

// Esta línea sirve para agrupar las pruebas de «loadProducts».
describe('loadProducts', () => {
  // Esta línea sirve para declarar la prueba que verifica que «loads the full catalog when no category is given».
  it('loads the full catalog when no category is given', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([product]);

    // Esta línea sirve para esperar el resultado de «useProductStore.getState».
    await useProductStore.getState().loadProducts();

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/products');
    // Esta línea sirve para verificar que «useProductStore.getState(» cumple «products».
    expect(useProductStore.getState().products).toEqual([product]);
  });

  // Esta línea sirve para declarar la prueba que verifica que «appends the category filter when given».
  it('appends the category filter when given', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([product]);

    // Esta línea sirve para esperar el resultado de «useProductStore.getState».
    await useProductStore.getState().loadProducts('creatine');

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/products?category=creatine');
  });

  // Esta línea sirve para declarar la prueba que verifica que «sets productsError on failure».
  it('sets productsError on failure', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockRejectedValueOnce(new Error('Sin conexión'));

    // Esta línea sirve para esperar el resultado de «useProductStore.getState».
    await useProductStore.getState().loadProducts();

    // Esta línea sirve para verificar que «useProductStore.getState(» cumple «productsError».
    expect(useProductStore.getState().productsError).toBe('Sin conexión');
    // Esta línea sirve para verificar que «useProductStore.getState(» cumple «products».
    expect(useProductStore.getState().products).toEqual([]);
  });
});

// Esta línea sirve para agrupar las pruebas de «loadProduct».
describe('loadProduct', () => {
  // Esta línea sirve para declarar la prueba que verifica que «loads a single product by id».
  it('loads a single product by id', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce(product);

    // Esta línea sirve para esperar el resultado de «useProductStore.getState».
    await useProductStore.getState().loadProduct(1);

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/products/1');
    // Esta línea sirve para verificar que «useProductStore.getState(» cumple «currentProduct».
    expect(useProductStore.getState().currentProduct).toEqual(product);
  });
});
