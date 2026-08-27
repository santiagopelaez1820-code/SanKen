import { useEffect, useState } from 'react';
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

  // Si la URL cambia (nueva foto, o el usuario vuelve a intentar), hay que
  // darle otra oportunidad de cargar en vez de quedar pegado en el error
  // de la URL anterior.
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [resolvedUrl]);

  if (resolvedUrl && !failed) {
    return (
      <Image
        source={{ uri: resolvedUrl }}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        contentFit="cover"
        transition={150}
        // Una URL que no carga (backend momentáneamente inalcanzable, foto
        // borrada del disco, etc.) no debe dejar un ícono de "imagen rota"
        // — mejor la inicial, que es el mismo fallback que ya se usa
        // cuando directamente no hay avatar_url.
        onError={() => setFailed(true)}
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
