// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «ApiError» en la lista.
  ApiError,
  // Esta línea sirve para incluir el valor «SUPPORT_STRINGS» en la lista.
  SUPPORT_STRINGS,
  // Esta línea sirve para importar el tipo «AdminSupportTicket».
  type AdminSupportTicket,
  // Esta línea sirve para importar el tipo «AnswerCheckinPayload».
  type AnswerCheckinPayload,
  // Esta línea sirve para importar el tipo «AnswerCheckinResponse».
  type AnswerCheckinResponse,
  // Esta línea sirve para importar el tipo «CreateSupportTicketPayload».
  type CreateSupportTicketPayload,
  // Esta línea sirve para importar el tipo «CurrentCheckinResponse».
  type CurrentCheckinResponse,
  // Esta línea sirve para importar el tipo «SupportStats».
  type SupportStats,
  // Esta línea sirve para importar el tipo «SupportTicket».
  type SupportTicket,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';

// Esta línea sirve para declarar «t» con el valor «SUPPORT_STRINGS.es».
const t = SUPPORT_STRINGS.es;

// Esta línea sirve para declarar la función «readErrorMessage».
function readErrorMessage(err: unknown, fallback: string): string {
  // Esta línea sirve para revisar si «err instanceof ApiError».
  if (err instanceof ApiError) {
    // Esta línea sirve para devolver el primer error de campo o el mensaje general de la API.
    return Object.values(err.body.errors ?? {})[0]?.[0] ?? err.body.message;
  }
  // Esta línea sirve para devolver «fallback».
  return fallback;
}

/**
 * Soporte (solicitudes propias + check-in semanal) y, para super_admin, el
 * panel de soporte. Mismo contrato que la web (ver apps/web/src/pages/Support*).
 */
// Esta línea sirve para declarar la interfaz «SupportState».
interface SupportState {
  // Esta línea sirve para declarar la propiedad «tickets» con el valor o tipo «SupportTicket[]».
  tickets: SupportTicket[];
  // Esta línea sirve para declarar la propiedad «isLoadingTickets» con el valor o tipo «boolean».
  isLoadingTickets: boolean;
  // Esta línea sirve para declarar la propiedad «ticket» con el valor o tipo «SupportTicket | null».
  ticket: SupportTicket | null;
  // Esta línea sirve para declarar la propiedad «isLoadingTicket» con el valor o tipo «boolean».
  isLoadingTicket: boolean;
  // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «boolean».
  isSubmitting: boolean;
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «string | null».
  error: string | null;

  // Esta línea sirve para declarar la propiedad «checkin» con el valor o tipo «CurrentCheckinResponse | null».
  checkin: CurrentCheckinResponse | null;
  /**
   * Usuario para el que se consultó el check-in en esta apertura de la app:
   * no se vuelve a preguntar en cada pantalla, pero sí si entra otra cuenta.
   */
  // Esta línea sirve para declarar la propiedad «checkinUserId» con el valor o tipo «number | null».
  checkinUserId: number | null;

  // Esta línea sirve para declarar la propiedad «adminTickets» con el valor o tipo «AdminSupportTicket[]».
  adminTickets: AdminSupportTicket[];
  // Esta línea sirve para declarar la propiedad «adminTicket» con el valor o tipo «AdminSupportTicket | null».
  adminTicket: AdminSupportTicket | null;
  // Esta línea sirve para declarar la propiedad «stats» con el valor o tipo «SupportStats | null».
  stats: SupportStats | null;
  // Esta línea sirve para declarar la propiedad «staff» con el valor o tipo «{ id: number; name: string }[]».
  staff: { id: number; name: string }[];

  // Esta línea sirve para declarar la propiedad «loadTickets» con el valor o tipo «() => Promise<void>».
  loadTickets: () => Promise<void>;
  // Esta línea sirve para declarar la propiedad «loadTicket» con el valor o tipo «(id: number | string) => Promise<void>».
  loadTicket: (id: number | string) => Promise<void>;
  // Esta línea sirve para definir «createTicket» con «(payload: CreateSupportTicketPayload) =>…».
  createTicket: (payload: CreateSupportTicketPayload) => Promise<SupportTicket>;
  // Esta línea sirve para declarar la propiedad «reply» con el valor o tipo «(id: number, body: string) => Promise<void>».
  reply: (id: number, body: string) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «closeTicket» con el valor o tipo «(id: number) => Promise<void>».
  closeTicket: (id: number) => Promise<void>;

  // Esta línea sirve para declarar la propiedad «loadCheckin» con el valor o tipo «(userId: number) => Promise<void>».
  loadCheckin: (userId: number) => Promise<void>;
  // Esta línea sirve para definir «answerCheckin» con «(payload: AnswerCheckinPayload) => Promi…».
  answerCheckin: (payload: AnswerCheckinPayload) => Promise<AnswerCheckinResponse>;
  // Esta línea sirve para declarar la propiedad «postponeCheckin» con el valor o tipo «() => Promise<void>».
  postponeCheckin: () => Promise<void>;

  // Esta línea sirve para declarar la propiedad «loadAdmin» con el valor o tipo «(query: string) => Promise<void>».
  loadAdmin: (query: string) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «loadAdminTicket» con el valor o tipo «(id: number | string) => Promise<void>».
  loadAdminTicket: (id: number | string) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «adminReply» con el valor o tipo «(id: number, body: string) => Promise<void>».
  adminReply: (id: number, body: string) => Promise<void>;
  // Esta línea sirve para definir «adminUpdate» con «(id: number, changes: Record<string, str…».
  adminUpdate: (id: number, changes: Record<string, string | number | null>) => Promise<void>;

  // Esta línea sirve para declarar la propiedad «clearError» con el valor o tipo «() => void».
  clearError: () => void;
}

// Esta línea sirve para declarar «useSupportStore» con el valor «create<SupportState>((set, get) => ({».
export const useSupportStore = create<SupportState>((set, get) => ({
  // Esta línea sirve para declarar la propiedad «tickets» con el valor o tipo «[]».
  tickets: [],
  // Esta línea sirve para declarar la propiedad «isLoadingTickets» con el valor o tipo «false».
  isLoadingTickets: false,
  // Esta línea sirve para declarar la propiedad «ticket» con el valor o tipo «null».
  ticket: null,
  // Esta línea sirve para declarar la propiedad «isLoadingTicket» con el valor o tipo «false».
  isLoadingTicket: false,
  // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «false».
  isSubmitting: false,
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «null».
  error: null,
  // Esta línea sirve para declarar la propiedad «checkin» con el valor o tipo «null».
  checkin: null,
  // Esta línea sirve para declarar la propiedad «checkinUserId» con el valor o tipo «null».
  checkinUserId: null,
  // Esta línea sirve para declarar la propiedad «adminTickets» con el valor o tipo «[]».
  adminTickets: [],
  // Esta línea sirve para declarar la propiedad «adminTicket» con el valor o tipo «null».
  adminTicket: null,
  // Esta línea sirve para declarar la propiedad «stats» con el valor o tipo «null».
  stats: null,
  // Esta línea sirve para declarar la propiedad «staff» con el valor o tipo «[]».
  staff: [],

  // Esta línea sirve para declarar la propiedad «loadTickets» con el valor o tipo «async () => {».
  loadTickets: async () => {
    // Esta línea sirve para guardar en el store: «isLoadingTickets: true, error: null })…».
    set({ isLoadingTickets: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para guardar en el store: «tickets: await api.get<SupportTicket[]>('/support/tickets'),…».
      set({ tickets: await api.get<SupportTicket[]>('/support/tickets'), isLoadingTickets: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isLoadingTickets: false, error: readErrorMessage(err, t.load…».
      set({ isLoadingTickets: false, error: readErrorMessage(err, t.loadError) });
    }
  },

  // Esta línea sirve para declarar la propiedad «loadTicket» con el valor o tipo «async (id) => {».
  loadTicket: async (id) => {
    // Esta línea sirve para guardar en el store: «isLoadingTicket: true, error: null, ticket: null })…».
    set({ isLoadingTicket: true, error: null, ticket: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para guardar en el store: «ticket: await api.get<SupportTicket>(`/support/tickets/${id}…».
      set({ ticket: await api.get<SupportTicket>(`/support/tickets/${id}`), isLoadingTicket: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isLoadingTicket: false, error: readErrorMessage(err, t.loadE…».
      set({ isLoadingTicket: false, error: readErrorMessage(err, t.loadError) });
    }
  },

  // Esta línea sirve para declarar la propiedad «createTicket» con el valor o tipo «async (payload) => {».
  createTicket: async (payload) => {
    // Esta línea sirve para guardar en el store: «isSubmitting: true, error: null })…».
    set({ isSubmitting: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.post<SupportTicket>('/support/tickets', payloa» y guardar el resultado en «ticket».
      const ticket = await api.post<SupportTicket>('/support/tickets', payload);
      // Esta línea sirve para guardar en el store: «isSubmitting: false, ticket, tickets: [ticket, ...get().tick…».
      set({ isSubmitting: false, ticket, tickets: [ticket, ...get().tickets] });
      // Esta línea sirve para devolver «ticket».
      return ticket;
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isSubmitting: false, error: readErrorMessage(err, t.createEr…».
      set({ isSubmitting: false, error: readErrorMessage(err, t.createError) });
      // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
      throw err;
    }
  },

  // Esta línea sirve para declarar la propiedad «reply» con el valor o tipo «async (id, body) => {».
  reply: async (id, body) => {
    // Esta línea sirve para guardar en el store: «isSubmitting: true, error: null })…».
    set({ isSubmitting: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.post<SupportTicket>(`/support/tickets/${id}/me» y guardar el resultado en «ticket».
      const ticket = await api.post<SupportTicket>(`/support/tickets/${id}/messages`, { body });
      // Esta línea sirve para guardar en el store: «isSubmitting: false, ticket })…».
      set({ isSubmitting: false, ticket });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isSubmitting: false, error: readErrorMessage(err, t.createEr…».
      set({ isSubmitting: false, error: readErrorMessage(err, t.createError) });
      // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
      throw err;
    }
  },

  // Esta línea sirve para declarar la propiedad «closeTicket» con el valor o tipo «async (id) => {».
  closeTicket: async (id) => {
    // Esta línea sirve para guardar en el store: «isSubmitting: true, error: null })…».
    set({ isSubmitting: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.post<SupportTicket>(`/support/tickets/${id}/cl» y guardar el resultado en «ticket».
      const ticket = await api.post<SupportTicket>(`/support/tickets/${id}/close`);
      // Esta línea sirve para guardar en el store: «isSubmitting: false, ticket })…».
      set({ isSubmitting: false, ticket });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isSubmitting: false, error: readErrorMessage(err, t.createEr…».
      set({ isSubmitting: false, error: readErrorMessage(err, t.createError) });
      // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
      throw err;
    }
  },

  // Esta línea sirve para declarar la propiedad «loadCheckin» con el valor o tipo «async (userId) => {».
  loadCheckin: async (userId) => {
    // Esta línea sirve para guardar en el store: «checkinUserId: userId, checkin: null })…».
    set({ checkinUserId: userId, checkin: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para guardar en el store: «checkin: await api.get<CurrentCheckinResponse>('/support/che…».
      set({ checkin: await api.get<CurrentCheckinResponse>('/support/check-ins/current') });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // Sin check-in esta vez: no se insiste hasta la próxima apertura.
    }
  },

  // Esta línea sirve para declarar la propiedad «answerCheckin» con el valor o tipo «async (payload) => {».
  answerCheckin: async (payload) => {
    // Esta línea sirve para extraer «hecki» de «get().checkin?.checkin».
    const checkin = get().checkin?.checkin;
    // Esta línea sirve para lanzar un error si «!checkin».
    if (!checkin) throw new Error('Sin check-in');
    // Esta línea sirve para guardar en el store: «isSubmitting: true, error: null })…».
    set({ isSubmitting: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.post<AnswerCheckinResponse>(`/support/check-in» y guardar el resultado en «result».
      const result = await api.post<AnswerCheckinResponse>(`/support/check-ins/${checkin.id}/answer`, payload);
      // Esta línea sirve para guardar en el store: «isSubmitting: false, checkin: { checkin: result.checkin, sho…».
      set({ isSubmitting: false, checkin: { checkin: result.checkin, should_prompt: false } });
      // Esta línea sirve para llamar a «set» si «result.ticket».
      if (result.ticket) set({ tickets: [result.ticket, ...get().tickets] });
      // Esta línea sirve para devolver «result».
      return result;
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isSubmitting: false, error: readErrorMessage(err, t.createEr…».
      set({ isSubmitting: false, error: readErrorMessage(err, t.createError) });
      // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
      throw err;
    }
  },

  // Esta línea sirve para declarar la propiedad «postponeCheckin» con el valor o tipo «async () => {».
  postponeCheckin: async () => {
    // Esta línea sirve para extraer «urren» de «get().checkin».
    const current = get().checkin;
    // Esta línea sirve para salir de la función si «!current?.checkin».
    if (!current?.checkin) return;
    // Se oculta de inmediato; si la request falla, igual no se insiste en esta apertura.
    // Esta línea sirve para guardar en el store: «checkin: { ...current, should_prompt: false } })…».
    set({ checkin: { ...current, should_prompt: false } });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.post<{ checkin: CurrentCheckinRespon» y obtener «checkin».
      const { checkin } = await api.post<{ checkin: CurrentCheckinResponse['checkin'] }>(`/support/check-ins/${current.checkin.id}/postpone`);
      // Esta línea sirve para guardar en el store: «checkin: { checkin, should_prompt: false } })…».
      set({ checkin: { checkin, should_prompt: false } });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // no-op
    }
  },

  // Esta línea sirve para declarar la propiedad «loadAdmin» con el valor o tipo «async (query) => {».
  loadAdmin: async (query) => {
    // Esta línea sirve para guardar en el store: «isLoadingTickets: true, error: null })…».
    set({ isLoadingTickets: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para extraer «tickets, stats, staff» de «await Promise.all([».
      const [tickets, stats, staff] = await Promise.all([
        // Esta línea sirve para pedir los tickets con los filtros a la API.
        api.get<AdminSupportTicket[]>(`/admin/support/tickets?${query}`),
        // Esta línea sirve para pedir las estadísticas de soporte a la API.
        api.get<SupportStats>('/admin/support/stats'),
        // Esta línea sirve para reutilizar el personal ya cargado o pedirlo a la API.
        get().staff.length ? Promise.resolve(get().staff) : api.get<{ id: number; name: string }[]>('/admin/support/staff'),
      ]);
      // Esta línea sirve para guardar en el store: «adminTickets: tickets, stats, staff, isLoadingTickets: false…».
      set({ adminTickets: tickets, stats, staff, isLoadingTickets: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isLoadingTickets: false, error: readErrorMessage(err, t.load…».
      set({ isLoadingTickets: false, error: readErrorMessage(err, t.loadError) });
    }
  },

  // Esta línea sirve para declarar la propiedad «loadAdminTicket» con el valor o tipo «async (id) => {».
  loadAdminTicket: async (id) => {
    // Esta línea sirve para guardar en el store: «isLoadingTicket: true, error: null, adminTicket: null })…».
    set({ isLoadingTicket: true, error: null, adminTicket: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para extraer «adminTicket, staff» de «await Promise.all([».
      const [adminTicket, staff] = await Promise.all([
        // Esta línea sirve para pedir el ticket indicado a la API.
        api.get<AdminSupportTicket>(`/admin/support/tickets/${id}`),
        // Esta línea sirve para reutilizar el personal ya cargado o pedirlo a la API.
        get().staff.length ? Promise.resolve(get().staff) : api.get<{ id: number; name: string }[]>('/admin/support/staff'),
      ]);
      // Esta línea sirve para guardar en el store: «adminTicket, staff, isLoadingTicket: false })…».
      set({ adminTicket, staff, isLoadingTicket: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isLoadingTicket: false, error: readErrorMessage(err, t.loadE…».
      set({ isLoadingTicket: false, error: readErrorMessage(err, t.loadError) });
    }
  },

  // Esta línea sirve para declarar la propiedad «adminReply» con el valor o tipo «async (id, body) => {».
  adminReply: async (id, body) => {
    // Esta línea sirve para guardar en el store: «isSubmitting: true, error: null })…».
    set({ isSubmitting: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para guardar en el store: «adminTicket: await api.post<AdminSupportTicket>(`/admin/supp…».
      set({ adminTicket: await api.post<AdminSupportTicket>(`/admin/support/tickets/${id}/messages`, { body }), isSubmitting: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isSubmitting: false, error: readErrorMessage(err, t.createEr…».
      set({ isSubmitting: false, error: readErrorMessage(err, t.createError) });
      // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
      throw err;
    }
  },

  // Esta línea sirve para declarar la propiedad «adminUpdate» con el valor o tipo «async (id, changes) => {».
  adminUpdate: async (id, changes) => {
    // Esta línea sirve para guardar en el store: «isSubmitting: true, error: null })…».
    set({ isSubmitting: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para guardar en el store: «adminTicket: await api.patch<AdminSupportTicket>(`/admin/sup…».
      set({ adminTicket: await api.patch<AdminSupportTicket>(`/admin/support/tickets/${id}`, changes), isSubmitting: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isSubmitting: false, error: readErrorMessage(err, t.createEr…».
      set({ isSubmitting: false, error: readErrorMessage(err, t.createError) });
      // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
      throw err;
    }
  },

  // Esta línea sirve para declarar la propiedad «clearError» con el valor o tipo «() => set({ error: null })».
  clearError: () => set({ error: null }),
}));
