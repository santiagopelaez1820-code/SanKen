// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «Pressable, ScrollView, StyleSheet, View» desde «react-native».
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «Animated» y «FadeInUp» desde «react-native-reanimated».
import Animated, { FadeInUp } from 'react-native-reanimated';
// Esta línea sirve para importar «Camera, LogOut, Package, Settings» desde «lucide-react-native».
import { Camera, LogOut, Package, Settings } from 'lucide-react-native';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «AchievementsRow» desde «@/components/dashboard/achievements-row».
import { AchievementsRow } from '@/components/dashboard/achievements-row';
// Esta línea sirve para importar «RecentPRsRow» desde «@/components/dashboard/recent-prs-row».
import { RecentPRsRow } from '@/components/dashboard/recent-prs-row';
// Esta línea sirve para importar «AvatarEditSheet» desde «@/components/profile/avatar-edit-sheet».
import { AvatarEditSheet } from '@/components/profile/avatar-edit-sheet';
// Esta línea sirve para importar «Avatar» desde «@/components/ui/avatar».
import { Avatar } from '@/components/ui/avatar';
// Esta línea sirve para importar «ProgressRing» desde «@/components/ui/progress-ring».
import { ProgressRing } from '@/components/ui/progress-ring';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';
// Esta línea sirve para importar «Icon» desde «@/components/ui/icon».
import { Icon } from '@/components/ui/icon';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';
// Esta línea sirve para importar «useDashboardStore» desde «@/store/dashboard-store».
import { useDashboardStore } from '@/store/dashboard-store';
// Esta línea sirve para importar «useGamificationStore» desde «@/store/gamification-store».
import { useGamificationStore } from '@/store/gamification-store';

/** Trío de stats compacto — el mismo lenguaje que StatTile pero en fila, para el header del perfil. */
// Esta línea sirve para declarar la función «StatCell».
function StatCell({ value, label }: { value: string | number; label: string }) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «View».
    <View style={styles.statCell}>
      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="subtitle" style={styles.statValue}>
        {/* Esta línea sirve para mostrar el valor «value». */}
        {value}
      </ThemedText>
      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="caption" themeColor="textSecondary" style={styles.statLabel}>
        {/* Esta línea sirve para mostrar el valor «label». */}
        {label}
      </ThemedText>
    </View>
  );
}

// Esta línea sirve para declarar la función «ProfileScreen».
export default function ProfileScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «user» con el hook «useAuthStore».
  const user = useAuthStore((s) => s.user);
  // Esta línea sirve para obtener «logout» con el hook «useAuthStore».
  const logout = useAuthStore((s) => s.logout);
  // Esta línea sirve para obtener «stats, isLoadingStats, loadStats» con el hook «useDashboardStore».
  const { stats, isLoadingStats, loadStats } = useDashboardStore();
  // Esta línea sirve para obtener el resumen de gamificación y su estado de carga.
  const { summary, isLoading: isLoadingGamification, loadSummary } = useGamificationStore();
  // Esta línea sirve para crear el estado «avatarSheetVisible» y su función «setAvatarSheetVisible».
  const [avatarSheetVisible, setAvatarSheetVisible] = useState(false);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «loadStats».
    loadStats();
    // Esta línea sirve para llamar a «loadSummary».
    loadSummary();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «loadStats, loadSummary».
  }, [loadStats, loadSummary]);

  // Esta línea sirve para extraer «rogressPc» de «Math.round((summary?.progress_pct ?? 0) ».
  const progressPct = Math.round((summary?.progress_pct ?? 0) * 100);
  // Esta línea sirve para extraer «sLoadin» de «isLoadingStats || isLoadingGamification».
  const isLoading = isLoadingStats || isLoadingGamification;

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.container}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «ScrollView». */}
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Esta línea sirve para abrir el componente «Animated.View». */}
          <Animated.View entering={FadeInUp.duration(320)} style={styles.header}>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.eyebrow}>
              {/* Esta línea sirve para mostrar el texto «PERFIL DE ATLETA». */}
              PERFIL DE ATLETA
            </ThemedText>

            {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
            <Pressable
              // Esta línea sirve para asignar el manejador del evento «onPress».
              onPress={() => setAvatarSheetVisible(true)}
              // Esta línea sirve para pasar la propiedad «style» con el valor «styles.avatarBlock}».
              style={styles.avatarBlock}
              // Esta línea sirve para definir el atributo «accessibilityRole» con el valor «button».
              accessibilityRole="button"
              // Esta línea sirve para definir el atributo «accessibilityLabel» con el valor «Cambiar foto de perfil».
              accessibilityLabel="Cambiar foto de perfil">
              {/* Esta línea sirve para elegir entre dos bloques según «isLoading». */}
              {isLoading ? (
                // Esta línea sirve para abrir el componente «Skeleton».
                <Skeleton height={84} width={84} borderRadius={42} />
              // Esta línea sirve para mostrar el bloque alternativo.
              ) : (
                // Esta línea sirve para abrir el elemento «ProgressRing» con sus atributos en varias líneas.
                <ProgressRing
                  // Esta línea sirve para pasar la propiedad «value» con el valor «summary?.progress_pct ?? 0}».
                  value={summary?.progress_pct ?? 0}
                  // Esta línea sirve para pasar la propiedad «max» con el valor «1}».
                  max={1}
                  // Esta línea sirve para pasar la propiedad «size» con el valor «88}».
                  size={88}
                  // Esta línea sirve para pasar la propiedad «strokeWidth» con el valor «6}».
                  strokeWidth={6}
                  // Esta línea sirve para definir el atributo «color» con el valor «accent».
                  color="accent"
                  // Esta línea sirve para definir el atributo «label» con el valor «».
                  label=""
                  // Esta línea sirve para definir el atributo «valueLabel» con el valor «».
                  valueLabel=""
                  // Esta línea sirve para pasar la propiedad «centerContent» con el valor «<Avatar name={user?.name} avatarUrl={user?.av».
                  centerContent={<Avatar name={user?.name} avatarUrl={user?.avatar_url} size={66} />}
                />
              )}
              {/* Esta línea sirve para mostrar el bloque solo si «!isLoading». */}
              {!isLoading && (
                // Esta línea sirve para abrir el componente «ThemedView».
                <ThemedView style={[styles.cameraBadge, { backgroundColor: theme.accent, borderColor: theme.background }]}>
                  {/* Esta línea sirve para abrir el componente «Icon». */}
                  <Icon icon={Camera} size={14} color="#050505" />
                </ThemedView>
              )}
            </Pressable>

            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="title" style={styles.name}>
              {/* Esta línea sirve para mostrar el contenido dinámico «{user?.name ?? 'Atleta'}». */}
              {user?.name ?? 'Atleta'}
            </ThemedText>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" style={[styles.level, { color: theme.accent }]}>
              {/* Esta línea sirve para mostrar el contenido dinámico «NIVEL {summary?.level ?? 1} · {progressPct}% al siguiente». */}
              NIVEL {summary?.level ?? 1} · {progressPct}% al siguiente
            </ThemedText>
          </Animated.View>

          {/* Esta línea sirve para abrir el componente «Animated.View». */}
          <Animated.View entering={FadeInUp.delay(60).duration(320)}>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView type="backgroundElement" style={styles.statsCard}>
              {/* Esta línea sirve para abrir el componente «StatCell». */}
              <StatCell value={stats?.current_streak_days ?? 0} label="Racha" />
              {/* Esta línea sirve para abrir el componente «View». */}
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              {/* Esta línea sirve para abrir el componente «StatCell». */}
              <StatCell value={stats?.total_workouts ?? 0} label="Entrenamientos" />
              {/* Esta línea sirve para abrir el componente «View». */}
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              {/* Esta línea sirve para abrir el componente «StatCell». */}
              <StatCell value={stats?.completed_challenges ?? 0} label="Retos" />
            </ThemedView>
          </Animated.View>

          {/* Esta línea sirve para mostrar el bloque solo si «!isLoadingGamification». */}
          {!isLoadingGamification && (
            // Esta línea sirve para abrir el componente «Animated.View».
            <Animated.View entering={FadeInUp.delay(120).duration(320)}>
              {/* Esta línea sirve para abrir el elemento «AchievementsRow» con sus atributos en varias líneas. */}
              <AchievementsRow
                // Esta línea sirve para pasar la propiedad «achievements» con el valor «[...(summary?.unlocked_achievements ?? []), .».
                achievements={[...(summary?.unlocked_achievements ?? []), ...(summary?.locked_achievements ?? [])]}
              />
            </Animated.View>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «!isLoadingStats». */}
          {!isLoadingStats && (
            // Esta línea sirve para abrir el componente «Animated.View».
            <Animated.View entering={FadeInUp.delay(180).duration(320)}>
              {/* Esta línea sirve para abrir el componente «RecentPRsRow». */}
              <RecentPRsRow records={stats?.recent_personal_records ?? []} />
            </Animated.View>
          )}

          {/* Esta línea sirve para abrir el componente «Animated.View». */}
          <Animated.View entering={FadeInUp.delay(220).duration(320)} style={styles.actions}>
            {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
            <Pressable
              // Esta línea sirve para asignar el manejador del evento «onPress».
              onPress={() => router.push('/pedidos')}
              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.actionRow, { backgroundColor: theme.b».
              style={[styles.actionRow, { backgroundColor: theme.backgroundElement }]}>
              {/* Esta línea sirve para abrir el componente «Icon». */}
              <Icon icon={Package} size={18} color={theme.text} />
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="default" style={styles.actionLabel}>
                {/* Esta línea sirve para mostrar el texto «Mis pedidos». */}
                Mis pedidos
              </ThemedText>
            </Pressable>
            {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
            <Pressable
              // Esta línea sirve para asignar el manejador del evento «onPress».
              onPress={() => router.push('/settings')}
              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.actionRow, { backgroundColor: theme.b».
              style={[styles.actionRow, { backgroundColor: theme.backgroundElement }]}>
              {/* Esta línea sirve para abrir el componente «Icon». */}
              <Icon icon={Settings} size={18} color={theme.text} />
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="default" style={styles.actionLabel}>
                {/* Esta línea sirve para mostrar el texto «Configuración». */}
                Configuración
              </ThemedText>
            </Pressable>
            {/* Esta línea sirve para abrir el componente «Pressable». */}
            <Pressable onPress={logout} style={[styles.actionRow, { backgroundColor: theme.backgroundElement }]}>
              {/* Esta línea sirve para abrir el componente «Icon». */}
              <Icon icon={LogOut} size={18} color={theme.textSecondary} />
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="default" themeColor="textSecondary" style={styles.actionLabel}>
                {/* Esta línea sirve para mostrar el texto «Cerrar sesión». */}
                Cerrar sesión
              </ThemedText>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      {/* Esta línea sirve para abrir el elemento «AvatarEditSheet» con sus atributos en varias líneas. */}
      <AvatarEditSheet
        // Esta línea sirve para pasar la propiedad «visible» con el valor «avatarSheetVisible}».
        visible={avatarSheetVisible}
        // Esta línea sirve para asignar el manejador del evento «onClose».
        onClose={() => setAvatarSheetVisible(false)}
        // Esta línea sirve para pasar la propiedad «hasAvatar» con el valor «!!user?.avatar_url}».
        hasAvatar={!!user?.avatar_url}
      />
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «container» con el valor o tipo «{ flex: 1 }».
  container: { flex: 1 },
  // Esta línea sirve para definir el estilo «safeArea» con «flex: 1, alignItems: 'center', width: '100%' },…».
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
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
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingTop» con el valor o tipo «Spacing.three».
    paddingTop: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingBottom» con el valor o tipo «BottomTabInset + Spacing.three».
    paddingBottom: BottomTabInset + Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «header» con el valor o tipo «{».
  header: {
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.one».
    gap: Spacing.one,
  },
  // Esta línea sirve para declarar la propiedad «eyebrow» con el valor o tipo «{».
  eyebrow: {
    // Esta línea sirve para declarar la propiedad «letterSpacing» con el valor o tipo «1».
    letterSpacing: 1,
  },
  // Esta línea sirve para declarar la propiedad «avatarBlock» con el valor o tipo «{».
  avatarBlock: {
    // Esta línea sirve para declarar la propiedad «marginTop» con el valor o tipo «Spacing.one».
    marginTop: Spacing.one,
    // Esta línea sirve para declarar la propiedad «marginBottom» con el valor o tipo «Spacing.one».
    marginBottom: Spacing.one,
  },
  // Esta línea sirve para declarar la propiedad «cameraBadge» con el valor o tipo «{».
  cameraBadge: {
    // Esta línea sirve para declarar la propiedad «position» con el valor o tipo «'absolute'».
    position: 'absolute',
    // Esta línea sirve para declarar la propiedad «right» con el valor o tipo «0».
    right: 0,
    // Esta línea sirve para declarar la propiedad «bottom» con el valor o tipo «4».
    bottom: 4,
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «26».
    width: 26,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «26».
    height: 26,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «13».
    borderRadius: 13,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «2».
    borderWidth: 2,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «{».
  name: {
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «20».
    fontSize: 20,
    // Esta línea sirve para declarar la propiedad «lineHeight» con el valor o tipo «26».
    lineHeight: 26,
  },
  // Esta línea sirve para declarar la propiedad «level» con el valor o tipo «{».
  level: {
    // Esta línea sirve para declarar la propiedad «fontWeight» con el valor o tipo «'700'».
    fontWeight: '700',
    // Esta línea sirve para declarar la propiedad «letterSpacing» con el valor o tipo «0.4».
    letterSpacing: 0.4,
  },
  // Esta línea sirve para declarar la propiedad «statsCard» con el valor o tipo «{».
  statsCard: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two + 4».
    paddingVertical: Spacing.two + 4,
  },
  // Esta línea sirve para declarar la propiedad «statCell» con el valor o tipo «{».
  statCell: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «2».
    gap: 2,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «statValue» con el valor o tipo «{».
  statValue: {
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «18».
    fontSize: 18,
    // Esta línea sirve para declarar la propiedad «lineHeight» con el valor o tipo «22».
    lineHeight: 22,
    // Esta línea sirve para declarar la propiedad «fontWeight» con el valor o tipo «'800'».
    fontWeight: '800',
  },
  // Mismo tratamiento que las etiquetas de StatTile (Progreso).
  // Esta línea sirve para declarar la propiedad «statLabel» con el valor o tipo «{».
  statLabel: {
    // Esta línea sirve para declarar la propiedad «textTransform» con el valor o tipo «'uppercase'».
    textTransform: 'uppercase',
    // Esta línea sirve para declarar la propiedad «letterSpacing» con el valor o tipo «0.5».
    letterSpacing: 0.5,
  },
  // Esta línea sirve para declarar la propiedad «divider» con el valor o tipo «{».
  divider: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «1».
    width: 1,
    // Esta línea sirve para declarar la propiedad «alignSelf» con el valor o tipo «'stretch'».
    alignSelf: 'stretch',
  },
  // Esta línea sirve para declarar la propiedad «actions» con el valor o tipo «{».
  actions: {
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «actionRow» con el valor o tipo «{».
  actionRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two + 4».
    paddingVertical: Spacing.two + 4,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.three».
    paddingHorizontal: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «actionLabel» con el valor o tipo «{».
  actionLabel: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
  },
});
