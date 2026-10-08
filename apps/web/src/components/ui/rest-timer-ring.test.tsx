// Esta línea sirve para importar «afterEach, beforeEach, describe, expect, it, vi» desde «vitest».
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
// Esta línea sirve para importar «render, screen, act» desde «@testing-library/react».
import { render, screen, act } from "@testing-library/react"
// Esta línea sirve para importar «userEvent» desde «@testing-library/user-event».
import userEvent from "@testing-library/user-event"
// Esta línea sirve para importar «RestTimerRing» desde «./rest-timer-ring».
import { RestTimerRing } from "./rest-timer-ring"

// Esta línea sirve para agrupar las pruebas de «RestTimerRing».
describe("RestTimerRing", () => {
  // Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
  beforeEach(() => {
    // Esta línea sirve para activar los temporizadores simulados.
    vi.useFakeTimers()
  })

  // Esta línea sirve para declarar lo que se ejecuta después de cada prueba.
  afterEach(() => {
    // Esta línea sirve para volver a los temporizadores reales.
    vi.useRealTimers()
  })

  // Esta línea sirve para declarar la prueba que verifica que «renders nothing when there is no active rest».
  it("renders nothing when there is no active rest", () => {
    // Esta línea sirve para dibujar el anillo sin descanso activo.
    const { container } = render(<RestTimerRing restingUntil={null} totalSeconds={90} onSkip={() => {}} />)
    // Esta línea sirve para verificar que «container» cumple «toBeEmptyDOMElement».
    expect(container).toBeEmptyDOMElement()
  })

  // Esta línea sirve para declarar la prueba que verifica que «shows the remaining time as mm:ss».
  it("shows the remaining time as mm:ss", () => {
    // Esta línea sirve para calcular el fin del descanso dentro de 65 segundos.
    const restingUntil = Date.now() + 65_000
    // Esta línea sirve para dibujar el componente en el entorno de prueba.
    render(<RestTimerRing restingUntil={restingUntil} totalSeconds={90} onSkip={() => {}} />)
    // Esta línea sirve para verificar que «screen.getByText("1:05")» cumple «toBeInTheDocument».
    expect(screen.getByText("1:05")).toBeInTheDocument()
  })

  // Esta línea sirve para declarar la prueba que verifica que «counts down as time passes».
  it("counts down as time passes", () => {
    // Esta línea sirve para calcular el fin del descanso dentro de 5 segundos.
    const restingUntil = Date.now() + 5_000
    // Esta línea sirve para dibujar el componente en el entorno de prueba.
    render(<RestTimerRing restingUntil={restingUntil} totalSeconds={90} onSkip={() => {}} />)
    // Esta línea sirve para verificar que «screen.getByText("0:05")» cumple «toBeInTheDocument».
    expect(screen.getByText("0:05")).toBeInTheDocument()

    // Esta línea sirve para ejecutar la acción dentro de act de React.
    act(() => {
      // Esta línea sirve para avanzar 3 segundos el reloj simulado.
      vi.advanceTimersByTime(3_000)
    })

    // Esta línea sirve para verificar que «screen.getByText("0:02")» cumple «toBeInTheDocument».
    expect(screen.getByText("0:02")).toBeInTheDocument()
  })

  // Esta línea sirve para declarar la prueba que verifica que «calls onSkip when the skip button is clicked».
  it("calls onSkip when the skip button is clicked", async () => {
    // Esta línea sirve para volver a los temporizadores reales.
    vi.useRealTimers()
    // Esta línea sirve para preparar el simulador de acciones del usuario.
    const user = userEvent.setup()
    // Esta línea sirve para crear la función espía «onSkip».
    const onSkip = vi.fn()

    // Esta línea sirve para dibujar el componente en el entorno de prueba.
    render(<RestTimerRing restingUntil={Date.now() + 10_000} totalSeconds={90} onSkip={onSkip} />)
    // Esta línea sirve para simular la acción del usuario «click».
    await user.click(screen.getByRole("button", { name: /saltar descanso/i }))

    // Esta línea sirve para verificar que «onSkip» cumple «toHaveBeenCalledOnce».
    expect(onSkip).toHaveBeenCalledOnce()
  })
})
