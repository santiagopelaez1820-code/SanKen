// Esta línea sirve para importar «useEffect» desde «react».
import { useEffect } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «Pressable, ScrollView, StyleSheet, View» desde «react-native».
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «Flag» desde «lucide-react-native».
import { Flag } from 'lucide-react-native';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useRetosStore» desde «@/store/retos-store».
import { useRetosStore } from '@/store/retos-store';

// Esta línea sirve para declarar la función «daysLeft».
function daysLeft(endsAt: string) {
  // Esta línea sirve para devolver los días que faltan para terminar, nunca negativos.
  return Math.max(0, Math.ceil((new Date(endsAt).getTime() - Date.now()) / 86_400_000));
}

/** Vista previa de retos activos en Home — el detalle completo vive en la pantalla Retos (menú "Más"). */
// Esta línea sirve para declarar la función «ChallengesRow».
export function ChallengesRow() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «challenges, isLoading, load» con el hook «useRetosStore».
  const { challenges, isLoading, load } = useRetosStore();

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «load».
    load();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «load».
  }, [load]);

  // Esta línea sirve para mostrar un esqueleto mientras carga.
  if (isLoading) return <Skeleton height={132} borderRadius={Spacing.four} />;

  // Esta línea sirve para extraer «ctiv» de «challenges.filter((c) => !c.completed).s».
  const active = challenges.filter((c) => !c.completed).slice(0, 6);
  // Esta línea sirve para devolver null si «active.length === 0».
  if (active.length === 0) return null;

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView type="backgroundElement" style={styles.card}>
      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView style={styles.header}>
        {/* Esta línea sirve para mostrar el texto «Retos activos» dentro de «ThemedText». */}
        <ThemedText type="smallBold">Retos activos</ThemedText>
        {/* Esta línea sirve para abrir el componente «Pressable» con sus propiedades. */}
        <Pressable onPress={() => router.push('/retos')}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" style={{ color: theme.accent }}>
            {/* Esta línea sirve para mostrar el texto «Ver todos». */}
            Ver todos
          </ThemedText>
        </Pressable>
      </ThemedView>

      {/* Esta línea sirve para abrir el componente «ScrollView». */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {/* Esta línea sirve para recorrer «active» y mostrar un bloque por elemento. */}
        {active.map((challenge) => (
          // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
          <Pressable
            // Esta línea sirve para identificar el elemento de la lista con «challenge.id}».
            key={challenge.id}
            // Esta línea sirve para asignar el manejador del evento «onPress».
            onPress={() => router.push('/retos')}
            // Esta línea sirve para pasar la propiedad «style» con el valor «({ pressed }) => [».
            style={({ pressed }) => [
              // Esta línea sirve para agregar el estilo «styles.tile».
              styles.tile,
              // Esta línea sirve para agregar un elemento cuyo «backgroundColor» es «theme.backgroundSelected },…».
              { backgroundColor: theme.backgroundSelected },
              // Esta línea sirve para aplicar el estilo de presionado.
              pressed && styles.pressed,
            ]}>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.tileHeader}>
              {/* Esta línea sirve para abrir el componente «Flag». */}
              <Flag size={13} color={theme.accent} />
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary" style={styles.tileMeta}>
                {/* Esta línea sirve para mostrar el tipo del reto y los días restantes. */}
                {challenge.type === 'weekly' ? 'Semanal' : 'Mensual'} · {daysLeft(challenge.ends_at)}d
              </ThemedText>
            </ThemedView>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="smallBold" numberOfLines={2} style={styles.tileTitle}>
              {/* Esta línea sirve para mostrar el valor «challenge.title». */}
              {challenge.title}
            </ThemedText>
            {/* Esta línea sirve para elegir entre dos bloques según «challenge.joined». */}
            {challenge.joined ? (
              // Esta línea sirve para abrir el componente «View».
              <View style={[styles.track, { backgroundColor: theme.background }]}>
                {/* Esta línea sirve para abrir el elemento «View» con sus atributos en varias líneas. */}
                <View
                  // Esta línea sirve para pasar la propiedad «style» con el valor «[».
                  style={[
                    // Esta línea sirve para agregar el estilo «styles.fill».
                    styles.fill,
                    {
                      // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «theme.accent».
                      backgroundColor: theme.accent,
                      // Esta línea sirve para definir la propiedad «width» con «${Math.min(100, Math.round(((challenge.p…».
                      width: `${Math.min(100, Math.round(((challenge.progress_value ?? 0) / challenge.criteria.target) * 100))}%`,
                    },
                  ]}
                />
              </View>
            // Esta línea sirve para mostrar el bloque alternativo.
            ) : (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="small" style={{ color: theme.accent }}>
                {/* Esta línea sirve para mostrar el texto «Unirme →». */}
                Unirme →
              </ThemedText>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «card» con el valor o tipo «{».
  card: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «header» con el valor o tipo «{».
  header: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «row» con el valor o tipo «{».
  row: {
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «tile» con el valor o tipo «{».
  tile: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «164».
    width: 164,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.two + 4».
    padding: Spacing.two + 4,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.one».
    gap: Spacing.one,
  },
  // Esta línea sirve para declarar la propiedad «tileHeader» con el valor o tipo «{».
  tileHeader: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «4».
    gap: 4,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «tileMeta» con el valor o tipo «{».
  tileMeta: {
    // Esta línea sirve para declarar la propiedad «textTransform» con el valor o tipo «'uppercase'».
    textTransform: 'uppercase',
    // Esta línea sirve para declarar la propiedad «letterSpacing» con el valor o tipo «0.4».
    letterSpacing: 0.4,
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «10».
    fontSize: 10,
  },
  // Esta línea sirve para declarar la propiedad «tileTitle» con el valor o tipo «{».
  tileTitle: {
    // Esta línea sirve para declarar la propiedad «minHeight» con el valor o tipo «36».
    minHeight: 36,
  },
  // Esta línea sirve para declarar la propiedad «pressed» con el valor o tipo «{».
  pressed: {
    // Esta línea sirve para declarar la propiedad «opacity» con el valor o tipo «0.8».
    opacity: 0.8,
  },
  // Esta línea sirve para declarar la propiedad «track» con el valor o tipo «{».
  track: {
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «4».
    height: 4,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «2».
    borderRadius: 2,
    // Esta línea sirve para declarar la propiedad «overflow» con el valor o tipo «'hidden'».
    overflow: 'hidden',
  },
  // Esta línea sirve para declarar la propiedad «fill» con el valor o tipo «{».
  fill: {
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «'100%'».
    height: '100%',
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «2».
    borderRadius: 2,
  },
});
