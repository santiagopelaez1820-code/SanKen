// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar «FlatList, StyleSheet, useWindowDimensions» desde «react-native».
import { FlatList, StyleSheet, useWindowDimensions } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «LineChart» desde «react-native-gifted-charts».
import { LineChart } from 'react-native-gifted-charts';
// Esta línea sirve para importar los tipos «BodyMeasurement» desde «@sanken/core».
import type { BodyMeasurement } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «TextField» desde «@/components/ui/text-field».
import { TextField } from '@/components/ui/text-field';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «parseDecimalInput» desde «@/lib/number-input».
import { parseDecimalInput } from '@/lib/number-input';
// Esta línea sirve para importar «useBodyMeasurementsStore» desde «@/store/body-measurements-store».
import { useBodyMeasurementsStore } from '@/store/body-measurements-store';

// Esta línea sirve para declarar «MIN_POINTS_FOR_CHART» con el valor «3».
const MIN_POINTS_FOR_CHART = 3;

// Esta línea sirve para declarar la función «MeasurementRow».
function MeasurementRow({ measurement }: { measurement: BodyMeasurement }) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView type="backgroundElement" style={styles.row}>
      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="small" themeColor="textSecondary">
        {/* Esta línea sirve para mostrar el valor «measurement.measured_at». */}
        {measurement.measured_at}
      </ThemedText>
      {/* Esta línea sirve para abrir el componente «ThemedText» con sus propiedades. */}
      <ThemedText type="small">{measurement.weight_kg !== null ? `${measurement.weight_kg} kg` : '—'}</ThemedText>
    </ThemedView>
  );
}

// Esta línea sirve para declarar la función «MeasurementsScreen».
export default function MeasurementsScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «width» con el hook «useWindowDimensions».
  const { width } = useWindowDimensions();
  // Esta línea sirve para obtener las medidas y las acciones del store de medidas.
  const { measurements, isLoading, error, isSubmitting, submitError, load, addMeasurement } =
    // Esta línea sirve para llamar a «useBodyMeasurementsStore».
    useBodyMeasurementsStore();
  // Esta línea sirve para crear el estado «weightInput» y su función «setWeightInput».
  const [weightInput, setWeightInput] = useState('');
  // Esta línea sirve para crear el estado «formError» y su función «setFormError».
  const [formError, setFormError] = useState<string | null>(null);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «load».
    load();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «load».
  }, [load]);

  // Esta línea sirve para extraer «andleSubmi» de «async () => {».
  const handleSubmit = async () => {
    // Esta línea sirve para extraer «eigh» de «parseDecimalInput(weightInput)».
    const weight = parseDecimalInput(weightInput);
    // Esta línea sirve para validar que el peso sea un número entre 1 y 999.
    if (!weightInput || Number.isNaN(weight) || weight < 1 || weight > 999) {
      // Esta línea sirve para guardar en el estado con «setFormError» el valor «'Ingresa un peso válido.')…».
      setFormError('Ingresa un peso válido.');
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }
    // Esta línea sirve para guardar en el estado con «setFormError» el valor «null)…».
    setFormError(null);
    // Esta línea sirve para esperar «addMeasurement({ weight_kg: weight })» y guardar el resultado en «ok».
    const ok = await addMeasurement({ weight_kg: weight });
    // Esta línea sirve para limpiar el campo si se guardó bien.
    if (ok) setWeightInput('');
  };

  // Esta línea sirve para extraer «urren» de «measurements[0] ?? null».
  const current = measurements[0] ?? null;
  // Esta línea sirve para extraer «hartWidt» de «Math.min(width, MaxContentWidth) - Spaci».
  const chartWidth = Math.min(width, MaxContentWidth) - Spacing.four * 2 - Spacing.three * 2;
  // Esta línea sirve para extraer «hartPoint» de «[...measurements]».
  const chartPoints = [...measurements]
    // Esta línea sirve para encadenar la operación «filter».
    .filter((m) => m.weight_kg !== null)
    // Esta línea sirve para encadenar la operación «reverse».
    .reverse()
    // Esta línea sirve para encadenar la operación «map».
    .map((m) => ({ value: m.weight_kg as number, label: m.measured_at.slice(5) }));

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el elemento «FlatList» con sus atributos en varias líneas. */}
        <FlatList
          // Esta línea sirve para pasar la propiedad «style» con el valor «styles.list}».
          style={styles.list}
          // Esta línea sirve para pasar la propiedad «data» con el valor «measurements}».
          data={measurements}
          // Esta línea sirve para pasar la propiedad «keyExtractor» con el valor «(item) => String(item.id)}».
          keyExtractor={(item) => String(item.id)}
          // Esta línea sirve para pasar la propiedad «renderItem» con el valor «({ item }) => <MeasurementRow measurement={it».
          renderItem={({ item }) => <MeasurementRow measurement={item} />}
          // Esta línea sirve para pasar la propiedad «contentContainerStyle» con el valor «[styles.content, { paddingBottom: BottomTabIn».
          contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}
          // Esta línea sirve para pasar la propiedad «ListHeaderComponent» con el valor «».
          ListHeaderComponent={
            // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
            <>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="title" style={styles.pageTitle}>
                {/* Esta línea sirve para mostrar el texto «Medidas corporales». */}
                Medidas corporales
              </ThemedText>

              {/* Esta línea sirve para mostrar el bloque solo si «current && !isLoading». */}
              {current && !isLoading && (
                // Esta línea sirve para abrir el componente «ThemedView».
                <ThemedView type="backgroundElement" style={styles.heroCard}>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor="textSecondary" style={styles.eyebrow}>
                    {/* Esta línea sirve para mostrar el texto «PESO ACTUAL». */}
                    PESO ACTUAL
                  </ThemedText>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="stat" style={styles.heroValue}>
                    {/* Esta línea sirve para mostrar el peso actual o un guion. */}
                    {current.weight_kg !== null ? `${current.weight_kg} kg` : '—'}
                  </ThemedText>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor="textSecondary">
                    {/* Esta línea sirve para mostrar el contenido dinámico «Última medición: {current.measured_at}». */}
                    Última medición: {current.measured_at}
                  </ThemedText>
                </ThemedView>
              )}

              {/* Esta línea sirve para mostrar el bloque solo si «chartPoints.length >= MIN_POINTS_FOR_CHART». */}
              {chartPoints.length >= MIN_POINTS_FOR_CHART && (
                // Esta línea sirve para abrir el componente «ThemedView».
                <ThemedView type="backgroundElement" style={styles.chartCard}>
                  {/* Esta línea sirve para mostrar el texto «Evolución» dentro de «ThemedText». */}
                  <ThemedText type="smallBold">Evolución</ThemedText>
                  {/* Esta línea sirve para abrir el elemento «LineChart» con sus atributos en varias líneas. */}
                  <LineChart
                    // Esta línea sirve para pasar la propiedad «data» con el valor «chartPoints}».
                    data={chartPoints}
                    // Esta línea sirve para pasar la propiedad «width» con el valor «chartWidth}».
                    width={chartWidth}
                    // Esta línea sirve para pasar la propiedad «height» con el valor «160}».
                    height={160}
                    // Esta línea sirve para pasar la propiedad «thickness» con el valor «2}».
                    thickness={2}
                    // Esta línea sirve para pasar la propiedad «color» con el valor «theme.accent}».
                    color={theme.accent}
                    // Esta línea sirve para pasar la propiedad «dataPointsColor» con el valor «theme.accent}».
                    dataPointsColor={theme.accent}
                    // Esta línea sirve para pasar la propiedad «yAxisTextStyle» con el valor «{ color: theme.textSecondary, fontSize: 10 }}».
                    yAxisTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
                    // Esta línea sirve para pasar la propiedad «xAxisLabelTextStyle» con el valor «{ color: theme.textSecondary, fontSize: 10 }}».
                    xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
                    // Esta línea sirve para pasar la propiedad «yAxisColor» con el valor «theme.backgroundSelected}».
                    yAxisColor={theme.backgroundSelected}
                    // Esta línea sirve para pasar la propiedad «xAxisColor» con el valor «theme.backgroundSelected}».
                    xAxisColor={theme.backgroundSelected}
                    // Esta línea sirve para activar la opción «hideRules».
                    hideRules
                    // Esta línea sirve para activar la opción «curved».
                    curved
                  />
                </ThemedView>
              )}

              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView type="backgroundElement" style={styles.formCard}>
                {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
                <TextField
                  // Esta línea sirve para definir el atributo «label» con el valor «Peso de hoy (kg)».
                  label="Peso de hoy (kg)"
                  // Esta línea sirve para pasar la propiedad «value» con el valor «weightInput}».
                  value={weightInput}
                  // Esta línea sirve para asignar el manejador del evento «onChangeText».
                  onChangeText={setWeightInput}
                  // Esta línea sirve para definir el atributo «keyboardType» con el valor «decimal-pad».
                  keyboardType="decimal-pad"
                  // Esta línea sirve para definir el atributo «placeholder» con el valor «0.0».
                  placeholder="0.0"
                />
                {/* Esta línea sirve para mostrar el bloque solo si «(formError || submitError)». */}
                {(formError || submitError) && (
                  // Esta línea sirve para abrir el componente «ThemedText».
                  <ThemedText type="small" style={styles.error}>
                    {/* Esta línea sirve para mostrar el contenido dinámico «{formError ?? submitError}». */}
                    {formError ?? submitError}
                  </ThemedText>
                )}
                {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
                <PrimaryButton label="Registrar" loading={isSubmitting} onPress={handleSubmit} />
              </ThemedView>

              {/* Esta línea sirve para mostrar el bloque solo si «error». */}
              {error && (
                // Esta línea sirve para abrir el componente «ThemedText».
                <ThemedText type="small" style={styles.error}>
                  {/* Esta línea sirve para mostrar el valor «error». */}
                  {error}
                </ThemedText>
              )}
            </>
          }
          // Esta línea sirve para pasar la propiedad «ListEmptyComponent» con el valor «».
          ListEmptyComponent={
            // Esta línea sirve para revisar si ya terminó de cargar.
            !isLoading ? (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el texto «Todavía no hay medidas registradas.». */}
                Todavía no hay medidas registradas.
              </ThemedText>
            // Esta línea sirve para mostrar nada en caso contrario.
            ) : null
          }
        />
      </SafeAreaView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «root» con el valor o tipo «{ flex: 1 }».
  root: { flex: 1 },
  // Esta línea sirve para definir el estilo «safeArea» con «flex: 1, alignItems: 'center', width: '100%' },…».
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  // Esta línea sirve para declarar la propiedad «list» con el valor o tipo «{ alignSelf: 'stretch' }».
  list: { alignSelf: 'stretch' },
  // Esta línea sirve para declarar la propiedad «content» con el valor o tipo «{».
  content: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «MaxContentWidth».
    maxWidth: MaxContentWidth,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.four».
    paddingHorizontal: Spacing.four,
    // Esta línea sirve para declarar la propiedad «paddingTop» con el valor o tipo «Spacing.three».
    paddingTop: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para definir el estilo «pageTitle» con «fontSize: 24, lineHeight: 30, marginBottom: Spacin…».
  pageTitle: { fontSize: 24, lineHeight: 30, marginBottom: Spacing.two },
  // Esta línea sirve para declarar la propiedad «heroCard» con el valor o tipo «{».
  heroCard: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «marginBottom» con el valor o tipo «Spacing.three».
    marginBottom: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «eyebrow» con el valor o tipo «{».
  eyebrow: {
    // Esta línea sirve para declarar la propiedad «textTransform» con el valor o tipo «'uppercase'».
    textTransform: 'uppercase',
    // Esta línea sirve para declarar la propiedad «letterSpacing» con el valor o tipo «0.5».
    letterSpacing: 0.5,
  },
  // Esta línea sirve para declarar la propiedad «heroValue» con el valor o tipo «{».
  heroValue: {
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «30».
    fontSize: 30,
    // Esta línea sirve para declarar la propiedad «lineHeight» con el valor o tipo «36».
    lineHeight: 36,
  },
  // Esta línea sirve para declarar la propiedad «chartCard» con el valor o tipo «{».
  chartCard: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «marginBottom» con el valor o tipo «Spacing.three».
    marginBottom: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «formCard» con el valor o tipo «{».
  formCard: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
    // Esta línea sirve para declarar la propiedad «marginBottom» con el valor o tipo «Spacing.three».
    marginBottom: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «row» con el valor o tipo «{».
  row: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «marginBottom» con el valor o tipo «Spacing.two».
    marginBottom: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
});
