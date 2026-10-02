import { useState } from "react"
import { Form } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
  CHECKIN_MOODS,
  CHECKIN_TOPICS,
  SUPPORT_TICKET_STATUSES,
  SUPPORT_TICKET_TYPES,
  type AdminSupportTicket,
  type SupportStats,
} from "@sanken/core"
import { api } from "@/lib/api"
import { formatSupportDate, PRIORITY_VARIANT, STATUS_VARIANT, SUPPORT_QUERY_KEYS, supportStrings } from "@/lib/support"
import { Button } from "@/components/ui/button"
import { SankBadge } from "@/components/ui/SankBadge"
import { Skeleton } from "@/components/ui/skeleton"
import { StatTile } from "@/components/dashboard/StatTile"

const t = supportStrings
const s = supportStrings.admin

interface Filters {
  status: string
  type: string
  q: string
  user: string
  from: string
  to: string
}

const EMPTY_FILTERS: Filters = { status: "awaiting", type: "", q: "", user: "", from: "", to: "" }

function StatsPanel({ stats }: { stats: SupportStats }) {
  const hours = (value: number | null) => (value === null ? s.stats.noData : s.stats.hours(value))
  const totalMoods = Object.values(stats.checkins.moods).reduce((a, b) => a + (b ?? 0), 0)

  return (
    <section aria-label={s.title} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile label={s.stats.open} value={String(stats.tickets.open)} />
        <StatTile label={s.stats.inReview} value={String(stats.tickets.in_review)} />
        <StatTile label={s.stats.awaiting} value={String(stats.tickets.awaiting_staff)} />
        <StatTile label={s.stats.resolved} value={String(stats.tickets.resolved)} />
        <StatTile label={s.stats.thisWeek} value={String(stats.tickets.this_week)} />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 text-sm">
          <p className="m-0 mb-2 font-semibold">{s.stats.byType}</p>
          <ul className="m-0 list-none p-0">
            {SUPPORT_TICKET_TYPES.map((type) => (
              <li key={type} className="flex justify-between">
                <span className="text-muted-foreground">{t.types[type]}</span>
                <span>{stats.tickets.by_type[type] ?? 0}</span>
              </li>
            ))}
          </ul>
          <p className="m-0 mt-3 text-xs text-muted-foreground">
            {s.stats.avgFirstResponse}: {hours(stats.tickets.avg_first_response_hours)} · {s.stats.avgResolution}:{" "}
            {hours(stats.tickets.avg_resolution_hours)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-sm md:col-span-2">
          <p className="m-0 mb-2 font-semibold">{s.stats.checkinsTitle}</p>
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={s.stats.checkinsTitle}>
            <table className="w-full min-w-[28rem] text-left">
              <thead className="text-xs text-muted-foreground">
                <tr>
                  <th scope="col" className="px-2 py-1 font-medium">{s.stats.week}</th>
                  <th scope="col" className="px-2 py-1 font-medium">{s.stats.offered}</th>
                  <th scope="col" className="px-2 py-1 font-medium">{s.stats.answered}</th>
                  <th scope="col" className="px-2 py-1 font-medium">{s.stats.postponed}</th>
                  <th scope="col" className="px-2 py-1 font-medium">{s.stats.ignored}</th>
                  <th scope="col" className="px-2 py-1 font-medium">{s.stats.responseRate}</th>
                </tr>
              </thead>
              <tbody>
                {stats.checkins.weeks.map((week) => (
                  <tr key={week.week}>
                    <th scope="row" className="px-2 py-1 font-medium whitespace-nowrap">
                      {week.week}
                    </th>
                    <td className="px-2 py-1">{week.offered}</td>
                    <td className="px-2 py-1">{week.answered}</td>
                    <td className="px-2 py-1">{week.postponed}</td>
                    <td className="px-2 py-1">{week.ignored ?? "—"}</td>
                    <td className="px-2 py-1">{week.response_rate === null ? "—" : `${week.response_rate}%`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="m-0 text-xs font-semibold text-muted-foreground">{s.stats.moods}</p>
              {totalMoods === 0 ? (
                <p className="m-0 text-xs text-muted-foreground">{s.stats.noData}</p>
              ) : (
                <ul className="m-0 list-none p-0">
                  {CHECKIN_MOODS.map((mood) => (
                    <li key={mood}>
                      <span aria-hidden="true">{t.moods[mood].emoji}</span> {t.moods[mood].label}: {stats.checkins.moods[mood] ?? 0}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <p className="m-0 text-xs font-semibold text-muted-foreground">{s.stats.topics}</p>
              <ul className="m-0 list-none p-0">
                {CHECKIN_TOPICS.map((topic) => (
                  <li key={topic}>
                    {t.topics[topic]}: {stats.checkins.topics[topic] ?? 0}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** /admin/soporte — indicadores + listado filtrable de solicitudes (solo super_admin). */
export function AdminSupportPage() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [page, setPage] = useState(1)

  const params = new URLSearchParams({ page: String(page) })
  for (const [key, value] of Object.entries(filters)) if (value) params.set(key, value)

  const stats = useQuery({
    queryKey: [...SUPPORT_QUERY_KEYS.admin, "stats"],
    queryFn: () => api.get<SupportStats>("/admin/support/stats"),
  })

  const tickets = useQuery({
    queryKey: [...SUPPORT_QUERY_KEYS.admin, "tickets", params.toString()],
    queryFn: () => api.getWithMeta<AdminSupportTicket[]>(`/admin/support/tickets?${params}`),
  })
  const lastPage = (tickets.data?.meta?.last_page as number | undefined) ?? 1

  const setFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  return (
    <main className="px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div>
          <h1 className="fs-3 m-0 font-heading font-bold tracking-tight">{s.title}</h1>
          <p className="m-0 text-sm text-muted-foreground">{s.subtitle}</p>
        </div>

        {stats.isLoading && <Skeleton className="h-24 w-full" />}
        {stats.data && <StatsPanel stats={stats.data} />}

        <section className="flex flex-col gap-3" aria-label={s.title}>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Form.Control aria-label={s.search} placeholder={s.search} value={filters.q} onChange={(e) => setFilter("q", e.target.value)} className="lg:col-span-2" />
            <Form.Control aria-label={s.searchUser} placeholder={s.searchUser} value={filters.user} onChange={(e) => setFilter("user", e.target.value)} className="lg:col-span-2" />
            <Form.Select aria-label={t.statusLabel} value={filters.status} onChange={(e) => setFilter("status", e.target.value)}>
              <option value="awaiting">{s.awaiting}</option>
              <option value="all">{s.allStatuses}</option>
              {SUPPORT_TICKET_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {t.statuses[status]}
                </option>
              ))}
            </Form.Select>
            <Form.Select aria-label={t.typeLabel} value={filters.type} onChange={(e) => setFilter("type", e.target.value)}>
              <option value="">{s.allTypes}</option>
              {SUPPORT_TICKET_TYPES.map((type) => (
                <option key={type} value={type}>
                  {t.types[type]}
                </option>
              ))}
            </Form.Select>
            <Form.Control type="date" aria-label={s.from} title={s.from} value={filters.from} onChange={(e) => setFilter("from", e.target.value)} />
            <Form.Control type="date" aria-label={s.to} title={s.to} value={filters.to} onChange={(e) => setFilter("to", e.target.value)} />
          </div>

          {/* Celular: tarjetas (una tabla de 7 columnas no entra); desde sm, la tabla. */}
          <ul className="m-0 flex list-none flex-col gap-3 p-0 sm:hidden" aria-label={s.title}>
            {tickets.isLoading && <Skeleton className="h-20 w-full" />}
            {tickets.data?.data.length === 0 && <li className="text-sm text-muted-foreground">{s.empty}</li>}
            {tickets.data?.data.map((ticket) => (
              <li key={ticket.id}>
                <Link to={`/admin/soporte/${ticket.id}`} className="block rounded-xl border border-border bg-card p-4 text-foreground no-underline">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">#{ticket.id}</span>
                    <SankBadge variant="outline">{t.types[ticket.type]}</SankBadge>
                    <SankBadge variant={STATUS_VARIANT[ticket.status]}>{t.statuses[ticket.status]}</SankBadge>
                    <SankBadge variant={PRIORITY_VARIANT[ticket.priority]}>{t.priorities[ticket.priority]}</SankBadge>
                  </div>
                  <p className="m-0 mt-2 font-medium break-words">{ticket.subject}</p>
                  {ticket.source === "weekly_checkin" && <p className="m-0 text-xs text-muted-foreground">{t.fromCheckin}</p>}
                  <p className="m-0 mt-1 text-xs text-muted-foreground break-all">
                    {ticket.user?.name} · {ticket.user?.email}
                  </p>
                  <p className="m-0 text-xs text-muted-foreground">{formatSupportDate(ticket.last_message_at, true)}</p>
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto rounded-xl border border-border bg-card sm:block" tabIndex={0} role="region" aria-label={s.title}>
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead className="bg-muted/60 text-xs text-muted-foreground">
                <tr>
                  {Object.values(s.columns).map((label) => (
                    <th key={label} scope="col" className="px-3 py-2">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tickets.isLoading && (
                  <tr>
                    <td colSpan={7} className="p-3">
                      <Skeleton className="h-10 w-full" />
                    </td>
                  </tr>
                )}
                {tickets.data?.data.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-4 text-muted-foreground">
                      {s.empty}
                    </td>
                  </tr>
                )}
                {tickets.data?.data.map((ticket) => (
                  <tr key={ticket.id} className="border-t border-border align-top">
                    <td className="px-3 py-2">
                      <Link to={`/admin/soporte/${ticket.id}`}>#{ticket.id}</Link>
                    </td>
                    <td className="px-3 py-2">
                      <span className="block font-medium">{ticket.user?.name}</span>
                      <span className="text-xs text-muted-foreground">{ticket.user?.email}</span>
                    </td>
                    <td className="px-3 py-2">{t.types[ticket.type]}</td>
                    <td className="px-3 py-2">
                      <Link to={`/admin/soporte/${ticket.id}`} className="text-foreground">
                        {ticket.subject}
                      </Link>
                      {ticket.source === "weekly_checkin" && <span className="block text-xs text-muted-foreground">{t.fromCheckin}</span>}
                    </td>
                    <td className="px-3 py-2">
                      <SankBadge variant={STATUS_VARIANT[ticket.status]}>{t.statuses[ticket.status]}</SankBadge>
                    </td>
                    <td className="px-3 py-2">
                      <SankBadge variant={PRIORITY_VARIANT[ticket.priority]}>{t.priorities[ticket.priority]}</SankBadge>
                    </td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{formatSupportDate(ticket.last_message_at, true)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {lastPage > 1 && (
            <div className="flex items-center justify-end gap-2 text-sm">
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                ←
              </Button>
              <span>
                {page} / {lastPage}
              </span>
              <Button size="sm" variant="outline" disabled={page >= lastPage} onClick={() => setPage((p) => p + 1)}>
                →
              </Button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
