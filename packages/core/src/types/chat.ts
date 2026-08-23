export interface ChatMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  sender_name: string;
  body: string;
  is_mine: boolean;
  created_at: string;
}

/** GET /trainer-clients/{id}/conversation — get-or-create + lote inicial de mensajes. */
export interface ConversationWithMessages {
  conversation_id: number;
  messages: ChatMessage[];
}

/** GET /conversations — una fila del inbox. */
export interface ConversationSummary {
  id: number;
  trainer_client_id: number;
  other_party: { id: number; name: string };
  last_message: { body: string; sender_id: number; created_at: string } | null;
  unread_count: number;
}

/**
 * Payload del evento `message.sent` transmitido por Reverb en el canal
 * privado `conversations.{id}` — sin `is_mine`, que depende del viewer y
 * solo lo calcula el REST endpoint (ChatMessageResource), no el broadcast.
 */
export type MessageSentBroadcast = Omit<ChatMessage, 'is_mine'>;
