export type FeedItemType = 'news' | 'notification';

/**
 * Ítem del feed unificado (GET /feed) -- combina Novedades (NewsPromotion)
 * y Notificaciones (tabla nativa de Laravel) en una sola lista cronológica.
 * `title`/`body`/`image_url` solo vienen poblados cuando feed_type='news';
 * `kind`/`data` solo cuando feed_type='notification' (mismo shape que
 * antes tenía AppNotification.type/data).
 */
export interface FeedItem {
  feed_type: FeedItemType;
  id: string;
  title: string | null;
  body: string | null;
  image_url: string | null;
  kind: string | null;
  data: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
}

export interface FeedResponse {
  data: FeedItem[];
  meta: {
    unread_count: number;
  };
}
