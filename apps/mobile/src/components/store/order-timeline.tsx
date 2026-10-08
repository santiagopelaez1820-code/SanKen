// Esta línea sirve para importar «StyleSheet» desde «react-native».
import { StyleSheet } from 'react-native';
// Esta línea sirve para importar los tipos «OrderStatus» desde «@sanken/core».
import type { OrderStatus } from '@sanken/core';
// Esta línea sirve para importar «getOrderTimeline» desde «@sanken/core».
import { getOrderTimeline } from '@sanken/core';
// Esta línea sirve para importar «AlertTriangle, Check, XCircle» desde «lucide-react-native».
import { AlertTriangle, Check, XCircle } from 'lucide-react-native';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «Icon» desde «@/components/ui/icon».
import { Icon } from '@/components/ui/icon';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar la interfaz «OrderTimelineProps».
interface OrderTimelineProps {
  // Esta línea sirve para declarar la propiedad «status» con el valor o tipo «OrderStatus».
  status: OrderStatus;
}

/**
 * Progreso visual del pedido: pending → confirming → processing → shipped →
 * delivered, con check en los pasos completados y el paso actual resaltado.
 * `problem` y `cancelled` son estados especiales fuera de esa secuencia — se
 * muestran como un aviso aparte, nunca como "paso N de 5" (ver Fase 3).
 * El cálculo de qué mostrar vive en @sanken/core (getOrderTimeline) — este
 * componente solo se encarga del marcado, igual que sus equivalentes web.
 */
// Esta línea sirve para declarar la función «OrderTimeline».
export function OrderTimeline({ status }: OrderTimelineProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para extraer «imelin» de «getOrderTimeline(status)».
  const timeline = getOrderTimeline(status);

  // Esta línea sirve para revisar si «timeline.kind === 'special'».
  if (timeline.kind === 'special') {
    // Esta línea sirve para extraer «olo» de «theme.error».
    const color = theme.error;
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el componente «ThemedView».
      <ThemedView style={[styles.alert, { backgroundColor: `${color}1A`, borderColor: color }]}>
        {/* Esta línea sirve para abrir el componente «Icon». */}
        <Icon icon={timeline.isProblem ? AlertTriangle : XCircle} size={20} color={color} />
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="smallBold" style={{ color }}>
          {/* Esta línea sirve para mostrar el valor «timeline.label». */}
          {timeline.label}
        </ThemedText>
      </ThemedView>
    );
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.container}>
      {/* Esta línea sirve para recorrer «timeline.steps» y mostrar un bloque por elemento. */}
      {timeline.steps.map(({ step, label, isDone, isCurrent, isLast }) => (
        // Esta línea sirve para abrir el componente «ThemedView».
        <ThemedView key={step} style={styles.stepRow}>
          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={styles.indicatorCol}>
            {/* Esta línea sirve para abrir el elemento «ThemedView» con sus atributos en varias líneas. */}
            <ThemedView
              // Esta línea sirve para pasar la propiedad «style» con el valor «[».
              style={[
                // Esta línea sirve para agregar el estilo «styles.dot».
                styles.dot,
                {
                  // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «isDone ? theme.accent : 'transparent'».
                  backgroundColor: isDone ? theme.accent : 'transparent',
                  // Esta línea sirve para definir «borderColor» con «isDone || isCurrent ? theme.accent : the…».
                  borderColor: isDone || isCurrent ? theme.accent : theme.border,
                },
              ]}>
              {/* Esta línea sirve para mostrar el elemento solo si «isDone». */}
              {isDone && <Icon icon={Check} size={12} color="#050505" strokeWidth={3} />}
            </ThemedView>
            {/* Esta línea sirve para mostrar el bloque solo si «!isLast». */}
            {!isLast && (
              // Esta línea sirve para abrir el componente «ThemedView».
              <ThemedView style={[styles.line, { backgroundColor: isDone ? theme.accent : theme.border }]} />
            )}
          </ThemedView>
          {/* Esta línea sirve para abrir el elemento «ThemedText» con sus atributos en varias líneas. */}
          <ThemedText
            // Esta línea sirve para pasar la propiedad «type» con el valor «isCurrent ? 'smallBold' : 'small'}».
            type={isCurrent ? 'smallBold' : 'small'}
            // Esta línea sirve para pasar la propiedad «themeColor» con el valor «isDone || isCurrent ? 'text' : 'textSecondary».
            themeColor={isDone || isCurrent ? 'text' : 'textSecondary'}
            // Esta línea sirve para pasar la propiedad «style» con el valor «styles.stepLabel}>».
            style={styles.stepLabel}>
            {/* Esta línea sirve para mostrar el valor «label». */}
            {label}
          </ThemedText>
        </ThemedView>
      ))}
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «container» con el valor o tipo «{ backgroundColor: 'transparent' }».
  container: { backgroundColor: 'transparent' },
  // Esta línea sirve para definir el estilo «stepRow» con «flexDirection: 'row', backgroundColor: 'transparen…».
  stepRow: { flexDirection: 'row', backgroundColor: 'transparent' },
  // Esta línea sirve para definir el estilo «indicatorCol» con «alignItems: 'center', width: 24, backgroundColor: …».
  indicatorCol: { alignItems: 'center', width: 24, backgroundColor: 'transparent' },
  // Esta línea sirve para declarar la propiedad «dot» con el valor o tipo «{».
  dot: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «24».
    width: 24,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «24».
    height: 24,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «12».
    borderRadius: 12,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «2».
    borderWidth: 2,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
  // Esta línea sirve para definir el estilo «line» con «width: 2, flex: 1, minHeight: Spacing.three, margi…».
  line: { width: 2, flex: 1, minHeight: Spacing.three, marginVertical: Spacing.half },
  // Esta línea sirve para definir el estilo «stepLabel» con «flex: 1, marginLeft: Spacing.two, paddingTop: Spac…».
  stepLabel: { flex: 1, marginLeft: Spacing.two, paddingTop: Spacing.half, paddingBottom: Spacing.three },
  // Esta línea sirve para declarar la propiedad «alert» con el valor o tipo «{».
  alert: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
  },
});
