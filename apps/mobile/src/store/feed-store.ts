// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para importar los tipos «FeedItem, FeedItemType» desde «@sanken/core».
import type { FeedItem, FeedItemType } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «getEcho» desde «@/lib/echo».
import { getEcho } from '@/lib/echo';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';

// Esta línea sirve para declarar la interfaz «FeedStoreState».
interface FeedStoreState {
  // Esta línea sirve para declarar la propiedad «items» con el valor o tipo «FeedItem[]».
  items: FeedItem[];
  // Esta línea sirve para declarar la propiedad «unreadCount» con el valor o tipo «number».
  unreadCount: number;
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «boolean».
  isLoading: boolean;
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «string | null».
  error: string | null;

  // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «() => Promise<void>».
  load: () => Promise<void>;
  // Esta línea sirve para declarar la propiedad «markRead» con el valor o tipo «(item: FeedItem) => Promise<void>».
  markRead: (item: FeedItem) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «markAllRead» con el valor o tipo «() => Promise<void>».
  markAllRead: () => Promise<void>;
  // Esta línea sirve para declarar la propiedad «subscribe» con el valor o tipo «() => void».
  subscribe: () => void;
}

// La suscripción vive mientras dure la sesión de la app (no por pantalla) —
// este flag evita registrar el mismo listener dos veces si subscribe() se
// llama desde más de una pantalla. Mismo patrón que antes tenía
// notifications-store.ts.
// Esta línea sirve para extraer «ubscribe» de «false».
let subscribed = false;

// Esta línea sirve para declarar «useFeedStore» con el valor «create<FeedStoreState>((set, get) => ({».
export const useFeedStore = create<FeedStoreState>((set, get) => ({
  // Esta línea sirve para declarar la propiedad «items» con el valor o tipo «[]».
  items: [],
  // Esta línea sirve para declarar la propiedad «unreadCount» con el valor o tipo «0».
  unreadCount: 0,
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «false».
  isLoading: false,
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «null».
  error: null,

  // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «async () => {».
  load: async () => {
    // Esta línea sirve para guardar en el store: «isLoading: true, error: null })…».
    set({ isLoading: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.getWithMeta<FeedItem[]>('/feed')» y guardar el resultado en «res».
      const res = await api.getWithMeta<FeedItem[]>('/feed');
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «items» con el valor o tipo «res.data».
        items: res.data,
        // Esta línea sirve para definir «unreadCount» con «(res.meta?.unread_count as number | unde…».
        unreadCount: (res.meta?.unread_count as number | undefined) ?? 0,
        // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «false».
        isLoading: false,
      });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isLoading: false, error: err instanceof Error ? err.message …».
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudieron cargar tus novedades.' });
    }
  },

  // Optimista: la tarjeta deja de verse como no leída en el mismo toque, sin
  // esperar al round-trip. Si el servidor falla se recarga el estado real.
  // Esta línea sirve para declarar la propiedad «markRead» con el valor o tipo «async (item: FeedItem) => {».
  markRead: async (item: FeedItem) => {
    // Esta línea sirve para salir de la función si «item.read_at».
    if (item.read_at) return;
    // Esta línea sirve para extraer «eadA» de «new Date().toISOString()».
    const readAt = new Date().toISOString();
    // Esta línea sirve para actualizar las novedades a partir del estado anterior.
    set((state) => ({
      // Esta línea sirve para declarar la propiedad «items» con el valor o tipo «state.items.map((i) =>».
      items: state.items.map((i) =>
        // Esta línea sirve para marcar como leída la novedad indicada.
        i.feed_type === item.feed_type && i.id === item.id ? { ...i, read_at: readAt } : i
      ),
      // Esta línea sirve para declarar la propiedad «unreadCount» con el valor o tipo «Math.max(0, state.unreadCount - 1)».
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «api.post».
      await api.post(`/feed/${item.feed_type as FeedItemType}/${item.id}/read`);
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // Esta línea sirve para esperar el resultado de «get».
      await get().load();
    }
  },

  // Esta línea sirve para declarar la propiedad «markAllRead» con el valor o tipo «async () => {».
  markAllRead: async () => {
    // Esta línea sirve para extraer «eadA» de «new Date().toISOString()».
    const readAt = new Date().toISOString();
    // Esta línea sirve para actualizar las novedades a partir del estado anterior.
    set((state) => ({
      // Esta línea sirve para definir «items» con «state.items.map((i) => (i.read_at ? i : …».
      items: state.items.map((i) => (i.read_at ? i : { ...i, read_at: readAt })),
      // Esta línea sirve para declarar la propiedad «unreadCount» con el valor o tipo «0».
      unreadCount: 0,
    }));
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «api.post».
      await api.post('/feed/read-all');
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // Esta línea sirve para esperar el resultado de «get».
      await get().load();
    }
  },

  // Esta línea sirve para declarar la propiedad «subscribe» con el valor o tipo «() => {».
  subscribe: () => {
    // Esta línea sirve para salir de la función si «subscribed».
    if (subscribed) return;
    // Esta línea sirve para extraer «serI» de «useAuthStore.getState().user?.id».
    const userId = useAuthStore.getState().user?.id;
    // Esta línea sirve para salir de la función si «!userId».
    if (!userId) return;
    // Esta línea sirve para asignar «true» a «subscribed».
    subscribed = true;

    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para extraer «ch» de «getEcho()».
      const echo = getEcho();
      // Esta línea sirve para extraer «hanne» de «echo.private(`App.Models.User.${userId}`».
      const channel = echo.private(`App.Models.User.${userId}`);
      // Esta línea sirve para llamar a «channel.notification» con una función.
      channel.notification(() => {
        // Esta línea sirve para llamar a «get» con «).load(».
        get().load();
      });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // No tirar abajo toda la app si el websocket no puede conectar (ver
      // el comentario en packages/core/src/realtime/echo.ts sobre el bug
      // de laravel-echo bajo Hermes) — el feed simplemente no se actualiza
      // en vivo, se sigue viendo al hacer load() manual.
      // Esta línea sirve para asignar «false» a «subscribed».
      subscribed = false;
      // Esta línea sirve para avisar que no se pudo suscribir al feed en vivo.
      console.warn('No se pudo suscribir al feed en vivo:', err);
    }
  },
}));
