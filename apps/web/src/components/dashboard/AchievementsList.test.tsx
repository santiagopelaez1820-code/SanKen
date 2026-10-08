// Esta línea sirve para importar «describe, expect, it» desde «vitest».
import { describe, expect, it } from "vitest"
// Esta línea sirve para importar «render, screen» desde «@testing-library/react».
import { render, screen } from "@testing-library/react"
// Esta línea sirve para importar los tipos «Achievement» desde «@sanken/core».
import type { Achievement } from "@sanken/core"
// Esta línea sirve para importar «AchievementsList» desde «./AchievementsList».
import { AchievementsList } from "./AchievementsList"

// Esta línea sirve para declarar los logros de ejemplo para las pruebas.
const achievements: Achievement[] = [
  {
    // Esta línea sirve para declarar la propiedad «code» con el valor o tipo «"first_workout"».
    code: "first_workout",
    // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «"Primer entrenamiento"».
    name: "Primer entrenamiento",
    // Esta línea sirve para definir la descripción del logro de ejemplo.
    description: "Completa tu primera sesión de entrenamiento.",
    // Esta línea sirve para declarar la propiedad «xp_bonus» con el valor o tipo «50».
    xp_bonus: 50,
    // Esta línea sirve para declarar la propiedad «unlocked» con el valor o tipo «true».
    unlocked: true,
    // Esta línea sirve para declarar la propiedad «achieved_at» con el valor o tipo «"2026-08-09T00:00:00Z"».
    achieved_at: "2026-08-09T00:00:00Z",
  },
  {
    // Esta línea sirve para declarar la propiedad «code» con el valor o tipo «"consistent"».
    code: "consistent",
    // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «"Constante"».
    name: "Constante",
    // Esta línea sirve para declarar la propiedad «description» con el valor o tipo «"Completa 10 sesiones de entrenamiento."».
    description: "Completa 10 sesiones de entrenamiento.",
    // Esta línea sirve para declarar la propiedad «xp_bonus» con el valor o tipo «100».
    xp_bonus: 100,
    // Esta línea sirve para declarar la propiedad «unlocked» con el valor o tipo «false».
    unlocked: false,
    // Esta línea sirve para declarar la propiedad «achieved_at» con el valor o tipo «null».
    achieved_at: null,
  },
]

// Esta línea sirve para agrupar las pruebas de «AchievementsList».
describe("AchievementsList", () => {
  // Esta línea sirve para declarar la prueba que verifica que «shows an empty state when there are no achievements».
  it("shows an empty state when there are no achievements", () => {
    // Esta línea sirve para dibujar el componente en el entorno de prueba.
    render(<AchievementsList achievements={[]} />)
    // Esta línea sirve para verificar que se muestra el mensaje de lista vacía.
    expect(screen.getByText("Todavía no hay logros disponibles.")).toBeInTheDocument()
  })

  // Esta línea sirve para declarar la prueba que verifica que «renders both locked and unlocked achievements».
  it("renders both locked and unlocked achievements", () => {
    // Esta línea sirve para dibujar el componente en el entorno de prueba.
    render(<AchievementsList achievements={achievements} />)
    // Esta línea sirve para verificar que «screen.getByText("Primer entrenamiento")» cumple «toBeInTheDocument».
    expect(screen.getByText("Primer entrenamiento")).toBeInTheDocument()
    // Esta línea sirve para verificar que «screen.getByText("Constante")» cumple «toBeInTheDocument».
    expect(screen.getByText("Constante")).toBeInTheDocument()
    // Esta línea sirve para verificar que «screen.getByText("+50 XP")» cumple «toBeInTheDocument».
    expect(screen.getByText("+50 XP")).toBeInTheDocument()
    // Esta línea sirve para verificar que «screen.getByText("+100 XP")» cumple «toBeInTheDocument».
    expect(screen.getByText("+100 XP")).toBeInTheDocument()
  })
})
