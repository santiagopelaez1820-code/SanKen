import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { MuscleVolume, VolumeRange } from "@sanken/core"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

const RANGES: { value: VolumeRange; label: string }[] = [
  { value: "weekly", label: "7 días" },
  { value: "monthly", label: "30 días" },
]

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: MuscleVolume }[] }) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload

  return (
    <div className="rounded-1 px-3 py-2" style={{ background: "var(--sanken-charcoal)", border: "1px solid var(--bs-border-color)" }}>
      <p className="small fw-semibold mb-0">{point.muscle_group}</p>
      <p className="small text-body-secondary mb-0">{point.volume_kg.toLocaleString("es")} kg</p>
    </div>
  )
}

export function MuscleVolumeChart() {
  const [range, setRange] = useState<VolumeRange>("weekly")
  const [showTable, setShowTable] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ["stats", "volume", range],
    queryFn: () => api.get<MuscleVolume[]>(`/stats/volume?range=${range}`),
  })

  return (
    <div className="sank-surface rounded-2 p-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-1">
        <h2 className="sank-eyebrow mb-0">Volumen por grupo muscular</h2>
        <div className="d-flex align-items-center gap-2">
          <div className="d-flex gap-1">
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={cn(
                  "btn btn-sm rounded-1 border-0",
                  range === r.value ? "btn-primary" : "sank-ghost-btn bg-transparent"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button onClick={() => setShowTable((v) => !v)} className="btn btn-sm sank-ghost-btn border-0 bg-transparent">
            {showTable ? "Ver gráfica" : "Ver tabla"}
          </button>
        </div>
      </div>

      <div className="mt-3">
        {isLoading && <Skeleton style={{ height: 260, width: "100%" }} />}

        {!isLoading && data?.length === 0 && (
          <p className="py-5 text-center small text-body-secondary mb-0">
            Sin entrenamientos registrados en este rango todavía.
          </p>
        )}

        {!isLoading && data && data.length > 0 && !showTable && (
          <ResponsiveContainer key={range} width="100%" height={260} debounce={200}>
            <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="muscle_group"
                tick={{ fill: "#9AA6B2", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
              />
              <YAxis tick={{ fill: "#9AA6B2", fontSize: 12 }} tickLine={false} axisLine={false} width={56} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
              <Bar
                dataKey="volume_kg"
                fill="#00B8D9"
                radius={[2, 2, 0, 0]}
                maxBarSize={44}
                isAnimationActive
                animationDuration={650}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {!isLoading && data && data.length > 0 && showTable && (
          <div className="table-responsive">
            <table className="table table-sm mb-0">
              <thead>
                <tr>
                  <th className="small text-body-secondary fw-medium">Grupo muscular</th>
                  <th className="small text-body-secondary fw-medium">Volumen</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.muscle_group}>
                    <td className="small">{row.muscle_group}</td>
                    <td className="small sank-tabular-nums">{row.volume_kg.toLocaleString("es")} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
