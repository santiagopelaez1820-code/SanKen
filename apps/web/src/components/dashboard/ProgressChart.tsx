import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { ProgressMetric, ProgressPoint } from "@sanken/core"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

const METRICS: { value: ProgressMetric; label: string; unit: string }[] = [
  { value: "weight", label: "Peso corporal", unit: "kg" },
  { value: "1rm", label: "Fuerza (1RM)", unit: "kg" },
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
    <div className="rounded-1 px-3 py-2" style={{ background: "var(--sanken-charcoal)", border: "1px solid var(--bs-border-color)" }}>
      <p className="small fw-semibold mb-0">{point.date}</p>
      <p className="small text-body-secondary mb-0">
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
    <div className="sank-surface rounded-2 p-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-1">
        <div className="d-flex gap-1 flex-wrap">
          {METRICS.map((m) => (
            <button
              key={m.value}
              onClick={() => setMetric(m.value)}
              className={cn(
                "btn btn-sm rounded-1 border-0",
                metric === m.value ? "btn-primary" : "sank-ghost-btn bg-transparent"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowTable((v) => !v)}
          className="btn btn-sm sank-ghost-btn border-0 bg-transparent"
        >
          {showTable ? "Ver gráfica" : "Ver tabla"}
        </button>
      </div>

      <div className="mt-3">
        {isLoading && <Skeleton style={{ height: 260, width: "100%" }} />}

        {!isLoading && data?.length === 0 && (
          <p className="py-5 text-center small text-body-secondary mb-0">
            Todavía no hay suficientes datos para esta métrica.
          </p>
        )}

        {!isLoading && data && data.length > 0 && !showTable && (
          <ResponsiveContainer key={metric} width="100%" height={280} debounce={200}>
            <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "#6B6B6B", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
              />
              <YAxis
                tick={{ fill: "#6B6B6B", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={56}
                domain={["auto", "auto"]}
              />
              <Tooltip content={<ChartTooltip unit={activeMetric.unit} />} cursor={{ stroke: "rgba(255,255,255,0.15)" }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#FF6A00"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#FF6A00", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                isAnimationActive
                animationDuration={650}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {!isLoading && data && data.length > 0 && showTable && (
          <div className="table-responsive">
            <table className="table table-sm mb-0">
              <thead>
                <tr>
                  <th className="small text-body-secondary fw-medium">Fecha</th>
                  <th className="small text-body-secondary fw-medium">Valor</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.date}>
                    <td className="small">{row.date}</td>
                    <td className="small sank-tabular-nums">
                      {row.value.toLocaleString("es")} {activeMetric.unit}
                    </td>
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
