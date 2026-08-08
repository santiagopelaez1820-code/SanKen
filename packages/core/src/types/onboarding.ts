export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export type FitnessGoal =
  | 'gain_muscle'
  | 'lose_fat'
  | 'body_recomposition'
  | 'strength'
  | 'endurance'
  | 'sport_performance'
  | 'health'
  | 'cardio';

export type TrainingPlace = 'home' | 'gym';
export type FrequencyDays = 3 | 4 | 5 | 6;
export type SessionMinutes = 30 | 45 | 60 | 90;

export interface OnboardingCity {
  id: number;
  name: string;
}

export interface OnboardingCountry {
  id: number;
  name: string;
  cities: OnboardingCity[];
}

/** GET /onboarding/questions — catálogo para renderizar el wizard dinámicamente. */
export interface OnboardingQuestions {
  levels: FitnessLevel[];
  goals: FitnessGoal[];
  frequency_days: FrequencyDays[];
  session_minutes: SessionMinutes[];
  places: TrainingPlace[];
  equipment: string[];
  countries: OnboardingCountry[];
}

/** Payload aceptado por POST/PATCH /onboarding — todos los campos son opcionales. */
export interface OnboardingAnswers {
  age?: number;
  sex?: 'male' | 'female';
  height_cm?: number;
  weight_kg?: number;
  country_id?: number | null;
  city_id?: number | null;
  gym_id?: number | null;
  level?: FitnessLevel;
  goals?: FitnessGoal[];
  frequency_days?: FrequencyDays;
  session_minutes?: SessionMinutes;
  place?: TrainingPlace;
  equipment_available?: string[];
  injuries?: string[];
  experience_notes?: string | null;
}

/** GET /onboarding — estado actual guardado del usuario. */
export interface OnboardingState {
  age: number | null;
  sex: 'male' | 'female' | null;
  height_cm: number | null;
  weight_kg: number | null;
  city_id: number | null;
  gym_id: number | null;
  level: FitnessLevel | null;
  goals: FitnessGoal[];
  frequency_days: FrequencyDays | null;
  session_minutes: SessionMinutes | null;
  place: TrainingPlace | null;
  equipment_available: string[];
  injuries: string[];
  experience_notes: string | null;
  completed: boolean;
  completed_at: string | null;
}
