import { create } from "zustand"
import { persist } from "zustand/middleware"
import { ApiError, type CreateOrderPayload, type Order, type Product } from "@sanken/core"
import { api } from "@/lib/api"

export interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  incrementItem: (productId: number) => void
  decrementItem: (productId: number) => void
  removeItem: (productId: number) => void
  clear: () => void
  getSubtotal: () => number
  getItemCount: () => number

  isSubmittingOrder: boolean
  orderError: string | null
  submitOrder: (payload: Omit<CreateOrderPayload, "items">) => Promise<Order | null>
}

/**
 * A diferencia de mobile (que evita `persist` a propósito), acá sí se usa —
 * es el mismo patrón que ya tiene `auth-store.ts` en esta app (localStorage
 * vía zustand/middleware). Solo se persisten `items`: el precio siempre se
 * relee del backend al armar el pedido (`submitOrder`), nunca se confía en
 * el guardado localmente.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const items = get().items
        const existing = items.find((i) => i.product.id === product.id)
        const next = existing
          ? items.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i))
          : [...items, { product, quantity }]
        set({ items: next })
      },

      incrementItem: (productId) => {
        set({
          items: get().items.map((i) => (i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i)),
        })
      },

      decrementItem: (productId) => {
        set({
          items: get()
            .items.map((i) => (i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i))
            .filter((i) => i.quantity > 0),
        })
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.product.id !== productId) })
      },

      clear: () => set({ items: [] }),

      getSubtotal: () => get().items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0),
      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      isSubmittingOrder: false,
      orderError: null,
      submitOrder: async (payload) => {
        set({ isSubmittingOrder: true, orderError: null })
        try {
          const items = get().items.map((i) => ({ product_id: i.product.id, quantity: i.quantity }))
          const order = await api.post<Order>("/orders", { ...payload, items })
          set({ isSubmittingOrder: false, items: [] })
          return order
        } catch (err) {
          set({
            isSubmittingOrder: false,
            orderError: err instanceof ApiError ? err.body.message : "No se pudo realizar el pedido.",
          })
          return null
        }
      },
    }),
    {
      name: "sanken-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
)
