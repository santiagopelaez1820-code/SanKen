import { beforeEach, describe, expect, it } from "vitest"
import type { User } from "@sanken/core"
import { useAuthStore } from "./auth-store"

const user: User = {
  id: 1,
  name: "Test",
  email: "test@example.com",
  avatar_url: null,
  role: "user",
  two_factor_enabled: false,
  is_public_profile: false,
  trainer_verified_at: null,
  email_verified_at: null,
  onboarding_completed: true,
  has_location: true,
  created_at: "2024-01-01T00:00:00Z",
}

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null, pendingChallenge: null })
    localStorage.clear()
  })

  it("setSession stores the token/user and clears any pending challenge", () => {
    useAuthStore.getState().setPendingChallenge("chal-1")
    useAuthStore.getState().setSession("tok-1", user)

    const state = useAuthStore.getState()
    expect(state.token).toBe("tok-1")
    expect(state.user).toEqual(user)
    expect(state.pendingChallenge).toBeNull()
  })

  it("clearSession resets token and user", () => {
    useAuthStore.getState().setSession("tok-1", user)
    useAuthStore.getState().clearSession()

    expect(useAuthStore.getState().token).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()
  })

  it("setPendingChallenge/clearPendingChallenge toggle the pending challenge", () => {
    useAuthStore.getState().setPendingChallenge("chal-2")
    expect(useAuthStore.getState().pendingChallenge).toEqual({ challengeToken: "chal-2" })

    useAuthStore.getState().clearPendingChallenge()
    expect(useAuthStore.getState().pendingChallenge).toBeNull()
  })

  it("excludes pendingChallenge from the persisted (localStorage) state", () => {
    const partialize = useAuthStore.persist.getOptions().partialize
    if (!partialize) throw new Error("expected a partialize function on the persist config")

    const persisted = partialize({
      token: "tok-1",
      user,
      pendingChallenge: { challengeToken: "chal-1" },
    } as ReturnType<typeof useAuthStore.getState>)

    expect(persisted).toEqual({ token: "tok-1", user })
  })
})
