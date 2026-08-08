import { useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { TrainerClientStatus } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTrainerClientsStore } from '@/store/trainer-clients-store';

const STATUS_LABELS: Record<TrainerClientStatus, string> = {
  pending: 'Pendiente',
  active: 'Activo',
  paused: 'Pausado',
  ended: 'Finalizado',
};

export default function TrainerClientDetailScreen() {
  const { trainerClientId } = useLocalSearchParams<{ trainerClientId: string }>();
  const id = Number(trainerClientId);

  const { selectedClient, activeRoutine, isLoadingDetail, detailError, isSubmitting, loadDetail, updateStatus } =
    useTrainerClientsStore();

  useEffect(() => {
    if (id) loadDetail(id);
  }, [id, loadDetail]);

  if (isLoadingDetail || !selectedClient) {
    return (
      <ThemedView style={styles.root}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText type="small" themeColor="textSecondary">
            {detailError ?? 'Cargando…'}
          </ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const ownsActiveRoutine = activeRoutine?.source === 'trainer';

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="small" themeColor="textSecondary" onPress={() => router.back()}>
          ← Mis clientes
        </ThemedText>

        <ThemedText type="title" style={styles.pageTitle}>
          {selectedClient.client.name}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {selectedClient.client.email}
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="smallBold">Relación</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Estado: {STATUS_LABELS[selectedClient.status]}
          </ThemedText>

          <ThemedView style={styles.buttonRow}>
            {selectedClient.status === 'active' && (
              <PrimaryButton
                label="Pausar"
                variant="ghost"
                loading={isSubmitting}
                onPress={() => updateStatus(id, 'paused')}
              />
            )}
            {selectedClient.status === 'paused' && (
              <PrimaryButton
                label="Reactivar"
                variant="ghost"
                loading={isSubmitting}
                onPress={() => updateStatus(id, 'active')}
              />
            )}
            {selectedClient.status !== 'ended' && (
              <PrimaryButton
                label="Finalizar"
                variant="ghost"
                loading={isSubmitting}
                onPress={() => updateStatus(id, 'ended')}
              />
            )}
          </ThemedView>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="smallBold">Rutina activa</ThemedText>

          {!activeRoutine && (
            <ThemedText type="small" themeColor="textSecondary">
              Este cliente no tiene una rutina activa.
            </ThemedText>
          )}

          {activeRoutine && (
            <ThemedText type="small" themeColor="textSecondary">
              {activeRoutine.split_type} · {activeRoutine.frequency_days} días/semana ·{' '}
              {activeRoutine.duration_weeks} semanas ·{' '}
              {activeRoutine.source === 'trainer' ? 'asignada manualmente' : 'motor automático'}
            </ThemedText>
          )}

          {selectedClient.status === 'active' && (
            <ThemedView style={styles.spacer}>
              {ownsActiveRoutine ? (
                <PrimaryButton
                  label="Editar rutina"
                  onPress={() => router.push(`/trainer/routines/${activeRoutine!.id}/edit`)}
                />
              ) : (
                <PrimaryButton
                  label="Asignar rutina manual"
                  onPress={() => router.push(`/trainer/clients/${id}/routine/new`)}
                />
              )}
            </ThemedView>
          )}
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: {
    flex: 1,
    alignItems: 'stretch',
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  pageTitle: { fontSize: 24, lineHeight: 30 },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  spacer: { marginTop: Spacing.two },
});
