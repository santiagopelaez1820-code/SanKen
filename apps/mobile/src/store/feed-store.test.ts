// Esta línea sirve para importar «beforeEach, describe, expect, it, jest» desde «@jest/globals».
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
// Esta línea sirve para importar los tipos «FeedItem» desde «@sanken/core».
import type { FeedItem } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «getEcho» desde «@/lib/echo».
import { getEcho } from '@/lib/echo';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';
// Esta línea sirve para importar «useFeedStore» desde «./feed-store».
import { useFeedStore } from './feed-store';

// Esta línea sirve para simular el módulo «@/lib/api» en la prueba.
jest.mock('@/lib/api', () => ({
  // Esta línea sirve para definir el estilo «api» con «get: jest.fn(), getWithMeta: jest.fn(), post: jest…».
  api: { get: jest.fn(), getWithMeta: jest.fn(), post: jest.fn() },
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

// Esta línea sirve para declarar el dato de ejemplo «newsItem» de tipo «FeedItem».
const newsItem: FeedItem = {
  // Esta línea sirve para declarar la propiedad «feed_type» con el valor o tipo «'news'».
  feed_type: 'news',
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «'1'».
  id: '1',
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «'Nueva funcionalidad'».
  title: 'Nueva funcionalidad',
  // Esta línea sirve para declarar la propiedad «body» con el valor o tipo «'Descripción'».
  body: 'Descripción',
  // Esta línea sirve para declarar la propiedad «image_url» con el valor o tipo «null».
  image_url: null,
  // Esta línea sirve para declarar la propiedad «kind» con el valor o tipo «null».
  kind: null,
  // Esta línea sirve para declarar la propiedad «data» con el valor o tipo «null».
  data: null,
  // Esta línea sirve para declarar la propiedad «read_at» con el valor o tipo «null».
  read_at: null,
  // Esta línea sirve para declarar la propiedad «created_at» con el valor o tipo «'2026-08-19T00:00:00Z'».
  created_at: '2026-08-19T00:00:00Z',
};

// Esta línea sirve para declarar el dato de ejemplo «notificationItem» de tipo «FeedItem».
const notificationItem: FeedItem = {
  // Esta línea sirve para declarar la propiedad «feed_type» con el valor o tipo «'notification'».
  feed_type: 'notification',
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «'uuid-1'».
  id: 'uuid-1',
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «null».
  title: null,
  // Esta línea sirve para declarar la propiedad «body» con el valor o tipo «null».
  body: null,
  // Esta línea sirve para declarar la propiedad «image_url» con el valor o tipo «null».
  image_url: null,
  // Esta línea sirve para declarar la propiedad «kind» con el valor o tipo «'NewChatMessageNotification'».
  kind: 'NewChatMessageNotification',
  // Esta línea sirve para definir el estilo «data» con «conversation_id: 9, sender_name: 'Coach Ana', body…».
  data: { conversation_id: 9, sender_name: 'Coach Ana', body: 'Hola' },
  // Esta línea sirve para declarar la propiedad «read_at» con el valor o tipo «null».
  read_at: null,
  // Esta línea sirve para declarar la propiedad «created_at» con el valor o tipo «'2026-08-12T10:00:00Z'».
  created_at: '2026-08-12T10:00:00Z',
};

// Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
beforeEach(() => {
  // Esta línea sirve para llamar a «jest.clearAllMocks».
  jest.clearAllMocks();
  // Esta línea sirve para fijar el estado inicial del store para la prueba.
  useFeedStore.setState({ items: [], unreadCount: 0, isLoading: false, error: null });
});

// Esta línea sirve para agrupar las pruebas de «load».
describe('load', () => {
  // Esta línea sirve para declarar la prueba que verifica que «stores the merged feed and the unread count».
  it('stores the merged feed and the unread count', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.getWithMeta».
    mockedApi.getWithMeta.mockResolvedValueOnce({ data: [newsItem, notificationItem], meta: { unread_count: 2 } });

    // Esta línea sirve para esperar el resultado de «useFeedStore.getState».
    await useFeedStore.getState().load();

    // Esta línea sirve para verificar que «mockedApi.getWithMeta» cumple «toHaveBeenCalledWith».
    expect(mockedApi.getWithMeta).toHaveBeenCalledWith('/feed');
    // Esta línea sirve para verificar que «useFeedStore.getState(» cumple «items».
    expect(useFeedStore.getState().items).toEqual([newsItem, notificationItem]);
    // Esta línea sirve para verificar que «useFeedStore.getState(» cumple «unreadCount».
    expect(useFeedStore.getState().unreadCount).toBe(2);
  });

  // Esta línea sirve para declarar la prueba que verifica que «stores an error message on failure instead of silently showing an empt».
  it('stores an error message on failure instead of silently showing an empty feed', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.getWithMeta».
    mockedApi.getWithMeta.mockRejectedValueOnce(new Error('Network request failed'));

    // Esta línea sirve para esperar el resultado de «useFeedStore.getState».
    await useFeedStore.getState().load();

    // Esta línea sirve para verificar que «useFeedStore.getState(» cumple «isLoading».
    expect(useFeedStore.getState().isLoading).toBe(false);
    // Esta línea sirve para verificar que «useFeedStore.getState(» cumple «error».
    expect(useFeedStore.getState().error).toBe('Network request failed');
  });
});

// Esta línea sirve para agrupar las pruebas de «markRead / markAllRead».
describe('markRead / markAllRead', () => {
  // Bug del tester: tocar una notificación no la marcaba como leída hasta
  // salir y volver a entrar. Ahora se marca en el acto (optimista).
  // Esta línea sirve para declarar la prueba que verifica que «marks a news item read immediately and calls the API with its feed_typ».
  it('marks a news item read immediately and calls the API with its feed_type', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useFeedStore.setState({ items: [newsItem, notificationItem], unreadCount: 2 });
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce(undefined);

    // Esta línea sirve para esperar el resultado de «useFeedStore.getState».
    await useFeedStore.getState().markRead(newsItem);

    // Esta línea sirve para verificar que «mockedApi.post» cumple «toHaveBeenCalledWith».
    expect(mockedApi.post).toHaveBeenCalledWith('/feed/news/1/read');
    // Esta línea sirve para extraer «items, unreadCount» de «useFeedStore.getState()».
    const { items, unreadCount } = useFeedStore.getState();
    // Esta línea sirve para verificar que «items.find((i) => i.feed_type === 'news')?.read_at» no cumple «toBeNull».
    expect(items.find((i) => i.feed_type === 'news')?.read_at).not.toBeNull();
    // Esta línea sirve para verificar que la notificación sigue sin leer.
    expect(items.find((i) => i.feed_type === 'notification')?.read_at).toBeNull();
    // Esta línea sirve para verificar que «unreadCount» cumple «toBe».
    expect(unreadCount).toBe(1);
    // Esta línea sirve para verificar que «mockedApi.getWithMeta» no cumple «toHaveBeenCalled».
    expect(mockedApi.getWithMeta).not.toHaveBeenCalled();
  });

  // Esta línea sirve para declarar la prueba que verifica que «marks a notification item read using its feed_type».
  it('marks a notification item read using its feed_type', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useFeedStore.setState({ items: [notificationItem], unreadCount: 1 });
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce(undefined);

    // Esta línea sirve para esperar el resultado de «useFeedStore.getState».
    await useFeedStore.getState().markRead(notificationItem);

    // Esta línea sirve para verificar que «mockedApi.post» cumple «toHaveBeenCalledWith».
    expect(mockedApi.post).toHaveBeenCalledWith('/feed/notification/uuid-1/read');
    // Esta línea sirve para verificar que «useFeedStore.getState(» cumple «unreadCount».
    expect(useFeedStore.getState().unreadCount).toBe(0);
  });

  // Esta línea sirve para declarar la prueba que verifica que «does nothing for an item that is already read».
  it('does nothing for an item that is already read', async () => {
    // Esta línea sirve para esperar el resultado de «useFeedStore.getState».
    await useFeedStore.getState().markRead({ ...newsItem, read_at: '2026-08-20T00:00:00Z' });

    // Esta línea sirve para verificar que «mockedApi.post» no cumple «toHaveBeenCalled».
    expect(mockedApi.post).not.toHaveBeenCalled();
  });

  // Esta línea sirve para declarar la prueba que verifica que «reloads the real state when the API call fails».
  it('reloads the real state when the API call fails', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useFeedStore.setState({ items: [newsItem], unreadCount: 1 });
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockRejectedValueOnce(new Error('boom'));
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.getWithMeta».
    mockedApi.getWithMeta.mockResolvedValueOnce({ data: [newsItem], meta: { unread_count: 1 } });

    // Esta línea sirve para esperar el resultado de «useFeedStore.getState».
    await useFeedStore.getState().markRead(newsItem);

    // Esta línea sirve para verificar que «mockedApi.getWithMeta» cumple «toHaveBeenCalledWith».
    expect(mockedApi.getWithMeta).toHaveBeenCalledWith('/feed');
    // Esta línea sirve para verificar que «useFeedStore.getState(» cumple «unreadCount».
    expect(useFeedStore.getState().unreadCount).toBe(1);
  });

  // Esta línea sirve para declarar la prueba que verifica que «marks all read immediately».
  it('marks all read immediately', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useFeedStore.setState({ items: [newsItem, notificationItem], unreadCount: 2 });
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce(undefined);

    // Esta línea sirve para esperar el resultado de «useFeedStore.getState».
    await useFeedStore.getState().markAllRead();

    // Esta línea sirve para verificar que «mockedApi.post» cumple «toHaveBeenCalledWith».
    expect(mockedApi.post).toHaveBeenCalledWith('/feed/read-all');
    // Esta línea sirve para verificar que «useFeedStore.getState(» cumple «unreadCount».
    expect(useFeedStore.getState().unreadCount).toBe(0);
    // Esta línea sirve para verificar que «useFeedStore.getState(» cumple «items».
    expect(useFeedStore.getState().items.every((i) => i.read_at !== null)).toBe(true);
  });
});

// Esta línea sirve para agrupar las pruebas de «subscribe».
describe('subscribe', () => {
  // Esta línea sirve para declarar la prueba que verifica que «subscribes to the users own private channel for the native notificatio».
  it('subscribes to the users own private channel for the native notification event', () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useAuthStore.setState({ user: { id: 42 } as any });
    // Esta línea sirve para crear «listen» llamando a «jest.fn».
    const listen = jest.fn();
    // Esta línea sirve para extraer «ch» de «{ private: jest.fn(() => ({ notification».
    const echo = { private: jest.fn(() => ({ notification: listen })) };
    // Esta línea sirve para definir lo que devuelve el espía «mockedGetEcho».
    mockedGetEcho.mockReturnValue(echo);

    // Esta línea sirve para invocar la acción «subscribe» del store de «Feed».
    useFeedStore.getState().subscribe();

    // Esta línea sirve para verificar que «echo.private» cumple «toHaveBeenCalledWith».
    expect(echo.private).toHaveBeenCalledWith('App.Models.User.42');
    // Esta línea sirve para verificar que «listen» cumple «toHaveBeenCalledWith».
    expect(listen).toHaveBeenCalledWith(expect.any(Function));
  });
});
