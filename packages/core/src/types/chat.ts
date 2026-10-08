// Esta línea sirve para declarar la interfaz «ChatMessage».
export interface ChatMessage {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «conversation_id» de tipo «number».
  conversation_id: number;
  // Esta línea sirve para declarar el campo «sender_id» de tipo «number».
  sender_id: number;
  // Esta línea sirve para declarar el campo «sender_name» de tipo «string».
  sender_name: string;
  // Esta línea sirve para declarar el campo «body» de tipo «string».
  body: string;
  // Esta línea sirve para declarar el campo «is_mine» de tipo «boolean».
  is_mine: boolean;
  // Esta línea sirve para declarar el campo «created_at» de tipo «string».
  created_at: string;
}

/** GET /trainer-clients/{id}/conversation — get-or-create + lote inicial de mensajes. */
// Esta línea sirve para declarar la interfaz «ConversationWithMessages».
export interface ConversationWithMessages {
  // Esta línea sirve para declarar el campo «conversation_id» de tipo «number».
  conversation_id: number;
  // Esta línea sirve para declarar el campo «messages» de tipo «ChatMessage[]».
  messages: ChatMessage[];
}

/** GET /conversations — una fila del inbox. */
// Esta línea sirve para declarar la interfaz «ConversationSummary».
export interface ConversationSummary {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «trainer_client_id» de tipo «number».
  trainer_client_id: number;
  // Esta línea sirve para declarar el campo «other_party» de tipo «{ id: number; name: string }».
  other_party: { id: number; name: string };
  // Esta línea sirve para declarar el campo «last_message» con el último mensaje o null.
  last_message: { body: string; sender_id: number; created_at: string } | null;
  // Esta línea sirve para declarar el campo «unread_count» de tipo «number».
  unread_count: number;
}

/**
 * Payload del evento `message.sent` transmitido por Reverb en el canal
 * privado `conversations.{id}` — sin `is_mine`, que depende del viewer y
 * solo lo calcula el REST endpoint (ChatMessageResource), no el broadcast.
 */
// Esta línea sirve para declarar el tipo «MessageSentBroadcast» como «Omit<ChatMessage, 'is_mine'>».
export type MessageSentBroadcast = Omit<ChatMessage, 'is_mine'>;
