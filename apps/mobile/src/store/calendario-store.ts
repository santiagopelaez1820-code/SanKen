import { create } from 'zustand';
import type { CalendarEvent, CalendarResponse } from '@sanken/core';

import { api } from '@/lib/api';

function toMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

interface CalendarioStoreState {
  month: Date;
  events: CalendarEvent[];
  isLoading: boolean;
  error: string | null;

  setMonth: (month: Date) => void;
  load: () => Promise<void>;
  addReminder: (eventDate: string, title: string) => Promise<void>;
  deleteReminder: (id: number) => Promise<void>;
}

export const useCalendarioStore = create<CalendarioStoreState>((set, get) => ({
  month: new Date(),
  events: [],
  isLoading: false,
  error: null,

  setMonth: (month) => {
    set({ month });
    get().load();
  },

  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get<CalendarResponse>(`/calendar?month=${toMonthKey(get().month)}`);
      set({ events: res.events, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudo cargar el calendario.' });
    }
  },

  addReminder: async (eventDate, title) => {
    await api.post('/calendar/reminders', { event_date: eventDate, title });
    await get().load();
  },

  deleteReminder: async (id) => {
    await api.delete(`/calendar/reminders/${id}`);
    await get().load();
  },
}));
