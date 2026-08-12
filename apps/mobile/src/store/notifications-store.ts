import { create } from 'zustand';
import type { AppNotification } from '@sanken/core';

import { api } from '@/lib/api';
import { getEcho } from '@/lib/echo';
import { useAuthStore } from '@/store/auth-store';

interface NotificationsStoreState {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;

  load: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  subscribe: () => void;
}

// La suscripción vive mientras dure la sesión de la app (no por pantalla,
// a diferencia del hilo de chat) — este flag evita registrar el mismo
// listener dos veces si subscribe() se llama desde más de una pantalla.
let subscribed = false;

export const useNotificationsStore = create<NotificationsStoreState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  load: async () => {
    set({ isLoading: true });
    try {
      const res = await api.getWithMeta<AppNotification[]>('/notifications');
      set({
        notifications: res.data,
        unreadCount: (res.meta?.unread_count as number | undefined) ?? 0,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  markRead: async (id) => {
    await api.post(`/notifications/${id}/read`);
    await get().load();
  },

  markAllRead: async () => {
    await api.post('/notifications/read-all');
    await get().load();
  },

  subscribe: () => {
    if (subscribed) return;
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;
    subscribed = true;

    const echo = getEcho();
    const channel = echo.private(`App.Models.User.${userId}`);
    channel.notification(() => {
      get().load();
    });
  },
}));
