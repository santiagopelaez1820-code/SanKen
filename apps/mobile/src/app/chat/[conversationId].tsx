import { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Flag, SendHorizontal } from 'lucide-react-native';
import type { ChatMessage, ReportReason } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import { useChatStore } from '@/store/chat-store';
import { Skeleton } from '@/components/ui/skeleton';

const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  abuse: 'Abuso',
  spam: 'Spam',
  inappropriate_content: 'Contenido inapropiado',
  other: 'Otro',
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatThreadScreen() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const id = Number(conversationId);
  const theme = useTheme();
  const { messages, conversations, isLoadingThread, openThread, closeThread, sendMessage } = useChatStore();
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const [reportingId, setReportingId] = useState<number | null>(null);
  const [reportReason, setReportReason] = useState<ReportReason>('abuse');
  const [reportedIds, setReportedIds] = useState<number[]>([]);

  // Si se entra desde una notificación el inbox puede no estar cargado:
  // entonces el nombre sale del primer mensaje del otro participante.
  const otherPartyName =
    conversations.find((c) => c.id === id)?.other_party.name ??
    messages.find((m) => !m.is_mine)?.sender_name ??
    'Chat';

  const submitReport = async (messageId: number) => {
    await api.post('/reports', { reportable_type: 'chat_message', reportable_id: messageId, reason: reportReason });
    setReportedIds((current) => [...current, messageId]);
    setReportingId(null);
  };

  useEffect(() => {
    if (id) openThread(id);
    return () => closeThread();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const canSend = body.trim().length > 0 && !isSending;

  const handleSend = async () => {
    const text = body.trim();
    if (!text || isSending) return;
    setSendError(null);
    setIsSending(true);
    setBody('');
    const ok = await sendMessage(text);
    setIsSending(false);
    if (!ok) {
      // El texto vuelve al input: antes se perdía en silencio si el envío fallaba.
      setBody(text);
      setSendError('No se pudo enviar el mensaje. Revisá tu conexión y probá de nuevo.');
    }
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    const previous = messages[index - 1];
    const isFirstOfGroup = !previous || previous.is_mine !== message.is_mine;
    const isReported = reportedIds.includes(message.id);

    return (
      <View
        key={message.id}
        style={[
          styles.bubbleRow,
          message.is_mine ? styles.bubbleRowMine : styles.bubbleRowTheirs,
          isFirstOfGroup && styles.groupStart,
        ]}>
        <Pressable
          // Mantener presionado un mensaje del otro abre las opciones de
          // reporte — antes era un link "Reportar" diminuto en cada burbuja.
          onLongPress={!message.is_mine && !isReported ? () => setReportingId(message.id) : undefined}
          delayLongPress={350}
          style={[
            styles.bubble,
            message.is_mine
              ? [styles.bubbleMine, { backgroundColor: theme.accent }]
              : [styles.bubbleTheirs, { backgroundColor: theme.backgroundElement }],
          ]}>
          <ThemedText type="default" style={[styles.bubbleText, message.is_mine && styles.bubbleTextMine]}>
            {message.body}
          </ThemedText>
          <ThemedText
            type="small"
            style={[styles.time, message.is_mine ? styles.timeMine : { color: theme.textSecondary }]}>
            {formatTime(message.created_at)}
          </ThemedText>
        </Pressable>

        {isReported && (
          <ThemedText type="small" themeColor="textSecondary" style={styles.reportedLabel}>
            Reportado
          </ThemedText>
        )}

        {reportingId === message.id && (
          <ThemedView type="backgroundElement" style={[styles.reportBox, { borderColor: theme.border }]}>
            <ThemedText type="smallBold">Reportar mensaje</ThemedText>
            {(Object.entries(REPORT_REASON_LABELS) as [ReportReason, string][]).map(([value, label]) => (
              <Pressable key={value} onPress={() => setReportReason(value)} style={styles.reasonRow}>
                <ThemedText type="small" themeColor={reportReason === value ? 'text' : 'textSecondary'}>
                  {reportReason === value ? '● ' : '○ '}
                  {label}
                </ThemedText>
              </Pressable>
            ))}
            <View style={styles.reportActions}>
              <Pressable onPress={() => setReportingId(null)} hitSlop={8}>
                <ThemedText type="small" themeColor="textSecondary">
                  Cancelar
                </ThemedText>
              </Pressable>
              <Pressable onPress={() => submitReport(message.id)} hitSlop={8}>
                <ThemedText type="smallBold" themeColor="accent">
                  Enviar reporte
                </ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        )}
      </View>
    );
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/*
          `padding` en ambas plataformas: con edge-to-edge (obligatorio desde
          RN 0.81) Android ya no achica la ventana al abrir el teclado, así
          que sin esto el campo de texto quedaba tapado.
        */}
        <KeyboardAvoidingView style={styles.flex} behavior="padding">
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Volver">
              <Icon icon={ChevronLeft} size={24} color={theme.text} />
            </Pressable>
            <Avatar name={otherPartyName} avatarUrl={null} size={36} />
            <ThemedText type="smallBold" numberOfLines={1} style={styles.headerName}>
              {otherPartyName}
            </ThemedText>
          </View>

          <ScrollView
            ref={scrollRef}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}>
            {isLoadingThread && (
              <>
                <Skeleton height={44} width="60%" borderRadius={Spacing.three} />
                <Skeleton height={44} width="45%" borderRadius={Spacing.three} style={styles.skeletonMine} />
              </>
            )}

            {!isLoadingThread && messages.length === 0 && (
              <ThemedText type="small" themeColor="textSecondary" style={styles.emptyText}>
                Todavía no hay mensajes. ¡Escribí el primero!
              </ThemedText>
            )}

            {messages.map(renderMessage)}

            {!isLoadingThread && messages.some((m) => !m.is_mine) && (
              <View style={styles.hintRow}>
                <Icon icon={Flag} size={12} color={theme.textSecondary} />
                <ThemedText type="small" themeColor="textSecondary" style={styles.hintText}>
                  Mantené presionado un mensaje para reportarlo
                </ThemedText>
              </View>
            )}
          </ScrollView>

          {sendError && (
            <ThemedText type="small" style={[styles.sendError, { color: theme.error }]}>
              {sendError}
            </ThemedText>
          )}

          <View style={[styles.composer, { borderTopColor: theme.border }]}>
            <TextInput
              value={body}
              onChangeText={(text) => {
                setBody(text);
                if (sendError) setSendError(null);
              }}
              placeholder="Escribí un mensaje…"
              placeholderTextColor={theme.textSecondary}
              multiline
              maxLength={2000}
              style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
            />
            <Pressable
              disabled={!canSend}
              onPress={handleSend}
              accessibilityRole="button"
              accessibilityLabel="Enviar mensaje"
              style={[styles.sendButton, { backgroundColor: canSend ? theme.accent : theme.backgroundSelected }]}>
              {isSending ? (
                <ActivityIndicator size="small" color="#050505" />
              ) : (
                <Icon icon={SendHorizontal} size={20} color={canSend ? '#050505' : theme.textSecondary} />
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1, width: '100%', maxWidth: MaxContentWidth },
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerName: { flex: 1, fontSize: 16 },
  messagesList: { flex: 1, alignSelf: 'stretch' },
  messagesContent: { gap: Spacing.one, paddingHorizontal: Spacing.three, paddingVertical: Spacing.three },
  skeletonMine: { alignSelf: 'flex-end' },
  emptyText: { textAlign: 'center', marginTop: Spacing.four },
  bubbleRow: { maxWidth: '82%', gap: 2 },
  bubbleRowMine: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  bubbleRowTheirs: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  groupStart: { marginTop: Spacing.two },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.one,
  },
  bubbleMine: { borderBottomRightRadius: 6 },
  bubbleTheirs: { borderBottomLeftRadius: 6 },
  bubbleText: { fontSize: 15, lineHeight: 21 },
  bubbleTextMine: { color: '#050505' },
  time: { fontSize: 10, lineHeight: 14, alignSelf: 'flex-end', marginTop: 2 },
  timeMine: { color: 'rgba(5,5,5,0.6)' },
  reportedLabel: { fontSize: 10 },
  reportBox: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
    marginTop: Spacing.one,
    minWidth: 220,
  },
  reasonRow: { paddingVertical: Spacing.one },
  reportActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.four, marginTop: Spacing.one },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    marginTop: Spacing.three,
  },
  hintText: { fontSize: 11 },
  sendError: { paddingHorizontal: Spacing.three, paddingBottom: Spacing.one },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: 22,
    paddingHorizontal: Spacing.three,
    paddingTop: 11,
    paddingBottom: 11,
    fontSize: 15,
    textAlignVertical: 'center',
  },
  sendButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
