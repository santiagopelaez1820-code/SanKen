import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { UsageActivityPoint, UsageActivitySeries, UsageAnalyticsOverview, UsageAnalyticsPeriod } from "@sanken/core"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { useResolvedTheme } from "@/hooks/use-resolved-theme"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const PERIODS: { value: UsageAnalyticsPeriod; label: string }[] = [
  { value: "today", label: "Hoy" },
  { value: "week", label: "Semana" },
  { value: "month", label: "Mes" },
]

/** Referencia del período anterior — texto neutro, sin colorear verde/rojo (ver §8: es un dato, no una valoración). */
const PREVIOUS_PERIOD_LABEL: Record<UsageAnalyticsPeriod, string> = {
  today: "vs. ayer",
  week: "vs. semana anterior",
  month: "vs. mes anterior",
}

function ChangeStat({ pct, referenceLabel }: { pct: number | null; referenceLabel: string }) {
  if (pct === null) {
    return <p className="mt-0.5 text-xs text-muted-foreground">Sin datos del período anterior</p>
  }

  const sign = pct > 0 ? "+" : ""

  return (
    <p className="mt-0.5 text-xs text-muted-foreground">
      {sign}
      {pct}% {referenceLabel}
    </p>
  )
}

function ActiveUsersCard({
  label,
  value,
  changePct,
  referenceLabel,
  isLoading,
}: {
  label: string
  value?: number
  changePct?: number | null
  referenceLabel: string
  isLoading: boolean
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</p>
      {isLoading ? (
        <Skeleton className="mt-1.5 h-9 w-16" />
      ) : (
        <>
          <p className="mt-1.5 font-heading text-4xl font-bold tracking-tight text-foreground tabular-nums">
            {value?.toLocaleString("es") ?? 0}
          </p>
          <ChangeStat pct={changePct ?? null} referenceLabel={referenceLabel} />
        </>
      )}
    </div>
  )
}

function ActivityTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: UsageActivityPoint }[]
}) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
      <p className="text-xs font-semibold text-foreground">{point.label}</p>
      <p className="text-xs text-muted-foreground">{point.value.toLocaleString("es")} usuarios únicos</p>
    </div>
  )
}

export function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<UsageAnalyticsPeriod>("today")
  const isDark = useResolvedTheme() === "dark"

  // Recharts pinta estos colores como props SVG, no reaccionan solos al tema
  // (mismo criterio que ProgressChart/MuscleVolumeChart).
  const gridStroke = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"
  const axisStroke = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)"
  const tickColor = isDark ? "#9AA6B2" : "#5B6670"
  const cursorFill = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"
  const barColor = isDark ? "#00B8D9" : "#0093AD"

  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ["admin", "analytics", "overview", period],
    queryFn: () => api.get<UsageAnalyticsOverview>(`/admin/analytics/overview?period=${period}`),
  })

  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ["admin", "analytics", "activity", period],
    queryFn: () => api.get<UsageActivitySeries>(`/admin/analytics/activity?period=${period}`),
  })

  const referenceLabel = PREVIOUS_PERIOD_LABEL[period]

  return (
    <main className="px-6 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Analítica de uso</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Personas que realmente usaron SanKen, no solo cuentas registradas.
          </p>
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ActiveUsersCard
            label="Activos hoy"
            value={overview?.active_today}
            changePct={overview?.active_today_change_pct}
            referenceLabel="vs. ayer"
            isLoading={overviewLoading}
          />
          <ActiveUsersCard
            label="Activos esta semana"
            value={overview?.active_week}
            changePct={overview?.active_week_change_pct}
            referenceLabel="vs. semana anterior"
            isLoading={overviewLoading}
          />
          <ActiveUsersCard
            label="Activos este mes"
            value={overview?.active_month}
            changePct={overview?.active_month_change_pct}
            referenceLabel="vs. mes anterior"
            isLoading={overviewLoading}
          />
        </section>

        <Tabs value={period} onValueChange={(value) => setPeriod(value as UsageAnalyticsPeriod)}>
          <TabsList>
            {PERIODS.map((p) => (
              <TabsTrigger key={p.value} value={p.value}>
                {p.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">Actividad de usuarios</h2>
          <p className="text-xs text-muted-foreground">
            {activity?.granularity === "hour" ? "Usuarios únicos por hora, hoy." : "Usuarios únicos por día."}
          </p>

          <div className="mt-3">
            {activityLoading && <Skeleton className="h-[260px] w-full" />}

            {!activityLoading && activity && (
              <ResponsiveContainer key={period} width="100%" height={260} debounce={200}>
                <BarChart data={activity.points} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: tickColor, fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: axisStroke }}
                    interval={activity.granularity === "hour" ? 2 : 0}
                  />
                  <YAxis
                    tick={{ fill: tickColor, fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                    allowDecimals={false}
                  />
                  <Tooltip content={<ActivityTooltip />} cursor={{ fill: cursorFill }} />
                  <Bar
                    dataKey="value"
                    fill={barColor}
                    radius={[2, 2, 0, 0]}
                    maxBarSize={36}
                    isAnimationActive
                    animationDuration={500}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card px-5 py-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Usuarios registrados</p>
            {overviewLoading ? (
              <Skeleton className="mt-1.5 h-8 w-14" />
            ) : (
              <p className={cn("mt-1.5 text-2xl font-bold tabular-nums text-foreground")}>
                {overview?.registered_users_total.toLocaleString("es") ?? 0}
              </p>
            )}
            <p className="mt-0.5 text-xs text-muted-foreground">Total histórico, no depende del filtro.</p>
          </div>

          <div className="rounded-xl border border-border bg-card px-5 py-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Nuevos usuarios</p>
            {overviewLoading ? (
              <Skeleton className="mt-1.5 h-8 w-14" />
            ) : (
              <p className="mt-1.5 text-2xl font-bold tabular-nums text-foreground">
                {overview?.new_users.toLocaleString("es") ?? 0}
              </p>
            )}
            <ChangeStat pct={overview?.new_users_change_pct ?? null} referenceLabel={referenceLabel} />
          </div>

          <div className="rounded-xl border border-border bg-card px-5 py-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Sesiones</p>
            {overviewLoading ? (
              <Skeleton className="mt-1.5 h-8 w-14" />
            ) : (
              <p className="mt-1.5 text-2xl font-bold tabular-nums text-foreground">
                {overview?.sessions.toLocaleString("es") ?? 0}
              </p>
            )}
            <ChangeStat pct={overview?.sessions_change_pct ?? null} referenceLabel={referenceLabel} />
          </div>
        </section>
      </div>
    </main>
  )
}
