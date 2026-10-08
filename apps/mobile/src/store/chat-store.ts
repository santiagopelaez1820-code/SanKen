// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para importar los tipos «ChatMessage, ConversationSummary, ConversationWithMessages, MessageSentBroadcast» desde «@sanken/core».
import type { ChatMessage, ConversationSummary, ConversationWithMessages, MessageSentBroadcast } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';
// Esta línea sirve para importar «getEcho» desde «@/lib/echo».
import { getEcho } from '@/lib/echo';

// Esta línea sirve para declarar la interfaz «ChatStoreState».
interface ChatStoreState {
  // Esta línea sirve para declarar la propiedad «conversations» con el valor o tipo «ConversationSummary[]».
  conversations: ConversationSummary[];
  // Esta línea sirve para declarar la propiedad «isLoadingInbox» con el valor o tipo «boolean».
  isLoadingInbox: boolean;
  // Esta línea sirve para declarar la propiedad «inboxError» con el valor o tipo «string | null».
  inboxError: string | null;

  // Esta línea sirve para declarar la propiedad «activeConversationId» con el valor o tipo «number | null».
  activeConversationId: number | null;
  // Esta línea sirve para declarar la propiedad «messages» con el valor o tipo «ChatMessage[]».
  messages: ChatMessage[];
  // Esta línea sirve para declarar la propiedad «isLoadingThread» con el valor o tipo «boolean».
  isLoadingThread: boolean;

  // Esta línea sirve para declarar la propiedad «loadInbox» con el valor o tipo «() => Promise<void>».
  loadInbox: () => Promise<void>;
  // Esta línea sirve para declarar la propiedad «openConversationForTrainerClient» con el valor o tipo «(trainerClientId: number) => Promise<number>».
  openConversationForTrainerClient: (trainerClientId: number) => Promise<number>;
  // Esta línea sirve para declarar la propiedad «openThread» con el valor o tipo «(conversationId: number) => Promise<void>».
  openThread: (conversationId: number) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «closeThread» con el valor o tipo «() => void».
  closeThread: () => void;
  /** false si el envío falló — la pantalla devuelve el texto al input para reintentar. */
  // Esta línea sirve para declarar la propiedad «sendMessage» con el valor o tipo «(body: string) => Promise<boolean>».
  sendMessage: (body: string) => Promise<boolean>;
}

// Fuera del store, igual que en retos-store: es el handle de limpieza del
// canal de Reverb, vive mientras haya un hilo abierto.
// Esta línea sirve para declarar la variable «leaveChannel» de tipo «(() => void) | null = null» sin valor inicial.
let leaveChannel: (() => void) | null = null;

// Esta línea sirve para declarar «useChatStore» con el valor «create<ChatStoreState>((set, get) => ({».
export const useChatStore = create<ChatStoreState>((set, get) => ({
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

  // Esta línea sirve para declarar la propiedad «loadInbox» con el valor o tipo «async () => {».
  loadInbox: async () => {
    // Esta línea sirve para guardar en el store: «isLoadingInbox: true, inboxError: null })…».
    set({ isLoadingInbox: true, inboxError: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<ConversationSummary[]>('/conversations')» y guardar el resultado en «conversations».
      const conversations = await api.get<ConversationSummary[]>('/conversations');
      // Esta línea sirve para guardar en el store: «conversations, isLoadingInbox: false })…».
      set({ conversations, isLoadingInbox: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «isLoadingInbox» con el valor o tipo «false».
        isLoadingInbox: false,
        // Esta línea sirve para definir «inboxError» con «err instanceof Error ? err.message : 'No…».
        inboxError: err instanceof Error ? err.message : 'No se pudieron cargar tus conversaciones.',
      });
    }
  },

  // Esta línea sirve para declarar la propiedad «openConversationForTrainerClient» con el valor o tipo «async (trainerClientId) => {».
  openConversationForTrainerClient: async (trainerClientId) => {
    // Esta línea sirve para esperar «api.get<ConversationWithMessages>(`/trainer-client» y guardar el resultado en «res».
    const res = await api.get<ConversationWithMessages>(`/trainer-clients/${trainerClientId}/conversation`);
    // Esta línea sirve para devolver «res.conversation_id».
    return res.conversation_id;
  },

  // Esta línea sirve para declarar la propiedad «openThread» con el valor o tipo «async (conversationId) => {».
  openThread: async (conversationId) => {
    // Esta línea sirve para llamar a «get» con «).closeThread(».
    get().closeThread();
    // Esta línea sirve para guardar en el store: «activeConversationId: conversationId, messages: [], isLoadin…».
    set({ activeConversationId: conversationId, messages: [], isLoadingThread: true });

    // Esta línea sirve para declarar la variable «messages» de tipo «ChatMessage[]» sin valor inicial.
    let messages: ChatMessage[];
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para pedir los mensajes de la conversación a la API.
      messages = await api.get<ChatMessage[]>(`/conversations/${conversationId}/messages`);
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // Sin esto el skeleton quedaba girando para siempre si la request fallaba.
      // Esta línea sirve para llamar a «set» si «get().activeConversationId === conversationId».
      if (get().activeConversationId === conversationId) set({ isLoadingThread: false });
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }
    // Esta línea sirve para salir si la conversación se cerró mientras cargaba.
    if (get().activeConversationId !== conversationId) return; // se cerró mientras cargaba
    // Esta línea sirve para guardar en el store: «messages, isLoadingThread: false })…».
    set({ messages, isLoadingThread: false });

    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para extraer «ch» de «getEcho()».
      const echo = getEcho();
      // Esta línea sirve para extraer «hanne» de «echo.private(`conversations.${conversati».
      const channel = echo.private(`conversations.${conversationId}`);
      // Esta línea sirve para escuchar los mensajes nuevos del canal.
      channel.listen('.message.sent', (payload: MessageSentBroadcast) => {
        // El backend transmite a todo el canal (no usa toOthers(): el
        // mobile autentica por token y no manda X-Socket-ID), así que quien
        // envía también recibe su propio mensaje. Antes se agregaba siempre
        // como "del otro" y se veía duplicado. Se deduplica por id (el POST
        // y el broadcast pueden llegar en cualquier orden) y is_mine sale
        // del usuario autenticado.
        // Esta línea sirve para extraer «yI» de «useAuthStore.getState().user?.id».
        const myId = useAuthStore.getState().user?.id;
        // Esta línea sirve para actualizar los mensajes a partir del estado anterior.
        set((state) =>
          // Esta línea sirve para llamar a «state.messages.some» con «(m) => m.id === payload.id».
          state.messages.some((m) => m.id === payload.id)
            // Esta línea sirve para conservar el estado si el mensaje ya existe.
            ? state
            // Esta línea sirve para agregar el mensaje recibido marcando si es mío.
            : { messages: [...state.messages, { ...payload, is_mine: payload.sender_id === myId }] }
        );
      });
      // Esta línea sirve para guardar la función que abandona el canal.
      leaveChannel = () => echo.leave(`conversations.${conversationId}`);
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Ver el comentario en notifications-store.ts: si el websocket no
      // conecta, el hilo se queda usable sin mensajes en vivo en vez de
      // romper toda la pantalla.
      // Esta línea sirve para avisar que no se pudo suscribir al chat en vivo.
      console.warn('No se pudo suscribir al chat en vivo:', err);
    }
  },

  // Esta línea sirve para declarar la propiedad «closeThread» con el valor o tipo «() => {».
  closeThread: () => {
    // Esta línea sirve para llamar a «leaveChannel» si está definida.
    leaveChannel?.();
    // Esta línea sirve para asignar «null» a «leaveChannel».
    leaveChannel = null;
    // Esta línea sirve para guardar en el store: «activeConversationId: null, messages: [] })…».
    set({ activeConversationId: null, messages: [] });
  },

  // Esta línea sirve para declarar la propiedad «sendMessage» con el valor o tipo «async (body) => {».
  sendMessage: async (body) => {
    // Esta línea sirve para extraer «onversationI» de «get().activeConversationId».
    const conversationId = get().activeConversationId;
    // Esta línea sirve para devolver «false» si «!conversationId».
    if (!conversationId) return false;

    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.post<ChatMessage>(`/conversations/${conversati» y guardar el resultado en «message».
      const message = await api.post<ChatMessage>(`/conversations/${conversationId}/messages`, { body });
      // Esta línea sirve para actualizar los mensajes a partir del estado anterior.
      set((state) =>
        // Esta línea sirve para llamar a «state.messages.some» con «(m) => m.id === message.id».
        state.messages.some((m) => m.id === message.id)
          // Esta línea sirve para reemplazar el mensaje si ya existe.
          ? { messages: state.messages.map((m) => (m.id === message.id ? message : m)) }
          // Esta línea sirve para agregar el mensaje si es nuevo.
          : { messages: [...state.messages, message] }
      );
      // Esta línea sirve para devolver «true».
      return true;
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // Esta línea sirve para devolver «false».
      return false;
    }
  },
}));
