import { useState } from 'react';
import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SUPPORT_TICKET_TYPES, type SupportTicketType } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { supportStrings as t } from '@/components/support/support-ui';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSupportStore } from '@/store/support-store';

/** Nueva solicitud: tipo, asunto y mensaje. */
export default function NewSupportRequestScreen() {
  const theme = useTheme();
  const { createTicket, isSubmitting, error, clearError } = useSupportStore();
  const [type, setType] = useState<SupportTicketType>('question');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const canSubmit = subject.trim().length >= 3 && message.trim().length >= 3 && !isSubmitting;

  const submit = () => {
    clearError();
    createTicket({ type, subject: subject.trim(), message: message.trim() })
      .then((ticket) => router.replace({ pathname: '/soporte/[ticketId]', params: { ticketId: String(ticket.id) } }))
      .catch(() => {});
  };

  return (
    <ThemedView style={styles.root}>
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <ThemedText type="title" style={styles.pageTitle} accessibilityRole="header">
              {t.newRequest}
            </ThemedText>

            <ThemedText type="smallBold">{t.typeLabel}</ThemedText>
            <View style={styles.types} accessibilityRole="radiogroup" accessibilityLabel={t.typeLabel}>
              {SUPPORT_TICKET_TYPES.map((value) => {
                const selected = type === value;
                return (
                  <Pressable
                    key={value}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    accessibilityHint={t.typeHints[value]}
                    onPress={() => setType(value)}
                    style={[
                      styles.chip,
                      { borderColor: selected ? theme.accent : theme.border, backgroundColor: selected ? `${theme.accent}22` : 'transparent' },
                    ]}
                  >
                    <ThemedText type="small">{t.types[value]}</ThemedText>
                  </Pressable>
                );
              })}
            </View>
            <ThemedText type="small" themeColor="textSecondary">
              {t.typeHints[type]}
            </ThemedText>

            <TextField label={t.subjectLabel} placeholder={t.subjectPlaceholder} value={subject} onChangeText={setSubject} maxLength={150} />
            <TextField
              label={t.messageLabel}
              placeholder={t.messagePlaceholder}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={5000}
            />

            {error && (
              <ThemedText type="small" style={styles.error} accessibilityRole="alert">
                {error}
              </ThemedText>
            )}

            <PrimaryButton label={isSubmitting ? t.sending : t.send} loading={isSubmitting} disabled={!canSubmit} onPress={submit} />
            <PrimaryButton label={t.cancel} variant="ghost" disabled={isSubmitting} onPress={() => router.back()} />
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  scrollView: { alignSelf: 'stretch' },
  content: { width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center', padding: Spacing.four, gap: Spacing.three },
  pageTitle: { fontSize: 24, lineHeight: 30 },
  types: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: { borderWidth: 1, borderRadius: 14, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, minHeight: 44, justifyContent: 'center' },
  error: { color: '#FF4D5E' },
});
