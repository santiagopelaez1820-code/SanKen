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

  // Optimista: la tarjeta deja de verse como no leída en el mismo toque, sin
  // esperar al round-trip. Si el servidor falla se recarga el estado real.
  markRead: async (item: FeedItem) => {
    if (item.read_at) return;
    const readAt = new Date().toISOString();
    set((state) => ({
      items: state.items.map((i) =>
        i.feed_type === item.feed_type && i.id === item.id ? { ...i, read_at: readAt } : i
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
    try {
      await api.post(`/feed/${item.feed_type as FeedItemType}/${item.id}/read`);
    } catch {
      await get().load();
    }
  },

  markAllRead: async () => {
    const readAt = new Date().toISOString();
    set((state) => ({
      items: state.items.map((i) => (i.read_at ? i : { ...i, read_at: readAt })),
      unreadCount: 0,
    }));
    try {
      await api.post('/feed/read-all');
    } catch {
      await get().load();
    }
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
