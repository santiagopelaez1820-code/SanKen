import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';
import { api } from '@/lib/api';

/**
 * Reproductor de video del ejercicio. Si no hay video_url no renderiza nada
 * (sección 40 del pedido) — nunca un player vacío ni un error. Controles
 * nativos (play/pausa/volumen/fullscreen) vía expo-video.
 *
 * video_url llega relativo ("/storage/exercise-videos/x.mp4") — api.mediaUrl()
 * lo resuelve contra EXPO_PUBLIC_API_URL (el mismo host que ya usa el resto
 * de la app, típicamente un túnel ngrok en dev). Nunca "localhost": desde un
 * celular físico eso apunta al propio celular, no al servidor.
 */
export function ExerciseVideoPlayer({ videoUrl }: { videoUrl: string | null }) {
  const resolvedUrl = api.mediaUrl(videoUrl);
  const player = useVideoPlayer(resolvedUrl, (p) => {
    p.loop = false;
  });

  if (!resolvedUrl) return null;

  return (
    <VideoView
      style={styles.player}
      player={player}
      nativeControls
      contentFit="contain"
    />
  );
}

const styles = StyleSheet.create({
  player: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: Spacing.three,
    backgroundColor: '#000',
  },
});
