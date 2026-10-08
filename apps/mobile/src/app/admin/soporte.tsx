// Esta línea sirve para importar «useCallback, useState» desde «react».
import { useCallback, useState } from 'react';
// Esta línea sirve para importar «router, useFocusEffect» desde «expo-router».
import { router, useFocusEffect } from 'expo-router';
// Esta línea sirve para importar «Pressable, ScrollView, StyleSheet, View» desde «react-native».
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «SUPPORT_TICKET_STATUSES, SUPPORT_TICKET_TYPES» desde «@sanken/core».
import { SUPPORT_TICKET_STATUSES, SUPPORT_TICKET_TYPES } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «Badge» desde «@/components/ui/badge».
import { Badge } from '@/components/ui/badge';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';
// Esta línea sirve para importar «StatTile» desde «@/components/ui/stat-tile».
import { StatTile } from '@/components/ui/stat-tile';
// Esta línea sirve para importar «TextField» desde «@/components/ui/text-field».
import { TextField } from '@/components/ui/text-field';
// Esta línea sirve para importar «formatSupportDate, PRIORITY_BADGE, STATUS_BADGE, supportStrings» desde «@/components/support/support-ui».
import { formatSupportDate, PRIORITY_BADGE, STATUS_BADGE, supportStrings } from '@/components/support/support-ui';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useSupportStore» desde «@/store/support-store».
import { useSupportStore } from '@/store/support-store';

// Esta línea sirve para declarar «t» con el valor «supportStrings».
const t = supportStrings;
// Esta línea sirve para declarar «s» con el valor «supportStrings.admin».
const s = supportStrings.admin;

/** Panel de soporte (super_admin): indicadores, filtros y solicitudes. */
// Esta línea sirve para declarar la función «AdminSupportScreen».
export default function AdminSupportScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «adminTickets, stats, isLoadingTickets, error, loadAdmin» con el hook «useSupportStore».
  const { adminTickets, stats, isLoadingTickets, error, loadAdmin } = useSupportStore();
  // Esta línea sirve para crear el estado «status» y su función «setStatus».
  const [status, setStatus] = useState('awaiting');
  // Esta línea sirve para crear el estado «type» y su función «setType».
  const [type, setType] = useState('');
  // Esta línea sirve para crear el estado «q» y su función «setQ».
  const [q, setQ] = useState('');
  // Esta línea sirve para crear el estado «user» y su función «setUser».
  const [user, setUser] = useState('');

  // Esta línea sirve para extraer «uer» de «new URLSearchParams({ status, ...(type ?».
  const query = new URLSearchParams({ status, ...(type ? { type } : {}), ...(q ? { q } : {}), ...(user ? { user } : {}) }).toString();

  // Esta línea sirve para llamar a «useFocusEffect» con los argumentos de las líneas siguientes.
  useFocusEffect(
    // Esta línea sirve para llamar a «useCallback» con una función.
    useCallback(() => {
      // Esta línea sirve para ejecutar «loadAdmin» sin esperar su resultado.
      void loadAdmin(query);
    // Esta línea sirve para volver a ejecutar el efecto cuando cambian «loadAdmin, query».
    }, [loadAdmin, query])
  );

  // Esta línea sirve para extraer «hi» de «(selected: boolean) => [».
  const chip = (selected: boolean) => [
    // Esta línea sirve para agregar el estilo «styles.chip».
    styles.chip,
    // Esta línea sirve para agregar un elemento cuyo «borderColor» es «theme.backgroundSelected },…».
    { borderColor: theme.backgroundSelected },
    // Esta línea sirve para aplicar el estilo «backgroundColor: theme.backgroundSelecte…» solo si «selected».
    selected && { backgroundColor: theme.backgroundSelected },
  ];

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «ScrollView». */}
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]} keyboardShouldPersistTaps="handled">
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="title" style={styles.pageTitle} accessibilityRole="header">
            {/* Esta línea sirve para mostrar el valor «s.title». */}
            {s.title}
          </ThemedText>

          {/* Esta línea sirve para mostrar el bloque solo si «stats». */}
          {stats && (
            // Esta línea sirve para abrir el componente «View».
            <View style={styles.tiles}>
              {/* Esta línea sirve para abrir el componente «StatTile». */}
              <StatTile label={s.stats.open} value={String(stats.tickets.open)} />
              {/* Esta línea sirve para abrir el componente «StatTile». */}
              <StatTile label={s.stats.inReview} value={String(stats.tickets.in_review)} />
              {/* Esta línea sirve para abrir el componente «StatTile». */}
              <StatTile label={s.stats.awaiting} value={String(stats.tickets.awaiting_staff)} />
              {/* Esta línea sirve para abrir el componente «StatTile». */}
              <StatTile label={s.stats.resolved} value={String(stats.tickets.resolved)} />
              {/* Esta línea sirve para abrir el componente «StatTile». */}
              <StatTile label={s.stats.thisWeek} value={String(stats.tickets.this_week)} />
            </View>
          )}
          {/* Esta línea sirve para mostrar el bloque solo si «stats». */}
          {stats && (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView type="backgroundElement" style={styles.card}>
              {/* Esta línea sirve para mostrar el valor «s.stats.checkinsTitle» dentro de «ThemedText». */}
              <ThemedText type="smallBold">{s.stats.checkinsTitle}</ThemedText>
              {/* Esta línea sirve para recorrer «stats.checkins.weeks» y mostrar un bloque por elemento. */}
              {stats.checkins.weeks.map((week) => (
                // Esta línea sirve para abrir el componente «ThemedText».
                <ThemedText key={week.week} type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar la semana y los conteos de ofrecidos y respondidos. */}
                  {week.week}: {s.stats.offered} {week.offered} · {s.stats.answered} {week.answered} · {s.stats.postponed} {week.postponed}
                  {/* Esta línea sirve para mostrar los ignorados si hay dato. */}
                  {week.ignored !== null ? ` · ${s.stats.ignored} ${week.ignored}` : ''}
                  {/* Esta línea sirve para mostrar la tasa de respuesta si hay dato. */}
                  {week.response_rate !== null ? ` · ${week.response_rate}%` : ''}
                </ThemedText>
              ))}
            </ThemedView>
          )}

          {/* Esta línea sirve para abrir el componente «TextField». */}
          <TextField label={s.search} value={q} onChangeText={setQ} autoCapitalize="none" />
          {/* Esta línea sirve para abrir el componente «TextField». */}
          <TextField label={s.searchUser} value={user} onChangeText={setUser} autoCapitalize="none" />

          {/* Esta línea sirve para abrir el componente «View». */}
          <View style={styles.chips}>
            {/* Esta línea sirve para recorrer «['awaiting', 'all', ...SUPPORT_TICKET_STATUSES]» y mostrar un bloque por elemento. */}
            {['awaiting', 'all', ...SUPPORT_TICKET_STATUSES].map((value) => (
              // Esta línea sirve para abrir el componente «Pressable» con sus propiedades.
              <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: status === value }} onPress={() => setStatus(value)} style={chip(status === value)}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small">
                  {/* Esta línea sirve para mostrar la etiqueta del filtro de estado. */}
                  {value === 'awaiting' ? s.awaiting : value === 'all' ? s.allStatuses : t.statuses[value as keyof typeof t.statuses]}
                </ThemedText>
              </Pressable>
            ))}
          </View>
          {/* Esta línea sirve para abrir el componente «View». */}
          <View style={styles.chips}>
            {/* Esta línea sirve para recorrer «['', ...SUPPORT_TICKET_TYPES]» y mostrar un bloque por elemento. */}
            {['', ...SUPPORT_TICKET_TYPES].map((value) => (
              // Esta línea sirve para abrir el componente «Pressable» con sus propiedades.
              <Pressable key={value || 'all'} accessibilityRole="button" accessibilityState={{ selected: type === value }} onPress={() => setType(value)} style={chip(type === value)}>
                {/* Esta línea sirve para abrir el componente «ThemedText» con sus propiedades. */}
                <ThemedText type="small">{value ? t.types[value as keyof typeof t.types] : s.allTypes}</ThemedText>
              </Pressable>
            ))}
          </View>

          {/* Esta línea sirve para mostrar el elemento solo si «isLoadingTickets && adminTickets.length === 0». */}
          {isLoadingTickets && adminTickets.length === 0 && <Skeleton height={72} />}
          {/* Esta línea sirve para mostrar el bloque solo si «error». */}
          {error && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" style={styles.error}>
              {/* Esta línea sirve para mostrar el valor «error». */}
              {error}
            </ThemedText>
          )}
          {/* Esta línea sirve para mostrar el bloque solo si «!isLoadingTickets && adminTickets.length === 0». */}
          {!isLoadingTickets && adminTickets.length === 0 && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el valor «s.empty». */}
              {s.empty}
            </ThemedText>
          )}

          {/* Esta línea sirve para recorrer «adminTickets» y mostrar un bloque por elemento. */}
          {adminTickets.map((ticket) => (
            // Esta línea sirve para abrir el componente «Pressable» con sus propiedades.
            <Pressable key={ticket.id} accessibilityRole="link" onPress={() => router.push({ pathname: '/admin/soporte/[ticketId]', params: { ticketId: String(ticket.id) } })}>
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView type="backgroundElement" style={styles.card}>
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
                  {/* Esta línea sirve para abrir el componente «Badge». */}
                  <Badge label={t.priorities[ticket.priority]} variant={PRIORITY_BADGE[ticket.priority]} />
                </View>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="smallBold" numberOfLines={1}>
                  {/* Esta línea sirve para mostrar el valor «ticket.subject». */}
                  {ticket.subject}
                </ThemedText>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar el usuario y la fecha del último mensaje. */}
                  {ticket.user?.name} · {formatSupportDate(ticket.last_message_at, true)}
                </ThemedText>
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
  // Esta línea sirve para definir el estilo «tiles» con «flexDirection: 'row', flexWrap: 'wrap', gap: Spaci…».
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  // Esta línea sirve para definir el estilo «card» con «borderRadius: Spacing.four, padding: Spacing.three…».
  card: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.one },
  // Esta línea sirve para definir el estilo «chips» con «flexDirection: 'row', flexWrap: 'wrap', gap: Spaci…».
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  // Esta línea sirve para definir el estilo «chip» con «borderWidth: 1, borderRadius: 999, paddingHorizont…».
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one, minHeight: 36, justifyContent: 'center' },
  // Esta línea sirve para definir el estilo «badges» con «flexDirection: 'row', alignItems: 'center', gap: S…».
  badges: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, flexWrap: 'wrap' },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
});
