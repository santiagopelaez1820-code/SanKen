import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import type { RankingEntry } from "@sanken/core"
import { RankingList } from "./RankingList"

const entries: RankingEntry[] = [
  { rank: 1, user_id: 1, user_name: "Ana", metric_value: 2000, is_viewer: false },
  { rank: 2, user_id: 2, user_name: "Tú", metric_value: 1500, is_viewer: true },
]

describe("RankingList", () => {
  it("shows an empty state when there are no entries", () => {
    render(<RankingList entries={[]} viewer={null} />)
    expect(screen.getByText("Todavía no hay suficientes datos para este ranking.")).toBeInTheDocument()
  })

  it("renders every entry with its rank and highlights the viewer", () => {
    render(<RankingList entries={entries} viewer={entries[1]} />)
    expect(screen.getByText("Ana")).toBeInTheDocument()
    expect(screen.getByText("Tú")).toBeInTheDocument()
    expect(screen.queryByText("Tu posición")).not.toBeInTheDocument()
  })

  it("shows a separate viewer row when the viewer is outside the visible entries", () => {
    const viewer: RankingEntry = { rank: 47, user_id: 99, user_name: "Tú", metric_value: 300, is_viewer: true }
    render(<RankingList entries={entries} viewer={viewer} />)
    expect(screen.getByText("Tu posición")).toBeInTheDocument()
    expect(screen.getByText("47")).toBeInTheDocument()
  })
})
