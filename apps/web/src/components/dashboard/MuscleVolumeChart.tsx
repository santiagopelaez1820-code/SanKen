import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { MuscleVolume, VolumeRange } from "@sanken/core"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

const RANGES: { value: VolumeRange; label: string }[] = [
  { value: "weekly", label: "7 días" },
  { value: "monthly", label: "30 días" },
]

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: MuscleVolume }[] }) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-sm">
      <p className="font-medium text-foreground">{point.muscle_group}</p>
      <p className="text-muted-foreground">{point.volume_kg.toLocaleString("es")} kg</p>
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
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-sm font-medium text-foreground">Volumen por grupo muscular</h2>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border p-0.5 text-xs">
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={cn(
                  "rounded-md px-2.5 py-1 font-medium transition-colors",
                  range === r.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowTable((v) => !v)}
            className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {showTable ? "Ver gráfica" : "Ver tabla"}
          </button>
        </div>
      </div>

      <div className="mt-4">
        {isLoading && <p className="py-10 text-center text-sm text-muted-foreground">Cargando…</p>}

        {!isLoading && data?.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Sin entrenamientos registrados en este rango todavía.
          </p>
        )}

        {!isLoading && data && data.length > 0 && !showTable && (
          <ResponsiveContainer width="100%" height={240} debounce={200}>
            <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="muscle_group"
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={56}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="volume_kg" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {!isLoading && data && data.length > 0 && showTable && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="py-2 font-medium">Grupo muscular</th>
                <th className="py-2 font-medium">Volumen</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.muscle_group} className="border-b border-border last:border-0">
                  <td className="py-2 text-foreground">{row.muscle_group}</td>
                  <td className="py-2 text-foreground">{row.volume_kg.toLocaleString("es")} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
