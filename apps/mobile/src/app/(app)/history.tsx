// Esta línea sirve para importar «useEffect» desde «react».
import { useEffect } from 'react';
// Esta línea sirve para importar «ActivityIndicator, FlatList, StyleSheet» desde «react-native».
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «Animated» y «FadeInUp» desde «react-native-reanimated».
import Animated, { FadeInUp } from 'react-native-reanimated';
// Esta línea sirve para importar «Dumbbell» desde «lucide-react-native».
import { Dumbbell } from 'lucide-react-native';
// Esta línea sirve para importar «getWorkoutSessionStatus, WORKOUT_SESSION_STATUS_LABEL, type WorkoutSession» desde «@sanken/core».
import { getWorkoutSessionStatus, WORKOUT_SESSION_STATUS_LABEL, type WorkoutSession } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «Badge, type BadgeVariant» desde «@/components/ui/badge».
import { Badge, type BadgeVariant } from '@/components/ui/badge';
// Esta línea sirve para importar «ErrorState» desde «@/components/ui/error-state».
import { ErrorState } from '@/components/ui/error-state';
// Esta línea sirve para importar «Icon» desde «@/components/ui/icon».
import { Icon } from '@/components/ui/icon';
// Esta línea sirve para importar «BottomTabInset, CardShadow, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, CardShadow, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useWorkoutHistoryStore» desde «@/store/workout-history-store».
import { useWorkoutHistoryStore } from '@/store/workout-history-store';

// Esta línea sirve para declarar «STATUS_BADGE_VARIANT» con el valor «{».
const STATUS_BADGE_VARIANT: Record<ReturnType<typeof getWorkoutSessionStatus>, BadgeVariant> = {
  // Esta línea sirve para declarar la propiedad «completed» con el valor o tipo «'success'».
  completed: 'success',
  // Esta línea sirve para declarar la propiedad «active» con el valor o tipo «'accent2'».
  active: 'accent2',
  // Esta línea sirve para declarar la propiedad «skipped» con el valor o tipo «'neutral'».
  skipped: 'neutral',
  // Esta línea sirve para declarar la propiedad «cancelled» con el valor o tipo «'warning'».
  cancelled: 'warning',
};

// Esta línea sirve para declarar la función «formatDate».
function formatDate(performedAt: string): string {
  // Esta línea sirve para devolver «new Date(performedAt)».
  return new Date(performedAt)
    // Esta línea sirve para encadenar la operación «toLocaleDateString».
    .toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
    // Esta línea sirve para encadenar la operación «toUpperCase».
    .toUpperCase();
}

// Esta línea sirve para declarar la función «SessionRow».
function SessionRow({ session, index }: { session: WorkoutSession; index: number }) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para extraer «tatu» de «getWorkoutSessionStatus(session)».
  const status = getWorkoutSessionStatus(session);

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Animated.View».
    <Animated.View entering={FadeInUp.delay(Math.min(index, 8) * 40).duration(260)}>
      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView type="backgroundElement" style={[styles.row, CardShadow]}>
        {/* Esta línea sirve para abrir el componente «ThemedView». */}
        <ThemedView style={[styles.iconCircle, { backgroundColor: theme.backgroundSelected }]}>
          {/* Esta línea sirve para abrir el componente «Icon». */}
          <Icon icon={Dumbbell} size={18} color={theme.textSecondary} />
        </ThemedView>

        {/* Esta línea sirve para abrir el componente «ThemedView». */}
        <ThemedView style={styles.info}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="smallBold" numberOfLines={1}>
            {/* Esta línea sirve para mostrar el contenido dinámico «{session.routine_day_label ?? 'Sesión libre'}». */}
            {session.routine_day_label ?? 'Sesión libre'}
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary">
            {/* Esta línea sirve para mostrar la fecha y la cantidad de ejercicios. */}
            {formatDate(session.performed_at)} · {session.exercises.length} ejercicios
            {/* Esta línea sirve para mostrar la duración si la sesión terminó y la tiene. */}
            {session.completed && session.duration_minutes !== null ? ` · ${session.duration_minutes} min` : ''}
          </ThemedText>
        </ThemedView>

        {/* Esta línea sirve para abrir el componente «Badge». */}
        <Badge label={WORKOUT_SESSION_STATUS_LABEL[status]} variant={STATUS_BADGE_VARIANT[status]} />
      </ThemedView>
    </Animated.View>
  );
}

// Esta línea sirve para declarar la función «HistoryScreen».
export default function HistoryScreen() {
  // Esta línea sirve para obtener las sesiones y el estado del historial.
  const { sessions, isLoading, isLoadingMore, error, load, loadMore } = useWorkoutHistoryStore();

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «load».
    load();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «load».
  }, [load]);

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el elemento «FlatList» con sus atributos en varias líneas. */}
        <FlatList
          // Esta línea sirve para pasar la propiedad «style» con el valor «styles.list}».
          style={styles.list}
          // Esta línea sirve para pasar la propiedad «data» con el valor «sessions}».
          data={sessions}
          // Esta línea sirve para pasar la propiedad «keyExtractor» con el valor «(item) => String(item.id)}».
          keyExtractor={(item) => String(item.id)}
          // Esta línea sirve para pasar la propiedad «renderItem» con el valor «({ item, index }) => <SessionRow session={ite».
          renderItem={({ item, index }) => <SessionRow session={item} index={index} />}
          // Esta línea sirve para asignar el manejador del evento «onEndReachedThreshold».
          onEndReachedThreshold={0.4}
          // Esta línea sirve para asignar el manejador del evento «onEndReached».
          onEndReached={() => loadMore()}
          // Esta línea sirve para pasar la propiedad «contentContainerStyle» con el valor «[styles.content, { paddingBottom: BottomTabIn».
          contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}
          // Esta línea sirve para pasar la propiedad «ListHeaderComponent» con el valor «».
          ListHeaderComponent={
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="title" style={styles.pageTitle}>
              {/* Esta línea sirve para mostrar el texto «Historial». */}
              Historial
            </ThemedText>
          }
          // Esta línea sirve para pasar la propiedad «ListEmptyComponent» con el valor «».
          ListEmptyComponent={
            // Esta línea sirve para revisar si ya terminó de cargar.
            !isLoading ? (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el texto «Todavía no registraste entrenamientos.». */}
                Todavía no registraste entrenamientos.
              </ThemedText>
            // Esta línea sirve para mostrar nada en caso contrario.
            ) : null
          }
          // Esta línea sirve para pasar la propiedad «ListFooterComponent» con el valor «».
          ListFooterComponent={
            // Esta línea sirve para mostrar un indicador de carga mientras se carga más.
            isLoading || isLoadingMore ? <ActivityIndicator style={styles.spinner} /> : null
          }
        />
        {/* Esta línea sirve para mostrar el elemento solo si «error && !isLoading && sessions.length === 0». */}
        {error && !isLoading && sessions.length === 0 && <ErrorState message={error} onRetry={load} />}
      </SafeAreaView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «root» con el valor o tipo «{ flex: 1 }».
  root: { flex: 1 },
  // Esta línea sirve para definir el estilo «safeArea» con «flex: 1, alignItems: 'center', width: '100%' },…».
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  // Esta línea sirve para declarar la propiedad «list» con el valor o tipo «{ alignSelf: 'stretch' }».
  list: { alignSelf: 'stretch' },
  // Esta línea sirve para declarar la propiedad «content» con el valor o tipo «{».
  content: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «MaxContentWidth».
    maxWidth: MaxContentWidth,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.four».
    paddingHorizontal: Spacing.four,
    // Esta línea sirve para declarar la propiedad «paddingTop» con el valor o tipo «Spacing.three».
    paddingTop: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para definir el estilo «pageTitle» con «fontSize: 24, lineHeight: 30, marginBottom: Spacin…».
  pageTitle: { fontSize: 24, lineHeight: 30, marginBottom: Spacing.two },
  // Esta línea sirve para declarar la propiedad «row» con el valor o tipo «{».
  row: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.two».
    padding: Spacing.two,
    // Esta línea sirve para declarar la propiedad «marginBottom» con el valor o tipo «Spacing.two».
    marginBottom: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «iconCircle» con el valor o tipo «{».
  iconCircle: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «36».
    width: 36,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «36».
    height: 36,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «18».
    borderRadius: 18,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
  // Esta línea sirve para declarar la propiedad «info» con el valor o tipo «{».
  info: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «2».
    gap: 2,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «spinner» con el valor o tipo «{ marginVertical: Spacing.three }».
  spinner: { marginVertical: Spacing.three },
});
