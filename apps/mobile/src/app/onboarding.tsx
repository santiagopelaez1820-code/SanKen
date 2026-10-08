// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar «Redirect, router» desde «expo-router».
import { Redirect, router } from 'expo-router';
// Esta línea sirve para importar «KeyboardAvoidingView, Platform, ScrollView, StyleSheet» desde «react-native».
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «ONBOARDING_AGE_MESSAGES» en la lista.
  ONBOARDING_AGE_MESSAGES,
  // Esta línea sirve para incluir el valor «ONBOARDING_MAX_AGE» en la lista.
  ONBOARDING_MAX_AGE,
  // Esta línea sirve para incluir el valor «ONBOARDING_MIN_AGE» en la lista.
  ONBOARDING_MIN_AGE,
  // Esta línea sirve para incluir el valor «validateOnboardingAge» en la lista.
  validateOnboardingAge,
  // Esta línea sirve para importar el tipo «FitnessGoal».
  type FitnessGoal,
  // Esta línea sirve para importar el tipo «FitnessLevel».
  type FitnessLevel,
  // Esta línea sirve para importar el tipo «FrequencyDays».
  type FrequencyDays,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «OptionCard» desde «@/components/ui/option-card».
import { OptionCard } from '@/components/ui/option-card';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «ProgressBar» desde «@/components/ui/progress-bar».
import { ProgressBar } from '@/components/ui/progress-bar';
// Esta línea sirve para importar «TextField» desde «@/components/ui/text-field».
import { TextField } from '@/components/ui/text-field';
// Esta línea sirve para importar «MaxContentWidth, Spacing» desde «@/constants/theme».
import { MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';
// Esta línea sirve para importar «useOnboardingStore» desde «@/store/onboarding-store».
import { useOnboardingStore } from '@/store/onboarding-store';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';

// Esta línea sirve para declarar «LEVEL_LABELS» con el valor «{».
const LEVEL_LABELS: Record<FitnessLevel, string> = {
  // Esta línea sirve para declarar la propiedad «beginner» con el valor o tipo «'Principiante'».
  beginner: 'Principiante',
  // Esta línea sirve para declarar la propiedad «intermediate» con el valor o tipo «'Intermedio'».
  intermediate: 'Intermedio',
  // Esta línea sirve para declarar la propiedad «advanced» con el valor o tipo «'Avanzado'».
  advanced: 'Avanzado',
};

// Esta línea sirve para declarar «GOAL_LABELS» con el valor «{».
const GOAL_LABELS: Record<FitnessGoal, string> = {
  // Esta línea sirve para declarar la propiedad «gain_muscle» con el valor o tipo «'Ganar músculo'».
  gain_muscle: 'Ganar músculo',
  // Esta línea sirve para declarar la propiedad «lose_fat» con el valor o tipo «'Perder grasa'».
  lose_fat: 'Perder grasa',
  // Esta línea sirve para declarar la propiedad «body_recomposition» con el valor o tipo «'Recomposición corporal'».
  body_recomposition: 'Recomposición corporal',
  // Esta línea sirve para declarar la propiedad «strength» con el valor o tipo «'Fuerza'».
  strength: 'Fuerza',
  // Esta línea sirve para declarar la propiedad «endurance» con el valor o tipo «'Resistencia'».
  endurance: 'Resistencia',
  // Esta línea sirve para declarar la propiedad «sport_performance» con el valor o tipo «'Rendimiento deportivo'».
  sport_performance: 'Rendimiento deportivo',
  // Esta línea sirve para declarar la propiedad «health» con el valor o tipo «'Salud'».
  health: 'Salud',
  // Esta línea sirve para declarar la propiedad «cardio» con el valor o tipo «'Cardio'».
  cardio: 'Cardio',
};

// Esta línea sirve para declarar los ids de los pasos del cuestionario.
type StepId = 'age' | 'sex' | 'height' | 'weight' | 'level' | 'goals' | 'frequency';

/**
 * La ubicación (país/departamento/ciudad) se pide en una pantalla separada
 * después de completar este wizard (ver /ubicacion) — no acá. Antes este
 * wizard también tenía esos pasos y terminaba pidiendo la ubicación dos
 * veces (una en el wizard, otra en /ubicacion).
 *
 * Tampoco pregunta por equipamiento disponible: el generador de rutinas
 * activo (TemplateRoutineGenerator) no usa esa respuesta.
 */
// Esta línea sirve para extraer «TEP_ORDER: StepId[» de «['age', 'sex', 'height', 'weight', 'leve».
const STEP_ORDER: StepId[] = ['age', 'sex', 'height', 'weight', 'level', 'goals', 'frequency'];

// Esta línea sirve para declarar la función «OnboardingScreen».
export default function OnboardingScreen() {
  // Esta línea sirve para obtener «user» con el hook «useAuthStore».
  const user = useAuthStore((s) => s.user);
  // Esta línea sirve para obtener «setOnboardingCompleted» con el hook «useAuthStore».
  const setOnboardingCompleted = useAuthStore((s) => s.setOnboardingCompleted);
  // Esta línea sirve para obtener el cuestionario, las respuestas y las acciones del store.
  const { questions, loadQuestions, answers, setAnswer, submit, complete, isLoading, isSubmitting, error } =
    // Esta línea sirve para llamar a «useOnboardingStore».
    useOnboardingStore();

  // Esta línea sirve para crear el estado «stepIndex» y su función «setStepIndex».
  const [stepIndex, setStepIndex] = useState(0);
  // Esta línea sirve para crear el estado «ageInput» y su función «setAgeInput».
  const [ageInput, setAgeInput] = useState('');
  // Esta línea sirve para crear el estado «ageTouched» y su función «setAgeTouched».
  const [ageTouched, setAgeTouched] = useState(false);
  // Esta línea sirve para crear el estado «heightInput» y su función «setHeightInput».
  const [heightInput, setHeightInput] = useState('');
  // Esta línea sirve para crear el estado «weightInput» y su función «setWeightInput».
  const [weightInput, setWeightInput] = useState('');

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «loadQuestions».
    loadQuestions();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «loadQuestions».
  }, [loadQuestions]);

  // Esta línea sirve para extraer «te» de «STEP_ORDER[stepIndex]».
  const step = STEP_ORDER[stepIndex];

  // Esta línea sirve para devolver «<Redirect href="/login" />» si «!user».
  if (!user) return <Redirect href="/login" />;
  // Esta línea sirve para devolver «<Redirect href="/" />» si «user.onboarding_completed».
  if (user.onboarding_completed) return <Redirect href="/" />;

  // Esta línea sirve para extraer «geValidatio» de «validateOnboardingAge(ageInput)».
  const ageValidation = validateOnboardingAge(ageInput);

  // Esta línea sirve para extraer «oNex» de «async () => {».
  const goNext = async () => {
    // No alcanza con deshabilitar el botón: el "Continuar" del teclado o un
    // doble toque no deben poder saltarse la validación de edad.
    // Esta línea sirve para revisar si «step === 'age' && !ageValidation.valid».
    if (step === 'age' && !ageValidation.valid) {
      // Esta línea sirve para guardar en el estado con «setAgeTouched» el valor «true)…».
      setAgeTouched(true);
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }

    // Esta línea sirve para extraer «sLas» de «stepIndex === STEP_ORDER.length - 1».
    const isLast = stepIndex === STEP_ORDER.length - 1;

    // Esta línea sirve para revisar si «!isLast».
    if (!isLast) {
      // Esta línea sirve para guardar en el estado con «setStepIndex» el valor «(i) => i + 1)…».
      setStepIndex((i) => i + 1);
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }

    // Defensa extra: nunca enviar el onboarding con una edad inválida.
    // Esta línea sirve para revisar si «!ageValidation.valid».
    if (!ageValidation.valid) {
      // Esta línea sirve para guardar en el estado con «setStepIndex» el valor «STEP_ORDER.indexOf('age'))…».
      setStepIndex(STEP_ORDER.indexOf('age'));
      // Esta línea sirve para guardar en el estado con «setAgeTouched» el valor «true)…».
      setAgeTouched(true);
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }

    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «submit».
      await submit();
      // Esta línea sirve para esperar el resultado de «complete».
      await complete();
      // Esta línea sirve para guardar en el estado con «setOnboardingCompleted» el valor «)…».
      setOnboardingCompleted();
      // Esta línea sirve para llamar a «router.replace» con «'/'».
      router.replace('/');
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // el error ya queda expuesto vía onboarding-store.error
    }
  };

  // Esta línea sirve para extraer «oBac» de «() => {».
  const goBack = () => {
    // Esta línea sirve para salir de la función si «stepIndex === 0».
    if (stepIndex === 0) return;
    // Esta línea sirve para guardar en el estado con «setStepIndex» el valor «(i) => i - 1)…».
    setStepIndex((i) => i - 1);
  };

  // Esta línea sirve para extraer «anContinu» de «(): boolean => {».
  const canContinue = (): boolean => {
    // Esta línea sirve para elegir qué hacer según «step».
    switch (step) {
      // Esta línea sirve para permitir avanzar en el paso de edad si es válida.
      case 'age': return ageValidation.valid;
      // Esta línea sirve para permitir avanzar en el paso de sexo si eligió uno.
      case 'sex': return !!answers.sex;
      // Esta línea sirve para permitir avanzar en el paso de altura si escribió algo.
      case 'height': return heightInput.trim().length > 0;
      // Esta línea sirve para permitir avanzar en el paso de peso si escribió algo.
      case 'weight': return weightInput.trim().length > 0;
      // Esta línea sirve para permitir avanzar en el paso de nivel si eligió uno.
      case 'level': return !!answers.level;
      // Esta línea sirve para permitir avanzar en el paso de objetivos si eligió alguno.
      case 'goals': return (answers.goals?.length ?? 0) > 0;
      // Esta línea sirve para permitir avanzar en el paso de frecuencia si eligió una.
      case 'frequency': return !!answers.frequency_days;
    }
  };

  // Esta línea sirve para extraer «oggleGoa» de «(value: FitnessGoal) => {».
  const toggleGoal = (value: FitnessGoal) => {
    // Esta línea sirve para extraer «urren» de «answers.goals ?? []».
    const current = answers.goals ?? [];
    // Esta línea sirve para extraer «ex» de «current.includes(value) ? current.filter».
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    // Esta línea sirve para guardar en el estado con «setAnswer» el valor «'goals', next)…».
    setAnswer('goals', next);
  };

  // Esta línea sirve para revisar si «isLoading || !questions».
  if (isLoading || !questions) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el componente «ThemedView».
      <ThemedView style={styles.centered}>
        {/* Esta línea sirve para abrir el componente «Skeleton». */}
        <Skeleton height={56} borderRadius={Spacing.three} />
      </ThemedView>
    );
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.flex}>
      {/* Esta línea sirve para abrir el componente «KeyboardAvoidingView». */}
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
        <SafeAreaView style={styles.flex}>
          {/* Esta línea sirve para abrir el componente «ScrollView». */}
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            {/* Esta línea sirve para abrir el componente «ProgressBar». */}
            <ProgressBar current={stepIndex + 1} total={STEP_ORDER.length} />

            {/* Esta línea sirve para mostrar el bloque solo si «step === 'age'». */}
            {step === 'age' && (
              // Esta línea sirve para abrir el elemento «Question» con sus atributos en varias líneas.
              <Question
                // Esta línea sirve para definir el atributo «title» con el valor «¿Cuál es tu edad?».
                title="¿Cuál es tu edad?"
                // Esta línea sirve para pasar la propiedad «subtitle» con el valor «`Entre ${ONBOARDING_MIN_AGE} y ${ONBOARDING_M».
                subtitle={`Entre ${ONBOARDING_MIN_AGE} y ${ONBOARDING_MAX_AGE} años`}>
                {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
                <TextField
                  // Esta línea sirve para definir el atributo «label» con el valor «Edad».
                  label="Edad"
                  // Esta línea sirve para definir el atributo «keyboardType» con el valor «number-pad».
                  keyboardType="number-pad"
                  // Esta línea sirve para pasar la propiedad «maxLength» con el valor «3}».
                  maxLength={3}
                  // Esta línea sirve para pasar la propiedad «value» con el valor «ageInput}».
                  value={ageInput}
                  // Esta línea sirve para asignar el manejador del evento «onBlur».
                  onBlur={() => setAgeTouched(true)}
                  // Esta línea sirve para asignar el manejador del evento «onSubmitEditing».
                  onSubmitEditing={goNext}
                  // Esta línea sirve para pasar la propiedad «accessibilityHint» con el valor «ONBOARDING_AGE_MESSAGES.outOfRange}».
                  accessibilityHint={ONBOARDING_AGE_MESSAGES.outOfRange}
                  // Esta línea sirve para asignar el manejador del evento «onChangeText».
                  onChangeText={(v) => {
                    // Esta línea sirve para guardar en el estado con «setAgeInput» el valor «v)…».
                    setAgeInput(v);
                    // Esta línea sirve para extraer «esul» de «validateOnboardingAge(v)».
                    const result = validateOnboardingAge(v);
                    // Solo una edad válida llega a las respuestas que se
                    // envían — nunca un valor fuera de rango "a medias".
                    // Esta línea sirve para guardar en el estado con «setAnswer» el valor «'age', result.valid ? result.age : undefined)…».
                    setAnswer('age', result.valid ? result.age : undefined);
                  }}
                />
                {/* Esta línea sirve para mostrar el contenido dinámico «{/* El error aparece recién cuando el usuario ya escribió». */}
                {/* El error aparece recién cuando el usuario ya escribió
                    // Esta línea sirve para continuar el comentario sobre cuándo se muestra el error de edad.
                    algo (o intentó avanzar), no apenas entra al paso. */}
                {/* Esta línea sirve para mostrar el error de edad una vez que el usuario escribió algo. */}
                {!ageValidation.valid && (ageTouched || ageInput.trim().length >= 2) && (
                  // Esta línea sirve para abrir el componente «ThemedText».
                  <ThemedText type="small" style={styles.error} accessibilityLiveRegion="polite">
                    {/* Esta línea sirve para mostrar el valor «ageValidation.error». */}
                    {ageValidation.error}
                  </ThemedText>
                )}
              </Question>
            )}

            {/* Esta línea sirve para mostrar el bloque solo si «step === 'sex'». */}
            {step === 'sex' && (
              // Esta línea sirve para abrir el componente «Question».
              <Question title="¿Cuál es tu sexo?">
                {/* Esta línea sirve para recorrer «(['male', 'female'] as const)» y mostrar un bloque por elemento. */}
                {(['male', 'female'] as const).map((value) => (
                  // Esta línea sirve para abrir el elemento «OptionCard» con sus atributos en varias líneas.
                  <OptionCard
                    // Esta línea sirve para identificar el elemento de la lista con «value}».
                    key={value}
                    // Esta línea sirve para pasar la propiedad «label» con el valor «value === 'male' ? 'Hombre' : 'Mujer'}».
                    label={value === 'male' ? 'Hombre' : 'Mujer'}
                    // Esta línea sirve para pasar la propiedad «selected» con el valor «answers.sex === value}».
                    selected={answers.sex === value}
                    // Esta línea sirve para asignar el manejador del evento «onPress».
                    onPress={() => setAnswer('sex', value)}
                  />
                ))}
              </Question>
            )}

            {/* Esta línea sirve para mostrar el bloque solo si «step === 'height'». */}
            {step === 'height' && (
              // Esta línea sirve para abrir el componente «Question».
              <Question title="¿Cuál es tu altura?" subtitle="En centímetros">
                {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
                <TextField
                  // Esta línea sirve para definir el atributo «label» con el valor «Altura (cm)».
                  label="Altura (cm)"
                  // Esta línea sirve para definir el atributo «keyboardType» con el valor «decimal-pad».
                  keyboardType="decimal-pad"
                  // Esta línea sirve para pasar la propiedad «value» con el valor «heightInput}».
                  value={heightInput}
                  // Esta línea sirve para asignar el manejador del evento «onChangeText».
                  onChangeText={(v) => {
                    // Esta línea sirve para guardar en el estado con «setHeightInput» el valor «v)…».
                    setHeightInput(v);
                    // Esta línea sirve para guardar en el estado con «setAnswer» el valor «'height_cm', Number(v) || undefined)…».
                    setAnswer('height_cm', Number(v) || undefined);
                  }}
                />
              </Question>
            )}

            {/* Esta línea sirve para mostrar el bloque solo si «step === 'weight'». */}
            {step === 'weight' && (
              // Esta línea sirve para abrir el componente «Question».
              <Question title="¿Cuál es tu peso?" subtitle="En kilogramos">
                {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
                <TextField
                  // Esta línea sirve para definir el atributo «label» con el valor «Peso (kg)».
                  label="Peso (kg)"
                  // Esta línea sirve para definir el atributo «keyboardType» con el valor «decimal-pad».
                  keyboardType="decimal-pad"
                  // Esta línea sirve para pasar la propiedad «value» con el valor «weightInput}».
                  value={weightInput}
                  // Esta línea sirve para asignar el manejador del evento «onChangeText».
                  onChangeText={(v) => {
                    // Esta línea sirve para guardar en el estado con «setWeightInput» el valor «v)…».
                    setWeightInput(v);
                    // Esta línea sirve para guardar en el estado con «setAnswer» el valor «'weight_kg', Number(v) || undefined)…».
                    setAnswer('weight_kg', Number(v) || undefined);
                  }}
                />
              </Question>
            )}

            {/* Esta línea sirve para mostrar el bloque solo si «step === 'level'». */}
            {step === 'level' && (
              // Esta línea sirve para abrir el elemento «Question» con sus atributos en varias líneas.
              <Question
                // Esta línea sirve para definir el atributo «title» con el valor «¿Cuál es tu nivel de entrenamiento?».
                title="¿Cuál es tu nivel de entrenamiento?"
                // Esta línea sirve para definir el atributo «subtitle».
                subtitle="Según tu experiencia entrenando fuerza o en el gimnasio">
                {/* Esta línea sirve para recorrer «questions.levels» y mostrar un bloque por elemento. */}
                {questions.levels.map((value) => (
                  // Esta línea sirve para abrir el elemento «OptionCard» con sus atributos en varias líneas.
                  <OptionCard
                    // Esta línea sirve para identificar el elemento de la lista con «value}».
                    key={value}
                    // Esta línea sirve para pasar la propiedad «label» con el valor «LEVEL_LABELS[value]}».
                    label={LEVEL_LABELS[value]}
                    // Esta línea sirve para pasar la propiedad «selected» con el valor «answers.level === value}».
                    selected={answers.level === value}
                    // Esta línea sirve para asignar el manejador del evento «onPress».
                    onPress={() => setAnswer('level', value)}
                  />
                ))}
              </Question>
            )}

            {/* Esta línea sirve para mostrar el bloque solo si «step === 'goals'». */}
            {step === 'goals' && (
              // Esta línea sirve para abrir el componente «Question».
              <Question title="¿Cuál es tu objetivo?" subtitle="Puedes elegir más de uno">
                {/* Esta línea sirve para recorrer «questions.goals» y mostrar un bloque por elemento. */}
                {questions.goals.map((value) => (
                  // Esta línea sirve para abrir el elemento «OptionCard» con sus atributos en varias líneas.
                  <OptionCard
                    // Esta línea sirve para identificar el elemento de la lista con «value}».
                    key={value}
                    // Esta línea sirve para pasar la propiedad «label» con el valor «GOAL_LABELS[value]}».
                    label={GOAL_LABELS[value]}
                    // Esta línea sirve para pasar la propiedad «selected» con el valor «(answers.goals ?? []).includes(value)}».
                    selected={(answers.goals ?? []).includes(value)}
                    // Esta línea sirve para asignar el manejador del evento «onPress».
                    onPress={() => toggleGoal(value)}
                  />
                ))}
              </Question>
            )}

            {/* Esta línea sirve para mostrar el bloque solo si «step === 'frequency'». */}
            {step === 'frequency' && (
              // Esta línea sirve para abrir el componente «Question».
              <Question title="¿Cuántos días a la semana entrenarás?">
                {/* Esta línea sirve para recorrer «questions.frequency_days» y mostrar un bloque por elemento. */}
                {questions.frequency_days.map((value) => (
                  // Esta línea sirve para abrir el elemento «OptionCard» con sus atributos en varias líneas.
                  <OptionCard
                    // Esta línea sirve para identificar el elemento de la lista con «value}».
                    key={value}
                    // Esta línea sirve para pasar la propiedad «label» con el valor «`${value} días`}».
                    label={`${value} días`}
                    // Esta línea sirve para pasar la propiedad «selected» con el valor «answers.frequency_days === value}».
                    selected={answers.frequency_days === value}
                    // Esta línea sirve para asignar el manejador del evento «onPress».
                    onPress={() => setAnswer('frequency_days', value as FrequencyDays)}
                  />
                ))}
              </Question>
            )}

            {/* Esta línea sirve para mostrar el bloque solo si «error». */}
            {error && (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="small" style={styles.error}>
                {/* Esta línea sirve para mostrar el valor «error». */}
                {error}
              </ThemedText>
            )}

            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.actions}>
              {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
              <PrimaryButton
                // Esta línea sirve para pasar la propiedad «label» con el valor «stepIndex === STEP_ORDER.length - 1 ? 'Genera».
                label={stepIndex === STEP_ORDER.length - 1 ? 'Generar mi plan' : 'Continuar'}
                // Esta línea sirve para asignar el manejador del evento «onPress».
                onPress={goNext}
                // Esta línea sirve para pasar la propiedad «disabled» con el valor «!canContinue()}».
                disabled={!canContinue()}
                // Esta línea sirve para pasar la propiedad «loading» con el valor «isSubmitting}».
                loading={isSubmitting}
              />
              {/* Esta línea sirve para mostrar el elemento solo si «stepIndex > 0». */}
              {stepIndex > 0 && <PrimaryButton label="Atrás" variant="ghost" onPress={goBack} />}
            </ThemedView>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar la función «Question».
function Question({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.question}>
      {/* Esta línea sirve para mostrar el valor «title» dentro de «ThemedText». */}
      <ThemedText type="subtitle">{title}</ThemedText>
      {/* Esta línea sirve para mostrar el bloque solo si «subtitle». */}
      {subtitle && (
        // Esta línea sirve para abrir el componente «ThemedText».
        <ThemedText type="small" themeColor="textSecondary">
          {/* Esta línea sirve para mostrar el valor «subtitle». */}
          {subtitle}
        </ThemedText>
      )}
      {/* Esta línea sirve para mostrar el valor «children» dentro de «ThemedView». */}
      <ThemedView style={styles.optionsList}>{children}</ThemedView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «{ flex: 1 }».
  flex: { flex: 1 },
  // Esta línea sirve para definir el estilo «centered» con «flex: 1, alignItems: 'center', justifyContent: 'ce…».
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  // Esta línea sirve para declarar la propiedad «scroll» con el valor o tipo «{».
  scroll: {
    // Esta línea sirve para declarar la propiedad «flexGrow» con el valor o tipo «1».
    flexGrow: 1,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.four».
    padding: Spacing.four,
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «MaxContentWidth».
    maxWidth: MaxContentWidth,
    // Esta línea sirve para declarar la propiedad «alignSelf» con el valor o tipo «'center'».
    alignSelf: 'center',
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
  },
  // Esta línea sirve para definir el estilo «question» con «gap: Spacing.one, marginBottom: Spacing.four },…».
  question: { gap: Spacing.one, marginBottom: Spacing.four },
  // Esta línea sirve para declarar la propiedad «optionsList» con el valor o tipo «{ gap: Spacing.two, marginTop: Spacing.two }».
  optionsList: { gap: Spacing.two, marginTop: Spacing.two },
  // Esta línea sirve para declarar la propiedad «actions» con el valor o tipo «{ gap: Spacing.two, marginTop: 'auto' }».
  actions: { gap: Spacing.two, marginTop: 'auto' },
  // Esta línea sirve para definir el estilo «error» con «color: '#FF4D5E', marginBottom: Spacing.two },…».
  error: { color: '#FF4D5E', marginBottom: Spacing.two },
});
