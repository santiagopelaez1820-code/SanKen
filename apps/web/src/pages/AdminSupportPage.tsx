// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «Form» desde «react-bootstrap».
import { Form } from "react-bootstrap"
// Esta línea sirve para importar «Link» desde «react-router-dom».
import { Link } from "react-router-dom"
// Esta línea sirve para importar «useQuery» desde «@tanstack/react-query».
import { useQuery } from "@tanstack/react-query"
// Esta línea sirve para abrir la importación de utilidades y tipos del núcleo.
import {
  // Esta línea sirve para incluir el valor «CHECKIN_MOODS» en la lista.
  CHECKIN_MOODS,
  // Esta línea sirve para incluir el valor «CHECKIN_TOPICS» en la lista.
  CHECKIN_TOPICS,
  // Esta línea sirve para incluir el valor «SUPPORT_TICKET_STATUSES» en la lista.
  SUPPORT_TICKET_STATUSES,
  // Esta línea sirve para incluir el valor «SUPPORT_TICKET_TYPES» en la lista.
  SUPPORT_TICKET_TYPES,
  // Esta línea sirve para importar el tipo «AdminSupportTicket».
  type AdminSupportTicket,
  // Esta línea sirve para importar el tipo «SupportStats».
  type SupportStats,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar las utilidades y variantes de soporte.
import { formatSupportDate, PRIORITY_VARIANT, STATUS_VARIANT, SUPPORT_QUERY_KEYS, supportStrings } from "@/lib/support"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «SankBadge» desde «@/components/ui/SankBadge».
import { SankBadge } from "@/components/ui/SankBadge"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"
// Esta línea sirve para importar «StatTile» desde «@/components/dashboard/StatTile».
import { StatTile } from "@/components/dashboard/StatTile"

// Esta línea sirve para declarar «t» con el valor «supportStrings».
const t = supportStrings
// Esta línea sirve para declarar «s» con el valor «supportStrings.admin».
const s = supportStrings.admin

// Esta línea sirve para declarar la interfaz «Filters».
interface Filters {
  // Esta línea sirve para declarar la propiedad «status» con el valor o tipo «string».
  status: string
  // Esta línea sirve para declarar la propiedad «type» con el valor o tipo «string».
  type: string
  // Esta línea sirve para declarar la propiedad «q» con el valor o tipo «string».
  q: string
  // Esta línea sirve para declarar la propiedad «user» con el valor o tipo «string».
  user: string
  // Esta línea sirve para declarar la propiedad «from» con el valor o tipo «string».
  from: string
  // Esta línea sirve para declarar la propiedad «to» con el valor o tipo «string».
  to: string
}

// Esta línea sirve para extraer «MPTY_FILTERS: Filter» de «{ status: "awaiting", type: "", q: "", u».
const EMPTY_FILTERS: Filters = { status: "awaiting", type: "", q: "", user: "", from: "", to: "" }

// Esta línea sirve para declarar la función «StatsPanel».
function StatsPanel({ stats }: { stats: SupportStats }) {
  // Esta línea sirve para extraer «our» de «(value: number | null) => (value === nul».
  const hours = (value: number | null) => (value === null ? s.stats.noData : s.stats.hours(value))
  // Esta línea sirve para extraer «otalMood» de «Object.values(stats.checkins.moods).redu».
  const totalMoods = Object.values(stats.checkins.moods).reduce((a, b) => a + (b ?? 0), 0)

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «section».
    <section aria-label={s.title} className="flex flex-col gap-4">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «grid grid-cols-2 gap-3 sm:grid-cols-3 lg». */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {/* Esta línea sirve para abrir el componente «StatTile». */}
        <StatTile label={s.stats.open} value={String(stats.tickets.open)} />
        {/* Esta línea sirve para abrir el componente «StatTile». */}
        <StatTile label={s.stats.inReview} value={String(stats.tickets.in_review)} />
        {/* Esta línea sirve para abrir el componente «StatTile». */}
        <StatTile label={s.stats.awaiting} value={String(stats.tickets.awaiting_staff)} />
        {/* Esta línea sirve para abrir el componente «StatTile». */}
        <StatTile label={s.stats.resolved} value={String(stats.tickets.resolved)} />
        {/* Esta línea sirve para abrir el componente «StatTile». */}
        <StatTile label={s.stats.thisWeek} value={String(stats.tickets.this_week)} />
      </div>
      {/* Esta línea sirve para abrir el elemento «div» con las clases «grid grid-cols-1 gap-3 md:grid-cols-3». */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* Esta línea sirve para abrir el elemento «div» con las clases «rounded-xl border border-border bg-card ». */}
        <div className="rounded-xl border border-border bg-card p-4 text-sm">
          {/* Esta línea sirve para mostrar el valor «s.stats.byType» dentro de un «p». */}
          <p className="m-0 mb-2 font-semibold">{s.stats.byType}</p>
          {/* Esta línea sirve para abrir el elemento «ul» con las clases «m-0 list-none p-0». */}
          <ul className="m-0 list-none p-0">
            {/* Esta línea sirve para recorrer «SUPPORT_TICKET_TYPES» y mostrar un bloque por elemento. */}
            {SUPPORT_TICKET_TYPES.map((type) => (
              // Esta línea sirve para abrir el elemento «li».
              <li key={type} className="flex justify-between">
                {/* Esta línea sirve para mostrar el valor «t.types[type]» dentro de un «span». */}
                <span className="text-muted-foreground">{t.types[type]}</span>
                {/* Esta línea sirve para mostrar el valor «stats.tickets.by_type[type] ?? 0» dentro de un «span». */}
                <span>{stats.tickets.by_type[type] ?? 0}</span>
              </li>
            ))}
          </ul>
          {/* Esta línea sirve para abrir el elemento «p» con las clases «m-0 mt-3 text-xs text-muted-foreground». */}
          <p className="m-0 mt-3 text-xs text-muted-foreground">
            {/* Esta línea sirve para mostrar el promedio de primera respuesta. */}
            {s.stats.avgFirstResponse}: {hours(stats.tickets.avg_first_response_hours)} · {s.stats.avgResolution}:{" "}
            {/* Esta línea sirve para mostrar el contenido dinámico «{hours(stats.tickets.avg_resolution_hours)}». */}
            {hours(stats.tickets.avg_resolution_hours)}
          </p>
        </div>
        {/* Esta línea sirve para abrir el elemento «div» con las clases «rounded-xl border border-border bg-card ». */}
        <div className="rounded-xl border border-border bg-card p-4 text-sm md:col-span-2">
          {/* Esta línea sirve para mostrar el valor «s.stats.checkinsTitle» dentro de un «p». */}
          <p className="m-0 mb-2 font-semibold">{s.stats.checkinsTitle}</p>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «overflow-x-auto». */}
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={s.stats.checkinsTitle}>
            {/* Esta línea sirve para abrir el elemento «table» con las clases «w-full min-w-[28rem] text-left». */}
            <table className="w-full min-w-[28rem] text-left">
              {/* Esta línea sirve para abrir el elemento «thead» con las clases «text-xs text-muted-foreground». */}
              <thead className="text-xs text-muted-foreground">
                {/* Esta línea sirve para abrir el elemento «tr». */}
                <tr>
                  {/* Esta línea sirve para mostrar el valor «s.stats.week» dentro de un «th». */}
                  <th scope="col" className="px-2 py-1 font-medium">{s.stats.week}</th>
                  {/* Esta línea sirve para mostrar el valor «s.stats.offered» dentro de un «th». */}
                  <th scope="col" className="px-2 py-1 font-medium">{s.stats.offered}</th>
                  {/* Esta línea sirve para mostrar el valor «s.stats.answered» dentro de un «th». */}
                  <th scope="col" className="px-2 py-1 font-medium">{s.stats.answered}</th>
                  {/* Esta línea sirve para mostrar el valor «s.stats.postponed» dentro de un «th». */}
                  <th scope="col" className="px-2 py-1 font-medium">{s.stats.postponed}</th>
                  {/* Esta línea sirve para mostrar el valor «s.stats.ignored» dentro de un «th». */}
                  <th scope="col" className="px-2 py-1 font-medium">{s.stats.ignored}</th>
                  {/* Esta línea sirve para mostrar el valor «s.stats.responseRate» dentro de un «th». */}
                  <th scope="col" className="px-2 py-1 font-medium">{s.stats.responseRate}</th>
                </tr>
              </thead>
              {/* Esta línea sirve para abrir el elemento «tbody». */}
              <tbody>
                {/* Esta línea sirve para recorrer «stats.checkins.weeks» y mostrar un bloque por elemento. */}
                {stats.checkins.weeks.map((week) => (
                  // Esta línea sirve para abrir el elemento «tr».
                  <tr key={week.week}>
                    {/* Esta línea sirve para abrir el elemento «th». */}
                    <th scope="row" className="px-2 py-1 font-medium whitespace-nowrap">
                      {/* Esta línea sirve para mostrar el valor «week.week». */}
                      {week.week}
                    </th>
                    {/* Esta línea sirve para mostrar el valor «week.offered» dentro de un «td». */}
                    <td className="px-2 py-1">{week.offered}</td>
                    {/* Esta línea sirve para mostrar el valor «week.answered» dentro de un «td». */}
                    <td className="px-2 py-1">{week.answered}</td>
                    {/* Esta línea sirve para mostrar el valor «week.postponed» dentro de un «td». */}
                    <td className="px-2 py-1">{week.postponed}</td>
                    {/* Esta línea sirve para mostrar el valor «week.ignored ?? "—"» dentro de un «td». */}
                    <td className="px-2 py-1">{week.ignored ?? "—"}</td>
                    {/* Esta línea sirve para abrir el elemento «td» con sus propiedades. */}
                    <td className="px-2 py-1">{week.response_rate === null ? "—" : `${week.response_rate}%`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-3 grid gap-3 sm:grid-cols-2». */}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {/* Esta línea sirve para abrir el elemento «div». */}
            <div>
              {/* Esta línea sirve para mostrar el valor «s.stats.moods» dentro de un «p». */}
              <p className="m-0 text-xs font-semibold text-muted-foreground">{s.stats.moods}</p>
              {/* Esta línea sirve para elegir entre dos bloques según «totalMoods === 0». */}
              {totalMoods === 0 ? (
                // Esta línea sirve para mostrar el valor «s.stats.noData» dentro de un «p».
                <p className="m-0 text-xs text-muted-foreground">{s.stats.noData}</p>
              // Esta línea sirve para mostrar el bloque alternativo.
              ) : (
                // Esta línea sirve para abrir el elemento «ul» con las clases «m-0 list-none p-0».
                <ul className="m-0 list-none p-0">
                  {/* Esta línea sirve para recorrer «CHECKIN_MOODS» y mostrar un bloque por elemento. */}
                  {CHECKIN_MOODS.map((mood) => (
                    // Esta línea sirve para abrir el elemento «li».
                    <li key={mood}>
                      {/* Esta línea sirve para mostrar el emoji, la etiqueta y el conteo del ánimo. */}
                      <span aria-hidden="true">{t.moods[mood].emoji}</span> {t.moods[mood].label}: {stats.checkins.moods[mood] ?? 0}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Esta línea sirve para abrir el elemento «div». */}
            <div>
              {/* Esta línea sirve para mostrar el valor «s.stats.topics» dentro de un «p». */}
              <p className="m-0 text-xs font-semibold text-muted-foreground">{s.stats.topics}</p>
              {/* Esta línea sirve para abrir el elemento «ul» con las clases «m-0 list-none p-0». */}
              <ul className="m-0 list-none p-0">
                {/* Esta línea sirve para recorrer «CHECKIN_TOPICS» y mostrar un bloque por elemento. */}
                {CHECKIN_TOPICS.map((topic) => (
                  // Esta línea sirve para abrir el elemento «li».
                  <li key={topic}>
                    {/* Esta línea sirve para mostrar el contenido dinámico «{t.topics[topic]}: {stats.checkins.topics[topic] ?? 0}». */}
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
// Esta línea sirve para declarar la función «AdminSupportPage».
export function AdminSupportPage() {
  // Esta línea sirve para crear el estado «filters» y su función «setFilters».
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  // Esta línea sirve para crear el estado «page» y su función «setPage».
  const [page, setPage] = useState(1)

  // Esta línea sirve para extraer «aram» de «new URLSearchParams({ page: String(page)».
  const params = new URLSearchParams({ page: String(page) })
  // Esta línea sirve para agregar cada filtro con valor a los parámetros de la URL.
  for (const [key, value] of Object.entries(filters)) if (value) params.set(key, value)

  // Esta línea sirve para obtener «stats» con el hook «useQuery».
  const stats = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «[...SUPPORT_QUERY_KEYS.admin, "stats"]».
    queryKey: [...SUPPORT_QUERY_KEYS.admin, "stats"],
    // Esta línea sirve para pedir a la API los datos de «/admin/support/stats».
    queryFn: () => api.get<SupportStats>("/admin/support/stats"),
  })

  // Esta línea sirve para obtener «tickets» con el hook «useQuery».
  const tickets = useQuery({
    // Esta línea sirve para definir la clave de caché con los filtros aplicados.
    queryKey: [...SUPPORT_QUERY_KEYS.admin, "tickets", params.toString()],
    // Esta línea sirve para pedir a la API los tickets con los filtros.
    queryFn: () => api.getWithMeta<AdminSupportTicket[]>(`/admin/support/tickets?${params}`),
  })
  // Esta línea sirve para extraer «astPag» de «(tickets.data?.meta?.last_page as number».
  const lastPage = (tickets.data?.meta?.last_page as number | undefined) ?? 1

  // Esta línea sirve para extraer «etFilte» de «(key: keyof Filters, value: string) => {».
  const setFilter = (key: keyof Filters, value: string) => {
    // Esta línea sirve para llamar a «setFilters» con «(prev) => ({ ...prev, [key]: value })».
    setFilters((prev) => ({ ...prev, [key]: value }))
    // Esta línea sirve para llamar a «setPage» con «1».
    setPage(1)
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-8 sm:px-6».
    <main className="px-4 py-8 sm:px-6">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-6xl flex-col gap-6». */}
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        {/* Esta línea sirve para abrir el elemento «div». */}
        <div>
          {/* Esta línea sirve para mostrar el valor «s.title» dentro de un «h1». */}
          <h1 className="fs-3 m-0 font-heading font-bold tracking-tight">{s.title}</h1>
          {/* Esta línea sirve para mostrar el valor «s.subtitle» dentro de un «p». */}
          <p className="m-0 text-sm text-muted-foreground">{s.subtitle}</p>
        </div>

        {/* Esta línea sirve para mostrar el elemento solo si «stats.isLoading». */}
        {stats.isLoading && <Skeleton className="h-24 w-full" />}
        {/* Esta línea sirve para mostrar el elemento solo si «stats.data». */}
        {stats.data && <StatsPanel stats={stats.data} />}

        {/* Esta línea sirve para abrir el elemento «section» con las clases «flex flex-col gap-3». */}
        <section className="flex flex-col gap-3" aria-label={s.title}>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «grid grid-cols-1 gap-2 sm:grid-cols-2 lg». */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {/* Esta línea sirve para mostrar el componente «Form.Control». */}
            <Form.Control aria-label={s.search} placeholder={s.search} value={filters.q} onChange={(e) => setFilter("q", e.target.value)} className="lg:col-span-2" />
            {/* Esta línea sirve para mostrar el componente «Form.Control». */}
            <Form.Control aria-label={s.searchUser} placeholder={s.searchUser} value={filters.user} onChange={(e) => setFilter("user", e.target.value)} className="lg:col-span-2" />
            {/* Esta línea sirve para abrir el componente «Form.Select» con sus propiedades. */}
            <Form.Select aria-label={t.statusLabel} value={filters.status} onChange={(e) => setFilter("status", e.target.value)}>
              {/* Esta línea sirve para mostrar el valor «s.awaiting» dentro de un «option». */}
              <option value="awaiting">{s.awaiting}</option>
              {/* Esta línea sirve para mostrar el valor «s.allStatuses» dentro de un «option». */}
              <option value="all">{s.allStatuses}</option>
              {/* Esta línea sirve para recorrer «SUPPORT_TICKET_STATUSES» y mostrar un bloque por elemento. */}
              {SUPPORT_TICKET_STATUSES.map((status) => (
                // Esta línea sirve para abrir el elemento «option».
                <option key={status} value={status}>
                  {/* Esta línea sirve para mostrar el contenido dinámico «{t.statuses[status]}». */}
                  {t.statuses[status]}
                </option>
              ))}
            </Form.Select>
            {/* Esta línea sirve para abrir el componente «Form.Select» con sus propiedades. */}
            <Form.Select aria-label={t.typeLabel} value={filters.type} onChange={(e) => setFilter("type", e.target.value)}>
              {/* Esta línea sirve para mostrar el valor «s.allTypes» dentro de un «option». */}
              <option value="">{s.allTypes}</option>
              {/* Esta línea sirve para recorrer «SUPPORT_TICKET_TYPES» y mostrar un bloque por elemento. */}
              {SUPPORT_TICKET_TYPES.map((type) => (
                // Esta línea sirve para abrir el elemento «option».
                <option key={type} value={type}>
                  {/* Esta línea sirve para mostrar el contenido dinámico «{t.types[type]}». */}
                  {t.types[type]}
                </option>
              ))}
            </Form.Select>
            {/* Esta línea sirve para mostrar el componente «Form.Control». */}
            <Form.Control type="date" aria-label={s.from} title={s.from} value={filters.from} onChange={(e) => setFilter("from", e.target.value)} />
            {/* Esta línea sirve para mostrar el componente «Form.Control». */}
            <Form.Control type="date" aria-label={s.to} title={s.to} value={filters.to} onChange={(e) => setFilter("to", e.target.value)} />
          </div>

          {/* Celular: tarjetas (una tabla de 7 columnas no entra); desde sm, la tabla. */}
          {/* Esta línea sirve para abrir el elemento «ul» con las clases «m-0 flex list-none flex-col gap-3 p-0 sm». */}
          <ul className="m-0 flex list-none flex-col gap-3 p-0 sm:hidden" aria-label={s.title}>
            {/* Esta línea sirve para mostrar el elemento solo si «tickets.isLoading». */}
            {tickets.isLoading && <Skeleton className="h-20 w-full" />}
            {/* Esta línea sirve para mostrar el elemento solo si «tickets.data?.data.length === 0». */}
            {tickets.data?.data.length === 0 && <li className="text-sm text-muted-foreground">{s.empty}</li>}
            {/* Esta línea sirve para recorrer «tickets.data?.data» y mostrar un bloque por elemento. */}
            {tickets.data?.data.map((ticket) => (
              // Esta línea sirve para abrir el elemento «li».
              <li key={ticket.id}>
                {/* Esta línea sirve para abrir el componente «Link». */}
                <Link to={`/admin/soporte/${ticket.id}`} className="block rounded-xl border border-border bg-card p-4 text-foreground no-underline">
                  {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-wrap items-center gap-2». */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Esta línea sirve para abrir el elemento «span» con sus propiedades. */}
                    <span className="text-xs text-muted-foreground">#{ticket.id}</span>
                    {/* Esta línea sirve para mostrar el valor «t.types[ticket.type]» dentro de «SankBadge». */}
                    <SankBadge variant="outline">{t.types[ticket.type]}</SankBadge>
                    {/* Esta línea sirve para mostrar el valor «t.statuses[ticket.status]» dentro de «SankBadge». */}
                    <SankBadge variant={STATUS_VARIANT[ticket.status]}>{t.statuses[ticket.status]}</SankBadge>
                    {/* Esta línea sirve para mostrar el valor «t.priorities[ticket.priority]» dentro de «SankBadge». */}
                    <SankBadge variant={PRIORITY_VARIANT[ticket.priority]}>{t.priorities[ticket.priority]}</SankBadge>
                  </div>
                  {/* Esta línea sirve para mostrar el valor «ticket.subject» dentro de un «p». */}
                  <p className="m-0 mt-2 font-medium break-words">{ticket.subject}</p>
                  {/* Esta línea sirve para mostrar el elemento solo si «ticket.source === "weekly_checkin"». */}
                  {ticket.source === "weekly_checkin" && <p className="m-0 text-xs text-muted-foreground">{t.fromCheckin}</p>}
                  {/* Esta línea sirve para abrir el elemento «p» con las clases «m-0 mt-1 text-xs text-muted-foreground b». */}
                  <p className="m-0 mt-1 text-xs text-muted-foreground break-all">
                    {/* Esta línea sirve para mostrar el contenido dinámico «{ticket.user?.name} · {ticket.user?.email}». */}
                    {ticket.user?.name} · {ticket.user?.email}
                  </p>
                  {/* Esta línea sirve para mostrar el valor «formatSupportDate(ticket.last_message_at, true)» dentro de un «p». */}
                  <p className="m-0 text-xs text-muted-foreground">{formatSupportDate(ticket.last_message_at, true)}</p>
                </Link>
              </li>
            ))}
          </ul>

          {/* Esta línea sirve para abrir el elemento «div» con las clases «hidden overflow-x-auto rounded-xl border». */}
          <div className="hidden overflow-x-auto rounded-xl border border-border bg-card sm:block" tabIndex={0} role="region" aria-label={s.title}>
            {/* Esta línea sirve para abrir el elemento «table» con las clases «w-full min-w-[48rem] text-left text-sm». */}
            <table className="w-full min-w-[48rem] text-left text-sm">
              {/* Esta línea sirve para abrir el elemento «thead» con las clases «bg-muted/60 text-xs text-muted-foregroun». */}
              <thead className="bg-muted/60 text-xs text-muted-foreground">
                {/* Esta línea sirve para abrir el elemento «tr». */}
                <tr>
                  {/* Esta línea sirve para recorrer «Object.values(s.columns)» y mostrar un bloque por elemento. */}
                  {Object.values(s.columns).map((label) => (
                    // Esta línea sirve para abrir el elemento «th».
                    <th key={label} scope="col" className="px-3 py-2">
                      {/* Esta línea sirve para mostrar el valor «label». */}
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              {/* Esta línea sirve para abrir el elemento «tbody». */}
              <tbody>
                {/* Esta línea sirve para mostrar el bloque solo si «tickets.isLoading». */}
                {tickets.isLoading && (
                  // Esta línea sirve para abrir el elemento «tr».
                  <tr>
                    {/* Esta línea sirve para abrir el elemento «td». */}
                    <td colSpan={7} className="p-3">
                      {/* Esta línea sirve para abrir el componente «Skeleton». */}
                      <Skeleton className="h-10 w-full" />
                    </td>
                  </tr>
                )}
                {/* Esta línea sirve para mostrar el bloque solo si «tickets.data?.data.length === 0». */}
                {tickets.data?.data.length === 0 && (
                  // Esta línea sirve para abrir el elemento «tr».
                  <tr>
                    {/* Esta línea sirve para abrir el elemento «td». */}
                    <td colSpan={7} className="p-4 text-muted-foreground">
                      {/* Esta línea sirve para mostrar el valor «s.empty». */}
                      {s.empty}
                    </td>
                  </tr>
                )}
                {/* Esta línea sirve para recorrer «tickets.data?.data» y mostrar un bloque por elemento. */}
                {tickets.data?.data.map((ticket) => (
                  // Esta línea sirve para abrir el elemento «tr».
                  <tr key={ticket.id} className="border-t border-border align-top">
                    {/* Esta línea sirve para abrir el elemento «td» con las clases «px-3 py-2». */}
                    <td className="px-3 py-2">
                      {/* Esta línea sirve para abrir el componente «Link» con sus propiedades. */}
                      <Link to={`/admin/soporte/${ticket.id}`}>#{ticket.id}</Link>
                    </td>
                    {/* Esta línea sirve para abrir el elemento «td» con las clases «px-3 py-2». */}
                    <td className="px-3 py-2">
                      {/* Esta línea sirve para mostrar el valor «ticket.user?.name» dentro de un «span». */}
                      <span className="block font-medium">{ticket.user?.name}</span>
                      {/* Esta línea sirve para mostrar el valor «ticket.user?.email» dentro de un «span». */}
                      <span className="text-xs text-muted-foreground">{ticket.user?.email}</span>
                    </td>
                    {/* Esta línea sirve para mostrar el valor «t.types[ticket.type]» dentro de un «td». */}
                    <td className="px-3 py-2">{t.types[ticket.type]}</td>
                    {/* Esta línea sirve para abrir el elemento «td» con las clases «px-3 py-2». */}
                    <td className="px-3 py-2">
                      {/* Esta línea sirve para abrir el componente «Link». */}
                      <Link to={`/admin/soporte/${ticket.id}`} className="text-foreground">
                        {/* Esta línea sirve para mostrar el valor «ticket.subject». */}
                        {ticket.subject}
                      </Link>
                      {/* Esta línea sirve para mostrar el elemento solo si «ticket.source === "weekly_checkin"». */}
                      {ticket.source === "weekly_checkin" && <span className="block text-xs text-muted-foreground">{t.fromCheckin}</span>}
                    </td>
                    {/* Esta línea sirve para abrir el elemento «td» con las clases «px-3 py-2». */}
                    <td className="px-3 py-2">
                      {/* Esta línea sirve para mostrar el valor «t.statuses[ticket.status]» dentro de «SankBadge». */}
                      <SankBadge variant={STATUS_VARIANT[ticket.status]}>{t.statuses[ticket.status]}</SankBadge>
                    </td>
                    {/* Esta línea sirve para abrir el elemento «td» con las clases «px-3 py-2». */}
                    <td className="px-3 py-2">
                      {/* Esta línea sirve para mostrar el valor «t.priorities[ticket.priority]» dentro de «SankBadge». */}
                      <SankBadge variant={PRIORITY_VARIANT[ticket.priority]}>{t.priorities[ticket.priority]}</SankBadge>
                    </td>
                    {/* Esta línea sirve para mostrar el valor «formatSupportDate(ticket.last_message_at, true)» dentro de un «td». */}
                    <td className="px-3 py-2 text-xs text-muted-foreground">{formatSupportDate(ticket.last_message_at, true)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Esta línea sirve para mostrar el bloque solo si «lastPage > 1». */}
          {lastPage > 1 && (
            // Esta línea sirve para abrir el elemento «div» con las clases «flex items-center justify-end gap-2 text».
            <div className="flex items-center justify-end gap-2 text-sm">
              {/* Esta línea sirve para abrir el componente «Button» con sus propiedades. */}
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                {/* Esta línea sirve para mostrar el contenido dinámico «←». */}
                ←
              </Button>
              {/* Esta línea sirve para abrir el elemento «span». */}
              <span>
                {/* Esta línea sirve para mostrar el contenido dinámico «{page} / {lastPage}». */}
                {page} / {lastPage}
              </span>
              {/* Esta línea sirve para abrir el componente «Button» con sus propiedades. */}
              <Button size="sm" variant="outline" disabled={page >= lastPage} onClick={() => setPage((p) => p + 1)}>
                {/* Esta línea sirve para mostrar el contenido dinámico «→». */}
                →
              </Button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
