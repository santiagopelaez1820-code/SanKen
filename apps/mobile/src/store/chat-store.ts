import { create } from 'zustand';
import type { ChatMessage, ConversationSummary, ConversationWithMessages, MessageSentBroadcast } from '@sanken/core';

import { api } from '@/lib/api';
import { getEcho } from '@/lib/echo';

interface ChatStoreState {
  conversations: ConversationSummary[];
  isLoadingInbox: boolean;
  inboxError: string | null;

  activeConversationId: number | null;
  messages: ChatMessage[];
  isLoadingThread: boolean;

  loadInbox: () => Promise<void>;
  openConversationForTrainerClient: (trainerClientId: number) => Promise<number>;
  openThread: (conversationId: number) => Promise<void>;
  closeThread: () => void;
  sendMessage: (body: string) => Promise<void>;
}

// Fuera del store, igual que en retos-store: es el handle de limpieza del
// canal de Reverb, vive mientras haya un hilo abierto.
let leaveChannel: (() => void) | null = null;

export const useChatStore = create<ChatStoreState>((set, get) => ({
  conversations: [],
  isLoadingInbox: false,
  inboxError: null,
  activeConversationId: null,
  messages: [],
  isLoadingThread: false,

  loadInbox: async () => {
    set({ isLoadingInbox: true, inboxError: null });
    try {
      const conversations = await api.get<ConversationSummary[]>('/conversations');
      set({ conversations, isLoadingInbox: false });
    } catch (err) {
      set({
        isLoadingInbox: false,
        inboxError: err instanceof Error ? err.message : 'No se pudieron cargar tus conversaciones.',
      });
    }
  },

  openConversationForTrainerClient: async (trainerClientId) => {
    const res = await api.get<ConversationWithMessages>(`/trainer-clients/${trainerClientId}/conversation`);
    return res.conversation_id;
  },

  openThread: async (conversationId) => {
    get().closeThread();
    set({ activeConversationId: conversationId, messages: [], isLoadingThread: true });

    const messages = await api.get<ChatMessage[]>(`/conversations/${conversationId}/messages`);
    if (get().activeConversationId !== conversationId) return; // se cerró mientras cargaba
    set({ messages, isLoadingThread: false });

    const echo = getEcho();
    const channel = echo.private(`conversations.${conversationId}`);
    channel.listen('.message.sent', (payload: MessageSentBroadcast) => {
      set((state) => ({ messages: [...state.messages, { ...payload, is_mine: false }] }));
    });
    leaveChannel = () => echo.leave(`conversations.${conversationId}`);
  },

  closeThread: () => {
    leaveChannel?.();
    leaveChannel = null;
    set({ activeConversationId: null, messages: [] });
  },

  sendMessage: async (body) => {
    const conversationId = get().activeConversationId;
    if (!conversationId) return;

    const message = await api.post<ChatMessage>(`/conversations/${conversationId}/messages`, { body });
    set((state) => ({ messages: [...state.messages, message] }));
  },
}));
