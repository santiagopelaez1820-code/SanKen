// Esta línea sirve para importar «StyleSheet» desde «react-native».
import { StyleSheet } from 'react-native';
// Esta línea sirve para importar «Flame» desde «lucide-react-native».
import { Flame } from 'lucide-react-native';
// Esta línea sirve para importar los tipos «WorkoutSession» desde «@sanken/core».
import type { WorkoutSession } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «apiDateKey, toDateKey» desde «@/lib/calendar-grid».
import { apiDateKey, toDateKey } from '@/lib/calendar-grid';
// Esta línea sirve para importar «glowShadow, Spacing» desde «@/constants/theme».
import { glowShadow, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar «DAY_LETTERS» con el valor «['L', 'M', 'M', 'J', 'V', 'S', 'D']».
const DAY_LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

// Esta línea sirve para declarar la interfaz «StreakWidgetProps».
interface StreakWidgetProps {
  // Esta línea sirve para declarar la propiedad «streakDays» con el valor o tipo «number».
  streakDays: number;
  // Esta línea sirve para declarar la propiedad «sessions» con el valor o tipo «WorkoutSession[]».
  sessions: WorkoutSession[];
}

/**
 * Fila L-M-M-J-V-S-D de la semana actual. Reutiliza `toDateKey` (mismo
 * criterio de "día" que el calendario, ver lib/calendar-grid.ts) para marcar
 * qué días de esta semana ya tienen un entrenamiento completado — no hay
 * endpoint dedicado para esto, se deriva de `workout-history-store`
 * (la misma lista que ya alimenta la pantalla de historial).
 */
// Esta línea sirve para declarar la función «StreakWidget».
export function StreakWidget({ streakDays, sessions }: StreakWidgetProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();

  // Esta línea sirve para devolver null si «streakDays <= 0».
  if (streakDays <= 0) return null;

  // Esta línea sirve para extraer «oda» de «new Date()».
  const today = new Date();
  // Esta línea sirve para extraer «ondayOffse» de «(today.getDay() + 6) % 7».
  const mondayOffset = (today.getDay() + 6) % 7;
  // Esta línea sirve para extraer «onda» de «new Date(today.getFullYear(), today.getM».
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - mondayOffset);
  // Esta línea sirve para extraer «eekDay» de «Array.from(».
  const weekDays = Array.from(
    // Esta línea sirve para agregar un elemento cuyo «length» es «7 },…».
    { length: 7 },
    // Esta línea sirve para crear cada día de la semana a partir del lunes.
    (_, i) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i),
  );

  // Esta línea sirve para extraer «rainedKey» de «new Set(».
  const trainedKeys = new Set(
    // Esta línea sirve para reunir las fechas de las sesiones completadas.
    sessions.filter((s) => s.completed && !s.cancelled).map((s) => apiDateKey(s.performed_at)),
  );
  // Esta línea sirve para extraer «odayKe» de «toDateKey(today)».
  const todayKey = toDateKey(today);

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «ThemedView» con sus atributos en varias líneas.
    <ThemedView
      // Esta línea sirve para definir el atributo «type» con el valor «backgroundElement».
      type="backgroundElement"
      // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.card, { borderColor: `${theme.accent}».
      style={[styles.card, { borderColor: `${theme.accent}30` }, glowShadow(theme.accent)]}>
      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView style={styles.header}>
        {/* Esta línea sirve para abrir el componente «Flame». */}
        <Flame size={16} color={theme.accent} />
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="smallBold">
          {/* Esta línea sirve para mostrar el contenido dinámico «Racha de {streakDays} {streakDays === 1 ? 'día' : 'días'}». */}
          Racha de {streakDays} {streakDays === 1 ? 'día' : 'días'}
        </ThemedText>
      </ThemedView>

      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView style={styles.week}>
        {/* Esta línea sirve para recorrer «weekDays» y calcular qué mostrar por elemento. */}
        {weekDays.map((date, i) => {
          // Esta línea sirve para extraer «e» de «toDateKey(date)».
          const key = toDateKey(date);
          // Esta línea sirve para extraer «raine» de «trainedKeys.has(key)».
          const trained = trainedKeys.has(key);
          // Esta línea sirve para extraer «sToda» de «key === todayKey».
          const isToday = key === todayKey;
          // Esta línea sirve para extraer «sFutur» de «date.getTime() > today.getTime()».
          const isFuture = date.getTime() > today.getTime();

          // Esta línea sirve para devolver la interfaz del componente.
          return (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView key={key} style={styles.dayColumn}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary" style={styles.dayLetter}>
                {/* Esta línea sirve para mostrar el contenido dinámico «{DAY_LETTERS[i]}». */}
                {DAY_LETTERS[i]}
              </ThemedText>
              {/* Esta línea sirve para abrir el elemento «ThemedView» con sus atributos en varias líneas. */}
              <ThemedView
                // Esta línea sirve para pasar la propiedad «style» con el valor «[».
                style={[
                  // Esta línea sirve para agregar el estilo «styles.dot».
                  styles.dot,
                  // Esta línea sirve para agregar un elemento cuyo «borderColor» es «theme.border },…».
                  { borderColor: theme.border },
                  // Esta línea sirve para aplicar el estilo «borderColor: theme.accent },…» solo si «isToday».
                  isToday && { borderColor: theme.accent },
                  // Esta línea sirve para aplicar el estilo «backgroundColor: theme.accent, borderCol…» solo si «trained».
                  trained && { backgroundColor: theme.accent, borderColor: theme.accent },
                  // Esta línea sirve para atenuar los días futuros.
                  isFuture && styles.futureDot,
                ]}>
                {/* Esta línea sirve para mostrar el bloque solo si «trained». */}
                {trained && (
                  // Esta línea sirve para abrir el componente «ThemedText».
                  <ThemedText type="small" style={styles.check}>
                    {/* Esta línea sirve para mostrar el contenido dinámico «✓». */}
                    ✓
                  </ThemedText>
                )}
              </ThemedView>
            </ThemedView>
          );
        })}
      </ThemedView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «card» con el valor o tipo «{».
  card: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «header» con el valor o tipo «{».
  header: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «week» con el valor o tipo «{».
  week: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «dayColumn» con el valor o tipo «{».
  dayColumn: {
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.half».
    gap: Spacing.half,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «dayLetter» con el valor o tipo «{».
  dayLetter: {
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «11».
    fontSize: 11,
  },
  // Esta línea sirve para declarar la propiedad «dot» con el valor o tipo «{».
  dot: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «22».
    width: 22,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «22».
    height: 22,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «11».
    borderRadius: 11,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1.5».
    borderWidth: 1.5,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
  // Esta línea sirve para declarar la propiedad «futureDot» con el valor o tipo «{».
  futureDot: {
    // Esta línea sirve para declarar la propiedad «opacity» con el valor o tipo «0.4».
    opacity: 0.4,
  },
  // Esta línea sirve para declarar la propiedad «check» con el valor o tipo «{».
  check: {
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «11».
    fontSize: 11,
    // Esta línea sirve para declarar la propiedad «lineHeight» con el valor o tipo «14».
    lineHeight: 14,
    // Esta línea sirve para declarar la propiedad «fontWeight» con el valor o tipo «'700'».
    fontWeight: '700',
    // Esta línea sirve para declarar la propiedad «color» con el valor o tipo «'#050505'».
    color: '#050505',
  },
});
