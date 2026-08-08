import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BodyMeasurement } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useBodyMeasurementsStore } from '@/store/body-measurements-store';

function MeasurementRow({ measurement }: { measurement: BodyMeasurement }) {
  return (
    <ThemedView type="backgroundElement" style={styles.row}>
      <ThemedText type="small" themeColor="textSecondary">
        {measurement.measured_at}
      </ThemedText>
      <ThemedText type="small">{measurement.weight_kg !== null ? `${measurement.weight_kg} kg` : '—'}</ThemedText>
    </ThemedView>
  );
}

export default function MeasurementsScreen() {
  const { measurements, isLoading, error, isSubmitting, submitError, load, addMeasurement } =
    useBodyMeasurementsStore();
  const [weightInput, setWeightInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async () => {
    const weight = Number(weightInput.replace(',', '.'));
    if (!weightInput || Number.isNaN(weight) || weight < 1 || weight > 999) {
      setFormError('Ingresa un peso válido.');
      return;
    }
    setFormError(null);
    const ok = await addMeasurement({ weight_kg: weight });
    if (ok) setWeightInput('');
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={measurements}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <MeasurementRow measurement={item} />}
          contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}
          ListHeaderComponent={
            <>
              <ThemedText type="title" style={styles.pageTitle}>
                Medidas corporales
              </ThemedText>

              <ThemedView type="backgroundElement" style={styles.formCard}>
                <TextField
                  label="Peso de hoy (kg)"
                  value={weightInput}
                  onChangeText={setWeightInput}
                  keyboardType="decimal-pad"
                  placeholder="0.0"
                />
                {(formError || submitError) && (
                  <ThemedText type="small" style={styles.error}>
                    {formError ?? submitError}
                  </ThemedText>
                )}
                <PrimaryButton label="Registrar" loading={isSubmitting} onPress={handleSubmit} />
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
                Todavía no hay medidas registradas.
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
    borderRadius: Spacing.three,
    padding: Spacing.three,
    marginBottom: Spacing.two,
  },
  error: { color: '#C9564A' },
});
