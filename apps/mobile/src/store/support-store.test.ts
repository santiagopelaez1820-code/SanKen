import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { SupportTicket } from '@sanken/core';

import { api } from '@/lib/api';
import { linkFromNotificationData } from '@/components/notification-link-handler';
import { useSupportStore } from './support-store';

jest.mock('@/lib/api', () => ({
  api: { get: jest.fn(), post: jest.fn(), patch: jest.fn() },
}));

jest.mock('expo-notifications', () => ({}));

const mockedGet = api.get as jest.MockedFunction<typeof api.get>;
const mockedPost = api.post as jest.MockedFunction<typeof api.post>;

const ticket: SupportTicket = {
  id: 1042,
  type: 'question',
  subject: 'No entiendo mi rutina de hoy',
  status: 'open',
  source: 'app',
  weekly_checkin_id: null,
  last_message_at: '2026-09-28T14:00:00Z',
  last_message_by_staff: false,
  first_response_at: null,
  resolved_at: null,
  closed_at: null,
  created_at: '2026-09-28T14:00:00Z',
};

const checkin = { id: 7, week: '2026-W40', status: 'pending' as const, mood: null, topic: null, postpone_count: 0, answered_at: null, support_ticket_id: null };

beforeEach(() => {
  jest.clearAllMocks();
  useSupportStore.setState({ tickets: [], ticket: null, error: null, isSubmitting: false, checkin: null, checkinUserId: null });
});

describe('support requests', () => {
  it('creates a request and adds it to the list', async () => {
    mockedPost.mockResolvedValueOnce(ticket);

    const created = await useSupportStore.getState().createTicket({ type: 'question', subject: 'No entiendo', message: '¿Por qué?' });

    expect(mockedPost).toHaveBeenCalledWith('/support/tickets', { type: 'question', subject: 'No entiendo', message: '¿Por qué?' });
    expect(created.id).toBe(1042);
    expect(useSupportStore.getState().tickets[0].id).toBe(1042);
  });

  it('keeps the backend validation message on error', async () => {
    const { ApiError } = jest.requireActual<typeof import('@sanken/core')>('@sanken/core');
    mockedPost.mockRejectedValueOnce(new ApiError(422, { message: 'x', errors: { subject: ['Escribe un asunto.'] } }) as never);

    await expect(useSupportStore.getState().createTicket({ type: 'question', subject: '', message: 'hola' })).rejects.toBeTruthy();
    expect(useSupportStore.getState().error).toBe('Escribe un asunto.');
  });

  it('replies and stores the updated conversation', async () => {
    mockedPost.mockResolvedValueOnce({ ...ticket, messages: [] });
    await useSupportStore.getState().reply(1042, 'Gracias');
    expect(mockedPost).toHaveBeenCalledWith('/support/tickets/1042/messages', { body: 'Gracias' });
  });
});

describe('weekly check-in', () => {
  it('loads the current check-in once per user', async () => {
    mockedGet.mockResolvedValueOnce({ checkin, should_prompt: true });
    await useSupportStore.getState().loadCheckin(5);

    expect(useSupportStore.getState().checkin?.should_prompt).toBe(true);
    expect(useSupportStore.getState().checkinUserId).toBe(5);
  });

  it('"not now" hides it immediately and records the postponement', async () => {
    useSupportStore.setState({ checkin: { checkin, should_prompt: true } });
    mockedPost.mockResolvedValueOnce({ checkin: { ...checkin, status: 'postponed' } });

    await useSupportStore.getState().postponeCheckin();

    expect(mockedPost).toHaveBeenCalledWith('/support/check-ins/7/postpone');
    expect(useSupportStore.getState().checkin?.should_prompt).toBe(false);
    expect(useSupportStore.getState().checkin?.checkin?.status).toBe('postponed');
  });

  it('answering stops the prompt and adds the created request', async () => {
    useSupportStore.setState({ checkin: { checkin, should_prompt: true } });
    mockedPost.mockResolvedValueOnce({ checkin: { ...checkin, status: 'answered' }, ticket: { ...ticket, source: 'weekly_checkin' } });

    const result = await useSupportStore.getState().answerCheckin({ mood: 'not_good', topic: 'observation', comment: 'Muy pesado' });

    expect(mockedPost).toHaveBeenCalledWith('/support/check-ins/7/answer', { mood: 'not_good', topic: 'observation', comment: 'Muy pesado' });
    expect(result.ticket?.id).toBe(1042);
    expect(useSupportStore.getState().checkin?.should_prompt).toBe(false);
    expect(useSupportStore.getState().tickets).toHaveLength(1);
  });
});

describe('notification links', () => {
  it('opens the link of support/check-in notifications and the chat for chat ones', () => {
    expect(linkFromNotificationData({ link: '/soporte/check-in' })).toBe('/soporte/check-in');
    expect(linkFromNotificationData({ link: '/soporte/12', ticket_id: 12 })).toBe('/soporte/12');
    expect(linkFromNotificationData({ conversation_id: 3 })).toBe('/chat/3');
    expect(linkFromNotificationData({ link: 'https://evil.example' })).toBeNull();
    expect(linkFromNotificationData(null)).toBeNull();
  });
});
