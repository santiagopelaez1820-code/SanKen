// Esta línea sirve para importar «beforeEach, describe, expect, it, jest» desde «@jest/globals».
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
// Esta línea sirve para importar los tipos «SupportTicket» desde «@sanken/core».
import type { SupportTicket } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «linkFromNotificationData» desde «@/components/notification-link-handler».
import { linkFromNotificationData } from '@/components/notification-link-handler';
// Esta línea sirve para importar «useSupportStore» desde «./support-store».
import { useSupportStore } from './support-store';

// Esta línea sirve para simular el módulo «@/lib/api» en la prueba.
jest.mock('@/lib/api', () => ({
  // Esta línea sirve para definir el estilo «api» con «get: jest.fn(), post: jest.fn(), patch: jest.fn() …».
  api: { get: jest.fn(), post: jest.fn(), patch: jest.fn() },
}));

// Esta línea sirve para simular el módulo «expo-notifications» en la prueba.
jest.mock('expo-notifications', () => ({}));

// Esta línea sirve para declarar «mockedGet» con el valor «api.get as jest.MockedFunction<typeof api.get>».
const mockedGet = api.get as jest.MockedFunction<typeof api.get>;
// Esta línea sirve para declarar «mockedPost» con el valor «api.post as jest.MockedFunction<typeof api.post>».
const mockedPost = api.post as jest.MockedFunction<typeof api.post>;

// Esta línea sirve para declarar el dato de ejemplo «ticket» de tipo «SupportTicket».
const ticket: SupportTicket = {
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «1042».
  id: 1042,
  // Esta línea sirve para declarar la propiedad «type» con el valor o tipo «'question'».
  type: 'question',
  // Esta línea sirve para declarar la propiedad «subject» con el valor o tipo «'No entiendo mi rutina de hoy'».
  subject: 'No entiendo mi rutina de hoy',
  // Esta línea sirve para declarar la propiedad «status» con el valor o tipo «'open'».
  status: 'open',
  // Esta línea sirve para declarar la propiedad «source» con el valor o tipo «'app'».
  source: 'app',
  // Esta línea sirve para declarar la propiedad «weekly_checkin_id» con el valor o tipo «null».
  weekly_checkin_id: null,
  // Esta línea sirve para declarar la propiedad «last_message_at» con el valor o tipo «'2026-09-28T14:00:00Z'».
  last_message_at: '2026-09-28T14:00:00Z',
  // Esta línea sirve para declarar la propiedad «last_message_by_staff» con el valor o tipo «false».
  last_message_by_staff: false,
  // Esta línea sirve para declarar la propiedad «first_response_at» con el valor o tipo «null».
  first_response_at: null,
  // Esta línea sirve para declarar la propiedad «resolved_at» con el valor o tipo «null».
  resolved_at: null,
  // Esta línea sirve para declarar la propiedad «closed_at» con el valor o tipo «null».
  closed_at: null,
  // Esta línea sirve para declarar la propiedad «created_at» con el valor o tipo «'2026-09-28T14:00:00Z'».
  created_at: '2026-09-28T14:00:00Z',
};

// Esta línea sirve para extraer «hecki» de «{ id: 7, week: '2026-W40', status: 'pend».
const checkin = { id: 7, week: '2026-W40', status: 'pending' as const, mood: null, topic: null, postpone_count: 0, answered_at: null, support_ticket_id: null };

// Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
beforeEach(() => {
  // Esta línea sirve para llamar a «jest.clearAllMocks».
  jest.clearAllMocks();
  // Esta línea sirve para fijar el estado inicial del store para la prueba.
  useSupportStore.setState({ tickets: [], ticket: null, error: null, isSubmitting: false, checkin: null, checkinUserId: null });
});

// Esta línea sirve para agrupar las pruebas de «support requests».
describe('support requests', () => {
  // Esta línea sirve para declarar la prueba que verifica que «creates a request and adds it to the list».
  it('creates a request and adds it to the list', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedPost».
    mockedPost.mockResolvedValueOnce(ticket);

    // Esta línea sirve para ejecutar la acción y guardar el resultado en «created».
    const created = await useSupportStore.getState().createTicket({ type: 'question', subject: 'No entiendo', message: '¿Por qué?' });

    // Esta línea sirve para verificar que «mockedPost» cumple «toHaveBeenCalledWith».
    expect(mockedPost).toHaveBeenCalledWith('/support/tickets', { type: 'question', subject: 'No entiendo', message: '¿Por qué?' });
    // Esta línea sirve para verificar que «created.id» cumple «toBe».
    expect(created.id).toBe(1042);
    // Esta línea sirve para verificar que «useSupportStore.getState(» cumple «tickets».
    expect(useSupportStore.getState().tickets[0].id).toBe(1042);
  });

  // Esta línea sirve para declarar la prueba que verifica que «keeps the backend validation message on error».
  it('keeps the backend validation message on error', async () => {
    // Esta línea sirve para extraer «ApiError» de «jest.requireActual<typeof import('@sanke».
    const { ApiError } = jest.requireActual<typeof import('@sanken/core')>('@sanken/core');
    // Esta línea sirve para definir lo que devuelve el espía «mockedPost».
    mockedPost.mockRejectedValueOnce(new ApiError(422, { message: 'x', errors: { subject: ['Escribe un asunto.'] } }) as never);

    // Esta línea sirve para esperar y verificar «useSupportStore.getState(».
    await expect(useSupportStore.getState().createTicket({ type: 'question', subject: '', message: 'hola' })).rejects.toBeTruthy();
    // Esta línea sirve para verificar que «useSupportStore.getState(» cumple «error».
    expect(useSupportStore.getState().error).toBe('Escribe un asunto.');
  });

  // Esta línea sirve para declarar la prueba que verifica que «replies and stores the updated conversation».
  it('replies and stores the updated conversation', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedPost».
    mockedPost.mockResolvedValueOnce({ ...ticket, messages: [] });
    // Esta línea sirve para esperar el resultado de «useSupportStore.getState».
    await useSupportStore.getState().reply(1042, 'Gracias');
    // Esta línea sirve para verificar que «mockedPost» cumple «toHaveBeenCalledWith».
    expect(mockedPost).toHaveBeenCalledWith('/support/tickets/1042/messages', { body: 'Gracias' });
  });
});

// Esta línea sirve para agrupar las pruebas de «weekly check-in».
describe('weekly check-in', () => {
  // Esta línea sirve para declarar la prueba que verifica que «loads the current check-in once per user».
  it('loads the current check-in once per user', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedGet».
    mockedGet.mockResolvedValueOnce({ checkin, should_prompt: true });
    // Esta línea sirve para esperar el resultado de «useSupportStore.getState».
    await useSupportStore.getState().loadCheckin(5);

    // Esta línea sirve para verificar que «useSupportStore.getState(» cumple «checkin».
    expect(useSupportStore.getState().checkin?.should_prompt).toBe(true);
    // Esta línea sirve para verificar que «useSupportStore.getState(» cumple «checkinUserId».
    expect(useSupportStore.getState().checkinUserId).toBe(5);
  });

  // Esta línea sirve para declarar la prueba que verifica que «».
  it('"not now" hides it immediately and records the postponement', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useSupportStore.setState({ checkin: { checkin, should_prompt: true } });
    // Esta línea sirve para definir lo que devuelve el espía «mockedPost».
    mockedPost.mockResolvedValueOnce({ checkin: { ...checkin, status: 'postponed' } });

    // Esta línea sirve para esperar el resultado de «useSupportStore.getState».
    await useSupportStore.getState().postponeCheckin();

    // Esta línea sirve para verificar que «mockedPost» cumple «toHaveBeenCalledWith».
    expect(mockedPost).toHaveBeenCalledWith('/support/check-ins/7/postpone');
    // Esta línea sirve para verificar que «useSupportStore.getState(» cumple «checkin».
    expect(useSupportStore.getState().checkin?.should_prompt).toBe(false);
    // Esta línea sirve para verificar que «useSupportStore.getState(» cumple «checkin».
    expect(useSupportStore.getState().checkin?.checkin?.status).toBe('postponed');
  });

  // Esta línea sirve para declarar la prueba que verifica que «answering stops the prompt and adds the created request».
  it('answering stops the prompt and adds the created request', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useSupportStore.setState({ checkin: { checkin, should_prompt: true } });
    // Esta línea sirve para definir lo que devuelve el espía «mockedPost».
    mockedPost.mockResolvedValueOnce({ checkin: { ...checkin, status: 'answered' }, ticket: { ...ticket, source: 'weekly_checkin' } });

    // Esta línea sirve para ejecutar la acción y guardar el resultado en «result».
    const result = await useSupportStore.getState().answerCheckin({ mood: 'not_good', topic: 'observation', comment: 'Muy pesado' });

    // Esta línea sirve para verificar que «mockedPost» cumple «toHaveBeenCalledWith».
    expect(mockedPost).toHaveBeenCalledWith('/support/check-ins/7/answer', { mood: 'not_good', topic: 'observation', comment: 'Muy pesado' });
    // Esta línea sirve para verificar que «result.ticket?.id» cumple «toBe».
    expect(result.ticket?.id).toBe(1042);
    // Esta línea sirve para verificar que «useSupportStore.getState(» cumple «checkin».
    expect(useSupportStore.getState().checkin?.should_prompt).toBe(false);
    // Esta línea sirve para verificar que «useSupportStore.getState(» cumple «tickets».
    expect(useSupportStore.getState().tickets).toHaveLength(1);
  });
});

// Esta línea sirve para agrupar las pruebas de «notification links».
describe('notification links', () => {
  // Esta línea sirve para declarar la prueba que verifica que «opens the link of support/check-in notifications and the chat for chat».
  it('opens the link of support/check-in notifications and the chat for chat ones', () => {
    // Esta línea sirve para verificar que la ruta del check-in se acepta.
    expect(linkFromNotificationData({ link: '/soporte/check-in' })).toBe('/soporte/check-in');
    // Esta línea sirve para verificar que la ruta del ticket se acepta.
    expect(linkFromNotificationData({ link: '/soporte/12', ticket_id: 12 })).toBe('/soporte/12');
    // Esta línea sirve para verificar que «linkFromNotificationData({ conversation_id: 3 })» cumple «toBe».
    expect(linkFromNotificationData({ conversation_id: 3 })).toBe('/chat/3');
    // Esta línea sirve para verificar que un enlace externo se rechaza.
    expect(linkFromNotificationData({ link: 'https://evil.example' })).toBeNull();
    // Esta línea sirve para verificar que «linkFromNotificationData(null)» cumple «toBeNull».
    expect(linkFromNotificationData(null)).toBeNull();
  });
});
