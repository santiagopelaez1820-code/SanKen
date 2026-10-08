// Esta línea sirve para importar «beforeEach, describe, expect, it, jest» desde «@jest/globals».
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
// Esta línea sirve para importar los tipos «ChatMessage, ConversationSummary, ConversationWithMessages» desde «@sanken/core».
import type { ChatMessage, ConversationSummary, ConversationWithMessages } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «getEcho» desde «@/lib/echo».
import { getEcho } from '@/lib/echo';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';
// Esta línea sirve para importar «useChatStore» desde «./chat-store».
import { useChatStore } from './chat-store';

// Esta línea sirve para simular el módulo «@/lib/api» en la prueba.
jest.mock('@/lib/api', () => ({
  // Esta línea sirve para declarar la propiedad «api» con el valor o tipo «{ get: jest.fn(), post: jest.fn() }».
  api: { get: jest.fn(), post: jest.fn() },
}));

// Esta línea sirve para simular el módulo «@/lib/echo» en la prueba.
jest.mock('@/lib/echo', () => ({
  // Esta línea sirve para declarar la propiedad «getEcho» con el valor o tipo «jest.fn()».
  getEcho: jest.fn(),
}));

// Esta línea sirve para declarar «mockedApi» con el valor «api as jest.Mocked<typeof api>».
const mockedApi = api as jest.Mocked<typeof api>;
// Esta línea sirve para declarar «mockedGetEcho» con el valor «getEcho as jest.Mock».
const mockedGetEcho = getEcho as jest.Mock;

// Esta línea sirve para declarar el dato de ejemplo «message» de tipo «ChatMessage».
const message: ChatMessage = {
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «1».
  id: 1,
  // Esta línea sirve para declarar la propiedad «conversation_id» con el valor o tipo «9».
  conversation_id: 9,
  // Esta línea sirve para declarar la propiedad «sender_id» con el valor o tipo «5».
  sender_id: 5,
  // Esta línea sirve para declarar la propiedad «sender_name» con el valor o tipo «'Coach Ana'».
  sender_name: 'Coach Ana',
  // Esta línea sirve para declarar la propiedad «body» con el valor o tipo «'Hola'».
  body: 'Hola',
  // Esta línea sirve para declarar la propiedad «is_mine» con el valor o tipo «true».
  is_mine: true,
  // Esta línea sirve para declarar la propiedad «created_at» con el valor o tipo «'2026-08-12T10:00:00Z'».
  created_at: '2026-08-12T10:00:00Z',
};

// Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
beforeEach(() => {
  // Esta línea sirve para llamar a «jest.clearAllMocks».
  jest.clearAllMocks();
  // Esta línea sirve para fijar el estado inicial del store para la prueba.
  useChatStore.setState({
    // Esta línea sirve para declarar la propiedad «conversations» con el valor o tipo «[]».
    conversations: [],
    // Esta línea sirve para declarar la propiedad «isLoadingInbox» con el valor o tipo «false».
    isLoadingInbox: false,
    // Esta línea sirve para declarar la propiedad «inboxError» con el valor o tipo «null».
    inboxError: null,
    // Esta línea sirve para declarar la propiedad «activeConversationId» con el valor o tipo «null».
    activeConversationId: null,
    // Esta línea sirve para declarar la propiedad «messages» con el valor o tipo «[]».
    messages: [],
    // Esta línea sirve para declarar la propiedad «isLoadingThread» con el valor o tipo «false».
    isLoadingThread: false,
  });
});

// Esta línea sirve para agrupar las pruebas de «loadInbox».
describe('loadInbox', () => {
  // Esta línea sirve para declarar la prueba que verifica que «stores the fetched conversations».
  it('stores the fetched conversations', async () => {
    // Esta línea sirve para declarar el dato de ejemplo «summary» de tipo «ConversationSummary».
    const summary: ConversationSummary = {
      // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «9».
      id: 9,
      // Esta línea sirve para declarar la propiedad «trainer_client_id» con el valor o tipo «3».
      trainer_client_id: 3,
      // Esta línea sirve para declarar la propiedad «other_party» con el valor o tipo «{ id: 5, name: 'Coach Ana' }».
      other_party: { id: 5, name: 'Coach Ana' },
      // Esta línea sirve para definir «last_message» con «{ body: 'Hola', sender_id: 5, created_at…».
      last_message: { body: 'Hola', sender_id: 5, created_at: '2026-08-12T10:00:00Z' },
      // Esta línea sirve para declarar la propiedad «unread_count» con el valor o tipo «1».
      unread_count: 1,
    };
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([summary]);

    // Esta línea sirve para esperar el resultado de «useChatStore.getState».
    await useChatStore.getState().loadInbox();

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/conversations');
    // Esta línea sirve para verificar que «useChatStore.getState(» cumple «conversations».
    expect(useChatStore.getState().conversations).toEqual([summary]);
  });

  // Esta línea sirve para declarar la prueba que verifica que «sets an error on failure».
  it('sets an error on failure', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockRejectedValueOnce(new Error('network down'));

    // Esta línea sirve para esperar el resultado de «useChatStore.getState».
    await useChatStore.getState().loadInbox();

    // Esta línea sirve para verificar que «useChatStore.getState(» cumple «inboxError».
    expect(useChatStore.getState().inboxError).toBe('network down');
  });
});

// Esta línea sirve para agrupar las pruebas de «openConversationForTrainerClient».
describe('openConversationForTrainerClient', () => {
  // Esta línea sirve para declarar la prueba que verifica que «resolves the conversation id for a trainer_client relationship».
  it('resolves the conversation id for a trainer_client relationship', async () => {
    // Esta línea sirve para extraer «esponse: ConversationWithMessage» de «{ conversation_id: 9, messages: [] }».
    const response: ConversationWithMessages = { conversation_id: 9, messages: [] };
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce(response);

    // Esta línea sirve para ejecutar la acción y guardar el resultado en «id».
    const id = await useChatStore.getState().openConversationForTrainerClient(3);

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/trainer-clients/3/conversation');
    // Esta línea sirve para verificar que «id» cumple «toBe».
    expect(id).toBe(9);
  });
});

// Esta línea sirve para agrupar las pruebas de «openThread / closeThread».
describe('openThread / closeThread', () => {
  // Esta línea sirve para declarar la prueba que verifica que «fetches recent messages and subscribes to the private channel».
  it('fetches recent messages and subscribes to the private channel', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([message]);
    // Esta línea sirve para crear «listen» llamando a «jest.fn».
    const listen = jest.fn();
    // Esta línea sirve para extraer «ch» de «{ private: jest.fn(() => ({ listen })), ».
    const echo = { private: jest.fn(() => ({ listen })), leave: jest.fn() };
    // Esta línea sirve para definir lo que devuelve el espía «mockedGetEcho».
    mockedGetEcho.mockReturnValue(echo);

    // Esta línea sirve para esperar el resultado de «useChatStore.getState».
    await useChatStore.getState().openThread(9);

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/conversations/9/messages');
    // Esta línea sirve para verificar que «useChatStore.getState(» cumple «messages».
    expect(useChatStore.getState().messages).toEqual([message]);
    // Esta línea sirve para verificar que «useChatStore.getState(» cumple «activeConversationId».
    expect(useChatStore.getState().activeConversationId).toBe(9);
    // Esta línea sirve para verificar que «echo.private» cumple «toHaveBeenCalledWith».
    expect(echo.private).toHaveBeenCalledWith('conversations.9');
    // Esta línea sirve para verificar que «listen» cumple «toHaveBeenCalledWith».
    expect(listen).toHaveBeenCalledWith('.message.sent', expect.any(Function));
  });

  // Esta línea sirve para declarar la prueba que verifica que «appends incoming broadcast messages as not mine».
  it('appends incoming broadcast messages as not mine', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([]);
    // Esta línea sirve para declarar la variable «broadcastCallback» de tipo «((payload: unknown) => void) | undefined» sin valor inicial.
    let broadcastCallback: ((payload: unknown) => void) | undefined;
    // Esta línea sirve para declarar el objeto de ejemplo «echo».
    const echo = {
      // Esta línea sirve para declarar la propiedad «private» con el valor o tipo «jest.fn(() => ({».
      private: jest.fn(() => ({
        // Esta línea sirve para definir «listen» con «jest.fn((_event: string, cb: typeof broa…».
        listen: jest.fn((_event: string, cb: typeof broadcastCallback) => {
          // Esta línea sirve para asignar «cb» a «broadcastCallback».
          broadcastCallback = cb;
        }),
      })),
      // Esta línea sirve para declarar la propiedad «leave» con el valor o tipo «jest.fn()».
      leave: jest.fn(),
    };
    // Esta línea sirve para definir lo que devuelve el espía «mockedGetEcho».
    mockedGetEcho.mockReturnValue(echo);

    // Esta línea sirve para esperar el resultado de «useChatStore.getState».
    await useChatStore.getState().openThread(9);
    // Esta línea sirve para llamar a «broadcastCallback» si está definida.
    broadcastCallback?.({ ...message, id: 2 });

    // Esta línea sirve para verificar que «useChatStore.getState(» cumple «messages».
    expect(useChatStore.getState().messages).toEqual([{ ...message, id: 2, is_mine: false }]);
  });

  // Esta línea sirve para declarar la prueba que verifica que «leaves the channel and clears state on close».
  it('leaves the channel and clears state on close', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([]);
    // Esta línea sirve para extraer «ch» de «{ private: jest.fn(() => ({ listen: jest».
    const echo = { private: jest.fn(() => ({ listen: jest.fn() })), leave: jest.fn() };
    // Esta línea sirve para definir lo que devuelve el espía «mockedGetEcho».
    mockedGetEcho.mockReturnValue(echo);

    // Esta línea sirve para esperar el resultado de «useChatStore.getState».
    await useChatStore.getState().openThread(9);
    // Esta línea sirve para invocar la acción «closeThread» del store de «Chat».
    useChatStore.getState().closeThread();

    // Esta línea sirve para verificar que «echo.leave» cumple «toHaveBeenCalledWith».
    expect(echo.leave).toHaveBeenCalledWith('conversations.9');
    // Esta línea sirve para verificar que «useChatStore.getState(» cumple «activeConversationId».
    expect(useChatStore.getState().activeConversationId).toBeNull();
    // Esta línea sirve para verificar que «useChatStore.getState(» cumple «messages».
    expect(useChatStore.getState().messages).toEqual([]);
  });
});

// Esta línea sirve para agrupar las pruebas de «sendMessage».
describe('sendMessage', () => {
  // Esta línea sirve para declarar la prueba que verifica que «posts to the active conversation and appends the result».
  it('posts to the active conversation and appends the result', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([]);
    // Esta línea sirve para extraer «ch» de «{ private: jest.fn(() => ({ listen: jest».
    const echo = { private: jest.fn(() => ({ listen: jest.fn() })), leave: jest.fn() };
    // Esta línea sirve para definir lo que devuelve el espía «mockedGetEcho».
    mockedGetEcho.mockReturnValue(echo);
    // Esta línea sirve para esperar el resultado de «useChatStore.getState».
    await useChatStore.getState().openThread(9);

    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce(message);
    // Esta línea sirve para esperar el resultado de «useChatStore.getState».
    await useChatStore.getState().sendMessage('Hola');

    // Esta línea sirve para verificar que «mockedApi.post» cumple «toHaveBeenCalledWith».
    expect(mockedApi.post).toHaveBeenCalledWith('/conversations/9/messages', { body: 'Hola' });
    // Esta línea sirve para verificar que «useChatStore.getState(» cumple «messages».
    expect(useChatStore.getState().messages).toEqual([message]);
  });

  // Esta línea sirve para declarar la prueba que verifica que «does nothing when there is no active conversation».
  it('does nothing when there is no active conversation', async () => {
    // Esta línea sirve para esperar el resultado de «useChatStore.getState».
    await useChatStore.getState().sendMessage('Hola');
    // Esta línea sirve para verificar que «mockedApi.post» no cumple «toHaveBeenCalled».
    expect(mockedApi.post).not.toHaveBeenCalled();
  });

  // Esta línea sirve para declarar la prueba que verifica que «returns false and keeps the thread intact when the request fails».
  it('returns false and keeps the thread intact when the request fails', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([]);
    // Esta línea sirve para definir lo que devuelve el espía «mockedGetEcho».
    mockedGetEcho.mockReturnValue({ private: jest.fn(() => ({ listen: jest.fn() })), leave: jest.fn() });
    // Esta línea sirve para esperar el resultado de «useChatStore.getState».
    await useChatStore.getState().openThread(9);

    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockRejectedValueOnce(new Error('offline'));
    // Esta línea sirve para ejecutar la acción y guardar el resultado en «ok».
    const ok = await useChatStore.getState().sendMessage('Hola');

    // Esta línea sirve para verificar que «ok» cumple «toBe».
    expect(ok).toBe(false);
    // Esta línea sirve para verificar que «useChatStore.getState(» cumple «messages».
    expect(useChatStore.getState().messages).toEqual([]);
  });

  // El backend transmite el mensaje a todo el canal, incluido quien lo envió:
  // antes aparecía duplicado y como si fuera del otro participante.
  // Esta línea sirve para declarar la prueba que verifica que «does not duplicate my own message when its broadcast echo arrives».
  it('does not duplicate my own message when its broadcast echo arrives', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useAuthStore.setState({ user: { id: 5 } as any });
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([]);
    // Esta línea sirve para declarar la variable «broadcastCallback» de tipo «((payload: unknown) => void) | undefined» sin valor inicial.
    let broadcastCallback: ((payload: unknown) => void) | undefined;
    // Esta línea sirve para definir lo que devuelve el espía «mockedGetEcho».
    mockedGetEcho.mockReturnValue({
      // Esta línea sirve para declarar la propiedad «private» con el valor o tipo «jest.fn(() => ({».
      private: jest.fn(() => ({
        // Esta línea sirve para definir «listen» con «jest.fn((_event: string, cb: typeof broa…».
        listen: jest.fn((_event: string, cb: typeof broadcastCallback) => {
          // Esta línea sirve para asignar «cb» a «broadcastCallback».
          broadcastCallback = cb;
        }),
      })),
      // Esta línea sirve para declarar la propiedad «leave» con el valor o tipo «jest.fn()».
      leave: jest.fn(),
    });
    // Esta línea sirve para esperar el resultado de «useChatStore.getState».
    await useChatStore.getState().openThread(9);

    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce(message);
    // Esta línea sirve para esperar el resultado de «useChatStore.getState».
    await useChatStore.getState().sendMessage('Hola');
    // Esta línea sirve para extraer «is_mine: _ignored, ...broadcast» de «message».
    const { is_mine: _ignored, ...broadcast } = message;
    // Esta línea sirve para llamar a «broadcastCallback» si está definida.
    broadcastCallback?.(broadcast);

    // Esta línea sirve para verificar que «useChatStore.getState(» cumple «messages».
    expect(useChatStore.getState().messages).toEqual([message]);
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useAuthStore.setState({ user: null });
  });

  // Esta línea sirve para declarar la prueba que verifica que «marks a broadcast from my own user as mine even if it arrives before t».
  it('marks a broadcast from my own user as mine even if it arrives before the POST response', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useAuthStore.setState({ user: { id: 5 } as any });
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([]);
    // Esta línea sirve para declarar la variable «broadcastCallback» de tipo «((payload: unknown) => void) | undefined» sin valor inicial.
    let broadcastCallback: ((payload: unknown) => void) | undefined;
    // Esta línea sirve para definir lo que devuelve el espía «mockedGetEcho».
    mockedGetEcho.mockReturnValue({
      // Esta línea sirve para declarar la propiedad «private» con el valor o tipo «jest.fn(() => ({».
      private: jest.fn(() => ({
        // Esta línea sirve para definir «listen» con «jest.fn((_event: string, cb: typeof broa…».
        listen: jest.fn((_event: string, cb: typeof broadcastCallback) => {
          // Esta línea sirve para asignar «cb» a «broadcastCallback».
          broadcastCallback = cb;
        }),
      })),
      // Esta línea sirve para declarar la propiedad «leave» con el valor o tipo «jest.fn()».
      leave: jest.fn(),
    });
    // Esta línea sirve para esperar el resultado de «useChatStore.getState».
    await useChatStore.getState().openThread(9);

    // Esta línea sirve para extraer «is_mine: _ignored, ...broadcast» de «message».
    const { is_mine: _ignored, ...broadcast } = message;
    // Esta línea sirve para llamar a «broadcastCallback» si está definida.
    broadcastCallback?.(broadcast);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce(message);
    // Esta línea sirve para esperar el resultado de «useChatStore.getState».
    await useChatStore.getState().sendMessage('Hola');

    // Esta línea sirve para verificar que «useChatStore.getState(» cumple «messages».
    expect(useChatStore.getState().messages).toEqual([message]);
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useAuthStore.setState({ user: null });
  });
});
