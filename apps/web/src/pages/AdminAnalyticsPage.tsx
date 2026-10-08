// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «useQuery» desde «@tanstack/react-query».
import { useQuery } from "@tanstack/react-query"
// Esta línea sirve para importar los componentes de gráfica de barras de Recharts.
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
// Esta línea sirve para importar los tipos de analítica de uso.
import type { UsageActivityPoint, UsageActivitySeries, UsageAnalyticsOverview, UsageAnalyticsPeriod } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"
// Esta línea sirve para importar «useResolvedTheme» desde «@/hooks/use-resolved-theme».
import { useResolvedTheme } from "@/hooks/use-resolved-theme"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"
// Esta línea sirve para importar «Tabs, TabsList, TabsTrigger» desde «@/components/ui/tabs».
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Esta línea sirve para declarar «PERIODS» con el valor «[».
const PERIODS: { value: UsageAnalyticsPeriod; label: string }[] = [
  // Esta línea sirve para agregar el período «Hoy».
  { value: "today", label: "Hoy" },
  // Esta línea sirve para agregar el período «Semana».
  { value: "week", label: "Semana" },
  // Esta línea sirve para agregar el período «Mes».
  { value: "month", label: "Mes" },
]

/** Referencia del período anterior — texto neutro, sin colorear verde/rojo (ver §8: es un dato, no una valoración). */
// Esta línea sirve para declarar «PREVIOUS_PERIOD_LABEL» con el valor «{».
const PREVIOUS_PERIOD_LABEL: Record<UsageAnalyticsPeriod, string> = {
  // Esta línea sirve para declarar la propiedad «today» con el valor o tipo «"vs. ayer"».
  today: "vs. ayer",
  // Esta línea sirve para declarar la propiedad «week» con el valor o tipo «"vs. semana anterior"».
  week: "vs. semana anterior",
  // Esta línea sirve para declarar la propiedad «month» con el valor o tipo «"vs. mes anterior"».
  month: "vs. mes anterior",
}

// Esta línea sirve para declarar la función «ChangeStat».
function ChangeStat({ pct, referenceLabel }: { pct: number | null; referenceLabel: string }) {
  // Esta línea sirve para revisar si «pct === null».
  if (pct === null) {
    // Esta línea sirve para mostrar el aviso de que no hay datos del período anterior.
    return <p className="mt-0.5 text-xs text-muted-foreground">Sin datos del período anterior</p>
  }

  // Esta línea sirve para extraer «ig» de «pct > 0 ? "+" : ""».
  const sign = pct > 0 ? "+" : ""

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «p» con las clases «mt-0.5 text-xs text-muted-foreground».
    <p className="mt-0.5 text-xs text-muted-foreground">
      {/* Esta línea sirve para mostrar el valor «sign». */}
      {sign}
      {/* Esta línea sirve para mostrar el contenido dinámico «{pct}% {referenceLabel}». */}
      {pct}% {referenceLabel}
    </p>
  )
}

// Esta línea sirve para declarar la función «ActiveUsersCard».
function ActiveUsersCard({
  // Esta línea sirve para incluir el valor «label» en la lista.
  label,
  // Esta línea sirve para incluir el valor «value» en la lista.
  value,
  // Esta línea sirve para incluir el valor «changePct» en la lista.
  changePct,
  // Esta línea sirve para incluir el valor «referenceLabel» en la lista.
  referenceLabel,
  // Esta línea sirve para incluir el valor «isLoading» en la lista.
  isLoading,
// Esta línea sirve para cerrar los parámetros y abrir sus tipos.
}: {
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «string».
  label: string
  // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «number».
  value?: number
  // Esta línea sirve para declarar la propiedad «changePct» con el valor o tipo «number | null».
  changePct?: number | null
  // Esta línea sirve para declarar la propiedad «referenceLabel» con el valor o tipo «string».
  referenceLabel: string
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «boolean».
  isLoading: boolean
// Esta línea sirve para cerrar los tipos y abrir el cuerpo.
}) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «rounded-xl border border-border bg-card ».
    <div className="rounded-xl border border-border bg-card px-5 py-4">
      {/* Esta línea sirve para mostrar el valor «label» dentro de un «p». */}
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</p>
      {/* Esta línea sirve para elegir entre dos bloques según «isLoading». */}
      {isLoading ? (
        // Esta línea sirve para abrir el componente «Skeleton».
        <Skeleton className="mt-1.5 h-9 w-16" />
      // Esta línea sirve para mostrar el bloque alternativo.
      ) : (
        // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
        <>
          {/* Esta línea sirve para abrir el elemento «p» con las clases «mt-1.5 font-heading text-4xl font-bold t». */}
          <p className="mt-1.5 font-heading text-4xl font-bold tracking-tight text-foreground tabular-nums">
            {/* Esta línea sirve para mostrar el contenido dinámico «{value?.toLocaleString("es") ?? 0}». */}
            {value?.toLocaleString("es") ?? 0}
          </p>
          {/* Esta línea sirve para abrir el componente «ChangeStat». */}
          <ChangeStat pct={changePct ?? null} referenceLabel={referenceLabel} />
        </>
      )}
    </div>
  )
}

// Esta línea sirve para declarar la función «ActivityTooltip».
function ActivityTooltip({
  // Esta línea sirve para incluir el valor «active» en la lista.
  active,
  // Esta línea sirve para incluir el valor «payload» en la lista.
  payload,
// Esta línea sirve para cerrar los parámetros y abrir sus tipos.
}: {
  // Esta línea sirve para declarar la propiedad «active» con el valor o tipo «boolean».
  active?: boolean
  // Esta línea sirve para declarar la propiedad «payload» con el valor o tipo «{ payload: UsageActivityPoint }[]».
  payload?: { payload: UsageActivityPoint }[]
// Esta línea sirve para cerrar los tipos y abrir el cuerpo.
}) {
  // Esta línea sirve para devolver null si «!active || !payload?.length».
  if (!active || !payload?.length) return null
  // Esta línea sirve para extraer «oin» de «payload[0].payload».
  const point = payload[0].payload

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «rounded-lg border border-border bg-card ».
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
      {/* Esta línea sirve para mostrar el valor «point.label» dentro de un «p». */}
      <p className="text-xs font-semibold text-foreground">{point.label}</p>
      {/* Esta línea sirve para mostrar la cantidad de usuarios únicos del punto. */}
      <p className="text-xs text-muted-foreground">{point.value.toLocaleString("es")} usuarios únicos</p>
    </div>
  )
}

// Esta línea sirve para declarar la función «AdminAnalyticsPage».
export function AdminAnalyticsPage() {
  // Esta línea sirve para crear el estado «period» y su función «setPeriod».
  const [period, setPeriod] = useState<UsageAnalyticsPeriod>("today")
  // Esta línea sirve para obtener «isDark» con el hook «useResolvedTheme».
  const isDark = useResolvedTheme() === "dark"

  // Recharts pinta estos colores como props SVG, no reaccionan solos al tema
  // (mismo criterio que ProgressChart/MuscleVolumeChart).
  // Esta línea sirve para extraer «ridStrok» de «isDark ? "rgba(255,255,255,0.06)" : "rgb».
  const gridStroke = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"
  // Esta línea sirve para extraer «xisStrok» de «isDark ? "rgba(255,255,255,0.08)" : "rgb».
  const axisStroke = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)"
  // Esta línea sirve para extraer «ickColo» de «isDark ? "#9AA6B2" : "#5B6670"».
  const tickColor = isDark ? "#9AA6B2" : "#5B6670"
  // Esta línea sirve para extraer «ursorFil» de «isDark ? "rgba(255,255,255,0.04)" : "rgb».
  const cursorFill = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"
  // Esta línea sirve para extraer «arColo» de «isDark ? "#00B8D9" : "#0093AD"».
  const barColor = isDark ? "#00B8D9" : "#0093AD"

  // Esta línea sirve para pedir el resumen de analítica del período.
  const { data: overview, isLoading: overviewLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["admin", "analytics", "overview", period]».
    queryKey: ["admin", "analytics", "overview", period],
    // Esta línea sirve para pedir el resumen a la API.
    queryFn: () => api.get<UsageAnalyticsOverview>(`/admin/analytics/overview?period=${period}`),
  })

  // Esta línea sirve para pedir la actividad por período.
  const { data: activity, isLoading: activityLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["admin", "analytics", "activity", period]».
    queryKey: ["admin", "analytics", "activity", period],
    // Esta línea sirve para pedir la serie de actividad a la API.
    queryFn: () => api.get<UsageActivitySeries>(`/admin/analytics/activity?period=${period}`),
  })

  // Esta línea sirve para extraer «eferenceLabe» de «PREVIOUS_PERIOD_LABEL[period]».
  const referenceLabel = PREVIOUS_PERIOD_LABEL[period]

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-3xl flex-col gap-6». */}
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* Esta línea sirve para abrir el elemento «div». */}
        <div>
          {/* Esta línea sirve para mostrar el texto «Analítica de uso» dentro de un «h1». */}
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Analítica de uso</h1>
          {/* Esta línea sirve para abrir el elemento «p» con las clases «mt-1 text-sm text-muted-foreground». */}
          <p className="mt-1 text-sm text-muted-foreground">
            {/* Esta línea sirve para mostrar la explicación de la página. */}
            Personas que realmente usaron SanKen, no solo cuentas registradas.
          </p>
        </div>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «grid grid-cols-2 gap-3 sm:grid-cols-3 sm». */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {/* Esta línea sirve para abrir el elemento «ActiveUsersCard» con sus atributos en varias líneas. */}
          <ActiveUsersCard
            // Esta línea sirve para definir el atributo «label» con el valor «Activos hoy».
            label="Activos hoy"
            // Esta línea sirve para pasar la propiedad «value» con el valor «overview?.active_today}».
            value={overview?.active_today}
            // Esta línea sirve para pasar la propiedad «changePct» con el valor «overview?.active_today_change_pct}».
            changePct={overview?.active_today_change_pct}
            // Esta línea sirve para definir el atributo «referenceLabel» con el valor «vs. ayer».
            referenceLabel="vs. ayer"
            // Esta línea sirve para pasar la propiedad «isLoading» con el valor «overviewLoading}».
            isLoading={overviewLoading}
          />
          {/* Esta línea sirve para abrir el elemento «ActiveUsersCard» con sus atributos en varias líneas. */}
          <ActiveUsersCard
            // Esta línea sirve para definir el atributo «label» con el valor «Activos esta semana».
            label="Activos esta semana"
            // Esta línea sirve para pasar la propiedad «value» con el valor «overview?.active_week}».
            value={overview?.active_week}
            // Esta línea sirve para pasar la propiedad «changePct» con el valor «overview?.active_week_change_pct}».
            changePct={overview?.active_week_change_pct}
            // Esta línea sirve para definir el atributo «referenceLabel» con el valor «vs. semana anterior».
            referenceLabel="vs. semana anterior"
            // Esta línea sirve para pasar la propiedad «isLoading» con el valor «overviewLoading}».
            isLoading={overviewLoading}
          />
          {/* Esta línea sirve para abrir el elemento «ActiveUsersCard» con sus atributos en varias líneas. */}
          <ActiveUsersCard
            // Esta línea sirve para definir el atributo «label» con el valor «Activos este mes».
            label="Activos este mes"
            // Esta línea sirve para pasar la propiedad «value» con el valor «overview?.active_month}».
            value={overview?.active_month}
            // Esta línea sirve para pasar la propiedad «changePct» con el valor «overview?.active_month_change_pct}».
            changePct={overview?.active_month_change_pct}
            // Esta línea sirve para definir el atributo «referenceLabel» con el valor «vs. mes anterior».
            referenceLabel="vs. mes anterior"
            // Esta línea sirve para pasar la propiedad «isLoading» con el valor «overviewLoading}».
            isLoading={overviewLoading}
          />
        </section>

        {/* Esta línea sirve para abrir las pestañas que cambian de período. */}
        <Tabs value={period} onValueChange={(value) => setPeriod(value as UsageAnalyticsPeriod)}>
          {/* Esta línea sirve para abrir el componente «TabsList». */}
          <TabsList>
            {/* Esta línea sirve para recorrer «PERIODS» y mostrar un bloque por elemento. */}
            {PERIODS.map((p) => (
              // Esta línea sirve para abrir el componente «TabsTrigger».
              <TabsTrigger key={p.value} value={p.value}>
                {/* Esta línea sirve para mostrar el valor «p.label». */}
                {p.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el texto «Actividad de usuarios» dentro de un «h2». */}
          <h2 className="text-sm font-semibold text-foreground">Actividad de usuarios</h2>
          {/* Esta línea sirve para abrir el elemento «p» con las clases «text-xs text-muted-foreground». */}
          <p className="text-xs text-muted-foreground">
            {/* Esta línea sirve para mostrar si la actividad es por hora o por día. */}
            {activity?.granularity === "hour" ? "Usuarios únicos por hora, hoy." : "Usuarios únicos por día."}
          </p>

          {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-3». */}
          <div className="mt-3">
            {/* Esta línea sirve para mostrar el elemento solo si «activityLoading». */}
            {activityLoading && <Skeleton className="h-[260px] w-full" />}

            {/* Esta línea sirve para mostrar el bloque solo si «!activityLoading && activity». */}
            {!activityLoading && activity && (
              // Esta línea sirve para abrir el componente «ResponsiveContainer».
              <ResponsiveContainer key={period} width="100%" height={260} debounce={200}>
                {/* Esta línea sirve para abrir el componente «BarChart». */}
                <BarChart data={activity.points} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  {/* Esta línea sirve para abrir el componente «CartesianGrid». */}
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                  {/* Esta línea sirve para abrir el elemento «XAxis» con sus atributos en varias líneas. */}
                  <XAxis
                    // Esta línea sirve para definir el atributo «dataKey» con el valor «label».
                    dataKey="label"
                    // Esta línea sirve para pasar la propiedad «tick» con el valor «{ fill: tickColor, fontSize: 11 }}».
                    tick={{ fill: tickColor, fontSize: 11 }}
                    // Esta línea sirve para pasar la propiedad «tickLine» con el valor «false}».
                    tickLine={false}
                    // Esta línea sirve para pasar la propiedad «axisLine» con el valor «{ stroke: axisStroke }}».
                    axisLine={{ stroke: axisStroke }}
                    // Recharts oculta las etiquetas que no entran según el ancho real
                    // (antes el intervalo era fijo y en celular se encimaban).
                    // Esta línea sirve para definir el atributo «interval» con el valor «preserveStartEnd».
                    interval="preserveStartEnd"
                    // Esta línea sirve para pasar la propiedad «minTickGap» con el valor «16}».
                    minTickGap={16}
                  />
                  {/* Esta línea sirve para abrir el elemento «YAxis» con sus atributos en varias líneas. */}
                  <YAxis
                    // Esta línea sirve para pasar la propiedad «tick» con el valor «{ fill: tickColor, fontSize: 12 }}».
                    tick={{ fill: tickColor, fontSize: 12 }}
                    // Esta línea sirve para pasar la propiedad «tickLine» con el valor «false}».
                    tickLine={false}
                    // Esta línea sirve para pasar la propiedad «axisLine» con el valor «false}».
                    axisLine={false}
                    // Esta línea sirve para pasar la propiedad «width» con el valor «40}».
                    width={40}
                    // Esta línea sirve para pasar la propiedad «allowDecimals» con el valor «false}».
                    allowDecimals={false}
                  />
                  {/* Esta línea sirve para mostrar el componente «Tooltip». */}
                  <Tooltip content={<ActivityTooltip />} cursor={{ fill: cursorFill }} />
                  {/* Esta línea sirve para abrir el elemento «Bar» con sus atributos en varias líneas. */}
                  <Bar
                    // Esta línea sirve para definir el atributo «dataKey» con el valor «value».
                    dataKey="value"
                    // Esta línea sirve para pasar la propiedad «fill» con el valor «barColor}».
                    fill={barColor}
                    // Esta línea sirve para pasar la propiedad «radius» con el valor «[2, 2, 0, 0]}».
                    radius={[2, 2, 0, 0]}
                    // Esta línea sirve para pasar la propiedad «maxBarSize» con el valor «36}».
                    maxBarSize={36}
                    // Esta línea sirve para activar la animación de las barras.
                    isAnimationActive
                    // Esta línea sirve para pasar la propiedad «animationDuration» con el valor «500}».
                    animationDuration={500}
                    // Esta línea sirve para definir el atributo «animationEasing» con el valor «ease-out».
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «grid grid-cols-2 gap-3 sm:grid-cols-3 sm». */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {/* Esta línea sirve para abrir el elemento «div» con las clases «rounded-xl border border-border bg-card ». */}
          <div className="rounded-xl border border-border bg-card px-5 py-4">
            {/* Esta línea sirve para mostrar el texto «Usuarios registrados» dentro de un «p». */}
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Usuarios registrados</p>
            {/* Esta línea sirve para elegir entre dos bloques según «overviewLoading». */}
            {overviewLoading ? (
              // Esta línea sirve para abrir el componente «Skeleton».
              <Skeleton className="mt-1.5 h-8 w-14" />
            // Esta línea sirve para mostrar el bloque alternativo.
            ) : (
              // Esta línea sirve para abrir el elemento «p».
              <p className={cn("mt-1.5 text-2xl font-bold tabular-nums text-foreground")}>
                {/* Esta línea sirve para mostrar el contenido dinámico «{overview?.registered_users_total.toLocaleString("es") ?? 0}». */}
                {overview?.registered_users_total.toLocaleString("es") ?? 0}
              </p>
            )}
            {/* Esta línea sirve para mostrar el texto «Total histórico, no depende del filtro.» dentro de un «p». */}
            <p className="mt-0.5 text-xs text-muted-foreground">Total histórico, no depende del filtro.</p>
          </div>

          {/* Esta línea sirve para abrir el elemento «div» con las clases «rounded-xl border border-border bg-card ». */}
          <div className="rounded-xl border border-border bg-card px-5 py-4">
            {/* Esta línea sirve para mostrar el texto «Nuevos usuarios» dentro de un «p». */}
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Nuevos usuarios</p>
            {/* Esta línea sirve para elegir entre dos bloques según «overviewLoading». */}
            {overviewLoading ? (
              // Esta línea sirve para abrir el componente «Skeleton».
              <Skeleton className="mt-1.5 h-8 w-14" />
            // Esta línea sirve para mostrar el bloque alternativo.
            ) : (
              // Esta línea sirve para abrir el elemento «p» con las clases «mt-1.5 text-2xl font-bold tabular-nums t».
              <p className="mt-1.5 text-2xl font-bold tabular-nums text-foreground">
                {/* Esta línea sirve para mostrar el contenido dinámico «{overview?.new_users.toLocaleString("es") ?? 0}». */}
                {overview?.new_users.toLocaleString("es") ?? 0}
              </p>
            )}
            {/* Esta línea sirve para abrir el componente «ChangeStat». */}
            <ChangeStat pct={overview?.new_users_change_pct ?? null} referenceLabel={referenceLabel} />
          </div>

          {/* Esta línea sirve para abrir el elemento «div» con las clases «rounded-xl border border-border bg-card ». */}
          <div className="rounded-xl border border-border bg-card px-5 py-4">
            {/* Esta línea sirve para mostrar el texto «Sesiones» dentro de un «p». */}
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Sesiones</p>
            {/* Esta línea sirve para elegir entre dos bloques según «overviewLoading». */}
            {overviewLoading ? (
              // Esta línea sirve para abrir el componente «Skeleton».
              <Skeleton className="mt-1.5 h-8 w-14" />
            // Esta línea sirve para mostrar el bloque alternativo.
            ) : (
              // Esta línea sirve para abrir el elemento «p» con las clases «mt-1.5 text-2xl font-bold tabular-nums t».
              <p className="mt-1.5 text-2xl font-bold tabular-nums text-foreground">
                {/* Esta línea sirve para mostrar el contenido dinámico «{overview?.sessions.toLocaleString("es") ?? 0}». */}
                {overview?.sessions.toLocaleString("es") ?? 0}
              </p>
            )}
            {/* Esta línea sirve para abrir el componente «ChangeStat». */}
            <ChangeStat pct={overview?.sessions_change_pct ?? null} referenceLabel={referenceLabel} />
          </div>
        </section>
      </div>
    </main>
  )
}
