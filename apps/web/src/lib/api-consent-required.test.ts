import { afterEach, describe, expect, it, vi } from "vitest"
import { ApiClient, ApiError } from "@sanken/core"

function mockFetch(status: number, body: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }))
  )
}

describe("ApiClient consent_required", () => {
  afterEach(() => vi.unstubAllGlobals())

  it("notifies the pending consents when the backend blocks the request", async () => {
    mockFetch(403, {
      message: "Debes aceptar…",
      code: "consent_required",
      pending: [{ type: "terms", document: "terms", version: "2.0", accepted_version: "1.0" }],
    })
    const onConsentRequired = vi.fn()
    const client = new ApiClient({ baseUrl: "http://api.test", onConsentRequired })

    await expect(client.get("/stats/dashboard")).rejects.toBeInstanceOf(ApiError)
    expect(onConsentRequired).toHaveBeenCalledWith(["terms"])
  })

  it("ignores other 403 responses", async () => {
    mockFetch(403, { message: "No tienes permiso." })
    const onConsentRequired = vi.fn()
    const client = new ApiClient({ baseUrl: "http://api.test", onConsentRequired })

    await expect(client.get("/admin/users")).rejects.toBeInstanceOf(ApiError)
    expect(onConsentRequired).not.toHaveBeenCalled()
  })
})
