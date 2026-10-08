// Esta línea sirve para declarar el tipo «ProductCategory».
export type ProductCategory = 'protein' | 'creatine' | 'pre_workout' | 'amino_acids' | 'vitamins' | 'other';

/** GET /products, GET /products/{id} — catálogo público (solo productos activos). */
// Esta línea sirve para declarar la interfaz «Product».
export interface Product {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «name» de tipo «string».
  name: string;
  // Esta línea sirve para declarar el campo «slug» de tipo «string».
  slug: string;
  // Esta línea sirve para declarar el campo «description» de tipo «string».
  description: string;
  // Esta línea sirve para declarar el campo «short_description» de tipo «string».
  short_description: string;
  // Esta línea sirve para declarar el campo «image» de tipo «string | null».
  image: string | null;
  // Esta línea sirve para declarar el campo «category» de tipo «ProductCategory».
  category: ProductCategory;
  // Esta línea sirve para declarar el campo «price» de tipo «string».
  price: string;
  // Esta línea sirve para declarar el campo «created_at» de tipo «string».
  created_at: string;
}

// Esta línea sirve para declarar el tipo «OrderStatus» (definición en las líneas siguientes).
export type OrderStatus =
  // Esta línea sirve para incluir la variante «'pending'».
  | 'pending'
  // Esta línea sirve para incluir la variante «'confirming'».
  | 'confirming'
  // Esta línea sirve para incluir la variante «'processing'».
  | 'processing'
  // Esta línea sirve para incluir la variante «'shipped'».
  | 'shipped'
  // Esta línea sirve para incluir la variante «'delivered'».
  | 'delivered'
  // Esta línea sirve para incluir la variante «'problem'».
  | 'problem'
  // Esta línea sirve para incluir la variante «'cancelled';».
  | 'cancelled';

// Esta línea sirve para declarar la interfaz «OrderItem».
export interface OrderItem {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «product_id» de tipo «number | null».
  product_id: number | null;
  // Esta línea sirve para declarar el campo «product_name» de tipo «string».
  product_name: string;
  // Esta línea sirve para declarar el campo «quantity» de tipo «number».
  quantity: number;
  // Esta línea sirve para declarar el campo «unit_price» de tipo «string».
  unit_price: string;
  // Esta línea sirve para declarar el campo «subtotal» de tipo «string».
  subtotal: string;
}

/**
 * GET /orders, GET /orders/{id}, POST /orders (respuesta) — vista del
 * propio cliente. Nunca trae `admin_notes` (eso es exclusivo de
 * AdminOrder, ver types/admin.ts) ni el link de WhatsApp hacia el
 * cliente (ese es para que el superadmin lo use, no al revés).
 */
// Esta línea sirve para declarar la interfaz «Order».
export interface Order {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «user_id» de tipo «number».
  user_id: number;
  // Esta línea sirve para declarar el campo «status» de tipo «OrderStatus».
  status: OrderStatus;
  // Esta línea sirve para declarar el campo «customer_name» de tipo «string».
  customer_name: string;
  // Esta línea sirve para declarar el campo «customer_email» de tipo «string».
  customer_email: string;
  // Esta línea sirve para declarar el campo «customer_phone» de tipo «string».
  customer_phone: string;
  // Esta línea sirve para declarar el campo «customer_whatsapp» de tipo «string».
  customer_whatsapp: string;
  // Esta línea sirve para declarar el campo «department» de tipo «string».
  department: string;
  // Esta línea sirve para declarar el campo «city» de tipo «string».
  city: string;
  // Esta línea sirve para declarar el campo «address» de tipo «string».
  address: string;
  // Esta línea sirve para declarar el campo «additional_info» de tipo «string | null».
  additional_info: string | null;
  // Esta línea sirve para declarar el campo «subtotal» de tipo «string».
  subtotal: string;
  // Esta línea sirve para declarar el campo «shipping_cost» de tipo «string | null».
  shipping_cost: string | null;
  // Esta línea sirve para declarar el campo «total» de tipo «string».
  total: string;
  // Esta línea sirve para declarar el campo «tracking_number» de tipo «string | null».
  tracking_number: string | null;
  // Esta línea sirve para declarar el campo «carrier» de tipo «string | null».
  carrier: string | null;
  /** Mensaje que el superadmin dejó para este pedido (ej. detalle de un problema) — visible para el cliente. */
  // Esta línea sirve para declarar el campo «customer_message» de tipo «string | null».
  customer_message: string | null;
  // Esta línea sirve para declarar el campo «items» de tipo «OrderItem[]».
  items: OrderItem[];
  // Esta línea sirve para declarar el campo «created_at» de tipo «string».
  created_at: string;
  // Esta línea sirve para declarar el campo «updated_at» de tipo «string».
  updated_at: string;
  /** Link wa.me hacia la línea de atención de SanKen, ya con el pedido en el mensaje — null si no hay número configurado. */
  // Esta línea sirve para declarar el campo «support_whatsapp_url» de tipo «string | null».
  support_whatsapp_url: string | null;
}

/**
 * Payload de POST /orders. Solo product_id + quantity por item a propósito
 * — el precio siempre se recalcula en el backend (ver CreateOrderAction),
 * nunca se acepta el que mande el cliente.
 */
// Esta línea sirve para declarar la interfaz «CreateOrderPayload».
export interface CreateOrderPayload {
  // Esta línea sirve para declarar el campo «customer_name» de tipo «string».
  customer_name: string;
  // Esta línea sirve para declarar el campo «customer_email» de tipo «string».
  customer_email: string;
  // Esta línea sirve para declarar el campo «customer_phone» de tipo «string».
  customer_phone: string;
  // Esta línea sirve para declarar el campo «customer_whatsapp» de tipo «string».
  customer_whatsapp: string;
  // Esta línea sirve para declarar el campo «department» de tipo «string».
  department: string;
  // Esta línea sirve para declarar el campo «city» de tipo «string».
  city: string;
  // Esta línea sirve para declarar el campo «address» de tipo «string».
  address: string;
  // Esta línea sirve para declarar el campo opcional «additional_info» de tipo «string | null».
  additional_info?: string | null;
  // Esta línea sirve para declarar el campo «items» con el id y la cantidad de cada producto.
  items: { product_id: number; quantity: number }[];
}
