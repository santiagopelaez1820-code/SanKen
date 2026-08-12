import { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ReportReason } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import { useChatStore } from '@/store/chat-store';

const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  abuse: 'Abuso',
  spam: 'Spam',
  inappropriate_content: 'Contenido inapropiado',
  other: 'Otro',
};

export default function ChatThreadScreen() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const id = Number(conversationId);
  const theme = useTheme();
  const { messages, isLoadingThread, openThread, closeThread, sendMessage } = useChatStore();
  const [body, setBody] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const [reportingId, setReportingId] = useState<number | null>(null);
  const [reportReason, setReportReason] = useState<ReportReason>('abuse');
  const [reportedIds, setReportedIds] = useState<number[]>([]);

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

  const handleSend = () => {
    const text = body.trim();
    if (!text) return;
    setBody('');
    sendMessage(text);
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.content}>
            <ThemedText type="small" themeColor="textSecondary" onPress={() => router.back()}>
              ← Chat
            </ThemedText>

            <ScrollView ref={scrollRef} style={styles.messagesList} contentContainerStyle={styles.messagesContent}>
              {isLoadingThread && (
                <ThemedText type="small" themeColor="textSecondary">
                  Cargando…
                </ThemedText>
              )}

              {messages.map((message) => (
                <View
                  key={message.id}
                  style={[styles.bubbleRow, message.is_mine ? styles.bubbleRowMine : styles.bubbleRowTheirs]}
                >
                  <View
                    style={[
                      styles.bubble,
                      { backgroundColor: message.is_mine ? theme.accent : theme.backgroundSelected },
                    ]}
                  >
                    <ThemedText type="small" style={message.is_mine ? styles.bubbleTextMine : undefined}>
                      {message.body}
                    </ThemedText>
                  </View>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.meta}>
                    {message.is_mine ? 'Vos' : message.sender_name}
                    {!message.is_mine && !reportedIds.includes(message.id) && (
                      <ThemedText type="small" themeColor="textSecondary" onPress={() => setReportingId(message.id)}>
                        {'  '}Reportar
                      </ThemedText>
                    )}
                    {reportedIds.includes(message.id) && '  Reportado'}
                  </ThemedText>

                  {reportingId === message.id && (
                    <View style={[styles.reportBox, { borderColor: theme.backgroundSelected }]}>
                      {(Object.entries(REPORT_REASON_LABELS) as [ReportReason, string][]).map(([value, label]) => (
                        <Pressable key={value} onPress={() => setReportReason(value)} style={styles.reasonRow}>
                          <ThemedText type="small" themeColor={reportReason === value ? 'text' : 'textSecondary'}>
                            {reportReason === value ? '● ' : '○ '}
                            {label}
                          </ThemedText>
                        </Pressable>
                      ))}
                      <View style={styles.reportActions}>
                        <Pressable onPress={() => submitReport(message.id)}>
                          <ThemedText type="smallBold" themeColor="accent">
                            Enviar
                          </ThemedText>
                        </Pressable>
                        <Pressable onPress={() => setReportingId(null)}>
                          <ThemedText type="small" themeColor="textSecondary">
                            Cancelar
                          </ThemedText>
                        </Pressable>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>

            <View style={styles.composer}>
              <TextInput
                value={body}
                onChangeText={setBody}
                placeholder="Escribí un mensaje…"
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
              />
              <Pressable
                disabled={!body.trim()}
                onPress={handleSend}
                style={[styles.sendButton, { backgroundColor: theme.accent }, !body.trim() && styles.disabled]}
              >
                <ThemedText type="smallBold" style={styles.bubbleTextMine}>
                  Enviar
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  messagesList: { flex: 1 },
  messagesContent: { gap: Spacing.two, paddingVertical: Spacing.two },
  bubbleRow: { maxWidth: '80%', gap: 2 },
  bubbleRowMine: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  bubbleRowTheirs: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubble: { borderRadius: Spacing.three, paddingHorizontal: Spacing.two, paddingVertical: Spacing.one },
  bubbleTextMine: { color: '#0A0A09' },
  meta: { fontSize: 10 },
  reportBox: { borderWidth: 1, borderRadius: Spacing.two, padding: Spacing.two, gap: Spacing.half, maxWidth: '80%' },
  reasonRow: { paddingVertical: 2 },
  reportActions: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.one },
  composer: { flexDirection: 'row', gap: Spacing.two, paddingVertical: Spacing.two },
  input: { flex: 1, borderWidth: 1, borderRadius: Spacing.three, paddingHorizontal: Spacing.two, paddingVertical: Spacing.two },
  sendButton: { borderRadius: Spacing.three, paddingHorizontal: Spacing.three, justifyContent: 'center' },
  disabled: { opacity: 0.5 },
});
