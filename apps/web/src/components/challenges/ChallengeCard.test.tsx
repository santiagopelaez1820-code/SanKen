// Esta línea sirve para importar «describe, expect, it, vi» desde «vitest».
import { describe, expect, it, vi } from "vitest"
// Esta línea sirve para importar «render, screen» desde «@testing-library/react».
import { render, screen } from "@testing-library/react"
// Esta línea sirve para importar «userEvent» desde «@testing-library/user-event».
import userEvent from "@testing-library/user-event"
// Esta línea sirve para importar los tipos «Challenge» desde «@sanken/core».
import type { Challenge } from "@sanken/core"
// Esta línea sirve para importar «ChallengeCard» desde «./ChallengeCard».
import { ChallengeCard } from "./ChallengeCard"

// Esta línea sirve para simular el módulo «@/components/challenges/ChallengeLeaderboard» en la prueba.
vi.mock("@/components/challenges/ChallengeLeaderboard", () => ({
  // Esta línea sirve para declarar la propiedad «ChallengeLeaderboard» con el valor o tipo «() => <div data-testid="leaderboard-stub" />».
  ChallengeLeaderboard: () => <div data-testid="leaderboard-stub" />,
}))

// Esta línea sirve para declarar un reto de ejemplo para las pruebas.
const baseChallenge: Challenge = {
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «1».
  id: 1,
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"Racha semanal"».
  title: "Racha semanal",
  // Esta línea sirve para declarar la propiedad «description» con el valor o tipo «"Completa 5 entrenamientos esta semana."».
  description: "Completa 5 entrenamientos esta semana.",
  // Esta línea sirve para declarar la propiedad «type» con el valor o tipo «"weekly"».
  type: "weekly",
  // Esta línea sirve para declarar la propiedad «criteria» con el valor o tipo «{ metric: "workouts_count", target: 5 }».
  criteria: { metric: "workouts_count", target: 5 },
  // Esta línea sirve para declarar la propiedad «starts_at» con el valor o tipo «"2026-08-10"».
  starts_at: "2026-08-10",
  // Esta línea sirve para declarar la propiedad «ends_at» con el valor o tipo «"2026-08-16"».
  ends_at: "2026-08-16",
  // Esta línea sirve para declarar la propiedad «joined» con el valor o tipo «false».
  joined: false,
  // Esta línea sirve para declarar la propiedad «progress_value» con el valor o tipo «null».
  progress_value: null,
  // Esta línea sirve para declarar la propiedad «completed» con el valor o tipo «false».
  completed: false,
}

// Esta línea sirve para agrupar las pruebas de «ChallengeCard».
describe("ChallengeCard", () => {
  // Esta línea sirve para declarar la prueba que verifica que «shows a join button and no progress bar when the viewer hasn't joined».
  it("shows a join button and no progress bar when the viewer hasn't joined", async () => {
    // Esta línea sirve para crear la función espía «onJoin».
    const onJoin = vi.fn()
    // Esta línea sirve para dibujar el componente en el entorno de prueba.
    render(<ChallengeCard challenge={baseChallenge} expanded={false} onToggle={vi.fn()} onJoin={onJoin} />)

    // Esta línea sirve para verificar que «screen.getByText("Racha semanal")» cumple «toBeInTheDocument».
    expect(screen.getByText("Racha semanal")).toBeInTheDocument()
    // Esta línea sirve para verificar que «screen.queryByText(/\/ 5 entrenamientos/)» cumple «not.toBeInTheDocument».
    expect(screen.queryByText(/\/ 5 entrenamientos/)).not.toBeInTheDocument()

    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(screen.getByRole("button", { name: "Unirme" }))
    // Esta línea sirve para verificar que «onJoin» cumple «toHaveBeenCalledOnce».
    expect(onJoin).toHaveBeenCalledOnce()
  })

  // Esta línea sirve para declarar la prueba que verifica que «shows progress toward the target once joined».
  it("shows progress toward the target once joined", () => {
    // Esta línea sirve para crear un reto al que el usuario ya se unió con 2 de progreso.
    const joined: Challenge = { ...baseChallenge, joined: true, progress_value: 2 }
    // Esta línea sirve para dibujar el componente en el entorno de prueba.
    render(<ChallengeCard challenge={joined} expanded={false} onToggle={vi.fn()} onJoin={vi.fn()} />)

    // Esta línea sirve para verificar que «screen.getByText("2 / 5 entrenamientos")» cumple «toBeInTheDocument».
    expect(screen.getByText("2 / 5 entrenamientos")).toBeInTheDocument()
    // Esta línea sirve para verificar que «screen.queryByText("¡Completado!")» cumple «not.toBeInTheDocument».
    expect(screen.queryByText("¡Completado!")).not.toBeInTheDocument()
  })

  // Esta línea sirve para declarar la prueba que verifica que «flags completed challenges and toggles the leaderboard».
  it("flags completed challenges and toggles the leaderboard", async () => {
    // Esta línea sirve para crear la función espía «onToggle».
    const onToggle = vi.fn()
    // Esta línea sirve para crear un reto completado.
    const joined: Challenge = { ...baseChallenge, joined: true, progress_value: 5, completed: true }
    // Esta línea sirve para dibujar la tarjeta y guardar la función para volver a dibujarla.
    const { rerender } = render(
      // Esta línea sirve para abrir el componente «ChallengeCard».
      <ChallengeCard challenge={joined} expanded={false} onToggle={onToggle} onJoin={vi.fn()} />
    )

    // Esta línea sirve para verificar que «screen.getByText("¡Completado!")» cumple «toBeInTheDocument».
    expect(screen.getByText("¡Completado!")).toBeInTheDocument()
    // Esta línea sirve para verificar que «screen.queryByTestId("leaderboard-stub")» cumple «not.toBeInTheDocument».
    expect(screen.queryByTestId("leaderboard-stub")).not.toBeInTheDocument()

    // Esta línea sirve para simular la acción del usuario «click».
    await userEvent.click(screen.getByRole("button", { name: "Ver tabla" }))
    // Esta línea sirve para verificar que «onToggle» cumple «toHaveBeenCalledOnce».
    expect(onToggle).toHaveBeenCalledOnce()

    // Esta línea sirve para volver a dibujar la tarjeta con la tabla expandida.
    rerender(<ChallengeCard challenge={joined} expanded onToggle={onToggle} onJoin={vi.fn()} />)
    // Esta línea sirve para verificar que «screen.getByTestId("leaderboard-stub")» cumple «toBeInTheDocument».
    expect(screen.getByTestId("leaderboard-stub")).toBeInTheDocument()
    // Esta línea sirve para verificar que el botón cambió a «Ocultar tabla».
    expect(screen.getByRole("button", { name: "Ocultar tabla" })).toBeInTheDocument()
  })
})
