// Esta línea sirve para importar «beforeEach, describe, expect, it» desde «vitest».
import { beforeEach, describe, expect, it } from "vitest"
// Esta línea sirve para importar los tipos «User» desde «@sanken/core».
import type { User } from "@sanken/core"
// Esta línea sirve para importar «useAuthStore» desde «./auth-store».
import { useAuthStore } from "./auth-store"

// Esta línea sirve para declarar el dato de ejemplo «user» de tipo «User».
const user: User = {
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «1».
  id: 1,
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «"Test"».
  name: "Test",
  // Esta línea sirve para declarar la propiedad «email» con el valor o tipo «"test@example.com"».
  email: "test@example.com",
  // Esta línea sirve para declarar la propiedad «avatar_url» con el valor o tipo «null».
  avatar_url: null,
  // Esta línea sirve para declarar la propiedad «role» con el valor o tipo «"user"».
  role: "user",
  // Esta línea sirve para declarar la propiedad «two_factor_enabled» con el valor o tipo «false».
  two_factor_enabled: false,
  // Esta línea sirve para declarar la propiedad «is_public_profile» con el valor o tipo «false».
  is_public_profile: false,
  // Esta línea sirve para declarar la propiedad «trainer_verified_at» con el valor o tipo «null».
  trainer_verified_at: null,
  // Esta línea sirve para declarar la propiedad «email_verified_at» con el valor o tipo «null».
  email_verified_at: null,
  // Esta línea sirve para declarar la propiedad «onboarding_completed» con el valor o tipo «true».
  onboarding_completed: true,
  // Esta línea sirve para declarar la propiedad «has_location» con el valor o tipo «true».
  has_location: true,
  // Esta línea sirve para declarar la propiedad «created_at» con el valor o tipo «"2024-01-01T00:00:00Z"».
  created_at: "2024-01-01T00:00:00Z",
}

// Esta línea sirve para agrupar las pruebas de «useAuthStore».
describe("useAuthStore", () => {
  // Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
  beforeEach(() => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useAuthStore.setState({ token: null, user: null, pendingChallenge: null })
    // Esta línea sirve para limpiar el almacenamiento local.
    localStorage.clear()
  })

  // Esta línea sirve para declarar la prueba que verifica que «setSession stores the token/user and clears any pending challenge».
  it("setSession stores the token/user and clears any pending challenge", () => {
    // Esta línea sirve para invocar la acción «setPendingChallenge» del store de «Auth».
    useAuthStore.getState().setPendingChallenge("chal-1")
    // Esta línea sirve para invocar la acción «setSession» del store de «Auth».
    useAuthStore.getState().setSession("tok-1", user)

    // Esta línea sirve para leer el estado actual del store en «state».
    const state = useAuthStore.getState()
    // Esta línea sirve para verificar que «state.token» cumple «toBe».
    expect(state.token).toBe("tok-1")
    // Esta línea sirve para verificar que «state.user» cumple «toEqual».
    expect(state.user).toEqual(user)
    // Esta línea sirve para verificar que «state.pendingChallenge» cumple «toBeNull».
    expect(state.pendingChallenge).toBeNull()
  })

  // Esta línea sirve para declarar la prueba que verifica que «clearSession resets token and user».
  it("clearSession resets token and user", () => {
    // Esta línea sirve para invocar la acción «setSession» del store de «Auth».
    useAuthStore.getState().setSession("tok-1", user)
    // Esta línea sirve para invocar la acción «clearSession» del store de «Auth».
    useAuthStore.getState().clearSession()

    // Esta línea sirve para verificar que «useAuthStore.getState(» cumple «token».
    expect(useAuthStore.getState().token).toBeNull()
    // Esta línea sirve para verificar que «useAuthStore.getState(» cumple «user».
    expect(useAuthStore.getState().user).toBeNull()
  })

  // Esta línea sirve para declarar la prueba que verifica que «setPendingChallenge/clearPendingChallenge toggle the pending challenge».
  it("setPendingChallenge/clearPendingChallenge toggle the pending challenge", () => {
    // Esta línea sirve para invocar la acción «setPendingChallenge» del store de «Auth».
    useAuthStore.getState().setPendingChallenge("chal-2")
    // Esta línea sirve para verificar que «useAuthStore.getState(» cumple «pendingChallenge».
    expect(useAuthStore.getState().pendingChallenge).toEqual({ challengeToken: "chal-2" })

    // Esta línea sirve para invocar la acción «clearPendingChallenge» del store de «Auth».
    useAuthStore.getState().clearPendingChallenge()
    // Esta línea sirve para verificar que «useAuthStore.getState(» cumple «pendingChallenge».
    expect(useAuthStore.getState().pendingChallenge).toBeNull()
  })

  // Esta línea sirve para declarar la prueba que verifica que «excludes pendingChallenge from the persisted (localStorage) state».
  it("excludes pendingChallenge from the persisted (localStorage) state", () => {
    // Esta línea sirve para crear «partialize» llamando a «useAuthStore.persist.getOptions».
    const partialize = useAuthStore.persist.getOptions().partialize
    // Esta línea sirve para lanzar un error si «!partialize».
    if (!partialize) throw new Error("expected a partialize function on the persist config")

    // Esta línea sirve para crear «persisted» llamando a «partialize».
    const persisted = partialize({
      // Esta línea sirve para declarar la propiedad «token» con el valor o tipo «"tok-1"».
      token: "tok-1",
      // Esta línea sirve para incluir el valor «user» en la lista.
      user,
      // Esta línea sirve para declarar la propiedad «pendingChallenge» con el valor o tipo «{ challengeToken: "chal-1" }».
      pendingChallenge: { challengeToken: "chal-1" },
    // Esta línea sirve para tipar el estado parcial como el del store.
    } as ReturnType<typeof useAuthStore.getState>)

    // Esta línea sirve para verificar que «persisted» cumple «toEqual».
    expect(persisted).toEqual({ token: "tok-1", user })
  })
})
