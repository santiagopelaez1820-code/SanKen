import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-gifted-charts';
import type { BodyMeasurement } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { parseDecimalInput } from '@/lib/number-input';
import { useBodyMeasurementsStore } from '@/store/body-measurements-store';

const MIN_POINTS_FOR_CHART = 3;

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
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { measurements, isLoading, error, isSubmitting, submitError, load, addMeasurement } =
    useBodyMeasurementsStore();
  const [weightInput, setWeightInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async () => {
    const weight = parseDecimalInput(weightInput);
    if (!weightInput || Number.isNaN(weight) || weight < 1 || weight > 999) {
      setFormError('Ingresa un peso válido.');
      return;
    }
    setFormError(null);
    const ok = await addMeasurement({ weight_kg: weight });
    if (ok) setWeightInput('');
  };

  const current = measurements[0] ?? null;
  const chartWidth = Math.min(width, MaxContentWidth) - Spacing.four * 2 - Spacing.three * 2;
  const chartPoints = [...measurements]
    .filter((m) => m.weight_kg !== null)
    .reverse()
    .map((m) => ({ value: m.weight_kg as number, label: m.measured_at.slice(5) }));

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          style={styles.list}
          data={measurements}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <MeasurementRow measurement={item} />}
          contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}
          ListHeaderComponent={
            <>
              <ThemedText type="title" style={styles.pageTitle}>
                Medidas corporales
              </ThemedText>

              {current && !isLoading && (
                <ThemedView type="backgroundElement" style={styles.heroCard}>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.eyebrow}>
                    PESO ACTUAL
                  </ThemedText>
                  <ThemedText type="stat" style={styles.heroValue}>
                    {current.weight_kg !== null ? `${current.weight_kg} kg` : '—'}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    Última medición: {current.measured_at}
                  </ThemedText>
                </ThemedView>
              )}

              {chartPoints.length >= MIN_POINTS_FOR_CHART && (
                <ThemedView type="backgroundElement" style={styles.chartCard}>
                  <ThemedText type="smallBold">Evolución</ThemedText>
                  <LineChart
                    data={chartPoints}
                    width={chartWidth}
                    height={160}
                    thickness={2}
                    color={theme.accent}
                    dataPointsColor={theme.accent}
                    yAxisTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
                    yAxisColor={theme.backgroundSelected}
                    xAxisColor={theme.backgroundSelected}
                    hideRules
                    curved
                  />
                </ThemedView>
              )}

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
  list: { alignSelf: 'stretch' },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  pageTitle: { fontSize: 28, lineHeight: 34, marginBottom: Spacing.two },
  heroCard: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroValue: {
    fontSize: 40,
    lineHeight: 46,
  },
  chartCard: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
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
  error: { color: '#FF4D5E' },
});
