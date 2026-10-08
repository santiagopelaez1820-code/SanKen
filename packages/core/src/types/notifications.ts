/** data shape específico de NewChatMessageNotification (App\Notifications\NewChatMessageNotification::toArray). */
// Esta línea sirve para declarar la interfaz «NewChatMessageNotificationData».
export interface NewChatMessageNotificationData {
  // Esta línea sirve para declarar el campo «conversation_id» de tipo «number».
  conversation_id: number;
  // Esta línea sirve para declarar el campo «sender_name» de tipo «string».
  sender_name: string;
  // Esta línea sirve para declarar el campo «body» de tipo «string».
  body: string;
}
