// Esta línea sirve para importar «useState» desde «react».
import { useState } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View» desde «react-native».
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «SUPPORT_TICKET_TYPES, type SupportTicketType» desde «@sanken/core».
import { SUPPORT_TICKET_TYPES, type SupportTicketType } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «TextField» desde «@/components/ui/text-field».
import { TextField } from '@/components/ui/text-field';
// Esta línea sirve para importar «supportStrings as t» desde «@/components/support/support-ui».
import { supportStrings as t } from '@/components/support/support-ui';
// Esta línea sirve para importar «MaxContentWidth, Spacing» desde «@/constants/theme».
import { MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useSupportStore» desde «@/store/support-store».
import { useSupportStore } from '@/store/support-store';

/** Nueva solicitud: tipo, asunto y mensaje. */
// Esta línea sirve para declarar la función «NewSupportRequestScreen».
export default function NewSupportRequestScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «createTicket, isSubmitting, error, clearError» con el hook «useSupportStore».
  const { createTicket, isSubmitting, error, clearError } = useSupportStore();
  // Esta línea sirve para crear el estado «type» y su función «setType».
  const [type, setType] = useState<SupportTicketType>('question');
  // Esta línea sirve para crear el estado «subject» y su función «setSubject».
  const [subject, setSubject] = useState('');
  // Esta línea sirve para crear el estado «message» y su función «setMessage».
  const [message, setMessage] = useState('');
  // Esta línea sirve para extraer «anSubmi» de «subject.trim().length >= 3 && message.tr».
  const canSubmit = subject.trim().length >= 3 && message.trim().length >= 3 && !isSubmitting;

  // Esta línea sirve para extraer «ubmi» de «() => {».
  const submit = () => {
    // Esta línea sirve para llamar a «clearError».
    clearError();
    // Esta línea sirve para crear el ticket con tipo, asunto y mensaje recortados.
    createTicket({ type, subject: subject.trim(), message: message.trim() })
      // Esta línea sirve para encadenar la operación «then».
      .then((ticket) => router.replace({ pathname: '/soporte/[ticketId]', params: { ticketId: String(ticket.id) } }))
      // Esta línea sirve para encadenar la operación «catch».
      .catch(() => {});
  };

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
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="title" style={styles.pageTitle} accessibilityRole="header">
              {/* Esta línea sirve para mostrar el valor «t.newRequest». */}
              {t.newRequest}
            </ThemedText>

            {/* Esta línea sirve para mostrar el valor «t.typeLabel» dentro de «ThemedText». */}
            <ThemedText type="smallBold">{t.typeLabel}</ThemedText>
            {/* Esta línea sirve para abrir el componente «View». */}
            <View style={styles.types} accessibilityRole="radiogroup" accessibilityLabel={t.typeLabel}>
              {/* Esta línea sirve para recorrer «SUPPORT_TICKET_TYPES» y calcular qué mostrar por elemento. */}
              {SUPPORT_TICKET_TYPES.map((value) => {
                // Esta línea sirve para extraer «electe» de «type === value».
                const selected = type === value;
                // Esta línea sirve para devolver la interfaz del componente.
                return (
                  // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
                  <Pressable
                    // Esta línea sirve para identificar el elemento de la lista con «value}».
                    key={value}
                    // Esta línea sirve para definir el atributo «accessibilityRole» con el valor «radio».
                    accessibilityRole="radio"
                    // Esta línea sirve para pasar la propiedad «accessibilityState» con el valor «{ checked: selected }}».
                    accessibilityState={{ checked: selected }}
                    // Esta línea sirve para pasar la propiedad «accessibilityHint» con el valor «t.typeHints[value]}».
                    accessibilityHint={t.typeHints[value]}
                    // Esta línea sirve para asignar el manejador del evento «onPress».
                    onPress={() => setType(value)}
                    // Esta línea sirve para pasar la propiedad «style» con el valor «[».
                    style={[
                      // Esta línea sirve para agregar el estilo «styles.chip».
                      styles.chip,
                      // Esta línea sirve para agregar un elemento cuyo «borderColor» es «selected ? theme.accent : theme.border, …».
                      { borderColor: selected ? theme.accent : theme.border, backgroundColor: selected ? `${theme.accent}22` : 'transparent' },
                    ]}
                  >
                    {/* Esta línea sirve para mostrar el valor «t.types[value]» dentro de «ThemedText». */}
                    <ThemedText type="small">{t.types[value]}</ThemedText>
                  </Pressable>
                );
              })}
            </View>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el contenido dinámico «{t.typeHints[type]}». */}
              {t.typeHints[type]}
            </ThemedText>

            {/* Esta línea sirve para abrir el componente «TextField». */}
            <TextField label={t.subjectLabel} placeholder={t.subjectPlaceholder} value={subject} onChangeText={setSubject} maxLength={150} />
            {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
            <TextField
              // Esta línea sirve para pasar la propiedad «label» con el valor «t.messageLabel}».
              label={t.messageLabel}
              // Esta línea sirve para pasar la propiedad «placeholder» con el valor «t.messagePlaceholder}».
              placeholder={t.messagePlaceholder}
              // Esta línea sirve para pasar la propiedad «value» con el valor «message}».
              value={message}
              // Esta línea sirve para asignar el manejador del evento «onChangeText».
              onChangeText={setMessage}
              // Esta línea sirve para activar la opción «multiline».
              multiline
              // Esta línea sirve para pasar la propiedad «maxLength» con el valor «5000}».
              maxLength={5000}
            />

            {/* Esta línea sirve para mostrar el bloque solo si «error». */}
            {error && (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="small" style={styles.error} accessibilityRole="alert">
                {/* Esta línea sirve para mostrar el valor «error». */}
                {error}
              </ThemedText>
            )}

            {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
            <PrimaryButton label={isSubmitting ? t.sending : t.send} loading={isSubmitting} disabled={!canSubmit} onPress={submit} />
            {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
            <PrimaryButton label={t.cancel} variant="ghost" disabled={isSubmitting} onPress={() => router.back()} />
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
  // Esta línea sirve para declarar la propiedad «pageTitle» con el valor o tipo «{ fontSize: 24, lineHeight: 30 }».
  pageTitle: { fontSize: 24, lineHeight: 30 },
  // Esta línea sirve para definir el estilo «types» con «flexDirection: 'row', flexWrap: 'wrap', gap: Spaci…».
  types: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  // Esta línea sirve para definir el estilo «chip» con «borderWidth: 1, borderRadius: 14, paddingHorizonta…».
  chip: { borderWidth: 1, borderRadius: 14, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, minHeight: 44, justifyContent: 'center' },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
});
