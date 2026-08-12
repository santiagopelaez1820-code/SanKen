import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { ChatMessage, ConversationSummary, ConversationWithMessages } from '@sanken/core';

import { api } from '@/lib/api';
import { getEcho } from '@/lib/echo';
import { useChatStore } from './chat-store';

jest.mock('@/lib/api', () => ({
  api: { get: jest.fn(), post: jest.fn() },
}));

jest.mock('@/lib/echo', () => ({
  getEcho: jest.fn(),
}));

const mockedApi = api as jest.Mocked<typeof api>;
const mockedGetEcho = getEcho as jest.Mock;

const message: ChatMessage = {
  id: 1,
  conversation_id: 9,
  sender_id: 5,
  sender_name: 'Coach Ana',
  body: 'Hola',
  is_mine: true,
  created_at: '2026-08-12T10:00:00Z',
};

beforeEach(() => {
  jest.clearAllMocks();
  useChatStore.setState({
    conversations: [],
    isLoadingInbox: false,
    inboxError: null,
    activeConversationId: null,
    messages: [],
    isLoadingThread: false,
  });
});

describe('loadInbox', () => {
  it('stores the fetched conversations', async () => {
    const summary: ConversationSummary = {
      id: 9,
      trainer_client_id: 3,
      other_party: { id: 5, name: 'Coach Ana' },
      last_message: { body: 'Hola', sender_id: 5, created_at: '2026-08-12T10:00:00Z' },
      unread_count: 1,
    };
    mockedApi.get.mockResolvedValueOnce([summary]);

    await useChatStore.getState().loadInbox();

    expect(mockedApi.get).toHaveBeenCalledWith('/conversations');
    expect(useChatStore.getState().conversations).toEqual([summary]);
  });

  it('sets an error on failure', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('network down'));

    await useChatStore.getState().loadInbox();

    expect(useChatStore.getState().inboxError).toBe('network down');
  });
});

describe('openConversationForTrainerClient', () => {
  it('resolves the conversation id for a trainer_client relationship', async () => {
    const response: ConversationWithMessages = { conversation_id: 9, messages: [] };
    mockedApi.get.mockResolvedValueOnce(response);

    const id = await useChatStore.getState().openConversationForTrainerClient(3);

    expect(mockedApi.get).toHaveBeenCalledWith('/trainer-clients/3/conversation');
    expect(id).toBe(9);
  });
});

describe('openThread / closeThread', () => {
  it('fetches recent messages and subscribes to the private channel', async () => {
    mockedApi.get.mockResolvedValueOnce([message]);
    const listen = jest.fn();
    const echo = { private: jest.fn(() => ({ listen })), leave: jest.fn() };
    mockedGetEcho.mockReturnValue(echo);

    await useChatStore.getState().openThread(9);

    expect(mockedApi.get).toHaveBeenCalledWith('/conversations/9/messages');
    expect(useChatStore.getState().messages).toEqual([message]);
    expect(useChatStore.getState().activeConversationId).toBe(9);
    expect(echo.private).toHaveBeenCalledWith('conversations.9');
    expect(listen).toHaveBeenCalledWith('.message.sent', expect.any(Function));
  });

  it('appends incoming broadcast messages as not mine', async () => {
    mockedApi.get.mockResolvedValueOnce([]);
    let broadcastCallback: ((payload: unknown) => void) | undefined;
    const echo = {
      private: jest.fn(() => ({
        listen: jest.fn((_event: string, cb: typeof broadcastCallback) => {
          broadcastCallback = cb;
        }),
      })),
      leave: jest.fn(),
    };
    mockedGetEcho.mockReturnValue(echo);

    await useChatStore.getState().openThread(9);
    broadcastCallback?.({ ...message, id: 2 });

    expect(useChatStore.getState().messages).toEqual([{ ...message, id: 2, is_mine: false }]);
  });

  it('leaves the channel and clears state on close', async () => {
    mockedApi.get.mockResolvedValueOnce([]);
    const echo = { private: jest.fn(() => ({ listen: jest.fn() })), leave: jest.fn() };
    mockedGetEcho.mockReturnValue(echo);

    await useChatStore.getState().openThread(9);
    useChatStore.getState().closeThread();

    expect(echo.leave).toHaveBeenCalledWith('conversations.9');
    expect(useChatStore.getState().activeConversationId).toBeNull();
    expect(useChatStore.getState().messages).toEqual([]);
  });
});

describe('sendMessage', () => {
  it('posts to the active conversation and appends the result', async () => {
    mockedApi.get.mockResolvedValueOnce([]);
    const echo = { private: jest.fn(() => ({ listen: jest.fn() })), leave: jest.fn() };
    mockedGetEcho.mockReturnValue(echo);
    await useChatStore.getState().openThread(9);

    mockedApi.post.mockResolvedValueOnce(message);
    await useChatStore.getState().sendMessage('Hola');

    expect(mockedApi.post).toHaveBeenCalledWith('/conversations/9/messages', { body: 'Hola' });
    expect(useChatStore.getState().messages).toEqual([message]);
  });

  it('does nothing when there is no active conversation', async () => {
    await useChatStore.getState().sendMessage('Hola');
    expect(mockedApi.post).not.toHaveBeenCalled();
  });
});
