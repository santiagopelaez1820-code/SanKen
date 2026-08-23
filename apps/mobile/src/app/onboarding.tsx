import { useEffect, useState } from 'react';
import { Redirect, router } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { FitnessGoal, FitnessLevel, FrequencyDays } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { OptionCard } from '@/components/ui/option-card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { TextField } from '@/components/ui/text-field';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';
import { useOnboardingStore } from '@/store/onboarding-store';
import { Skeleton } from '@/components/ui/skeleton';

const LEVEL_LABELS: Record<FitnessLevel, string> = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
};

const GOAL_LABELS: Record<FitnessGoal, string> = {
  gain_muscle: 'Ganar músculo',
  lose_fat: 'Perder grasa',
  body_recomposition: 'Recomposición corporal',
  strength: 'Fuerza',
  endurance: 'Resistencia',
  sport_performance: 'Rendimiento deportivo',
  health: 'Salud',
  cardio: 'Cardio',
};

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
const STEP_ORDER: StepId[] = ['age', 'sex', 'height', 'weight', 'level', 'goals', 'frequency'];

export default function OnboardingScreen() {
  const user = useAuthStore((s) => s.user);
  const setOnboardingCompleted = useAuthStore((s) => s.setOnboardingCompleted);
  const { questions, loadQuestions, answers, setAnswer, submit, complete, isLoading, isSubmitting, error } =
    useOnboardingStore();

  const [stepIndex, setStepIndex] = useState(0);
  const [ageInput, setAgeInput] = useState('');
  const [heightInput, setHeightInput] = useState('');
  const [weightInput, setWeightInput] = useState('');

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const step = STEP_ORDER[stepIndex];

  if (!user) return <Redirect href="/login" />;
  if (user.onboarding_completed) return <Redirect href="/" />;

  const goNext = async () => {
    const isLast = stepIndex === STEP_ORDER.length - 1;

    if (!isLast) {
      setStepIndex((i) => i + 1);
      return;
    }

    try {
      await submit();
      await complete();
      setOnboardingCompleted();
      router.replace('/');
    } catch {
      // el error ya queda expuesto vía onboarding-store.error
    }
  };

  const goBack = () => {
    if (stepIndex === 0) return;
    setStepIndex((i) => i - 1);
  };

  const canContinue = (): boolean => {
    switch (step) {
      case 'age': return ageInput.trim().length > 0;
      case 'sex': return !!answers.sex;
      case 'height': return heightInput.trim().length > 0;
      case 'weight': return weightInput.trim().length > 0;
      case 'level': return !!answers.level;
      case 'goals': return (answers.goals?.length ?? 0) > 0;
      case 'frequency': return !!answers.frequency_days;
    }
  };

  const toggleGoal = (value: FitnessGoal) => {
    const current = answers.goals ?? [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setAnswer('goals', next);
  };

  if (isLoading || !questions) {
    return (
      <ThemedView style={styles.centered}>
        <Skeleton height={56} borderRadius={Spacing.three} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.flex}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <ProgressBar current={stepIndex + 1} total={STEP_ORDER.length} />

            {step === 'age' && (
              <Question title="¿Cuál es tu edad?">
                <TextField
                  label="Edad"
                  keyboardType="number-pad"
                  value={ageInput}
                  onChangeText={(v) => {
                    setAgeInput(v);
                    setAnswer('age', Number(v) || undefined);
                  }}
                />
              </Question>
            )}

            {step === 'sex' && (
              <Question title="¿Cuál es tu sexo?">
                {(['male', 'female'] as const).map((value) => (
                  <OptionCard
                    key={value}
                    label={value === 'male' ? 'Hombre' : 'Mujer'}
                    selected={answers.sex === value}
                    onPress={() => setAnswer('sex', value)}
                  />
                ))}
              </Question>
            )}

            {step === 'height' && (
              <Question title="¿Cuál es tu altura?" subtitle="En centímetros">
                <TextField
                  label="Altura (cm)"
                  keyboardType="decimal-pad"
                  value={heightInput}
                  onChangeText={(v) => {
                    setHeightInput(v);
                    setAnswer('height_cm', Number(v) || undefined);
                  }}
                />
              </Question>
            )}

            {step === 'weight' && (
              <Question title="¿Cuál es tu peso?" subtitle="En kilogramos">
                <TextField
                  label="Peso (kg)"
                  keyboardType="decimal-pad"
                  value={weightInput}
                  onChangeText={(v) => {
                    setWeightInput(v);
                    setAnswer('weight_kg', Number(v) || undefined);
                  }}
                />
              </Question>
            )}

            {step === 'level' && (
              <Question title="¿Cuál es tu nivel?">
                {questions.levels.map((value) => (
                  <OptionCard
                    key={value}
                    label={LEVEL_LABELS[value]}
                    selected={answers.level === value}
                    onPress={() => setAnswer('level', value)}
                  />
                ))}
              </Question>
            )}

            {step === 'goals' && (
              <Question title="¿Cuál es tu objetivo?" subtitle="Puedes elegir más de uno">
                {questions.goals.map((value) => (
                  <OptionCard
                    key={value}
                    label={GOAL_LABELS[value]}
                    selected={(answers.goals ?? []).includes(value)}
                    onPress={() => toggleGoal(value)}
                  />
                ))}
              </Question>
            )}

            {step === 'frequency' && (
              <Question title="¿Cuántos días a la semana entrenarás?">
                {questions.frequency_days.map((value) => (
                  <OptionCard
                    key={value}
                    label={`${value} días`}
                    selected={answers.frequency_days === value}
                    onPress={() => setAnswer('frequency_days', value as FrequencyDays)}
                  />
                ))}
              </Question>
            )}

            {error && (
              <ThemedText type="small" style={styles.error}>
                {error}
              </ThemedText>
            )}

            <ThemedView style={styles.actions}>
              <PrimaryButton
                label={stepIndex === STEP_ORDER.length - 1 ? 'Generar mi plan' : 'Continuar'}
                onPress={goNext}
                disabled={!canContinue()}
                loading={isSubmitting}
              />
              {stepIndex > 0 && <PrimaryButton label="Atrás" variant="ghost" onPress={goBack} />}
            </ThemedView>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

function Question({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <ThemedView style={styles.question}>
      <ThemedText type="subtitle">{title}</ThemedText>
      {subtitle && (
        <ThemedText type="small" themeColor="textSecondary">
          {subtitle}
        </ThemedText>
      )}
      <ThemedView style={styles.optionsList}>{children}</ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: {
    flexGrow: 1,
    padding: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  question: { gap: Spacing.two, marginBottom: Spacing.four },
  optionsList: { gap: Spacing.two, marginTop: Spacing.three },
  actions: { gap: Spacing.two, marginTop: 'auto' },
  error: { color: '#D9534F', marginBottom: Spacing.two },
});
