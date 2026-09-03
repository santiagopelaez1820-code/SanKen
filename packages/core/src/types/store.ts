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
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: number;
  product_id: number | null;
  product_name: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

/** GET /admin/orders, GET /admin/orders/{id}, POST /orders (respuesta). */
export interface Order {
  id: number;
  user_id: number;
  status: OrderStatus;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  department: string;
  city: string;
  address: string;
  additional_info: string | null;
  subtotal: string;
  shipping_cost: string | null;
  total: string;
  items: OrderItem[];
  created_at: string;
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
  department: string;
  city: string;
  address: string;
  additional_info?: string | null;
  items: { product_id: number; quantity: number }[];
}
