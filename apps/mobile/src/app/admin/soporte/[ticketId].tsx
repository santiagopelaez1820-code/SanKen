// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar «router, useLocalSearchParams» desde «expo-router».
import { router, useLocalSearchParams } from 'expo-router';
// Esta línea sirve para importar «KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View» desde «react-native».
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «CHECKIN_MOODS» en la lista.
  CHECKIN_MOODS,
  // Esta línea sirve para incluir el valor «SUPPORT_TICKET_PRIORITIES» en la lista.
  SUPPORT_TICKET_PRIORITIES,
  // Esta línea sirve para incluir el valor «SUPPORT_TICKET_STATUSES» en la lista.
  SUPPORT_TICKET_STATUSES,
  // Esta línea sirve para importar el tipo «CheckinMood».
  type CheckinMood,
  // Esta línea sirve para importar el tipo «CheckinTopic».
  type CheckinTopic,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from '@sanken/core';

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
// Esta línea sirve para importar «TextField» desde «@/components/ui/text-field».
import { TextField } from '@/components/ui/text-field';
// Esta línea sirve para importar «formatSupportDate, PRIORITY_BADGE, STATUS_BADGE, supportStrings» desde «@/components/support/support-ui».
import { formatSupportDate, PRIORITY_BADGE, STATUS_BADGE, supportStrings } from '@/components/support/support-ui';
// Esta línea sirve para importar «TicketConversation» desde «@/components/support/ticket-conversation».
import { TicketConversation } from '@/components/support/ticket-conversation';
// Esta línea sirve para importar «MaxContentWidth, Spacing» desde «@/constants/theme».
import { MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useSupportStore» desde «@/store/support-store».
import { useSupportStore } from '@/store/support-store';

// Esta línea sirve para declarar «t» con el valor «supportStrings».
const t = supportStrings;
// Esta línea sirve para declarar «s» con el valor «supportStrings.admin».
const s = supportStrings.admin;

// Esta línea sirve para declarar la función «contextValue».
function contextValue(key: string, value: unknown): string {
  // Esta línea sirve para mostrar la etiqueta del ánimo si la clave es mood.
  if (key === 'mood' && CHECKIN_MOODS.includes(value as CheckinMood)) {
    // Esta línea sirve para extraer «oo» de «t.moods[value as CheckinMood]».
    const mood = t.moods[value as CheckinMood];
    // Esta línea sirve para devolver «`${mood.emoji} ${mood.label}`».
    return `${mood.emoji} ${mood.label}`;
  }
  // Esta línea sirve para mostrar la etiqueta del tema si la clave es topic.
  if (key === 'topic' && typeof value === 'string' && value in t.topics) return t.topics[value as CheckinTopic];
  // Esta línea sirve para mostrar un guion si no hay valor o el valor como texto.
  return value === null || value === undefined ? '—' : String(value);
}

/** Detalle de una solicitud para el equipo: responder y cambiar estado/prioridad/responsable. */
// Esta línea sirve para declarar la función «AdminSupportTicketScreen».
export default function AdminSupportTicketScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para extraer «ticketId» de «useLocalSearchParams<{ ticketId: string ».
  const { ticketId } = useLocalSearchParams<{ ticketId: string }>();
  // Esta línea sirve para obtener «adminTicket, staff, isLoadingTicket, isSubmitting, error, loadAdminTicket, adminReply, adminUpdate» con el hook «useSupportStore».
  const { adminTicket, staff, isLoadingTicket, isSubmitting, error, loadAdminTicket, adminReply, adminUpdate } = useSupportStore();
  // Esta línea sirve para crear el estado «body» y su función «setBody».
  const [body, setBody] = useState('');

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «loadAdminTicket» si «ticketId».
    if (ticketId) void loadAdminTicket(ticketId);
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «ticketId, loadAdminTicket».
  }, [ticketId, loadAdminTicket]);

  // Esta línea sirve para extraer «icke» de «adminTicket && String(adminTicket.id) ==».
  const ticket = adminTicket && String(adminTicket.id) === ticketId ? adminTicket : null;

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
      {/* Esta línea sirve para abrir el componente «KeyboardAvoidingView». */}
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
        <SafeAreaView style={styles.safeArea}>
          {/* Esta línea sirve para abrir el componente «ScrollView». */}
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
            <PrimaryButton label={s.title} variant="ghost" onPress={() => (router.canGoBack() ? router.back() : router.replace('/admin/soporte'))} />

            {/* Esta línea sirve para mostrar el elemento solo si «isLoadingTicket && !ticket». */}
            {isLoadingTicket && !ticket && <Skeleton height={160} />}
            {/* Esta línea sirve para mostrar el bloque solo si «error». */}
            {error && (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="small" style={styles.error} accessibilityRole="alert">
                {/* Esta línea sirve para mostrar el valor «error». */}
                {error}
              </ThemedText>
            )}

            {/* Esta línea sirve para mostrar el bloque solo si «ticket». */}
            {ticket && (
              // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
              <>
                {/* Esta línea sirve para abrir el componente «View». */}
                <View style={styles.badges}>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor="textSecondary">
                    {/* Esta línea sirve para mostrar el contenido dinámico «{t.requestNumber(ticket.id)}». */}
                    {t.requestNumber(ticket.id)}
                  </ThemedText>
                  {/* Esta línea sirve para abrir el componente «Badge». */}
                  <Badge label={t.types[ticket.type]} variant="neutral" />
                  {/* Esta línea sirve para abrir el componente «Badge». */}
                  <Badge label={t.statuses[ticket.status]} variant={STATUS_BADGE[ticket.status]} />
                  {/* Esta línea sirve para abrir el componente «Badge». */}
                  <Badge label={t.priorities[ticket.priority]} variant={PRIORITY_BADGE[ticket.priority]} />
                </View>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="subtitle" accessibilityRole="header">
                  {/* Esta línea sirve para mostrar el valor «ticket.subject». */}
                  {ticket.subject}
                </ThemedText>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar el usuario, el correo y la fecha del ticket. */}
                  {ticket.user?.name} · {ticket.user?.email} · {formatSupportDate(ticket.created_at, true)}
                </ThemedText>

                {/* Esta línea sirve para abrir el componente «TicketConversation». */}
                <TicketConversation messages={ticket.messages ?? []} viewer="staff" />

                {/* Esta línea sirve para abrir el componente «TextField». */}
                <TextField label={s.replyAsStaff} value={body} onChangeText={setBody} multiline maxLength={5000} />
                {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
                <PrimaryButton
                  // Esta línea sirve para pasar la propiedad «label» con el valor «t.reply}».
                  label={t.reply}
                  // Esta línea sirve para pasar la propiedad «loading» con el valor «isSubmitting}».
                  loading={isSubmitting}
                  // Esta línea sirve para pasar la propiedad «disabled» con el valor «!body.trim() || isSubmitting}».
                  disabled={!body.trim() || isSubmitting}
                  // Esta línea sirve para asignar el manejador del evento «onPress».
                  onPress={() => {
                    // Esta línea sirve para llamar a «adminReply» con «ticket.id, body.trim()».
                    adminReply(ticket.id, body.trim())
                      // Esta línea sirve para encadenar la operación «then».
                      .then(() => setBody(''))
                      // Esta línea sirve para encadenar la operación «catch».
                      .catch(() => {});
                  }}
                />

                {/* Esta línea sirve para mostrar el valor «s.status» dentro de «ThemedText». */}
                <ThemedText type="smallBold">{s.status}</ThemedText>
                {/* Esta línea sirve para abrir el componente «View». */}
                <View style={styles.chips}>
                  {/* Esta línea sirve para recorrer «SUPPORT_TICKET_STATUSES» y mostrar un bloque por elemento. */}
                  {SUPPORT_TICKET_STATUSES.map((value) => (
                    // Esta línea sirve para abrir el componente «Pressable» con sus propiedades.
                    <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: ticket.status === value }} disabled={isSubmitting} onPress={() => void adminUpdate(ticket.id, { status: value }).catch(() => {})} style={chip(ticket.status === value)}>
                      {/* Esta línea sirve para mostrar el valor «t.statuses[value]» dentro de «ThemedText». */}
                      <ThemedText type="small">{t.statuses[value]}</ThemedText>
                    </Pressable>
                  ))}
                </View>

                {/* Esta línea sirve para mostrar el valor «s.priority» dentro de «ThemedText». */}
                <ThemedText type="smallBold">{s.priority}</ThemedText>
                {/* Esta línea sirve para abrir el componente «View». */}
                <View style={styles.chips}>
                  {/* Esta línea sirve para recorrer «SUPPORT_TICKET_PRIORITIES» y mostrar un bloque por elemento. */}
                  {SUPPORT_TICKET_PRIORITIES.map((value) => (
                    // Esta línea sirve para abrir el componente «Pressable» con sus propiedades.
                    <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: ticket.priority === value }} disabled={isSubmitting} onPress={() => void adminUpdate(ticket.id, { priority: value }).catch(() => {})} style={chip(ticket.priority === value)}>
                      {/* Esta línea sirve para mostrar el valor «t.priorities[value]» dentro de «ThemedText». */}
                      <ThemedText type="small">{t.priorities[value]}</ThemedText>
                    </Pressable>
                  ))}
                </View>

                {/* Esta línea sirve para mostrar el valor «s.assignee» dentro de «ThemedText». */}
                <ThemedText type="smallBold">{s.assignee}</ThemedText>
                {/* Esta línea sirve para abrir el componente «View». */}
                <View style={styles.chips}>
                  {/* Esta línea sirve para abrir el componente «Pressable» con sus propiedades. */}
                  <Pressable accessibilityRole="button" accessibilityState={{ selected: !ticket.assignee }} disabled={isSubmitting} onPress={() => void adminUpdate(ticket.id, { assigned_to: null }).catch(() => {})} style={chip(!ticket.assignee)}>
                    {/* Esta línea sirve para mostrar el valor «s.unassigned» dentro de «ThemedText». */}
                    <ThemedText type="small">{s.unassigned}</ThemedText>
                  </Pressable>
                  {/* Esta línea sirve para recorrer «staff» y mostrar un bloque por elemento. */}
                  {staff.map((member) => (
                    // Esta línea sirve para abrir el componente «Pressable» con sus propiedades.
                    <Pressable key={member.id} accessibilityRole="button" accessibilityState={{ selected: ticket.assignee?.id === member.id }} disabled={isSubmitting} onPress={() => void adminUpdate(ticket.id, { assigned_to: member.id }).catch(() => {})} style={chip(ticket.assignee?.id === member.id)}>
                      {/* Esta línea sirve para mostrar el valor «member.name» dentro de «ThemedText». */}
                      <ThemedText type="small">{member.name}</ThemedText>
                    </Pressable>
                  ))}
                </View>

                {/* Esta línea sirve para mostrar el bloque solo si «ticket.context». */}
                {ticket.context && (
                  // Esta línea sirve para abrir el componente «ThemedView».
                  <ThemedView type="backgroundElement" style={styles.card}>
                    {/* Esta línea sirve para mostrar el valor «s.context» dentro de «ThemedText». */}
                    <ThemedText type="smallBold">{s.context}</ThemedText>
                    {/* Esta línea sirve para recorrer «Object.entries(ticket.context)» y mostrar un bloque por elemento. */}
                    {Object.entries(ticket.context).map(([key, value]) => (
                      // Esta línea sirve para abrir el componente «ThemedText».
                      <ThemedText key={key} type="small" themeColor="textSecondary">
                        {/* Esta línea sirve para mostrar el contenido dinámico «{s.contextLabels[key] ?? key}: {contextValue(key, value)}». */}
                        {s.contextLabels[key] ?? key}: {contextValue(key, value)}
                      </ThemedText>
                    ))}
                  </ThemedView>
                )}
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
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
  content: { width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center', padding: Spacing.four, gap: Spacing.three },
  // Esta línea sirve para definir el estilo «badges» con «flexDirection: 'row', alignItems: 'center', gap: S…».
  badges: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, flexWrap: 'wrap' },
  // Esta línea sirve para definir el estilo «chips» con «flexDirection: 'row', flexWrap: 'wrap', gap: Spaci…».
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  // Esta línea sirve para definir el estilo «chip» con «borderWidth: 1, borderRadius: 999, paddingHorizont…».
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one, minHeight: 36, justifyContent: 'center' },
  // Esta línea sirve para definir el estilo «card» con «borderRadius: Spacing.four, padding: Spacing.three…».
  card: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.one },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
});
