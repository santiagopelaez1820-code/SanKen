import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { ProgressMetric, ProgressPoint } from "@sanken/core"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

const METRICS: { value: ProgressMetric; label: string; unit: string }[] = [
  { value: "weight", label: "Peso corporal", unit: "kg" },
  { value: "volume", label: "Volumen diario", unit: "kg" },
]

function ChartTooltip({
  active,
  payload,
  unit,
}: {
  active?: boolean
  payload?: { payload: ProgressPoint }[]
  unit: string
}) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-sm">
      <p className="font-medium text-foreground">{point.date}</p>
      <p className="text-muted-foreground">
        {point.value.toLocaleString("es")} {unit}
      </p>
    </div>
  )
}

export function ProgressChart() {
  const [metric, setMetric] = useState<ProgressMetric>("weight")
  const [showTable, setShowTable] = useState(false)
  const activeMetric = METRICS.find((m) => m.value === metric)!

  const { data, isLoading } = useQuery({
    queryKey: ["stats", "progress", metric],
    queryFn: () => api.get<ProgressPoint[]>(`/stats/progress?metric=${metric}`),
  })

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-sm font-medium text-foreground">Progreso</h2>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border p-0.5 text-xs">
            {METRICS.map((m) => (
              <button
                key={m.value}
                onClick={() => setMetric(m.value)}
                className={cn(
                  "rounded-md px-2.5 py-1 font-medium transition-colors",
                  metric === m.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {m.label}
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
        {isLoading && <Skeleton className="py-10 text-center h-20 w-full" />}

        {!isLoading && data?.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Todavía no hay suficientes datos para esta métrica.
          </p>
        )}

        {!isLoading && data && data.length > 0 && !showTable && (
          <ResponsiveContainer key={metric} width="100%" height={240} debounce={200}>
            <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={56}
                domain={["auto", "auto"]}
              />
              <Tooltip content={<ChartTooltip unit={activeMetric.unit} />} cursor={{ stroke: "var(--border)" }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--chart-1)", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                isAnimationActive
                animationDuration={650}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {!isLoading && data && data.length > 0 && showTable && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="py-2 font-medium">Fecha</th>
                <th className="py-2 font-medium">Valor</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.date} className="border-b border-border last:border-0">
                  <td className="py-2 text-foreground">{row.date}</td>
                  <td className="py-2 text-foreground">
                    {row.value.toLocaleString("es")} {activeMetric.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
