import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  CHECKIN_MOODS,
  CHECKIN_TOPICS,
  type AnswerCheckinResponse,
  type CheckinMood,
  type CheckinTopic,
} from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSupportStore } from '@/store/support-store';
import { supportStrings as t } from '@/components/support/support-ui';

interface CheckinFormProps {
  onDone: (result: AnswerCheckinResponse) => void;
  /** "Ahora no" — solo en la hoja automática. */
  onPostpone?: () => void;
}

/**
 * El check-in (espejo de WeeklyCheckinForm de la web): cómo se sintió →
 * si quiere contar algo → comentario solo si hace falta. Menos de un minuto.
 */
export function CheckinForm({ onDone, onPostpone }: CheckinFormProps) {
  const theme = useTheme();
  const isSubmitting = useSupportStore((s) => s.isSubmitting);
  const error = useSupportStore((s) => s.error);
  const answer = useSupportStore((s) => s.answerCheckin);
  const [mood, setMood] = useState<CheckinMood | null>(null);
  const [topic, setTopic] = useState<CheckinTopic | null>(null);
  const [comment, setComment] = useState('');
  const needsComment = topic !== null && topic !== 'none';
  const canSubmit = mood !== null && topic !== null && (!needsComment || comment.trim().length >= 3);

  const chip = (selected: boolean) => [
    styles.chip,
    { borderColor: selected ? theme.accent : theme.border, backgroundColor: selected ? `${theme.accent}22` : 'transparent' },
  ];

  const submit = () => {
    if (!mood || !topic) return;
    answer({ mood, topic, ...(needsComment ? { comment: comment.trim() } : {}) })
      .then(onDone)
      .catch(() => {});
  };

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold">{t.checkinMoodQuestion}</ThemedText>
      <View style={styles.moods} accessibilityRole="radiogroup" accessibilityLabel={t.checkinMoodQuestion}>
        {CHECKIN_MOODS.map((value) => (
          <Pressable
            key={value}
            testID={`mood-${value}`}
            accessibilityRole="radio"
            accessibilityState={{ checked: mood === value }}
            accessibilityLabel={t.moods[value].label}
            onPress={() => setMood(value)}
            style={[chip(mood === value), styles.mood]}
          >
            <ThemedText style={styles.emoji}>{t.moods[value].emoji}</ThemedText>
            <ThemedText type="small" style={styles.center} numberOfLines={2}>
              {t.moods[value].label}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      {mood && (
        <>
          <ThemedText type="smallBold">{t.checkinTopicQuestion}</ThemedText>
          <View style={styles.topics} accessibilityRole="radiogroup" accessibilityLabel={t.checkinTopicQuestion}>
            {CHECKIN_TOPICS.map((value) => (
              <Pressable
                key={value}
                testID={`topic-${value}`}
                accessibilityRole="radio"
                accessibilityState={{ checked: topic === value }}
                onPress={() => setTopic(value)}
                style={chip(topic === value)}
              >
                <ThemedText type="small">{t.topics[value]}</ThemedText>
              </Pressable>
            ))}
          </View>
        </>
      )}

      {needsComment && (
        <TextField
          label={t.checkinCommentQuestion}
          placeholder={t.checkinCommentPlaceholder}
          value={comment}
          onChangeText={setComment}
          multiline
          maxLength={2000}
        />
      )}

      <ThemedText type="small" themeColor="textSecondary">
        {t.checkinPrivacyNote}
      </ThemedText>

      {error && (
        <ThemedText type="small" style={styles.error} accessibilityRole="alert">
          {error}
        </ThemedText>
      )}

      <PrimaryButton label={t.checkinSubmit} loading={isSubmitting} disabled={!canSubmit || isSubmitting} onPress={submit} />
      {onPostpone && <PrimaryButton label={t.checkinLater} variant="ghost" disabled={isSubmitting} onPress={onPostpone} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.three },
  moods: { flexDirection: 'row', gap: Spacing.one },
  mood: { flex: 1, alignItems: 'center', paddingHorizontal: Spacing.half, gap: Spacing.half },
  emoji: { fontSize: 26, lineHeight: 32 },
  center: { textAlign: 'center' },
  topics: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: { borderWidth: 1, borderRadius: 14, paddingHorizontal: Spacing.two, paddingVertical: Spacing.two, minHeight: 44, justifyContent: 'center' },
  error: { color: '#FF4D5E' },
});
