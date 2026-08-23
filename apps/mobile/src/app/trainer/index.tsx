import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { TrainerClient, TrainerClientStatus } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTrainerClientsStore } from '@/store/trainer-clients-store';

const STATUS_LABELS: Record<TrainerClientStatus, string> = {
  pending: 'Pendiente',
  active: 'Activo',
  paused: 'Pausado',
  ended: 'Finalizado',
};

function ClientRow({ trainerClient }: { trainerClient: TrainerClient }) {
  return (
    <Pressable onPress={() => router.push(`/trainer/clients/${trainerClient.id}`)}>
      <ThemedView type="backgroundElement" style={styles.row}>
        <ThemedView style={{ flex: 1 }}>
          <ThemedText type="default">{trainerClient.client.name}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {trainerClient.client.email}
          </ThemedText>
        </ThemedView>
        <ThemedText type="smallBold">{STATUS_LABELS[trainerClient.status]}</ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export default function TrainerClientsScreen() {
  const { clients, isLoading, error, isSubmitting, submitError, load, addClient } = useTrainerClientsStore();
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async () => {
    if (!emailInput.trim()) return;
    const ok = await addClient(emailInput.trim());
    if (ok) setEmailInput('');
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          style={styles.list}
          data={clients}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <ClientRow trainerClient={item} />}
          contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}
          ListHeaderComponent={
            <>
              <ThemedText type="title" style={styles.pageTitle}>
                Mis clientes
              </ThemedText>

              <ThemedView type="backgroundElement" style={styles.formCard}>
                <TextField
                  label="Correo del cliente"
                  value={emailInput}
                  onChangeText={setEmailInput}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="cliente@correo.com"
                />
                {submitError && (
                  <ThemedText type="small" style={styles.error}>
                    {submitError}
                  </ThemedText>
                )}
                <PrimaryButton label="Agregar" loading={isSubmitting} onPress={handleAdd} />
              </ThemedView>

              {error && (
                <ThemedText type="small" style={styles.error}>
                  {error}
                </ThemedText>
              )}
            </>
          }
          ListEmptyComponent={
            !isLoading ? (
              <ThemedText type="small" themeColor="textSecondary">
                Todavía no tienes clientes vinculados.
              </ThemedText>
            ) : null
          }
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  list: { alignSelf: 'stretch' },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  pageTitle: { fontSize: 28, lineHeight: 34, marginBottom: Spacing.two },
  formCard: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: Spacing.three,
    padding: Spacing.three,
    marginBottom: Spacing.two,
  },
  error: { color: '#D9534F' },
});
