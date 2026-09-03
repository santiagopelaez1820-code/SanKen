/** data shape específico de NewChatMessageNotification (App\Notifications\NewChatMessageNotification::toArray). */
export interface NewChatMessageNotificationData {
  conversation_id: number;
  sender_name: string;
  body: string;
}
