// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar «router, useLocalSearchParams» desde «expo-router».
import { router, useLocalSearchParams } from 'expo-router';
// Esta línea sirve para importar «KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View» desde «react-native».
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';

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
// Esta línea sirve para importar «formatSupportDate, STATUS_BADGE, supportStrings as t» desde «@/components/support/support-ui».
import { formatSupportDate, STATUS_BADGE, supportStrings as t } from '@/components/support/support-ui';
// Esta línea sirve para importar «TicketConversation» desde «@/components/support/ticket-conversation».
import { TicketConversation } from '@/components/support/ticket-conversation';
// Esta línea sirve para importar «MaxContentWidth, Spacing» desde «@/constants/theme».
import { MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useSupportStore» desde «@/store/support-store».
import { useSupportStore } from '@/store/support-store';

/** Conversación de una solicitud propia (destino también de la notificación de respuesta). */
// Esta línea sirve para declarar la función «SupportTicketScreen».
export default function SupportTicketScreen() {
  // Esta línea sirve para extraer «ticketId» de «useLocalSearchParams<{ ticketId: string ».
  const { ticketId } = useLocalSearchParams<{ ticketId: string }>();
  // Esta línea sirve para obtener «ticket, isLoadingTicket, isSubmitting, error, loadTicket, reply, closeTicket» con el hook «useSupportStore».
  const { ticket, isLoadingTicket, isSubmitting, error, loadTicket, reply, closeTicket } = useSupportStore();
  // Esta línea sirve para crear el estado «body» y su función «setBody».
  const [body, setBody] = useState('');

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «loadTicket» si «ticketId».
    if (ticketId) void loadTicket(ticketId);
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «ticketId, loadTicket».
  }, [ticketId, loadTicket]);

  // Esta línea sirve para extraer «urren» de «ticket && String(ticket.id) === ticketId».
  const current = ticket && String(ticket.id) === ticketId ? ticket : null;

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
            <PrimaryButton label={t.myRequests} variant="ghost" onPress={() => (router.canGoBack() ? router.back() : router.replace('/soporte' as never))} />

            {/* Esta línea sirve para mostrar el elemento solo si «isLoadingTicket && !current». */}
            {isLoadingTicket && !current && <Skeleton style={styles.skeleton} />}
            {/* Esta línea sirve para mostrar el bloque solo si «error && !current». */}
            {error && !current && (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="small" style={styles.error}>
                {/* Esta línea sirve para mostrar el valor «error». */}
                {error}
              </ThemedText>
            )}

            {/* Esta línea sirve para mostrar el bloque solo si «current». */}
            {current && (
              // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
              <>
                {/* Esta línea sirve para abrir el componente «View». */}
                <View style={styles.badges}>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor="textSecondary">
                    {/* Esta línea sirve para mostrar el contenido dinámico «{t.requestNumber(current.id)}». */}
                    {t.requestNumber(current.id)}
                  </ThemedText>
                  {/* Esta línea sirve para abrir el componente «Badge». */}
                  <Badge label={t.types[current.type]} variant="neutral" />
                  {/* Esta línea sirve para abrir el componente «Badge». */}
                  <Badge label={t.statuses[current.status]} variant={STATUS_BADGE[current.status]} />
                </View>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="subtitle" accessibilityRole="header">
                  {/* Esta línea sirve para mostrar el valor «current.subject». */}
                  {current.subject}
                </ThemedText>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar el contenido dinámico «{t.createdOn(formatSupportDate(current.created_at, true))}». */}
                  {t.createdOn(formatSupportDate(current.created_at, true))}
                  {/* Esta línea sirve para mostrar el origen del check-in si el ticket viene de uno. */}
                  {current.source === 'weekly_checkin' ? ` · ${t.fromCheckin}` : ''}
                </ThemedText>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary" accessibilityLiveRegion="polite">
                  {/* Esta línea sirve para mostrar el contenido dinámico «{t.statusHints[current.status]}». */}
                  {t.statusHints[current.status]}
                </ThemedText>

                {/* Esta línea sirve para abrir el componente «TicketConversation». */}
                <TicketConversation messages={current.messages ?? []} viewer="user" />

                {/* Esta línea sirve para mostrar el bloque solo si «error». */}
                {error && (
                  // Esta línea sirve para abrir el componente «ThemedText».
                  <ThemedText type="small" style={styles.error} accessibilityRole="alert">
                    {/* Esta línea sirve para mostrar el valor «error». */}
                    {error}
                  </ThemedText>
                )}

                {/* Esta línea sirve para elegir entre dos bloques según «current.status === 'closed'». */}
                {current.status === 'closed' ? (
                  // Esta línea sirve para abrir el componente «ThemedText».
                  <ThemedText type="small" themeColor="textSecondary">
                    {/* Esta línea sirve para mostrar el valor «t.closedNotice». */}
                    {t.closedNotice}
                  </ThemedText>
                // Esta línea sirve para mostrar el bloque alternativo.
                ) : (
                  // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
                  <>
                    {/* Esta línea sirve para abrir el componente «TextField». */}
                    <TextField label={t.reply} placeholder={t.replyPlaceholder} value={body} onChangeText={setBody} multiline maxLength={5000} />
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
                        // Esta línea sirve para llamar a «reply» con «current.id, body.trim()».
                        reply(current.id, body.trim())
                          // Esta línea sirve para encadenar la operación «then».
                          .then(() => setBody(''))
                          // Esta línea sirve para encadenar la operación «catch».
                          .catch(() => {});
                      }}
                    />
                    {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
                    <PrimaryButton label={t.closeRequest} variant="ghost" disabled={isSubmitting} onPress={() => void closeTicket(current.id).catch(() => {})} />
                  </>
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
  // Esta línea sirve para declarar la propiedad «skeleton» con el valor o tipo «{ height: 160, borderRadius: Spacing.four }».
  skeleton: { height: 160, borderRadius: Spacing.four },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
});
