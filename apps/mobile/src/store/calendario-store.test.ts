import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { CalendarResponse } from '@sanken/core';

import { api } from '@/lib/api';
import { useCalendarioStore } from './calendario-store';

jest.mock('@/lib/api', () => ({
  api: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

const mockedApi = api as jest.Mocked<typeof api>;

const response: CalendarResponse = {
  month: '2026-08',
  events: [{ type: 'workout_completed', event_date: '2026-08-05', title: 'Full Body A', duration_minutes: 40 }],
};

beforeEach(() => {
  jest.clearAllMocks();
  useCalendarioStore.setState({ month: new Date(2026, 7, 1), events: [], isLoading: false, error: null });
});

describe('load', () => {
  it('fetches events for the current month', async () => {
    mockedApi.get.mockResolvedValueOnce(response);

    await useCalendarioStore.getState().load();

    expect(mockedApi.get).toHaveBeenCalledWith('/calendar?month=2026-08');
    expect(useCalendarioStore.getState().events).toEqual(response.events);
  });

  it('sets an error on failure', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('network down'));

    await useCalendarioStore.getState().load();

    expect(useCalendarioStore.getState().error).toBe('network down');
  });
});

describe('setMonth', () => {
  it('updates the month and reloads with the new key', async () => {
    mockedApi.get.mockResolvedValueOnce({ ...response, month: '2026-09' });

    useCalendarioStore.getState().setMonth(new Date(2026, 8, 1));
    expect(useCalendarioStore.getState().month.getMonth()).toBe(8);

    await Promise.resolve();
    expect(mockedApi.get).toHaveBeenCalledWith('/calendar?month=2026-09');
  });
});

describe('addReminder / deleteReminder', () => {
  it('posts a new reminder and reloads', async () => {
    mockedApi.post.mockResolvedValueOnce(undefined);
    mockedApi.get.mockResolvedValueOnce(response);

    await useCalendarioStore.getState().addReminder('2026-08-20', 'Pesarme');

    expect(mockedApi.post).toHaveBeenCalledWith('/calendar/reminders', { event_date: '2026-08-20', title: 'Pesarme' });
    expect(mockedApi.get).toHaveBeenCalledWith('/calendar?month=2026-08');
  });

  it('deletes a reminder and reloads', async () => {
    mockedApi.delete.mockResolvedValueOnce(undefined);
    mockedApi.get.mockResolvedValueOnce(response);

    await useCalendarioStore.getState().deleteReminder(7);

    expect(mockedApi.delete).toHaveBeenCalledWith('/calendar/reminders/7');
    expect(mockedApi.get).toHaveBeenCalledWith('/calendar?month=2026-08');
  });
});
