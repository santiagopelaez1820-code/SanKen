import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { FeedItem } from '@sanken/core';

import { api } from '@/lib/api';
import { getEcho } from '@/lib/echo';
import { useAuthStore } from '@/store/auth-store';
import { useFeedStore } from './feed-store';

jest.mock('@/lib/api', () => ({
  api: { get: jest.fn(), getWithMeta: jest.fn(), post: jest.fn() },
}));

jest.mock('@/lib/echo', () => ({
  getEcho: jest.fn(),
}));

const mockedApi = api as jest.Mocked<typeof api>;
const mockedGetEcho = getEcho as jest.Mock;

const newsItem: FeedItem = {
  feed_type: 'news',
  id: '1',
  title: 'Nueva funcionalidad',
  body: 'Descripción',
  image_url: null,
  kind: null,
  data: null,
  read_at: null,
  created_at: '2026-08-19T00:00:00Z',
};

const notificationItem: FeedItem = {
  feed_type: 'notification',
  id: 'uuid-1',
  title: null,
  body: null,
  image_url: null,
  kind: 'NewChatMessageNotification',
  data: { conversation_id: 9, sender_name: 'Coach Ana', body: 'Hola' },
  read_at: null,
  created_at: '2026-08-12T10:00:00Z',
};

beforeEach(() => {
  jest.clearAllMocks();
  useFeedStore.setState({ items: [], unreadCount: 0, isLoading: false, error: null });
});

describe('load', () => {
  it('stores the merged feed and the unread count', async () => {
    mockedApi.getWithMeta.mockResolvedValueOnce({ data: [newsItem, notificationItem], meta: { unread_count: 2 } });

    await useFeedStore.getState().load();

    expect(mockedApi.getWithMeta).toHaveBeenCalledWith('/feed');
    expect(useFeedStore.getState().items).toEqual([newsItem, notificationItem]);
    expect(useFeedStore.getState().unreadCount).toBe(2);
  });

  it('stores an error message on failure instead of silently showing an empty feed', async () => {
    mockedApi.getWithMeta.mockRejectedValueOnce(new Error('Network request failed'));

    await useFeedStore.getState().load();

    expect(useFeedStore.getState().isLoading).toBe(false);
    expect(useFeedStore.getState().error).toBe('Network request failed');
  });
});

describe('markRead / markAllRead', () => {
  // Bug del tester: tocar una notificación no la marcaba como leída hasta
  // salir y volver a entrar. Ahora se marca en el acto (optimista).
  it('marks a news item read immediately and calls the API with its feed_type', async () => {
    useFeedStore.setState({ items: [newsItem, notificationItem], unreadCount: 2 });
    mockedApi.post.mockResolvedValueOnce(undefined);

    await useFeedStore.getState().markRead(newsItem);

    expect(mockedApi.post).toHaveBeenCalledWith('/feed/news/1/read');
    const { items, unreadCount } = useFeedStore.getState();
    expect(items.find((i) => i.feed_type === 'news')?.read_at).not.toBeNull();
    expect(items.find((i) => i.feed_type === 'notification')?.read_at).toBeNull();
    expect(unreadCount).toBe(1);
    expect(mockedApi.getWithMeta).not.toHaveBeenCalled();
  });

  it('marks a notification item read using its feed_type', async () => {
    useFeedStore.setState({ items: [notificationItem], unreadCount: 1 });
    mockedApi.post.mockResolvedValueOnce(undefined);

    await useFeedStore.getState().markRead(notificationItem);

    expect(mockedApi.post).toHaveBeenCalledWith('/feed/notification/uuid-1/read');
    expect(useFeedStore.getState().unreadCount).toBe(0);
  });

  it('does nothing for an item that is already read', async () => {
    await useFeedStore.getState().markRead({ ...newsItem, read_at: '2026-08-20T00:00:00Z' });

    expect(mockedApi.post).not.toHaveBeenCalled();
  });

  it('reloads the real state when the API call fails', async () => {
    useFeedStore.setState({ items: [newsItem], unreadCount: 1 });
    mockedApi.post.mockRejectedValueOnce(new Error('boom'));
    mockedApi.getWithMeta.mockResolvedValueOnce({ data: [newsItem], meta: { unread_count: 1 } });

    await useFeedStore.getState().markRead(newsItem);

    expect(mockedApi.getWithMeta).toHaveBeenCalledWith('/feed');
    expect(useFeedStore.getState().unreadCount).toBe(1);
  });

  it('marks all read immediately', async () => {
    useFeedStore.setState({ items: [newsItem, notificationItem], unreadCount: 2 });
    mockedApi.post.mockResolvedValueOnce(undefined);

    await useFeedStore.getState().markAllRead();

    expect(mockedApi.post).toHaveBeenCalledWith('/feed/read-all');
    expect(useFeedStore.getState().unreadCount).toBe(0);
    expect(useFeedStore.getState().items.every((i) => i.read_at !== null)).toBe(true);
  });
});

describe('subscribe', () => {
  it('subscribes to the users own private channel for the native notification event', () => {
    useAuthStore.setState({ user: { id: 42 } as any });
    const listen = jest.fn();
    const echo = { private: jest.fn(() => ({ notification: listen })) };
    mockedGetEcho.mockReturnValue(echo);

    useFeedStore.getState().subscribe();

    expect(echo.private).toHaveBeenCalledWith('App.Models.User.42');
    expect(listen).toHaveBeenCalledWith(expect.any(Function));
  });
});
