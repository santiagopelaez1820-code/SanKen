import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { AppNotification } from '@sanken/core';

import { api } from '@/lib/api';
import { getEcho } from '@/lib/echo';
import { useAuthStore } from '@/store/auth-store';
import { useNotificationsStore } from './notifications-store';

jest.mock('@/lib/api', () => ({
  api: { get: jest.fn(), getWithMeta: jest.fn(), post: jest.fn() },
}));

jest.mock('@/lib/echo', () => ({
  getEcho: jest.fn(),
}));

const mockedApi = api as jest.Mocked<typeof api>;
const mockedGetEcho = getEcho as jest.Mock;

const notification: AppNotification = {
  id: 'uuid-1',
  type: 'NewChatMessageNotification',
  data: { conversation_id: 9, sender_name: 'Coach Ana', body: 'Hola' },
  read_at: null,
  created_at: '2026-08-12T10:00:00Z',
};

beforeEach(() => {
  jest.clearAllMocks();
  useNotificationsStore.setState({ notifications: [], unreadCount: 0, isLoading: false });
});

describe('load', () => {
  it('stores notifications and the unread count', async () => {
    mockedApi.getWithMeta.mockResolvedValueOnce({ data: [notification], meta: { unread_count: 1 } });

    await useNotificationsStore.getState().load();

    expect(mockedApi.getWithMeta).toHaveBeenCalledWith('/notifications');
    expect(useNotificationsStore.getState().notifications).toEqual([notification]);
    expect(useNotificationsStore.getState().unreadCount).toBe(1);
  });
});

describe('markRead / markAllRead', () => {
  it('marks one notification read and reloads', async () => {
    mockedApi.post.mockResolvedValueOnce(undefined);
    mockedApi.getWithMeta.mockResolvedValueOnce({ data: [], meta: { unread_count: 0 } });

    await useNotificationsStore.getState().markRead('uuid-1');

    expect(mockedApi.post).toHaveBeenCalledWith('/notifications/uuid-1/read');
    expect(mockedApi.getWithMeta).toHaveBeenCalledWith('/notifications');
  });

  it('marks all read and reloads', async () => {
    mockedApi.post.mockResolvedValueOnce(undefined);
    mockedApi.getWithMeta.mockResolvedValueOnce({ data: [], meta: { unread_count: 0 } });

    await useNotificationsStore.getState().markAllRead();

    expect(mockedApi.post).toHaveBeenCalledWith('/notifications/read-all');
  });
});

describe('subscribe', () => {
  it('subscribes to the users own private channel for the native notification event', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useAuthStore.setState({ user: { id: 42 } as any });
    const listen = jest.fn();
    const echo = { private: jest.fn(() => ({ notification: listen })) };
    mockedGetEcho.mockReturnValue(echo);

    useNotificationsStore.getState().subscribe();

    expect(echo.private).toHaveBeenCalledWith('App.Models.User.42');
    expect(listen).toHaveBeenCalledWith(expect.any(Function));
  });
});
