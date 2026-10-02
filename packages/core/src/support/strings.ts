import type { LegalLocale } from '../legal/types';
import type {
  CheckinMood,
  CheckinTopic,
  SupportTicketPriority,
  SupportTicketStatus,
  SupportTicketType,
} from '../types/support';

/**
 * Textos de Soporte y del check-in semanal (ES/EN), mismo patrón que
 * legal/strings.ts: SanKen no tiene un i18n global y la interfaz es en
 * español, así que web y mobile usan SUPPORT_STRINGS.es sin hardcodear los
 * textos en los componentes.
 */
export interface SupportStrings {
  sectionTitle: string;
  sectionSubtitle: string;
  newRequest: string;
  myRequests: string;
  emptyRequests: string;
  requestNumber: (id: number) => string;
  typeLabel: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  send: string;
  sending: string;
  cancel: string;
  createError: string;
  replyPlaceholder: string;
  reply: string;
  closeRequest: string;
  closedNotice: string;
  staffName: string;
  youName: string;
  statusLabel: string;
  createdOn: (date: string) => string;
  lastActivity: (date: string) => string;
  fromCheckin: string;
  newReply: string;
  loadError: string;
  back: string;
  conversation: string;
  done: string;

  types: Record<SupportTicketType, string>;
  typeHints: Record<SupportTicketType, string>;
  statuses: Record<SupportTicketStatus, string>;
  statusHints: Record<SupportTicketStatus, string>;
  priorities: Record<SupportTicketPriority, string>;

  checkinTitle: string;
  checkinCta: string;
  checkinMoodQuestion: string;
  checkinTopicQuestion: string;
  checkinCommentQuestion: string;
  checkinCommentPlaceholder: string;
  checkinSubmit: string;
  checkinLater: string;
  checkinThanks: string;
  checkinThanksWithTicket: (id: number) => string;
  checkinAnswered: string;
  checkinUnavailable: string;
  checkinPrivacyNote: string;
  moods: Record<CheckinMood, { emoji: string; label: string }>;
  topics: Record<CheckinTopic, string>;

  admin: {
    title: string;
    subtitle: string;
    search: string;
    searchUser: string;
    allTypes: string;
    allStatuses: string;
    awaiting: string;
    from: string;
    to: string;
    columns: { id: string; user: string; type: string; subject: string; status: string; priority: string; date: string };
    empty: string;
    stats: {
      open: string;
      inReview: string;
      awaiting: string;
      resolved: string;
      thisWeek: string;
      avgFirstResponse: string;
      avgResolution: string;
      hours: (h: number) => string;
      noData: string;
      checkinsTitle: string;
      week: string;
      offered: string;
      answered: string;
      postponed: string;
      ignored: string;
      responseRate: string;
      moods: string;
      topics: string;
      byType: string;
    };
    assignee: string;
    unassigned: string;
    priority: string;
    status: string;
    context: string;
    replyAsStaff: string;
    save: string;
    user: string;
    contextLabels: Record<string, string>;
  };
}

const es: SupportStrings = {
  sectionTitle: 'Soporte',
  sectionSubtitle: 'Escríbenos tus dudas, reclamos, observaciones o sugerencias. El equipo de SanKen te responde por aquí.',
  newRequest: 'Nueva solicitud',
  myRequests: 'Mis solicitudes',
  emptyRequests: 'Todavía no enviaste ninguna solicitud.',
  requestNumber: (id) => `Solicitud #${id}`,
  typeLabel: 'Tipo',
  subjectLabel: 'Asunto',
  subjectPlaceholder: 'Ej.: No entiendo mi rutina de hoy',
  messageLabel: 'Mensaje',
  messagePlaceholder: 'Cuéntanos con detalle qué necesitas.',
  send: 'Enviar',
  sending: 'Enviando…',
  cancel: 'Cancelar',
  createError: 'No se pudo enviar. Inténtalo de nuevo.',
  replyPlaceholder: 'Escribe tu respuesta…',
  reply: 'Responder',
  closeRequest: 'Marcar como cerrada',
  closedNotice: 'Esta solicitud está cerrada. Si necesitas algo más, crea una nueva.',
  staffName: 'Equipo SanKen',
  youName: 'Tú',
  statusLabel: 'Estado',
  createdOn: (date) => `Creada el ${date}`,
  lastActivity: (date) => `Última actividad: ${date}`,
  fromCheckin: 'Desde el check-in semanal',
  newReply: 'Respuesta nueva',
  loadError: 'No se pudo cargar. Inténtalo de nuevo.',
  back: 'Volver',
  conversation: 'Conversación',
  done: 'Listo',

  types: {
    question: 'Duda',
    complaint: 'Reclamo',
    observation: 'Observación',
    suggestion: 'Sugerencia',
    technical_issue: 'Problema técnico',
    other: 'Otro',
  },
  typeHints: {
    question: 'Algo que no entiendes de la app o de tus entrenamientos.',
    complaint: 'Algo que no funcionó como esperabas.',
    observation: 'Un comentario que quieras que tengamos en cuenta.',
    suggestion: 'Una idea para mejorar SanKen.',
    technical_issue: 'Un error, algo que no carga o no funciona.',
    other: 'Cualquier otra cosa.',
  },
  statuses: {
    open: 'Abierta',
    in_review: 'En revisión',
    answered: 'Respondida',
    resolved: 'Resuelta',
    closed: 'Cerrada',
  },
  statusHints: {
    open: 'Recibimos tu solicitud y pronto la revisamos.',
    in_review: 'El equipo está revisando tu solicitud.',
    answered: 'El equipo te respondió. Puedes contestar si necesitas algo más.',
    resolved: 'La marcamos como resuelta. Si respondes, se vuelve a abrir.',
    closed: 'La conversación terminó.',
  },
  priorities: { low: 'Baja', normal: 'Normal', high: 'Alta', urgent: 'Urgente' },

  checkinTitle: 'Check-in semanal',
  checkinCta: 'Responder el check-in de esta semana',
  checkinMoodQuestion: '¿Cómo te has sentido esta semana con tus entrenamientos?',
  checkinTopicQuestion: '¿Hay algo que quieras contarnos sobre tus entrenamientos?',
  checkinCommentQuestion: 'Cuéntanos qué ocurrió',
  checkinCommentPlaceholder: 'Ej.: Siento que las rutinas están demasiado pesadas para mí.',
  checkinSubmit: 'Enviar',
  checkinLater: 'Ahora no',
  checkinThanks: '¡Gracias! Tu respuesta nos ayuda a mejorar tus entrenamientos.',
  checkinThanksWithTicket: (id) => `¡Gracias! Creamos la solicitud #${id}; el equipo te responderá en Soporte.`,
  checkinAnswered: 'Ya respondiste el check-in de esta semana. ¡Gracias!',
  checkinUnavailable: 'El check-in semanal se abre los viernes. Vuelve el fin de semana para contarnos cómo te fue.',
  checkinPrivacyNote: 'Solo el equipo de SanKen ve tus respuestas. No necesitamos datos médicos: cuéntanos cómo te sentiste entrenando.',
  moods: {
    great: { emoji: '😊', label: 'Muy bien' },
    good: { emoji: '🙂', label: 'Bien' },
    neutral: { emoji: '😐', label: 'Normal' },
    not_good: { emoji: '😕', label: 'No muy bien' },
    bad: { emoji: '😣', label: 'Mal' },
  },
  topics: {
    question: 'Tengo una duda',
    complaint: 'Tengo un reclamo',
    observation: 'Quiero hacer una observación',
    problem: 'Tengo un problema',
    suggestion: 'Quiero hacer una sugerencia',
    none: 'No, todo está bien',
  },

  admin: {
    title: 'Soporte',
    subtitle: 'Solicitudes de los usuarios y check-ins semanales.',
    search: 'Buscar en asunto, mensajes o #número',
    searchUser: 'Usuario (nombre o correo)',
    allTypes: 'Todos los tipos',
    allStatuses: 'Todos los estados',
    awaiting: 'Pendientes de respuesta',
    from: 'Desde',
    to: 'Hasta',
    columns: { id: 'ID', user: 'Usuario', type: 'Tipo', subject: 'Asunto', status: 'Estado', priority: 'Prioridad', date: 'Última actividad' },
    empty: 'No hay solicitudes con estos filtros.',
    stats: {
      open: 'Abiertas',
      inReview: 'En revisión',
      awaiting: 'Pendientes de respuesta',
      resolved: 'Resueltas',
      thisWeek: 'Esta semana',
      avgFirstResponse: 'Primera respuesta (prom.)',
      avgResolution: 'Resolución (prom.)',
      hours: (h) => `${h} h`,
      noData: 'Sin datos',
      checkinsTitle: 'Check-ins semanales',
      week: 'Semana',
      offered: 'Ofrecidos',
      answered: 'Respondidos',
      postponed: 'Pospuestos',
      ignored: 'Ignorados',
      responseRate: 'Tasa de respuesta',
      moods: 'Cómo se sintieron (últimas 4 semanas)',
      topics: 'Qué quisieron contar (últimas 4 semanas)',
      byType: 'Solicitudes por tipo',
    },
    assignee: 'Responsable',
    unassigned: 'Sin asignar',
    priority: 'Prioridad',
    status: 'Estado',
    context: 'Contexto del check-in',
    replyAsStaff: 'Responder como Equipo SanKen',
    save: 'Guardar',
    user: 'Usuario',
    contextLabels: {
      week: 'Semana',
      mood: 'Cómo se sintió',
      topic: 'Tema',
      routine_id: 'Rutina activa (ID)',
      sessions_completed_this_week: 'Sesiones completadas esa semana',
    },
  },
};

const en: SupportStrings = {
  sectionTitle: 'Support',
  sectionSubtitle: 'Send us your questions, complaints, observations or suggestions. The SanKen team replies here.',
  newRequest: 'New request',
  myRequests: 'My requests',
  emptyRequests: 'You have not sent any requests yet.',
  requestNumber: (id) => `Request #${id}`,
  typeLabel: 'Type',
  subjectLabel: 'Subject',
  subjectPlaceholder: 'E.g.: I do not understand today’s routine',
  messageLabel: 'Message',
  messagePlaceholder: 'Tell us in detail what you need.',
  send: 'Send',
  sending: 'Sending…',
  cancel: 'Cancel',
  createError: 'Could not send. Please try again.',
  replyPlaceholder: 'Write your reply…',
  reply: 'Reply',
  closeRequest: 'Mark as closed',
  closedNotice: 'This request is closed. If you need anything else, create a new one.',
  staffName: 'SanKen Team',
  youName: 'You',
  statusLabel: 'Status',
  createdOn: (date) => `Created on ${date}`,
  lastActivity: (date) => `Last activity: ${date}`,
  fromCheckin: 'From the weekly check-in',
  newReply: 'New reply',
  loadError: 'Could not load. Please try again.',
  back: 'Back',
  conversation: 'Conversation',
  done: 'Done',

  types: {
    question: 'Question',
    complaint: 'Complaint',
    observation: 'Observation',
    suggestion: 'Suggestion',
    technical_issue: 'Technical issue',
    other: 'Other',
  },
  typeHints: {
    question: 'Something you do not understand about the app or your workouts.',
    complaint: 'Something that did not work as expected.',
    observation: 'A comment you want us to take into account.',
    suggestion: 'An idea to improve SanKen.',
    technical_issue: 'An error, something that does not load or work.',
    other: 'Anything else.',
  },
  statuses: {
    open: 'Open',
    in_review: 'In review',
    answered: 'Answered',
    resolved: 'Resolved',
    closed: 'Closed',
  },
  statusHints: {
    open: 'We received your request and will review it soon.',
    in_review: 'The team is reviewing your request.',
    answered: 'The team replied. You can answer if you need anything else.',
    resolved: 'We marked it as resolved. If you reply, it reopens.',
    closed: 'The conversation has ended.',
  },
  priorities: { low: 'Low', normal: 'Normal', high: 'High', urgent: 'Urgent' },

  checkinTitle: 'Weekly check-in',
  checkinCta: 'Answer this week’s check-in',
  checkinMoodQuestion: 'How have you felt about your workouts this week?',
  checkinTopicQuestion: 'Is there anything you want to tell us about your workouts?',
  checkinCommentQuestion: 'Tell us what happened',
  checkinCommentPlaceholder: 'E.g.: I feel the routines are too heavy for me.',
  checkinSubmit: 'Send',
  checkinLater: 'Not now',
  checkinThanks: 'Thanks! Your answer helps us improve your workouts.',
  checkinThanksWithTicket: (id) => `Thanks! We created request #${id}; the team will reply in Support.`,
  checkinAnswered: 'You already answered this week’s check-in. Thanks!',
  checkinUnavailable: 'The weekly check-in opens on Fridays. Come back over the weekend to tell us how it went.',
  checkinPrivacyNote: 'Only the SanKen team sees your answers. We do not need medical data: tell us how training felt.',
  moods: {
    great: { emoji: '😊', label: 'Very good' },
    good: { emoji: '🙂', label: 'Good' },
    neutral: { emoji: '😐', label: 'Okay' },
    not_good: { emoji: '😕', label: 'Not great' },
    bad: { emoji: '😣', label: 'Bad' },
  },
  topics: {
    question: 'I have a question',
    complaint: 'I have a complaint',
    observation: 'I want to make an observation',
    problem: 'I have a problem',
    suggestion: 'I want to make a suggestion',
    none: 'No, everything is fine',
  },

  admin: {
    title: 'Support',
    subtitle: 'User requests and weekly check-ins.',
    search: 'Search subject, messages or #number',
    searchUser: 'User (name or email)',
    allTypes: 'All types',
    allStatuses: 'All statuses',
    awaiting: 'Awaiting reply',
    from: 'From',
    to: 'To',
    columns: { id: 'ID', user: 'User', type: 'Type', subject: 'Subject', status: 'Status', priority: 'Priority', date: 'Last activity' },
    empty: 'No requests match these filters.',
    stats: {
      open: 'Open',
      inReview: 'In review',
      awaiting: 'Awaiting reply',
      resolved: 'Resolved',
      thisWeek: 'This week',
      avgFirstResponse: 'First response (avg.)',
      avgResolution: 'Resolution (avg.)',
      hours: (h) => `${h} h`,
      noData: 'No data',
      checkinsTitle: 'Weekly check-ins',
      week: 'Week',
      offered: 'Offered',
      answered: 'Answered',
      postponed: 'Postponed',
      ignored: 'Ignored',
      responseRate: 'Response rate',
      moods: 'How they felt (last 4 weeks)',
      topics: 'What they wanted to tell (last 4 weeks)',
      byType: 'Requests by type',
    },
    assignee: 'Assignee',
    unassigned: 'Unassigned',
    priority: 'Priority',
    status: 'Status',
    context: 'Check-in context',
    replyAsStaff: 'Reply as SanKen Team',
    save: 'Save',
    user: 'User',
    contextLabels: {
      week: 'Week',
      mood: 'How they felt',
      topic: 'Topic',
      routine_id: 'Active routine (ID)',
      sessions_completed_this_week: 'Sessions completed that week',
    },
  },
};

export const SUPPORT_STRINGS: Record<LegalLocale, SupportStrings> = { es, en };
