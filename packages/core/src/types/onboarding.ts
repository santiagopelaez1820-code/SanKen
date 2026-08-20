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

/** Dinámico ahora — cualquier frecuencia con al menos una plantilla activa en Super Admin (ver RoutineTemplate::activeFrequencyDays en el backend). */
export type FrequencyDays = number;

export interface OnboardingCity {
  id: number;
  name: string;
}

/** GET /onboarding/countries/{country}/states — un país trae de un puñado a un centenar de estados/departamentos reales; suficientemente chico para filtrar client-side (sin paginar). */
export interface OnboardingStateOption {
  id: number;
  name: string;
}

/**
 * GET /onboarding/states/{state}/cities?search=&limit= — con datos reales
 * importados (ver ImportLocationData en el backend) un solo estado puede
 * tener miles de ciudades, así que este endpoint nunca las trae todas:
 * `search` filtra por coincidencia parcial case-insensitive sobre el
 * nombre y `limit` topea el tamaño de página (server default 50, tope
 * 100). Web y mobile comparten este mismo contrato — ver LocationSurveyPage
 * (web) y ubicacion.tsx/onboarding-store.ts (mobile).
 */
export interface OnboardingCitySearchParams {
  search?: string;
  limit?: number;
}

/** GET /onboarding/questions — countries sin ciudades anidadas (se piden bajo demanda, ver getCities). */
export interface OnboardingCountry {
  id: number;
  name: string;
}

/** GET /onboarding/questions — catálogo para renderizar el wizard dinámicamente. */
export interface OnboardingQuestions {
  levels: FitnessLevel[];
  goals: FitnessGoal[];
  frequency_days: FrequencyDays[];
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
  state_id?: number | null;
  city_id?: number | null;
  gym_id?: number | null;
  level?: FitnessLevel;
  goals?: FitnessGoal[];
  frequency_days?: FrequencyDays;
  equipment_available?: string[];
}

/** GET /onboarding — estado actual guardado del usuario. */
export interface OnboardingState {
  age: number | null;
  sex: 'male' | 'female' | null;
  city_id: number | null;
  /** Derivados de city_id (no columnas propias) — igual que en el backend. */
  state_id: number | null;
  country_id: number | null;
  height_cm: number | null;
  weight_kg: number | null;
  gym_id: number | null;
  level: FitnessLevel | null;
  goals: FitnessGoal[];
  frequency_days: FrequencyDays | null;
  equipment_available: string[];
  completed: boolean;
  completed_at: string | null;
}
