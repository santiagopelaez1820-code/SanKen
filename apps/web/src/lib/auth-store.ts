import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@sanken/core"

interface PendingChallenge {
  challengeToken: string
}

interface AuthState {
  token: string | null
  user: User | null
  pendingChallenge: PendingChallenge | null
  setSession: (token: string, user: User) => void
  clearSession: () => void
  setPendingChallenge: (challengeToken: string) => void
  clearPendingChallenge: () => void
  setOnboardingCompleted: () => void
  setHasLocation: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      pendingChallenge: null,
      setSession: (token, user) => set({ token, user, pendingChallenge: null }),
      clearSession: () => set({ token: null, user: null }),
      setPendingChallenge: (challengeToken) => set({ pendingChallenge: { challengeToken } }),
      clearPendingChallenge: () => set({ pendingChallenge: null }),
      setOnboardingCompleted: () =>
        set((state) => (state.user ? { user: { ...state.user, onboarding_completed: true } } : state)),
      setHasLocation: () =>
        set((state) => (state.user ? { user: { ...state.user, has_location: true } } : state)),
    }),
    {
      name: "sanken-auth",
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)
