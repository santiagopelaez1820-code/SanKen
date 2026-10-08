// Esta línea sirve para importar los hooks de React para referencia y estado.
import { useRef, useState } from "react"
// Esta línea sirve para importar las herramientas de React Query para mutaciones y caché.
import { useMutation, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar el tipo del ejercicio de administración.
import type { AdminExercise } from "@sanken/core"
// Esta línea sirve para importar el error tipado de la API.
import { ApiError } from "@sanken/core"
// Esta línea sirve para importar el cliente de la API.
import { api } from "@/lib/api"
// Esta línea sirve para importar el botón de la interfaz.
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar el diálogo de confirmación.
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"

/**
 * El admin sube su propio archivo de video por ejercicio — sin búsqueda
 * automática, sin YouTube, sin APIs externas (instrucción explícita del
 * pedido). Reemplazar sube primero y borra el archivo viejo recién cuando
 * el nuevo ya quedó confirmado (lo garantiza el backend, ver
 * AdminExerciseController::uploadVideo).
 */
// Esta línea sirve para declarar el componente de controles de video de un ejercicio.
export function ExerciseVideoControls({ exercise }: { exercise: AdminExercise }) {
  // Esta línea sirve para obtener el cliente de caché de React Query.
  const queryClient = useQueryClient()
  // Esta línea sirve para crear la referencia al input de archivo oculto.
  const inputRef = useRef<HTMLInputElement>(null)
  // Esta línea sirve para guardar si se está confirmando el borrado.
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  // Esta línea sirve para guardar el mensaje de error.
  const [error, setError] = useState<string | null>(null)

  // Esta línea sirve para declarar la función que refresca la lista de ejercicios.
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "exercises"] })

  // Esta línea sirve para declarar la mutación que sube el video.
  const uploadMutation = useMutation({
    // Esta línea sirve para declarar la función que envía el archivo.
    mutationFn: (file: File) => {
      // Esta línea sirve para crear el formulario multipart.
      const formData = new FormData()
      // Esta línea sirve para agregar el archivo de video al formulario.
      formData.append("video", file)
      // Esta línea sirve para enviar el video a la API.
      return api.post(`/admin/exercises/${exercise.id}/video`, formData)
    },
    // Esta línea sirve para refrescar la lista al subir con éxito.
    onSuccess: invalidate,
    // Esta línea sirve para mostrar el mensaje de error de la API o uno genérico.
    onError: (err) => setError(err instanceof ApiError ? err.body.message : "No se pudo subir el video."),
  })

  // Esta línea sirve para declarar la mutación que borra el video.
  const deleteMutation = useMutation({
    // Esta línea sirve para enviar la petición de borrado a la API.
    mutationFn: () => api.delete(`/admin/exercises/${exercise.id}/video`),
    // Esta línea sirve para declarar lo que pasa al borrar con éxito.
    onSuccess: () => {
      // Esta línea sirve para cerrar el diálogo de confirmación.
      setConfirmingDelete(false)
      // Esta línea sirve para refrescar la lista de ejercicios.
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

  // Esta línea sirve para devolver la interfaz.
  return (
    // Esta línea sirve para abrir el contenedor flexible de los controles.
    <div className="flex flex-wrap items-center gap-2">
      {/* Esta línea sirve para abrir el texto del estado del video. */}
      <span className="text-xs text-muted-foreground">
        {/* Esta línea sirve para mostrar si el video está disponible. */}
        {exercise.video_url ? "✅ Disponible" : "❌ Sin video"}
      </span>

      {/* Esta línea sirve para mostrar el enlace de ver solo si existe el video. */}
      {exercise.video_url && (
        // Esta línea sirve para abrir el enlace al video.
        <a
          // Esta línea sirve para apuntar a la URL del video en el CDN.
          href={api.mediaUrl(exercise.video_url, "video") ?? exercise.video_url}
          // Esta línea sirve para abrir el enlace en una pestaña nueva.
          target="_blank"
          // Esta línea sirve para evitar que la pestaña nueva acceda a la ventana original.
          rel="noreferrer"
          // Esta línea sirve para aplicar los estilos del enlace.
          className="text-xs font-medium text-primary underline-offset-4 hover:underline"
        >
          {/* Esta línea sirve para mostrar el texto del enlace. */}
          Ver
        </a>
      )}

      {/* Esta línea sirve para abrir el input de archivo oculto. */}
      <input
        // Esta línea sirve para conectar el input con la referencia.
        ref={inputRef}
        // Esta línea sirve para indicar que acepta archivos.
        type="file"
        // Esta línea sirve para limitar a los formatos de video permitidos.
        accept="video/mp4,video/webm,video/quicktime"
        // Esta línea sirve para ocultar el input para usar el botón en su lugar.
        className="hidden"
        // Esta línea sirve para llamar al manejador al elegir un archivo.
        onChange={handleFileChange}
      />

      {/* Esta línea sirve para abrir el botón de subir o reemplazar. */}
      <Button
        // Esta línea sirve para usar el estilo con borde.
        variant="outline"
        // Esta línea sirve para usar el tamaño pequeño.
        size="sm"
        // Esta línea sirve para abrir el selector de archivos al hacer clic.
        onClick={() => inputRef.current?.click()}
        // Esta línea sirve para deshabilitar mientras se sube.
        disabled={uploadMutation.isPending}
      >
        {/* Esta línea sirve para mostrar el texto según el estado de la subida y si ya hay video. */}
        {uploadMutation.isPending ? "Subiendo…" : exercise.video_url ? "Reemplazar" : "Subir"}
      </Button>

      {/* Esta línea sirve para mostrar el botón de eliminar solo si existe el video. */}
      {exercise.video_url && (
        // Esta línea sirve para abrir el botón de eliminar en estilo destructivo.
        <Button variant="destructive" size="sm" onClick={() => setConfirmingDelete(true)}>
          {/* Esta línea sirve para mostrar el texto del botón. */}
          Eliminar
        </Button>
      )}

      {/* Esta línea sirve para mostrar el error si existe. */}
      {error && <span className="text-xs text-destructive">{error}</span>}

      {/* Esta línea sirve para abrir el diálogo de confirmación de borrado. */}
      <ConfirmDialog
        // Esta línea sirve para controlar si el diálogo está abierto.
        open={confirmingDelete}
        // Esta línea sirve para definir el título con el nombre del ejercicio.
        title={`¿Eliminar el video de ${exercise.name}?`}
        // Esta línea sirve para definir la explicación de la consecuencia.
        description="El ejercicio se queda sin video pero sigue funcionando normalmente."
        // Esta línea sirve para definir el texto del botón de confirmar.
        confirmLabel="Sí, eliminar"
        // Esta línea sirve para marcar la acción como destructiva.
        destructive
        // Esta línea sirve para mostrar estado de carga mientras se borra.
        isLoading={deleteMutation.isPending}
        // Esta línea sirve para borrar el video al confirmar.
        onConfirm={() => deleteMutation.mutate()}
        // Esta línea sirve para cerrar el diálogo al cancelar.
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  )
}
