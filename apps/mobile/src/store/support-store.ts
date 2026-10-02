import { create } from 'zustand';
import {
  ApiError,
  SUPPORT_STRINGS,
  type AdminSupportTicket,
  type AnswerCheckinPayload,
  type AnswerCheckinResponse,
  type CreateSupportTicketPayload,
  type CurrentCheckinResponse,
  type SupportStats,
  type SupportTicket,
} from '@sanken/core';

import { api } from '@/lib/api';

const t = SUPPORT_STRINGS.es;

function readErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    return Object.values(err.body.errors ?? {})[0]?.[0] ?? err.body.message;
  }
  return fallback;
}

/**
 * Soporte (solicitudes propias + check-in semanal) y, para super_admin, el
 * panel de soporte. Mismo contrato que la web (ver apps/web/src/pages/Support*).
 */
interface SupportState {
  tickets: SupportTicket[];
  isLoadingTickets: boolean;
  ticket: SupportTicket | null;
  isLoadingTicket: boolean;
  isSubmitting: boolean;
  error: string | null;

  checkin: CurrentCheckinResponse | null;
  /**
   * Usuario para el que se consultó el check-in en esta apertura de la app:
   * no se vuelve a preguntar en cada pantalla, pero sí si entra otra cuenta.
   */
  checkinUserId: number | null;

  adminTickets: AdminSupportTicket[];
  adminTicket: AdminSupportTicket | null;
  stats: SupportStats | null;
  staff: { id: number; name: string }[];

  loadTickets: () => Promise<void>;
  loadTicket: (id: number | string) => Promise<void>;
  createTicket: (payload: CreateSupportTicketPayload) => Promise<SupportTicket>;
  reply: (id: number, body: string) => Promise<void>;
  closeTicket: (id: number) => Promise<void>;

  loadCheckin: (userId: number) => Promise<void>;
  answerCheckin: (payload: AnswerCheckinPayload) => Promise<AnswerCheckinResponse>;
  postponeCheckin: () => Promise<void>;

  loadAdmin: (query: string) => Promise<void>;
  loadAdminTicket: (id: number | string) => Promise<void>;
  adminReply: (id: number, body: string) => Promise<void>;
  adminUpdate: (id: number, changes: Record<string, string | number | null>) => Promise<void>;

  clearError: () => void;
}

export const useSupportStore = create<SupportState>((set, get) => ({
  tickets: [],
  isLoadingTickets: false,
  ticket: null,
  isLoadingTicket: false,
  isSubmitting: false,
  error: null,
  checkin: null,
  checkinUserId: null,
  adminTickets: [],
  adminTicket: null,
  stats: null,
  staff: [],

  loadTickets: async () => {
    set({ isLoadingTickets: true, error: null });
    try {
      set({ tickets: await api.get<SupportTicket[]>('/support/tickets'), isLoadingTickets: false });
    } catch (err) {
      set({ isLoadingTickets: false, error: readErrorMessage(err, t.loadError) });
    }
  },

  loadTicket: async (id) => {
    set({ isLoadingTicket: true, error: null, ticket: null });
    try {
      set({ ticket: await api.get<SupportTicket>(`/support/tickets/${id}`), isLoadingTicket: false });
    } catch (err) {
      set({ isLoadingTicket: false, error: readErrorMessage(err, t.loadError) });
    }
  },

  createTicket: async (payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const ticket = await api.post<SupportTicket>('/support/tickets', payload);
      set({ isSubmitting: false, ticket, tickets: [ticket, ...get().tickets] });
      return ticket;
    } catch (err) {
      set({ isSubmitting: false, error: readErrorMessage(err, t.createError) });
      throw err;
    }
  },

  reply: async (id, body) => {
    set({ isSubmitting: true, error: null });
    try {
      const ticket = await api.post<SupportTicket>(`/support/tickets/${id}/messages`, { body });
      set({ isSubmitting: false, ticket });
    } catch (err) {
      set({ isSubmitting: false, error: readErrorMessage(err, t.createError) });
      throw err;
    }
  },

  closeTicket: async (id) => {
    set({ isSubmitting: true, error: null });
    try {
      const ticket = await api.post<SupportTicket>(`/support/tickets/${id}/close`);
      set({ isSubmitting: false, ticket });
    } catch (err) {
      set({ isSubmitting: false, error: readErrorMessage(err, t.createError) });
      throw err;
    }
  },

  loadCheckin: async (userId) => {
    set({ checkinUserId: userId, checkin: null });
    try {
      set({ checkin: await api.get<CurrentCheckinResponse>('/support/check-ins/current') });
    } catch {
      // Sin check-in esta vez: no se insiste hasta la próxima apertura.
    }
  },

  answerCheckin: async (payload) => {
    const checkin = get().checkin?.checkin;
    if (!checkin) throw new Error('Sin check-in');
    set({ isSubmitting: true, error: null });
    try {
      const result = await api.post<AnswerCheckinResponse>(`/support/check-ins/${checkin.id}/answer`, payload);
      set({ isSubmitting: false, checkin: { checkin: result.checkin, should_prompt: false } });
      if (result.ticket) set({ tickets: [result.ticket, ...get().tickets] });
      return result;
    } catch (err) {
      set({ isSubmitting: false, error: readErrorMessage(err, t.createError) });
      throw err;
    }
  },

  postponeCheckin: async () => {
    const current = get().checkin;
    if (!current?.checkin) return;
    // Se oculta de inmediato; si la request falla, igual no se insiste en esta apertura.
    set({ checkin: { ...current, should_prompt: false } });
    try {
      const { checkin } = await api.post<{ checkin: CurrentCheckinResponse['checkin'] }>(`/support/check-ins/${current.checkin.id}/postpone`);
      set({ checkin: { checkin, should_prompt: false } });
    } catch {
      // no-op
    }
  },

  loadAdmin: async (query) => {
    set({ isLoadingTickets: true, error: null });
    try {
      const [tickets, stats, staff] = await Promise.all([
        api.get<AdminSupportTicket[]>(`/admin/support/tickets?${query}`),
        api.get<SupportStats>('/admin/support/stats'),
        get().staff.length ? Promise.resolve(get().staff) : api.get<{ id: number; name: string }[]>('/admin/support/staff'),
      ]);
      set({ adminTickets: tickets, stats, staff, isLoadingTickets: false });
    } catch (err) {
      set({ isLoadingTickets: false, error: readErrorMessage(err, t.loadError) });
    }
  },

  loadAdminTicket: async (id) => {
    set({ isLoadingTicket: true, error: null, adminTicket: null });
    try {
      const [adminTicket, staff] = await Promise.all([
        api.get<AdminSupportTicket>(`/admin/support/tickets/${id}`),
        get().staff.length ? Promise.resolve(get().staff) : api.get<{ id: number; name: string }[]>('/admin/support/staff'),
      ]);
      set({ adminTicket, staff, isLoadingTicket: false });
    } catch (err) {
      set({ isLoadingTicket: false, error: readErrorMessage(err, t.loadError) });
    }
  },

  adminReply: async (id, body) => {
    set({ isSubmitting: true, error: null });
    try {
      set({ adminTicket: await api.post<AdminSupportTicket>(`/admin/support/tickets/${id}/messages`, { body }), isSubmitting: false });
    } catch (err) {
      set({ isSubmitting: false, error: readErrorMessage(err, t.createError) });
      throw err;
    }
  },

  adminUpdate: async (id, changes) => {
    set({ isSubmitting: true, error: null });
    try {
      set({ adminTicket: await api.patch<AdminSupportTicket>(`/admin/support/tickets/${id}`, changes), isSubmitting: false });
    } catch (err) {
      set({ isSubmitting: false, error: readErrorMessage(err, t.createError) });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
