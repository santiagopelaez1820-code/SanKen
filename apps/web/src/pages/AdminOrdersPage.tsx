import { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { formatCurrency, type Order, type OrderStatus } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  processing: "Procesando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
}

export const STATUS_BADGE_VARIANT: Record<
  OrderStatus,
  "neutral" | "default" | "warning" | "accent2" | "success" | "error"
> = {
  pending: "neutral",
  confirmed: "default",
  processing: "warning",
  shipped: "accent2",
  delivered: "success",
  cancelled: "error",
}

const STATUS_FILTERS = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const

export function AdminOrdersPage() {
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("all")

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin", "orders", status],
    queryFn: () => api.get<Order[]>(`/admin/orders${status === "all" ? "" : `?status=${status}`}`),
  })

  return (
    <main className="px-6 py-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Pedidos</h1>

        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((option) => (
            <Button
              key={option}
              size="sm"
              variant={status === option ? "default" : "outline"}
              onClick={() => setStatus(option)}
            >
              {option === "all" ? "Todos" : STATUS_LABELS[option]}
            </Button>
          ))}
        </div>

        <section className="rounded-xl border border-border bg-card p-5">
          {isLoading && <Skeleton className="h-20 w-full" />}
          {!isLoading && orders?.length === 0 && <p className="text-sm text-muted-foreground">Sin pedidos acá.</p>}
          <ul className="divide-y divide-border">
            {orders?.map((order) => (
              <li key={order.id}>
                <Link
                  to={`/admin/orders/${order.id}`}
                  className="flex flex-col gap-1 py-3 text-sm text-foreground hover:text-primary"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">
                      #{String(order.id).padStart(6, "0")} — {order.customer_name}
                    </span>
                    <Badge variant={STATUS_BADGE_VARIANT[order.status]}>{STATUS_LABELS[order.status]}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()} ·{" "}
                    {order.items.map((item) => `${item.quantity}× ${item.product_name}`).join(", ")} ·{" "}
                    {formatCurrency(order.total)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
