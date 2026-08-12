import { useEffect } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAdminStore } from '@/store/admin-store';

export default function AdminAuditoriaScreen() {
  const { auditLog, isLoadingAuditLog, loadAuditLog } = useAdminStore();

  useEffect(() => {
    loadAuditLog();
  }, [loadAuditLog]);

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
          <ThemedText type="title" style={styles.pageTitle}>
            Log de auditoría
          </ThemedText>

          {isLoadingAuditLog && (
            <ThemedText type="small" themeColor="textSecondary">
              Cargando…
            </ThemedText>
          )}
          {!isLoadingAuditLog && auditLog.length === 0 && (
            <ThemedText type="small" themeColor="textSecondary">
              Sin actividad registrada.
            </ThemedText>
          )}

          {auditLog.map((entry) => (
            <ThemedView key={entry.id} style={styles.row}>
              <ThemedText type="small">
                {entry.causer?.name ?? 'Sistema'} — {entry.description}
                {entry.subject_type && (
                  <ThemedText type="small" themeColor="textSecondary">
                    {' '}
                    ({entry.subject_type.split('\\').pop()} #{entry.subject_id})
                  </ThemedText>
                )}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {new Date(entry.created_at).toLocaleString('es-AR')}
              </ThemedText>
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
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  pageTitle: { fontSize: 28, lineHeight: 34 },
  row: { gap: Spacing.half, paddingVertical: Spacing.one, backgroundColor: 'transparent' },
});
