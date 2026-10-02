/** Catálogos — deben coincidir con apps/api/config/support.php. */
export type SupportTicketType = 'question' | 'complaint' | 'observation' | 'suggestion' | 'technical_issue' | 'other';
export type SupportTicketStatus = 'open' | 'in_review' | 'answered' | 'resolved' | 'closed';
export type SupportTicketPriority = 'low' | 'normal' | 'high' | 'urgent';
export type CheckinMood = 'great' | 'good' | 'neutral' | 'not_good' | 'bad';
export type CheckinTopic = 'question' | 'complaint' | 'observation' | 'problem' | 'suggestion' | 'none';
export type WeeklyCheckinStatus = 'pending' | 'postponed' | 'dismissed' | 'answered';

export const SUPPORT_TICKET_TYPES: SupportTicketType[] = ['question', 'complaint', 'observation', 'suggestion', 'technical_issue', 'other'];
export const SUPPORT_TICKET_STATUSES: SupportTicketStatus[] = ['open', 'in_review', 'answered', 'resolved', 'closed'];
export const SUPPORT_TICKET_PRIORITIES: SupportTicketPriority[] = ['low', 'normal', 'high', 'urgent'];
export const CHECKIN_MOODS: CheckinMood[] = ['great', 'good', 'neutral', 'not_good', 'bad'];
export const CHECKIN_TOPICS: CheckinTopic[] = ['question', 'complaint', 'observation', 'problem', 'suggestion', 'none'];

export interface SupportTicketMessage {
  id: number;
  body: string;
  is_staff: boolean;
  /** null en mensajes del equipo vistos por el usuario (se muestra "Equipo SanKen"). */
  author_name: string | null;
  created_at: string;
}

export interface SupportTicket {
  id: number;
  type: SupportTicketType;
  subject: string;
  status: SupportTicketStatus;
  source: 'app' | 'weekly_checkin';
  weekly_checkin_id: number | null;
  last_message_at: string | null;
  last_message_by_staff: boolean;
  first_response_at: string | null;
  resolved_at: string | null;
  closed_at: string | null;
  created_at: string;
  messages?: SupportTicketMessage[];
}

/** Vista del equipo (GET /admin/support/...): agrega lo interno. */
export interface AdminSupportTicket extends SupportTicket {
  priority: SupportTicketPriority;
  context: Record<string, unknown> | null;
  user: { id: number; name: string; email: string } | null;
  assignee: { id: number; name: string } | null;
}

export interface CreateSupportTicketPayload {
  type: SupportTicketType;
  subject: string;
  message: string;
}

export interface WeeklyCheckin {
  id: number;
  week: string;
  status: WeeklyCheckinStatus;
  mood: CheckinMood | null;
  topic: CheckinTopic | null;
  postpone_count: number;
  answered_at: string | null;
  support_ticket_id: number | null;
}

export interface CurrentCheckinResponse {
  checkin: WeeklyCheckin | null;
  should_prompt: boolean;
}

export interface AnswerCheckinPayload {
  mood: CheckinMood;
  topic: CheckinTopic;
  comment?: string;
}

export interface AnswerCheckinResponse {
  checkin: WeeklyCheckin;
  ticket: SupportTicket | null;
}

export interface SupportStats {
  tickets: {
    open: number;
    in_review: number;
    answered: number;
    resolved: number;
    closed: number;
    awaiting_staff: number;
    this_week: number;
    total: number;
    by_type: Partial<Record<SupportTicketType, number>>;
    avg_first_response_hours: number | null;
    avg_resolution_hours: number | null;
  };
  checkins: {
    current_week: string;
    weeks: {
      week: string;
      offered: number;
      answered: number;
      postponed: number;
      ignored: number | null;
      response_rate: number | null;
    }[];
    moods: Partial<Record<CheckinMood, number>>;
    topics: Partial<Record<CheckinTopic, number>>;
  };
}

/**
 * Datos de las notificaciones nuevas (soporte y check-in). A diferencia de
 * NewChatMessageNotificationData, traen título, cuerpo y `link` (ruta
 * compartida web/mobile) — el feed las muestra de forma genérica.
 */
export interface LinkedNotificationData {
  kind: string;
  title: string;
  body: string;
  link: string;
}

export function isLinkedNotificationData(data: unknown): data is LinkedNotificationData {
  return !!data && typeof data === 'object' && typeof (data as LinkedNotificationData).link === 'string';
}
