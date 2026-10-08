// Esta línea sirve para importar «useRef, useState» desde «react».
import { useRef, useState } from "react"
// Esta línea sirve para importar «useMutation, useQuery, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar «formatCurrency, type AdminProduct, type ProductCategory» desde «@sanken/core».
import { formatCurrency, type AdminProduct, type ProductCategory } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «Badge» desde «@/components/ui/badge».
import { Badge } from "@/components/ui/badge"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"
// Esta línea sirve para importar «ProductImageControls» desde «@/components/admin/ProductImageControls».
import { ProductImageControls } from "@/components/admin/ProductImageControls"

// Esta línea sirve para declarar la interfaz «ProductFormState».
interface ProductFormState {
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «string».
  name: string
  // Esta línea sirve para declarar la propiedad «description» con el valor o tipo «string».
  description: string
  // Esta línea sirve para declarar la propiedad «short_description» con el valor o tipo «string».
  short_description: string
  // Esta línea sirve para declarar la propiedad «category» con el valor o tipo «ProductCategory».
  category: ProductCategory
  // Esta línea sirve para declarar la propiedad «price» con el valor o tipo «string».
  price: string
  // Esta línea sirve para declarar la propiedad «dropi_reference» con el valor o tipo «string».
  dropi_reference: string
}

// Esta línea sirve para declarar «EMPTY_FORM» con el valor «{».
const EMPTY_FORM: ProductFormState = {
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «""».
  name: "",
  // Esta línea sirve para declarar la propiedad «description» con el valor o tipo «""».
  description: "",
  // Esta línea sirve para declarar la propiedad «short_description» con el valor o tipo «""».
  short_description: "",
  // Esta línea sirve para declarar la propiedad «category» con el valor o tipo «"protein"».
  category: "protein",
  // Esta línea sirve para declarar la propiedad «price» con el valor o tipo «""».
  price: "",
  // Esta línea sirve para declarar la propiedad «dropi_reference» con el valor o tipo «""».
  dropi_reference: "",
}

// Esta línea sirve para declarar «CATEGORY_LABELS» con el valor «{».
export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  // Esta línea sirve para declarar la propiedad «protein» con el valor o tipo «"Proteínas"».
  protein: "Proteínas",
  // Esta línea sirve para declarar la propiedad «creatine» con el valor o tipo «"Creatinas"».
  creatine: "Creatinas",
  // Esta línea sirve para declarar la propiedad «pre_workout» con el valor o tipo «"Pre-entrenos"».
  pre_workout: "Pre-entrenos",
  // Esta línea sirve para declarar la propiedad «amino_acids» con el valor o tipo «"Aminoácidos"».
  amino_acids: "Aminoácidos",
  // Esta línea sirve para declarar la propiedad «vitamins» con el valor o tipo «"Vitaminas"».
  vitamins: "Vitaminas",
  // Esta línea sirve para declarar la propiedad «other» con el valor o tipo «"Otros"».
  other: "Otros",
}

// Esta línea sirve para declarar «CATEGORY_OPTIONS» con el valor «Object.keys(CATEGORY_LABELS) as ProductCategory[]».
const CATEGORY_OPTIONS = Object.keys(CATEGORY_LABELS) as ProductCategory[]

// Esta línea sirve para declarar la función «AdminProductsPage».
export function AdminProductsPage() {
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para crear el estado «form» y su función «setForm».
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM)
  // Esta línea sirve para crear el estado «editingId» y su función «setEditingId».
  const [editingId, setEditingId] = useState<number | null>(null)
  // Esta línea sirve para crear la referencia «formSectionRef».
  const formSectionRef = useRef<HTMLElement | null>(null)

  // Esta línea sirve para obtener «data: products, isLoading» con el hook «useQuery».
  const { data: products, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["admin", "products"]».
    queryKey: ["admin", "products"],
    // Esta línea sirve para pedir la lista de productos a la API.
    queryFn: () => api.get<AdminProduct[]>("/admin/products"),
  })

  // Esta línea sirve para extraer «nvalidat» de «() => queryClient.invalidateQueries({ qu».
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "products"] })

  // Esta línea sirve para extraer «uildPayloa» de «() => ({».
  const buildPayload = () => ({
    // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «form.name».
    name: form.name,
    // Esta línea sirve para declarar la propiedad «description» con el valor o tipo «form.description».
    description: form.description,
    // Esta línea sirve para declarar la propiedad «short_description» con el valor o tipo «form.short_description».
    short_description: form.short_description,
    // Esta línea sirve para declarar la propiedad «category» con el valor o tipo «form.category».
    category: form.category,
    // Esta línea sirve para declarar la propiedad «price» con el valor o tipo «Number(form.price)».
    price: Number(form.price),
    // Esta línea sirve para declarar la propiedad «dropi_reference» con el valor o tipo «form.dropi_reference.trim() || null».
    dropi_reference: form.dropi_reference.trim() || null,
  })

  // Esta línea sirve para obtener «createMutation» con el hook «useMutation».
  const createMutation = useMutation({
    // Esta línea sirve para enviar el nuevo producto a la API.
    mutationFn: () => api.post("/admin/products", buildPayload()),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «() => {».
    onSuccess: () => {
      // Esta línea sirve para llamar a «setForm» con «EMPTY_FORM».
      setForm(EMPTY_FORM)
      // Esta línea sirve para llamar a «invalidate».
      invalidate()
    },
  })

  // Esta línea sirve para obtener «updateMutation» con el hook «useMutation».
  const updateMutation = useMutation({
    // Esta línea sirve para enviar los cambios del producto a la API.
    mutationFn: (id: number) => api.patch(`/admin/products/${id}`, buildPayload()),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «() => {».
    onSuccess: () => {
      // Esta línea sirve para llamar a «setEditingId» con «null».
      setEditingId(null)
      // Esta línea sirve para llamar a «setForm» con «EMPTY_FORM».
      setForm(EMPTY_FORM)
      // Esta línea sirve para llamar a «invalidate».
      invalidate()
    },
  })

  // Esta línea sirve para obtener «toggleActiveMutation» con el hook «useMutation».
  const toggleActiveMutation = useMutation({
    // Esta línea sirve para declarar la mutación que activa o desactiva un producto.
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      // Esta línea sirve para desactivar el producto si estaba activo o reactivarlo si no.
      active ? api.delete(`/admin/products/${id}`) : api.patch(`/admin/products/${id}`, { active: true }),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «invalidate».
    onSuccess: invalidate,
  })

  // Esta línea sirve para extraer «tartEdi» de «(product: AdminProduct) => {».
  const startEdit = (product: AdminProduct) => {
    // Esta línea sirve para llamar a «setEditingId» con «product.id».
    setEditingId(product.id)
    // Esta línea sirve para cargar el formulario con los datos del producto.
    setForm({
      // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «product.name».
      name: product.name,
      // Esta línea sirve para declarar la propiedad «description» con el valor o tipo «product.description».
      description: product.description,
      // Esta línea sirve para declarar la propiedad «short_description» con el valor o tipo «product.short_description».
      short_description: product.short_description,
      // Esta línea sirve para declarar la propiedad «category» con el valor o tipo «product.category».
      category: product.category,
      // Esta línea sirve para declarar la propiedad «price» con el valor o tipo «product.price».
      price: product.price,
      // Esta línea sirve para declarar la propiedad «dropi_reference» con el valor o tipo «product.dropi_reference ?? ""».
      dropi_reference: product.dropi_reference ?? "",
    })
    // Esta línea sirve para llamar a «formSectionRef.current?.scrollIntoView» con «{ behavior: "smooth", block: "start" }».
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // Esta línea sirve para extraer «ancelEdi» de «() => {».
  const cancelEdit = () => {
    // Esta línea sirve para llamar a «setEditingId» con «null».
    setEditingId(null)
    // Esta línea sirve para llamar a «setForm» con «EMPTY_FORM».
    setForm(EMPTY_FORM)
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-4xl flex-col gap-6». */}
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        {/* Esta línea sirve para mostrar el texto «Productos» dentro de un «h1». */}
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Productos</h1>

        {/* Esta línea sirve para abrir el elemento «section». */}
        <section ref={formSectionRef} className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el valor «editingId ? "Editar producto" : "Nuevo producto"» dentro de un «h2». */}
          <h2 className="font-heading text-sm font-medium">{editingId ? "Editar producto" : "Nuevo producto"}</h2>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-3 grid grid-cols-2 gap-3». */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
            <input
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Nombre».
              placeholder="Nombre"
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.name}».
              value={form.name}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              // Esta línea sirve para aplicar las clases de estilo «col-span-2 rounded-lg border border-input bg-».
              className="col-span-2 rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            />
            {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
            <select
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.category}».
              value={form.category}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}
              // Esta línea sirve para aplicar las clases de estilo «rounded-lg border border-input bg-background ».
              className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            >
              {/* Esta línea sirve para recorrer «CATEGORY_OPTIONS» y mostrar un bloque por elemento. */}
              {CATEGORY_OPTIONS.map((option) => (
                // Esta línea sirve para abrir el elemento «option».
                <option key={option} value={option}>
                  {/* Esta línea sirve para mostrar el contenido dinámico «{CATEGORY_LABELS[option]}». */}
                  {CATEGORY_LABELS[option]}
                </option>
              ))}
            </select>
            {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
            <input
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Precio (COP)».
              placeholder="Precio (COP)"
              // Esta línea sirve para definir el atributo «type» con el valor «number».
              type="number"
              // Esta línea sirve para definir el atributo «min» con el valor «0».
              min="0"
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.price}».
              value={form.price}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              // Esta línea sirve para aplicar las clases de estilo «rounded-lg border border-input bg-background ».
              className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            />
            {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
            <input
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Descripción corta».
              placeholder="Descripción corta"
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.short_description}».
              value={form.short_description}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              // Esta línea sirve para aplicar las clases de estilo «col-span-2 rounded-lg border border-input bg-».
              className="col-span-2 rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            />
            {/* Esta línea sirve para abrir el elemento «textarea» con sus atributos en varias líneas. */}
            <textarea
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Descripción».
              placeholder="Descripción"
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.description}».
              value={form.description}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              // Esta línea sirve para aplicar las clases de estilo «col-span-2 rounded-lg border border-input bg-».
              className="col-span-2 rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            />
            {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
            <input
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Referencia Dropi (opcional)».
              placeholder="Referencia Dropi (opcional)"
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.dropi_reference}».
              value={form.dropi_reference}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setForm({ ...form, dropi_reference: e.target.value })}
              // Esta línea sirve para aplicar las clases de estilo «col-span-2 rounded-lg border border-input bg-».
              className="col-span-2 rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            />
          </div>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-3 flex gap-2». */}
          <div className="mt-3 flex gap-2">
            {/* Esta línea sirve para elegir entre dos bloques según «editingId». */}
            {editingId ? (
              // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
              <>
                {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
                <Button
                  // Esta línea sirve para definir el atributo «size» con el valor «sm».
                  size="sm"
                  // Esta línea sirve para asignar el manejador del evento «onClick».
                  onClick={() => updateMutation.mutate(editingId)}
                  // Esta línea sirve para pasar la propiedad «disabled» con el valor «!form.name || !form.price || updateMutation.i».
                  disabled={!form.name || !form.price || updateMutation.isPending}
                >
                  {/* Esta línea sirve para mostrar el texto «Guardar cambios». */}
                  Guardar cambios
                </Button>
                {/* Esta línea sirve para abrir el componente «Button». */}
                <Button size="sm" variant="outline" onClick={cancelEdit}>
                  {/* Esta línea sirve para mostrar el texto «Cancelar». */}
                  Cancelar
                </Button>
              </>
            // Esta línea sirve para mostrar el bloque alternativo.
            ) : (
              // Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas.
              <Button
                // Esta línea sirve para definir el atributo «size» con el valor «sm».
                size="sm"
                // Esta línea sirve para asignar el manejador del evento «onClick».
                onClick={() => createMutation.mutate()}
                // Esta línea sirve para pasar la propiedad «disabled» con el valor «!form.name || !form.price || createMutation.i».
                disabled={!form.name || !form.price || createMutation.isPending}
              >
                {/* Esta línea sirve para mostrar el texto «Crear». */}
                Crear
              </Button>
            )}
          </div>
        </section>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
          {isLoading && <Skeleton className="h-20 w-full" />}
          {/* Esta línea sirve para mostrar el bloque solo si «!isLoading». */}
          {!isLoading && (
            // Esta línea sirve para abrir el elemento «ul» con las clases «divide-y divide-border».
            <ul className="divide-y divide-border">
              {/* Esta línea sirve para recorrer «products?» y mostrar un bloque por elemento. */}
              {products?.map((product) => (
                // Esta línea sirve para abrir el elemento «li».
                <li key={product.id} className="flex flex-col gap-2 py-2.5">
                  {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-wrap items-center justify-betw». */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Esta línea sirve para abrir el elemento «div». */}
                    <div className={`min-w-0 flex-1 basis-48 text-sm ${product.active ? "" : "opacity-50"}`}>
                      {/* Esta línea sirve para mostrar el valor «product.name». */}
                      {product.name}
                      {/* Esta línea sirve para abrir el elemento «span» con las clases «ml-1 text-xs text-muted-foreground». */}
                      <span className="ml-1 text-xs text-muted-foreground">
                        {/* Esta línea sirve para mostrar la categoría y el precio del producto. */}
                        · {CATEGORY_LABELS[product.category]} · {formatCurrency(product.price)}
                      </span>
                      {/* Esta línea sirve para abrir el componente «Badge». */}
                      <Badge variant={product.active ? "success" : "neutral"} className="ml-2">
                        {/* Esta línea sirve para mostrar el contenido dinámico «{product.active ? "Activo" : "Inactivo"}». */}
                        {product.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-shrink-0 gap-2». */}
                    <div className="flex flex-shrink-0 gap-2">
                      {/* Esta línea sirve para abrir el botón que inicia la edición del producto. */}
                      <Button variant="outline" size="sm" onClick={() => startEdit(product)}>
                        {/* Esta línea sirve para mostrar el texto «Editar». */}
                        Editar
                      </Button>
                      {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
                      <Button
                        // Esta línea sirve para pasar la propiedad «variant» con el valor «product.active ? "destructive" : "outline"}».
                        variant={product.active ? "destructive" : "outline"}
                        // Esta línea sirve para definir el atributo «size» con el valor «sm».
                        size="sm"
                        // Esta línea sirve para asignar el manejador del evento «onClick».
                        onClick={() => toggleActiveMutation.mutate({ id: product.id, active: product.active })}
                        // Esta línea sirve para pasar la propiedad «disabled» con el valor «toggleActiveMutation.isPending}».
                        disabled={toggleActiveMutation.isPending}
                      >
                        {/* Esta línea sirve para mostrar el contenido dinámico «{product.active ? "Desactivar" : "Activar"}». */}
                        {product.active ? "Desactivar" : "Activar"}
                      </Button>
                    </div>
                  </div>
                  {/* Esta línea sirve para abrir el componente «ProductImageControls». */}
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
