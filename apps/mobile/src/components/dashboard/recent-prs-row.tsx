// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «Pressable, ScrollView, StyleSheet» desde «react-native».
import { Pressable, ScrollView, StyleSheet } from 'react-native';
// Esta línea sirve para importar «Trophy» desde «lucide-react-native».
import { Trophy } from 'lucide-react-native';
// Esta línea sirve para importar «formatPersonalRecord, type PersonalRecordSummary» desde «@sanken/core».
import { formatPersonalRecord, type PersonalRecordSummary } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «EmptyState» desde «@/components/ui/empty-state».
import { EmptyState } from '@/components/ui/empty-state';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar la interfaz «RecentPRsRowProps».
interface RecentPRsRowProps {
  // Esta línea sirve para declarar la propiedad «records» con el valor o tipo «PersonalRecordSummary[]».
  records: PersonalRecordSummary[];
}

// Esta línea sirve para declarar la función «RecentPRsRow».
export function RecentPRsRow({ records }: RecentPRsRowProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView type="backgroundElement" style={styles.card}>
      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView style={styles.header}>
        {/* Esta línea sirve para mostrar el texto «Tus PRs» dentro de «ThemedText». */}
        <ThemedText type="smallBold">Tus PRs</ThemedText>
        {/* Esta línea sirve para abrir el componente «Pressable» con sus propiedades. */}
        <Pressable onPress={() => router.push('/prs')}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" style={{ color: theme.accent }}>
            {/* Esta línea sirve para mostrar el texto «Ver todos». */}
            Ver todos
          </ThemedText>
        </Pressable>
      </ThemedView>

      {/* Esta línea sirve para elegir entre dos bloques según «records.length === 0». */}
      {records.length === 0 ? (
        // Esta línea sirve para abrir el componente «EmptyState».
        <EmptyState icon={Trophy} title="Sin récords todavía" description="Registra tu primer PR desde la pestaña PR." />
      // Esta línea sirve para mostrar el bloque alternativo.
      ) : (
        // Esta línea sirve para abrir el componente «ScrollView».
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {/* Esta línea sirve para recorrer «records.slice(0, 6)» y mostrar un bloque por elemento. */}
          {records.slice(0, 6).map((record) => (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView key={record.id} type="backgroundSelected" style={styles.tile}>
              {/* Esta línea sirve para abrir el componente «Trophy». */}
              <Trophy size={16} color={theme.accent} />
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                {/* Esta línea sirve para mostrar el valor «record.exercise_name». */}
                {record.exercise_name}
              </ThemedText>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="smallBold" style={styles.value}>
                {/* Esta línea sirve para mostrar el contenido dinámico «{formatPersonalRecord(record)}». */}
                {formatPersonalRecord(record)}
              </ThemedText>
            </ThemedView>
          ))}
        </ScrollView>
      )}
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «card» con el valor o tipo «{».
  card: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «header» con el valor o tipo «{».
  header: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «row» con el valor o tipo «{».
  row: {
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «tile» con el valor o tipo «{».
  tile: {
    // Esta línea sirve para declarar la propiedad «minWidth» con el valor o tipo «128».
    minWidth: 128,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.two».
    padding: Spacing.two,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.half».
    gap: Spacing.half,
  },
  // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «{».
  value: {
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «18».
    fontSize: 18,
  },
});
