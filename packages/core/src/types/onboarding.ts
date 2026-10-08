// Esta línea sirve para declarar el tipo «FitnessLevel» como «'beginner' | 'intermediate' | 'advanced'».
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

// Esta línea sirve para declarar el tipo «FitnessGoal» (definición en las líneas siguientes).
export type FitnessGoal =
  // Esta línea sirve para incluir la variante «'gain_muscle'».
  | 'gain_muscle'
  // Esta línea sirve para incluir la variante «'lose_fat'».
  | 'lose_fat'
  // Esta línea sirve para incluir la variante «'body_recomposition'».
  | 'body_recomposition'
  // Esta línea sirve para incluir la variante «'strength'».
  | 'strength'
  // Esta línea sirve para incluir la variante «'endurance'».
  | 'endurance'
  // Esta línea sirve para incluir la variante «'sport_performance'».
  | 'sport_performance'
  // Esta línea sirve para incluir la variante «'health'».
  | 'health'
  // Esta línea sirve para incluir la variante «'cardio';».
  | 'cardio';

/** Dinámico ahora — cualquier frecuencia con al menos una plantilla activa en Super Admin (ver RoutineTemplate::activeFrequencyDays en el backend). */
// Esta línea sirve para declarar el tipo «FrequencyDays» como «number».
export type FrequencyDays = number;

// Esta línea sirve para declarar la interfaz «OnboardingCity».
export interface OnboardingCity {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «name» de tipo «string».
  name: string;
}

/** GET /onboarding/countries/{country}/states — un país trae de un puñado a un centenar de estados/departamentos reales; suficientemente chico para filtrar client-side (sin paginar). */
// Esta línea sirve para declarar la interfaz «OnboardingStateOption».
export interface OnboardingStateOption {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «name» de tipo «string».
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
// Esta línea sirve para declarar la interfaz «OnboardingCitySearchParams».
export interface OnboardingCitySearchParams {
  // Esta línea sirve para declarar el campo opcional «search» de tipo «string».
  search?: string;
  // Esta línea sirve para declarar el campo opcional «limit» de tipo «number».
  limit?: number;
}

/** GET /onboarding/questions — countries sin ciudades anidadas (se piden bajo demanda, ver getCities). */
// Esta línea sirve para declarar la interfaz «OnboardingCountry».
export interface OnboardingCountry {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «name» de tipo «string».
  name: string;
}

/** GET /onboarding/questions — catálogo para renderizar el wizard dinámicamente. */
// Esta línea sirve para declarar la interfaz «OnboardingQuestions».
export interface OnboardingQuestions {
  // Esta línea sirve para declarar el campo «levels» de tipo «FitnessLevel[]».
  levels: FitnessLevel[];
  // Esta línea sirve para declarar el campo «goals» de tipo «FitnessGoal[]».
  goals: FitnessGoal[];
  // Esta línea sirve para declarar el campo «frequency_days» de tipo «FrequencyDays[]».
  frequency_days: FrequencyDays[];
  // Esta línea sirve para declarar el campo «equipment» de tipo «string[]».
  equipment: string[];
  // Esta línea sirve para declarar el campo «countries» de tipo «OnboardingCountry[]».
  countries: OnboardingCountry[];
}

/** Payload aceptado por POST/PATCH /onboarding — todos los campos son opcionales. */
// Esta línea sirve para declarar la interfaz «OnboardingAnswers».
export interface OnboardingAnswers {
  // Esta línea sirve para declarar el campo opcional «age» de tipo «number».
  age?: number;
  // Esta línea sirve para declarar el campo opcional «sex» de tipo «'male' | 'female'».
  sex?: 'male' | 'female';
  // Esta línea sirve para declarar el campo opcional «height_cm» de tipo «number».
  height_cm?: number;
  // Esta línea sirve para declarar el campo opcional «weight_kg» de tipo «number».
  weight_kg?: number;
  // Esta línea sirve para declarar el campo opcional «country_id» de tipo «number | null».
  country_id?: number | null;
  // Esta línea sirve para declarar el campo opcional «state_id» de tipo «number | null».
  state_id?: number | null;
  // Esta línea sirve para declarar el campo opcional «city_id» de tipo «number | null».
  city_id?: number | null;
  // Esta línea sirve para declarar el campo opcional «gym_id» de tipo «number | null».
  gym_id?: number | null;
  // Esta línea sirve para declarar el campo opcional «level» de tipo «FitnessLevel».
  level?: FitnessLevel;
  // Esta línea sirve para declarar el campo opcional «goals» de tipo «FitnessGoal[]».
  goals?: FitnessGoal[];
  // Esta línea sirve para declarar el campo opcional «frequency_days» de tipo «FrequencyDays».
  frequency_days?: FrequencyDays;
  // Esta línea sirve para declarar el campo opcional «equipment_available» de tipo «string[]».
  equipment_available?: string[];
}

/** GET /onboarding — estado actual guardado del usuario. */
// Esta línea sirve para declarar la interfaz «OnboardingState».
export interface OnboardingState {
  // Esta línea sirve para declarar el campo «age» de tipo «number | null».
  age: number | null;
  // Esta línea sirve para declarar el campo «sex» de tipo «'male' | 'female' | null».
  sex: 'male' | 'female' | null;
  // Esta línea sirve para declarar el campo «city_id» de tipo «number | null».
  city_id: number | null;
  /** Derivados de city_id (no columnas propias) — igual que en el backend. */
  // Esta línea sirve para declarar el campo «state_id» de tipo «number | null».
  state_id: number | null;
  // Esta línea sirve para declarar el campo «country_id» de tipo «number | null».
  country_id: number | null;
  // Esta línea sirve para declarar el campo «height_cm» de tipo «number | null».
  height_cm: number | null;
  // Esta línea sirve para declarar el campo «weight_kg» de tipo «number | null».
  weight_kg: number | null;
  // Esta línea sirve para declarar el campo «gym_id» de tipo «number | null».
  gym_id: number | null;
  // Esta línea sirve para declarar el campo «level» de tipo «FitnessLevel | null».
  level: FitnessLevel | null;
  // Esta línea sirve para declarar el campo «goals» de tipo «FitnessGoal[]».
  goals: FitnessGoal[];
  // Esta línea sirve para declarar el campo «frequency_days» de tipo «FrequencyDays | null».
  frequency_days: FrequencyDays | null;
  // Esta línea sirve para declarar el campo «equipment_available» de tipo «string[]».
  equipment_available: string[];
  // Esta línea sirve para declarar el campo «completed» de tipo «boolean».
  completed: boolean;
  // Esta línea sirve para declarar el campo «completed_at» de tipo «string | null».
  completed_at: string | null;
}
