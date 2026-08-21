import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { CalendarEvent, CalendarResponse } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { monthGrid, toDateKey, toMonthKey } from "@/lib/calendar-grid"

const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

const EVENT_DOT: Record<CalendarEvent["type"], string> = {
  workout_completed: "bg-primary",
  workout_planned: "bg-muted-foreground",
  reminder: "bg-warning",
}

export function CalendarPage() {
  const [monthStart, setMonthStart] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [reminderTitle, setReminderTitle] = useState("")
  const queryClient = useQueryClient()

  const monthKey = toMonthKey(monthStart)

  const { data, isLoading } = useQuery({
    queryKey: ["calendar", monthKey],
    queryFn: () => api.get<CalendarResponse>(`/calendar?month=${monthKey}`),
  })

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const event of data?.events ?? []) {
      const list = map.get(event.event_date) ?? []
      list.push(event)
      map.set(event.event_date, list)
    }
    return map
  }, [data])

  const grid = useMemo(() => monthGrid(monthStart), [monthStart])
  const todayKey = toDateKey(new Date())

  const addReminder = async () => {
    if (!selectedDate || !reminderTitle.trim()) return
    await api.post("/calendar/reminders", { event_date: selectedDate, title: reminderTitle.trim() })
    setReminderTitle("")
    queryClient.invalidateQueries({ queryKey: ["calendar"] })
  }

  const deleteReminder = async (id: number) => {
    await api.delete(`/calendar/reminders/${id}`)
    queryClient.invalidateQueries({ queryKey: ["calendar"] })
  }

  const selectedEvents = selectedDate ? (eventsByDate.get(selectedDate) ?? []) : []

  return (
    <main className="min-h-svh bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-medium tracking-tight">Calendario</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard">Volver</Link>
          </Button>
        </header>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMonthStart((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
          >
            ←
          </Button>
          <p className="font-medium">
            {monthStart.toLocaleDateString("es-AR", { month: "long", year: "numeric" })}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMonthStart((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
          >
            →
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
          {WEEKDAY_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {grid.map((date) => {
            const dateKey = toDateKey(date)
            const dayEvents = eventsByDate.get(dateKey) ?? []
            const inMonth = date.getMonth() === monthStart.getMonth()

            return (
              <button
                key={dateKey}
                onClick={() => setSelectedDate(dateKey)}
                className={cn(
                  "flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border text-sm",
                  inMonth ? "border-border" : "border-transparent text-muted-foreground/40",
                  dateKey === todayKey && "border-primary",
                  dateKey === selectedDate && "bg-primary/10"
                )}
              >
                <span>{date.getDate()}</span>
                {dayEvents.length > 0 && (
                  <span className="flex gap-0.5">
                    {dayEvents.slice(0, 3).map((event, i) => (
                      <span key={i} className={cn("h-1.5 w-1.5 rounded-full", EVENT_DOT[event.type])} />
                    ))}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Cargando…</p>}

        {selectedDate && (
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-medium">{selectedDate}</h2>

            {selectedEvents.length === 0 && (
              <p className="mt-2 text-sm text-muted-foreground">Sin eventos este día.</p>
            )}

            <ul className="mt-2 flex flex-col gap-2">
              {selectedEvents.map((event, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-2">
                      <span className={cn("h-1.5 w-1.5 rounded-full", EVENT_DOT[event.type])} />
                      {event.title}
                      {event.type === "workout_planned" && (
                        <span className="text-xs text-muted-foreground">(sugerido para hoy)</span>
                      )}
                    </span>
                    {event.type !== "reminder" && event.muscle_groups.length > 0 && (
                      <span className="pl-3.5 text-xs text-muted-foreground">
                        {event.muscle_groups.join(" + ")}
                      </span>
                    )}
                  </span>
                  {event.type === "reminder" && (
                    <button
                      onClick={() => deleteReminder(event.id)}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      Eliminar
                    </button>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex gap-2 border-t border-border pt-4">
              <input
                placeholder="Nuevo recordatorio…"
                value={reminderTitle}
                onChange={(e) => setReminderTitle(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <Button size="sm" onClick={addReminder} disabled={!reminderTitle.trim()}>
                Agregar
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
