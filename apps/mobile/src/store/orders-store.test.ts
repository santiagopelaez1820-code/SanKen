// Esta línea sirve para importar «beforeEach, describe, expect, it, jest» desde «@jest/globals».
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
// Esta línea sirve para importar los tipos «Order» desde «@sanken/core».
import type { Order } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «useOrdersStore» desde «./orders-store».
import { useOrdersStore } from './orders-store';

// Esta línea sirve para simular el módulo «@/lib/api» en la prueba.
jest.mock('@/lib/api', () => ({
  // Esta línea sirve para definir el estilo «api» con «get: jest.fn(), post: jest.fn(), patch: jest.fn(),…».
  api: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn(), getWithMeta: jest.fn() },
}));

// Esta línea sirve para declarar «mockedApi» con el valor «api as jest.Mocked<typeof api>».
const mockedApi = api as jest.Mocked<typeof api>;

// Esta línea sirve para declarar el dato de ejemplo «order» de tipo «Order».
const order: Order = {
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «1».
  id: 1,
  // Esta línea sirve para declarar la propiedad «user_id» con el valor o tipo «5».
  user_id: 5,
  // Esta línea sirve para declarar la propiedad «status» con el valor o tipo «'pending'».
  status: 'pending',
  // Esta línea sirve para declarar la propiedad «customer_name» con el valor o tipo «'Juan Pérez'».
  customer_name: 'Juan Pérez',
  // Esta línea sirve para declarar la propiedad «customer_email» con el valor o tipo «'juan@example.com'».
  customer_email: 'juan@example.com',
  // Esta línea sirve para declarar la propiedad «customer_phone» con el valor o tipo «'3000000000'».
  customer_phone: '3000000000',
  // Esta línea sirve para declarar la propiedad «customer_whatsapp» con el valor o tipo «'3000000000'».
  customer_whatsapp: '3000000000',
  // Esta línea sirve para declarar la propiedad «department» con el valor o tipo «'Antioquia'».
  department: 'Antioquia',
  // Esta línea sirve para declarar la propiedad «city» con el valor o tipo «'Medellín'».
  city: 'Medellín',
  // Esta línea sirve para declarar la propiedad «address» con el valor o tipo «'Calle 10 # 20-30'».
  address: 'Calle 10 # 20-30',
  // Esta línea sirve para declarar la propiedad «additional_info» con el valor o tipo «null».
  additional_info: null,
  // Esta línea sirve para declarar la propiedad «subtotal» con el valor o tipo «'90000.00'».
  subtotal: '90000.00',
  // Esta línea sirve para declarar la propiedad «shipping_cost» con el valor o tipo «null».
  shipping_cost: null,
  // Esta línea sirve para declarar la propiedad «total» con el valor o tipo «'90000.00'».
  total: '90000.00',
  // Esta línea sirve para declarar la propiedad «tracking_number» con el valor o tipo «null».
  tracking_number: null,
  // Esta línea sirve para declarar la propiedad «carrier» con el valor o tipo «null».
  carrier: null,
  // Esta línea sirve para declarar la propiedad «customer_message» con el valor o tipo «null».
  customer_message: null,
  // Esta línea sirve para declarar la propiedad «support_whatsapp_url» con el valor o tipo «null».
  support_whatsapp_url: null,
  // Esta línea sirve para declarar la propiedad «items» con el valor o tipo «[]».
  items: [],
  // Esta línea sirve para declarar la propiedad «created_at» con el valor o tipo «'2026-08-30T00:00:00Z'».
  created_at: '2026-08-30T00:00:00Z',
  // Esta línea sirve para declarar la propiedad «updated_at» con el valor o tipo «'2026-08-30T00:00:00Z'».
  updated_at: '2026-08-30T00:00:00Z',
};

// Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
beforeEach(() => {
  // Esta línea sirve para llamar a «jest.clearAllMocks».
  jest.clearAllMocks();
  // Esta línea sirve para fijar el estado inicial del store para la prueba.
  useOrdersStore.setState({
    // Esta línea sirve para declarar la propiedad «orders» con el valor o tipo «[]».
    orders: [],
    // Esta línea sirve para declarar la propiedad «isLoadingOrders» con el valor o tipo «false».
    isLoadingOrders: false,
    // Esta línea sirve para declarar la propiedad «ordersError» con el valor o tipo «null».
    ordersError: null,
    // Esta línea sirve para declarar la propiedad «currentOrder» con el valor o tipo «null».
    currentOrder: null,
    // Esta línea sirve para declarar la propiedad «isLoadingOrder» con el valor o tipo «false».
    isLoadingOrder: false,
    // Esta línea sirve para declarar la propiedad «orderError» con el valor o tipo «null».
    orderError: null,
  });
});

// Esta línea sirve para agrupar las pruebas de «loadOrders».
describe('loadOrders', () => {
  // Esta línea sirve para declarar la prueba que verifica que «loads the current users order history».
  it('loads the current users order history', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([order]);

    // Esta línea sirve para esperar el resultado de «useOrdersStore.getState».
    await useOrdersStore.getState().loadOrders();

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/orders');
    // Esta línea sirve para verificar que «useOrdersStore.getState(» cumple «orders».
    expect(useOrdersStore.getState().orders).toEqual([order]);
  });

  // Esta línea sirve para declarar la prueba que verifica que «sets ordersError on failure».
  it('sets ordersError on failure', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockRejectedValueOnce(new Error('Sin conexión'));

    // Esta línea sirve para esperar el resultado de «useOrdersStore.getState».
    await useOrdersStore.getState().loadOrders();

    // Esta línea sirve para verificar que «useOrdersStore.getState(» cumple «ordersError».
    expect(useOrdersStore.getState().ordersError).toBe('Sin conexión');
    // Esta línea sirve para verificar que «useOrdersStore.getState(» cumple «orders».
    expect(useOrdersStore.getState().orders).toEqual([]);
  });
});

// Esta línea sirve para agrupar las pruebas de «loadOrder».
describe('loadOrder', () => {
  // Esta línea sirve para declarar la prueba que verifica que «loads a single order by id».
  it('loads a single order by id', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce(order);

    // Esta línea sirve para esperar el resultado de «useOrdersStore.getState».
    await useOrdersStore.getState().loadOrder(1);

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/orders/1');
    // Esta línea sirve para verificar que «useOrdersStore.getState(» cumple «currentOrder».
    expect(useOrdersStore.getState().currentOrder).toEqual(order);
  });

  // Esta línea sirve para declarar la prueba que verifica que «sets orderError on failure».
  it('sets orderError on failure', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockRejectedValueOnce(new Error('No encontrado'));

    // Esta línea sirve para esperar el resultado de «useOrdersStore.getState».
    await useOrdersStore.getState().loadOrder(999);

    // Esta línea sirve para verificar que «useOrdersStore.getState(» cumple «orderError».
    expect(useOrdersStore.getState().orderError).toBe('No encontrado');
    // Esta línea sirve para verificar que «useOrdersStore.getState(» cumple «currentOrder».
    expect(useOrdersStore.getState().currentOrder).toBeNull();
  });
});
