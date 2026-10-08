// Esta línea sirve para importar «useEffect, useMemo, useRef, useState» desde «react».
import { useEffect, useMemo, useRef, useState } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «Pressable, ScrollView, StyleSheet, TextInput, View» desde «react-native».
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar los tipos «CalendarEvent» desde «@sanken/core».
import type { CalendarEvent } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «TutorialOverlay» desde «@/components/tutorial/tutorial-overlay».
import { TutorialOverlay } from '@/components/tutorial/tutorial-overlay';
// Esta línea sirve para importar «MaxContentWidth, Spacing» desde «@/constants/theme».
import { MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useTutorial» desde «@/hooks/use-tutorial».
import { useTutorial } from '@/hooks/use-tutorial';
// Esta línea sirve para importar «monthGrid, toDateKey» desde «@/lib/calendar-grid».
import { monthGrid, toDateKey } from '@/lib/calendar-grid';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';
// Esta línea sirve para importar «useCalendarioStore» desde «@/store/calendario-store».
import { useCalendarioStore } from '@/store/calendario-store';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';

// Esta línea sirve para declarar «WEEKDAY_LABELS» con el valor «['L', 'M', 'M', 'J', 'V', 'S', 'D']».
const WEEKDAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

// workout_completed usa el acento de marca; workout_planned usa un gris
// neutro (todavía no pasó, no amerita color de marca) y reminder reusa el
// token de warning (es, conceptualmente, un aviso pendiente) — así los 3
// colores salen del sistema de tokens en vez de hex sueltos ajenos a la
// paleta negro+naranja+blanco.
// Esta línea sirve para declarar la función «eventColor».
function eventColor(
  // Esta línea sirve para declarar la propiedad «type» con el valor o tipo «CalendarEvent['type']».
  type: CalendarEvent['type'],
  // Esta línea sirve para definir el estilo «theme» con «accent: string; textSecondary: string; warning: st…».
  theme: { accent: string; textSecondary: string; warning: string },
// Esta línea sirve para cerrar los parámetros y declarar que devuelve un color.
): string {
  // Esta línea sirve para devolver el color según el tipo de evento.
  return { workout_completed: theme.accent, workout_planned: theme.textSecondary, reminder: theme.warning }[type];
}

// Esta línea sirve para declarar la función «CalendarioScreen».
export default function CalendarioScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «userId» con el hook «useAuthStore».
  const userId = useAuthStore((s) => s.user?.id);
  // Esta línea sirve para obtener «month, events, isLoading, error, setMonth, load, addReminder, deleteReminder» con el hook «useCalendarioStore».
  const { month, events, isLoading, error, setMonth, load, addReminder, deleteReminder } = useCalendarioStore();
  // Esta línea sirve para crear el estado «selectedDate» y su función «setSelectedDate».
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  // Esta línea sirve para crear el estado «reminderTitle» y su función «setReminderTitle».
  const [reminderTitle, setReminderTitle] = useState('');

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «load».
    load();
    // Esta línea sirve para volver a ejecutar el efecto cuando cambian «».
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Esta línea sirve para crear la referencia «monthNavRef».
  const monthNavRef = useRef<View>(null);
  // Esta línea sirve para crear la referencia «gridRef».
  const gridRef = useRef<View>(null);
  // Esta línea sirve para obtener «tutorial» con el hook «useTutorial».
  const tutorial = useTutorial(
    // Esta línea sirve para incluir el texto o las clases «calendario…».
    'calendario',
    [
      {
        // Esta línea sirve para declarar la propiedad «ref» con el valor o tipo «monthNavRef».
        ref: monthNavRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «'Navegá tu historial'».
        title: 'Navegá tu historial',
        // Esta línea sirve para definir la propiedad «description» con «Movete entre meses para ver tus entrenam…».
        description: 'Movete entre meses para ver tus entrenamientos pasados y los que tenés planeados.',
      },
      {
        // Esta línea sirve para declarar la propiedad «ref» con el valor o tipo «gridRef».
        ref: gridRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «'Qué significa cada punto'».
        title: 'Qué significa cada punto',
        // Esta línea sirve para definir la propiedad «description» con «Los puntos de color marcan entrenamiento…».
        description: 'Los puntos de color marcan entrenamientos completados, planeados y tus recordatorios.',
      },
      {
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «'Agregá tus propios recordatorios'».
        title: 'Agregá tus propios recordatorios',
        // Esta línea sirve para definir la propiedad «description» con «Tocá cualquier día para ver el detalle y…».
        description: 'Tocá cualquier día para ver el detalle y sumar un recordatorio personal.',
      },
    ],
    // Esta línea sirve para indicar que la carga ya terminó.
    !isLoading,
    // Esta línea sirve para incluir el valor «userId» en la lista.
    userId,
  );

  // Esta línea sirve para obtener «eventsByDate» con el hook «useMemo».
  const eventsByDate = useMemo(() => {
    // Esta línea sirve para extraer «a» de «new Map<string, CalendarEvent[]>()».
    const map = new Map<string, CalendarEvent[]>();
    // Esta línea sirve para recorrer los elementos con «const event of events».
    for (const event of events) {
      // Esta línea sirve para extraer «is» de «map.get(event.event_date) ?? []».
      const list = map.get(event.event_date) ?? [];
      // Esta línea sirve para llamar a «list.push» con «event».
      list.push(event);
      // Esta línea sirve para llamar a «map.set» con «event.event_date, list».
      map.set(event.event_date, list);
    }
    // Esta línea sirve para devolver «map».
    return map;
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «events».
  }, [events]);

  // Esta línea sirve para obtener «grid» con el hook «useMemo».
  const grid = useMemo(() => monthGrid(new Date(month.getFullYear(), month.getMonth(), 1)), [month]);
  // Esta línea sirve para extraer «odayKe» de «toDateKey(new Date())».
  const todayKey = toDateKey(new Date());
  // Esta línea sirve para extraer «electedEvent» de «selectedDate ? (eventsByDate.get(selecte».
  const selectedEvents = selectedDate ? (eventsByDate.get(selectedDate) ?? []) : null;

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «ScrollView». */}
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="title" style={styles.pageTitle}>
            {/* Esta línea sirve para mostrar el texto «Calendario». */}
            Calendario
          </ThemedText>

          {/* Esta línea sirve para abrir el componente «View». */}
          <View ref={monthNavRef} style={styles.monthNav}>
            {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
            <Pressable
              // Esta línea sirve para asignar el manejador del evento «onPress».
              onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.navButton, { borderColor: theme.backg».
              style={[styles.navButton, { borderColor: theme.backgroundSelected }]}>
              {/* Esta línea sirve para mostrar el texto «←» dentro de «ThemedText». */}
              <ThemedText type="smallBold">←</ThemedText>
            </Pressable>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="smallBold">
              {/* Esta línea sirve para mostrar el nombre del mes y el año. */}
              {month.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
            </ThemedText>
            {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
            <Pressable
              // Esta línea sirve para asignar el manejador del evento «onPress».
              onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.navButton, { borderColor: theme.backg».
              style={[styles.navButton, { borderColor: theme.backgroundSelected }]}>
              {/* Esta línea sirve para mostrar el texto «→» dentro de «ThemedText». */}
              <ThemedText type="smallBold">→</ThemedText>
            </Pressable>
          </View>

          {/* Esta línea sirve para abrir el componente «View». */}
          <View style={styles.weekdayRow}>
            {/* Esta línea sirve para recorrer «WEEKDAY_LABELS» y mostrar un bloque por elemento. */}
            {WEEKDAY_LABELS.map((label, i) => (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText key={i} type="small" themeColor="textSecondary" style={styles.weekdayCell}>
                {/* Esta línea sirve para mostrar el valor «label». */}
                {label}
              </ThemedText>
            ))}
          </View>

          {/* Esta línea sirve para abrir el componente «View». */}
          <View ref={gridRef} style={styles.grid}>
            {/* Esta línea sirve para recorrer «grid» y calcular qué mostrar por elemento. */}
            {grid.map((date) => {
              // Esta línea sirve para extraer «ateKe» de «toDateKey(date)».
              const dateKey = toDateKey(date);
              // Esta línea sirve para extraer «ayEvent» de «eventsByDate.get(dateKey) ?? []».
              const dayEvents = eventsByDate.get(dateKey) ?? [];
              // Esta línea sirve para extraer «nMont» de «date.getMonth() === month.getMonth()».
              const inMonth = date.getMonth() === month.getMonth();

              // Esta línea sirve para devolver la interfaz del componente.
              return (
                // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
                <Pressable
                  // Esta línea sirve para identificar el elemento de la lista con «dateKey}».
                  key={dateKey}
                  // Esta línea sirve para asignar el manejador del evento «onPress».
                  onPress={() => setSelectedDate(dateKey)}
                  // Esta línea sirve para pasar la propiedad «style» con el valor «[».
                  style={[
                    // Esta línea sirve para agregar el estilo «styles.dayCell».
                    styles.dayCell,
                    // Esta línea sirve para agregar un elemento cuyo «borderColor» es «theme.backgroundSelected },…».
                    { borderColor: theme.backgroundSelected },
                    // Esta línea sirve para resaltar el borde del día de hoy.
                    dateKey === todayKey && { borderColor: theme.accent },
                    // Esta línea sirve para resaltar el fondo del día seleccionado.
                    dateKey === selectedDate && { backgroundColor: theme.backgroundSelected },
                  ]}>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor={inMonth ? 'text' : 'textSecondary'}>
                    {/* Esta línea sirve para mostrar el contenido dinámico «{date.getDate()}». */}
                    {date.getDate()}
                  </ThemedText>
                  {/* Esta línea sirve para mostrar el bloque solo si «dayEvents.length > 0». */}
                  {dayEvents.length > 0 && (
                    // Esta línea sirve para abrir el componente «View».
                    <View style={styles.dotsRow}>
                      {/* Esta línea sirve para recorrer «dayEvents.slice(0, 3)» y mostrar un bloque por elemento. */}
                      {dayEvents.slice(0, 3).map((event, i) => (
                        // Esta línea sirve para abrir el componente «View».
                        <View key={i} style={[styles.dot, { backgroundColor: eventColor(event.type, theme) }]} />
                      ))}
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Esta línea sirve para mostrar el bloque solo si «isLoading». */}
          {isLoading && (
            // Esta línea sirve para abrir el componente «Skeleton».
            <Skeleton height={72} borderRadius={Spacing.three} />
          )}
          {/* Esta línea sirve para mostrar el bloque solo si «error». */}
          {error && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" style={styles.error}>
              {/* Esta línea sirve para mostrar el valor «error». */}
              {error}
            </ThemedText>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «selectedDate». */}
          {selectedDate && (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView type="backgroundElement" style={styles.detailCard}>
              {/* Esta línea sirve para mostrar el valor «selectedDate» dentro de «ThemedText». */}
              <ThemedText type="smallBold">{selectedDate}</ThemedText>

              {/* Esta línea sirve para mostrar el bloque solo si «selectedEvents?.length === 0». */}
              {selectedEvents?.length === 0 && (
                // Esta línea sirve para abrir el componente «ThemedText».
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar el texto «Sin eventos este día.». */}
                  Sin eventos este día.
                </ThemedText>
              )}

              {/* Esta línea sirve para recorrer «selectedEvents?» y mostrar un bloque por elemento. */}
              {selectedEvents?.map((event, i) => (
                // Esta línea sirve para abrir el componente «View».
                <View key={i} style={styles.eventRow}>
                  {/* Esta línea sirve para abrir el componente «View». */}
                  <View style={styles.eventInfo}>
                    {/* Esta línea sirve para abrir el componente «View». */}
                    <View style={styles.eventLabel}>
                      {/* Esta línea sirve para abrir el componente «View». */}
                      <View style={[styles.dot, { backgroundColor: eventColor(event.type, theme) }]} />
                      {/* Esta línea sirve para mostrar el valor «event.title» dentro de «ThemedText». */}
                      <ThemedText type="small">{event.title}</ThemedText>
                    </View>
                    {/* Esta línea sirve para mostrar los grupos musculares solo en eventos de entrenamiento con datos. */}
                    {event.type !== 'reminder' && event.muscle_groups.length > 0 && (
                      // Esta línea sirve para abrir el componente «ThemedText».
                      <ThemedText type="small" themeColor="textSecondary" style={styles.muscleGroups}>
                        {/* Esta línea sirve para mostrar el contenido dinámico «{event.muscle_groups.join(' + ')}». */}
                        {event.muscle_groups.join(' + ')}
                      </ThemedText>
                    )}
                  </View>
                  {/* Esta línea sirve para mostrar el bloque solo si «event.type === 'reminder'». */}
                  {event.type === 'reminder' && (
                    // Esta línea sirve para abrir el componente «Pressable» con sus propiedades.
                    <Pressable onPress={() => deleteReminder(event.id)}>
                      {/* Esta línea sirve para abrir el componente «ThemedText». */}
                      <ThemedText type="small" themeColor="textSecondary">
                        {/* Esta línea sirve para mostrar el texto «Eliminar». */}
                        Eliminar
                      </ThemedText>
                    </Pressable>
                  )}
                </View>
              ))}

              {/* Esta línea sirve para abrir el componente «View». */}
              <View style={styles.addReminderRow}>
                {/* Esta línea sirve para abrir el elemento «TextInput» con sus atributos en varias líneas. */}
                <TextInput
                  // Esta línea sirve para pasar la propiedad «value» con el valor «reminderTitle}».
                  value={reminderTitle}
                  // Esta línea sirve para asignar el manejador del evento «onChangeText».
                  onChangeText={setReminderTitle}
                  // Esta línea sirve para definir el atributo «placeholder» con el valor «Nuevo recordatorio…».
                  placeholder="Nuevo recordatorio…"
                  // Esta línea sirve para pasar la propiedad «placeholderTextColor» con el valor «theme.textSecondary}».
                  placeholderTextColor={theme.textSecondary}
                  // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.input, { borderColor: theme.backgroun».
                  style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
                />
                {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
                <Pressable
                  // Esta línea sirve para pasar la propiedad «disabled» con el valor «!reminderTitle.trim()}».
                  disabled={!reminderTitle.trim()}
                  // Esta línea sirve para asignar el manejador del evento «onPress».
                  onPress={() => {
                    // Esta línea sirve para llamar a «addReminder» con «selectedDate, reminderTitle.trim()».
                    addReminder(selectedDate, reminderTitle.trim());
                    // Esta línea sirve para guardar en el estado con «setReminderTitle» el valor «'')…».
                    setReminderTitle('');
                  }}
                  // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.addButton, { backgroundColor: theme.a».
                  style={[styles.addButton, { backgroundColor: theme.accent }, !reminderTitle.trim() && styles.disabled]}>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="smallBold" style={{ color: '#050505' }}>
                    {/* Esta línea sirve para mostrar el texto «Agregar». */}
                    Agregar
                  </ThemedText>
                </Pressable>
              </View>
            </ThemedView>
          )}

          {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
          <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>

      {/* Esta línea sirve para abrir el componente «TutorialOverlay». */}
      <TutorialOverlay tutorial={tutorial} />
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «root» con el valor o tipo «{ flex: 1 }».
  root: { flex: 1 },
  // Esta línea sirve para definir el estilo «safeArea» con «flex: 1, alignItems: 'center', width: '100%' },…».
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  // Esta línea sirve para declarar la propiedad «scrollView» con el valor o tipo «{ alignSelf: 'stretch' }».
  scrollView: { alignSelf: 'stretch' },
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
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «pageTitle» con el valor o tipo «{ fontSize: 24, lineHeight: 30 }».
  pageTitle: { fontSize: 24, lineHeight: 30 },
  // Esta línea sirve para definir el estilo «monthNav» con «flexDirection: 'row', alignItems: 'center', justif…».
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  // Esta línea sirve para definir el estilo «navButton» con «borderWidth: 1, borderRadius: Spacing.two, padding…».
  navButton: { borderWidth: 1, borderRadius: Spacing.two, paddingVertical: Spacing.one, paddingHorizontal: Spacing.two },
  // Esta línea sirve para declarar la propiedad «weekdayRow» con el valor o tipo «{ flexDirection: 'row' }».
  weekdayRow: { flexDirection: 'row' },
  // Esta línea sirve para declarar la propiedad «weekdayCell» con el valor o tipo «{ width: `${100 / 7}%`, textAlign: 'center' }».
  weekdayCell: { width: `${100 / 7}%`, textAlign: 'center' },
  // Esta línea sirve para declarar la propiedad «grid» con el valor o tipo «{ flexDirection: 'row', flexWrap: 'wrap' }».
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  // Esta línea sirve para declarar la propiedad «dayCell» con el valor o tipo «{».
  dayCell: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «`${100 / 7}%`».
    width: `${100 / 7}%`,
    // Esta línea sirve para declarar la propiedad «aspectRatio» con el valor o tipo «1».
    aspectRatio: 1,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «2».
    gap: 2,
  },
  // Esta línea sirve para declarar la propiedad «dotsRow» con el valor o tipo «{ flexDirection: 'row', gap: 2 }».
  dotsRow: { flexDirection: 'row', gap: 2 },
  // Esta línea sirve para declarar la propiedad «dot» con el valor o tipo «{ width: 5, height: 5, borderRadius: 2.5 }».
  dot: { width: 5, height: 5, borderRadius: 2.5 },
  // Esta línea sirve para definir el estilo «detailCard» con «borderRadius: Spacing.four, padding: Spacing.three…».
  detailCard: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.two },
  // Esta línea sirve para definir el estilo «eventRow» con «flexDirection: 'row', alignItems: 'center', justif…».
  eventRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  // Esta línea sirve para declarar la propiedad «eventInfo» con el valor o tipo «{ gap: 2 }».
  eventInfo: { gap: 2 },
  // Esta línea sirve para definir el estilo «eventLabel» con «flexDirection: 'row', alignItems: 'center', gap: S…».
  eventLabel: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  // Esta línea sirve para declarar la propiedad «muscleGroups» con el valor o tipo «{ paddingLeft: Spacing.two + 5 }».
  muscleGroups: { paddingLeft: Spacing.two + 5 },
  // Esta línea sirve para definir el estilo «addReminderRow» con «flexDirection: 'row', gap: Spacing.two, alignItems…».
  addReminderRow: { flexDirection: 'row', gap: Spacing.two, alignItems: 'center' },
  // Esta línea sirve para definir el estilo «input» con «flex: 1, borderWidth: 1, borderRadius: Spacing.two…».
  input: { flex: 1, borderWidth: 1, borderRadius: Spacing.two, paddingHorizontal: Spacing.two, paddingVertical: Spacing.one },
  // Esta línea sirve para definir el estilo «addButton» con «borderRadius: Spacing.two, paddingHorizontal: Spac…».
  addButton: { borderRadius: Spacing.two, paddingHorizontal: Spacing.two, paddingVertical: Spacing.one },
  // Esta línea sirve para declarar la propiedad «disabled» con el valor o tipo «{ opacity: 0.5 }».
  disabled: { opacity: 0.5 },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
});
