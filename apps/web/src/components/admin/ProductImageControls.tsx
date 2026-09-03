import { useRef, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AdminProduct } from "@sanken/core"
import { ApiError } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"

/** Mismo patrón que ExerciseVideoControls, aplicado a la imagen de un producto. */
export function ProductImageControls({ product }: { product: AdminProduct }) {
  const queryClient = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "products"] })

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData()
      formData.append("image", file)
      return api.post(`/admin/products/${product.id}/image`, formData)
    },
    onSuccess: invalidate,
    onError: (err) => setError(err instanceof ApiError ? err.body.message : "No se pudo subir la imagen."),
  })

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/admin/products/${product.id}/image`),
    onSuccess: () => {
      setConfirmingDelete(false)
      invalidate()
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    setError(null)
    uploadMutation.mutate(file)
  }

  return (
    <div className="flex items-center gap-2">
      {product.image && (
        <img
          src={api.mediaUrl(product.image) ?? undefined}
          alt=""
          className="h-10 w-10 rounded-lg border border-border object-cover"
        />
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      <Button
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploadMutation.isPending}
      >
        {uploadMutation.isPending ? "Subiendo…" : product.image ? "Reemplazar imagen" : "Subir imagen"}
      </Button>

      {product.image && (
        <Button variant="destructive" size="sm" onClick={() => setConfirmingDelete(true)}>
          Eliminar imagen
        </Button>
      )}

      {error && <span className="text-xs text-destructive">{error}</span>}

      <ConfirmDialog
        open={confirmingDelete}
        title={`¿Eliminar la imagen de ${product.name}?`}
        description="El producto se queda sin imagen pero sigue funcionando normalmente."
        confirmLabel="Sí, eliminar"
        destructive
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  )
}
