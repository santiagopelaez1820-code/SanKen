// Esta línea sirve para importar «useState» desde «react».
import { useState } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «ScrollView, StyleSheet» desde «react-native».
import { ScrollView, StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «ScaleSelector» desde «@/components/ui/scale-selector».
import { ScaleSelector } from '@/components/ui/scale-selector';
// Esta línea sirve para importar «MaxContentWidth, Spacing» desde «@/constants/theme».
import { MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «findNextDay, useRoutineStore» desde «@/store/routine-store».
import { findNextDay, useRoutineStore } from '@/store/routine-store';
// Esta línea sirve para importar «useWorkoutStore» desde «@/store/workout-store».
import { useWorkoutStore } from '@/store/workout-store';

// Esta línea sirve para declarar la función «PrecheckScreen».
export default function PrecheckScreen() {
  // Esta línea sirve para obtener «routine, nextDayId» con el hook «useRoutineStore».
  const { routine, nextDayId } = useRoutineStore();
  // Esta línea sirve para obtener «start, isSubmitting, error» con el hook «useWorkoutStore».
  const { start, isSubmitting, error } = useWorkoutStore();
  // Esta línea sirve para crear el estado «sleepQuality» y su función «setSleepQuality».
  const [sleepQuality, setSleepQuality] = useState<number | null>(null);
  // Esta línea sirve para crear el estado «energyLevel» y su función «setEnergyLevel».
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);
  // Esta línea sirve para crear el estado «muscleSoreness» y su función «setMuscleSoreness».
  const [muscleSoreness, setMuscleSoreness] = useState<number | null>(null);

  // Esta línea sirve para extraer «a» de «findNextDay(routine, nextDayId)».
  const day = findNextDay(routine, nextDayId);

  // Esta línea sirve para extraer «andleStar» de «async () => {».
  const handleStart = async () => {
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «start».
      await start(day, {
        // Esta línea sirve para declarar la propiedad «sleep_quality» con el valor o tipo «sleepQuality ?? undefined».
        sleep_quality: sleepQuality ?? undefined,
        // Esta línea sirve para declarar la propiedad «energy_level» con el valor o tipo «energyLevel ?? undefined».
        energy_level: energyLevel ?? undefined,
        // Esta línea sirve para declarar la propiedad «muscle_soreness» con el valor o tipo «muscleSoreness ?? undefined».
        muscle_soreness: muscleSoreness ?? undefined,
      });
      // Esta línea sirve para llamar a «router.replace» con «'/workout/session'».
      router.replace('/workout/session');
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // el error queda expuesto vía workout-store.error
    }
  };

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.flex}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.flex}>
        {/* Esta línea sirve para abrir el componente «ScrollView». */}
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="subtitle" style={styles.title}>
            {/* Esta línea sirve para mostrar el contenido dinámico «{day?.label ?? 'Entrenamiento libre'}». */}
            {day?.label ?? 'Entrenamiento libre'}
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
            {/* Esta línea sirve para mostrar el texto «Antes de empezar, cuéntanos cómo llegas hoy.». */}
            Antes de empezar, cuéntanos cómo llegas hoy.
          </ThemedText>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={styles.form}>
            {/* Esta línea sirve para abrir el componente «ScaleSelector». */}
            <ScaleSelector label="¿Cómo dormiste?" value={sleepQuality} onChange={setSleepQuality} />
            {/* Esta línea sirve para abrir el componente «ScaleSelector». */}
            <ScaleSelector label="Nivel de energía" value={energyLevel} onChange={setEnergyLevel} />
            {/* Esta línea sirve para abrir el componente «ScaleSelector». */}
            <ScaleSelector label="Dolor muscular" value={muscleSoreness} onChange={setMuscleSoreness} />
          </ThemedView>

          {/* Esta línea sirve para mostrar el bloque solo si «error». */}
          {error && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" style={styles.error}>
              {/* Esta línea sirve para mostrar el valor «error». */}
              {error}
            </ThemedText>
          )}

          {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
          <PrimaryButton label="Comenzar" loading={isSubmitting} onPress={handleStart} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «{ flex: 1 }».
  flex: { flex: 1 },
  // Esta línea sirve para declarar la propiedad «scroll» con el valor o tipo «{».
  scroll: {
    // Esta línea sirve para declarar la propiedad «flexGrow» con el valor o tipo «1».
    flexGrow: 1,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.four».
    padding: Spacing.four,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.four».
    gap: Spacing.four,
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «MaxContentWidth».
    maxWidth: MaxContentWidth,
    // Esta línea sirve para declarar la propiedad «alignSelf» con el valor o tipo «'center'».
    alignSelf: 'center',
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «{ textAlign: 'center' }».
  title: { textAlign: 'center' },
  // Esta línea sirve para declarar la propiedad «subtitle» con el valor o tipo «{ textAlign: 'center' }».
  subtitle: { textAlign: 'center' },
  // Esta línea sirve para declarar la propiedad «form» con el valor o tipo «{ gap: Spacing.four }».
  form: { gap: Spacing.four },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E', textAlign: 'center' }».
  error: { color: '#FF4D5E', textAlign: 'center' },
});
