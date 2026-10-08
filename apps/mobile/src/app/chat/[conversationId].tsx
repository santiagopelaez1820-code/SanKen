// Esta línea sirve para importar «useEffect, useRef, useState» desde «react».
import { useEffect, useRef, useState } from 'react';
// Esta línea sirve para importar «router, useLocalSearchParams» desde «expo-router».
import { router, useLocalSearchParams } from 'expo-router';
// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «ActivityIndicator» en la lista.
  ActivityIndicator,
  // Esta línea sirve para incluir el valor «KeyboardAvoidingView» en la lista.
  KeyboardAvoidingView,
  // Esta línea sirve para incluir el valor «Pressable» en la lista.
  Pressable,
  // Esta línea sirve para incluir el valor «ScrollView» en la lista.
  ScrollView,
  // Esta línea sirve para incluir el valor «StyleSheet» en la lista.
  StyleSheet,
  // Esta línea sirve para incluir el valor «TextInput» en la lista.
  TextInput,
  // Esta línea sirve para incluir el valor «View» en la lista.
  View,
// Esta línea sirve para terminar la importación desde «react-native».
} from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «ChevronLeft, Flag, SendHorizontal» desde «lucide-react-native».
import { ChevronLeft, Flag, SendHorizontal } from 'lucide-react-native';
// Esta línea sirve para importar los tipos «ChatMessage, ReportReason» desde «@sanken/core».
import type { ChatMessage, ReportReason } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «Avatar» desde «@/components/ui/avatar».
import { Avatar } from '@/components/ui/avatar';
// Esta línea sirve para importar «Icon» desde «@/components/ui/icon».
import { Icon } from '@/components/ui/icon';
// Esta línea sirve para importar «MaxContentWidth, Spacing» desde «@/constants/theme».
import { MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «useChatStore» desde «@/store/chat-store».
import { useChatStore } from '@/store/chat-store';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';

// Esta línea sirve para declarar «REPORT_REASON_LABELS» con el valor «{».
const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  // Esta línea sirve para declarar la propiedad «abuse» con el valor o tipo «'Abuso'».
  abuse: 'Abuso',
  // Esta línea sirve para declarar la propiedad «spam» con el valor o tipo «'Spam'».
  spam: 'Spam',
  // Esta línea sirve para declarar la propiedad «inappropriate_content» con el valor o tipo «'Contenido inapropiado'».
  inappropriate_content: 'Contenido inapropiado',
  // Esta línea sirve para declarar la propiedad «other» con el valor o tipo «'Otro'».
  other: 'Otro',
};

// Esta línea sirve para declarar la función «formatTime».
function formatTime(iso: string): string {
  // Esta línea sirve para devolver la hora del mensaje con dos dígitos.
  return new Date(iso).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

// Esta línea sirve para declarar la función «ChatThreadScreen».
export default function ChatThreadScreen() {
  // Esta línea sirve para extraer «conversationId» de «useLocalSearchParams<{ conversationId: s».
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  // Esta línea sirve para extraer «» de «Number(conversationId)».
  const id = Number(conversationId);
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «messages, conversations, isLoadingThread, openThread, closeThread, sendMessage» con el hook «useChatStore».
  const { messages, conversations, isLoadingThread, openThread, closeThread, sendMessage } = useChatStore();
  // Esta línea sirve para crear el estado «body» y su función «setBody».
  const [body, setBody] = useState('');
  // Esta línea sirve para crear el estado «isSending» y su función «setIsSending».
  const [isSending, setIsSending] = useState(false);
  // Esta línea sirve para crear el estado «sendError» y su función «setSendError».
  const [sendError, setSendError] = useState<string | null>(null);
  // Esta línea sirve para crear la referencia «scrollRef».
  const scrollRef = useRef<ScrollView>(null);
  // Esta línea sirve para crear el estado «reportingId» y su función «setReportingId».
  const [reportingId, setReportingId] = useState<number | null>(null);
  // Esta línea sirve para crear el estado «reportReason» y su función «setReportReason».
  const [reportReason, setReportReason] = useState<ReportReason>('abuse');
  // Esta línea sirve para crear el estado «reportedIds» y su función «setReportedIds».
  const [reportedIds, setReportedIds] = useState<number[]>([]);

  // Si se entra desde una notificación el inbox puede no estar cargado:
  // entonces el nombre sale del primer mensaje del otro participante.
  // Esta línea sirve para calcular el nombre de la otra persona de la conversación.
  const otherPartyName =
    // Esta línea sirve para buscarlo primero en la lista de conversaciones.
    conversations.find((c) => c.id === id)?.other_party.name ??
    // Esta línea sirve para buscarlo después en el remitente de los mensajes recibidos.
    messages.find((m) => !m.is_mine)?.sender_name ??
    // Esta línea sirve para incluir el texto o las clases «Chat…».
    'Chat';

  // Esta línea sirve para extraer «ubmitRepor» de «async (messageId: number) => {».
  const submitReport = async (messageId: number) => {
    // Esta línea sirve para esperar el resultado de «api.post».
    await api.post('/reports', { reportable_type: 'chat_message', reportable_id: messageId, reason: reportReason });
    // Esta línea sirve para guardar en el estado con «setReportedIds» el valor «(current) => [...current, messageId])…».
    setReportedIds((current) => [...current, messageId]);
    // Esta línea sirve para guardar en el estado con «setReportingId» el valor «null)…».
    setReportingId(null);
  };

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «openThread» si «id».
    if (id) openThread(id);
    // Esta línea sirve para devolver «() => closeThread()».
    return () => closeThread();
    // Esta línea sirve para volver a ejecutar el efecto cuando cambian «id».
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «scrollRef.current?.scrollToEnd» con «{ animated: true }».
    scrollRef.current?.scrollToEnd({ animated: true });
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «messages».
  }, [messages]);

  // Esta línea sirve para extraer «anSen» de «body.trim().length > 0 && !isSending».
  const canSend = body.trim().length > 0 && !isSending;

  // Esta línea sirve para extraer «andleSen» de «async () => {».
  const handleSend = async () => {
    // Esta línea sirve para extraer «ex» de «body.trim()».
    const text = body.trim();
    // Esta línea sirve para salir de la función si «!text || isSending».
    if (!text || isSending) return;
    // Esta línea sirve para guardar en el estado con «setSendError» el valor «null)…».
    setSendError(null);
    // Esta línea sirve para guardar en el estado con «setIsSending» el valor «true)…».
    setIsSending(true);
    // Esta línea sirve para guardar en el estado con «setBody» el valor «'')…».
    setBody('');
    // Esta línea sirve para esperar «sendMessage(text)» y guardar el resultado en «ok».
    const ok = await sendMessage(text);
    // Esta línea sirve para guardar en el estado con «setIsSending» el valor «false)…».
    setIsSending(false);
    // Esta línea sirve para revisar si «!ok».
    if (!ok) {
      // El texto vuelve al input: antes se perdía en silencio si el envío fallaba.
      // Esta línea sirve para guardar en el estado con «setBody» el valor «text)…».
      setBody(text);
      // Esta línea sirve para guardar en el estado con «setSendError» el valor «'No se pudo enviar el mensaje. Revisá tu cone…».
      setSendError('No se pudo enviar el mensaje. Revisá tu conexión y probá de nuevo.');
    }
  };

  // Esta línea sirve para extraer «enderMessag» de «(message: ChatMessage, index: number) =>».
  const renderMessage = (message: ChatMessage, index: number) => {
    // Esta línea sirve para extraer «reviou» de «messages[index - 1]».
    const previous = messages[index - 1];
    // Esta línea sirve para extraer «sFirstOfGrou» de «!previous || previous.is_mine !== messag».
    const isFirstOfGroup = !previous || previous.is_mine !== message.is_mine;
    // Esta línea sirve para extraer «sReporte» de «reportedIds.includes(message.id)».
    const isReported = reportedIds.includes(message.id);

    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el elemento «View» con sus atributos en varias líneas.
      <View
        // Esta línea sirve para identificar el elemento de la lista con «message.id}».
        key={message.id}
        // Esta línea sirve para pasar la propiedad «style» con el valor «[».
        style={[
          // Esta línea sirve para agregar el estilo «styles.bubbleRow».
          styles.bubbleRow,
          // Esta línea sirve para alinear la burbuja según sea mía o de la otra persona.
          message.is_mine ? styles.bubbleRowMine : styles.bubbleRowTheirs,
          // Esta línea sirve para agregar margen si es el primer mensaje del grupo.
          isFirstOfGroup && styles.groupStart,
        ]}>
        {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
        <Pressable
          // Mantener presionado un mensaje del otro abre las opciones de
          // reporte — antes era un link "Reportar" diminuto en cada burbuja.
          // Esta línea sirve para asignar el manejador del evento «onLongPress».
          onLongPress={!message.is_mine && !isReported ? () => setReportingId(message.id) : undefined}
          // Esta línea sirve para pasar la propiedad «delayLongPress» con el valor «350}».
          delayLongPress={350}
          // Esta línea sirve para pasar la propiedad «style» con el valor «[».
          style={[
            // Esta línea sirve para agregar el estilo «styles.bubble».
            styles.bubble,
            // Esta línea sirve para elegir el estilo de la burbuja según el autor.
            message.is_mine
              // Esta línea sirve para usar el color de acento si es mía.
              ? [styles.bubbleMine, { backgroundColor: theme.accent }]
              // Esta línea sirve para usar el color de elemento si es de la otra persona.
              : [styles.bubbleTheirs, { backgroundColor: theme.backgroundElement }],
          ]}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="default" style={[styles.bubbleText, message.is_mine && styles.bubbleTextMine]}>
            {/* Esta línea sirve para mostrar el valor «message.body». */}
            {message.body}
          </ThemedText>
          {/* Esta línea sirve para abrir el elemento «ThemedText» con sus atributos en varias líneas. */}
          <ThemedText
            // Esta línea sirve para definir el atributo «type» con el valor «small».
            type="small"
            // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.time, message.is_mine ? styles.timeMi».
            style={[styles.time, message.is_mine ? styles.timeMine : { color: theme.textSecondary }]}>
            {/* Esta línea sirve para mostrar el contenido dinámico «{formatTime(message.created_at)}». */}
            {formatTime(message.created_at)}
          </ThemedText>
        </Pressable>

        {/* Esta línea sirve para mostrar el bloque solo si «isReported». */}
        {isReported && (
          // Esta línea sirve para abrir el componente «ThemedText».
          <ThemedText type="small" themeColor="textSecondary" style={styles.reportedLabel}>
            {/* Esta línea sirve para mostrar el texto «Reportado». */}
            Reportado
          </ThemedText>
        )}

        {/* Esta línea sirve para mostrar el bloque solo si «reportingId === message.id». */}
        {reportingId === message.id && (
          // Esta línea sirve para abrir el componente «ThemedView».
          <ThemedView type="backgroundElement" style={[styles.reportBox, { borderColor: theme.border }]}>
            {/* Esta línea sirve para mostrar el texto «Reportar mensaje» dentro de «ThemedText». */}
            <ThemedText type="smallBold">Reportar mensaje</ThemedText>
            {/* Esta línea sirve para recorrer los motivos de reporte para mostrarlos. */}
            {(Object.entries(REPORT_REASON_LABELS) as [ReportReason, string][]).map(([value, label]) => (
              // Esta línea sirve para abrir el componente «Pressable» con sus propiedades.
              <Pressable key={value} onPress={() => setReportReason(value)} style={styles.reasonRow}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor={reportReason === value ? 'text' : 'textSecondary'}>
                  {/* Esta línea sirve para mostrar el contenido dinámico «{reportReason === value ? '● ' : '○ '}». */}
                  {reportReason === value ? '● ' : '○ '}
                  {/* Esta línea sirve para mostrar el valor «label». */}
                  {label}
                </ThemedText>
              </Pressable>
            ))}
            {/* Esta línea sirve para abrir el componente «View». */}
            <View style={styles.reportActions}>
              {/* Esta línea sirve para abrir el componente «Pressable» con sus propiedades. */}
              <Pressable onPress={() => setReportingId(null)} hitSlop={8}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar el texto «Cancelar». */}
                  Cancelar
                </ThemedText>
              </Pressable>
              {/* Esta línea sirve para abrir el componente «Pressable» con sus propiedades. */}
              <Pressable onPress={() => submitReport(message.id)} hitSlop={8}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="smallBold" themeColor="accent">
                  {/* Esta línea sirve para mostrar el texto «Enviar reporte». */}
                  Enviar reporte
                </ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        )}
      </View>
    );
  };

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Esta línea sirve para mostrar el contenido dinámico «{/*». */}
        {/*
          // Esta línea sirve para incluir el texto o las clases «padding…».
          `padding` en ambas plataformas: con edge-to-edge (obligatorio desde
          // Esta línea sirve para continuar el comentario sobre el teclado en Android.
          RN 0.81) Android ya no achica la ventana al abrir el teclado, así
          // Esta línea sirve para continuar el comentario sobre el teclado en Android.
          que sin esto el campo de texto quedaba tapado.
        // Esta línea sirve para cerrar el comentario sobre el teclado.
        */}
        {/* Esta línea sirve para abrir el componente «KeyboardAvoidingView». */}
        <KeyboardAvoidingView style={styles.flex} behavior="padding">
          {/* Esta línea sirve para abrir el componente «View». */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
            <Pressable
              // Esta línea sirve para asignar el manejador del evento «onPress».
              onPress={() => router.back()}
              // Esta línea sirve para pasar la propiedad «style» con el valor «styles.backButton}».
              style={styles.backButton}
              // Esta línea sirve para pasar la propiedad «hitSlop» con el valor «8}».
              hitSlop={8}
              // Esta línea sirve para definir el atributo «accessibilityRole» con el valor «button».
              accessibilityRole="button"
              // Esta línea sirve para definir el atributo «accessibilityLabel» con el valor «Volver».
              accessibilityLabel="Volver">
              {/* Esta línea sirve para abrir el componente «Icon». */}
              <Icon icon={ChevronLeft} size={24} color={theme.text} />
            </Pressable>
            {/* Esta línea sirve para abrir el componente «Avatar». */}
            <Avatar name={otherPartyName} avatarUrl={null} size={36} />
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="smallBold" numberOfLines={1} style={styles.headerName}>
              {/* Esta línea sirve para mostrar el valor «otherPartyName». */}
              {otherPartyName}
            </ThemedText>
          </View>

          {/* Esta línea sirve para abrir el elemento «ScrollView» con sus atributos en varias líneas. */}
          <ScrollView
            // Esta línea sirve para conectar la referencia «scrollRef}» con el elemento.
            ref={scrollRef}
            // Esta línea sirve para pasar la propiedad «style» con el valor «styles.messagesList}».
            style={styles.messagesList}
            // Esta línea sirve para pasar la propiedad «contentContainerStyle» con el valor «styles.messagesContent}».
            contentContainerStyle={styles.messagesContent}
            // Esta línea sirve para definir el atributo «keyboardShouldPersistTaps» con el valor «handled».
            keyboardShouldPersistTaps="handled"
            // Esta línea sirve para asignar el manejador del evento «onContentSizeChange».
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}>
            {/* Esta línea sirve para mostrar el bloque solo si «isLoadingThread». */}
            {isLoadingThread && (
              // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
              <>
                {/* Esta línea sirve para abrir el componente «Skeleton». */}
                <Skeleton height={44} width="60%" borderRadius={Spacing.three} />
                {/* Esta línea sirve para abrir el componente «Skeleton». */}
                <Skeleton height={44} width="45%" borderRadius={Spacing.three} style={styles.skeletonMine} />
              </>
            )}

            {/* Esta línea sirve para mostrar el bloque solo si «!isLoadingThread && messages.length === 0». */}
            {!isLoadingThread && messages.length === 0 && (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="small" themeColor="textSecondary" style={styles.emptyText}>
                {/* Esta línea sirve para mostrar el texto «Todavía no hay mensajes. ¡Escribí el primero!». */}
                Todavía no hay mensajes. ¡Escribí el primero!
              </ThemedText>
            )}

            {/* Esta línea sirve para mostrar el contenido dinámico «{messages.map(renderMessage)}». */}
            {messages.map(renderMessage)}

            {/* Esta línea sirve para mostrar la ayuda de reportar si hay mensajes de la otra persona. */}
            {!isLoadingThread && messages.some((m) => !m.is_mine) && (
              // Esta línea sirve para abrir el componente «View».
              <View style={styles.hintRow}>
                {/* Esta línea sirve para abrir el componente «Icon». */}
                <Icon icon={Flag} size={12} color={theme.textSecondary} />
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary" style={styles.hintText}>
                  {/* Esta línea sirve para mostrar el texto «Mantené presionado un mensaje para reportarlo». */}
                  Mantené presionado un mensaje para reportarlo
                </ThemedText>
              </View>
            )}
          </ScrollView>

          {/* Esta línea sirve para mostrar el bloque solo si «sendError». */}
          {sendError && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" style={[styles.sendError, { color: theme.error }]}>
              {/* Esta línea sirve para mostrar el valor «sendError». */}
              {sendError}
            </ThemedText>
          )}

          {/* Esta línea sirve para abrir el componente «View». */}
          <View style={[styles.composer, { borderTopColor: theme.border }]}>
            {/* Esta línea sirve para abrir el elemento «TextInput» con sus atributos en varias líneas. */}
            <TextInput
              // Esta línea sirve para pasar la propiedad «value» con el valor «body}».
              value={body}
              // Esta línea sirve para asignar el manejador del evento «onChangeText».
              onChangeText={(text) => {
                // Esta línea sirve para guardar en el estado con «setBody» el valor «text)…».
                setBody(text);
                // Esta línea sirve para llamar a «setSendError» si «sendError».
                if (sendError) setSendError(null);
              }}
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Escribí un mensaje…».
              placeholder="Escribí un mensaje…"
              // Esta línea sirve para pasar la propiedad «placeholderTextColor» con el valor «theme.textSecondary}».
              placeholderTextColor={theme.textSecondary}
              // Esta línea sirve para activar la opción «multiline».
              multiline
              // Esta línea sirve para pasar la propiedad «maxLength» con el valor «2000}».
              maxLength={2000}
              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.input, { backgroundColor: theme.backg».
              style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
            />
            {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
            <Pressable
              // Esta línea sirve para pasar la propiedad «disabled» con el valor «!canSend}».
              disabled={!canSend}
              // Esta línea sirve para asignar el manejador del evento «onPress».
              onPress={handleSend}
              // Esta línea sirve para definir el atributo «accessibilityRole» con el valor «button».
              accessibilityRole="button"
              // Esta línea sirve para definir el atributo «accessibilityLabel» con el valor «Enviar mensaje».
              accessibilityLabel="Enviar mensaje"
              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.sendButton, { backgroundColor: canSen».
              style={[styles.sendButton, { backgroundColor: canSend ? theme.accent : theme.backgroundSelected }]}>
              {/* Esta línea sirve para elegir entre dos bloques según «isSending». */}
              {isSending ? (
                // Esta línea sirve para abrir el componente «ActivityIndicator».
                <ActivityIndicator size="small" color="#050505" />
              // Esta línea sirve para mostrar el bloque alternativo.
              ) : (
                // Esta línea sirve para abrir el componente «Icon».
                <Icon icon={SendHorizontal} size={20} color={canSend ? '#050505' : theme.textSecondary} />
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «root» con el valor o tipo «{ flex: 1 }».
  root: { flex: 1 },
  // Esta línea sirve para definir el estilo «flex» con «flex: 1, width: '100%', maxWidth: MaxContentWidth …».
  flex: { flex: 1, width: '100%', maxWidth: MaxContentWidth },
  // Esta línea sirve para definir el estilo «safeArea» con «flex: 1, alignItems: 'center', width: '100%' },…».
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  // Esta línea sirve para declarar la propiedad «header» con el valor o tipo «{».
  header: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.two».
    paddingHorizontal: Spacing.two,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two».
    paddingVertical: Spacing.two,
    // Esta línea sirve para declarar la propiedad «borderBottomWidth» con el valor o tipo «StyleSheet.hairlineWidth».
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  // Esta línea sirve para definir el estilo «backButton» con «width: 40, height: 40, alignItems: 'center', justi…».
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  // Esta línea sirve para declarar la propiedad «headerName» con el valor o tipo «{ flex: 1, fontSize: 16 }».
  headerName: { flex: 1, fontSize: 16 },
  // Esta línea sirve para declarar la propiedad «messagesList» con el valor o tipo «{ flex: 1, alignSelf: 'stretch' }».
  messagesList: { flex: 1, alignSelf: 'stretch' },
  // Esta línea sirve para definir el estilo «messagesContent» con «gap: Spacing.one, paddingHorizontal: Spacing.three…».
  messagesContent: { gap: Spacing.one, paddingHorizontal: Spacing.three, paddingVertical: Spacing.three },
  // Esta línea sirve para declarar la propiedad «skeletonMine» con el valor o tipo «{ alignSelf: 'flex-end' }».
  skeletonMine: { alignSelf: 'flex-end' },
  // Esta línea sirve para definir el estilo «emptyText» con «textAlign: 'center', marginTop: Spacing.four },…».
  emptyText: { textAlign: 'center', marginTop: Spacing.four },
  // Esta línea sirve para declarar la propiedad «bubbleRow» con el valor o tipo «{ maxWidth: '82%', gap: 2 }».
  bubbleRow: { maxWidth: '82%', gap: 2 },
  // Esta línea sirve para definir el estilo «bubbleRowMine» con «alignSelf: 'flex-end', alignItems: 'flex-end' },…».
  bubbleRowMine: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  // Esta línea sirve para definir el estilo «bubbleRowTheirs» con «alignSelf: 'flex-start', alignItems: 'flex-start' …».
  bubbleRowTheirs: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  // Esta línea sirve para declarar la propiedad «groupStart» con el valor o tipo «{ marginTop: Spacing.two }».
  groupStart: { marginTop: Spacing.two },
  // Esta línea sirve para declarar la propiedad «bubble» con el valor o tipo «{».
  bubble: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «18».
    borderRadius: 18,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.three».
    paddingHorizontal: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingTop» con el valor o tipo «Spacing.two».
    paddingTop: Spacing.two,
    // Esta línea sirve para declarar la propiedad «paddingBottom» con el valor o tipo «Spacing.one».
    paddingBottom: Spacing.one,
  },
  // Esta línea sirve para declarar la propiedad «bubbleMine» con el valor o tipo «{ borderBottomRightRadius: 6 }».
  bubbleMine: { borderBottomRightRadius: 6 },
  // Esta línea sirve para declarar la propiedad «bubbleTheirs» con el valor o tipo «{ borderBottomLeftRadius: 6 }».
  bubbleTheirs: { borderBottomLeftRadius: 6 },
  // Esta línea sirve para declarar la propiedad «bubbleText» con el valor o tipo «{ fontSize: 15, lineHeight: 21 }».
  bubbleText: { fontSize: 15, lineHeight: 21 },
  // Esta línea sirve para declarar la propiedad «bubbleTextMine» con el valor o tipo «{ color: '#050505' }».
  bubbleTextMine: { color: '#050505' },
  // Esta línea sirve para definir el estilo «time» con «fontSize: 10, lineHeight: 14, alignSelf: 'flex-end…».
  time: { fontSize: 10, lineHeight: 14, alignSelf: 'flex-end', marginTop: 2 },
  // Esta línea sirve para declarar la propiedad «timeMine» con el valor o tipo «{ color: 'rgba(5,5,5,0.6)' }».
  timeMine: { color: 'rgba(5,5,5,0.6)' },
  // Esta línea sirve para declarar la propiedad «reportedLabel» con el valor o tipo «{ fontSize: 10 }».
  reportedLabel: { fontSize: 10 },
  // Esta línea sirve para declarar la propiedad «reportBox» con el valor o tipo «{».
  reportBox: {
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.one».
    gap: Spacing.one,
    // Esta línea sirve para declarar la propiedad «marginTop» con el valor o tipo «Spacing.one».
    marginTop: Spacing.one,
    // Esta línea sirve para declarar la propiedad «minWidth» con el valor o tipo «220».
    minWidth: 220,
  },
  // Esta línea sirve para declarar la propiedad «reasonRow» con el valor o tipo «{ paddingVertical: Spacing.one }».
  reasonRow: { paddingVertical: Spacing.one },
  // Esta línea sirve para definir el estilo «reportActions» con «flexDirection: 'row', justifyContent: 'flex-end', …».
  reportActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.four, marginTop: Spacing.one },
  // Esta línea sirve para declarar la propiedad «hintRow» con el valor o tipo «{».
  hintRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.one».
    gap: Spacing.one,
    // Esta línea sirve para declarar la propiedad «marginTop» con el valor o tipo «Spacing.three».
    marginTop: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «hintText» con el valor o tipo «{ fontSize: 11 }».
  hintText: { fontSize: 11 },
  // Esta línea sirve para definir el estilo «sendError» con «paddingHorizontal: Spacing.three, paddingBottom: S…».
  sendError: { paddingHorizontal: Spacing.three, paddingBottom: Spacing.one },
  // Esta línea sirve para declarar la propiedad «composer» con el valor o tipo «{».
  composer: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'flex-end'».
    alignItems: 'flex-end',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.three».
    paddingHorizontal: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two».
    paddingVertical: Spacing.two,
    // Esta línea sirve para declarar la propiedad «borderTopWidth» con el valor o tipo «StyleSheet.hairlineWidth».
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  // Esta línea sirve para declarar la propiedad «input» con el valor o tipo «{».
  input: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
    // Esta línea sirve para declarar la propiedad «minHeight» con el valor o tipo «44».
    minHeight: 44,
    // Esta línea sirve para declarar la propiedad «maxHeight» con el valor o tipo «120».
    maxHeight: 120,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «22».
    borderRadius: 22,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.three».
    paddingHorizontal: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingTop» con el valor o tipo «11».
    paddingTop: 11,
    // Esta línea sirve para declarar la propiedad «paddingBottom» con el valor o tipo «11».
    paddingBottom: 11,
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «15».
    fontSize: 15,
    // Esta línea sirve para declarar la propiedad «textAlignVertical» con el valor o tipo «'center'».
    textAlignVertical: 'center',
  },
  // Esta línea sirve para definir el estilo «sendButton» con «width: 44, height: 44, borderRadius: 22, alignItem…».
  sendButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
