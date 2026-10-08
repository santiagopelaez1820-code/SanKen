// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para importar los tipos «CalendarEvent, CalendarResponse» desde «@sanken/core».
import type { CalendarEvent, CalendarResponse } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';

// Esta línea sirve para declarar la función «toMonthKey».
function toMonthKey(date: Date): string {
  // Esta línea sirve para devolver la clave de mes AAAA-MM.
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// Esta línea sirve para declarar la interfaz «CalendarioStoreState».
interface CalendarioStoreState {
  // Esta línea sirve para declarar la propiedad «month» con el valor o tipo «Date».
  month: Date;
  // Esta línea sirve para declarar la propiedad «events» con el valor o tipo «CalendarEvent[]».
  events: CalendarEvent[];
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «boolean».
  isLoading: boolean;
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «string | null».
  error: string | null;

  // Esta línea sirve para declarar la propiedad «setMonth» con el valor o tipo «(month: Date) => void».
  setMonth: (month: Date) => void;
  // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «() => Promise<void>».
  load: () => Promise<void>;
  // Esta línea sirve para definir «addReminder» con «(eventDate: string, title: string) => Pr…».
  addReminder: (eventDate: string, title: string) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «deleteReminder» con el valor o tipo «(id: number) => Promise<void>».
  deleteReminder: (id: number) => Promise<void>;
}

// Esta línea sirve para declarar «useCalendarioStore» con el valor «create<CalendarioStoreState>((set, get) => ({».
export const useCalendarioStore = create<CalendarioStoreState>((set, get) => ({
  // Esta línea sirve para declarar la propiedad «month» con el valor o tipo «new Date()».
  month: new Date(),
  // Esta línea sirve para declarar la propiedad «events» con el valor o tipo «[]».
  events: [],
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «false».
  isLoading: false,
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «null».
  error: null,

  // Esta línea sirve para declarar la propiedad «setMonth» con el valor o tipo «(month) => {».
  setMonth: (month) => {
    // Esta línea sirve para guardar en el store: «month })…».
    set({ month });
    // Esta línea sirve para llamar a «get» con «).load(».
    get().load();
  },

  // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «async () => {».
  load: async () => {
    // Esta línea sirve para guardar en el store: «isLoading: true, error: null })…».
    set({ isLoading: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<CalendarResponse>(`/calendar?month=${toMon» y guardar el resultado en «res».
      const res = await api.get<CalendarResponse>(`/calendar?month=${toMonthKey(get().month)}`);
      // Esta línea sirve para guardar en el store: «events: res.events, isLoading: false })…».
      set({ events: res.events, isLoading: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isLoading: false, error: err instanceof Error ? err.message …».
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudo cargar el calendario.' });
    }
  },

  // Esta línea sirve para declarar la propiedad «addReminder» con el valor o tipo «async (eventDate, title) => {».
  addReminder: async (eventDate, title) => {
    // Esta línea sirve para esperar el resultado de «api.post».
    await api.post('/calendar/reminders', { event_date: eventDate, title });
    // Esta línea sirve para esperar el resultado de «get».
    await get().load();
  },

  // Esta línea sirve para declarar la propiedad «deleteReminder» con el valor o tipo «async (id) => {».
  deleteReminder: async (id) => {
    // Esta línea sirve para esperar el resultado de «api.delete».
    await api.delete(`/calendar/reminders/${id}`);
    // Esta línea sirve para esperar el resultado de «get».
    await get().load();
  },
}));
