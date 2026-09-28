import { create } from 'zustand';
import type { ChatMessage, ConversationSummary, ConversationWithMessages, MessageSentBroadcast } from '@sanken/core';

import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
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
  /** false si el envío falló — la pantalla devuelve el texto al input para reintentar. */
  sendMessage: (body: string) => Promise<boolean>;
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

    let messages: ChatMessage[];
    try {
      messages = await api.get<ChatMessage[]>(`/conversations/${conversationId}/messages`);
    } catch {
      // Sin esto el skeleton quedaba girando para siempre si la request fallaba.
      if (get().activeConversationId === conversationId) set({ isLoadingThread: false });
      return;
    }
    if (get().activeConversationId !== conversationId) return; // se cerró mientras cargaba
    set({ messages, isLoadingThread: false });

    try {
      const echo = getEcho();
      const channel = echo.private(`conversations.${conversationId}`);
      channel.listen('.message.sent', (payload: MessageSentBroadcast) => {
        // El backend transmite a todo el canal (no usa toOthers(): el
        // mobile autentica por token y no manda X-Socket-ID), así que quien
        // envía también recibe su propio mensaje. Antes se agregaba siempre
        // como "del otro" y se veía duplicado. Se deduplica por id (el POST
        // y el broadcast pueden llegar en cualquier orden) y is_mine sale
        // del usuario autenticado.
        const myId = useAuthStore.getState().user?.id;
        set((state) =>
          state.messages.some((m) => m.id === payload.id)
            ? state
            : { messages: [...state.messages, { ...payload, is_mine: payload.sender_id === myId }] }
        );
      });
      leaveChannel = () => echo.leave(`conversations.${conversationId}`);
    } catch (err) {
      // Ver el comentario en notifications-store.ts: si el websocket no
      // conecta, el hilo se queda usable sin mensajes en vivo en vez de
      // romper toda la pantalla.
      console.warn('No se pudo suscribir al chat en vivo:', err);
    }
  },

  closeThread: () => {
    leaveChannel?.();
    leaveChannel = null;
    set({ activeConversationId: null, messages: [] });
  },

  sendMessage: async (body) => {
    const conversationId = get().activeConversationId;
    if (!conversationId) return false;

    try {
      const message = await api.post<ChatMessage>(`/conversations/${conversationId}/messages`, { body });
      set((state) =>
        state.messages.some((m) => m.id === message.id)
          ? { messages: state.messages.map((m) => (m.id === message.id ? message : m)) }
          : { messages: [...state.messages, message] }
      );
      return true;
    } catch {
      return false;
    }
  },
}));
