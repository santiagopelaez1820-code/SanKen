// Esta línea sirve para importar «useEvent» desde «expo».
import { useEvent } from 'expo';
// Esta línea sirve para importar «useVideoPlayer, VideoView» desde «expo-video».
import { useVideoPlayer, VideoView } from 'expo-video';
// Esta línea sirve para importar «StyleSheet» desde «react-native».
import { StyleSheet } from 'react-native';
// Esta línea sirve para importar «Dumbbell» desde «lucide-react-native».
import { Dumbbell } from 'lucide-react-native';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';

/**
 * Reproductor de video del ejercicio. Este codebase no tiene ningún campo
 * `image_url` para ejercicios (solo `video_url`) -- cuando no hay video, en
 * vez de no renderizar nada se muestra un fallback de marca (gradiente +
 * ícono + nombre), nunca un player vacío. Controles nativos
 * (play/pausa/volumen/fullscreen) vía expo-video.
 *
 * video_url es un secure_url de Cloudinary en producción (api.mediaUrl con
 * la variante 'video' pide un MP4 H.264 a 720 px como máximo) o, en dev,
 * una ruta relativa ("/storage/exercise-videos/x.mp4") que api.mediaUrl()
 * resuelve contra EXPO_PUBLIC_API_URL. Nunca "localhost": desde un celular
 * físico eso apunta al propio celular, no al servidor.
 *
 * Si el video no carga (sin conexión, recurso borrado, CDN caído) se
 * muestra el mismo fallback de marca en vez de un recuadro negro.
 */
// Esta línea sirve para declarar la función «ExerciseVideoPlayer».
export function ExerciseVideoPlayer({
  // Esta línea sirve para incluir el valor «videoUrl» en la lista.
  videoUrl,
  // Esta línea sirve para incluir el valor «exerciseName» en la lista.
  exerciseName,
  // Esta línea sirve para incluir el valor «autoPlay» en la lista.
  autoPlay = false,
// Esta línea sirve para cerrar la desestructuración y abrir los tipos.
}: {
  // Esta línea sirve para declarar la propiedad «videoUrl» con el valor o tipo «string | null».
  videoUrl: string | null;
  // Esta línea sirve para declarar la propiedad «exerciseName» con el valor o tipo «string».
  exerciseName?: string;
  /**
   * Arranca solo, en loop y sin sonido (pedido del tester para la sesión de
   * entrenamiento: el video es la demo de la técnica, no hay que tocar play
   * entre serie y serie). Sin sonido porque los sistemas suelen bloquear el
   * autoplay con audio y el usuario suele tener su propia música; los
   * controles nativos siguen ahí. useVideoPlayer recrea el player al cambiar
   * de ejercicio, así que este setup vuelve a correr en cada uno.
   */
  // Esta línea sirve para declarar la propiedad «autoPlay» con el valor o tipo «boolean».
  autoPlay?: boolean;
// Esta línea sirve para cerrar los parámetros y abrir el cuerpo.
}) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para extraer «esolvedUr» de «api.mediaUrl(videoUrl, 'video')».
  const resolvedUrl = api.mediaUrl(videoUrl, 'video');
  // Esta línea sirve para obtener «player» con el hook «useVideoPlayer».
  const player = useVideoPlayer(resolvedUrl, (p) => {
    // Esta línea sirve para asignar «autoPlay» a «p.loop».
    p.loop = autoPlay;
    // Esta línea sirve para revisar si «autoPlay».
    if (autoPlay) {
      // Esta línea sirve para asignar «true» a «p.muted».
      p.muted = true;
      // Esta línea sirve para llamar a «p.play».
      p.play();
    }
  });
  // Esta línea sirve para obtener «status» con el hook «useEvent».
  const { status } = useEvent(player, 'statusChange', { status: player.status });

  // Esta línea sirve para revisar si «!resolvedUrl || status === 'error'».
  if (!resolvedUrl || status === 'error') {
    // Esta línea sirve para devolver null si «!resolvedUrl && !exerciseName».
    if (!resolvedUrl && !exerciseName) return null;
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el componente «ThemedView».
      <ThemedView style={[styles.fallback, { backgroundColor: `${theme.accent}14`, borderColor: `${theme.accentSecondary}30` }]}>
        {/* Esta línea sirve para abrir el componente «ThemedView». */}
        <ThemedView style={[styles.fallbackIcon, { backgroundColor: theme.background }]}>
          {/* Esta línea sirve para abrir el componente «Dumbbell». */}
          <Dumbbell size={26} color={theme.accent} />
        </ThemedView>
        {/* Esta línea sirve para mostrar el bloque solo si «exerciseName». */}
        {exerciseName && (
          // Esta línea sirve para abrir el componente «ThemedText».
          <ThemedText type="smallBold" style={styles.fallbackName}>
            {/* Esta línea sirve para mostrar el valor «exerciseName». */}
            {exerciseName}
          </ThemedText>
        )}
        {/* Esta línea sirve para mostrar el bloque solo si «status === 'error'». */}
        {status === 'error' && (
          // Esta línea sirve para abrir el componente «ThemedText».
          <ThemedText type="small" themeColor="textSecondary" style={styles.fallbackName}>
            {/* Esta línea sirve para mostrar el texto «No se pudo cargar el video.». */}
            No se pudo cargar el video.
          </ThemedText>
        )}
      </ThemedView>
    );
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «VideoView» con sus atributos en varias líneas.
    <VideoView
      // Esta línea sirve para pasar la propiedad «style» con el valor «styles.player}».
      style={styles.player}
      // Esta línea sirve para pasar la propiedad «player» con el valor «player}».
      player={player}
      // Esta línea sirve para activar la opción «nativeControls».
      nativeControls
      // Esta línea sirve para definir el atributo «contentFit» con el valor «contain».
      contentFit="contain"
    />
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «player» con el valor o tipo «{».
  player: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
    // Esta línea sirve para declarar la propiedad «aspectRatio» con el valor o tipo «16 / 9».
    aspectRatio: 16 / 9,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'#000'».
    backgroundColor: '#000',
  },
  // Esta línea sirve para declarar la propiedad «fallback» con el valor o tipo «{».
  fallback: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
    // Esta línea sirve para declarar la propiedad «aspectRatio» con el valor o tipo «16 / 9».
    aspectRatio: 16 / 9,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «fallbackIcon» con el valor o tipo «{».
  fallbackIcon: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «56».
    width: 56,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «56».
    height: 56,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «28».
    borderRadius: 28,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
  // Esta línea sirve para declarar la propiedad «fallbackName» con el valor o tipo «{».
  fallbackName: {
    // Esta línea sirve para declarar la propiedad «textAlign» con el valor o tipo «'center'».
    textAlign: 'center',
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.four».
    paddingHorizontal: Spacing.four,
  },
});
