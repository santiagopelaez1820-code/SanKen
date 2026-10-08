/** Catálogos — deben coincidir con apps/api/config/support.php. */
// Esta línea sirve para declarar el tipo «SupportTicketType».
export type SupportTicketType = 'question' | 'complaint' | 'observation' | 'suggestion' | 'technical_issue' | 'other';
// Esta línea sirve para declarar el tipo «SupportTicketStatus» como «'open' | 'in_review' | 'answered' | 'resolved' | 'closed'».
export type SupportTicketStatus = 'open' | 'in_review' | 'answered' | 'resolved' | 'closed';
// Esta línea sirve para declarar el tipo «SupportTicketPriority» como «'low' | 'normal' | 'high' | 'urgent'».
export type SupportTicketPriority = 'low' | 'normal' | 'high' | 'urgent';
// Esta línea sirve para declarar el tipo «CheckinMood» como «'great' | 'good' | 'neutral' | 'not_good' | 'bad'».
export type CheckinMood = 'great' | 'good' | 'neutral' | 'not_good' | 'bad';
// Esta línea sirve para declarar el tipo «CheckinTopic».
export type CheckinTopic = 'question' | 'complaint' | 'observation' | 'problem' | 'suggestion' | 'none';
// Esta línea sirve para declarar el tipo «WeeklyCheckinStatus» como «'pending' | 'postponed' | 'dismissed' | 'answered'».
export type WeeklyCheckinStatus = 'pending' | 'postponed' | 'dismissed' | 'answered';

// Esta línea sirve para declarar la lista de tipos de solicitud de soporte.
export const SUPPORT_TICKET_TYPES: SupportTicketType[] = ['question', 'complaint', 'observation', 'suggestion', 'technical_issue', 'other'];
// Esta línea sirve para declarar la lista de estados de una solicitud.
export const SUPPORT_TICKET_STATUSES: SupportTicketStatus[] = ['open', 'in_review', 'answered', 'resolved', 'closed'];
// Esta línea sirve para declarar la lista de prioridades de una solicitud.
export const SUPPORT_TICKET_PRIORITIES: SupportTicketPriority[] = ['low', 'normal', 'high', 'urgent'];
// Esta línea sirve para declarar la lista de estados de ánimo del check-in.
export const CHECKIN_MOODS: CheckinMood[] = ['great', 'good', 'neutral', 'not_good', 'bad'];
// Esta línea sirve para declarar la lista de temas del check-in.
export const CHECKIN_TOPICS: CheckinTopic[] = ['question', 'complaint', 'observation', 'problem', 'suggestion', 'none'];

// Esta línea sirve para declarar la interfaz «SupportTicketMessage».
export interface SupportTicketMessage {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «body» de tipo «string».
  body: string;
  // Esta línea sirve para declarar el campo «is_staff» de tipo «boolean».
  is_staff: boolean;
  /** null en mensajes del equipo vistos por el usuario (se muestra "Equipo SanKen"). */
  // Esta línea sirve para declarar el campo «author_name» de tipo «string | null».
  author_name: string | null;
  // Esta línea sirve para declarar el campo «created_at» de tipo «string».
  created_at: string;
}

// Esta línea sirve para declarar la interfaz «SupportTicket».
export interface SupportTicket {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «type» de tipo «SupportTicketType».
  type: SupportTicketType;
  // Esta línea sirve para declarar el campo «subject» de tipo «string».
  subject: string;
  // Esta línea sirve para declarar el campo «status» de tipo «SupportTicketStatus».
  status: SupportTicketStatus;
  // Esta línea sirve para declarar el campo «source» de tipo «'app' | 'weekly_checkin'».
  source: 'app' | 'weekly_checkin';
  // Esta línea sirve para declarar el campo «weekly_checkin_id» de tipo «number | null».
  weekly_checkin_id: number | null;
  // Esta línea sirve para declarar el campo «last_message_at» de tipo «string | null».
  last_message_at: string | null;
  // Esta línea sirve para declarar el campo «last_message_by_staff» de tipo «boolean».
  last_message_by_staff: boolean;
  // Esta línea sirve para declarar el campo «first_response_at» de tipo «string | null».
  first_response_at: string | null;
  // Esta línea sirve para declarar el campo «resolved_at» de tipo «string | null».
  resolved_at: string | null;
  // Esta línea sirve para declarar el campo «closed_at» de tipo «string | null».
  closed_at: string | null;
  // Esta línea sirve para declarar el campo «created_at» de tipo «string».
  created_at: string;
  // Esta línea sirve para declarar el campo opcional «messages» de tipo «SupportTicketMessage[]».
  messages?: SupportTicketMessage[];
}

/** Vista del equipo (GET /admin/support/...): agrega lo interno. */
// Esta línea sirve para declarar la interfaz «AdminSupportTicket».
export interface AdminSupportTicket extends SupportTicket {
  // Esta línea sirve para declarar el campo «priority» de tipo «SupportTicketPriority».
  priority: SupportTicketPriority;
  // Esta línea sirve para declarar el campo «context» de tipo «Record<string, unknown> | null».
  context: Record<string, unknown> | null;
  // Esta línea sirve para declarar el campo «user» con los datos básicos del usuario o null.
  user: { id: number; name: string; email: string } | null;
  // Esta línea sirve para declarar el campo «assignee» de tipo «{ id: number; name: string } | null».
  assignee: { id: number; name: string } | null;
}

// Esta línea sirve para declarar la interfaz «CreateSupportTicketPayload».
export interface CreateSupportTicketPayload {
  // Esta línea sirve para declarar el campo «type» de tipo «SupportTicketType».
  type: SupportTicketType;
  // Esta línea sirve para declarar el campo «subject» de tipo «string».
  subject: string;
  // Esta línea sirve para declarar el campo «message» de tipo «string».
  message: string;
}

// Esta línea sirve para declarar la interfaz «WeeklyCheckin».
export interface WeeklyCheckin {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «week» de tipo «string».
  week: string;
  // Esta línea sirve para declarar el campo «status» de tipo «WeeklyCheckinStatus».
  status: WeeklyCheckinStatus;
  // Esta línea sirve para declarar el campo «mood» de tipo «CheckinMood | null».
  mood: CheckinMood | null;
  // Esta línea sirve para declarar el campo «topic» de tipo «CheckinTopic | null».
  topic: CheckinTopic | null;
  // Esta línea sirve para declarar el campo «postpone_count» de tipo «number».
  postpone_count: number;
  // Esta línea sirve para declarar el campo «answered_at» de tipo «string | null».
  answered_at: string | null;
  // Esta línea sirve para declarar el campo «support_ticket_id» de tipo «number | null».
  support_ticket_id: number | null;
}

// Esta línea sirve para declarar la interfaz «CurrentCheckinResponse».
export interface CurrentCheckinResponse {
  // Esta línea sirve para declarar el campo «checkin» de tipo «WeeklyCheckin | null».
  checkin: WeeklyCheckin | null;
  // Esta línea sirve para declarar el campo «should_prompt» de tipo «boolean».
  should_prompt: boolean;
}

// Esta línea sirve para declarar la interfaz «AnswerCheckinPayload».
export interface AnswerCheckinPayload {
  // Esta línea sirve para declarar el campo «mood» de tipo «CheckinMood».
  mood: CheckinMood;
  // Esta línea sirve para declarar el campo «topic» de tipo «CheckinTopic».
  topic: CheckinTopic;
  // Esta línea sirve para declarar el campo opcional «comment» de tipo «string».
  comment?: string;
}

// Esta línea sirve para declarar la interfaz «AnswerCheckinResponse».
export interface AnswerCheckinResponse {
  // Esta línea sirve para declarar el campo «checkin» de tipo «WeeklyCheckin».
  checkin: WeeklyCheckin;
  // Esta línea sirve para declarar el campo «ticket» de tipo «SupportTicket | null».
  ticket: SupportTicket | null;
}

// Esta línea sirve para declarar la interfaz «SupportStats».
export interface SupportStats {
  // Esta línea sirve para declarar el campo «tickets» de tipo «{».
  tickets: {
    // Esta línea sirve para declarar el campo «open» de tipo «number».
    open: number;
    // Esta línea sirve para declarar el campo «in_review» de tipo «number».
    in_review: number;
    // Esta línea sirve para declarar el campo «answered» de tipo «number».
    answered: number;
    // Esta línea sirve para declarar el campo «resolved» de tipo «number».
    resolved: number;
    // Esta línea sirve para declarar el campo «closed» de tipo «number».
    closed: number;
    // Esta línea sirve para declarar el campo «awaiting_staff» de tipo «number».
    awaiting_staff: number;
    // Esta línea sirve para declarar el campo «this_week» de tipo «number».
    this_week: number;
    // Esta línea sirve para declarar el campo «total» de tipo «number».
    total: number;
    // Esta línea sirve para declarar el campo «by_type» con el conteo por tipo de solicitud.
    by_type: Partial<Record<SupportTicketType, number>>;
    // Esta línea sirve para declarar el campo «avg_first_response_hours» de tipo «number | null».
    avg_first_response_hours: number | null;
    // Esta línea sirve para declarar el campo «avg_resolution_hours» de tipo «number | null».
    avg_resolution_hours: number | null;
  };
  // Esta línea sirve para declarar el campo «checkins» de tipo «{».
  checkins: {
    // Esta línea sirve para declarar el campo «current_week» de tipo «string».
    current_week: string;
    // Esta línea sirve para declarar el campo «weeks» de tipo «{».
    weeks: {
      // Esta línea sirve para declarar el campo «week» de tipo «string».
      week: string;
      // Esta línea sirve para declarar el campo «offered» de tipo «number».
      offered: number;
      // Esta línea sirve para declarar el campo «answered» de tipo «number».
      answered: number;
      // Esta línea sirve para declarar el campo «postponed» de tipo «number».
      postponed: number;
      // Esta línea sirve para declarar el campo «ignored» de tipo «number | null».
      ignored: number | null;
      // Esta línea sirve para declarar el campo «response_rate» de tipo «number | null».
      response_rate: number | null;
    }[];
    // Esta línea sirve para declarar el campo «moods» de tipo «Partial<Record<CheckinMood, number>>».
    moods: Partial<Record<CheckinMood, number>>;
    // Esta línea sirve para declarar el campo «topics» de tipo «Partial<Record<CheckinTopic, number>>».
    topics: Partial<Record<CheckinTopic, number>>;
  };
}

/**
 * Datos de las notificaciones nuevas (soporte y check-in). A diferencia de
 * NewChatMessageNotificationData, traen título, cuerpo y `link` (ruta
 * compartida web/mobile) — el feed las muestra de forma genérica.
 */
// Esta línea sirve para declarar la interfaz «LinkedNotificationData».
export interface LinkedNotificationData {
  // Esta línea sirve para declarar el campo «kind» de tipo «string».
  kind: string;
  // Esta línea sirve para declarar el campo «title» de tipo «string».
  title: string;
  // Esta línea sirve para declarar el campo «body» de tipo «string».
  body: string;
  // Esta línea sirve para declarar el campo «link» de tipo «string».
  link: string;
}

// Esta línea sirve para declarar la función que detecta datos de notificación con enlace.
export function isLinkedNotificationData(data: unknown): data is LinkedNotificationData {
  // Esta línea sirve para devolver verdadero si es un objeto con el campo link de tipo texto.
  return !!data && typeof data === 'object' && typeof (data as LinkedNotificationData).link === 'string';
}
