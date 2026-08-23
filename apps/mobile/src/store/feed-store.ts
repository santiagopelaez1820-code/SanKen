import { create } from 'zustand';
import type { FeedItem, FeedItemType } from '@sanken/core';

import { api } from '@/lib/api';
import { getEcho } from '@/lib/echo';
import { useAuthStore } from '@/store/auth-store';

interface FeedStoreState {
  items: FeedItem[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  load: () => Promise<void>;
  markRead: (item: FeedItem) => Promise<void>;
  markAllRead: () => Promise<void>;
  subscribe: () => void;
}

// La suscripción vive mientras dure la sesión de la app (no por pantalla) —
// este flag evita registrar el mismo listener dos veces si subscribe() se
// llama desde más de una pantalla. Mismo patrón que antes tenía
// notifications-store.ts.
let subscribed = false;

export const useFeedStore = create<FeedStoreState>((set, get) => ({
  items: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.getWithMeta<FeedItem[]>('/feed');
      set({
        items: res.data,
        unreadCount: (res.meta?.unread_count as number | undefined) ?? 0,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudieron cargar tus novedades.' });
    }
  },

  markRead: async (item: FeedItem) => {
    await api.post(`/feed/${item.feed_type as FeedItemType}/${item.id}/read`);
    await get().load();
  },

  markAllRead: async () => {
    await api.post('/feed/read-all');
    await get().load();
  },

  subscribe: () => {
    if (subscribed) return;
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;
    subscribed = true;

    try {
      const echo = getEcho();
      const channel = echo.private(`App.Models.User.${userId}`);
      channel.notification(() => {
        get().load();
      });
    } catch (err) {
      // No tirar abajo toda la app si el websocket no puede conectar (ver
      // el comentario en packages/core/src/realtime/echo.ts sobre el bug
      // de laravel-echo bajo Hermes) — el feed simplemente no se actualiza
      // en vivo, se sigue viendo al hacer load() manual.
      subscribed = false;
      console.warn('No se pudo suscribir al feed en vivo:', err);
    }
  },
}));
