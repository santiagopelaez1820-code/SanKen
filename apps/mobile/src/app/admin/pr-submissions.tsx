import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { PrSubmissionStatus } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ExerciseVideoPlayer } from '@/components/workout/exercise-video-player';
import { Badge } from '@/components/ui/badge';
import { PrimaryButton } from '@/components/ui/primary-button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAdminStore } from '@/store/admin-store';
import { Skeleton } from '@/components/ui/skeleton';

const STATUS_TABS: { label: string; value: PrSubmissionStatus | 'all' }[] = [
  { label: 'Pendientes', value: 'pending' },
  { label: 'Aprobados', value: 'approved' },
  { label: 'Rechazados', value: 'rejected' },
  { label: 'Todos', value: 'all' },
];

export default function AdminPrSubmissionsScreen() {
  const theme = useTheme();
  const { prSubmissions, isLoadingPrSubmissions, reviewError, loadPrSubmissions, reviewPrSubmission } =
    useAdminStore();
  const [status, setStatus] = useState<PrSubmissionStatus | 'all'>('pending');
  const [reasonBySubmission, setReasonBySubmission] = useState<Record<number, string>>({});
  const [reviewingId, setReviewingId] = useState<number | null>(null);

  useEffect(() => {
    loadPrSubmissions(status);
  }, [status, loadPrSubmissions]);

  const handleReview = async (id: number, reviewStatus: 'approved' | 'rejected') => {
    setReviewingId(id);
    try {
      await reviewPrSubmission(id, reviewStatus, reasonBySubmission[id]);
    } catch {
      // el error ya queda expuesto vía reviewError
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
          <ThemedText type="title" style={styles.pageTitle}>
            PR pendientes de revisión
          </ThemedText>

          <View style={styles.tabsRow}>
            {STATUS_TABS.map((tab) => {
              const selected = tab.value === status;
              return (
                <Pressable
                  key={tab.value}
                  onPress={() => setStatus(tab.value)}
                  style={[
                    styles.chip,
                    { borderColor: theme.backgroundSelected },
                    selected && { backgroundColor: theme.backgroundSelected },
                  ]}>
                  <ThemedText type="small" themeColor={selected ? 'text' : 'textSecondary'}>
                    {tab.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          {isLoadingPrSubmissions && (
            <Skeleton height={56} borderRadius={Spacing.three} />
          )}
          {!isLoadingPrSubmissions && prSubmissions.length === 0 && (
            <ThemedText type="small" themeColor="textSecondary">
              Sin postulaciones acá.
            </ThemedText>
          )}

          {prSubmissions.map((submission) => (
            <ThemedView key={submission.id} type="backgroundElement" style={styles.card}>
              <ThemedText type="small">
                {submission.user.name} postuló {submission.exercise.name} — {submission.weight_kg} kg ×{' '}
                {submission.reps} (1RM est.: {submission.estimated_1rm} kg)
              </ThemedText>

              {submission.video_url ? (
                <ExerciseVideoPlayer videoUrl={submission.video_url} />
              ) : (
                <ThemedText type="small" themeColor="textSecondary">
                  Todavía no subió el video de evidencia.
                </ThemedText>
              )}

              {submission.status === 'pending' ? (
                <>
                  <TextInput
                    value={reasonBySubmission[submission.id] ?? ''}
                    onChangeText={(text) => setReasonBySubmission({ ...reasonBySubmission, [submission.id]: text })}
                    placeholder="Motivo de rechazo (obligatorio si rechazás)"
                    placeholderTextColor={theme.textSecondary}
                    style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
                  />
                  {reviewError && (
                    <ThemedText type="small" style={styles.error}>
                      {reviewError}
                    </ThemedText>
                  )}
                  <View style={styles.actionsRow}>
                    <PrimaryButton
                      label="Aprobar"
                      loading={reviewingId === submission.id}
                      disabled={!submission.video_url}
                      onPress={() => handleReview(submission.id, 'approved')}
                    />
                    <PrimaryButton
                      label="Rechazar"
                      variant="ghost"
                      loading={reviewingId === submission.id}
                      disabled={!reasonBySubmission[submission.id]?.trim()}
                      onPress={() => handleReview(submission.id, 'rejected')}
                    />
                  </View>
                </>
              ) : (
                <View style={styles.reviewedRow}>
                  <Badge
                    label={submission.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                    variant={submission.status === 'approved' ? 'default' : 'error'}
                  />
                  <ThemedText type="small" themeColor="textSecondary">
                    por {submission.reviewed_by?.name}
                    {submission.rejection_reason && ` — "${submission.rejection_reason}"`}
                  </ThemedText>
                </View>
              )}
            </ThemedView>
          ))}

          <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  reviewedRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, backgroundColor: 'transparent' },
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  scrollView: { alignSelf: 'stretch' },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  pageTitle: { fontSize: 28, lineHeight: 34 },
  tabsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: { borderWidth: 1, borderRadius: Spacing.two, paddingVertical: Spacing.one, paddingHorizontal: Spacing.two },
  card: { borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.two },
  input: { borderWidth: 1, borderRadius: Spacing.two, paddingHorizontal: Spacing.two, paddingVertical: Spacing.two },
  actionsRow: { flexDirection: 'row', gap: Spacing.two },
  error: { color: '#D9534F' },
});
