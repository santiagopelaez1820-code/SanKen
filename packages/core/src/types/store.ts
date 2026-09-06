export type ProductCategory = 'protein' | 'creatine' | 'pre_workout' | 'amino_acids' | 'vitamins' | 'other';

/** GET /products, GET /products/{id} — catálogo público (solo productos activos). */
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  image: string | null;
  category: ProductCategory;
  price: string;
  created_at: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirming'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'problem'
  | 'cancelled';

export interface OrderItem {
  id: number;
  product_id: number | null;
  product_name: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

/**
 * GET /orders, GET /orders/{id}, POST /orders (respuesta) — vista del
 * propio cliente. Nunca trae `admin_notes` (eso es exclusivo de
 * AdminOrder, ver types/admin.ts) ni el link de WhatsApp hacia el
 * cliente (ese es para que el superadmin lo use, no al revés).
 */
export interface Order {
  id: number;
  user_id: number;
  status: OrderStatus;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_whatsapp: string;
  department: string;
  city: string;
  address: string;
  additional_info: string | null;
  subtotal: string;
  shipping_cost: string | null;
  total: string;
  tracking_number: string | null;
  carrier: string | null;
  /** Mensaje que el superadmin dejó para este pedido (ej. detalle de un problema) — visible para el cliente. */
  customer_message: string | null;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
  /** Link wa.me hacia la línea de atención de SanKen, ya con el pedido en el mensaje — null si no hay número configurado. */
  support_whatsapp_url: string | null;
}

/**
 * Payload de POST /orders. Solo product_id + quantity por item a propósito
 * — el precio siempre se recalcula en el backend (ver CreateOrderAction),
 * nunca se acepta el que mande el cliente.
 */
export interface CreateOrderPayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_whatsapp: string;
  department: string;
  city: string;
  address: string;
  additional_info?: string | null;
  items: { product_id: number; quantity: number }[];
}
