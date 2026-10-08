// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «useQuery» desde «@tanstack/react-query».
import { useQuery } from "@tanstack/react-query"
// Esta línea sirve para importar los componentes de gráfica de líneas de Recharts.
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
// Esta línea sirve para importar los tipos «ProgressMetric, ProgressPoint» desde «@sanken/core».
import type { ProgressMetric, ProgressPoint } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"
// Esta línea sirve para importar «useResolvedTheme» desde «@/hooks/use-resolved-theme».
import { useResolvedTheme } from "@/hooks/use-resolved-theme"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar las métricas que se pueden graficar.
const METRICS: { value: ProgressMetric; label: string; unit: string }[] = [
  // Esta línea sirve para definir la métrica de peso corporal.
  { value: "weight", label: "Peso corporal", unit: "kg" },
  // Esta línea sirve para definir la métrica de fuerza estimada (1RM).
  { value: "1rm", label: "Fuerza (1RM)", unit: "kg" },
  // Esta línea sirve para definir la métrica de volumen diario.
  { value: "volume", label: "Volumen diario", unit: "kg" },
]

// Esta línea sirve para declarar el cuadro emergente de la gráfica.
function ChartTooltip({
  // Esta línea sirve para recibir si el cuadro está activo.
  active,
  // Esta línea sirve para recibir los datos del punto.
  payload,
  // Esta línea sirve para recibir la unidad de medida.
  unit,
// Esta línea sirve para declarar los tipos de las propiedades.
}: {
  // Esta línea sirve para declarar la propiedad «active» con el valor o tipo «boolean».
  active?: boolean
  // Esta línea sirve para declarar la propiedad «payload» con el valor o tipo «{ payload: ProgressPoint }[]».
  payload?: { payload: ProgressPoint }[]
  // Esta línea sirve para declarar la propiedad «unit» con el valor o tipo «string».
  unit: string
// Esta línea sirve para abrir el cuerpo del componente.
}) {
  // Esta línea sirve para evitar mostrar algo si no está activo o no hay datos.
  if (!active || !payload?.length) return null
  // Esta línea sirve para obtener los datos del punto señalado.
  const point = payload[0].payload

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «rounded-1 px-3 py-2».
    <div className="rounded-1 px-3 py-2" style={{ background: "var(--sanken-charcoal)", border: "1px solid var(--bs-border-color)" }}>
      {/* Esta línea sirve para mostrar la fecha del punto. */}
      <p className="small fw-semibold mb-0">{point.date}</p>
      {/* Esta línea sirve para abrir el elemento «p» con las clases «small text-body-secondary mb-0». */}
      <p className="small text-body-secondary mb-0">
        {/* Esta línea sirve para mostrar el valor con su unidad. */}
        {point.value.toLocaleString("es")} {unit}
      </p>
    </div>
  )
}

// Esta línea sirve para declarar el componente de la gráfica de progreso.
export function ProgressChart() {
  // Esta línea sirve para guardar la métrica elegida.
  const [metric, setMetric] = useState<ProgressMetric>("weight")
  // Esta línea sirve para guardar si se muestra la tabla en lugar de la gráfica.
  const [showTable, setShowTable] = useState(false)
  // Esta línea sirve para obtener la métrica activa.
  const activeMetric = METRICS.find((m) => m.value === metric)!
  // Ver el comentario equivalente en MuscleVolumeChart.tsx: Recharts pinta
  // estos colores como props SVG, no reaccionan solos al tema.
  // Esta línea sirve para obtener «isDark» con el hook «useResolvedTheme».
  const isDark = useResolvedTheme() === "dark"
  // Esta línea sirve para elegir el color de la cuadrícula según el tema.
  const gridStroke = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"
  // Esta línea sirve para elegir el color de los ejes según el tema.
  const axisStroke = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)"
  // Esta línea sirve para elegir el color de las marcas según el tema.
  const tickColor = isDark ? "#9AA6B2" : "#5B6670"
  // Esta línea sirve para elegir el color del cursor según el tema.
  const cursorStroke = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"
  // Esta línea sirve para elegir el color de la línea según el tema.
  const lineColor = isDark ? "#00B8D9" : "#0093AD"

  // Esta línea sirve para obtener «data, isLoading» con el hook «useQuery».
  const { data, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["stats", "progress", metric]».
    queryKey: ["stats", "progress", metric],
    // Esta línea sirve para pedir a la API el progreso de la métrica elegida.
    queryFn: () => api.get<ProgressPoint[]>(`/stats/progress?metric=${metric}`),
  })

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «sank-surface rounded-2 p-4».
    <div className="sank-surface rounded-2 p-4">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex flex-wrap align-items-center just». */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-1">
        {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex gap-1 flex-wrap». */}
        <div className="d-flex gap-1 flex-wrap">
          {/* Esta línea sirve para recorrer «METRICS» y mostrar un bloque por elemento. */}
          {METRICS.map((m) => (
            // Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas.
            <button
              // Esta línea sirve para identificar el elemento de la lista con «m.value}».
              key={m.value}
              // Esta línea sirve para asignar el manejador del evento «onClick».
              onClick={() => setMetric(m.value)}
              // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
              className={cn(
                // Esta línea sirve para aplicar las clases base del botón de métrica.
                "btn btn-sm rounded-1 border-0",
                // Esta línea sirve para resaltar el botón de la métrica activa.
                metric === m.value ? "btn-primary" : "sank-ghost-btn bg-transparent"
              )}
            >
              {/* Esta línea sirve para mostrar el valor «m.label». */}
              {m.label}
            </button>
          ))}
        </div>
        {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
        <button
          // Esta línea sirve para asignar el manejador del evento «onClick».
          onClick={() => setShowTable((v) => !v)}
          // Esta línea sirve para aplicar las clases de estilo «btn btn-sm sank-ghost-btn border-0 bg-transpa».
          className="btn btn-sm sank-ghost-btn border-0 bg-transparent"
        >
          {/* Esta línea sirve para mostrar el texto según la vista actual. */}
          {showTable ? "Ver gráfica" : "Ver tabla"}
        </button>
      </div>

      {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-3». */}
      <div className="mt-3">
        {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
        {isLoading && <Skeleton style={{ height: 260, width: "100%" }} />}

        {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && data?.length === 0». */}
        {!isLoading && data?.length === 0 && (
          // Esta línea sirve para abrir el elemento «p» con las clases «py-5 text-center small text-body-seconda».
          <p className="py-5 text-center small text-body-secondary mb-0">
            {/* Esta línea sirve para mostrar el texto «Todavía no hay suficientes datos para esta métrica.». */}
            Todavía no hay suficientes datos para esta métrica.
          </p>
        )}

        {/* Esta línea sirve para mostrar la gráfica solo si hay datos y no se pidió la tabla. */}
        {!isLoading && data && data.length > 0 && !showTable && (
          // Esta línea sirve para abrir el componente «ResponsiveContainer».
          <ResponsiveContainer key={metric} width="100%" height={280} debounce={200}>
            {/* Esta línea sirve para abrir el componente «LineChart». */}
            <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              {/* Esta línea sirve para abrir el componente «CartesianGrid». */}
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              {/* Esta línea sirve para abrir el elemento «XAxis» con sus atributos en varias líneas. */}
              <XAxis
                // Esta línea sirve para definir el atributo «dataKey» con el valor «date».
                dataKey="date"
                // Esta línea sirve para pasar la propiedad «tick» con el valor «{ fill: tickColor, fontSize: 12 }}».
                tick={{ fill: tickColor, fontSize: 12 }}
                // Esta línea sirve para pasar la propiedad «tickLine» con el valor «false}».
                tickLine={false}
                // Esta línea sirve para pasar la propiedad «axisLine» con el valor «{ stroke: axisStroke }}».
                axisLine={{ stroke: axisStroke }}
              />
              {/* Esta línea sirve para abrir el elemento «YAxis» con sus atributos en varias líneas. */}
              <YAxis
                // Esta línea sirve para pasar la propiedad «tick» con el valor «{ fill: tickColor, fontSize: 12 }}».
                tick={{ fill: tickColor, fontSize: 12 }}
                // Esta línea sirve para pasar la propiedad «tickLine» con el valor «false}».
                tickLine={false}
                // Esta línea sirve para pasar la propiedad «axisLine» con el valor «false}».
                axisLine={false}
                // Esta línea sirve para pasar la propiedad «width» con el valor «56}».
                width={56}
                // Esta línea sirve para pasar la propiedad «domain» con el valor «["auto", "auto"]}».
                domain={["auto", "auto"]}
              />
              {/* Esta línea sirve para mostrar el componente «Tooltip». */}
              <Tooltip content={<ChartTooltip unit={activeMetric.unit} />} cursor={{ stroke: cursorStroke }} />
              {/* Esta línea sirve para abrir el elemento «Line» con sus atributos en varias líneas. */}
              <Line
                // Esta línea sirve para definir el atributo «type» con el valor «monotone».
                type="monotone"
                // Esta línea sirve para definir el atributo «dataKey» con el valor «value».
                dataKey="value"
                // Esta línea sirve para pasar la propiedad «stroke» con el valor «lineColor}».
                stroke={lineColor}
                // Esta línea sirve para pasar la propiedad «strokeWidth» con el valor «2.5}».
                strokeWidth={2.5}
                // Esta línea sirve para pasar la propiedad «dot» con el valor «{ r: 3, fill: lineColor, strokeWidth: 0 }}».
                dot={{ r: 3, fill: lineColor, strokeWidth: 0 }}
                // Esta línea sirve para pasar la propiedad «activeDot» con el valor «{ r: 5 }}».
                activeDot={{ r: 5 }}
                // Esta línea sirve para activar la animación de la línea.
                isAnimationActive
                // Esta línea sirve para pasar la propiedad «animationDuration» con el valor «650}».
                animationDuration={650}
                // Esta línea sirve para definir el atributo «animationEasing» con el valor «ease-out».
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && data && data.length > 0 && showTable». */}
        {!isLoading && data && data.length > 0 && showTable && (
          // Esta línea sirve para abrir el elemento «div» con las clases «table-responsive».
          <div className="table-responsive">
            {/* Esta línea sirve para abrir el elemento «table» con las clases «table table-sm mb-0». */}
            <table className="table table-sm mb-0">
              {/* Esta línea sirve para abrir el elemento «thead». */}
              <thead>
                {/* Esta línea sirve para abrir el elemento «tr». */}
                <tr>
                  {/* Esta línea sirve para mostrar el encabezado de fecha. */}
                  <th className="small text-body-secondary fw-medium">Fecha</th>
                  {/* Esta línea sirve para mostrar el encabezado de valor. */}
                  <th className="small text-body-secondary fw-medium">Valor</th>
                </tr>
              </thead>
              {/* Esta línea sirve para abrir el elemento «tbody». */}
              <tbody>
                {/* Esta línea sirve para recorrer «data» y mostrar un bloque por elemento. */}
                {data.map((row) => (
                  // Esta línea sirve para abrir el elemento «tr».
                  <tr key={row.date}>
                    {/* Esta línea sirve para mostrar la fecha de la fila. */}
                    <td className="small">{row.date}</td>
                    {/* Esta línea sirve para abrir el elemento «td» con las clases «small sank-tabular-nums». */}
                    <td className="small sank-tabular-nums">
                      {/* Esta línea sirve para mostrar el valor de la fila con su unidad. */}
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
