import { useRef, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AdminExercise } from "@sanken/core"
import { ApiError } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"

/**
 * El admin sube su propio archivo de video por ejercicio — sin búsqueda
 * automática, sin YouTube, sin APIs externas (instrucción explícita del
 * pedido). Reemplazar sube primero y borra el archivo viejo recién cuando
 * el nuevo ya quedó confirmado (lo garantiza el backend, ver
 * AdminExerciseController::uploadVideo).
 */
export function ExerciseVideoControls({ exercise }: { exercise: AdminExercise }) {
  const queryClient = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "exercises"] })

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData()
      formData.append("video", file)
      return api.post(`/admin/exercises/${exercise.id}/video`, formData)
    },
    onSuccess: invalidate,
    onError: (err) => setError(err instanceof ApiError ? err.body.message : "No se pudo subir el video."),
  })

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/admin/exercises/${exercise.id}/video`),
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
      <span className="text-xs text-muted-foreground">
        {exercise.video_url ? "✅ Disponible" : "❌ Sin video"}
      </span>

      {exercise.video_url && (
        <a
          href={api.mediaUrl(exercise.video_url) ?? exercise.video_url}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-medium text-primary underline-offset-4 hover:underline"
        >
          Ver
        </a>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={handleFileChange}
      />

      <Button
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploadMutation.isPending}
      >
        {uploadMutation.isPending ? "Subiendo…" : exercise.video_url ? "Reemplazar" : "Subir"}
      </Button>

      {exercise.video_url && (
        <Button variant="destructive" size="sm" onClick={() => setConfirmingDelete(true)}>
          Eliminar
        </Button>
      )}

      {error && <span className="text-xs text-destructive">{error}</span>}

      <ConfirmDialog
        open={confirmingDelete}
        title={`¿Eliminar el video de ${exercise.name}?`}
        description="El ejercicio se queda sin video pero sigue funcionando normalmente."
        confirmLabel="Sí, eliminar"
        destructive
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  )
}
