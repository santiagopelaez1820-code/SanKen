// Esta línea sirve para importar «afterEach, describe, expect, it» desde «vitest».
import { afterEach, describe, expect, it } from "vitest"
// Esta línea sirve para importar «readCookie» desde «./cookies».
import { readCookie } from "./cookies"

// Esta línea sirve para agrupar las pruebas de «readCookie».
describe("readCookie", () => {
  // Esta línea sirve para declarar lo que se ejecuta después de cada prueba.
  afterEach(() => {
    // Esta línea sirve para recorrer cada cookie del documento.
    document.cookie.split(";").forEach((c) => {
      // Esta línea sirve para crear «name» llamando a «c.split».
      const name = c.split("=")[0]?.trim()
      // Esta línea sirve para borrar la cookie fijando una fecha de expiración pasada.
      if (name) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
    })
  })

  // Esta línea sirve para declarar la prueba que verifica que «extracts the value of a named cookie».
  it("extracts the value of a named cookie", () => {
    // Esta línea sirve para asignar «"XSRF-TOKEN=abc123"» a «document.cookie».
    document.cookie = "XSRF-TOKEN=abc123"
    // Esta línea sirve para verificar que «readCookie("XSRF-TOKEN")» cumple «toBe».
    expect(readCookie("XSRF-TOKEN")).toBe("abc123")
  })

  // Esta línea sirve para declarar la prueba que verifica que «returns null when the cookie is absent».
  it("returns null when the cookie is absent", () => {
    // Esta línea sirve para verificar que «readCookie("MISSING-COOKIE")» cumple «toBeNull».
    expect(readCookie("MISSING-COOKIE")).toBeNull()
  })

  // Esta línea sirve para declarar la prueba que verifica que «url-decodes the cookie value».
  it("url-decodes the cookie value", () => {
    // Esta línea sirve para asignar «"XSRF-TOKEN=abc%2F123"» a «document.cookie».
    document.cookie = "XSRF-TOKEN=abc%2F123"
    // Esta línea sirve para verificar que «readCookie("XSRF-TOKEN")» cumple «toBe».
    expect(readCookie("XSRF-TOKEN")).toBe("abc/123")
  })
})
