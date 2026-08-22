import { Dumbbell } from "lucide-react"
import { api } from "@/lib/api"

function toEmbedUrl(url: string): string | null {
  const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`

  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`

  return null
}

interface ExerciseVideoPlayerProps {
  videoUrl: string | null
  exerciseName: string
}

/**
 * Reproductor de video del ejercicio. Este codebase no tiene ningún campo
 * `image_url` para ejercicios (solo `video_url`) -- cuando no hay video, en
 * vez de no renderizar nada se muestra un fallback de marca (gradiente +
 * ícono + nombre), nunca un player vacío ni una imagen rota. Soporta MP4
 * directo (controles nativos del navegador: play/pausa/volumen/fullscreen) o
 * una URL de YouTube/Vimeo, embebida in-app en vez de abrir otra pestaña.
 */
export function ExerciseVideoPlayer({ videoUrl, exerciseName }: ExerciseVideoPlayerProps) {
  const resolvedUrl = api.mediaUrl(videoUrl)

  if (!resolvedUrl) {
    return (
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/15 via-card to-secondary-accent/15">
        <div className="absolute -top-8 -left-8 size-32 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-8 -bottom-8 size-32 rounded-full bg-secondary-accent/20 blur-3xl" />
        <div className="relative flex flex-col items-center gap-2 px-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-background/60">
            <Dumbbell className="size-6 text-primary" />
          </div>
          <p className="font-heading text-sm font-medium text-foreground">{exerciseName}</p>
        </div>
      </div>
    )
  }

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
