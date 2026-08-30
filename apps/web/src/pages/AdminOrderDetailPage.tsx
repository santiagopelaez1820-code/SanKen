import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { formatCurrency, type Order, type OrderStatus } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { STATUS_BADGE_VARIANT, STATUS_LABELS } from "@/pages/AdminOrdersPage"

const STATUS_OPTIONS: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]

export function AdminOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const queryClient = useQueryClient()
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | "">("")

  const { data: order, isLoading } = useQuery({
    queryKey: ["admin", "orders", orderId],
    queryFn: () => api.get<Order>(`/admin/orders/${orderId}`),
    enabled: Boolean(orderId),
  })

  const statusMutation = useMutation({
    mutationFn: (nextStatus: OrderStatus) => api.patch(`/admin/orders/${orderId}/status`, { status: nextStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders", orderId] })
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] })
    },
  })

  if (isLoading || !order) {
    return (
      <main className="px-6 py-8">
        <div className="mx-auto max-w-3xl">
          <Skeleton className="h-40 w-full" />
        </div>
      </main>
    )
  }

  const selectedStatus = pendingStatus || order.status

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
          <Badge variant={STATUS_BADGE_VARIANT[order.status]}>{STATUS_LABELS[order.status]}</Badge>
        </div>

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
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Envío</span>
              <span>{order.shipping_cost ? formatCurrency(order.shipping_cost) : "Por definir"}</span>
            </div>
            <div className="flex justify-between font-medium text-foreground">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-sm font-medium">Cambiar estado</h2>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setPendingStatus(e.target.value as OrderStatus)}
              className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {STATUS_LABELS[option]}
                </option>
              ))}
            </select>
            <Button
              size="sm"
              disabled={statusMutation.isPending || selectedStatus === order.status}
              onClick={() => statusMutation.mutate(selectedStatus)}
            >
              Guardar estado
            </Button>
          </div>
        </section>
      </div>
    </main>
  )
}
