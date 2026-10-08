// Esta línea sirve para importar «create» desde «zustand».
import { create } from "zustand"
// Esta línea sirve para importar «persist» desde «zustand/middleware».
import { persist } from "zustand/middleware"
// Esta línea sirve para importar los tipos «User» desde «@sanken/core».
import type { User } from "@sanken/core"

// Esta línea sirve para declarar la interfaz «PendingChallenge».
interface PendingChallenge {
  // Esta línea sirve para declarar la propiedad «challengeToken» con el valor o tipo «string».
  challengeToken: string
}

// Esta línea sirve para declarar la interfaz «AuthState».
interface AuthState {
  // Esta línea sirve para declarar la propiedad «token» con el valor o tipo «string | null».
  token: string | null
  // Esta línea sirve para declarar la propiedad «user» con el valor o tipo «User | null».
  user: User | null
  // Esta línea sirve para declarar la propiedad «pendingChallenge» con el valor o tipo «PendingChallenge | null».
  pendingChallenge: PendingChallenge | null
  // Esta línea sirve para declarar la propiedad «setSession» con el valor o tipo «(token: string, user: User) => void».
  setSession: (token: string, user: User) => void
  // Esta línea sirve para declarar la propiedad «clearSession» con el valor o tipo «() => void».
  clearSession: () => void
  /** Reemplaza el usuario (p. ej. tras cambiar la foto) sin tocar el token. */
  // Esta línea sirve para declarar la propiedad «setUser» con el valor o tipo «(user: User) => void».
  setUser: (user: User) => void
  // Esta línea sirve para declarar la propiedad «setPendingChallenge» con el valor o tipo «(challengeToken: string) => void».
  setPendingChallenge: (challengeToken: string) => void
  // Esta línea sirve para declarar la propiedad «clearPendingChallenge» con el valor o tipo «() => void».
  clearPendingChallenge: () => void
  // Esta línea sirve para declarar la propiedad «setOnboardingCompleted» con el valor o tipo «() => void».
  setOnboardingCompleted: () => void
  // Esta línea sirve para declarar la propiedad «setHasLocation» con el valor o tipo «() => void».
  setHasLocation: () => void
}

// Esta línea sirve para crear el store de autenticación con persistencia.
export const useAuthStore = create<AuthState>()(
  // Esta línea sirve para envolver el store con la persistencia.
  persist(
    // Esta línea sirve para declarar el estado inicial y las acciones.
    (set) => ({
      // Esta línea sirve para declarar la propiedad «token» con el valor o tipo «null».
      token: null,
      // Esta línea sirve para declarar la propiedad «user» con el valor o tipo «null».
      user: null,
      // Esta línea sirve para declarar la propiedad «pendingChallenge» con el valor o tipo «null».
      pendingChallenge: null,
      // Esta línea sirve para guardar la sesión y limpiar el desafío pendiente.
      setSession: (token, user) => set({ token, user, pendingChallenge: null }),
      // Esta línea sirve para declarar la propiedad «clearSession» con el valor o tipo «() => set({ token: null, user: null })».
      clearSession: () => set({ token: null, user: null }),
      // Esta línea sirve para declarar la propiedad «setUser» con el valor o tipo «(user) => set({ user })».
      setUser: (user) => set({ user }),
      // Esta línea sirve para guardar el desafío de doble verificación pendiente.
      setPendingChallenge: (challengeToken) => set({ pendingChallenge: { challengeToken } }),
      // Esta línea sirve para declarar la propiedad «clearPendingChallenge» con el valor o tipo «() => set({ pendingChallenge: null })».
      clearPendingChallenge: () => set({ pendingChallenge: null }),
      // Esta línea sirve para declarar la propiedad «setOnboardingCompleted» con el valor o tipo «() =>».
      setOnboardingCompleted: () =>
        // Esta línea sirve para marcar el onboarding como completado en el usuario.
        set((state) => (state.user ? { user: { ...state.user, onboarding_completed: true } } : state)),
      // Esta línea sirve para declarar la propiedad «setHasLocation» con el valor o tipo «() =>».
      setHasLocation: () =>
        // Esta línea sirve para marcar que el usuario ya registró su ubicación.
        set((state) => (state.user ? { user: { ...state.user, has_location: true } } : state)),
    }),
    {
      // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «"sanken-auth"».
      name: "sanken-auth",
      // Esta línea sirve para persistir solo el token y el usuario.
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)
