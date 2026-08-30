import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { AdminProduct, ProductCategory } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductImageControls } from "@/components/admin/ProductImageControls"

interface ProductFormState {
  name: string
  description: string
  short_description: string
  category: ProductCategory
  price: string
  dropi_reference: string
}

const EMPTY_FORM: ProductFormState = {
  name: "",
  description: "",
  short_description: "",
  category: "protein",
  price: "",
  dropi_reference: "",
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  protein: "Proteínas",
  creatine: "Creatinas",
  pre_workout: "Pre-entrenos",
  amino_acids: "Aminoácidos",
  vitamins: "Vitaminas",
  other: "Otros",
}

const CATEGORY_OPTIONS = Object.keys(CATEGORY_LABELS) as ProductCategory[]

export function AdminProductsPage() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: () => api.get<AdminProduct[]>("/admin/products"),
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "products"] })

  const buildPayload = () => ({
    name: form.name,
    description: form.description,
    short_description: form.short_description,
    category: form.category,
    price: Number(form.price),
    dropi_reference: form.dropi_reference.trim() || null,
  })

  const createMutation = useMutation({
    mutationFn: () => api.post("/admin/products", buildPayload()),
    onSuccess: () => {
      setForm(EMPTY_FORM)
      invalidate()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/admin/products/${id}`, buildPayload()),
    onSuccess: () => {
      setEditingId(null)
      setForm(EMPTY_FORM)
      invalidate()
    },
  })

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      active ? api.delete(`/admin/products/${id}`) : api.patch(`/admin/products/${id}`, { active: true }),
    onSuccess: invalidate,
  })

  const startEdit = (product: AdminProduct) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      description: product.description,
      short_description: product.short_description,
      category: product.category,
      price: product.price,
      dropi_reference: product.dropi_reference ?? "",
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  return (
    <main className="px-6 py-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Productos</h1>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-sm font-medium">{editingId ? "Editar producto" : "Nuevo producto"}</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <input
              placeholder="Nombre"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="col-span-2 rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}
              className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {CATEGORY_LABELS[option]}
                </option>
              ))}
            </select>
            <input
              placeholder="Precio"
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            />
            <input
              placeholder="Descripción corta"
              value={form.short_description}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              className="col-span-2 rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            />
            <textarea
              placeholder="Descripción"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="col-span-2 rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            />
            <input
              placeholder="Referencia Dropi (opcional)"
              value={form.dropi_reference}
              onChange={(e) => setForm({ ...form, dropi_reference: e.target.value })}
              className="col-span-2 rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            />
          </div>
          <div className="mt-3 flex gap-2">
            {editingId ? (
              <>
                <Button
                  size="sm"
                  onClick={() => updateMutation.mutate(editingId)}
                  disabled={!form.name || !form.price || updateMutation.isPending}
                >
                  Guardar cambios
                </Button>
                <Button size="sm" variant="outline" onClick={cancelEdit}>
                  Cancelar
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={() => createMutation.mutate()}
                disabled={!form.name || !form.price || createMutation.isPending}
              >
                Crear
              </Button>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          {isLoading && <Skeleton className="h-20 w-full" />}
          {!isLoading && (
            <ul className="divide-y divide-border">
              {products?.map((product) => (
                <li key={product.id} className="flex flex-col gap-2 py-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => startEdit(product)}
                      className={`min-w-0 flex-1 text-left text-sm ${product.active ? "" : "opacity-50"}`}
                    >
                      {product.name}
                      <span className="ml-1 text-xs text-muted-foreground">
                        · {CATEGORY_LABELS[product.category]} · ${product.price}
                      </span>
                      <Badge variant={product.active ? "success" : "neutral"} className="ml-2">
                        {product.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </button>
                    <Button
                      variant={product.active ? "destructive" : "outline"}
                      size="sm"
                      className="flex-shrink-0"
                      onClick={() => toggleActiveMutation.mutate({ id: product.id, active: product.active })}
                      disabled={toggleActiveMutation.isPending}
                    >
                      {product.active ? "Desactivar" : "Activar"}
                    </Button>
                  </div>
                  <ProductImageControls product={product} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
