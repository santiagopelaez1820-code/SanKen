import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';

interface AvatarProps {
  name: string | null | undefined;
  avatarUrl: string | null | undefined;
  /** Diámetro en px — cada pantalla pasa el tamaño que necesita (ej. 32 en una fila, 96 en el header de perfil). */
  size: number;
}

/**
 * Única fuente de verdad visual para "cómo se ve el usuario": foto si
 * avatar_url existe, inicial del nombre si no. Cualquier lugar de la app
 * que muestre al usuario autenticado debe pasar por acá en vez de
 * reimplementar el círculo con inicial a mano.
 */
export function Avatar({ name, avatarUrl, size }: AvatarProps) {
  const theme = useTheme();
  const resolvedUrl = api.mediaUrl(avatarUrl);
  const initial = name?.trim()?.[0]?.toUpperCase() ?? '?';

  if (resolvedUrl) {
    return (
      <Image
        source={{ uri: resolvedUrl }}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        contentFit="cover"
        transition={150}
      />
    );
  }

  return (
    <ThemedView
      type="backgroundSelected"
      style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}>
      <ThemedText type="title" style={{ fontSize: size * 0.4, color: theme.text }}>
        {initial}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: 'transparent',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
