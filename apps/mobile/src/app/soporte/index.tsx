// Esta línea sirve para importar «useCallback» desde «react».
import { useCallback } from 'react';
// Esta línea sirve para importar «router, useFocusEffect» desde «expo-router».
import { router, useFocusEffect } from 'expo-router';
// Esta línea sirve para importar «Pressable, ScrollView, StyleSheet, View» desde «react-native».
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «ChevronRight, HeartPulse» desde «lucide-react-native».
import { ChevronRight, HeartPulse } from 'lucide-react-native';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «Badge» desde «@/components/ui/badge».
import { Badge } from '@/components/ui/badge';
// Esta línea sirve para importar «Icon» desde «@/components/ui/icon».
import { Icon } from '@/components/ui/icon';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';
// Esta línea sirve para importar «formatSupportDate, STATUS_BADGE, supportStrings as t» desde «@/components/support/support-ui».
import { formatSupportDate, STATUS_BADGE, supportStrings as t } from '@/components/support/support-ui';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useSupportStore» desde «@/store/support-store».
import { useSupportStore } from '@/store/support-store';

/** Soporte: solicitudes propias, nueva solicitud y acceso al check-in semanal. */
// Esta línea sirve para declarar la función «SupportScreen».
export default function SupportScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «tickets, isLoadingTickets, error, loadTickets, checkin» con el hook «useSupportStore».
  const { tickets, isLoadingTickets, error, loadTickets, checkin } = useSupportStore();
  // Esta línea sirve para extraer «heckinOpe» de «checkin?.checkin && checkin.checkin.stat».
  const checkinOpen = checkin?.checkin && checkin.checkin.status !== 'answered';

  // Se recarga al volver a la pantalla (p. ej. tras crear o responder una solicitud).
  // Esta línea sirve para llamar a «useFocusEffect» con los argumentos de las líneas siguientes.
  useFocusEffect(
    // Esta línea sirve para llamar a «useCallback» con una función.
    useCallback(() => {
      // Esta línea sirve para ejecutar «loadTickets» sin esperar su resultado.
      void loadTickets();
    // Esta línea sirve para volver a ejecutar el efecto cuando cambian «loadTickets».
    }, [loadTickets])
  );

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «ScrollView». */}
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="title" style={styles.pageTitle} accessibilityRole="header">
            {/* Esta línea sirve para mostrar el valor «t.sectionTitle». */}
            {t.sectionTitle}
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary">
            {/* Esta línea sirve para mostrar el valor «t.sectionSubtitle». */}
            {t.sectionSubtitle}
          </ThemedText>

          {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
          <PrimaryButton label={t.newRequest} onPress={() => router.push('/soporte/nueva')} />

          {/* Esta línea sirve para mostrar el bloque solo si «checkinOpen». */}
          {checkinOpen && (
            // Esta línea sirve para abrir el componente «Pressable» con sus propiedades.
            <Pressable accessibilityRole="link" onPress={() => router.push('/soporte/check-in')}>
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView type="backgroundElement" style={[styles.card, styles.row, { borderColor: theme.accent, borderWidth: 1 }]}>
                {/* Esta línea sirve para abrir el componente «Icon». */}
                <Icon icon={HeartPulse} size={20} color={theme.accent} />
                {/* Esta línea sirve para abrir el componente «View». */}
                <View style={styles.flex}>
                  {/* Esta línea sirve para mostrar el valor «t.checkinTitle» dentro de «ThemedText». */}
                  <ThemedText type="smallBold">{t.checkinTitle}</ThemedText>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor="textSecondary">
                    {/* Esta línea sirve para mostrar el valor «t.checkinCta». */}
                    {t.checkinCta}
                  </ThemedText>
                </View>
                {/* Esta línea sirve para abrir el componente «Icon». */}
                <Icon icon={ChevronRight} size={18} color={theme.textSecondary} />
              </ThemedView>
            </Pressable>
          )}

          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="smallBold" themeColor="textSecondary">
            {/* Esta línea sirve para mostrar el valor «t.myRequests». */}
            {t.myRequests}
          </ThemedText>

          {/* Esta línea sirve para mostrar el elemento solo si «isLoadingTickets && tickets.length === 0». */}
          {isLoadingTickets && tickets.length === 0 && <Skeleton style={styles.skeleton} />}
          {/* Esta línea sirve para mostrar el bloque solo si «error». */}
          {error && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" style={styles.error}>
              {/* Esta línea sirve para mostrar el valor «error». */}
              {error}
            </ThemedText>
          )}
          {/* Esta línea sirve para mostrar el contenido dinámico «{!isLoadingTickets && tickets.length === 0 && !error && (». */}
          {!isLoadingTickets && tickets.length === 0 && !error && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el valor «t.emptyRequests». */}
              {t.emptyRequests}
            </ThemedText>
          )}

          {/* Esta línea sirve para recorrer «tickets» y mostrar un bloque por elemento. */}
          {tickets.map((ticket) => (
            // Esta línea sirve para abrir el componente «Pressable» con sus propiedades.
            <Pressable key={ticket.id} accessibilityRole="link" onPress={() => router.push({ pathname: '/soporte/[ticketId]', params: { ticketId: String(ticket.id) } })}>
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView type="backgroundElement" style={[styles.card, styles.row]}>
                {/* Esta línea sirve para abrir el componente «View». */}
                <View style={styles.flex}>
                  {/* Esta línea sirve para abrir el componente «View». */}
                  <View style={styles.badges}>
                    {/* Esta línea sirve para abrir el componente «ThemedText». */}
                    <ThemedText type="small" themeColor="textSecondary">
                      {/* Esta línea sirve para mostrar el contenido dinámico «#{ticket.id}». */}
                      #{ticket.id}
                    </ThemedText>
                    {/* Esta línea sirve para abrir el componente «Badge». */}
                    <Badge label={t.types[ticket.type]} variant="neutral" />
                    {/* Esta línea sirve para abrir el componente «Badge». */}
                    <Badge label={t.statuses[ticket.status]} variant={STATUS_BADGE[ticket.status]} />
                  </View>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="smallBold" numberOfLines={1}>
                    {/* Esta línea sirve para mostrar el valor «ticket.subject». */}
                    {ticket.subject}
                  </ThemedText>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor="textSecondary">
                    {/* Esta línea sirve para mostrar el aviso de nueva respuesta si el equipo respondió. */}
                    {ticket.status === 'answered' && ticket.last_message_by_staff ? `${t.newReply} · ` : ''}
                    {/* Esta línea sirve para mostrar el contenido dinámico «{t.lastActivity(formatSupportDate(ticket.last_message_at))}». */}
                    {t.lastActivity(formatSupportDate(ticket.last_message_at))}
                  </ThemedText>
                </View>
                {/* Esta línea sirve para abrir el componente «Icon». */}
                <Icon icon={ChevronRight} size={18} color={theme.textSecondary} />
              </ThemedView>
            </Pressable>
          ))}

          {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
          <PrimaryButton label={t.back} variant="ghost" onPress={() => router.back()} />
        </ScrollView>
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
  // Esta línea sirve para declarar la propiedad «scrollView» con el valor o tipo «{ alignSelf: 'stretch' }».
  scrollView: { alignSelf: 'stretch' },
  // Esta línea sirve para definir el estilo «content» con «width: '100%', maxWidth: MaxContentWidth, alignSel…».
  content: { width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center', paddingHorizontal: Spacing.four, paddingTop: Spacing.three, gap: Spacing.three },
  // Esta línea sirve para declarar la propiedad «pageTitle» con el valor o tipo «{ fontSize: 24, lineHeight: 30 }».
  pageTitle: { fontSize: 24, lineHeight: 30 },
  // Esta línea sirve para definir el estilo «card» con «borderRadius: Spacing.four, padding: Spacing.three…».
  card: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.one },
  // Esta línea sirve para definir el estilo «row» con «flexDirection: 'row', alignItems: 'center', gap: S…».
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «{ flex: 1, gap: Spacing.one }».
  flex: { flex: 1, gap: Spacing.one },
  // Esta línea sirve para definir el estilo «badges» con «flexDirection: 'row', alignItems: 'center', gap: S…».
  badges: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, flexWrap: 'wrap' },
  // Esta línea sirve para declarar la propiedad «skeleton» con el valor o tipo «{ height: 72, borderRadius: Spacing.four }».
  skeleton: { height: 72, borderRadius: Spacing.four },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
});
