// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «useQuery» desde «@tanstack/react-query».
import { useQuery } from "@tanstack/react-query"
// Esta línea sirve para importar los componentes de gráfica de barras de Recharts.
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
// Esta línea sirve para importar los tipos «MuscleVolume, VolumeRange» desde «@sanken/core».
import type { MuscleVolume, VolumeRange } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"
// Esta línea sirve para importar «useResolvedTheme» desde «@/hooks/use-resolved-theme».
import { useResolvedTheme } from "@/hooks/use-resolved-theme"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar los rangos de tiempo disponibles.
const RANGES: { value: VolumeRange; label: string }[] = [
  // Esta línea sirve para definir el rango semanal.
  { value: "weekly", label: "7 días" },
  // Esta línea sirve para definir el rango mensual.
  { value: "monthly", label: "30 días" },
]

// Esta línea sirve para declarar el cuadro emergente de la gráfica.
function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: MuscleVolume }[] }) {
  // Esta línea sirve para evitar mostrar algo si no está activo o no hay datos.
  if (!active || !payload?.length) return null
  // Esta línea sirve para obtener los datos del punto señalado.
  const point = payload[0].payload

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «rounded-1 px-3 py-2».
    <div className="rounded-1 px-3 py-2" style={{ background: "var(--sanken-charcoal)", border: "1px solid var(--bs-border-color)" }}>
      {/* Esta línea sirve para mostrar el grupo muscular del punto. */}
      <p className="small fw-semibold mb-0">{point.muscle_group}</p>
      {/* Esta línea sirve para mostrar el volumen en kilogramos del punto. */}
      <p className="small text-body-secondary mb-0">{point.volume_kg.toLocaleString("es")} kg</p>
    </div>
  )
}

// Esta línea sirve para declarar el componente de volumen por grupo muscular.
export function MuscleVolumeChart() {
  // Esta línea sirve para guardar el rango de tiempo elegido.
  const [range, setRange] = useState<VolumeRange>("weekly")
  // Esta línea sirve para guardar si se muestra la tabla en lugar de la gráfica.
  const [showTable, setShowTable] = useState(false)
  // Recharts pinta estos colores como props SVG (fill/stroke), no como CSS
  // -- no leen var(--sanken-*) ni reaccionan al atributo data-bs-theme por
  // su cuenta, hay que resolverlos acá.
  // Esta línea sirve para obtener «isDark» con el hook «useResolvedTheme».
  const isDark = useResolvedTheme() === "dark"
  // Esta línea sirve para elegir el color de la cuadrícula según el tema.
  const gridStroke = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"
  // Esta línea sirve para elegir el color de los ejes según el tema.
  const axisStroke = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)"
  // Esta línea sirve para elegir el color de las marcas según el tema.
  const tickColor = isDark ? "#9AA6B2" : "#5B6670"
  // Esta línea sirve para elegir el color del cursor según el tema.
  const cursorFill = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"
  // Esta línea sirve para elegir el color de las barras según el tema.
  const barColor = isDark ? "#00B8D9" : "#0093AD"

  // Esta línea sirve para obtener «data, isLoading» con el hook «useQuery».
  const { data, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["stats", "volume", range]».
    queryKey: ["stats", "volume", range],
    // Esta línea sirve para pedir a la API el volumen del rango elegido.
    queryFn: () => api.get<MuscleVolume[]>(`/stats/volume?range=${range}`),
  })

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «sank-surface rounded-2 p-4».
    <div className="sank-surface rounded-2 p-4">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex flex-wrap align-items-center just». */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-1">
        {/* Esta línea sirve para mostrar el título de la gráfica. */}
        <h2 className="sank-eyebrow mb-0">Volumen por grupo muscular</h2>
        {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex align-items-center gap-2». */}
        <div className="d-flex align-items-center gap-2">
          {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex gap-1». */}
          <div className="d-flex gap-1">
            {/* Esta línea sirve para recorrer «RANGES» y mostrar un bloque por elemento. */}
            {RANGES.map((r) => (
              // Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas.
              <button
                // Esta línea sirve para identificar el elemento de la lista con «r.value}».
                key={r.value}
                // Esta línea sirve para asignar el manejador del evento «onClick».
                onClick={() => setRange(r.value)}
                // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
                className={cn(
                  // Esta línea sirve para aplicar las clases base del botón de rango.
                  "btn btn-sm rounded-1 border-0",
                  // Esta línea sirve para resaltar el botón del rango activo.
                  range === r.value ? "btn-primary" : "sank-ghost-btn bg-transparent"
                )}
              >
                {/* Esta línea sirve para mostrar el valor «r.label». */}
                {r.label}
              </button>
            ))}
          </div>
          {/* Esta línea sirve para abrir el botón que alterna entre gráfica y tabla. */}
          <button onClick={() => setShowTable((v) => !v)} className="btn btn-sm sank-ghost-btn border-0 bg-transparent">
            {/* Esta línea sirve para mostrar el texto según la vista actual. */}
            {showTable ? "Ver gráfica" : "Ver tabla"}
          </button>
        </div>
      </div>

      {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-3». */}
      <div className="mt-3">
        {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
        {isLoading && <Skeleton style={{ height: 260, width: "100%" }} />}

        {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && data?.length === 0». */}
        {!isLoading && data?.length === 0 && (
          // Esta línea sirve para abrir el elemento «p» con las clases «py-5 text-center small text-body-seconda».
          <p className="py-5 text-center small text-body-secondary mb-0">
            {/* Esta línea sirve para mostrar el texto «Sin entrenamientos registrados en este rango todavía.». */}
            Sin entrenamientos registrados en este rango todavía.
          </p>
        )}

        {/* Esta línea sirve para mostrar la gráfica solo si hay datos y no se pidió la tabla. */}
        {!isLoading && data && data.length > 0 && !showTable && (
          // Esta línea sirve para abrir el componente «ResponsiveContainer».
          <ResponsiveContainer key={range} width="100%" height={260} debounce={200}>
            {/* Esta línea sirve para abrir el componente «BarChart». */}
            <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              {/* Esta línea sirve para abrir el componente «CartesianGrid». */}
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              {/* Esta línea sirve para abrir el elemento «XAxis» con sus atributos en varias líneas. */}
              <XAxis
                // Esta línea sirve para definir el atributo «dataKey» con el valor «muscle_group».
                dataKey="muscle_group"
                // Esta línea sirve para pasar la propiedad «tick» con el valor «{ fill: tickColor, fontSize: 12 }}».
                tick={{ fill: tickColor, fontSize: 12 }}
                // Esta línea sirve para pasar la propiedad «tickLine» con el valor «false}».
                tickLine={false}
                // Esta línea sirve para pasar la propiedad «axisLine» con el valor «{ stroke: axisStroke }}».
                axisLine={{ stroke: axisStroke }}
              />
              {/* Esta línea sirve para abrir el componente «YAxis». */}
              <YAxis tick={{ fill: tickColor, fontSize: 12 }} tickLine={false} axisLine={false} width={56} />
              {/* Esta línea sirve para mostrar el componente «Tooltip». */}
              <Tooltip content={<ChartTooltip />} cursor={{ fill: cursorFill }} />
              {/* Esta línea sirve para abrir el elemento «Bar» con sus atributos en varias líneas. */}
              <Bar
                // Esta línea sirve para definir el atributo «dataKey» con el valor «volume_kg».
                dataKey="volume_kg"
                // Esta línea sirve para pasar la propiedad «fill» con el valor «barColor}».
                fill={barColor}
                // Esta línea sirve para pasar la propiedad «radius» con el valor «[2, 2, 0, 0]}».
                radius={[2, 2, 0, 0]}
                // Esta línea sirve para pasar la propiedad «maxBarSize» con el valor «44}».
                maxBarSize={44}
                // Esta línea sirve para activar la animación de las barras.
                isAnimationActive
                // Esta línea sirve para pasar la propiedad «animationDuration» con el valor «650}».
                animationDuration={650}
                // Esta línea sirve para definir el atributo «animationEasing» con el valor «ease-out».
                animationEasing="ease-out"
              />
            </BarChart>
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
                  {/* Esta línea sirve para mostrar el encabezado de grupo muscular. */}
                  <th className="small text-body-secondary fw-medium">Grupo muscular</th>
                  {/* Esta línea sirve para mostrar el encabezado de volumen. */}
                  <th className="small text-body-secondary fw-medium">Volumen</th>
                </tr>
              </thead>
              {/* Esta línea sirve para abrir el elemento «tbody». */}
              <tbody>
                {/* Esta línea sirve para recorrer «data» y mostrar un bloque por elemento. */}
                {data.map((row) => (
                  // Esta línea sirve para abrir el elemento «tr».
                  <tr key={row.muscle_group}>
                    {/* Esta línea sirve para mostrar el grupo muscular de la fila. */}
                    <td className="small">{row.muscle_group}</td>
                    {/* Esta línea sirve para mostrar el volumen de la fila. */}
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
