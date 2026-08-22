import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ReportStatus } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAdminStore } from '@/store/admin-store';
import { Skeleton } from '@/components/ui/skeleton';

const REASON_LABELS: Record<string, string> = {
  abuse: 'Abuso',
  spam: 'Spam',
  inappropriate_content: 'Contenido inapropiado',
  other: 'Otro',
};

const STATUS_TABS: { label: string; value: ReportStatus | 'all' }[] = [
  { label: 'Pendientes', value: 'pending' },
  { label: 'Resueltos', value: 'resolved' },
  { label: 'Descartados', value: 'dismissed' },
  { label: 'Todos', value: 'all' },
];

export default function AdminReportesScreen() {
  const theme = useTheme();
  const { reports, isLoadingReports, loadReports, resolveReport } = useAdminStore();
  const [status, setStatus] = useState<ReportStatus | 'all'>('pending');
  const [notesByReport, setNotesByReport] = useState<Record<number, string>>({});

  useEffect(() => {
    loadReports(status);
  }, [status, loadReports]);

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
          <ThemedText type="title" style={styles.pageTitle}>
            Reportes
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

          {isLoadingReports && (
            <Skeleton height={56} borderRadius={Spacing.three} />
          )}
          {!isLoadingReports && reports.length === 0 && (
            <ThemedText type="small" themeColor="textSecondary">
              Sin reportes acá.
            </ThemedText>
          )}

          {reports.map((report) => (
            <ThemedView key={report.id} type="backgroundElement" style={styles.card}>
              <ThemedText type="small">
                {report.reporter.name} reportó{' '}
                {report.reportable_type === 'chat_message' ? 'un mensaje de chat' : report.reportable_type} ·{' '}
                {REASON_LABELS[report.reason]}
              </ThemedText>
              {report.reportable_preview && (
                <ThemedText type="small" themeColor="textSecondary">
                  &quot;{report.reportable_preview}&quot;
                </ThemedText>
              )}
              {report.details && (
                <ThemedText type="small" themeColor="textSecondary">
                  {report.details}
                </ThemedText>
              )}

              {report.status === 'pending' ? (
                <>
                  <TextInput
                    value={notesByReport[report.id] ?? ''}
                    onChangeText={(text) => setNotesByReport({ ...notesByReport, [report.id]: text })}
                    placeholder="Notas de resolución (opcional)"
                    placeholderTextColor={theme.textSecondary}
                    style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
                  />
                  <View style={styles.actionsRow}>
                    <PrimaryButton
                      label="Resolver"
                      onPress={() => resolveReport(report.id, 'resolved', notesByReport[report.id])}
                    />
                    <PrimaryButton
                      label="Descartar"
                      variant="ghost"
                      onPress={() => resolveReport(report.id, 'dismissed', notesByReport[report.id])}
                    />
                  </View>
                </>
              ) : (
                <ThemedText type="small" themeColor="textSecondary">
                  {report.status === 'resolved' ? 'Resuelto' : 'Descartado'} por {report.resolved_by?.name}
                </ThemedText>
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
  card: { borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.one },
  input: { borderWidth: 1, borderRadius: Spacing.two, paddingHorizontal: Spacing.two, paddingVertical: Spacing.two },
  actionsRow: { flexDirection: 'row', gap: Spacing.two },
});
