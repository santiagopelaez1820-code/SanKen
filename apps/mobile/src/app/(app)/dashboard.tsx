// Esta línea sirve para importar «useEffect» desde «react».
import { useEffect } from 'react';
// Esta línea sirve para importar «ScrollView, StyleSheet, useWindowDimensions» desde «react-native».
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «Animated» y «FadeInUp» desde «react-native-reanimated».
import Animated, { FadeInUp } from 'react-native-reanimated';
// Esta línea sirve para importar «BarChart, LineChart» desde «react-native-gifted-charts».
import { BarChart, LineChart } from 'react-native-gifted-charts';
// Esta línea sirve para importar «BarChart3, Clock, Dumbbell, Flag, Flame, ListChecks, Lock, Trophy, Weight, type LucideIcon» desde «lucide-react-native».
import { BarChart3, Clock, Dumbbell, Flag, Flame, ListChecks, Lock, Trophy, Weight, type LucideIcon } from 'lucide-react-native';
// Esta línea sirve para importar «formatPersonalRecord, type DashboardStats, type ProgressMetric, type VolumeRange» desde «@sanken/core».
import { formatPersonalRecord, type DashboardStats, type ProgressMetric, type VolumeRange } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «EmptyState» desde «@/components/ui/empty-state».
import { EmptyState } from '@/components/ui/empty-state';
// Esta línea sirve para importar «ErrorState» desde «@/components/ui/error-state».
import { ErrorState } from '@/components/ui/error-state';
// Esta línea sirve para importar «Icon» desde «@/components/ui/icon».
import { Icon } from '@/components/ui/icon';
// Esta línea sirve para importar «ProgressRing» desde «@/components/ui/progress-ring».
import { ProgressRing } from '@/components/ui/progress-ring';
// Esta línea sirve para importar «Segmented» desde «@/components/ui/segmented».
import { Segmented } from '@/components/ui/segmented';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';
// Esta línea sirve para importar «StatTile, type StatTone» desde «@/components/ui/stat-tile».
import { StatTile, type StatTone } from '@/components/ui/stat-tile';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useDashboardStore» desde «@/store/dashboard-store».
import { useDashboardStore } from '@/store/dashboard-store';
// Esta línea sirve para importar «useGamificationStore» desde «@/store/gamification-store».
import { useGamificationStore } from '@/store/gamification-store';

// Esta línea sirve para declarar la interfaz «Kpi».
interface Kpi {
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «string».
  label: string;
  // Esta línea sirve para declarar la propiedad «icon» con el valor o tipo «LucideIcon».
  icon: LucideIcon;
  // Esta línea sirve para declarar la propiedad «tone» con el valor o tipo «StatTone».
  tone: StatTone;
  // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «(stats: DashboardStats | null) => string».
  value: (stats: DashboardStats | null) => string;
  // Esta línea sirve para declarar la propiedad «hint» con el valor o tipo «(stats: DashboardStats) => string | undefined».
  hint?: (stats: DashboardStats) => string | undefined;
}

/**
 * KPI de Progreso — cada uno con su tono (siempre de la paleta del tema).
 * Entrenamientos y Retos completados ya venían en /stats (el perfil los
 * muestra) pero esta pantalla no los usaba.
 */
// Esta línea sirve para declarar «KPIS» con el valor «[».
const KPIS: Kpi[] = [
  // Esta línea sirve para agregar un elemento cuyo «label» es «'Entrenamientos', icon: Dumbbell, tone: …».
  { label: 'Entrenamientos', icon: Dumbbell, tone: 'accent', value: (s) => `${s?.total_workouts ?? 0}` },
  // Esta línea sirve para agregar un elemento cuyo «label» es «'Horas', icon: Clock, tone: 'accentSecon…».
  { label: 'Horas', icon: Clock, tone: 'accentSecondary', value: (s) => `${s?.total_hours ?? 0} h` },
  {
    // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «'Racha'».
    label: 'Racha',
    // Esta línea sirve para declarar la propiedad «icon» con el valor o tipo «Flame».
    icon: Flame,
    // Esta línea sirve para declarar la propiedad «tone» con el valor o tipo «'warning'».
    tone: 'warning',
    // Esta línea sirve para definir «value» con «(s) => `${s?.current_streak_days ?? 0} $…».
    value: (s) => `${s?.current_streak_days ?? 0} ${s?.current_streak_days === 1 ? 'día' : 'días'}`,
    // Esta línea sirve para definir «hint» con «(s) => (s.current_streak_days > 0 ? '¡Si…».
    hint: (s) => (s.current_streak_days > 0 ? '¡Sigue así!' : undefined),
  },
  // Esta línea sirve para agregar un elemento cuyo «label» es «'Series', icon: ListChecks, tone: 'accen…».
  { label: 'Series', icon: ListChecks, tone: 'accentSecondary', value: (s) => `${s?.total_sets ?? 0}` },
  {
    // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «'Toneladas'».
    label: 'Toneladas',
    // Esta línea sirve para declarar la propiedad «icon» con el valor o tipo «Weight».
    icon: Weight,
    // Esta línea sirve para declarar la propiedad «tone» con el valor o tipo «'accent'».
    tone: 'accent',
    // Esta línea sirve para definir «value» con «(s) => `${((s?.total_volume_kg ?? 0) / 1…».
    value: (s) => `${((s?.total_volume_kg ?? 0) / 1000).toFixed(1)} t`,
  },
  // Esta línea sirve para agregar un elemento cuyo «label» es «'Retos', icon: Flag, tone: 'success', va…».
  { label: 'Retos', icon: Flag, tone: 'success', value: (s) => `${s?.completed_challenges ?? 0}` },
];

// Esta línea sirve para declarar la función «DashboardScreen».
export default function DashboardScreen() {
  // Esta línea sirve para obtener «width» con el hook «useWindowDimensions».
  const { width } = useWindowDimensions();
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para abrir la desestructuración de varios valores.
  const {
    // Esta línea sirve para incluir el valor «stats» en la lista.
    stats,
    // Esta línea sirve para incluir el valor «isLoadingStats» en la lista.
    isLoadingStats,
    // Esta línea sirve para incluir el valor «statsError» en la lista.
    statsError,
    // Esta línea sirve para incluir el valor «volumeRange» en la lista.
    volumeRange,
    // Esta línea sirve para incluir el valor «volume» en la lista.
    volume,
    // Esta línea sirve para incluir el valor «isLoadingVolume» en la lista.
    isLoadingVolume,
    // Esta línea sirve para incluir el valor «progressMetric» en la lista.
    progressMetric,
    // Esta línea sirve para incluir el valor «progress» en la lista.
    progress,
    // Esta línea sirve para incluir el valor «isLoadingProgress» en la lista.
    isLoadingProgress,
    // Esta línea sirve para incluir el valor «loadStats» en la lista.
    loadStats,
    // Esta línea sirve para incluir el valor «loadVolume» en la lista.
    loadVolume,
    // Esta línea sirve para incluir el valor «loadProgress» en la lista.
    loadProgress,
  // Esta línea sirve para cerrar la desestructuración con «useDashboardStore()».
  } = useDashboardStore();
  // Esta línea sirve para obtener el resumen de gamificación y su estado de carga.
  const { summary, isLoading: isLoadingGamification, loadSummary } = useGamificationStore();

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «loadStats».
    loadStats();
    // Esta línea sirve para llamar a «loadVolume».
    loadVolume();
    // Esta línea sirve para llamar a «loadProgress».
    loadProgress();
    // Esta línea sirve para llamar a «loadSummary».
    loadSummary();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «loadStats, loadVolume, loadProgress, loadSummary».
  }, [loadStats, loadVolume, loadProgress, loadSummary]);

  // Esta línea sirve para extraer «hartWidt» de «Math.min(width, MaxContentWidth) - Spaci».
  const chartWidth = Math.min(width, MaxContentWidth) - Spacing.four * 2 - Spacing.three * 2;

  // Esta línea sirve para extraer «arDat» de «volume.map((v) => ({».
  const barData = volume.map((v) => ({
    // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «v.volume_kg».
    value: v.volume_kg,
    // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «v.muscle_group.slice(0, 4)».
    label: v.muscle_group.slice(0, 4),
    // Esta línea sirve para declarar la propiedad «frontColor» con el valor o tipo «theme.accentSecondary».
    frontColor: theme.accentSecondary,
  }));

  // Esta línea sirve para extraer «ineDat» de «progress.map((p) => ({».
  const lineData = progress.map((p) => ({
    // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «p.value».
    value: p.value,
    // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «p.date.slice(5)».
    label: p.date.slice(5),
  }));

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «ScrollView». */}
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="title" style={styles.pageTitle}>
            {/* Esta línea sirve para mostrar el texto «Progreso». */}
            Progreso
          </ThemedText>

          {/* Esta línea sirve para mostrar el elemento solo si «statsError && !isLoadingStats». */}
          {statsError && !isLoadingStats && <ErrorState message={statsError} onRetry={loadStats} />}

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={styles.tileGrid}>
            {/* Esta línea sirve para recorrer «KPIS» y mostrar un bloque por elemento. */}
            {KPIS.map((kpi, i) => (
              // Esta línea sirve para abrir el componente «Animated.View».
              <Animated.View key={kpi.label} entering={FadeInUp.delay(i * 40).duration(280)} style={styles.tileWrap}>
                {/* Esta línea sirve para abrir el elemento «StatTile» con sus atributos en varias líneas. */}
                <StatTile
                  // Esta línea sirve para pasar la propiedad «icon» con el valor «kpi.icon}».
                  icon={kpi.icon}
                  // Esta línea sirve para pasar la propiedad «tone» con el valor «kpi.tone}».
                  tone={kpi.tone}
                  // Esta línea sirve para pasar la propiedad «label» con el valor «kpi.label}».
                  label={kpi.label}
                  // Esta línea sirve para pasar la propiedad «value» con el valor «isLoadingStats ? '…' : kpi.value(stats)}».
                  value={isLoadingStats ? '…' : kpi.value(stats)}
                  // Esta línea sirve para pasar la propiedad «hint» con el valor «stats ? kpi.hint?.(stats) : undefined}».
                  hint={stats ? kpi.hint?.(stats) : undefined}
                />
              </Animated.View>
            ))}
          </ThemedView>

          {/* Esta línea sirve para abrir el componente «Animated.View». */}
          <Animated.View entering={FadeInUp.delay(240).duration(300)}>
          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={[styles.card, styles.xpCard]}>
            {/* Esta línea sirve para abrir el elemento «ProgressRing» con sus atributos en varias líneas. */}
            <ProgressRing
              // Esta línea sirve para pasar la propiedad «value» con el valor «summary?.progress_pct ?? 0}».
              value={summary?.progress_pct ?? 0}
              // Esta línea sirve para pasar la propiedad «max» con el valor «1}».
              max={1}
              // Esta línea sirve para pasar la propiedad «size» con el valor «56}».
              size={56}
              // Esta línea sirve para pasar la propiedad «strokeWidth» con el valor «5}».
              strokeWidth={5}
              // Esta línea sirve para definir el atributo «color» con el valor «accent».
              color="accent"
              // Esta línea sirve para pasar la propiedad «valueLabel» con el valor «isLoadingGamification ? '…' : `${summary?.lev».
              valueLabel={isLoadingGamification ? '…' : `${summary?.level ?? 1}`}
            />
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.xpInfo}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="caption" themeColor="textSecondary" style={styles.eyebrow}>
                {/* Esta línea sirve para mostrar el contenido dinámico «PROGRESO DE NIVEL {summary?.level ?? 1}». */}
                PROGRESO DE NIVEL {summary?.level ?? 1}
              </ThemedText>
              {/* Esta línea sirve para mostrar el bloque solo si «!isLoadingGamification». */}
              {!isLoadingGamification && (
                // Esta línea sirve para abrir el componente «ThemedText».
                <ThemedText type="smallBold">
                  {/* Esta línea sirve para mostrar el contenido dinámico «{Math.round((summary?.progress_pct ?? 0) * 100)}%{' '}». */}
                  {Math.round((summary?.progress_pct ?? 0) * 100)}%{' '}
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor="textSecondary">
                    {/* Esta línea sirve para mostrar la experiencia actual y la necesaria para el siguiente nivel. */}
                    {`· ${summary?.total_xp ?? 0} / ${summary?.xp_for_next_level ?? 100} XP`}
                  </ThemedText>
                </ThemedText>
              )}
            </ThemedView>
          </ThemedView>
          </Animated.View>

          {/* Esta línea sirve para abrir el componente «Animated.View». */}
          <Animated.View entering={FadeInUp.delay(220).duration(300)}>
          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.card}>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.cardHeader}>
              {/* Esta línea sirve para mostrar el texto «Volumen por músculo» dentro de «ThemedText». */}
              <ThemedText type="smallBold">Volumen por músculo</ThemedText>
              {/* Esta línea sirve para abrir el elemento «Segmented» con sus atributos en varias líneas. */}
              <Segmented
                // Esta línea sirve para pasar la propiedad «options» con el valor «[».
                options={[
                  // Esta línea sirve para agregar un elemento cuyo «label» es «'Semana', value: 'weekly' as VolumeRange…».
                  { label: 'Semana', value: 'weekly' as VolumeRange },
                  // Esta línea sirve para agregar un elemento cuyo «label» es «'Mes', value: 'monthly' as VolumeRange }…».
                  { label: 'Mes', value: 'monthly' as VolumeRange },
                ]}
                // Esta línea sirve para pasar la propiedad «value» con el valor «volumeRange}».
                value={volumeRange}
                // Esta línea sirve para asignar el manejador del evento «onChange».
                onChange={(range) => loadVolume(range)}
              />
            </ThemedView>

            {/* Esta línea sirve para mostrar el elemento solo si «isLoadingVolume». */}
            {isLoadingVolume && <Skeleton height={150} borderRadius={Spacing.three} />}
            {/* Esta línea sirve para mostrar el bloque solo si «!isLoadingVolume && barData.length === 0». */}
            {!isLoadingVolume && barData.length === 0 && (
              // Esta línea sirve para abrir el componente «EmptyState».
              <EmptyState icon={BarChart3} title="Sin datos de volumen" description="Todavía no hay entrenamientos registrados en este rango." />
            )}
            {/* Esta línea sirve para mostrar el bloque solo si «!isLoadingVolume && barData.length > 0». */}
            {!isLoadingVolume && barData.length > 0 && (
              // Esta línea sirve para abrir el elemento «BarChart» con sus atributos en varias líneas.
              <BarChart
                // Esta línea sirve para pasar la propiedad «data» con el valor «barData}».
                data={barData}
                // Esta línea sirve para pasar la propiedad «width» con el valor «chartWidth}».
                width={chartWidth}
                // Esta línea sirve para pasar la propiedad «height» con el valor «150}».
                height={150}
                // Esta línea sirve para pasar la propiedad «barWidth» con el valor «22}».
                barWidth={22}
                // Esta línea sirve para pasar la propiedad «spacing» con el valor «18}».
                spacing={18}
                // Esta línea sirve para activar la opción «roundedTop».
                roundedTop
                // Esta línea sirve para pasar la propiedad «noOfSections» con el valor «4}».
                noOfSections={4}
                // Esta línea sirve para pasar la propiedad «yAxisTextStyle» con el valor «{ color: theme.textSecondary, fontSize: 10 }}».
                yAxisTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
                // Esta línea sirve para pasar la propiedad «xAxisLabelTextStyle» con el valor «{ color: theme.textSecondary, fontSize: 10 }}».
                xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
                // Esta línea sirve para pasar la propiedad «yAxisColor» con el valor «theme.backgroundSelected}».
                yAxisColor={theme.backgroundSelected}
                // Esta línea sirve para pasar la propiedad «xAxisColor» con el valor «theme.backgroundSelected}».
                xAxisColor={theme.backgroundSelected}
                // Esta línea sirve para activar la opción «hideRules».
                hideRules
                // Esta línea sirve para activar la opción «isAnimated».
                isAnimated
                // Esta línea sirve para pasar la propiedad «animationDuration» con el valor «500}».
                animationDuration={500}
              />
            )}
          </ThemedView>
          </Animated.View>

          {/* Esta línea sirve para abrir el componente «Animated.View». */}
          <Animated.View entering={FadeInUp.delay(280).duration(300)}>
          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.card}>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.cardHeader}>
              {/* Esta línea sirve para mostrar el texto «Progreso» dentro de «ThemedText». */}
              <ThemedText type="smallBold">Progreso</ThemedText>
              {/* Esta línea sirve para abrir el elemento «Segmented» con sus atributos en varias líneas. */}
              <Segmented
                // Esta línea sirve para pasar la propiedad «options» con el valor «[».
                options={[
                  // Esta línea sirve para agregar un elemento cuyo «label» es «'Peso', value: 'weight' as ProgressMetri…».
                  { label: 'Peso', value: 'weight' as ProgressMetric },
                  // Esta línea sirve para agregar un elemento cuyo «label» es «'Volumen', value: 'volume' as ProgressMe…».
                  { label: 'Volumen', value: 'volume' as ProgressMetric },
                ]}
                // Esta línea sirve para pasar la propiedad «value» con el valor «progressMetric}».
                value={progressMetric}
                // Esta línea sirve para asignar el manejador del evento «onChange».
                onChange={(metric) => loadProgress(metric)}
              />
            </ThemedView>

            {/* Esta línea sirve para mostrar el elemento solo si «isLoadingProgress». */}
            {isLoadingProgress && <Skeleton height={150} borderRadius={Spacing.three} />}
            {/* Esta línea sirve para mostrar el bloque solo si «!isLoadingProgress && lineData.length === 0». */}
            {!isLoadingProgress && lineData.length === 0 && (
              // Esta línea sirve para abrir el componente «EmptyState».
              <EmptyState icon={BarChart3} title="Sin datos de progreso" description="Todavía no hay suficientes registros para esta métrica." />
            )}
            {/* Esta línea sirve para mostrar el bloque solo si «!isLoadingProgress && lineData.length > 0». */}
            {!isLoadingProgress && lineData.length > 0 && (
              // Esta línea sirve para abrir el elemento «LineChart» con sus atributos en varias líneas.
              <LineChart
                // Esta línea sirve para pasar la propiedad «data» con el valor «lineData}».
                data={lineData}
                // Esta línea sirve para pasar la propiedad «width» con el valor «chartWidth}».
                width={chartWidth}
                // Esta línea sirve para pasar la propiedad «height» con el valor «150}».
                height={150}
                // Esta línea sirve para pasar la propiedad «thickness» con el valor «2}».
                thickness={2}
                // Esta línea sirve para pasar la propiedad «color» con el valor «theme.accent}».
                color={theme.accent}
                // Esta línea sirve para pasar la propiedad «dataPointsColor» con el valor «theme.accent}».
                dataPointsColor={theme.accent}
                // Esta línea sirve para pasar la propiedad «yAxisTextStyle» con el valor «{ color: theme.textSecondary, fontSize: 10 }}».
                yAxisTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
                // Esta línea sirve para pasar la propiedad «xAxisLabelTextStyle» con el valor «{ color: theme.textSecondary, fontSize: 10 }}».
                xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
                // Esta línea sirve para pasar la propiedad «yAxisColor» con el valor «theme.backgroundSelected}».
                yAxisColor={theme.backgroundSelected}
                // Esta línea sirve para pasar la propiedad «xAxisColor» con el valor «theme.backgroundSelected}».
                xAxisColor={theme.backgroundSelected}
                // Esta línea sirve para activar la opción «hideRules».
                hideRules
                // Esta línea sirve para activar la opción «curved».
                curved
                // Esta línea sirve para activar la opción «isAnimated».
                isAnimated
                // Esta línea sirve para pasar la propiedad «animationDuration» con el valor «500}».
                animationDuration={500}
              />
            )}
          </ThemedView>
          </Animated.View>

          {/* Esta línea sirve para abrir el componente «Animated.View». */}
          <Animated.View entering={FadeInUp.delay(340).duration(300)}>
          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.card}>
            {/* Esta línea sirve para mostrar el texto «Récords recientes» dentro de «ThemedText». */}
            <ThemedText type="smallBold">Récords recientes</ThemedText>
            {/* Esta línea sirve para mostrar el aviso de sin récords solo si no hay y ya cargó. */}
            {(stats?.recent_personal_records.length ?? 0) === 0 && !isLoadingStats && (
              // Esta línea sirve para abrir el componente «EmptyState».
              <EmptyState icon={Trophy} title="Sin récords todavía" description="Registra tu primer PR desde la pestaña PR." />
            )}
            {/* Esta línea sirve para recorrer «stats?.recent_personal_records» y mostrar un bloque por elemento. */}
            {stats?.recent_personal_records.map((pr) => (
              // Esta línea sirve para abrir el componente «ThemedView».
              <ThemedView key={pr.id} style={styles.listRow}>
                {/* Esta línea sirve para mostrar el valor «pr.exercise_name» dentro de «ThemedText». */}
                <ThemedText type="small">{pr.exercise_name}</ThemedText>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="smallBold" style={{ color: theme.accent }}>
                  {/* Esta línea sirve para mostrar el contenido dinámico «{formatPersonalRecord(pr)}». */}
                  {formatPersonalRecord(pr)}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
          </Animated.View>

          {/* Esta línea sirve para abrir el componente «Animated.View». */}
          <Animated.View entering={FadeInUp.delay(400).duration(300)}>
          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.card}>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.cardHeader}>
              {/* Esta línea sirve para mostrar el texto «Logros» dentro de «ThemedText». */}
              <ThemedText type="smallBold">Logros</ThemedText>
              {/* Esta línea sirve para mostrar el conteo de logros desbloqueados sobre el total. */}
              {(summary?.unlocked_achievements.length ?? 0) + (summary?.locked_achievements.length ?? 0) > 0 && (
                // Esta línea sirve para abrir el componente «ThemedText».
                <ThemedText type="smallBold" style={{ color: theme.accent }}>
                  {/* Esta línea sirve para mostrar el contenido dinámico «{`${summary?.unlocked_achievements.length ?? 0}/${». */}
                  {`${summary?.unlocked_achievements.length ?? 0}/${
                    // Esta línea sirve para calcular el total de logros desbloqueados y bloqueados.
                    (summary?.unlocked_achievements.length ?? 0) + (summary?.locked_achievements.length ?? 0)
                  // Esta línea sirve para cerrar el texto del conteo.
                  }`}
                </ThemedText>
              )}
            </ThemedView>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.achievementsGrid}>
              {/* Esta línea sirve para recorrer los logros desbloqueados y bloqueados. */}
              {[...(summary?.unlocked_achievements ?? []), ...(summary?.locked_achievements ?? [])].map(
                // Esta línea sirve para recibir cada logro.
                (achievement) => (
                  // Esta línea sirve para abrir el elemento «ThemedView» con sus atributos en varias líneas.
                  <ThemedView
                    // Esta línea sirve para identificar el elemento de la lista con «achievement.code}».
                    key={achievement.code}
                    // Esta línea sirve para pasar la propiedad «style» con el valor «[».
                    style={[
                      // Esta línea sirve para agregar el estilo «styles.achievementBadge».
                      styles.achievementBadge,
                      // Esta línea sirve para agregar un elemento cuyo «borderColor» es «achievement.unlocked ? theme.accent : th…».
                      { borderColor: achievement.unlocked ? theme.accent : theme.backgroundSelected },
                      // Esta línea sirve para atenuar el logro si está bloqueado.
                      !achievement.unlocked && styles.achievementLocked,
                    ]}>
                    {/* Esta línea sirve para abrir el elemento «Icon» con sus atributos en varias líneas. */}
                    <Icon
                      // Esta línea sirve para pasar la propiedad «icon» con el valor «achievement.unlocked ? Trophy : Lock}».
                      icon={achievement.unlocked ? Trophy : Lock}
                      // Esta línea sirve para pasar la propiedad «size» con el valor «20}».
                      size={20}
                      // Esta línea sirve para pasar la propiedad «color» con el valor «achievement.unlocked ? theme.accent : theme.t».
                      color={achievement.unlocked ? theme.accent : theme.textSecondary}
                    />
                    {/* Esta línea sirve para abrir el componente «ThemedText». */}
                    <ThemedText type="small" style={styles.achievementName}>
                      {/* Esta línea sirve para mostrar el valor «achievement.name». */}
                      {achievement.name}
                    </ThemedText>
                    {/* Esta línea sirve para abrir el componente «ThemedText». */}
                    <ThemedText type="small" themeColor="textSecondary">
                      {/* Esta línea sirve para mostrar el contenido dinámico «+{achievement.xp_bonus} XP». */}
                      +{achievement.xp_bonus} XP
                    </ThemedText>
                  </ThemedView>
                ),
              )}
            </ThemedView>
          </ThemedView>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «root» con el valor o tipo «{ flex: 1 }».
  root: { flex: 1 },
  // Esta línea sirve para declarar la propiedad «safeArea» con el valor o tipo «{ flex: 1, alignItems: 'center' }».
  safeArea: { flex: 1, alignItems: 'center' },
  // Esta línea sirve para declarar la propiedad «scrollView» con el valor o tipo «{ alignSelf: 'stretch' }».
  scrollView: { alignSelf: 'stretch' },
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
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
  },
  // Esta línea sirve para definir el estilo «pageTitle» con «fontSize: 24, lineHeight: 30, marginBottom: Spacin…».
  pageTitle: { fontSize: 24, lineHeight: 30, marginBottom: Spacing.one },
  // Esta línea sirve para declarar la propiedad «tileGrid» con el valor o tipo «{».
  tileGrid: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «flexWrap» con el valor o tipo «'wrap'».
    flexWrap: 'wrap',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «tileWrap» con el valor o tipo «{».
  tileWrap: {
    // Esta línea sirve para declarar la propiedad «flexBasis» con el valor o tipo «'47%'».
    flexBasis: '47%',
    // Esta línea sirve para declarar la propiedad «flexGrow» con el valor o tipo «1».
    flexGrow: 1,
  },
  // Esta línea sirve para declarar la propiedad «card» con el valor o tipo «{».
  card: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «cardHeader» con el valor o tipo «{».
  cardHeader: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «listRow» con el valor o tipo «{».
  listRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.one».
    paddingVertical: Spacing.one,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «xpCard» con el valor o tipo «{».
  xpCard: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «xpInfo» con el valor o tipo «{».
  xpInfo: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.half».
    gap: Spacing.half,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «eyebrow» con el valor o tipo «{».
  eyebrow: {
    // Esta línea sirve para declarar la propiedad «textTransform» con el valor o tipo «'uppercase'».
    textTransform: 'uppercase',
    // Esta línea sirve para declarar la propiedad «letterSpacing» con el valor o tipo «0.5».
    letterSpacing: 0.5,
    // Esta línea sirve para declarar la propiedad «fontWeight» con el valor o tipo «'600'».
    fontWeight: '600',
  },
  // Esta línea sirve para declarar la propiedad «achievementsGrid» con el valor o tipo «{».
  achievementsGrid: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «flexWrap» con el valor o tipo «'wrap'».
    flexWrap: 'wrap',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «achievementBadge» con el valor o tipo «{».
  achievementBadge: {
    // Esta línea sirve para declarar la propiedad «flexBasis» con el valor o tipo «'30%'».
    flexBasis: '30%',
    // Esta línea sirve para declarar la propiedad «flexGrow» con el valor o tipo «1».
    flexGrow: 1,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.half».
    gap: Spacing.half,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two».
    paddingVertical: Spacing.two,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.one».
    paddingHorizontal: Spacing.one,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «achievementLocked» con el valor o tipo «{».
  achievementLocked: {
    // Esta línea sirve para declarar la propiedad «opacity» con el valor o tipo «0.5».
    opacity: 0.5,
  },
  // Esta línea sirve para declarar la propiedad «achievementName» con el valor o tipo «{».
  achievementName: {
    // Esta línea sirve para declarar la propiedad «textAlign» con el valor o tipo «'center'».
    textAlign: 'center',
  },
});
