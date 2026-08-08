import { describe, expect, it } from "vitest"
import { cn } from "./utils"

describe("cn", () => {
  it("combines multiple class names", () => {
    expect(cn("a", "b")).toBe("a b")
  })

  it("ignores falsy/conditional values", () => {
    expect(cn("a", false && "b", undefined, null, "c")).toBe("a c")
  })

  it("resolves conflicting tailwind classes, keeping the last one", () => {
    expect(cn("px-2", "px-4")).toBe("px-4")
  })
})
