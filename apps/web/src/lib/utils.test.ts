// Esta línea sirve para importar «describe, expect, it» desde «vitest».
import { describe, expect, it } from "vitest"
// Esta línea sirve para importar «cn» desde «./utils».
import { cn } from "./utils"

// Esta línea sirve para agrupar las pruebas de «cn».
describe("cn", () => {
  // Esta línea sirve para declarar la prueba que verifica que «combines multiple class names».
  it("combines multiple class names", () => {
    // Esta línea sirve para verificar que «cn("a", "b")» cumple «toBe».
    expect(cn("a", "b")).toBe("a b")
  })

  // Esta línea sirve para declarar la prueba que verifica que «ignores falsy/conditional values».
  it("ignores falsy/conditional values", () => {
    // Esta línea sirve para verificar que «cn("a", false && "b", undefined, null, "c")» cumple «toBe».
    expect(cn("a", false && "b", undefined, null, "c")).toBe("a c")
  })

  // Esta línea sirve para declarar la prueba que verifica que «resolves conflicting tailwind classes, keeping the last one».
  it("resolves conflicting tailwind classes, keeping the last one", () => {
    // Esta línea sirve para verificar que «cn("px-2", "px-4")» cumple «toBe».
    expect(cn("px-2", "px-4")).toBe("px-4")
  })
})
