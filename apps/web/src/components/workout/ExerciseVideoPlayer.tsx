// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «Dumbbell» desde «lucide-react».
import { Dumbbell } from "lucide-react"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"

// Esta línea sirve para declarar la función que convierte un enlace de YouTube o Vimeo en URL para incrustar.
function toEmbedUrl(url: string, autoPlay: boolean): string | null {
  // Esta línea sirve para buscar el identificador del video de YouTube en la URL.
  const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
  // Esta línea sirve para revisar si «youtube».
  if (youtube) {
    // Esta línea sirve para declarar «id» con el valor «youtube[1]».
    const id = youtube[1]
    // loop en YouTube exige repetir el id en `playlist`.
    // Esta línea sirve para devolver la URL de YouTube con reproducción automática y en bucle si se pidió.
    return `https://www.youtube.com/embed/${id}${autoPlay ? `?autoplay=1&mute=1&loop=1&playlist=${id}&playsinline=1` : ""}`
  }

  // Esta línea sirve para declarar «vimeo» con el valor «url.match(/vimeo\.com\/(\d+)/)».
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  // Esta línea sirve para devolver la URL de Vimeo si coincide, con reproducción automática si se pidió.
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}${autoPlay ? "?autoplay=1&muted=1&loop=1" : ""}`

  // Esta línea sirve para devolver null.
  return null
}

// Esta línea sirve para declarar la interfaz «ExerciseVideoPlayerProps».
interface ExerciseVideoPlayerProps {
  // Esta línea sirve para declarar la propiedad «videoUrl» con el valor o tipo «string | null».
  videoUrl: string | null
  // Esta línea sirve para declarar la propiedad «exerciseName» con el valor o tipo «string».
  exerciseName: string
  /**
   * Arranca solo, en loop y sin sonido (pedido del tester para la sesión de
   * entrenamiento). Sin sonido porque los navegadores bloquean el autoplay
   * con audio; los controles siguen disponibles para activarlo.
   */
  // Esta línea sirve para declarar la propiedad «autoPlay» con el valor o tipo «boolean».
  autoPlay?: boolean
}

/**
 * Reproductor de video del ejercicio. Este codebase no tiene ningún campo
 * `image_url` para ejercicios (solo `video_url`) -- cuando no hay video, en
 * vez de no renderizar nada se muestra un fallback de marca (gradiente +
 * ícono + nombre), nunca un player vacío ni una imagen rota. Soporta MP4
 * directo (controles nativos del navegador: play/pausa/volumen/fullscreen) o
 * una URL de YouTube/Vimeo, embebida in-app en vez de abrir otra pestaña.
 */
// Esta línea sirve para declarar el reproductor de video de un ejercicio.
export function ExerciseVideoPlayer({ videoUrl, exerciseName, autoPlay = false }: ExerciseVideoPlayerProps) {
  // Esta línea sirve para declarar «resolvedUrl» con el valor «api.mediaUrl(videoUrl, "video")».
  const resolvedUrl = api.mediaUrl(videoUrl, "video")
  // Un video que no carga (sin conexión, borrado, CDN caído) muestra el
  // mismo fallback de marca que un ejercicio sin video.
  // Esta línea sirve para guardar la URL del video que falló al cargar.
  const [failedUrl, setFailedUrl] = useState<string | null>(null)

  // Esta línea sirve para revisar si «!resolvedUrl || resolvedUrl === failedUrl».
  if (!resolvedUrl || resolvedUrl === failedUrl) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el elemento «div» con las clases «relative flex aspect-video w-full items-».
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/15 via-card to-secondary-accent/15">
        {/* Esta línea sirve para abrir el elemento «div» con las clases «absolute -top-8 -left-8 size-32 rounded-». */}
        <div className="absolute -top-8 -left-8 size-32 rounded-full bg-primary/20 blur-3xl" />
        {/* Esta línea sirve para abrir el elemento «div» con las clases «absolute -right-8 -bottom-8 size-32 roun». */}
        <div className="absolute -right-8 -bottom-8 size-32 rounded-full bg-secondary-accent/20 blur-3xl" />
        {/* Esta línea sirve para abrir el elemento «div» con las clases «relative flex flex-col items-center gap-». */}
        <div className="relative flex flex-col items-center gap-2 px-4 text-center">
          {/* Esta línea sirve para abrir el elemento «div» con las clases «flex size-14 items-center justify-center». */}
          <div className="flex size-14 items-center justify-center rounded-full bg-background/60">
            {/* Esta línea sirve para abrir el componente «Dumbbell». */}
            <Dumbbell className="size-6 text-primary" />
          </div>
          {/* Esta línea sirve para mostrar el nombre del ejercicio. */}
          <p className="font-heading text-sm font-medium text-foreground">{exerciseName}</p>
        </div>
      </div>
    )
  }

  // Esta línea sirve para declarar «embedUrl» con el valor «toEmbedUrl(resolvedUrl, autoPlay)».
  const embedUrl = toEmbedUrl(resolvedUrl, autoPlay)

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «aspect-video w-full overflow-hidden roun».
    <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-black">
      {/* Esta línea sirve para elegir entre dos bloques según «embedUrl». */}
      {embedUrl ? (
        // Esta línea sirve para abrir el elemento «iframe» con sus atributos en varias líneas.
        <iframe
          // Esta línea sirve para identificar el elemento de la lista con «embedUrl}».
          key={embedUrl}
          // Esta línea sirve para pasar la propiedad «src» con el valor «embedUrl}».
          src={embedUrl}
          // Esta línea sirve para aplicar las clases de estilo «h-full w-full».
          className="h-full w-full"
          // Esta línea sirve para definir el atributo «allow».
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          // Esta línea sirve para permitir pantalla completa.
          allowFullScreen
          // Esta línea sirve para definir el atributo «title» con el valor «Video del ejercicio».
          title="Video del ejercicio"
        />
      // Esta línea sirve para mostrar el bloque alternativo.
      ) : (
        // Esta línea sirve para abrir el elemento «video» con sus atributos en varias líneas.
        <video
          // Esta línea sirve para identificar el elemento de la lista con «resolvedUrl}».
          key={resolvedUrl}
          // Esta línea sirve para pasar la propiedad «src» con el valor «resolvedUrl}».
          src={resolvedUrl}
          // Esta línea sirve para mostrar los controles del video.
          controls
          // Esta línea sirve para reproducir en línea en móviles.
          playsInline
          // Esta línea sirve para pasar la propiedad «autoPlay» con el valor «autoPlay}».
          autoPlay={autoPlay}
          // Esta línea sirve para pasar la propiedad «muted» con el valor «autoPlay}».
          muted={autoPlay}
          // Esta línea sirve para pasar la propiedad «loop» con el valor «autoPlay}».
          loop={autoPlay}
          // Esta línea sirve para asignar el manejador del evento «onError».
          onError={() => setFailedUrl(resolvedUrl)}
          // Esta línea sirve para aplicar las clases de estilo «h-full w-full object-contain».
          className="h-full w-full object-contain"
        />
      )}
    </div>
  )
}
