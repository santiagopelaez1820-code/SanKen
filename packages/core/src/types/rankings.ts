// Esta línea sirve para declarar la interfaz «RankingEntry».
export interface RankingEntry {
  // Esta línea sirve para declarar el campo «rank» de tipo «number».
  rank: number;
  // Esta línea sirve para declarar el campo «user_id» de tipo «number».
  user_id: number;
  // Esta línea sirve para declarar el campo «user_name» de tipo «string».
  user_name: string;
  // Esta línea sirve para declarar el campo «metric_value» de tipo «number».
  metric_value: number;
  // Esta línea sirve para declarar el campo «is_viewer» de tipo «boolean».
  is_viewer: boolean;
}

/**
 * Ranking en vivo por ejercicio (pestaña PR), basado ÚNICAMENTE en
 * PrSubmission aprobadas — ver GetExerciseRankingAction. El ranking
 * general por volumen de entrenamiento (todas las plataformas, sin elegir
 * un ejercicio) se retiró: no había forma de combinar PRs de distintos
 * ejercicios en un solo número sin inventar una métrica nueva, y el
 * pedido exige que Rankings solo cuente PRs aprobados con video.
 */
// Esta línea sirve para declarar el tipo «ExerciseRankingScope» como «'global' | 'country' | 'city'».
export type ExerciseRankingScope = 'global' | 'country' | 'city';
// Esta línea sirve para declarar el tipo «ExerciseRankingSex» como «'male' | 'female'».
export type ExerciseRankingSex = 'male' | 'female';

// Esta línea sirve para declarar la interfaz «ExerciseRankingResponse».
export interface ExerciseRankingResponse {
  // Esta línea sirve para declarar el campo «scope» de tipo «ExerciseRankingScope».
  scope: ExerciseRankingScope;
  // Esta línea sirve para declarar el campo «scope_label» de tipo «string | null».
  scope_label: string | null;
  // Esta línea sirve para declarar el campo «sex» de tipo «ExerciseRankingSex».
  sex: ExerciseRankingSex;
  // Esta línea sirve para declarar el campo «exercise_id» de tipo «number».
  exercise_id: number;
  // Esta línea sirve para declarar el campo «exercise_name» de tipo «string».
  exercise_name: string;
  // Esta línea sirve para declarar el campo «entries» de tipo «RankingEntry[]».
  entries: RankingEntry[];
  // Esta línea sirve para declarar el campo «viewer» de tipo «RankingEntry | null».
  viewer: RankingEntry | null;
}
