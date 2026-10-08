// Esta línea sirve para importar el tipo de idioma legal.
import type { LegalLocale } from '../legal/types';
// Esta línea sirve para importar los tipos de soporte y check-in.
import type {
  // Esta línea sirve para importar el tipo «CheckinMood».
  CheckinMood,
  // Esta línea sirve para importar el tipo «CheckinTopic».
  CheckinTopic,
  // Esta línea sirve para importar el tipo «SupportTicketPriority».
  SupportTicketPriority,
  // Esta línea sirve para importar el tipo «SupportTicketStatus».
  SupportTicketStatus,
  // Esta línea sirve para importar el tipo «SupportTicketType».
  SupportTicketType,
// Esta línea sirve para terminar la importación de los tipos de soporte.
} from '../types/support';

/**
 * Textos de Soporte y del check-in semanal (ES/EN), mismo patrón que
 * legal/strings.ts: SanKen no tiene un i18n global y la interfaz es en
 * español, así que web y mobile usan SUPPORT_STRINGS.es sin hardcodear los
 * textos en los componentes.
 */
// Esta línea sirve para declarar la interfaz «SupportStrings».
export interface SupportStrings {
  // Esta línea sirve para declarar el texto «sectionTitle».
  sectionTitle: string;
  // Esta línea sirve para declarar el texto «sectionSubtitle».
  sectionSubtitle: string;
  // Esta línea sirve para declarar el texto «newRequest».
  newRequest: string;
  // Esta línea sirve para declarar el texto «myRequests».
  myRequests: string;
  // Esta línea sirve para declarar el texto «emptyRequests».
  emptyRequests: string;
  // Esta línea sirve para declarar la función que genera el texto «requestNumber».
  requestNumber: (id: number) => string;
  // Esta línea sirve para declarar el texto «typeLabel».
  typeLabel: string;
  // Esta línea sirve para declarar el texto «subjectLabel».
  subjectLabel: string;
  // Esta línea sirve para declarar el texto «subjectPlaceholder».
  subjectPlaceholder: string;
  // Esta línea sirve para declarar el texto «messageLabel».
  messageLabel: string;
  // Esta línea sirve para declarar el texto «messagePlaceholder».
  messagePlaceholder: string;
  // Esta línea sirve para declarar el texto «send».
  send: string;
  // Esta línea sirve para declarar el texto «sending».
  sending: string;
  // Esta línea sirve para declarar el texto «cancel».
  cancel: string;
  // Esta línea sirve para declarar el texto «createError».
  createError: string;
  // Esta línea sirve para declarar el texto «replyPlaceholder».
  replyPlaceholder: string;
  // Esta línea sirve para declarar el texto «reply».
  reply: string;
  // Esta línea sirve para declarar el texto «closeRequest».
  closeRequest: string;
  // Esta línea sirve para declarar el texto «closedNotice».
  closedNotice: string;
  // Esta línea sirve para declarar el texto «staffName».
  staffName: string;
  // Esta línea sirve para declarar el texto «youName».
  youName: string;
  // Esta línea sirve para declarar el texto «statusLabel».
  statusLabel: string;
  // Esta línea sirve para declarar la función que genera el texto «createdOn».
  createdOn: (date: string) => string;
  // Esta línea sirve para declarar la función que genera el texto «lastActivity».
  lastActivity: (date: string) => string;
  // Esta línea sirve para declarar el texto «fromCheckin».
  fromCheckin: string;
  // Esta línea sirve para declarar el texto «newReply».
  newReply: string;
  // Esta línea sirve para declarar el texto «loadError».
  loadError: string;
  // Esta línea sirve para declarar el texto «back».
  back: string;
  // Esta línea sirve para declarar el texto «conversation».
  conversation: string;
  // Esta línea sirve para declarar el texto «done».
  done: string;

  // Esta línea sirve para declarar el mapa de textos «types» por clave.
  types: Record<SupportTicketType, string>;
  // Esta línea sirve para declarar el mapa de textos «typeHints» por clave.
  typeHints: Record<SupportTicketType, string>;
  // Esta línea sirve para declarar el mapa de textos «statuses» por clave.
  statuses: Record<SupportTicketStatus, string>;
  // Esta línea sirve para declarar el mapa de textos «statusHints» por clave.
  statusHints: Record<SupportTicketStatus, string>;
  // Esta línea sirve para declarar el mapa de textos «priorities» por clave.
  priorities: Record<SupportTicketPriority, string>;

  // Esta línea sirve para declarar el texto «checkinTitle».
  checkinTitle: string;
  // Esta línea sirve para declarar el texto «checkinCta».
  checkinCta: string;
  // Esta línea sirve para declarar el texto «checkinMoodQuestion».
  checkinMoodQuestion: string;
  // Esta línea sirve para declarar el texto «checkinTopicQuestion».
  checkinTopicQuestion: string;
  // Esta línea sirve para declarar el texto «checkinCommentQuestion».
  checkinCommentQuestion: string;
  // Esta línea sirve para declarar el texto «checkinCommentPlaceholder».
  checkinCommentPlaceholder: string;
  // Esta línea sirve para declarar el texto «checkinSubmit».
  checkinSubmit: string;
  // Esta línea sirve para declarar el texto «checkinLater».
  checkinLater: string;
  // Esta línea sirve para declarar el texto «checkinThanks».
  checkinThanks: string;
  // Esta línea sirve para declarar la función que genera el texto «checkinThanksWithTicket».
  checkinThanksWithTicket: (id: number) => string;
  // Esta línea sirve para declarar el texto «checkinAnswered».
  checkinAnswered: string;
  // Esta línea sirve para declarar el texto «checkinUnavailable».
  checkinUnavailable: string;
  // Esta línea sirve para declarar el texto «checkinPrivacyNote».
  checkinPrivacyNote: string;
  // Esta línea sirve para declarar el mapa de textos «moods» por clave.
  moods: Record<CheckinMood, { emoji: string; label: string }>;
  // Esta línea sirve para declarar el mapa de textos «topics» por clave.
  topics: Record<CheckinTopic, string>;

  // Esta línea sirve para abrir el grupo de textos «admin».
  admin: {
    // Esta línea sirve para declarar el texto «title».
    title: string;
    // Esta línea sirve para declarar el texto «subtitle».
    subtitle: string;
    // Esta línea sirve para declarar el texto «search».
    search: string;
    // Esta línea sirve para declarar el texto «searchUser».
    searchUser: string;
    // Esta línea sirve para declarar el texto «allTypes».
    allTypes: string;
    // Esta línea sirve para declarar el texto «allStatuses».
    allStatuses: string;
    // Esta línea sirve para declarar el texto «awaiting».
    awaiting: string;
    // Esta línea sirve para declarar el texto «from».
    from: string;
    // Esta línea sirve para declarar el texto «to».
    to: string;
    // Esta línea sirve para definir los textos agrupados «columns» en una sola línea.
    columns: { id: string; user: string; type: string; subject: string; status: string; priority: string; date: string };
    // Esta línea sirve para declarar el texto «empty».
    empty: string;
    // Esta línea sirve para abrir el grupo de textos «stats».
    stats: {
      // Esta línea sirve para declarar el texto «open».
      open: string;
      // Esta línea sirve para declarar el texto «inReview».
      inReview: string;
      // Esta línea sirve para declarar el texto «awaiting».
      awaiting: string;
      // Esta línea sirve para declarar el texto «resolved».
      resolved: string;
      // Esta línea sirve para declarar el texto «thisWeek».
      thisWeek: string;
      // Esta línea sirve para declarar el texto «avgFirstResponse».
      avgFirstResponse: string;
      // Esta línea sirve para declarar el texto «avgResolution».
      avgResolution: string;
      // Esta línea sirve para declarar la función que genera el texto «hours».
      hours: (h: number) => string;
      // Esta línea sirve para declarar el texto «noData».
      noData: string;
      // Esta línea sirve para declarar el texto «checkinsTitle».
      checkinsTitle: string;
      // Esta línea sirve para declarar el texto «week».
      week: string;
      // Esta línea sirve para declarar el texto «offered».
      offered: string;
      // Esta línea sirve para declarar el texto «answered».
      answered: string;
      // Esta línea sirve para declarar el texto «postponed».
      postponed: string;
      // Esta línea sirve para declarar el texto «ignored».
      ignored: string;
      // Esta línea sirve para declarar el texto «responseRate».
      responseRate: string;
      // Esta línea sirve para declarar el texto «moods».
      moods: string;
      // Esta línea sirve para declarar el texto «topics».
      topics: string;
      // Esta línea sirve para declarar el texto «byType».
      byType: string;
    };
    // Esta línea sirve para declarar el texto «assignee».
    assignee: string;
    // Esta línea sirve para declarar el texto «unassigned».
    unassigned: string;
    // Esta línea sirve para declarar el texto «priority».
    priority: string;
    // Esta línea sirve para declarar el texto «status».
    status: string;
    // Esta línea sirve para declarar el texto «context».
    context: string;
    // Esta línea sirve para declarar el texto «replyAsStaff».
    replyAsStaff: string;
    // Esta línea sirve para declarar el texto «save».
    save: string;
    // Esta línea sirve para declarar el texto «user».
    user: string;
    // Esta línea sirve para declarar el mapa de textos «contextLabels» por clave.
    contextLabels: Record<string, string>;
  };
}

// Esta línea sirve para declarar los textos de soporte en el idioma «es».
const es: SupportStrings = {
  // Esta línea sirve para definir el texto «sectionTitle»: «Soporte».
  sectionTitle: 'Soporte',
  // Esta línea sirve para definir el texto «sectionSubtitle»: «Escríbenos tus dudas, reclamos, observaciones o su».
  sectionSubtitle: 'Escríbenos tus dudas, reclamos, observaciones o sugerencias. El equipo de SanKen te responde por aquí.',
  // Esta línea sirve para definir el texto «newRequest»: «Nueva solicitud».
  newRequest: 'Nueva solicitud',
  // Esta línea sirve para definir el texto «myRequests»: «Mis solicitudes».
  myRequests: 'Mis solicitudes',
  // Esta línea sirve para definir el texto «emptyRequests»: «Todavía no enviaste ninguna solicitud.».
  emptyRequests: 'Todavía no enviaste ninguna solicitud.',
  // Esta línea sirve para definir la función que genera el texto «requestNumber»: «Solicitud #${id}…».
  requestNumber: (id) => `Solicitud #${id}`,
  // Esta línea sirve para definir el texto «typeLabel»: «Tipo».
  typeLabel: 'Tipo',
  // Esta línea sirve para definir el texto «subjectLabel»: «Asunto».
  subjectLabel: 'Asunto',
  // Esta línea sirve para definir el texto «subjectPlaceholder»: «Ej.: No entiendo mi rutina de hoy».
  subjectPlaceholder: 'Ej.: No entiendo mi rutina de hoy',
  // Esta línea sirve para definir el texto «messageLabel»: «Mensaje».
  messageLabel: 'Mensaje',
  // Esta línea sirve para definir el texto «messagePlaceholder»: «Cuéntanos con detalle qué necesitas.».
  messagePlaceholder: 'Cuéntanos con detalle qué necesitas.',
  // Esta línea sirve para definir el texto «send»: «Enviar».
  send: 'Enviar',
  // Esta línea sirve para definir el texto «sending»: «Enviando…».
  sending: 'Enviando…',
  // Esta línea sirve para definir el texto «cancel»: «Cancelar».
  cancel: 'Cancelar',
  // Esta línea sirve para definir el texto «createError»: «No se pudo enviar. Inténtalo de nuevo.».
  createError: 'No se pudo enviar. Inténtalo de nuevo.',
  // Esta línea sirve para definir el texto «replyPlaceholder»: «Escribe tu respuesta…».
  replyPlaceholder: 'Escribe tu respuesta…',
  // Esta línea sirve para definir el texto «reply»: «Responder».
  reply: 'Responder',
  // Esta línea sirve para definir el texto «closeRequest»: «Marcar como cerrada».
  closeRequest: 'Marcar como cerrada',
  // Esta línea sirve para definir el texto «closedNotice»: «Esta solicitud está cerrada. Si necesitas algo más».
  closedNotice: 'Esta solicitud está cerrada. Si necesitas algo más, crea una nueva.',
  // Esta línea sirve para definir el texto «staffName»: «Equipo SanKen».
  staffName: 'Equipo SanKen',
  // Esta línea sirve para definir el texto «youName»: «Tú».
  youName: 'Tú',
  // Esta línea sirve para definir el texto «statusLabel»: «Estado».
  statusLabel: 'Estado',
  // Esta línea sirve para definir la función que genera el texto «createdOn»: «Creada el ${date}…».
  createdOn: (date) => `Creada el ${date}`,
  // Esta línea sirve para definir la función que genera el texto «lastActivity»: «Última actividad: ${date}…».
  lastActivity: (date) => `Última actividad: ${date}`,
  // Esta línea sirve para definir el texto «fromCheckin»: «Desde el check-in semanal».
  fromCheckin: 'Desde el check-in semanal',
  // Esta línea sirve para definir el texto «newReply»: «Respuesta nueva».
  newReply: 'Respuesta nueva',
  // Esta línea sirve para definir el texto «loadError»: «No se pudo cargar. Inténtalo de nuevo.».
  loadError: 'No se pudo cargar. Inténtalo de nuevo.',
  // Esta línea sirve para definir el texto «back»: «Volver».
  back: 'Volver',
  // Esta línea sirve para definir el texto «conversation»: «Conversación».
  conversation: 'Conversación',
  // Esta línea sirve para definir el texto «done»: «Listo».
  done: 'Listo',

  // Esta línea sirve para abrir el grupo de textos «types».
  types: {
    // Esta línea sirve para definir el texto «question»: «Duda».
    question: 'Duda',
    // Esta línea sirve para definir el texto «complaint»: «Reclamo».
    complaint: 'Reclamo',
    // Esta línea sirve para definir el texto «observation»: «Observación».
    observation: 'Observación',
    // Esta línea sirve para definir el texto «suggestion»: «Sugerencia».
    suggestion: 'Sugerencia',
    // Esta línea sirve para definir el texto «technical_issue»: «Problema técnico».
    technical_issue: 'Problema técnico',
    // Esta línea sirve para definir el texto «other»: «Otro».
    other: 'Otro',
  },
  // Esta línea sirve para abrir el grupo de textos «typeHints».
  typeHints: {
    // Esta línea sirve para definir el texto «question»: «Algo que no entiendes de la app o de tus entrenami».
    question: 'Algo que no entiendes de la app o de tus entrenamientos.',
    // Esta línea sirve para definir el texto «complaint»: «Algo que no funcionó como esperabas.».
    complaint: 'Algo que no funcionó como esperabas.',
    // Esta línea sirve para definir el texto «observation»: «Un comentario que quieras que tengamos en cuenta.».
    observation: 'Un comentario que quieras que tengamos en cuenta.',
    // Esta línea sirve para definir el texto «suggestion»: «Una idea para mejorar SanKen.».
    suggestion: 'Una idea para mejorar SanKen.',
    // Esta línea sirve para definir el texto «technical_issue»: «Un error, algo que no carga o no funciona.».
    technical_issue: 'Un error, algo que no carga o no funciona.',
    // Esta línea sirve para definir el texto «other»: «Cualquier otra cosa.».
    other: 'Cualquier otra cosa.',
  },
  // Esta línea sirve para abrir el grupo de textos «statuses».
  statuses: {
    // Esta línea sirve para definir el texto «open»: «Abierta».
    open: 'Abierta',
    // Esta línea sirve para definir el texto «in_review»: «En revisión».
    in_review: 'En revisión',
    // Esta línea sirve para definir el texto «answered»: «Respondida».
    answered: 'Respondida',
    // Esta línea sirve para definir el texto «resolved»: «Resuelta».
    resolved: 'Resuelta',
    // Esta línea sirve para definir el texto «closed»: «Cerrada».
    closed: 'Cerrada',
  },
  // Esta línea sirve para abrir el grupo de textos «statusHints».
  statusHints: {
    // Esta línea sirve para definir el texto «open»: «Recibimos tu solicitud y pronto la revisamos.».
    open: 'Recibimos tu solicitud y pronto la revisamos.',
    // Esta línea sirve para definir el texto «in_review»: «El equipo está revisando tu solicitud.».
    in_review: 'El equipo está revisando tu solicitud.',
    // Esta línea sirve para definir el texto «answered»: «El equipo te respondió. Puedes contestar si necesi».
    answered: 'El equipo te respondió. Puedes contestar si necesitas algo más.',
    // Esta línea sirve para definir el texto «resolved»: «La marcamos como resuelta. Si respondes, se vuelve».
    resolved: 'La marcamos como resuelta. Si respondes, se vuelve a abrir.',
    // Esta línea sirve para definir el texto «closed»: «La conversación terminó.».
    closed: 'La conversación terminó.',
  },
  // Esta línea sirve para definir los textos agrupados «priorities» en una sola línea.
  priorities: { low: 'Baja', normal: 'Normal', high: 'Alta', urgent: 'Urgente' },

  // Esta línea sirve para definir el texto «checkinTitle»: «Check-in semanal».
  checkinTitle: 'Check-in semanal',
  // Esta línea sirve para definir el texto «checkinCta»: «Responder el check-in de esta semana».
  checkinCta: 'Responder el check-in de esta semana',
  // Esta línea sirve para definir el texto «checkinMoodQuestion»: «¿Cómo te has sentido esta semana con tus entrenami».
  checkinMoodQuestion: '¿Cómo te has sentido esta semana con tus entrenamientos?',
  // Esta línea sirve para definir el texto «checkinTopicQuestion»: «¿Hay algo que quieras contarnos sobre tus entrenam».
  checkinTopicQuestion: '¿Hay algo que quieras contarnos sobre tus entrenamientos?',
  // Esta línea sirve para definir el texto «checkinCommentQuestion»: «Cuéntanos qué ocurrió».
  checkinCommentQuestion: 'Cuéntanos qué ocurrió',
  // Esta línea sirve para definir el texto «checkinCommentPlaceholder»: «Ej.: Siento que las rutinas están demasiado pesada».
  checkinCommentPlaceholder: 'Ej.: Siento que las rutinas están demasiado pesadas para mí.',
  // Esta línea sirve para definir el texto «checkinSubmit»: «Enviar».
  checkinSubmit: 'Enviar',
  // Esta línea sirve para definir el texto «checkinLater»: «Ahora no».
  checkinLater: 'Ahora no',
  // Esta línea sirve para definir el texto «checkinThanks»: «¡Gracias! Tu respuesta nos ayuda a mejorar tus ent».
  checkinThanks: '¡Gracias! Tu respuesta nos ayuda a mejorar tus entrenamientos.',
  // Esta línea sirve para definir la función que genera el texto «checkinThanksWithTicket»: «¡Gracias! Creamos la solicitud #${id}; e…».
  checkinThanksWithTicket: (id) => `¡Gracias! Creamos la solicitud #${id}; el equipo te responderá en Soporte.`,
  // Esta línea sirve para definir el texto «checkinAnswered»: «Ya respondiste el check-in de esta semana. ¡Gracia».
  checkinAnswered: 'Ya respondiste el check-in de esta semana. ¡Gracias!',
  // Esta línea sirve para definir el texto «checkinUnavailable»: «El check-in semanal se abre los viernes. Vuelve el».
  checkinUnavailable: 'El check-in semanal se abre los viernes. Vuelve el fin de semana para contarnos cómo te fue.',
  // Esta línea sirve para definir el texto «checkinPrivacyNote»: «Solo el equipo de SanKen ve tus respuestas. No nec».
  checkinPrivacyNote: 'Solo el equipo de SanKen ve tus respuestas. No necesitamos datos médicos: cuéntanos cómo te sentiste entrenando.',
  // Esta línea sirve para abrir el grupo de textos «moods».
  moods: {
    // Esta línea sirve para definir los textos agrupados «great» en una sola línea.
    great: { emoji: '😊', label: 'Muy bien' },
    // Esta línea sirve para definir los textos agrupados «good» en una sola línea.
    good: { emoji: '🙂', label: 'Bien' },
    // Esta línea sirve para definir los textos agrupados «neutral» en una sola línea.
    neutral: { emoji: '😐', label: 'Normal' },
    // Esta línea sirve para definir los textos agrupados «not_good» en una sola línea.
    not_good: { emoji: '😕', label: 'No muy bien' },
    // Esta línea sirve para definir los textos agrupados «bad» en una sola línea.
    bad: { emoji: '😣', label: 'Mal' },
  },
  // Esta línea sirve para abrir el grupo de textos «topics».
  topics: {
    // Esta línea sirve para definir el texto «question»: «Tengo una duda».
    question: 'Tengo una duda',
    // Esta línea sirve para definir el texto «complaint»: «Tengo un reclamo».
    complaint: 'Tengo un reclamo',
    // Esta línea sirve para definir el texto «observation»: «Quiero hacer una observación».
    observation: 'Quiero hacer una observación',
    // Esta línea sirve para definir el texto «problem»: «Tengo un problema».
    problem: 'Tengo un problema',
    // Esta línea sirve para definir el texto «suggestion»: «Quiero hacer una sugerencia».
    suggestion: 'Quiero hacer una sugerencia',
    // Esta línea sirve para definir el texto «none»: «No, todo está bien».
    none: 'No, todo está bien',
  },

  // Esta línea sirve para abrir el grupo de textos «admin».
  admin: {
    // Esta línea sirve para definir el texto «title»: «Soporte».
    title: 'Soporte',
    // Esta línea sirve para definir el texto «subtitle»: «Solicitudes de los usuarios y check-ins semanales.».
    subtitle: 'Solicitudes de los usuarios y check-ins semanales.',
    // Esta línea sirve para definir el texto «search»: «Buscar en asunto, mensajes o #número».
    search: 'Buscar en asunto, mensajes o #número',
    // Esta línea sirve para definir el texto «searchUser»: «Usuario (nombre o correo)».
    searchUser: 'Usuario (nombre o correo)',
    // Esta línea sirve para definir el texto «allTypes»: «Todos los tipos».
    allTypes: 'Todos los tipos',
    // Esta línea sirve para definir el texto «allStatuses»: «Todos los estados».
    allStatuses: 'Todos los estados',
    // Esta línea sirve para definir el texto «awaiting»: «Pendientes de respuesta».
    awaiting: 'Pendientes de respuesta',
    // Esta línea sirve para definir el texto «from»: «Desde».
    from: 'Desde',
    // Esta línea sirve para definir el texto «to»: «Hasta».
    to: 'Hasta',
    // Esta línea sirve para definir los textos agrupados «columns» en una sola línea.
    columns: { id: 'ID', user: 'Usuario', type: 'Tipo', subject: 'Asunto', status: 'Estado', priority: 'Prioridad', date: 'Última actividad' },
    // Esta línea sirve para definir el texto «empty»: «No hay solicitudes con estos filtros.».
    empty: 'No hay solicitudes con estos filtros.',
    // Esta línea sirve para abrir el grupo de textos «stats».
    stats: {
      // Esta línea sirve para definir el texto «open»: «Abiertas».
      open: 'Abiertas',
      // Esta línea sirve para definir el texto «inReview»: «En revisión».
      inReview: 'En revisión',
      // Esta línea sirve para definir el texto «awaiting»: «Pendientes de respuesta».
      awaiting: 'Pendientes de respuesta',
      // Esta línea sirve para definir el texto «resolved»: «Resueltas».
      resolved: 'Resueltas',
      // Esta línea sirve para definir el texto «thisWeek»: «Esta semana».
      thisWeek: 'Esta semana',
      // Esta línea sirve para definir el texto «avgFirstResponse»: «Primera respuesta (prom.)».
      avgFirstResponse: 'Primera respuesta (prom.)',
      // Esta línea sirve para definir el texto «avgResolution»: «Resolución (prom.)».
      avgResolution: 'Resolución (prom.)',
      // Esta línea sirve para definir la función que genera el texto «hours»: «${h} h…».
      hours: (h) => `${h} h`,
      // Esta línea sirve para definir el texto «noData»: «Sin datos».
      noData: 'Sin datos',
      // Esta línea sirve para definir el texto «checkinsTitle»: «Check-ins semanales».
      checkinsTitle: 'Check-ins semanales',
      // Esta línea sirve para definir el texto «week»: «Semana».
      week: 'Semana',
      // Esta línea sirve para definir el texto «offered»: «Ofrecidos».
      offered: 'Ofrecidos',
      // Esta línea sirve para definir el texto «answered»: «Respondidos».
      answered: 'Respondidos',
      // Esta línea sirve para definir el texto «postponed»: «Pospuestos».
      postponed: 'Pospuestos',
      // Esta línea sirve para definir el texto «ignored»: «Ignorados».
      ignored: 'Ignorados',
      // Esta línea sirve para definir el texto «responseRate»: «Tasa de respuesta».
      responseRate: 'Tasa de respuesta',
      // Esta línea sirve para definir el texto «moods»: «Cómo se sintieron (últimas 4 semanas)».
      moods: 'Cómo se sintieron (últimas 4 semanas)',
      // Esta línea sirve para definir el texto «topics»: «Qué quisieron contar (últimas 4 semanas)».
      topics: 'Qué quisieron contar (últimas 4 semanas)',
      // Esta línea sirve para definir el texto «byType»: «Solicitudes por tipo».
      byType: 'Solicitudes por tipo',
    },
    // Esta línea sirve para definir el texto «assignee»: «Responsable».
    assignee: 'Responsable',
    // Esta línea sirve para definir el texto «unassigned»: «Sin asignar».
    unassigned: 'Sin asignar',
    // Esta línea sirve para definir el texto «priority»: «Prioridad».
    priority: 'Prioridad',
    // Esta línea sirve para definir el texto «status»: «Estado».
    status: 'Estado',
    // Esta línea sirve para definir el texto «context»: «Contexto del check-in».
    context: 'Contexto del check-in',
    // Esta línea sirve para definir el texto «replyAsStaff»: «Responder como Equipo SanKen».
    replyAsStaff: 'Responder como Equipo SanKen',
    // Esta línea sirve para definir el texto «save»: «Guardar».
    save: 'Guardar',
    // Esta línea sirve para definir el texto «user»: «Usuario».
    user: 'Usuario',
    // Esta línea sirve para abrir el grupo de textos «contextLabels».
    contextLabels: {
      // Esta línea sirve para definir el texto «week»: «Semana».
      week: 'Semana',
      // Esta línea sirve para definir el texto «mood»: «Cómo se sintió».
      mood: 'Cómo se sintió',
      // Esta línea sirve para definir el texto «topic»: «Tema».
      topic: 'Tema',
      // Esta línea sirve para definir el texto «routine_id»: «Rutina activa (ID)».
      routine_id: 'Rutina activa (ID)',
      // Esta línea sirve para definir el texto «sessions_completed_this_week»: «Sesiones completadas esa semana».
      sessions_completed_this_week: 'Sesiones completadas esa semana',
    },
  },
};

// Esta línea sirve para declarar los textos de soporte en el idioma «en».
const en: SupportStrings = {
  // Esta línea sirve para definir el texto «sectionTitle»: «Support».
  sectionTitle: 'Support',
  // Esta línea sirve para definir el texto «sectionSubtitle»: «Send us your questions, complaints, observations o».
  sectionSubtitle: 'Send us your questions, complaints, observations or suggestions. The SanKen team replies here.',
  // Esta línea sirve para definir el texto «newRequest»: «New request».
  newRequest: 'New request',
  // Esta línea sirve para definir el texto «myRequests»: «My requests».
  myRequests: 'My requests',
  // Esta línea sirve para definir el texto «emptyRequests»: «You have not sent any requests yet.».
  emptyRequests: 'You have not sent any requests yet.',
  // Esta línea sirve para definir la función que genera el texto «requestNumber»: «Request #${id}…».
  requestNumber: (id) => `Request #${id}`,
  // Esta línea sirve para definir el texto «typeLabel»: «Type».
  typeLabel: 'Type',
  // Esta línea sirve para definir el texto «subjectLabel»: «Subject».
  subjectLabel: 'Subject',
  // Esta línea sirve para definir el texto «subjectPlaceholder»: «E.g.: I do not understand today’s routine».
  subjectPlaceholder: 'E.g.: I do not understand today’s routine',
  // Esta línea sirve para definir el texto «messageLabel»: «Message».
  messageLabel: 'Message',
  // Esta línea sirve para definir el texto «messagePlaceholder»: «Tell us in detail what you need.».
  messagePlaceholder: 'Tell us in detail what you need.',
  // Esta línea sirve para definir el texto «send»: «Send».
  send: 'Send',
  // Esta línea sirve para definir el texto «sending»: «Sending…».
  sending: 'Sending…',
  // Esta línea sirve para definir el texto «cancel»: «Cancel».
  cancel: 'Cancel',
  // Esta línea sirve para definir el texto «createError»: «Could not send. Please try again.».
  createError: 'Could not send. Please try again.',
  // Esta línea sirve para definir el texto «replyPlaceholder»: «Write your reply…».
  replyPlaceholder: 'Write your reply…',
  // Esta línea sirve para definir el texto «reply»: «Reply».
  reply: 'Reply',
  // Esta línea sirve para definir el texto «closeRequest»: «Mark as closed».
  closeRequest: 'Mark as closed',
  // Esta línea sirve para definir el texto «closedNotice»: «This request is closed. If you need anything else,».
  closedNotice: 'This request is closed. If you need anything else, create a new one.',
  // Esta línea sirve para definir el texto «staffName»: «SanKen Team».
  staffName: 'SanKen Team',
  // Esta línea sirve para definir el texto «youName»: «You».
  youName: 'You',
  // Esta línea sirve para definir el texto «statusLabel»: «Status».
  statusLabel: 'Status',
  // Esta línea sirve para definir la función que genera el texto «createdOn»: «Created on ${date}…».
  createdOn: (date) => `Created on ${date}`,
  // Esta línea sirve para definir la función que genera el texto «lastActivity»: «Last activity: ${date}…».
  lastActivity: (date) => `Last activity: ${date}`,
  // Esta línea sirve para definir el texto «fromCheckin»: «From the weekly check-in».
  fromCheckin: 'From the weekly check-in',
  // Esta línea sirve para definir el texto «newReply»: «New reply».
  newReply: 'New reply',
  // Esta línea sirve para definir el texto «loadError»: «Could not load. Please try again.».
  loadError: 'Could not load. Please try again.',
  // Esta línea sirve para definir el texto «back»: «Back».
  back: 'Back',
  // Esta línea sirve para definir el texto «conversation»: «Conversation».
  conversation: 'Conversation',
  // Esta línea sirve para definir el texto «done»: «Done».
  done: 'Done',

  // Esta línea sirve para abrir el grupo de textos «types».
  types: {
    // Esta línea sirve para definir el texto «question»: «Question».
    question: 'Question',
    // Esta línea sirve para definir el texto «complaint»: «Complaint».
    complaint: 'Complaint',
    // Esta línea sirve para definir el texto «observation»: «Observation».
    observation: 'Observation',
    // Esta línea sirve para definir el texto «suggestion»: «Suggestion».
    suggestion: 'Suggestion',
    // Esta línea sirve para definir el texto «technical_issue»: «Technical issue».
    technical_issue: 'Technical issue',
    // Esta línea sirve para definir el texto «other»: «Other».
    other: 'Other',
  },
  // Esta línea sirve para abrir el grupo de textos «typeHints».
  typeHints: {
    // Esta línea sirve para definir el texto «question»: «Something you do not understand about the app or y».
    question: 'Something you do not understand about the app or your workouts.',
    // Esta línea sirve para definir el texto «complaint»: «Something that did not work as expected.».
    complaint: 'Something that did not work as expected.',
    // Esta línea sirve para definir el texto «observation»: «A comment you want us to take into account.».
    observation: 'A comment you want us to take into account.',
    // Esta línea sirve para definir el texto «suggestion»: «An idea to improve SanKen.».
    suggestion: 'An idea to improve SanKen.',
    // Esta línea sirve para definir el texto «technical_issue»: «An error, something that does not load or work.».
    technical_issue: 'An error, something that does not load or work.',
    // Esta línea sirve para definir el texto «other»: «Anything else.».
    other: 'Anything else.',
  },
  // Esta línea sirve para abrir el grupo de textos «statuses».
  statuses: {
    // Esta línea sirve para definir el texto «open»: «Open».
    open: 'Open',
    // Esta línea sirve para definir el texto «in_review»: «In review».
    in_review: 'In review',
    // Esta línea sirve para definir el texto «answered»: «Answered».
    answered: 'Answered',
    // Esta línea sirve para definir el texto «resolved»: «Resolved».
    resolved: 'Resolved',
    // Esta línea sirve para definir el texto «closed»: «Closed».
    closed: 'Closed',
  },
  // Esta línea sirve para abrir el grupo de textos «statusHints».
  statusHints: {
    // Esta línea sirve para definir el texto «open»: «We received your request and will review it soon.».
    open: 'We received your request and will review it soon.',
    // Esta línea sirve para definir el texto «in_review»: «The team is reviewing your request.».
    in_review: 'The team is reviewing your request.',
    // Esta línea sirve para definir el texto «answered»: «The team replied. You can answer if you need anyth».
    answered: 'The team replied. You can answer if you need anything else.',
    // Esta línea sirve para definir el texto «resolved»: «We marked it as resolved. If you reply, it reopens».
    resolved: 'We marked it as resolved. If you reply, it reopens.',
    // Esta línea sirve para definir el texto «closed»: «The conversation has ended.».
    closed: 'The conversation has ended.',
  },
  // Esta línea sirve para definir los textos agrupados «priorities» en una sola línea.
  priorities: { low: 'Low', normal: 'Normal', high: 'High', urgent: 'Urgent' },

  // Esta línea sirve para definir el texto «checkinTitle»: «Weekly check-in».
  checkinTitle: 'Weekly check-in',
  // Esta línea sirve para definir el texto «checkinCta»: «Answer this week’s check-in».
  checkinCta: 'Answer this week’s check-in',
  // Esta línea sirve para definir el texto «checkinMoodQuestion»: «How have you felt about your workouts this week?».
  checkinMoodQuestion: 'How have you felt about your workouts this week?',
  // Esta línea sirve para definir el texto «checkinTopicQuestion»: «Is there anything you want to tell us about your w».
  checkinTopicQuestion: 'Is there anything you want to tell us about your workouts?',
  // Esta línea sirve para definir el texto «checkinCommentQuestion»: «Tell us what happened».
  checkinCommentQuestion: 'Tell us what happened',
  // Esta línea sirve para definir el texto «checkinCommentPlaceholder»: «E.g.: I feel the routines are too heavy for me.».
  checkinCommentPlaceholder: 'E.g.: I feel the routines are too heavy for me.',
  // Esta línea sirve para definir el texto «checkinSubmit»: «Send».
  checkinSubmit: 'Send',
  // Esta línea sirve para definir el texto «checkinLater»: «Not now».
  checkinLater: 'Not now',
  // Esta línea sirve para definir el texto «checkinThanks»: «Thanks! Your answer helps us improve your workouts».
  checkinThanks: 'Thanks! Your answer helps us improve your workouts.',
  // Esta línea sirve para definir la función que genera el texto «checkinThanksWithTicket»: «Thanks! We created request #${id}; the t…».
  checkinThanksWithTicket: (id) => `Thanks! We created request #${id}; the team will reply in Support.`,
  // Esta línea sirve para definir el texto «checkinAnswered»: «You already answered this week’s check-in. Thanks!».
  checkinAnswered: 'You already answered this week’s check-in. Thanks!',
  // Esta línea sirve para definir el texto «checkinUnavailable»: «The weekly check-in opens on Fridays. Come back ov».
  checkinUnavailable: 'The weekly check-in opens on Fridays. Come back over the weekend to tell us how it went.',
  // Esta línea sirve para definir el texto «checkinPrivacyNote»: «Only the SanKen team sees your answers. We do not ».
  checkinPrivacyNote: 'Only the SanKen team sees your answers. We do not need medical data: tell us how training felt.',
  // Esta línea sirve para abrir el grupo de textos «moods».
  moods: {
    // Esta línea sirve para definir los textos agrupados «great» en una sola línea.
    great: { emoji: '😊', label: 'Very good' },
    // Esta línea sirve para definir los textos agrupados «good» en una sola línea.
    good: { emoji: '🙂', label: 'Good' },
    // Esta línea sirve para definir los textos agrupados «neutral» en una sola línea.
    neutral: { emoji: '😐', label: 'Okay' },
    // Esta línea sirve para definir los textos agrupados «not_good» en una sola línea.
    not_good: { emoji: '😕', label: 'Not great' },
    // Esta línea sirve para definir los textos agrupados «bad» en una sola línea.
    bad: { emoji: '😣', label: 'Bad' },
  },
  // Esta línea sirve para abrir el grupo de textos «topics».
  topics: {
    // Esta línea sirve para definir el texto «question»: «I have a question».
    question: 'I have a question',
    // Esta línea sirve para definir el texto «complaint»: «I have a complaint».
    complaint: 'I have a complaint',
    // Esta línea sirve para definir el texto «observation»: «I want to make an observation».
    observation: 'I want to make an observation',
    // Esta línea sirve para definir el texto «problem»: «I have a problem».
    problem: 'I have a problem',
    // Esta línea sirve para definir el texto «suggestion»: «I want to make a suggestion».
    suggestion: 'I want to make a suggestion',
    // Esta línea sirve para definir el texto «none»: «No, everything is fine».
    none: 'No, everything is fine',
  },

  // Esta línea sirve para abrir el grupo de textos «admin».
  admin: {
    // Esta línea sirve para definir el texto «title»: «Support».
    title: 'Support',
    // Esta línea sirve para definir el texto «subtitle»: «User requests and weekly check-ins.».
    subtitle: 'User requests and weekly check-ins.',
    // Esta línea sirve para definir el texto «search»: «Search subject, messages or #number».
    search: 'Search subject, messages or #number',
    // Esta línea sirve para definir el texto «searchUser»: «User (name or email)».
    searchUser: 'User (name or email)',
    // Esta línea sirve para definir el texto «allTypes»: «All types».
    allTypes: 'All types',
    // Esta línea sirve para definir el texto «allStatuses»: «All statuses».
    allStatuses: 'All statuses',
    // Esta línea sirve para definir el texto «awaiting»: «Awaiting reply».
    awaiting: 'Awaiting reply',
    // Esta línea sirve para definir el texto «from»: «From».
    from: 'From',
    // Esta línea sirve para definir el texto «to»: «To».
    to: 'To',
    // Esta línea sirve para definir los textos agrupados «columns» en una sola línea.
    columns: { id: 'ID', user: 'User', type: 'Type', subject: 'Subject', status: 'Status', priority: 'Priority', date: 'Last activity' },
    // Esta línea sirve para definir el texto «empty»: «No requests match these filters.».
    empty: 'No requests match these filters.',
    // Esta línea sirve para abrir el grupo de textos «stats».
    stats: {
      // Esta línea sirve para definir el texto «open»: «Open».
      open: 'Open',
      // Esta línea sirve para definir el texto «inReview»: «In review».
      inReview: 'In review',
      // Esta línea sirve para definir el texto «awaiting»: «Awaiting reply».
      awaiting: 'Awaiting reply',
      // Esta línea sirve para definir el texto «resolved»: «Resolved».
      resolved: 'Resolved',
      // Esta línea sirve para definir el texto «thisWeek»: «This week».
      thisWeek: 'This week',
      // Esta línea sirve para definir el texto «avgFirstResponse»: «First response (avg.)».
      avgFirstResponse: 'First response (avg.)',
      // Esta línea sirve para definir el texto «avgResolution»: «Resolution (avg.)».
      avgResolution: 'Resolution (avg.)',
      // Esta línea sirve para definir la función que genera el texto «hours»: «${h} h…».
      hours: (h) => `${h} h`,
      // Esta línea sirve para definir el texto «noData»: «No data».
      noData: 'No data',
      // Esta línea sirve para definir el texto «checkinsTitle»: «Weekly check-ins».
      checkinsTitle: 'Weekly check-ins',
      // Esta línea sirve para definir el texto «week»: «Week».
      week: 'Week',
      // Esta línea sirve para definir el texto «offered»: «Offered».
      offered: 'Offered',
      // Esta línea sirve para definir el texto «answered»: «Answered».
      answered: 'Answered',
      // Esta línea sirve para definir el texto «postponed»: «Postponed».
      postponed: 'Postponed',
      // Esta línea sirve para definir el texto «ignored»: «Ignored».
      ignored: 'Ignored',
      // Esta línea sirve para definir el texto «responseRate»: «Response rate».
      responseRate: 'Response rate',
      // Esta línea sirve para definir el texto «moods»: «How they felt (last 4 weeks)».
      moods: 'How they felt (last 4 weeks)',
      // Esta línea sirve para definir el texto «topics»: «What they wanted to tell (last 4 weeks)».
      topics: 'What they wanted to tell (last 4 weeks)',
      // Esta línea sirve para definir el texto «byType»: «Requests by type».
      byType: 'Requests by type',
    },
    // Esta línea sirve para definir el texto «assignee»: «Assignee».
    assignee: 'Assignee',
    // Esta línea sirve para definir el texto «unassigned»: «Unassigned».
    unassigned: 'Unassigned',
    // Esta línea sirve para definir el texto «priority»: «Priority».
    priority: 'Priority',
    // Esta línea sirve para definir el texto «status»: «Status».
    status: 'Status',
    // Esta línea sirve para definir el texto «context»: «Check-in context».
    context: 'Check-in context',
    // Esta línea sirve para definir el texto «replyAsStaff»: «Reply as SanKen Team».
    replyAsStaff: 'Reply as SanKen Team',
    // Esta línea sirve para definir el texto «save»: «Save».
    save: 'Save',
    // Esta línea sirve para definir el texto «user»: «User».
    user: 'User',
    // Esta línea sirve para abrir el grupo de textos «contextLabels».
    contextLabels: {
      // Esta línea sirve para definir el texto «week»: «Week».
      week: 'Week',
      // Esta línea sirve para definir el texto «mood»: «How they felt».
      mood: 'How they felt',
      // Esta línea sirve para definir el texto «topic»: «Topic».
      topic: 'Topic',
      // Esta línea sirve para definir el texto «routine_id»: «Active routine (ID)».
      routine_id: 'Active routine (ID)',
      // Esta línea sirve para definir el texto «sessions_completed_this_week»: «Sessions completed that week».
      sessions_completed_this_week: 'Sessions completed that week',
    },
  },
};

// Esta línea sirve para exportar los textos de soporte indexados por idioma.
export const SUPPORT_STRINGS: Record<LegalLocale, SupportStrings> = { es, en };
