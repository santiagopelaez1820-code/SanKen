// Esta línea sirve para importar «useState» desde «react».
import { useState } from 'react';
// Esta línea sirve para importar «Image» desde «expo-image».
import { Image } from 'expo-image';
// Esta línea sirve para importar «StyleSheet» desde «react-native».
import { StyleSheet } from 'react-native';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';

// Esta línea sirve para declarar la interfaz «AvatarProps».
interface AvatarProps {
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «string | null | undefined».
  name: string | null | undefined;
  // Esta línea sirve para declarar la propiedad «avatarUrl» con el valor o tipo «string | null | undefined».
  avatarUrl: string | null | undefined;
  /** Diámetro en px — cada pantalla pasa el tamaño que necesita (ej. 32 en una fila, 96 en el header de perfil). */
  // Esta línea sirve para declarar la propiedad «size» con el valor o tipo «number».
  size: number;
}

/**
 * Única fuente de verdad visual para "cómo se ve el usuario": foto si
 * avatar_url existe, inicial del nombre si no. Cualquier lugar de la app
 * que muestre al usuario autenticado debe pasar por acá en vez de
 * reimplementar el círculo con inicial a mano.
 */
// Esta línea sirve para declarar la función «Avatar».
export function Avatar({ name, avatarUrl, size }: AvatarProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Nunca descargar una foto grande para un círculo chico (Cloudinary
  // recorta centrado en la cara y entrega el formato óptimo).
  // Esta línea sirve para extraer «esolvedUr» de «api.mediaUrl(avatarUrl, size <= 48 ? 'av».
  const resolvedUrl = api.mediaUrl(avatarUrl, size <= 48 ? 'avatarSmall' : 'avatarLarge');
  // Esta línea sirve para extraer «nitia» de «name?.trim()?.[0]?.toUpperCase() ?? '?'».
  const initial = name?.trim()?.[0]?.toUpperCase() ?? '?';

  // Si la URL cambia (nueva foto, o el usuario vuelve a intentar), hay que
  // darle otra oportunidad de cargar en vez de quedar pegado en el error
  // de la URL anterior -- ajuste de estado durante el render en vez de un
  // efecto (compara contra la URL anterior y resetea en la misma pasada).
  // Esta línea sirve para crear el estado «failed» y su función «setFailed».
  const [failed, setFailed] = useState(false);
  // Esta línea sirve para crear el estado «prevResolvedUrl» y su función «setPrevResolvedUrl».
  const [prevResolvedUrl, setPrevResolvedUrl] = useState(resolvedUrl);
  // Esta línea sirve para revisar si «resolvedUrl !== prevResolvedUrl».
  if (resolvedUrl !== prevResolvedUrl) {
    // Esta línea sirve para guardar en el estado con «setPrevResolvedUrl» el valor «resolvedUrl)…».
    setPrevResolvedUrl(resolvedUrl);
    // Esta línea sirve para guardar en el estado con «setFailed» el valor «false)…».
    setFailed(false);
  }

  // Esta línea sirve para revisar si «resolvedUrl && !failed».
  if (resolvedUrl && !failed) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el elemento «Image» con sus atributos en varias líneas.
      <Image
        // Esta línea sirve para pasar la propiedad «source» con el valor «{ uri: resolvedUrl }}».
        source={{ uri: resolvedUrl }}
        // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.image, { width: size, height: size, b».
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        // Esta línea sirve para definir el atributo «contentFit» con el valor «cover».
        contentFit="cover"
        // Esta línea sirve para pasar la propiedad «transition» con el valor «150}».
        transition={150}
        // Una URL que no carga (backend momentáneamente inalcanzable, foto
        // borrada del disco, etc.) no debe dejar un ícono de "imagen rota"
        // — mejor la inicial, que es el mismo fallback que ya se usa
        // cuando directamente no hay avatar_url.
        // Esta línea sirve para asignar el manejador del evento «onError».
        onError={() => setFailed(true)}
      />
    );
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «ThemedView» con sus atributos en varias líneas.
    <ThemedView
      // Esta línea sirve para definir el atributo «type» con el valor «backgroundSelected».
      type="backgroundSelected"
      // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.fallback, { width: size, height: size».
      style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}>
      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="title" style={{ fontSize: size * 0.4, color: theme.text }}>
        {/* Esta línea sirve para mostrar el valor «initial». */}
        {initial}
      </ThemedText>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «image» con el valor o tipo «{».
  image: {
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «fallback» con el valor o tipo «{».
  fallback: {
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
});
