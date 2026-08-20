import { api } from "@/lib/api"

function toEmbedUrl(url: string): string | null {
  const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`

  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`

  return null
}

/**
 * Reproductor de video del ejercicio. Si no hay video_url no renderiza nada
 * (sección 40 del pedido) — nunca un player vacío ni un error. Soporta MP4
 * directo (controles nativos del navegador: play/pausa/volumen/fullscreen) o
 * una URL de YouTube/Vimeo, embebida in-app en vez de abrir otra pestaña.
 */
export function ExerciseVideoPlayer({ videoUrl }: { videoUrl: string | null }) {
  const resolvedUrl = api.mediaUrl(videoUrl)
  if (!resolvedUrl) return null

  const embedUrl = toEmbedUrl(resolvedUrl)

  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-black">
      {embedUrl ? (
        <iframe
          key={embedUrl}
          src={embedUrl}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video del ejercicio"
        />
      ) : (
        <video key={resolvedUrl} src={resolvedUrl} controls playsInline className="h-full w-full object-contain" />
      )}
    </div>
  )
}
