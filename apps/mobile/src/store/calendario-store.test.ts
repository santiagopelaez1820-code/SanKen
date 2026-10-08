// Esta línea sirve para importar «beforeEach, describe, expect, it, jest» desde «@jest/globals».
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
// Esta línea sirve para importar los tipos «CalendarResponse» desde «@sanken/core».
import type { CalendarResponse } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «useCalendarioStore» desde «./calendario-store».
import { useCalendarioStore } from './calendario-store';

// Esta línea sirve para simular el módulo «@/lib/api» en la prueba.
jest.mock('@/lib/api', () => ({
  // Esta línea sirve para definir el estilo «api» con «get: jest.fn(), post: jest.fn(), delete: jest.fn()…».
  api: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

// Esta línea sirve para declarar «mockedApi» con el valor «api as jest.Mocked<typeof api>».
const mockedApi = api as jest.Mocked<typeof api>;

// Esta línea sirve para declarar el dato de ejemplo «response» de tipo «CalendarResponse».
const response: CalendarResponse = {
  // Esta línea sirve para declarar la propiedad «month» con el valor o tipo «'2026-08'».
  month: '2026-08',
  // Esta línea sirve para declarar la propiedad «events» con el valor o tipo «[».
  events: [
    // Esta línea sirve para agregar un elemento cuyo «type» es «'workout_completed', event_date: '2026-0…».
    { type: 'workout_completed', event_date: '2026-08-05', title: 'Full Body A', duration_minutes: 40, muscle_groups: ['Pecho', 'Tríceps'] },
  ],
};

// Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
beforeEach(() => {
  // Esta línea sirve para llamar a «jest.clearAllMocks».
  jest.clearAllMocks();
  // Esta línea sirve para fijar el estado inicial del store para la prueba.
  useCalendarioStore.setState({ month: new Date(2026, 7, 1), events: [], isLoading: false, error: null });
});

// Esta línea sirve para agrupar las pruebas de «load».
describe('load', () => {
  // Esta línea sirve para declarar la prueba que verifica que «fetches events for the current month».
  it('fetches events for the current month', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce(response);

    // Esta línea sirve para esperar el resultado de «useCalendarioStore.getState».
    await useCalendarioStore.getState().load();

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/calendar?month=2026-08');
    // Esta línea sirve para verificar que «useCalendarioStore.getState(» cumple «events».
    expect(useCalendarioStore.getState().events).toEqual(response.events);
  });

  // Esta línea sirve para declarar la prueba que verifica que «sets an error on failure».
  it('sets an error on failure', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockRejectedValueOnce(new Error('network down'));

    // Esta línea sirve para esperar el resultado de «useCalendarioStore.getState».
    await useCalendarioStore.getState().load();

    // Esta línea sirve para verificar que «useCalendarioStore.getState(» cumple «error».
    expect(useCalendarioStore.getState().error).toBe('network down');
  });
});

// Esta línea sirve para agrupar las pruebas de «setMonth».
describe('setMonth', () => {
  // Esta línea sirve para declarar la prueba que verifica que «updates the month and reloads with the new key».
  it('updates the month and reloads with the new key', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce({ ...response, month: '2026-09' });

    // Esta línea sirve para invocar la acción «setMonth» del store de «Calendario».
    useCalendarioStore.getState().setMonth(new Date(2026, 8, 1));
    // Esta línea sirve para verificar que «useCalendarioStore.getState(» cumple «month».
    expect(useCalendarioStore.getState().month.getMonth()).toBe(8);

    // Esta línea sirve para esperar el resultado de «Promise.resolve».
    await Promise.resolve();
    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/calendar?month=2026-09');
  });
});

// Esta línea sirve para agrupar las pruebas de «addReminder / deleteReminder».
describe('addReminder / deleteReminder', () => {
  // Esta línea sirve para declarar la prueba que verifica que «posts a new reminder and reloads».
  it('posts a new reminder and reloads', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce(response);

    // Esta línea sirve para esperar el resultado de «useCalendarioStore.getState».
    await useCalendarioStore.getState().addReminder('2026-08-20', 'Pesarme');

    // Esta línea sirve para verificar que «mockedApi.post» cumple «toHaveBeenCalledWith».
    expect(mockedApi.post).toHaveBeenCalledWith('/calendar/reminders', { event_date: '2026-08-20', title: 'Pesarme' });
    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/calendar?month=2026-08');
  });

  // Esta línea sirve para declarar la prueba que verifica que «deletes a reminder and reloads».
  it('deletes a reminder and reloads', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.delete».
    mockedApi.delete.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce(response);

    // Esta línea sirve para esperar el resultado de «useCalendarioStore.getState».
    await useCalendarioStore.getState().deleteReminder(7);

    // Esta línea sirve para verificar que «mockedApi.delete» cumple «toHaveBeenCalledWith».
    expect(mockedApi.delete).toHaveBeenCalledWith('/calendar/reminders/7');
    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/calendar?month=2026-08');
  });
});
