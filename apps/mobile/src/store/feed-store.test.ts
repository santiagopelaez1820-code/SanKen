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
  useFeedStore.setState({ items: [], unreadCount: 0, isLoading: false });
});

describe('load', () => {
  it('stores the merged feed and the unread count', async () => {
    mockedApi.getWithMeta.mockResolvedValueOnce({ data: [newsItem, notificationItem], meta: { unread_count: 2 } });

    await useFeedStore.getState().load();

    expect(mockedApi.getWithMeta).toHaveBeenCalledWith('/feed');
    expect(useFeedStore.getState().items).toEqual([newsItem, notificationItem]);
    expect(useFeedStore.getState().unreadCount).toBe(2);
  });
});

describe('markRead / markAllRead', () => {
  it('marks a news item read using its feed_type and reloads', async () => {
    mockedApi.post.mockResolvedValueOnce(undefined);
    mockedApi.getWithMeta.mockResolvedValueOnce({ data: [], meta: { unread_count: 0 } });

    await useFeedStore.getState().markRead(newsItem);

    expect(mockedApi.post).toHaveBeenCalledWith('/feed/news/1/read');
    expect(mockedApi.getWithMeta).toHaveBeenCalledWith('/feed');
  });

  it('marks a notification item read using its feed_type and reloads', async () => {
    mockedApi.post.mockResolvedValueOnce(undefined);
    mockedApi.getWithMeta.mockResolvedValueOnce({ data: [], meta: { unread_count: 0 } });

    await useFeedStore.getState().markRead(notificationItem);

    expect(mockedApi.post).toHaveBeenCalledWith('/feed/notification/uuid-1/read');
  });

  it('marks all read and reloads', async () => {
    mockedApi.post.mockResolvedValueOnce(undefined);
    mockedApi.getWithMeta.mockResolvedValueOnce({ data: [], meta: { unread_count: 0 } });

    await useFeedStore.getState().markAllRead();

    expect(mockedApi.post).toHaveBeenCalledWith('/feed/read-all');
  });
});

describe('subscribe', () => {
  it('subscribes to the users own private channel for the native notification event', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useAuthStore.setState({ user: { id: 42 } as any });
    const listen = jest.fn();
    const echo = { private: jest.fn(() => ({ notification: listen })) };
    mockedGetEcho.mockReturnValue(echo);

    useFeedStore.getState().subscribe();

    expect(echo.private).toHaveBeenCalledWith('App.Models.User.42');
    expect(listen).toHaveBeenCalledWith(expect.any(Function));
  });
});
