// Esta línea sirve para importar «create» desde «zustand».
import { create } from "zustand"
// Esta línea sirve para importar «persist» desde «zustand/middleware».
import { persist } from "zustand/middleware"
// Esta línea sirve para importar «ApiError, type CreateOrderPayload, type Order, type Product» desde «@sanken/core».
import { ApiError, type CreateOrderPayload, type Order, type Product } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"

// Esta línea sirve para declarar la interfaz «CartItem».
export interface CartItem {
  // Esta línea sirve para declarar la propiedad «product» con el valor o tipo «Product».
  product: Product
  // Esta línea sirve para declarar la propiedad «quantity» con el valor o tipo «number».
  quantity: number
}

// Esta línea sirve para declarar la interfaz «CartState».
interface CartState {
  // Esta línea sirve para declarar la propiedad «items» con el valor o tipo «CartItem[]».
  items: CartItem[]
  // Esta línea sirve para declarar la propiedad «addItem» con el valor o tipo «(product: Product, quantity?: number) => void».
  addItem: (product: Product, quantity?: number) => void
  // Esta línea sirve para declarar la propiedad «incrementItem» con el valor o tipo «(productId: number) => void».
  incrementItem: (productId: number) => void
  // Esta línea sirve para declarar la propiedad «decrementItem» con el valor o tipo «(productId: number) => void».
  decrementItem: (productId: number) => void
  // Esta línea sirve para declarar la propiedad «removeItem» con el valor o tipo «(productId: number) => void».
  removeItem: (productId: number) => void
  // Esta línea sirve para declarar la propiedad «clear» con el valor o tipo «() => void».
  clear: () => void
  // Esta línea sirve para declarar la propiedad «getSubtotal» con el valor o tipo «() => number».
  getSubtotal: () => number
  // Esta línea sirve para declarar la propiedad «getItemCount» con el valor o tipo «() => number».
  getItemCount: () => number

  // Esta línea sirve para declarar la propiedad «isSubmittingOrder» con el valor o tipo «boolean».
  isSubmittingOrder: boolean
  // Esta línea sirve para declarar la propiedad «orderError» con el valor o tipo «string | null».
  orderError: string | null
  // Esta línea sirve para declarar la acción que envía el pedido y devuelve el pedido o null.
  submitOrder: (payload: Omit<CreateOrderPayload, "items">) => Promise<Order | null>
}

/**
 * A diferencia de mobile (que evita `persist` a propósito), acá sí se usa —
 * es el mismo patrón que ya tiene `auth-store.ts` en esta app (localStorage
 * vía zustand/middleware). Solo se persisten `items`: el precio siempre se
 * relee del backend al armar el pedido (`submitOrder`), nunca se confía en
 * el guardado localmente.
 */
// Esta línea sirve para crear el store del carrito con persistencia.
export const useCartStore = create<CartState>()(
  // Esta línea sirve para envolver el store con la persistencia.
  persist(
    // Esta línea sirve para declarar el estado inicial y las acciones.
    (set, get) => ({
      // Esta línea sirve para declarar la propiedad «items» con el valor o tipo «[]».
      items: [],

      // Esta línea sirve para declarar la propiedad «addItem» con el valor o tipo «(product, quantity = 1) => {».
      addItem: (product, quantity = 1) => {
        // Esta línea sirve para declarar «items» con el valor «get().items».
        const items = get().items
        // Esta línea sirve para declarar «existing» con el valor «items.find((i) => i.product.id === product.id)».
        const existing = items.find((i) => i.product.id === product.id)
        // Esta línea sirve para declarar «next» con el valor «existing».
        const next = existing
          // Esta línea sirve para sumar la cantidad si el producto ya está en el carrito.
          ? items.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i))
          // Esta línea sirve para agregar el producto nuevo si no estaba.
          : [...items, { product, quantity }]
        // Esta línea sirve para llamar a «set» con «{ items: next }».
        set({ items: next })
      },

      // Esta línea sirve para declarar la propiedad «incrementItem» con el valor o tipo «(productId) => {».
      incrementItem: (productId) => {
        // Esta línea sirve para reemplazar los ítems.
        set({
          // Esta línea sirve para sumar uno a la cantidad del producto indicado.
          items: get().items.map((i) => (i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i)),
        })
      },

      // Esta línea sirve para declarar la propiedad «decrementItem» con el valor o tipo «(productId) => {».
      decrementItem: (productId) => {
        // Esta línea sirve para reemplazar los ítems.
        set({
          // Esta línea sirve para declarar la propiedad «items» con el valor o tipo «get()».
          items: get()
            // Esta línea sirve para restar uno a la cantidad del producto indicado.
            .items.map((i) => (i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i))
            // Esta línea sirve para quitar los ítems que quedaron en cero.
            .filter((i) => i.quantity > 0),
        })
      },

      // Esta línea sirve para declarar la propiedad «removeItem» con el valor o tipo «(productId) => {».
      removeItem: (productId) => {
        // Esta línea sirve para quitar el producto indicado del carrito.
        set({ items: get().items.filter((i) => i.product.id !== productId) })
      },

      // Esta línea sirve para declarar la propiedad «clear» con el valor o tipo «() => set({ items: [] })».
      clear: () => set({ items: [] }),

      // Esta línea sirve para declarar el cálculo del subtotal del carrito.
      getSubtotal: () => get().items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0),
      // Esta línea sirve para declarar el cálculo de la cantidad total de ítems.
      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      // Esta línea sirve para declarar la propiedad «isSubmittingOrder» con el valor o tipo «false».
      isSubmittingOrder: false,
      // Esta línea sirve para declarar la propiedad «orderError» con el valor o tipo «null».
      orderError: null,
      // Esta línea sirve para declarar la propiedad «submitOrder» con el valor o tipo «async (payload) => {».
      submitOrder: async (payload) => {
        // Esta línea sirve para marcar que se está enviando el pedido y limpiar el error.
        set({ isSubmittingOrder: true, orderError: null })
        // Esta línea sirve para intentar ejecutar el bloque siguiente.
        try {
          // Esta línea sirve para armar la lista de ítems solo con id y cantidad (nunca el precio).
          const items = get().items.map((i) => ({ product_id: i.product.id, quantity: i.quantity }))
          // Esta línea sirve para esperar «api.post<Order>("/orders", { ...payload, items })» y guardar el resultado en «order».
          const order = await api.post<Order>("/orders", { ...payload, items })
          // Esta línea sirve para llamar a «set» con «{ isSubmittingOrder: false, items: [] }».
          set({ isSubmittingOrder: false, items: [] })
          // Esta línea sirve para devolver «order».
          return order
        // Esta línea sirve para capturar cualquier error del bloque anterior.
        } catch (err) {
          // Esta línea sirve para guardar el estado de error.
          set({
            // Esta línea sirve para declarar la propiedad «isSubmittingOrder» con el valor o tipo «false».
            isSubmittingOrder: false,
            // Esta línea sirve para guardar el mensaje de error de la API o uno genérico.
            orderError: err instanceof ApiError ? err.body.message : "No se pudo realizar el pedido.",
          })
          // Esta línea sirve para devolver null.
          return null
        }
      },
    }),
    {
      // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «"sanken-cart"».
      name: "sanken-cart",
      // Esta línea sirve para declarar la propiedad «partialize» con el valor o tipo «(state) => ({ items: state.items })».
      partialize: (state) => ({ items: state.items }),
    }
  )
)
