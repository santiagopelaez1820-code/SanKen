// Esta línea sirve para declarar el tipo «FeedItemType» como «'news' | 'notification'».
export type FeedItemType = 'news' | 'notification';

/**
 * Ítem del feed unificado (GET /feed) -- combina Novedades (NewsPromotion)
 * y Notificaciones (tabla nativa de Laravel) en una sola lista cronológica.
 * `title`/`body`/`image_url` solo vienen poblados cuando feed_type='news';
 * `kind`/`data` solo cuando feed_type='notification' (mismo shape que
 * antes tenía AppNotification.type/data).
 */
// Esta línea sirve para declarar la interfaz «FeedItem».
export interface FeedItem {
  // Esta línea sirve para declarar el campo «feed_type» de tipo «FeedItemType».
  feed_type: FeedItemType;
  // Esta línea sirve para declarar el campo «id» de tipo «string».
  id: string;
  // Esta línea sirve para declarar el campo «title» de tipo «string | null».
  title: string | null;
  // Esta línea sirve para declarar el campo «body» de tipo «string | null».
  body: string | null;
  // Esta línea sirve para declarar el campo «image_url» de tipo «string | null».
  image_url: string | null;
  // Esta línea sirve para declarar el campo «kind» de tipo «string | null».
  kind: string | null;
  // Esta línea sirve para declarar el campo «data» de tipo «Record<string, unknown> | null».
  data: Record<string, unknown> | null;
  // Esta línea sirve para declarar el campo «read_at» de tipo «string | null».
  read_at: string | null;
  // Esta línea sirve para declarar el campo «created_at» de tipo «string».
  created_at: string;
}

// Esta línea sirve para declarar la interfaz «FeedResponse».
export interface FeedResponse {
  // Esta línea sirve para declarar el campo «data» de tipo «FeedItem[]».
  data: FeedItem[];
  // Esta línea sirve para declarar el campo «meta» de tipo «{».
  meta: {
    // Esta línea sirve para declarar el campo «unread_count» de tipo «number».
    unread_count: number;
  };
}
