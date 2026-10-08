// Esta línea sirve para importar «useEffect, useRef» desde «react».
import { useEffect, useRef } from 'react';
// Esta línea sirve para importar «Pressable, StyleSheet» desde «react-native».
import { Pressable, StyleSheet } from 'react-native';
// Esta línea sirve para importar «Minus, Plus» desde «lucide-react-native».
import { Minus, Plus } from 'lucide-react-native';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar la interfaz «StepperProps».
interface StepperProps {
  // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «number | null».
  value: number | null;
  // Esta línea sirve para declarar la propiedad «onChange» con el valor o tipo «(value: number) => void».
  onChange: (value: number) => void;
  // Esta línea sirve para declarar la propiedad «min» con el valor o tipo «number».
  min?: number;
  // Esta línea sirve para declarar la propiedad «max» con el valor o tipo «number».
  max?: number;
  // Esta línea sirve para declarar la propiedad «step» con el valor o tipo «number».
  step?: number;
  // Esta línea sirve para declarar la propiedad «unit» con el valor o tipo «string».
  unit?: string;
}

// Esta línea sirve para declarar «HOLD_REPEAT_MS» con el valor «120».
const HOLD_REPEAT_MS = 120;
// Esta línea sirve para declarar «HOLD_DELAY_MS» con el valor «400».
const HOLD_DELAY_MS = 400;

// Esta línea sirve para declarar la función «Stepper».
export function Stepper({ value, onChange, min = 0, max = 999, step = 1, unit }: StepperProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para crear la referencia «holdTimeout».
  const holdTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Esta línea sirve para crear la referencia «holdInterval».
  const holdInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Esta línea sirve para extraer «urren» de «value ?? 0».
  const current = value ?? 0;
  // Esta línea sirve para extraer «lam» de «(n: number) => Math.min(max, Math.max(mi».
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  // Esta línea sirve para extraer «ppl» de «(delta: number) => onChange(clamp(Math.r».
  const apply = (delta: number) => onChange(clamp(Math.round((current + delta) / step) * step));

  // Esta línea sirve para extraer «tartHol» de «(delta: number) => {».
  const startHold = (delta: number) => {
    // Esta línea sirve para llamar a «apply» con «delta».
    apply(delta);
    // Esta línea sirve para asignar «setTimeout(() => {» a «holdTimeout.current».
    holdTimeout.current = setTimeout(() => {
      // Esta línea sirve para asignar «setInterval(() => apply(delta), HOLD_REPEAT_MS)» a «holdInterval.current».
      holdInterval.current = setInterval(() => apply(delta), HOLD_REPEAT_MS);
    // Esta línea sirve para volver a ejecutar el efecto cuando cambian «OLD_DELAY_M».
    }, HOLD_DELAY_MS);
  };

  // Esta línea sirve para extraer «topHol» de «() => {».
  const stopHold = () => {
    // Esta línea sirve para llamar a «clearTimeout» si «holdTimeout.current».
    if (holdTimeout.current) clearTimeout(holdTimeout.current);
    // Esta línea sirve para llamar a «clearInterval» si «holdInterval.current».
    if (holdInterval.current) clearInterval(holdInterval.current);
    // Esta línea sirve para asignar «null» a «holdTimeout.current».
    holdTimeout.current = null;
    // Esta línea sirve para asignar «null» a «holdInterval.current».
    holdInterval.current = null;
  };

  // Esta línea sirve para llamar a «useEffect» con «() => stopHold, []».
  useEffect(() => stopHold, []);

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView type="backgroundElement" style={styles.container}>
      {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
      <Pressable
        // Esta línea sirve para asignar el manejador del evento «onPressIn».
        onPressIn={() => startHold(-step)}
        // Esta línea sirve para asignar el manejador del evento «onPressOut».
        onPressOut={stopHold}
        // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.button, { backgroundColor: theme.back».
        style={[styles.button, { backgroundColor: theme.backgroundSelected }]}>
        {/* Esta línea sirve para abrir el componente «Minus». */}
        <Minus size={18} color={theme.text} />
      </Pressable>

      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView style={styles.valueWrap}>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="stat" style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
          {/* Esta línea sirve para mostrar el valor «current». */}
          {current}
        </ThemedText>
        {/* Esta línea sirve para mostrar el bloque solo si «unit». */}
        {unit && (
          // Esta línea sirve para abrir el componente «ThemedText».
          <ThemedText type="small" themeColor="textSecondary" style={styles.unit} numberOfLines={1}>
            {/* Esta línea sirve para mostrar el valor «unit». */}
            {unit}
          </ThemedText>
        )}
      </ThemedView>

      {/* Esta línea sirve para abrir el componente «Pressable» con sus propiedades. */}
      <Pressable onPressIn={() => startHold(step)} onPressOut={stopHold} style={[styles.button, { backgroundColor: theme.accent }]}>
        {/* Esta línea sirve para abrir el componente «Plus». */}
        <Plus size={18} color="#050505" />
      </Pressable>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «container» con el valor o tipo «{».
  container: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.one».
    padding: Spacing.one,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «button» con el valor o tipo «{».
  button: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «40».
    width: 40,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «40».
    height: 40,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.two».
    borderRadius: Spacing.two,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
  // Esta línea sirve para declarar la propiedad «valueWrap» con el valor o tipo «{».
  valueWrap: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
    // Esta línea sirve para declarar la propiedad «minWidth» con el valor o tipo «0».
    minWidth: 0,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «{».
  value: {
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «26».
    fontSize: 26,
    // Esta línea sirve para declarar la propiedad «lineHeight» con el valor o tipo «30».
    lineHeight: 30,
    // Esta línea sirve para declarar la propiedad «alignSelf» con el valor o tipo «'stretch'».
    alignSelf: 'stretch',
    // Esta línea sirve para declarar la propiedad «textAlign» con el valor o tipo «'center'».
    textAlign: 'center',
  },
  // Esta línea sirve para declarar la propiedad «unit» con el valor o tipo «{».
  unit: {
    // Esta línea sirve para declarar la propiedad «textTransform» con el valor o tipo «'uppercase'».
    textTransform: 'uppercase',
    // Esta línea sirve para declarar la propiedad «letterSpacing» con el valor o tipo «0.5».
    letterSpacing: 0.5,
    // Esta línea sirve para declarar la propiedad «fontWeight» con el valor o tipo «'600'».
    fontWeight: '600',
  },
});
