// Esta línea sirve para importar «afterEach, describe, expect, it, vi» desde «vitest».
import { afterEach, describe, expect, it, vi } from "vitest"
// Esta línea sirve para importar «ApiClient, ApiError» desde «@sanken/core».
import { ApiClient, ApiError } from "@sanken/core"

// Esta línea sirve para declarar la función que simula la respuesta de fetch.
function mockFetch(status: number, body: unknown) {
  // Esta línea sirve para reemplazar una variable global por una simulada.
  vi.stubGlobal(
    // Esta línea sirve para incluir el texto o las clases «fetch…».
    "fetch",
    // Esta línea sirve para devolver una respuesta simulada con estado, cuerpo JSON y cabecera.
    vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }))
  )
}

// Esta línea sirve para agrupar las pruebas de «ApiClient consent_required».
describe("ApiClient consent_required", () => {
  // Esta línea sirve para declarar lo que se ejecuta después de cada prueba.
  afterEach(() => vi.unstubAllGlobals())

  // Esta línea sirve para declarar la prueba que verifica que «notifies the pending consents when the backend blocks the request».
  it("notifies the pending consents when the backend blocks the request", async () => {
    // Esta línea sirve para simular una respuesta 403 de consentimiento requerido.
    mockFetch(403, {
      // Esta línea sirve para declarar la propiedad «message» con el valor o tipo «"Debes aceptar…"».
      message: "Debes aceptar…",
      // Esta línea sirve para declarar la propiedad «code» con el valor o tipo «"consent_required"».
      code: "consent_required",
      // Esta línea sirve para definir los consentimientos pendientes de la respuesta.
      pending: [{ type: "terms", document: "terms", version: "2.0", accepted_version: "1.0" }],
    })
    // Esta línea sirve para crear la función espía «onConsentRequired».
    const onConsentRequired = vi.fn()
    // Esta línea sirve para crear «client» llamando a «ApiClient».
    const client = new ApiClient({ baseUrl: "http://api.test", onConsentRequired })

    // Esta línea sirve para verificar que «client.get("/stats/dashboard")» falla como se espera.
    await expect(client.get("/stats/dashboard")).rejects.toBeInstanceOf(ApiError)
    // Esta línea sirve para verificar que «onConsentRequired» cumple «toHaveBeenCalledWith».
    expect(onConsentRequired).toHaveBeenCalledWith(["terms"])
  })

  // Esta línea sirve para declarar la prueba que verifica que «ignores other 403 responses».
  it("ignores other 403 responses", async () => {
    // Esta línea sirve para llamar a «mockFetch» con «403, { message: "No tienes permiso." }».
    mockFetch(403, { message: "No tienes permiso." })
    // Esta línea sirve para crear la función espía «onConsentRequired».
    const onConsentRequired = vi.fn()
    // Esta línea sirve para crear «client» llamando a «ApiClient».
    const client = new ApiClient({ baseUrl: "http://api.test", onConsentRequired })

    // Esta línea sirve para verificar que «client.get("/admin/users")» falla como se espera.
    await expect(client.get("/admin/users")).rejects.toBeInstanceOf(ApiError)
    // Esta línea sirve para verificar que «onConsentRequired» no cumple «toHaveBeenCalled».
    expect(onConsentRequired).not.toHaveBeenCalled()
  })
})
