// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «Link» desde «react-router-dom».
import { Link } from "react-router-dom"
// Esta línea sirve para importar «useQuery» desde «@tanstack/react-query».
import { useQuery } from "@tanstack/react-query"
// Esta línea sirve para importar «formatCurrency, type AdminOrder» desde «@sanken/core».
import { formatCurrency, type AdminOrder } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «ORDER_STATUS_BADGE_VARIANT, ORDER_STATUS_LABELS, ORDER_STATUSES» desde «@/lib/order-status».
import { ORDER_STATUS_BADGE_VARIANT, ORDER_STATUS_LABELS, ORDER_STATUSES } from "@/lib/order-status"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «Badge» desde «@/components/ui/badge».
import { Badge } from "@/components/ui/badge"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar «STATUS_FILTERS» con el valor «["all", ...ORDER_STATUSES] as const».
const STATUS_FILTERS = ["all", ...ORDER_STATUSES] as const

// Esta línea sirve para declarar la función «AdminOrdersPage».
export function AdminOrdersPage() {
  // Esta línea sirve para crear el estado «status» y su función «setStatus».
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("all")

  // Esta línea sirve para obtener «data: orders, isLoading» con el hook «useQuery».
  const { data: orders, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["admin", "orders", status]».
    queryKey: ["admin", "orders", status],
    // Esta línea sirve para pedir los pedidos a la API, filtrados por estado si se eligió uno.
    queryFn: () => api.get<AdminOrder[]>(`/admin/orders${status === "all" ? "" : `?status=${status}`}`),
  })

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-4xl flex-col gap-6». */}
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        {/* Esta línea sirve para mostrar el texto «Pedidos» dentro de un «h1». */}
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Pedidos</h1>

        {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-wrap gap-2». */}
        <div className="flex flex-wrap gap-2">
          {/* Esta línea sirve para recorrer «STATUS_FILTERS» y mostrar un bloque por elemento. */}
          {STATUS_FILTERS.map((option) => (
            // Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas.
            <Button
              // Esta línea sirve para identificar el elemento de la lista con «option}».
              key={option}
              // Esta línea sirve para definir el atributo «size» con el valor «sm».
              size="sm"
              // Esta línea sirve para pasar la propiedad «variant» con el valor «status === option ? "default" : "outline"}».
              variant={status === option ? "default" : "outline"}
              // Esta línea sirve para asignar el manejador del evento «onClick».
              onClick={() => setStatus(option)}
            >
              {/* Esta línea sirve para mostrar el contenido dinámico «{option === "all" ? "Todos" : ORDER_STATUS_LABELS[option]}». */}
              {option === "all" ? "Todos" : ORDER_STATUS_LABELS[option]}
            </Button>
          ))}
        </div>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
          {isLoading && <Skeleton className="h-20 w-full" />}
          {/* Esta línea sirve para mostrar el elemento solo si «!isLoading && orders?.length === 0». */}
          {!isLoading && orders?.length === 0 && <p className="text-sm text-muted-foreground">Sin pedidos acá.</p>}
          {/* Esta línea sirve para abrir el elemento «ul» con las clases «divide-y divide-border». */}
          <ul className="divide-y divide-border">
            {/* Esta línea sirve para recorrer «orders?» y mostrar un bloque por elemento. */}
            {orders?.map((order) => (
              // Esta línea sirve para abrir el elemento «li».
              <li key={order.id}>
                {/* Esta línea sirve para abrir el elemento «Link» con sus atributos en varias líneas. */}
                <Link
                  // Esta línea sirve para pasar la propiedad «to» con el valor «`/admin/orders/${order.id}`}».
                  to={`/admin/orders/${order.id}`}
                  // Esta línea sirve para aplicar las clases de estilo «flex flex-col gap-1 py-3 text-sm text-foregro».
                  className="flex flex-col gap-1 py-3 text-sm text-foreground hover:text-primary"
                >
                  {/* Esta línea sirve para abrir el elemento «div» con las clases «flex items-center justify-between gap-3». */}
                  <div className="flex items-center justify-between gap-3">
                    {/* Esta línea sirve para abrir el elemento «span» con las clases «font-medium». */}
                    <span className="font-medium">
                      {/* Esta línea sirve para mostrar el contenido dinámico «#{String(order.id).padStart(6, "0")} — {order.customer_name}». */}
                      #{String(order.id).padStart(6, "0")} — {order.customer_name}
                    </span>
                    {/* Esta línea sirve para mostrar el valor «ORDER_STATUS_LABELS[order.status]» dentro de «Badge». */}
                    <Badge variant={ORDER_STATUS_BADGE_VARIANT[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
                  </div>
                  {/* Esta línea sirve para abrir el elemento «span» con las clases «text-xs text-muted-foreground». */}
                  <span className="text-xs text-muted-foreground">
                    {/* Esta línea sirve para mostrar el contenido dinámico «{new Date(order.created_at).toLocaleDateString()} ·{" "}». */}
                    {new Date(order.created_at).toLocaleDateString()} ·{" "}
                    {/* Esta línea sirve para mostrar los productos y cantidades del pedido. */}
                    {order.items.map((item) => `${item.quantity}× ${item.product_name}`).join(", ")} ·{" "}
                    {/* Esta línea sirve para mostrar el contenido dinámico «{formatCurrency(order.total)}». */}
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
