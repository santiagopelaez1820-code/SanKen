import { useEffect, useMemo, useState } from 'react';
import { Redirect, router } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { FitnessGoal, FitnessLevel, FrequencyDays, SessionMinutes, TrainingPlace } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { OptionCard } from '@/components/ui/option-card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { TextField } from '@/components/ui/text-field';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';
import { useOnboardingStore } from '@/store/onboarding-store';

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

const PLACE_LABELS: Record<TrainingPlace, string> = {
  home: 'Casa',
  gym: 'Gimnasio',
};

const EQUIPMENT_LABELS: Record<string, string> = {
  barbell: 'Barra',
  dumbbells: 'Mancuernas',
  bench: 'Banco',
  squat_rack: 'Rack de sentadillas',
  pull_up_bar: 'Barra de dominadas',
  cables: 'Poleas',
  machines: 'Máquinas',
  kettlebells: 'Kettlebells',
  resistance_bands: 'Bandas de resistencia',
  bodyweight_only: 'Solo peso corporal',
};

type StepId =
  | 'age' | 'sex' | 'height' | 'weight' | 'country' | 'city'
  | 'level' | 'goals' | 'frequency' | 'session' | 'place'
  | 'equipment' | 'injuries' | 'experience';

const STEP_ORDER: StepId[] = [
  'age', 'sex', 'height', 'weight', 'country', 'city',
  'level', 'goals', 'frequency', 'session', 'place',
  'equipment', 'injuries', 'experience',
];

export default function OnboardingScreen() {
  const user = useAuthStore((s) => s.user);
  const setOnboardingCompleted = useAuthStore((s) => s.setOnboardingCompleted);
  const { questions, loadQuestions, answers, setAnswer, submit, complete, isLoading, isSubmitting, error } =
    useOnboardingStore();

  const [stepIndex, setStepIndex] = useState(0);
  const [countryId, setCountryId] = useState<number | null>(null);
  const [ageInput, setAgeInput] = useState('');
  const [heightInput, setHeightInput] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [injuriesInput, setInjuriesInput] = useState('');
  const [experienceInput, setExperienceInput] = useState('');

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const selectedCountry = useMemo(
    () => questions?.countries.find((c) => c.id === countryId) ?? null,
    [questions, countryId],
  );

  if (!user) return <Redirect href="/login" />;
  if (user.onboarding_completed) return <Redirect href="/" />;

  const step = STEP_ORDER[stepIndex];

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
      case 'country': return countryId !== null;
      case 'city': return !!answers.city_id;
      case 'level': return !!answers.level;
      case 'goals': return (answers.goals?.length ?? 0) > 0;
      case 'frequency': return !!answers.frequency_days;
      case 'session': return !!answers.session_minutes;
      case 'place': return !!answers.place;
      default: return true; // equipment / injuries / experience son opcionales
    }
  };

  const toggleMulti = (key: 'goals' | 'equipment_available', value: string) => {
    const current = (answers[key] as string[] | undefined) ?? [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setAnswer(key, next as never);
  };

  if (isLoading || !questions) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="small" themeColor="textSecondary">Cargando…</ThemedText>
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

            {step === 'country' && (
              <Question title="¿En qué país estás?">
                {questions.countries.map((c) => (
                  <OptionCard
                    key={c.id}
                    label={c.name}
                    selected={countryId === c.id}
                    onPress={() => {
                      setCountryId(c.id);
                      setAnswer('city_id', undefined);
                    }}
                  />
                ))}
              </Question>
            )}

            {step === 'city' && (
              <Question title="¿En qué ciudad?">
                {(selectedCountry?.cities ?? []).map((c) => (
                  <OptionCard
                    key={c.id}
                    label={c.name}
                    selected={answers.city_id === c.id}
                    onPress={() => setAnswer('city_id', c.id)}
                  />
                ))}
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
                    onPress={() => toggleMulti('goals', value)}
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

            {step === 'session' && (
              <Question title="¿Cuánto tiempo tienes por sesión?">
                {questions.session_minutes.map((value) => (
                  <OptionCard
                    key={value}
                    label={`${value} minutos`}
                    selected={answers.session_minutes === value}
                    onPress={() => setAnswer('session_minutes', value as SessionMinutes)}
                  />
                ))}
              </Question>
            )}

            {step === 'place' && (
              <Question title="¿Dónde entrenarás?">
                {questions.places.map((value) => (
                  <OptionCard
                    key={value}
                    label={PLACE_LABELS[value]}
                    selected={answers.place === value}
                    onPress={() => setAnswer('place', value)}
                  />
                ))}
              </Question>
            )}

            {step === 'equipment' && (
              <Question title="¿Qué equipo tienes disponible?" subtitle="Opcional — puedes elegir varios">
                {questions.equipment.map((value) => (
                  <OptionCard
                    key={value}
                    label={EQUIPMENT_LABELS[value] ?? value}
                    selected={(answers.equipment_available ?? []).includes(value)}
                    onPress={() => toggleMulti('equipment_available', value)}
                  />
                ))}
              </Question>
            )}

            {step === 'injuries' && (
              <Question title="¿Tienes alguna lesión?" subtitle="Opcional — sepáralas por coma">
                <TextField
                  label="Lesiones"
                  value={injuriesInput}
                  onChangeText={(v) => {
                    setInjuriesInput(v);
                    setAnswer(
                      'injuries',
                      v.split(',').map((s) => s.trim()).filter(Boolean),
                    );
                  }}
                  placeholder="Ej. hombro, rodilla derecha"
                />
              </Question>
            )}

            {step === 'experience' && (
              <Question title="Cuéntanos tu experiencia" subtitle="Opcional">
                <TextField
                  label="Experiencia"
                  value={experienceInput}
                  onChangeText={(v) => {
                    setExperienceInput(v);
                    setAnswer('experience_notes', v || null);
                  }}
                  multiline
                  numberOfLines={4}
                />
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
  error: { color: '#C9564A', marginBottom: Spacing.two },
});
