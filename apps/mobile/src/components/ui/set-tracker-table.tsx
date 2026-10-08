// Esta línea sirve para importar «StyleSheet» desde «react-native».
import { StyleSheet } from 'react-native';
// Esta línea sirve para importar «Animated» y «FadeInUp» desde «react-native-reanimated».
import Animated, { FadeInUp } from 'react-native-reanimated';
// Esta línea sirve para importar «Check» desde «lucide-react-native».
import { Check } from 'lucide-react-native';
// Esta línea sirve para importar los tipos «WorkoutSet» desde «@sanken/core».
import type { WorkoutSet } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar la interfaz «SetTrackerTableProps».
interface SetTrackerTableProps {
  // Esta línea sirve para declarar la propiedad «sets» con el valor o tipo «WorkoutSet[]».
  sets: WorkoutSet[];
  // Esta línea sirve para declarar la propiedad «targetSets» con el valor o tipo «number».
  targetSets: number;
  // Esta línea sirve para declarar la propiedad «suggestedWeightKg» con el valor o tipo «number | null».
  suggestedWeightKg: number | null;
  // Esta línea sirve para declarar la propiedad «suggestedRepsForNextSet» con el valor o tipo «number | null».
  suggestedRepsForNextSet: number | null;
}

// Esta línea sirve para declarar la función «SetTrackerTable».
export function SetTrackerTable({ sets, targetSets, suggestedWeightKg, suggestedRepsForNextSet }: SetTrackerTableProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para extraer «extSetNumbe» de «sets.length + 1».
  const nextSetNumber = sets.length + 1;
  // Esta línea sirve para extraer «asUpcomin» de «sets.length < targetSets».
  const hasUpcoming = sets.length < targetSets;

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView type="backgroundElement" style={[styles.container, { borderColor: theme.border }]}>
      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView style={[styles.row, styles.headerRow, { borderBottomColor: theme.border }]}>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="small" themeColor="textSecondary" style={styles.colSet}>
          {/* Esta línea sirve para mostrar el texto «Serie». */}
          Serie
        </ThemedText>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="small" themeColor="textSecondary" style={styles.col}>
          {/* Esta línea sirve para mostrar el texto «Kg». */}
          Kg
        </ThemedText>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="small" themeColor="textSecondary" style={styles.col}>
          {/* Esta línea sirve para mostrar el texto «Reps». */}
          Reps
        </ThemedText>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="small" themeColor="textSecondary" style={styles.col}>
          {/* Esta línea sirve para mostrar el texto «RPE». */}
          RPE
        </ThemedText>
        {/* Esta línea sirve para abrir el componente «ThemedView». */}
        <ThemedView style={styles.colCheck} />
      </ThemedView>

      {/* Esta línea sirve para recorrer «sets» y mostrar un bloque por elemento. */}
      {sets.map((set) => (
        // Esta línea sirve para abrir la fila animada de la serie.
        <Animated.View
          // Esta línea sirve para identificar el elemento de la lista con «set.id}».
          key={set.id}
          // Esta línea sirve para pasar la propiedad «entering» con el valor «FadeInUp.duration(250)}».
          entering={FadeInUp.duration(250)}
          // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.row, { borderBottomColor: theme.borde».
          style={[styles.row, { borderBottomColor: theme.border }]}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary" style={styles.colSet}>
            {/* Esta línea sirve para mostrar el valor «set.set_number». */}
            {set.set_number}
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="smallBold" style={styles.col}>
            {/* Esta línea sirve para mostrar el valor «set.weight_kg». */}
            {set.weight_kg}
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="smallBold" style={styles.col}>
            {/* Esta línea sirve para mostrar el valor «set.reps». */}
            {set.reps}
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary" style={styles.col}>
            {/* Esta línea sirve para mostrar el contenido dinámico «{set.rpe ?? '—'}». */}
            {set.rpe ?? '—'}
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={[styles.colCheck, styles.checkCircle, { backgroundColor: `${theme.success}26` }]}>
            {/* Esta línea sirve para abrir el componente «Check». */}
            <Check size={12} color={theme.success} />
          </ThemedView>
        </Animated.View>
      ))}

      {/* Esta línea sirve para mostrar la fila sugerida si quedan series y hay sugerencias. */}
      {hasUpcoming && (suggestedWeightKg !== null || suggestedRepsForNextSet !== null) && (
        // Esta línea sirve para abrir el componente «ThemedView».
        <ThemedView style={[styles.row, styles.targetRow, { backgroundColor: `${theme.accent}0D` }]}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="smallBold" style={[styles.colSet, { color: theme.accent }]}>
            {/* Esta línea sirve para mostrar el valor «nextSetNumber». */}
            {nextSetNumber}
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="smallBold" style={[styles.col, { color: theme.accent }]}>
            {/* Esta línea sirve para mostrar el contenido dinámico «{suggestedWeightKg ?? '—'}». */}
            {suggestedWeightKg ?? '—'}
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="smallBold" style={[styles.col, { color: theme.accent }]}>
            {/* Esta línea sirve para mostrar el contenido dinámico «{suggestedRepsForNextSet ?? '—'}». */}
            {suggestedRepsForNextSet ?? '—'}
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary" style={styles.col}>
            {/* Esta línea sirve para mostrar el texto «objetivo». */}
            objetivo
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={styles.colCheck}>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={[styles.dot, { backgroundColor: theme.accent }]} />
          </ThemedView>
        </ThemedView>
      )}
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «container» con el valor o tipo «{».
  container: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «overflow» con el valor o tipo «'hidden'».
    overflow: 'hidden',
  },
  // Esta línea sirve para declarar la propiedad «row» con el valor o tipo «{».
  row: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.three».
    paddingHorizontal: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two».
    paddingVertical: Spacing.two,
    // Esta línea sirve para declarar la propiedad «borderBottomWidth» con el valor o tipo «1».
    borderBottomWidth: 1,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «headerRow» con el valor o tipo «{».
  headerRow: {
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.one».
    paddingVertical: Spacing.one,
  },
  // Esta línea sirve para declarar la propiedad «targetRow» con el valor o tipo «{».
  targetRow: {
    // Esta línea sirve para declarar la propiedad «borderBottomWidth» con el valor o tipo «0».
    borderBottomWidth: 0,
  },
  // Esta línea sirve para declarar la propiedad «colSet» con el valor o tipo «{ width: 32 }».
  colSet: { width: 32 },
  // Esta línea sirve para declarar la propiedad «col» con el valor o tipo «{ flex: 1 }».
  col: { flex: 1 },
  // Esta línea sirve para definir el estilo «colCheck» con «width: 20, alignItems: 'center', backgroundColor: …».
  colCheck: { width: 20, alignItems: 'center', backgroundColor: 'transparent' },
  // Esta línea sirve para declarar la propiedad «checkCircle» con el valor o tipo «{».
  checkCircle: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «20».
    width: 20,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «20».
    height: 20,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «10».
    borderRadius: 10,
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
  // Esta línea sirve para declarar la propiedad «dot» con el valor o tipo «{».
  dot: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «8».
    width: 8,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «8».
    height: 8,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «4».
    borderRadius: 4,
  },
});
