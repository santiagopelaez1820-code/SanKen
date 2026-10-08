// Esta línea sirve para importar «beforeEach, describe, expect, it, vi» desde «vitest».
import { beforeEach, describe, expect, it, vi } from "vitest"
// Esta línea sirve para importar «ApiError, type Product» desde «@sanken/core».
import { ApiError, type Product } from "@sanken/core"
// Esta línea sirve para importar «api» desde «./api».
import { api } from "./api"
// Esta línea sirve para importar «useCartStore» desde «./cart-store».
import { useCartStore } from "./cart-store"

// Esta línea sirve para simular el módulo indicado en la prueba.
vi.mock("./api", () => ({
  // Esta línea sirve para simular los métodos del cliente de la API.
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn(), mediaUrl: vi.fn(() => null) },
}))

// Esta línea sirve para crear «mockedApi» llamando a «vi.mocked».
const mockedApi = vi.mocked(api)

// Esta línea sirve para declarar el dato de ejemplo «product» de tipo «Product».
const product: Product = {
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «1».
  id: 1,
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «"Creatina Monohidratada"».
  name: "Creatina Monohidratada",
  // Esta línea sirve para declarar la propiedad «slug» con el valor o tipo «"creatina-monohidratada"».
  slug: "creatina-monohidratada",
  // Esta línea sirve para declarar la propiedad «description» con el valor o tipo «"Descripción larga"».
  description: "Descripción larga",
  // Esta línea sirve para declarar la propiedad «short_description» con el valor o tipo «"Descripción corta"».
  short_description: "Descripción corta",
  // Esta línea sirve para declarar la propiedad «image» con el valor o tipo «null».
  image: null,
  // Esta línea sirve para declarar la propiedad «category» con el valor o tipo «"creatine"».
  category: "creatine",
  // Esta línea sirve para declarar la propiedad «price» con el valor o tipo «"79900.00"».
  price: "79900.00",
  // Esta línea sirve para declarar la propiedad «created_at» con el valor o tipo «"2026-01-01T00:00:00Z"».
  created_at: "2026-01-01T00:00:00Z",
}

// Esta línea sirve para declarar un segundo producto de ejemplo.
const productB: Product = { ...product, id: 2, name: "Whey Protein", price: "129900.00" }

// Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
beforeEach(() => {
  // Esta línea sirve para limpiar el historial de todos los espías.
  vi.clearAllMocks()
  // Esta línea sirve para fijar el estado inicial del store para la prueba.
  useCartStore.setState({ items: [], isSubmittingOrder: false, orderError: null })
  // Esta línea sirve para limpiar el almacenamiento local.
  localStorage.clear()
})

// Esta línea sirve para agrupar las pruebas de «addItem / incrementItem / decrementItem / removeItem».
describe("addItem / incrementItem / decrementItem / removeItem", () => {
  // Esta línea sirve para declarar la prueba que verifica que «adds a new product with the given quantity».
  it("adds a new product with the given quantity", () => {
    // Esta línea sirve para invocar la acción «addItem» del store de «Cart».
    useCartStore.getState().addItem(product, 2)

    // Esta línea sirve para verificar que «useCartStore.getState(» cumple «items».
    expect(useCartStore.getState().items).toEqual([{ product, quantity: 2 }])
  })

  // Esta línea sirve para declarar la prueba que verifica que «increases the quantity when the same product is added again».
  it("increases the quantity when the same product is added again", () => {
    // Esta línea sirve para invocar la acción «addItem» del store de «Cart».
    useCartStore.getState().addItem(product, 1)
    // Esta línea sirve para invocar la acción «addItem» del store de «Cart».
    useCartStore.getState().addItem(product, 1)

    // Esta línea sirve para verificar que «useCartStore.getState(» cumple «items».
    expect(useCartStore.getState().items).toEqual([{ product, quantity: 2 }])
  })

  // Esta línea sirve para declarar la prueba que verifica que «increments and decrements the quantity of an existing item».
  it("increments and decrements the quantity of an existing item", () => {
    // Esta línea sirve para invocar la acción «addItem» del store de «Cart».
    useCartStore.getState().addItem(product, 1)
    // Esta línea sirve para invocar la acción «incrementItem» del store de «Cart».
    useCartStore.getState().incrementItem(product.id)
    // Esta línea sirve para verificar que «useCartStore.getState(» cumple «items».
    expect(useCartStore.getState().items[0].quantity).toBe(2)

    // Esta línea sirve para invocar la acción «decrementItem» del store de «Cart».
    useCartStore.getState().decrementItem(product.id)
    // Esta línea sirve para verificar que «useCartStore.getState(» cumple «items».
    expect(useCartStore.getState().items[0].quantity).toBe(1)
  })

  // Esta línea sirve para declarar la prueba que verifica que «removes the item once its quantity reaches 0».
  it("removes the item once its quantity reaches 0", () => {
    // Esta línea sirve para invocar la acción «addItem» del store de «Cart».
    useCartStore.getState().addItem(product, 1)
    // Esta línea sirve para invocar la acción «decrementItem» del store de «Cart».
    useCartStore.getState().decrementItem(product.id)

    // Esta línea sirve para verificar que «useCartStore.getState(» cumple «items».
    expect(useCartStore.getState().items).toEqual([])
  })

  // Esta línea sirve para declarar la prueba que verifica que «removeItem takes the item out regardless of quantity».
  it("removeItem takes the item out regardless of quantity", () => {
    // Esta línea sirve para invocar la acción «addItem» del store de «Cart».
    useCartStore.getState().addItem(product, 5)
    // Esta línea sirve para invocar la acción «removeItem» del store de «Cart».
    useCartStore.getState().removeItem(product.id)

    // Esta línea sirve para verificar que «useCartStore.getState(» cumple «items».
    expect(useCartStore.getState().items).toEqual([])
  })
})

// Esta línea sirve para agrupar las pruebas de «getSubtotal / getItemCount».
describe("getSubtotal / getItemCount", () => {
  // Esta línea sirve para declarar la prueba que verifica que «computes the subtotal and item count across multiple products».
  it("computes the subtotal and item count across multiple products", () => {
    // Esta línea sirve para invocar la acción «addItem» del store de «Cart».
    useCartStore.getState().addItem(product, 2) // 79900 * 2
    // Esta línea sirve para invocar la acción «addItem» del store de «Cart».
    useCartStore.getState().addItem(productB, 1) // 129900 * 1

    // Esta línea sirve para verificar que «useCartStore.getState(» cumple «getSubtotal».
    expect(useCartStore.getState().getSubtotal()).toBe(289700)
    // Esta línea sirve para verificar que «useCartStore.getState(» cumple «getItemCount».
    expect(useCartStore.getState().getItemCount()).toBe(3)
  })
})

// Esta línea sirve para agrupar las pruebas de «submitOrder».
describe("submitOrder", () => {
  // Esta línea sirve para declarar la prueba que verifica que «sends product_id/quantity only (never price) and clears the cart on su».
  it("sends product_id/quantity only (never price) and clears the cart on success", async () => {
    // Esta línea sirve para invocar la acción «addItem» del store de «Cart».
    useCartStore.getState().addItem(product, 2)
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce({ id: 10, status: "pending" } as never)

    // Esta línea sirve para ejecutar la acción y guardar el resultado en «order».
    const order = await useCartStore.getState().submitOrder({
      // Esta línea sirve para declarar la propiedad «customer_name» con el valor o tipo «"Juan"».
      customer_name: "Juan",
      // Esta línea sirve para declarar la propiedad «customer_email» con el valor o tipo «"juan@example.com"».
      customer_email: "juan@example.com",
      // Esta línea sirve para declarar la propiedad «customer_phone» con el valor o tipo «"3000000000"».
      customer_phone: "3000000000",
      // Esta línea sirve para declarar la propiedad «customer_whatsapp» con el valor o tipo «"3000000000"».
      customer_whatsapp: "3000000000",
      // Esta línea sirve para declarar la propiedad «department» con el valor o tipo «"Antioquia"».
      department: "Antioquia",
      // Esta línea sirve para declarar la propiedad «city» con el valor o tipo «"Medellín"».
      city: "Medellín",
      // Esta línea sirve para declarar la propiedad «address» con el valor o tipo «"Calle 1"».
      address: "Calle 1",
    })

    // Esta línea sirve para verificar que «mockedApi.post» cumple «toHaveBeenCalledWith».
    expect(mockedApi.post).toHaveBeenCalledWith("/orders", {
      // Esta línea sirve para declarar la propiedad «customer_name» con el valor o tipo «"Juan"».
      customer_name: "Juan",
      // Esta línea sirve para declarar la propiedad «customer_email» con el valor o tipo «"juan@example.com"».
      customer_email: "juan@example.com",
      // Esta línea sirve para declarar la propiedad «customer_phone» con el valor o tipo «"3000000000"».
      customer_phone: "3000000000",
      // Esta línea sirve para declarar la propiedad «customer_whatsapp» con el valor o tipo «"3000000000"».
      customer_whatsapp: "3000000000",
      // Esta línea sirve para declarar la propiedad «department» con el valor o tipo «"Antioquia"».
      department: "Antioquia",
      // Esta línea sirve para declarar la propiedad «city» con el valor o tipo «"Medellín"».
      city: "Medellín",
      // Esta línea sirve para declarar la propiedad «address» con el valor o tipo «"Calle 1"».
      address: "Calle 1",
      // Esta línea sirve para declarar la propiedad «items» con el valor o tipo «[{ product_id: product.id, quantity: 2 }]».
      items: [{ product_id: product.id, quantity: 2 }],
    })
    // Esta línea sirve para verificar que «order» cumple «toEqual».
    expect(order).toEqual({ id: 10, status: "pending" })
    // Esta línea sirve para verificar que «useCartStore.getState(» cumple «items».
    expect(useCartStore.getState().items).toEqual([])
  })

  // Esta línea sirve para declarar la prueba que verifica que «keeps the cart and sets orderError on failure».
  it("keeps the cart and sets orderError on failure", async () => {
    // Esta línea sirve para invocar la acción «addItem» del store de «Cart».
    useCartStore.getState().addItem(product, 1)
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockRejectedValueOnce(new ApiError(422, { message: "Producto no disponible" }))

    // Esta línea sirve para ejecutar la acción y guardar el resultado en «order».
    const order = await useCartStore.getState().submitOrder({
      // Esta línea sirve para declarar la propiedad «customer_name» con el valor o tipo «"Juan"».
      customer_name: "Juan",
      // Esta línea sirve para declarar la propiedad «customer_email» con el valor o tipo «"juan@example.com"».
      customer_email: "juan@example.com",
      // Esta línea sirve para declarar la propiedad «customer_phone» con el valor o tipo «"3000000000"».
      customer_phone: "3000000000",
      // Esta línea sirve para declarar la propiedad «customer_whatsapp» con el valor o tipo «"3000000000"».
      customer_whatsapp: "3000000000",
      // Esta línea sirve para declarar la propiedad «department» con el valor o tipo «"Antioquia"».
      department: "Antioquia",
      // Esta línea sirve para declarar la propiedad «city» con el valor o tipo «"Medellín"».
      city: "Medellín",
      // Esta línea sirve para declarar la propiedad «address» con el valor o tipo «"Calle 1"».
      address: "Calle 1",
    })

    // Esta línea sirve para verificar que «order» cumple «toBeNull».
    expect(order).toBeNull()
    // Esta línea sirve para verificar que «useCartStore.getState(» cumple «orderError».
    expect(useCartStore.getState().orderError).toBe("Producto no disponible")
    // Esta línea sirve para verificar que «useCartStore.getState(» cumple «items».
    expect(useCartStore.getState().items).toHaveLength(1)
  })
})
