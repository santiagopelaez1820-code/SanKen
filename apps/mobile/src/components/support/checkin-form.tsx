// Esta línea sirve para importar «useState» desde «react».
import { useState } from 'react';
// Esta línea sirve para importar «Pressable, StyleSheet, View» desde «react-native».
import { Pressable, StyleSheet, View } from 'react-native';
// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «CHECKIN_MOODS» en la lista.
  CHECKIN_MOODS,
  // Esta línea sirve para incluir el valor «CHECKIN_TOPICS» en la lista.
  CHECKIN_TOPICS,
  // Esta línea sirve para importar el tipo «AnswerCheckinResponse».
  type AnswerCheckinResponse,
  // Esta línea sirve para importar el tipo «CheckinMood».
  type CheckinMood,
  // Esta línea sirve para importar el tipo «CheckinTopic».
  type CheckinTopic,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «TextField» desde «@/components/ui/text-field».
import { TextField } from '@/components/ui/text-field';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useSupportStore» desde «@/store/support-store».
import { useSupportStore } from '@/store/support-store';
// Esta línea sirve para importar «supportStrings as t» desde «@/components/support/support-ui».
import { supportStrings as t } from '@/components/support/support-ui';

// Esta línea sirve para declarar la interfaz «CheckinFormProps».
interface CheckinFormProps {
  // Esta línea sirve para declarar la propiedad «onDone» con el valor o tipo «(result: AnswerCheckinResponse) => void».
  onDone: (result: AnswerCheckinResponse) => void;
  /** "Ahora no" — solo en la hoja automática. */
  // Esta línea sirve para declarar la propiedad «onPostpone» con el valor o tipo «() => void».
  onPostpone?: () => void;
}

/**
 * El check-in (espejo de WeeklyCheckinForm de la web): cómo se sintió →
 * si quiere contar algo → comentario solo si hace falta. Menos de un minuto.
 */
// Esta línea sirve para declarar la función «CheckinForm».
export function CheckinForm({ onDone, onPostpone }: CheckinFormProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «isSubmitting» con el hook «useSupportStore».
  const isSubmitting = useSupportStore((s) => s.isSubmitting);
  // Esta línea sirve para obtener «error» con el hook «useSupportStore».
  const error = useSupportStore((s) => s.error);
  // Esta línea sirve para obtener «answer» con el hook «useSupportStore».
  const answer = useSupportStore((s) => s.answerCheckin);
  // Esta línea sirve para crear el estado «mood» y su función «setMood».
  const [mood, setMood] = useState<CheckinMood | null>(null);
  // Esta línea sirve para crear el estado «topic» y su función «setTopic».
  const [topic, setTopic] = useState<CheckinTopic | null>(null);
  // Esta línea sirve para crear el estado «comment» y su función «setComment».
  const [comment, setComment] = useState('');
  // Esta línea sirve para extraer «eedsCommen» de «topic !== null && topic !== 'none'».
  const needsComment = topic !== null && topic !== 'none';
  // Esta línea sirve para extraer «anSubmi» de «mood !== null && topic !== null && (!nee».
  const canSubmit = mood !== null && topic !== null && (!needsComment || comment.trim().length >= 3);

  // Esta línea sirve para extraer «hi» de «(selected: boolean) => [».
  const chip = (selected: boolean) => [
    // Esta línea sirve para agregar el estilo «styles.chip».
    styles.chip,
    // Esta línea sirve para agregar un elemento cuyo «borderColor» es «selected ? theme.accent : theme.border, …».
    { borderColor: selected ? theme.accent : theme.border, backgroundColor: selected ? `${theme.accent}22` : 'transparent' },
  ];

  // Esta línea sirve para extraer «ubmi» de «() => {».
  const submit = () => {
    // Esta línea sirve para salir de la función si «!mood || !topic».
    if (!mood || !topic) return;
    // Esta línea sirve para enviar el ánimo, el tema y el comentario si hace falta.
    answer({ mood, topic, ...(needsComment ? { comment: comment.trim() } : {}) })
      // Esta línea sirve para encadenar la operación «then».
      .then(onDone)
      // Esta línea sirve para encadenar la operación «catch».
      .catch(() => {});
  };

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «View».
    <View style={styles.container}>
      {/* Esta línea sirve para mostrar el valor «t.checkinMoodQuestion» dentro de «ThemedText». */}
      <ThemedText type="smallBold">{t.checkinMoodQuestion}</ThemedText>
      {/* Esta línea sirve para abrir el componente «View». */}
      <View style={styles.moods} accessibilityRole="radiogroup" accessibilityLabel={t.checkinMoodQuestion}>
        {/* Esta línea sirve para recorrer «CHECKIN_MOODS» y mostrar un bloque por elemento. */}
        {CHECKIN_MOODS.map((value) => (
          // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
          <Pressable
            // Esta línea sirve para identificar el elemento de la lista con «value}».
            key={value}
            // Esta línea sirve para pasar la propiedad «testID» con el valor «`mood-${value}`}».
            testID={`mood-${value}`}
            // Esta línea sirve para definir el atributo «accessibilityRole» con el valor «radio».
            accessibilityRole="radio"
            // Esta línea sirve para pasar la propiedad «accessibilityState» con el valor «{ checked: mood === value }}».
            accessibilityState={{ checked: mood === value }}
            // Esta línea sirve para pasar la propiedad «accessibilityLabel» con el valor «t.moods[value].label}».
            accessibilityLabel={t.moods[value].label}
            // Esta línea sirve para asignar el manejador del evento «onPress».
            onPress={() => setMood(value)}
            // Esta línea sirve para pasar la propiedad «style» con el valor «[chip(mood === value), styles.mood]}».
            style={[chip(mood === value), styles.mood]}
          >
            {/* Esta línea sirve para mostrar el valor «t.moods[value].emoji» dentro de «ThemedText». */}
            <ThemedText style={styles.emoji}>{t.moods[value].emoji}</ThemedText>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" style={styles.center} numberOfLines={2}>
              {/* Esta línea sirve para mostrar el contenido dinámico «{t.moods[value].label}». */}
              {t.moods[value].label}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      {/* Esta línea sirve para mostrar el bloque solo si «mood». */}
      {mood && (
        // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
        <>
          {/* Esta línea sirve para mostrar el valor «t.checkinTopicQuestion» dentro de «ThemedText». */}
          <ThemedText type="smallBold">{t.checkinTopicQuestion}</ThemedText>
          {/* Esta línea sirve para abrir el componente «View». */}
          <View style={styles.topics} accessibilityRole="radiogroup" accessibilityLabel={t.checkinTopicQuestion}>
            {/* Esta línea sirve para recorrer «CHECKIN_TOPICS» y mostrar un bloque por elemento. */}
            {CHECKIN_TOPICS.map((value) => (
              // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
              <Pressable
                // Esta línea sirve para identificar el elemento de la lista con «value}».
                key={value}
                // Esta línea sirve para pasar la propiedad «testID» con el valor «`topic-${value}`}».
                testID={`topic-${value}`}
                // Esta línea sirve para definir el atributo «accessibilityRole» con el valor «radio».
                accessibilityRole="radio"
                // Esta línea sirve para pasar la propiedad «accessibilityState» con el valor «{ checked: topic === value }}».
                accessibilityState={{ checked: topic === value }}
                // Esta línea sirve para asignar el manejador del evento «onPress».
                onPress={() => setTopic(value)}
                // Esta línea sirve para pasar la propiedad «style» con el valor «chip(topic === value)}».
                style={chip(topic === value)}
              >
                {/* Esta línea sirve para mostrar el valor «t.topics[value]» dentro de «ThemedText». */}
                <ThemedText type="small">{t.topics[value]}</ThemedText>
              </Pressable>
            ))}
          </View>
        </>
      )}

      {/* Esta línea sirve para mostrar el bloque solo si «needsComment». */}
      {needsComment && (
        // Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas.
        <TextField
          // Esta línea sirve para pasar la propiedad «label» con el valor «t.checkinCommentQuestion}».
          label={t.checkinCommentQuestion}
          // Esta línea sirve para pasar la propiedad «placeholder» con el valor «t.checkinCommentPlaceholder}».
          placeholder={t.checkinCommentPlaceholder}
          // Esta línea sirve para pasar la propiedad «value» con el valor «comment}».
          value={comment}
          // Esta línea sirve para asignar el manejador del evento «onChangeText».
          onChangeText={setComment}
          // Esta línea sirve para activar la opción «multiline».
          multiline
          // Esta línea sirve para pasar la propiedad «maxLength» con el valor «2000}».
          maxLength={2000}
        />
      )}

      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="small" themeColor="textSecondary">
        {/* Esta línea sirve para mostrar el valor «t.checkinPrivacyNote». */}
        {t.checkinPrivacyNote}
      </ThemedText>

      {/* Esta línea sirve para mostrar el bloque solo si «error». */}
      {error && (
        // Esta línea sirve para abrir el componente «ThemedText».
        <ThemedText type="small" style={styles.error} accessibilityRole="alert">
          {/* Esta línea sirve para mostrar el valor «error». */}
          {error}
        </ThemedText>
      )}

      {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
      <PrimaryButton label={t.checkinSubmit} loading={isSubmitting} disabled={!canSubmit || isSubmitting} onPress={submit} />
      {/* Esta línea sirve para mostrar el elemento solo si «onPostpone». */}
      {onPostpone && <PrimaryButton label={t.checkinLater} variant="ghost" disabled={isSubmitting} onPress={onPostpone} />}
    </View>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «container» con el valor o tipo «{ gap: Spacing.three }».
  container: { gap: Spacing.three },
  // Esta línea sirve para declarar la propiedad «moods» con el valor o tipo «{ flexDirection: 'row', gap: Spacing.one }».
  moods: { flexDirection: 'row', gap: Spacing.one },
  // Esta línea sirve para definir el estilo «mood» con «flex: 1, alignItems: 'center', paddingHorizontal: …».
  mood: { flex: 1, alignItems: 'center', paddingHorizontal: Spacing.half, gap: Spacing.half },
  // Esta línea sirve para declarar la propiedad «emoji» con el valor o tipo «{ fontSize: 26, lineHeight: 32 }».
  emoji: { fontSize: 26, lineHeight: 32 },
  // Esta línea sirve para declarar la propiedad «center» con el valor o tipo «{ textAlign: 'center' }».
  center: { textAlign: 'center' },
  // Esta línea sirve para definir el estilo «topics» con «flexDirection: 'row', flexWrap: 'wrap', gap: Spaci…».
  topics: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  // Esta línea sirve para definir el estilo «chip» con «borderWidth: 1, borderRadius: 14, paddingHorizonta…».
  chip: { borderWidth: 1, borderRadius: 14, paddingHorizontal: Spacing.two, paddingVertical: Spacing.two, minHeight: 44, justifyContent: 'center' },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
});
