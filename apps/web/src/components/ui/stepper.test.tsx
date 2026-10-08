// Esta línea sirve para importar «describe, expect, it, vi» desde «vitest».
import { describe, expect, it, vi } from "vitest"
// Esta línea sirve para importar «render, screen» desde «@testing-library/react».
import { render, screen } from "@testing-library/react"
// Esta línea sirve para importar «userEvent» desde «@testing-library/user-event».
import userEvent from "@testing-library/user-event"
// Esta línea sirve para importar «Stepper» desde «./stepper».
import { Stepper } from "./stepper"

// Esta línea sirve para agrupar las pruebas de «Stepper».
describe("Stepper", () => {
  // Esta línea sirve para declarar la prueba que verifica que «renders the current value».
  it("renders the current value", () => {
    // Esta línea sirve para dibujar el componente en el entorno de prueba.
    render(<Stepper value={42.5} onChange={() => {}} />)
    // Esta línea sirve para verificar que «screen.getByText("42.5")» cumple «toBeInTheDocument».
    expect(screen.getByText("42.5")).toBeInTheDocument()
  })

  // Esta línea sirve para declarar la prueba que verifica que «treats a null value as 0».
  it("treats a null value as 0", () => {
    // Esta línea sirve para dibujar el componente en el entorno de prueba.
    render(<Stepper value={null} onChange={() => {}} />)
    // Esta línea sirve para verificar que «screen.getByText("0")» cumple «toBeInTheDocument».
    expect(screen.getByText("0")).toBeInTheDocument()
  })

  // Esta línea sirve para declarar la prueba que verifica que «increments by step on the plus button».
  it("increments by step on the plus button", async () => {
    // Esta línea sirve para preparar el simulador de acciones del usuario.
    const user = userEvent.setup()
    // Esta línea sirve para crear la función espía «onChange».
    const onChange = vi.fn()
    // Esta línea sirve para dibujar el componente en el entorno de prueba.
    render(<Stepper value={40} onChange={onChange} step={2.5} />)
    // Esta línea sirve para simular un clic en el botón de sumar.
    await user.click(screen.getByRole("button", { name: /sumar/i }))
    // Esta línea sirve para verificar que «onChange» cumple «toHaveBeenCalledWith».
    expect(onChange).toHaveBeenCalledWith(42.5)
  })

  // Esta línea sirve para declarar la prueba que verifica que «decrements by step on the minus button».
  it("decrements by step on the minus button", async () => {
    // Esta línea sirve para preparar el simulador de acciones del usuario.
    const user = userEvent.setup()
    // Esta línea sirve para crear la función espía «onChange».
    const onChange = vi.fn()
    // Esta línea sirve para dibujar el componente en el entorno de prueba.
    render(<Stepper value={40} onChange={onChange} step={2.5} />)
    // Esta línea sirve para simular un clic en el botón de restar.
    await user.click(screen.getByRole("button", { name: /restar/i }))
    // Esta línea sirve para verificar que «onChange» cumple «toHaveBeenCalledWith».
    expect(onChange).toHaveBeenCalledWith(37.5)
  })

  // Esta línea sirve para declarar la prueba que verifica que «clamps to min».
  it("clamps to min", async () => {
    // Esta línea sirve para preparar el simulador de acciones del usuario.
    const user = userEvent.setup()
    // Esta línea sirve para crear la función espía «onChange».
    const onChange = vi.fn()
    // Esta línea sirve para dibujar el componente en el entorno de prueba.
    render(<Stepper value={0} onChange={onChange} min={0} step={1} />)
    // Esta línea sirve para simular un clic en el botón de restar.
    await user.click(screen.getByRole("button", { name: /restar/i }))
    // Esta línea sirve para verificar que «onChange» cumple «toHaveBeenCalledWith».
    expect(onChange).toHaveBeenCalledWith(0)
  })

  // Esta línea sirve para declarar la prueba que verifica que «clamps to max».
  it("clamps to max", async () => {
    // Esta línea sirve para preparar el simulador de acciones del usuario.
    const user = userEvent.setup()
    // Esta línea sirve para crear la función espía «onChange».
    const onChange = vi.fn()
    // Esta línea sirve para dibujar el componente en el entorno de prueba.
    render(<Stepper value={100} onChange={onChange} max={100} step={1} />)
    // Esta línea sirve para simular un clic en el botón de sumar.
    await user.click(screen.getByRole("button", { name: /sumar/i }))
    // Esta línea sirve para verificar que «onChange» cumple «toHaveBeenCalledWith».
    expect(onChange).toHaveBeenCalledWith(100)
  })
})
