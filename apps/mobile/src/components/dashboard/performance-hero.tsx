// Esta línea sirve para importar «StyleSheet» desde «react-native».
import { StyleSheet } from 'react-native';
// Esta línea sirve para importar «Clock, Weight» desde «lucide-react-native».
import { Clock, Weight } from 'lucide-react-native';
// Esta línea sirve para importar los tipos «DashboardStats, GamificationSummary» desde «@sanken/core».
import type { DashboardStats, GamificationSummary } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «Icon» desde «@/components/ui/icon».
import { Icon } from '@/components/ui/icon';
// Esta línea sirve para importar «ProgressRing» desde «@/components/ui/progress-ring».
import { ProgressRing } from '@/components/ui/progress-ring';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar la interfaz «PerformanceHeroProps».
interface PerformanceHeroProps {
  // Esta línea sirve para declarar la propiedad «stats» con el valor o tipo «DashboardStats | null».
  stats: DashboardStats | null;
  // Esta línea sirve para declarar la propiedad «gamification» con el valor o tipo «GamificationSummary | null».
  gamification: GamificationSummary | null;
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «boolean».
  isLoading: boolean;
}

// Esta línea sirve para declarar la función «PerformanceHero».
export function PerformanceHero({ stats, gamification, isLoading }: PerformanceHeroProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();

  // Esta línea sirve para revisar si «isLoading».
  if (isLoading) {
    // Esta línea sirve para mostrar un esqueleto mientras carga.
    return <Skeleton height={104} borderRadius={Spacing.four} />;
  }

  // Esta línea sirve para extraer «rogressPc» de «Math.round((gamification?.progress_pct ?».
  const progressPct = Math.round((gamification?.progress_pct ?? 0) * 100);

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView type="backgroundElement" style={[styles.container, { borderColor: `${theme.accent}33` }]}>
      {/* Esta línea sirve para abrir el elemento «ProgressRing» con sus atributos en varias líneas. */}
      <ProgressRing
        // Esta línea sirve para pasar la propiedad «value» con el valor «gamification?.progress_pct ?? 0}».
        value={gamification?.progress_pct ?? 0}
        // Esta línea sirve para pasar la propiedad «max» con el valor «1}».
        max={1}
        // Esta línea sirve para pasar la propiedad «size» con el valor «64}».
        size={64}
        // Esta línea sirve para pasar la propiedad «strokeWidth» con el valor «6}».
        strokeWidth={6}
        // Esta línea sirve para definir el atributo «color» con el valor «accent».
        color="accent"
        // Esta línea sirve para pasar la propiedad «valueLabel» con el valor «`${gamification?.level ?? 1}`}».
        valueLabel={`${gamification?.level ?? 1}`}
      />

      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView style={styles.info}>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="caption" themeColor="textSecondary" style={styles.eyebrow}>
          {/* Esta línea sirve para mostrar el contenido dinámico «Progreso · Nivel {gamification?.level ?? 1}». */}
          Progreso · Nivel {gamification?.level ?? 1}
        </ThemedText>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="subtitle" style={styles.percent}>
          {/* Esta línea sirve para mostrar el contenido dinámico «{progressPct}%{' '}». */}
          {progressPct}%{' '}
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary">
            {/* Esta línea sirve para mostrar la experiencia actual y la necesaria para el siguiente nivel. */}
            {gamification?.total_xp ?? 0} / {gamification?.xp_for_next_level ?? 100} XP
          </ThemedText>
        </ThemedText>

        {/* Esta línea sirve para abrir el comentario que explica por qué la racha no se repite aquí. */}
        {/* La racha ya no se repite acá — `StreakWidget` (Home) la muestra
            // Esta línea sirve para continuar el comentario sobre la fila semanal.
            con su propia fila semanal cuando hay una activa; duplicarla acá
            // Esta línea sirve para cerrar el comentario sobre la duplicación de la racha.
            como número suelto era ruido, no información nueva. */}
        {/* Esta línea sirve para abrir el componente «ThemedView». */}
        <ThemedView style={styles.statsRow}>
          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={styles.statItem}>
            {/* Esta línea sirve para abrir el componente «Icon». */}
            <Icon icon={Clock} size={13} color={theme.accentSecondary} />
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="smallBold" style={styles.statValue}>
              {/* Esta línea sirve para mostrar el contenido dinámico «{stats?.total_hours ?? 0} h». */}
              {stats?.total_hours ?? 0} h
            </ThemedText>
          </ThemedView>
          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={styles.statItem}>
            {/* Esta línea sirve para abrir el componente «Icon». */}
            <Icon icon={Weight} size={13} color={theme.accent} />
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="smallBold" style={styles.statValue}>
              {/* Esta línea sirve para mostrar el contenido dinámico «{((stats?.total_volume_kg ?? 0) / 1000).toFixed(1)} t». */}
              {((stats?.total_volume_kg ?? 0) / 1000).toFixed(1)} t
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «container» con el valor o tipo «{».
  container: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «info» con el valor o tipo «{».
  info: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «eyebrow» con el valor o tipo «{».
  eyebrow: {
    // Esta línea sirve para declarar la propiedad «textTransform» con el valor o tipo «'uppercase'».
    textTransform: 'uppercase',
    // Esta línea sirve para declarar la propiedad «letterSpacing» con el valor o tipo «0.5».
    letterSpacing: 0.5,
  },
  // Esta línea sirve para declarar la propiedad «percent» con el valor o tipo «{».
  percent: {
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «22».
    fontSize: 22,
    // Esta línea sirve para declarar la propiedad «lineHeight» con el valor o tipo «26».
    lineHeight: 26,
    // Esta línea sirve para declarar la propiedad «fontWeight» con el valor o tipo «'800'».
    fontWeight: '800',
  },
  // Esta línea sirve para declarar la propiedad «statsRow» con el valor o tipo «{».
  statsRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
    // Esta línea sirve para declarar la propiedad «marginTop» con el valor o tipo «Spacing.one».
    marginTop: Spacing.one,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «statItem» con el valor o tipo «{».
  statItem: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «4».
    gap: 4,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «statValue» con el valor o tipo «{».
  statValue: {
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «14».
    fontSize: 14,
  },
});
