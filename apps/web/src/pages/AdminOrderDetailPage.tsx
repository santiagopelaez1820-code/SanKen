import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { formatCurrency, type AdminOrder, type OrderStatus, type OrderTrackingPayload } from "@sanken/core"
import { api } from "@/lib/api"
import { ORDER_STATUS_BADGE_VARIANT, ORDER_STATUS_LABELS } from "@/lib/order-status"
import { OrderTimeline } from "@/components/admin/OrderTimeline"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "confirming",
  "processing",
  "shipped",
  "delivered",
  "problem",
  "cancelled",
]

interface TrackingForm {
  status: OrderStatus
  tracking_number: string
  carrier: string
  customer_message: string
  admin_notes: string
}

function buildForm(order: AdminOrder): TrackingForm {
  return {
    status: order.status,
    tracking_number: order.tracking_number ?? "",
    carrier: order.carrier ?? "",
    customer_message: order.customer_message ?? "",
    admin_notes: order.admin_notes ?? "",
  }
}

/** El shape real de AuditLogEntry.changes (ver spatie/laravel-activitylog) es
 * `{attributes, old}` pero el tipo compartido lo deja como `unknown` — se
 * valida en runtime acá en vez de forzar el shape en @sanken/core. */
function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—"
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

function ChangeList({ changes }: { changes: unknown }) {
  if (!changes || typeof changes !== "object") return null
  const c = changes as { attributes?: Record<string, unknown>; old?: Record<string, unknown> }
  if (!c.attributes || typeof c.attributes !== "object") return null
  const keys = Object.keys(c.attributes)
  if (keys.length === 0) return null

  return (
    <ul className="mt-1 flex flex-col gap-0.5 text-xs text-muted-foreground">
      {keys.map((key) => (
        <li key={key}>
          <span className="font-medium">{key}</span>:{" "}
          {c.old && key in c.old ? `${formatValue(c.old[key])} → ` : ""}
          {formatValue(c.attributes![key])}
        </li>
      ))}
    </ul>
  )
}

export function AdminOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const queryClient = useQueryClient()
  const [form, setForm] = useState<TrackingForm | null>(null)

  const { data: order, isLoading } = useQuery({
    queryKey: ["admin", "orders", orderId],
    queryFn: () => api.get<AdminOrder>(`/admin/orders/${orderId}`),
    enabled: Boolean(orderId),
  })

  // Solo sembramos el form cuando cambia el pedido (navegación a otro id),
  // no en cada refetch — así no se pisan ediciones en curso del admin.
  useEffect(() => {
    if (order) setForm(buildForm(order))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id])

  const trackingMutation = useMutation({
    mutationFn: (payload: OrderTrackingPayload) => api.patch<AdminOrder>(`/admin/orders/${orderId}`, payload),
    onSuccess: (updated) => {
      setForm(buildForm(updated))
      // La respuesta del PATCH ya trae el pedido completo (incluido el
      // history actualizado) — se escribe directo en la cache en vez de
      // solo invalidar, para que el badge/timeline/historial reflejen el
      // cambio al instante sin esperar un refetch de red.
      queryClient.setQueryData(["admin", "orders", orderId], updated)
      // Solo la lista (queryKey ["admin","orders",status]) — un invalidateQueries
      // con ["admin","orders"] a secas hace match por prefijo contra ESTE MISMO
      // query ["admin","orders",orderId] y dispara un refetch que pisa el
      // setQueryData de arriba antes de que el usuario llegue a verlo.
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "admin" && query.queryKey[1] === "orders" && query.queryKey[2] !== orderId,
      })
    },
  })

  if (isLoading || !order || !form) {
    return (
      <main className="px-6 py-8">
        <div className="mx-auto max-w-3xl">
          <Skeleton className="h-40 w-full" />
        </div>
      </main>
    )
  }

  const handleSave = () => {
    const blankToNull = (value: string) => value.trim() || null
    // Solo se mandan los campos que el admin realmente cambió (comparado
    // contra el pedido tal como lo devolvió el servidor) — no el form
    // completo. UpdateOrderTrackingRequest ya acepta cada campo como
    // "sometimes" para esto: si otro admin actualizó, por ejemplo,
    // tracking_number/carrier mientras esta pestaña estaba abierta,
    // guardar acá ya no lo pisa con el valor viejo que traía este form.
    const payload: OrderTrackingPayload = {}
    if (form.status !== order.status) payload.status = form.status
    if (blankToNull(form.tracking_number) !== order.tracking_number) {
      payload.tracking_number = blankToNull(form.tracking_number)
    }
    if (blankToNull(form.carrier) !== order.carrier) payload.carrier = blankToNull(form.carrier)
    if (blankToNull(form.customer_message) !== order.customer_message) {
      payload.customer_message = blankToNull(form.customer_message)
    }
    if (blankToNull(form.admin_notes) !== order.admin_notes) payload.admin_notes = blankToNull(form.admin_notes)

    if (Object.keys(payload).length === 0) return
    trackingMutation.mutate(payload)
  }

  return (
    <main className="px-6 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <Link to="/admin/orders" className="text-sm text-muted-foreground hover:text-foreground">
          ← Pedidos
        </Link>
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Pedido #{String(order.id).padStart(6, "0")}
          </h1>
          <Badge variant={ORDER_STATUS_BADGE_VARIANT[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
        </div>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-sm font-medium">Seguimiento</h2>
          <div className="mt-4">
            <OrderTimeline status={order.status} />
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-5">
          <div>
            <p className="text-xs text-muted-foreground">Cliente</p>
            <p className="text-sm">{order.customer_name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Fecha</p>
            <p className="text-sm">{new Date(order.created_at).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Correo</p>
            <p className="text-sm">{order.customer_email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Teléfono</p>
            <p className="text-sm">{order.customer_phone}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">WhatsApp</p>
            <p className="text-sm">{order.customer_whatsapp}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-muted-foreground">Dirección de entrega</p>
            <p className="text-sm">
              {order.address}, {order.city}, {order.department}
            </p>
          </div>
          {order.additional_info && (
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground">Información adicional</p>
              <p className="text-sm">{order.additional_info}</p>
            </div>
          )}
        </section>

        {order.whatsapp_url && (
          <Button asChild variant="outline" size="sm" className="self-start">
            <a href={order.whatsapp_url} target="_blank" rel="noopener noreferrer">
              💬 Contactar por WhatsApp
            </a>
          </Button>
        )}

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-sm font-medium">Productos</h2>
          <ul className="mt-3 divide-y divide-border">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-2 text-sm">
                <span>
                  {item.quantity}× {item.product_name}
                </span>
                <span>{formatCurrency(item.subtotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-1 border-t border-border pt-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal (COP)</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Envío (COP)</span>
              <span>{order.shipping_cost ? formatCurrency(order.shipping_cost) : "Por definir"}</span>
            </div>
            <div className="flex justify-between font-medium text-foreground">
              <span>Total (COP)</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-sm font-medium">Tracking y notas</h2>
          <div className="mt-3 flex flex-col gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Estado</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as OrderStatus })}
                className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {ORDER_STATUS_LABELS[option]}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Número de guía</label>
                <input
                  value={form.tracking_number}
                  onChange={(e) => setForm({ ...form, tracking_number: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Transportadora</label>
                <input
                  value={form.carrier}
                  onChange={(e) => setForm({ ...form, carrier: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Mensaje para el cliente</label>
              <textarea
                rows={2}
                value={form.customer_message}
                onChange={(e) => setForm({ ...form, customer_message: e.target.value })}
                className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
              />
              <p className="mt-1 text-xs text-muted-foreground">Esto SÍ lo ve el cliente en el detalle de su pedido.</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Notas internas</label>
              <textarea
                rows={2}
                value={form.admin_notes}
                onChange={(e) => setForm({ ...form, admin_notes: e.target.value })}
                className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
              />
              <p className="mt-1 text-xs text-muted-foreground">Esto NUNCA lo ve el cliente — solo es para el equipo.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleSave} disabled={trackingMutation.isPending}>
                Guardar cambios
              </Button>
              {trackingMutation.isSuccess && <span className="text-xs text-primary">Guardado.</span>}
              {trackingMutation.isError && <span className="text-xs text-destructive">No se pudo guardar.</span>}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-sm font-medium">Historial de cambios</h2>
          {order.history.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Sin cambios registrados.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {order.history.map((entry) => (
                <li key={entry.id} className="py-2.5 text-sm">
                  <p>
                    <span className="font-medium">{entry.causer?.name ?? "Sistema"}</span> — {entry.description}
                  </p>
                  <ChangeList changes={entry.changes} />
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
