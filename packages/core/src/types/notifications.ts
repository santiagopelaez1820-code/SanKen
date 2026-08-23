/** data shape específico de NewChatMessageNotification (App\Notifications\NewChatMessageNotification::toArray). */
export interface NewChatMessageNotificationData {
  conversation_id: number;
  sender_name: string;
  body: string;
}

/**
 * Payload del evento nativo de broadcasting de notificaciones de Laravel
 * (BroadcastNotificationCreated), en el canal privado `App.Models.User.{id}`
 * — a diferencia de MessageSent/ChallengeProgressUpdated, este no tiene un
 * broadcastAs() custom, así que el cliente lo escucha con
 * `channel.notification(callback)`, no `.listen()`.
 */
export interface NotificationBroadcast {
  id: string;
  type: string;
  conversation_id?: number;
  sender_name?: string;
  body?: string;
}
