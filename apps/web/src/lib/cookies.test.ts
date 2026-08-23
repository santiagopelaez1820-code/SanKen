import { afterEach, describe, expect, it } from "vitest"
import { readCookie } from "./cookies"

describe("readCookie", () => {
  afterEach(() => {
    document.cookie.split(";").forEach((c) => {
      const name = c.split("=")[0]?.trim()
      if (name) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
    })
  })

  it("extracts the value of a named cookie", () => {
    document.cookie = "XSRF-TOKEN=abc123"
    expect(readCookie("XSRF-TOKEN")).toBe("abc123")
  })

  it("returns null when the cookie is absent", () => {
    expect(readCookie("MISSING-COOKIE")).toBeNull()
  })

  it("url-decodes the cookie value", () => {
    document.cookie = "XSRF-TOKEN=abc%2F123"
    expect(readCookie("XSRF-TOKEN")).toBe("abc/123")
  })
})
