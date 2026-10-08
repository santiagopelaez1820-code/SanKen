// Esta línea sirve para importar «useMemo, useRef, useState» desde «react».
import { useMemo, useRef, useState } from "react"
// Esta línea sirve para importar «useQuery, useQueryClient» desde «@tanstack/react-query».
import { useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar los tipos «CalendarEvent, CalendarResponse» desde «@sanken/core».
import type { CalendarEvent, CalendarResponse } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"
// Esta línea sirve para importar «monthGrid, toDateKey, toMonthKey» desde «@/lib/calendar-grid».
import { monthGrid, toDateKey, toMonthKey } from "@/lib/calendar-grid"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"
// Esta línea sirve para importar «TutorialOverlay» desde «@/components/tutorial/TutorialOverlay».
import { TutorialOverlay } from "@/components/tutorial/TutorialOverlay"
// Esta línea sirve para importar «useTutorial» desde «@/hooks/use-tutorial».
import { useTutorial } from "@/hooks/use-tutorial"

// Esta línea sirve para declarar «WEEKDAY_LABELS» con el valor «["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]».
const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

// Esta línea sirve para declarar «EVENT_DOT» con el valor «{».
const EVENT_DOT: Record<CalendarEvent["type"], string> = {
  // Esta línea sirve para declarar la propiedad «workout_completed» con el valor o tipo «"bg-primary"».
  workout_completed: "bg-primary",
  // Esta línea sirve para declarar la propiedad «workout_planned» con el valor o tipo «"bg-muted-foreground"».
  workout_planned: "bg-muted-foreground",
  // Esta línea sirve para declarar la propiedad «reminder» con el valor o tipo «"bg-warning"».
  reminder: "bg-warning",
}

// Esta línea sirve para declarar la función «CalendarPage».
export function CalendarPage() {
  // Esta línea sirve para crear el estado «monthStart» y su función «setMonthStart».
  const [monthStart, setMonthStart] = useState(() => {
    // Esta línea sirve para extraer «o» de «new Date()».
    const now = new Date()
    // Esta línea sirve para devolver «new Date(now.getFullYear(), now.getMonth(), 1)».
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  // Esta línea sirve para crear el estado «selectedDate» y su función «setSelectedDate».
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  // Esta línea sirve para crear el estado «reminderTitle» y su función «setReminderTitle».
  const [reminderTitle, setReminderTitle] = useState("")
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para obtener «userId» con el hook «useAuthStore».
  const userId = useAuthStore((s) => s.user?.id)

  // Esta línea sirve para extraer «onthKe» de «toMonthKey(monthStart)».
  const monthKey = toMonthKey(monthStart)

  // Esta línea sirve para obtener «data, isLoading» con el hook «useQuery».
  const { data, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["calendar", monthKey]».
    queryKey: ["calendar", monthKey],
    // Esta línea sirve para pedir a la API los datos de «/calendar?month=${monthKey}».
    queryFn: () => api.get<CalendarResponse>(`/calendar?month=${monthKey}`),
  })

  // Esta línea sirve para obtener «eventsByDate» con el hook «useMemo».
  const eventsByDate = useMemo(() => {
    // Esta línea sirve para extraer «a» de «new Map<string, CalendarEvent[]>()».
    const map = new Map<string, CalendarEvent[]>()
    // Esta línea sirve para recorrer los elementos con «const event of data?.events ?? []».
    for (const event of data?.events ?? []) {
      // Esta línea sirve para extraer «is» de «map.get(event.event_date) ?? []».
      const list = map.get(event.event_date) ?? []
      // Esta línea sirve para llamar a «list.push» con «event».
      list.push(event)
      // Esta línea sirve para llamar a «map.set» con «event.event_date, list».
      map.set(event.event_date, list)
    }
    // Esta línea sirve para devolver «map».
    return map
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian los datos.
  }, [data])

  // Esta línea sirve para obtener «grid» con el hook «useMemo».
  const grid = useMemo(() => monthGrid(monthStart), [monthStart])
  // Esta línea sirve para extraer «odayKe» de «toDateKey(new Date())».
  const todayKey = toDateKey(new Date())

  // Esta línea sirve para extraer «ddReminde» de «async () => {».
  const addReminder = async () => {
    // Esta línea sirve para salir de la función si «!selectedDate || !reminderTitle.trim()».
    if (!selectedDate || !reminderTitle.trim()) return
    // Esta línea sirve para esperar el resultado de «api.post».
    await api.post("/calendar/reminders", { event_date: selectedDate, title: reminderTitle.trim() })
    // Esta línea sirve para llamar a «setReminderTitle» con «""».
    setReminderTitle("")
    // Esta línea sirve para llamar a «queryClient.invalidateQueries» con «{ queryKey: ["calendar"] }».
    queryClient.invalidateQueries({ queryKey: ["calendar"] })
  }

  // Esta línea sirve para extraer «eleteReminde» de «async (id: number) => {».
  const deleteReminder = async (id: number) => {
    // Esta línea sirve para esperar el resultado de «api.delete».
    await api.delete(`/calendar/reminders/${id}`)
    // Esta línea sirve para llamar a «queryClient.invalidateQueries» con «{ queryKey: ["calendar"] }».
    queryClient.invalidateQueries({ queryKey: ["calendar"] })
  }

  // Esta línea sirve para extraer «electedEvent» de «selectedDate ? (eventsByDate.get(selecte».
  const selectedEvents = selectedDate ? (eventsByDate.get(selectedDate) ?? []) : []

  // Esta línea sirve para crear la referencia «monthNavRef».
  const monthNavRef = useRef<HTMLDivElement>(null)
  // Esta línea sirve para crear la referencia «gridRef».
  const gridRef = useRef<HTMLDivElement>(null)
  // Esta línea sirve para obtener «tutorial» con el hook «useTutorial».
  const tutorial = useTutorial(
    // Esta línea sirve para incluir el texto o las clases «calendario…».
    "calendario",
    [
      {
        // Esta línea sirve para declarar la propiedad «target» con el valor o tipo «monthNavRef».
        target: monthNavRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"Navegá tu historial"».
        title: "Navegá tu historial",
        // Esta línea sirve para definir la propiedad «description» con «Movete entre meses para ver tus entrenam…».
        description: "Movete entre meses para ver tus entrenamientos pasados y los que tenés planeados.",
      },
      {
        // Esta línea sirve para declarar la propiedad «target» con el valor o tipo «gridRef».
        target: gridRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"Qué significa cada punto"».
        title: "Qué significa cada punto",
        // Esta línea sirve para definir la propiedad «description» con «Los puntos de color marcan entrenamiento…».
        description: "Los puntos de color marcan entrenamientos completados, planeados y tus recordatorios.",
      },
      {
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"Agregá tus propios recordatorios"».
        title: "Agregá tus propios recordatorios",
        // Esta línea sirve para definir la propiedad «description» con «Hacé clic en cualquier día para ver el d…».
        description: "Hacé clic en cualquier día para ver el detalle y sumar un recordatorio personal.",
      },
    ],
    // Esta línea sirve para indicar que la carga ya terminó.
    !isLoading,
    // Esta línea sirve para pasar el id del usuario.
    userId
  )

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-lg flex-col gap-6». */}
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        {/* Esta línea sirve para mostrar el texto «Calendario» dentro de un «h1». */}
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Calendario</h1>

        {/* Esta línea sirve para abrir el elemento «div». */}
        <div ref={monthNavRef} className="flex items-center justify-between">
          {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
          <Button
            // Esta línea sirve para definir el atributo «variant» con el valor «outline».
            variant="outline"
            // Esta línea sirve para definir el atributo «size» con el valor «sm».
            size="sm"
            // Esta línea sirve para asignar el manejador del evento «onClick».
            onClick={() => setMonthStart((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
          >
            {/* Esta línea sirve para mostrar el contenido dinámico «←». */}
            ←
          </Button>
          {/* Esta línea sirve para abrir el elemento «p» con las clases «font-medium». */}
          <p className="font-medium">
            {/* Esta línea sirve para mostrar el nombre del mes y el año. */}
            {monthStart.toLocaleDateString("es-AR", { month: "long", year: "numeric" })}
          </p>
          {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
          <Button
            // Esta línea sirve para definir el atributo «variant» con el valor «outline».
            variant="outline"
            // Esta línea sirve para definir el atributo «size» con el valor «sm».
            size="sm"
            // Esta línea sirve para asignar el manejador del evento «onClick».
            onClick={() => setMonthStart((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
          >
            {/* Esta línea sirve para mostrar el contenido dinámico «→». */}
            →
          </Button>
        </div>

        {/* Esta línea sirve para abrir el elemento «div» con las clases «grid grid-cols-7 gap-1 text-center text-». */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
          {/* Esta línea sirve para recorrer «WEEKDAY_LABELS» y mostrar un bloque por elemento. */}
          {WEEKDAY_LABELS.map((label) => (
            // Esta línea sirve para mostrar el valor «label» dentro de un «span».
            <span key={label}>{label}</span>
          ))}
        </div>

        {/* Esta línea sirve para abrir el elemento «div». */}
        <div ref={gridRef} className="grid grid-cols-7 gap-1">
          {/* Esta línea sirve para recorrer «grid» y calcular qué mostrar por elemento. */}
          {grid.map((date) => {
            // Esta línea sirve para extraer «ateKe» de «toDateKey(date)».
            const dateKey = toDateKey(date)
            // Esta línea sirve para extraer «ayEvent» de «eventsByDate.get(dateKey) ?? []».
            const dayEvents = eventsByDate.get(dateKey) ?? []
            // Esta línea sirve para extraer «nMont» de «date.getMonth() === monthStart.getMonth(».
            const inMonth = date.getMonth() === monthStart.getMonth()

            // Esta línea sirve para devolver la interfaz del componente.
            return (
              // Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas.
              <button
                // Esta línea sirve para identificar el elemento de la lista con «dateKey}».
                key={dateKey}
                // Esta línea sirve para asignar el manejador del evento «onClick».
                onClick={() => setSelectedDate(dateKey)}
                // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
                className={cn(
                  // Esta línea sirve para incluir el texto o las clases «flex aspect-square flex-col items-center just…».
                  "flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border text-sm",
                  // Esta línea sirve para elegir el borde según si el día es del mes mostrado.
                  inMonth ? "border-border" : "border-transparent text-muted-foreground/40",
                  // Esta línea sirve para resaltar el día de hoy.
                  dateKey === todayKey && "border-primary",
                  // Esta línea sirve para resaltar el día seleccionado.
                  dateKey === selectedDate && "bg-primary/10"
                )}
              >
                {/* Esta línea sirve para mostrar el valor «date.getDate()» dentro de un «span». */}
                <span>{date.getDate()}</span>
                {/* Esta línea sirve para mostrar el bloque solo si «dayEvents.length > 0». */}
                {dayEvents.length > 0 && (
                  // Esta línea sirve para abrir el elemento «span» con las clases «flex gap-0.5».
                  <span className="flex gap-0.5">
                    {/* Esta línea sirve para recorrer «dayEvents.slice(0, 3)» y mostrar un bloque por elemento. */}
                    {dayEvents.slice(0, 3).map((event, i) => (
                      // Esta línea sirve para abrir el elemento «span».
                      <span key={i} className={cn("h-1.5 w-1.5 rounded-full", EVENT_DOT[event.type])} />
                    ))}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
        {isLoading && <Skeleton className="h-20 w-full" />}

        {/* Esta línea sirve para mostrar el bloque solo si «selectedDate». */}
        {selectedDate && (
          // Esta línea sirve para abrir el elemento «div» con las clases «rounded-xl border border-border bg-card ».
          <div className="rounded-xl border border-border bg-card p-5">
            {/* Esta línea sirve para mostrar el valor «selectedDate» dentro de un «h2». */}
            <h2 className="font-medium">{selectedDate}</h2>

            {/* Esta línea sirve para mostrar el bloque solo si «selectedEvents.length === 0». */}
            {selectedEvents.length === 0 && (
              // Esta línea sirve para mostrar el texto «Sin eventos este día.» dentro de un «p».
              <p className="mt-2 text-sm text-muted-foreground">Sin eventos este día.</p>
            )}

            {/* Esta línea sirve para abrir el elemento «ul» con las clases «mt-2 flex flex-col gap-2». */}
            <ul className="mt-2 flex flex-col gap-2">
              {/* Esta línea sirve para recorrer «selectedEvents» y mostrar un bloque por elemento. */}
              {selectedEvents.map((event, i) => (
                // Esta línea sirve para abrir el elemento «li».
                <li key={i} className="flex items-center justify-between text-sm">
                  {/* Esta línea sirve para abrir el elemento «span» con las clases «flex flex-col gap-0.5». */}
                  <span className="flex flex-col gap-0.5">
                    {/* Esta línea sirve para abrir el elemento «span» con las clases «flex items-center gap-2». */}
                    <span className="flex items-center gap-2">
                      {/* Esta línea sirve para abrir el elemento «span». */}
                      <span className={cn("h-1.5 w-1.5 rounded-full", EVENT_DOT[event.type])} />
                      {/* Esta línea sirve para mostrar el valor «event.title». */}
                      {event.title}
                      {/* Esta línea sirve para mostrar el bloque solo si «event.type === "workout_planned"». */}
                      {event.type === "workout_planned" && (
                        // Esta línea sirve para mostrar el texto «(sugerido para hoy)» dentro de un «span».
                        <span className="text-xs text-muted-foreground">(sugerido para hoy)</span>
                      )}
                    </span>
                    {/* Esta línea sirve para mostrar los grupos musculares solo en eventos de entrenamiento con datos. */}
                    {event.type !== "reminder" && event.muscle_groups.length > 0 && (
                      // Esta línea sirve para abrir el elemento «span» con las clases «pl-3.5 text-xs text-muted-foreground».
                      <span className="pl-3.5 text-xs text-muted-foreground">
                        {/* Esta línea sirve para mostrar el contenido dinámico «{event.muscle_groups.join(" + ")}». */}
                        {event.muscle_groups.join(" + ")}
                      </span>
                    )}
                  </span>
                  {/* Esta línea sirve para mostrar el bloque solo si «event.type === "reminder"». */}
                  {event.type === "reminder" && (
                    // Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas.
                    <button
                      // Esta línea sirve para asignar el manejador del evento «onClick».
                      onClick={() => deleteReminder(event.id)}
                      // Esta línea sirve para aplicar las clases de estilo «text-xs text-muted-foreground hover:text-dest».
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      {/* Esta línea sirve para mostrar el texto «Eliminar». */}
                      Eliminar
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-4 flex gap-2 border-t border-border p». */}
            <div className="mt-4 flex gap-2 border-t border-border pt-4">
              {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
              <input
                // Esta línea sirve para definir el atributo «placeholder» con el valor «Nuevo recordatorio…».
                placeholder="Nuevo recordatorio…"
                // Esta línea sirve para pasar la propiedad «value» con el valor «reminderTitle}».
                value={reminderTitle}
                // Esta línea sirve para asignar el manejador del evento «onChange».
                onChange={(e) => setReminderTitle(e.target.value)}
                // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg border border-input bg-back».
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              {/* Esta línea sirve para abrir el componente «Button». */}
              <Button size="sm" onClick={addReminder} disabled={!reminderTitle.trim()}>
                {/* Esta línea sirve para mostrar el texto «Agregar». */}
                Agregar
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Esta línea sirve para abrir el componente «TutorialOverlay». */}
      <TutorialOverlay tutorial={tutorial} />
    </main>
  )
}
