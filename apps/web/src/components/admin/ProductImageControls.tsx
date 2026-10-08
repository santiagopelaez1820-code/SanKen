// Esta línea sirve para importar «useRef, useState» desde «react».
import { useRef, useState } from "react"
// Esta línea sirve para importar «useMutation, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar los tipos «AdminProduct» desde «@sanken/core».
import type { AdminProduct } from "@sanken/core"
// Esta línea sirve para importar «ApiError» desde «@sanken/core».
import { ApiError } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «ConfirmDialog» desde «@/components/ui/ConfirmDialog».
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"

/** Mismo patrón que ExerciseVideoControls, aplicado a la imagen de un producto. */
// Esta línea sirve para declarar el componente de controles de imagen de un producto.
export function ProductImageControls({ product }: { product: AdminProduct }) {
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para crear la referencia «inputRef».
  const inputRef = useRef<HTMLInputElement>(null)
  // Esta línea sirve para guardar si se está confirmando el borrado.
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  // Esta línea sirve para guardar el mensaje de error.
  const [error, setError] = useState<string | null>(null)

  // Esta línea sirve para declarar la función que refresca la lista de productos.
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "products"] })

  // Esta línea sirve para obtener «uploadMutation» con el hook «useMutation».
  const uploadMutation = useMutation({
    // Esta línea sirve para declarar la propiedad «mutationFn» con el valor o tipo «(file: File) => {».
    mutationFn: (file: File) => {
      // Esta línea sirve para crear el formulario multipart.
      const formData = new FormData()
      // Esta línea sirve para agregar el archivo de imagen al formulario.
      formData.append("image", file)
      // Esta línea sirve para enviar la imagen a la API.
      return api.post(`/admin/products/${product.id}/image`, formData)
    },
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «invalidate».
    onSuccess: invalidate,
    // Esta línea sirve para mostrar el mensaje de error de la API o uno genérico.
    onError: (err) => setError(err instanceof ApiError ? err.body.message : "No se pudo subir la imagen."),
  })

  // Esta línea sirve para obtener «deleteMutation» con el hook «useMutation».
  const deleteMutation = useMutation({
    // Esta línea sirve para enviar la petición de borrado de la imagen.
    mutationFn: () => api.delete(`/admin/products/${product.id}/image`),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «() => {».
    onSuccess: () => {
      // Esta línea sirve para cerrar el diálogo de confirmación.
      setConfirmingDelete(false)
      // Esta línea sirve para refrescar la lista de productos.
      invalidate()
    },
  })

  // Esta línea sirve para declarar el manejador del cambio de archivo.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Esta línea sirve para tomar el primer archivo elegido.
    const file = e.target.files?.[0]
    // Esta línea sirve para limpiar el input para poder elegir el mismo archivo otra vez.
    e.target.value = ""
    // Esta línea sirve para salir si no se eligió archivo.
    if (!file) return
    // Esta línea sirve para limpiar el error anterior.
    setError(null)
    // Esta línea sirve para iniciar la subida del archivo.
    uploadMutation.mutate(file)
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «flex flex-wrap items-center gap-2».
    <div className="flex flex-wrap items-center gap-2">
      {/* Esta línea sirve para mostrar el bloque solo si «product.image». */}
      {product.image && (
        // Esta línea sirve para abrir el elemento «img» con sus atributos en varias líneas.
        <img
          // Esta línea sirve para pasar la propiedad «src» con el valor «api.mediaUrl(product.image, "productCard") ??».
          src={api.mediaUrl(product.image, "productCard") ?? undefined}
          // Esta línea sirve para definir el atributo «alt» con el valor «».
          alt=""
          // Esta línea sirve para aplicar las clases de estilo «h-10 w-10 rounded-lg border border-border obj».
          className="h-10 w-10 rounded-lg border border-border object-cover"
        />
      )}

      {/* Esta línea sirve para abrir el elemento «input». */}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
      <Button
        // Esta línea sirve para definir el atributo «variant» con el valor «outline».
        variant="outline"
        // Esta línea sirve para definir el atributo «size» con el valor «sm».
        size="sm"
        // Esta línea sirve para asignar el manejador del evento «onClick».
        onClick={() => inputRef.current?.click()}
        // Esta línea sirve para pasar la propiedad «disabled» con el valor «uploadMutation.isPending}».
        disabled={uploadMutation.isPending}
      >
        {/* Esta línea sirve para mostrar el texto según el estado de la subida y si ya hay imagen. */}
        {uploadMutation.isPending ? "Subiendo…" : product.image ? "Reemplazar imagen" : "Subir imagen"}
      </Button>

      {/* Esta línea sirve para mostrar el bloque solo si «product.image». */}
      {product.image && (
        // Esta línea sirve para abrir el botón de eliminar en estilo destructivo.
        <Button variant="destructive" size="sm" onClick={() => setConfirmingDelete(true)}>
          {/* Esta línea sirve para mostrar el texto «Eliminar imagen». */}
          Eliminar imagen
        </Button>
      )}

      {/* Esta línea sirve para mostrar el elemento solo si «error». */}
      {error && <span className="text-xs text-destructive">{error}</span>}

      {/* Esta línea sirve para abrir el elemento «ConfirmDialog» con sus atributos en varias líneas. */}
      <ConfirmDialog
        // Esta línea sirve para pasar la propiedad «open» con el valor «confirmingDelete}».
        open={confirmingDelete}
        // Esta línea sirve para pasar la propiedad «title» con el valor «`¿Eliminar la imagen de ${product.name}?`}».
        title={`¿Eliminar la imagen de ${product.name}?`}
        // Esta línea sirve para definir el atributo «description».
        description="El producto se queda sin imagen pero sigue funcionando normalmente."
        // Esta línea sirve para definir el atributo «confirmLabel» con el valor «Sí, eliminar».
        confirmLabel="Sí, eliminar"
        // Esta línea sirve para marcar la acción de confirmar como destructiva.
        destructive
        // Esta línea sirve para pasar la propiedad «isLoading» con el valor «deleteMutation.isPending}».
        isLoading={deleteMutation.isPending}
        // Esta línea sirve para asignar el manejador del evento «onConfirm».
        onConfirm={() => deleteMutation.mutate()}
        // Esta línea sirve para asignar el manejador del evento «onCancel».
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  )
}
