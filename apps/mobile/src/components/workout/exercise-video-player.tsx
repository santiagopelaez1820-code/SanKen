import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet } from 'react-native';
import { Dumbbell } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';

/**
 * Reproductor de video del ejercicio. Este codebase no tiene ningún campo
 * `image_url` para ejercicios (solo `video_url`) -- cuando no hay video, en
 * vez de no renderizar nada se muestra un fallback de marca (gradiente +
 * ícono + nombre), nunca un player vacío. Controles nativos
 * (play/pausa/volumen/fullscreen) vía expo-video.
 *
 * video_url llega relativo ("/storage/exercise-videos/x.mp4") — api.mediaUrl()
 * lo resuelve contra EXPO_PUBLIC_API_URL (el mismo host que ya usa el resto
 * de la app, típicamente un túnel ngrok en dev). Nunca "localhost": desde un
 * celular físico eso apunta al propio celular, no al servidor.
 */
export function ExerciseVideoPlayer({
  videoUrl,
  exerciseName,
}: {
  videoUrl: string | null;
  exerciseName?: string;
}) {
  const theme = useTheme();
  const resolvedUrl = api.mediaUrl(videoUrl);
  const player = useVideoPlayer(resolvedUrl, (p) => {
    p.loop = false;
  });

  if (!resolvedUrl) {
    if (!exerciseName) return null;
    return (
      <ThemedView style={[styles.fallback, { backgroundColor: `${theme.accent}14`, borderColor: `${theme.accentSecondary}30` }]}>
        <ThemedView style={[styles.fallbackIcon, { backgroundColor: theme.background }]}>
          <Dumbbell size={26} color={theme.accent} />
        </ThemedView>
        <ThemedText type="smallBold" style={styles.fallbackName}>
          {exerciseName}
        </ThemedText>
      </ThemedView>
    );
  }

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
  fallback: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: Spacing.three,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  fallbackIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackName: {
    textAlign: 'center',
    paddingHorizontal: Spacing.four,
  },
});
