// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from "react"
// Esta línea sirve para importar «Link, useParams» desde «react-router-dom».
import { Link, useParams } from "react-router-dom"
// Esta línea sirve para importar «useMutation, useQuery, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar la moneda, los tipos de pedido y de seguimiento.
import { formatCurrency, type AdminOrder, type OrderStatus, type OrderTrackingPayload } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «ORDER_STATUS_BADGE_VARIANT, ORDER_STATUS_LABELS, ORDER_STATUSES» desde «@/lib/order-status».
import { ORDER_STATUS_BADGE_VARIANT, ORDER_STATUS_LABELS, ORDER_STATUSES } from "@/lib/order-status"
// Esta línea sirve para importar «OrderTimeline» desde «@/components/admin/OrderTimeline».
import { OrderTimeline } from "@/components/admin/OrderTimeline"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «Badge» desde «@/components/ui/badge».
import { Badge } from "@/components/ui/badge"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar la interfaz «TrackingForm».
interface TrackingForm {
  // Esta línea sirve para declarar la propiedad «status» con el valor o tipo «OrderStatus».
  status: OrderStatus
  // Esta línea sirve para declarar la propiedad «tracking_number» con el valor o tipo «string».
  tracking_number: string
  // Esta línea sirve para declarar la propiedad «carrier» con el valor o tipo «string».
  carrier: string
  // Esta línea sirve para declarar la propiedad «customer_message» con el valor o tipo «string».
  customer_message: string
  // Esta línea sirve para declarar la propiedad «admin_notes» con el valor o tipo «string».
  admin_notes: string
}

// Esta línea sirve para declarar la función «buildForm».
function buildForm(order: AdminOrder): TrackingForm {
  // Esta línea sirve para devolver «{».
  return {
    // Esta línea sirve para declarar la propiedad «status» con el valor o tipo «order.status».
    status: order.status,
    // Esta línea sirve para declarar la propiedad «tracking_number» con el valor o tipo «order.tracking_number ?? ""».
    tracking_number: order.tracking_number ?? "",
    // Esta línea sirve para declarar la propiedad «carrier» con el valor o tipo «order.carrier ?? ""».
    carrier: order.carrier ?? "",
    // Esta línea sirve para declarar la propiedad «customer_message» con el valor o tipo «order.customer_message ?? ""».
    customer_message: order.customer_message ?? "",
    // Esta línea sirve para declarar la propiedad «admin_notes» con el valor o tipo «order.admin_notes ?? ""».
    admin_notes: order.admin_notes ?? "",
  }
}

/** El shape real de AuditLogEntry.changes (ver spatie/laravel-activitylog) es
 * `{attributes, old}` pero el tipo compartido lo deja como `unknown` — se
 * valida en runtime acá en vez de forzar el shape en @sanken/core. */
// Esta línea sirve para declarar la función «formatValue».
function formatValue(value: unknown): string {
  // Esta línea sirve para devolver un guion si el valor está vacío.
  if (value === null || value === undefined || value === "") return "—"
  // Esta línea sirve para devolver «JSON.stringify(value)» si «typeof value === "object"».
  if (typeof value === "object") return JSON.stringify(value)
  // Esta línea sirve para devolver «String(value)».
  return String(value)
}

// Esta línea sirve para declarar la función «ChangeList».
function ChangeList({ changes }: { changes: unknown }) {
  // Esta línea sirve para devolver null si «!changes || typeof changes !== "object"».
  if (!changes || typeof changes !== "object") return null
  // Esta línea sirve para tipar los cambios como atributos nuevos y valores anteriores.
  const c = changes as { attributes?: Record<string, unknown>; old?: Record<string, unknown> }
  // Esta línea sirve para devolver null si «!c.attributes || typeof c.attributes !== "object"».
  if (!c.attributes || typeof c.attributes !== "object") return null
  // Esta línea sirve para extraer «ey» de «Object.keys(c.attributes)».
  const keys = Object.keys(c.attributes)
  // Esta línea sirve para devolver null si «keys.length === 0».
  if (keys.length === 0) return null

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «ul» con las clases «mt-1 flex flex-col gap-0.5 text-xs text-».
    <ul className="mt-1 flex flex-col gap-0.5 text-xs text-muted-foreground">
      {/* Esta línea sirve para recorrer «keys» y mostrar un bloque por elemento. */}
      {keys.map((key) => (
        // Esta línea sirve para abrir el elemento «li».
        <li key={key}>
          {/* Esta línea sirve para mostrar el nombre del campo modificado. */}
          <span className="font-medium">{key}</span>:{" "}
          {/* Esta línea sirve para mostrar el valor anterior seguido de una flecha, si existe. */}
          {c.old && key in c.old ? `${formatValue(c.old[key])} → ` : ""}
          {/* Esta línea sirve para mostrar el contenido dinámico «{formatValue(c.attributes![key])}». */}
          {formatValue(c.attributes![key])}
        </li>
      ))}
    </ul>
  )
}

// Esta línea sirve para declarar la función «AdminOrderDetailPage».
export function AdminOrderDetailPage() {
  // Esta línea sirve para extraer «orderId» de «useParams<{ orderId: string }>()».
  const { orderId } = useParams<{ orderId: string }>()
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para crear el estado «form» y su función «setForm».
  const [form, setForm] = useState<TrackingForm | null>(null)

  // Esta línea sirve para obtener «data: order, isLoading» con el hook «useQuery».
  const { data: order, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["admin", "orders", orderId]».
    queryKey: ["admin", "orders", orderId],
    // Esta línea sirve para pedir el pedido a la API.
    queryFn: () => api.get<AdminOrder>(`/admin/orders/${orderId}`),
    // Esta línea sirve para declarar la propiedad «enabled» con el valor o tipo «Boolean(orderId)».
    enabled: Boolean(orderId),
  })

  // Solo sembramos el form cuando cambia el pedido (navegación a otro id),
  // no en cada refetch — así no se pisan ediciones en curso del admin.
  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llenar el formulario con los datos del pedido cargado.
    if (order) setForm(buildForm(order))
    // Esta línea sirve para volver a ejecutar el efecto solo cuando cambia el pedido.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id])

  // Esta línea sirve para obtener «trackingMutation» con el hook «useMutation».
  const trackingMutation = useMutation({
    // Esta línea sirve para enviar los cambios de seguimiento a la API.
    mutationFn: (payload: OrderTrackingPayload) => api.patch<AdminOrder>(`/admin/orders/${orderId}`, payload),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «(updated) => {».
    onSuccess: (updated) => {
      // Esta línea sirve para llamar a «setForm» con «buildForm(updated)».
      setForm(buildForm(updated))
      // La respuesta del PATCH ya trae el pedido completo (incluido el
      // history actualizado) — se escribe directo en la cache en vez de
      // solo invalidar, para que el badge/timeline/historial reflejen el
      // cambio al instante sin esperar un refetch de red.
      // Esta línea sirve para llamar a «queryClient.setQueryData» con «["admin", "orders", orderId], updated».
      queryClient.setQueryData(["admin", "orders", orderId], updated)
      // Solo la lista (queryKey ["admin","orders",status]) — un invalidateQueries
      // con ["admin","orders"] a secas hace match por prefijo contra ESTE MISMO
      // query ["admin","orders",orderId] y dispara un refetch que pisa el
      // setQueryData de arriba antes de que el usuario llegue a verlo.
      // Esta línea sirve para refrescar la caché de pedidos.
      queryClient.invalidateQueries({
        // Esta línea sirve para declarar la propiedad «predicate» con el valor o tipo «(query) =>».
        predicate: (query) =>
          // Esta línea sirve para limitar el refresco a las listas de pedidos distintas del actual.
          query.queryKey[0] === "admin" && query.queryKey[1] === "orders" && query.queryKey[2] !== orderId,
      })
    },
  })

  // Esta línea sirve para revisar si «isLoading || !order || !form».
  if (isLoading || !order || !form) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
      <main className="px-4 py-6 sm:px-6 sm:py-8">
        {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto max-w-3xl». */}
        <div className="mx-auto max-w-3xl">
          {/* Esta línea sirve para abrir el componente «Skeleton». */}
          <Skeleton className="h-40 w-full" />
        </div>
      </main>
    )
  }

  // Esta línea sirve para extraer «andleSav» de «() => {».
  const handleSave = () => {
    // Esta línea sirve para extraer «lankToNul» de «(value: string) => value.trim() || null».
    const blankToNull = (value: string) => value.trim() || null
    // Solo se mandan los campos que el admin realmente cambió (comparado
    // contra el pedido tal como lo devolvió el servidor) — no el form
    // completo. UpdateOrderTrackingRequest ya acepta cada campo como
    // "sometimes" para esto: si otro admin actualizó, por ejemplo,
    // tracking_number/carrier mientras esta pestaña estaba abierta,
    // guardar acá ya no lo pisa con el valor viejo que traía este form.
    // Esta línea sirve para extraer «ayload: OrderTrackingPayloa» de «{}».
    const payload: OrderTrackingPayload = {}
    // Esta línea sirve para incluir el estado en los cambios si cambió.
    if (form.status !== order.status) payload.status = form.status
    // Esta línea sirve para revisar si «blankToNull(form.tracking_number) !== order.tracking_number».
    if (blankToNull(form.tracking_number) !== order.tracking_number) {
      // Esta línea sirve para asignar «blankToNull(form.tracking_number)» a «payload.tracking_number».
      payload.tracking_number = blankToNull(form.tracking_number)
    }
    // Esta línea sirve para incluir el transportista en los cambios si cambió.
    if (blankToNull(form.carrier) !== order.carrier) payload.carrier = blankToNull(form.carrier)
    // Esta línea sirve para revisar si cambió el mensaje al cliente.
    if (blankToNull(form.customer_message) !== order.customer_message) {
      // Esta línea sirve para asignar «blankToNull(form.customer_message)» a «payload.customer_message».
      payload.customer_message = blankToNull(form.customer_message)
    }
    // Esta línea sirve para incluir las notas internas en los cambios si cambiaron.
    if (blankToNull(form.admin_notes) !== order.admin_notes) payload.admin_notes = blankToNull(form.admin_notes)

    // Esta línea sirve para salir de la función si «Object.keys(payload).length === 0».
    if (Object.keys(payload).length === 0) return
    // Esta línea sirve para llamar a «trackingMutation.mutate» con «payload».
    trackingMutation.mutate(payload)
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-3xl flex-col gap-6». */}
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* Esta línea sirve para abrir el componente «Link». */}
        <Link to="/admin/orders" className="text-sm text-muted-foreground hover:text-foreground">
          {/* Esta línea sirve para mostrar el contenido dinámico «← Pedidos». */}
          ← Pedidos
        </Link>
        {/* Esta línea sirve para abrir el elemento «div» con las clases «flex items-center justify-between gap-3». */}
        <div className="flex items-center justify-between gap-3">
          {/* Esta línea sirve para abrir el elemento «h1» con las clases «font-heading text-2xl font-bold tracking». */}
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            {/* Esta línea sirve para mostrar el contenido dinámico «Pedido #{String(order.id).padStart(6, "0")}». */}
            Pedido #{String(order.id).padStart(6, "0")}
          </h1>
          {/* Esta línea sirve para mostrar el valor «ORDER_STATUS_LABELS[order.status]» dentro de «Badge». */}
          <Badge variant={ORDER_STATUS_BADGE_VARIANT[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
        </div>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el texto «Seguimiento» dentro de un «h2». */}
          <h2 className="font-heading text-sm font-medium">Seguimiento</h2>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-4». */}
          <div className="mt-4">
            {/* Esta línea sirve para abrir el componente «OrderTimeline». */}
            <OrderTimeline status={order.status} />
          </div>
        </section>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «grid grid-cols-2 gap-4 rounded-xl border». */}
        <section className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div>
            {/* Esta línea sirve para mostrar el texto «Cliente» dentro de un «p». */}
            <p className="text-xs text-muted-foreground">Cliente</p>
            {/* Esta línea sirve para mostrar el valor «order.customer_name» dentro de un «p». */}
            <p className="text-sm">{order.customer_name}</p>
          </div>
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div>
            {/* Esta línea sirve para mostrar el texto «Fecha» dentro de un «p». */}
            <p className="text-xs text-muted-foreground">Fecha</p>
            {/* Esta línea sirve para mostrar el valor «new Date(order.created_at).toLocaleString()» dentro de un «p». */}
            <p className="text-sm">{new Date(order.created_at).toLocaleString()}</p>
          </div>
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div>
            {/* Esta línea sirve para mostrar el texto «Correo» dentro de un «p». */}
            <p className="text-xs text-muted-foreground">Correo</p>
            {/* Esta línea sirve para mostrar el valor «order.customer_email» dentro de un «p». */}
            <p className="text-sm break-all">{order.customer_email}</p>
          </div>
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div>
            {/* Esta línea sirve para mostrar el texto «Teléfono» dentro de un «p». */}
            <p className="text-xs text-muted-foreground">Teléfono</p>
            {/* Esta línea sirve para mostrar el valor «order.customer_phone» dentro de un «p». */}
            <p className="text-sm">{order.customer_phone}</p>
          </div>
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div>
            {/* Esta línea sirve para mostrar el texto «WhatsApp» dentro de un «p». */}
            <p className="text-xs text-muted-foreground">WhatsApp</p>
            {/* Esta línea sirve para mostrar el valor «order.customer_whatsapp» dentro de un «p». */}
            <p className="text-sm">{order.customer_whatsapp}</p>
          </div>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «col-span-2». */}
          <div className="col-span-2">
            {/* Esta línea sirve para mostrar el texto «Dirección de entrega» dentro de un «p». */}
            <p className="text-xs text-muted-foreground">Dirección de entrega</p>
            {/* Esta línea sirve para abrir el elemento «p» con las clases «text-sm». */}
            <p className="text-sm">
              {/* Esta línea sirve para mostrar el contenido dinámico «{order.address}, {order.city}, {order.department}». */}
              {order.address}, {order.city}, {order.department}
            </p>
          </div>
          {/* Esta línea sirve para mostrar el bloque solo si «order.additional_info». */}
          {order.additional_info && (
            // Esta línea sirve para abrir el elemento «div» con las clases «col-span-2».
            <div className="col-span-2">
              {/* Esta línea sirve para mostrar el texto «Información adicional» dentro de un «p». */}
              <p className="text-xs text-muted-foreground">Información adicional</p>
              {/* Esta línea sirve para mostrar el valor «order.additional_info» dentro de un «p». */}
              <p className="text-sm">{order.additional_info}</p>
            </div>
          )}
        </section>

        {/* Esta línea sirve para mostrar el bloque solo si «order.whatsapp_url». */}
        {order.whatsapp_url && (
          // Esta línea sirve para abrir el componente «Button».
          <Button asChild variant="outline" size="sm" className="self-start">
            {/* Esta línea sirve para abrir el elemento «a». */}
            <a href={order.whatsapp_url} target="_blank" rel="noopener noreferrer">
              {/* Esta línea sirve para mostrar el contenido dinámico «💬 Contactar por WhatsApp». */}
              💬 Contactar por WhatsApp
            </a>
          </Button>
        )}

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el texto «Productos» dentro de un «h2». */}
          <h2 className="font-heading text-sm font-medium">Productos</h2>
          {/* Esta línea sirve para abrir el elemento «ul» con las clases «mt-3 divide-y divide-border». */}
          <ul className="mt-3 divide-y divide-border">
            {/* Esta línea sirve para recorrer «order.items» y mostrar un bloque por elemento. */}
            {order.items.map((item) => (
              // Esta línea sirve para abrir el elemento «li».
              <li key={item.id} className="flex items-center justify-between py-2 text-sm">
                {/* Esta línea sirve para abrir el elemento «span». */}
                <span>
                  {/* Esta línea sirve para mostrar el contenido dinámico «{item.quantity}× {item.product_name}». */}
                  {item.quantity}× {item.product_name}
                </span>
                {/* Esta línea sirve para mostrar el valor «formatCurrency(item.subtotal)» dentro de un «span». */}
                <span>{formatCurrency(item.subtotal)}</span>
              </li>
            ))}
          </ul>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-3 flex flex-col gap-1 border-t border». */}
          <div className="mt-3 flex flex-col gap-1 border-t border-border pt-3 text-sm">
            {/* Esta línea sirve para abrir el elemento «div» con las clases «flex justify-between text-muted-foregrou». */}
            <div className="flex justify-between text-muted-foreground">
              {/* Esta línea sirve para mostrar el texto «Subtotal (COP)» dentro de un «span». */}
              <span>Subtotal (COP)</span>
              {/* Esta línea sirve para mostrar el valor «formatCurrency(order.subtotal)» dentro de un «span». */}
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {/* Esta línea sirve para abrir el elemento «div» con las clases «flex justify-between text-muted-foregrou». */}
            <div className="flex justify-between text-muted-foreground">
              {/* Esta línea sirve para mostrar el texto «Envío (COP)» dentro de un «span». */}
              <span>Envío (COP)</span>
              {/* Esta línea sirve para mostrar el costo de envío o «Por definir». */}
              <span>{order.shipping_cost ? formatCurrency(order.shipping_cost) : "Por definir"}</span>
            </div>
            {/* Esta línea sirve para abrir el elemento «div» con las clases «flex justify-between font-medium text-fo». */}
            <div className="flex justify-between font-medium text-foreground">
              {/* Esta línea sirve para mostrar el texto «Total (COP)» dentro de un «span». */}
              <span>Total (COP)</span>
              {/* Esta línea sirve para mostrar el valor «formatCurrency(order.total)» dentro de un «span». */}
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </section>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el texto «Tracking y notas» dentro de un «h2». */}
          <h2 className="font-heading text-sm font-medium">Tracking y notas</h2>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-3 flex flex-col gap-3». */}
          <div className="mt-3 flex flex-col gap-3">
            {/* Esta línea sirve para abrir el elemento «div». */}
            <div>
              {/* Esta línea sirve para mostrar el texto «Estado» dentro de un «label». */}
              <label className="text-xs text-muted-foreground">Estado</label>
              {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
              <select
                // Esta línea sirve para pasar la propiedad «value» con el valor «form.status}».
                value={form.status}
                // Esta línea sirve para asignar el manejador del evento «onChange».
                onChange={(e) => setForm({ ...form, status: e.target.value as OrderStatus })}
                // Esta línea sirve para aplicar las clases de estilo «mt-1 w-full rounded-lg border border-input bg».
                className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
              >
                {/* Esta línea sirve para recorrer «ORDER_STATUSES» y mostrar un bloque por elemento. */}
                {ORDER_STATUSES.map((option) => (
                  // Esta línea sirve para abrir el elemento «option».
                  <option key={option} value={option}>
                    {/* Esta línea sirve para mostrar el contenido dinámico «{ORDER_STATUS_LABELS[option]}». */}
                    {ORDER_STATUS_LABELS[option]}
                  </option>
                ))}
              </select>
            </div>
            {/* Esta línea sirve para abrir el elemento «div» con las clases «grid grid-cols-2 gap-3». */}
            <div className="grid grid-cols-2 gap-3">
              {/* Esta línea sirve para abrir el elemento «div». */}
              <div>
                {/* Esta línea sirve para mostrar el texto «Número de guía» dentro de un «label». */}
                <label className="text-xs text-muted-foreground">Número de guía</label>
                {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
                <input
                  // Esta línea sirve para pasar la propiedad «value» con el valor «form.tracking_number}».
                  value={form.tracking_number}
                  // Esta línea sirve para asignar el manejador del evento «onChange».
                  onChange={(e) => setForm({ ...form, tracking_number: e.target.value })}
                  // Esta línea sirve para aplicar las clases de estilo «mt-1 w-full rounded-lg border border-input bg».
                  className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
                />
              </div>
              {/* Esta línea sirve para abrir el elemento «div». */}
              <div>
                {/* Esta línea sirve para mostrar el texto «Transportadora» dentro de un «label». */}
                <label className="text-xs text-muted-foreground">Transportadora</label>
                {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
                <input
                  // Esta línea sirve para pasar la propiedad «value» con el valor «form.carrier}».
                  value={form.carrier}
                  // Esta línea sirve para asignar el manejador del evento «onChange».
                  onChange={(e) => setForm({ ...form, carrier: e.target.value })}
                  // Esta línea sirve para aplicar las clases de estilo «mt-1 w-full rounded-lg border border-input bg».
                  className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
                />
              </div>
            </div>
            {/* Esta línea sirve para abrir el elemento «div». */}
            <div>
              {/* Esta línea sirve para mostrar el texto «Mensaje para el cliente» dentro de un «label». */}
              <label className="text-xs text-muted-foreground">Mensaje para el cliente</label>
              {/* Esta línea sirve para abrir el elemento «textarea» con sus atributos en varias líneas. */}
              <textarea
                // Esta línea sirve para pasar la propiedad «rows» con el valor «2}».
                rows={2}
                // Esta línea sirve para pasar la propiedad «value» con el valor «form.customer_message}».
                value={form.customer_message}
                // Esta línea sirve para asignar el manejador del evento «onChange».
                onChange={(e) => setForm({ ...form, customer_message: e.target.value })}
                // Esta línea sirve para aplicar las clases de estilo «mt-1 w-full rounded-lg border border-input bg».
                className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
              />
              {/* Esta línea sirve para avisar que este mensaje sí lo ve el cliente. */}
              <p className="mt-1 text-xs text-muted-foreground">Esto SÍ lo ve el cliente en el detalle de su pedido.</p>
            </div>
            {/* Esta línea sirve para abrir el elemento «div». */}
            <div>
              {/* Esta línea sirve para mostrar el texto «Notas internas» dentro de un «label». */}
              <label className="text-xs text-muted-foreground">Notas internas</label>
              {/* Esta línea sirve para abrir el elemento «textarea» con sus atributos en varias líneas. */}
              <textarea
                // Esta línea sirve para pasar la propiedad «rows» con el valor «2}».
                rows={2}
                // Esta línea sirve para pasar la propiedad «value» con el valor «form.admin_notes}».
                value={form.admin_notes}
                // Esta línea sirve para asignar el manejador del evento «onChange».
                onChange={(e) => setForm({ ...form, admin_notes: e.target.value })}
                // Esta línea sirve para aplicar las clases de estilo «mt-1 w-full rounded-lg border border-input bg».
                className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
              />
              {/* Esta línea sirve para avisar que estas notas nunca las ve el cliente. */}
              <p className="mt-1 text-xs text-muted-foreground">Esto NUNCA lo ve el cliente — solo es para el equipo.</p>
            </div>
            {/* Esta línea sirve para abrir el elemento «div» con las clases «flex items-center gap-2». */}
            <div className="flex items-center gap-2">
              {/* Esta línea sirve para abrir el componente «Button». */}
              <Button size="sm" onClick={handleSave} disabled={trackingMutation.isPending}>
                {/* Esta línea sirve para mostrar el texto «Guardar cambios». */}
                Guardar cambios
              </Button>
              {/* Esta línea sirve para mostrar el elemento solo si «trackingMutation.isSuccess». */}
              {trackingMutation.isSuccess && <span className="text-xs text-primary">Guardado.</span>}
              {/* Esta línea sirve para mostrar el elemento solo si «trackingMutation.isError». */}
              {trackingMutation.isError && <span className="text-xs text-destructive">No se pudo guardar.</span>}
            </div>
          </div>
        </section>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el texto «Historial de cambios» dentro de un «h2». */}
          <h2 className="font-heading text-sm font-medium">Historial de cambios</h2>
          {/* Esta línea sirve para elegir entre dos bloques según «order.history.length === 0». */}
          {order.history.length === 0 ? (
            // Esta línea sirve para mostrar el texto «Sin cambios registrados.» dentro de un «p».
            <p className="mt-3 text-sm text-muted-foreground">Sin cambios registrados.</p>
          // Esta línea sirve para mostrar el bloque alternativo.
          ) : (
            // Esta línea sirve para abrir el elemento «ul» con las clases «mt-3 divide-y divide-border».
            <ul className="mt-3 divide-y divide-border">
              {/* Esta línea sirve para recorrer «order.history» y mostrar un bloque por elemento. */}
              {order.history.map((entry) => (
                // Esta línea sirve para abrir el elemento «li».
                <li key={entry.id} className="py-2.5 text-sm">
                  {/* Esta línea sirve para abrir el elemento «p». */}
                  <p>
                    {/* Esta línea sirve para mostrar el autor (o Sistema) y la descripción del cambio. */}
                    <span className="font-medium">{entry.causer?.name ?? "Sistema"}</span> — {entry.description}
                  </p>
                  {/* Esta línea sirve para abrir el componente «ChangeList». */}
                  <ChangeList changes={entry.changes} />
                  {/* Esta línea sirve para mostrar el valor «new Date(entry.created_at).toLocaleString("es-AR")» dentro de un «p». */}
                  <p className="mt-1 text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleString("es-AR")}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
