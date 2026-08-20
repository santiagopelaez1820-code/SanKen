export interface RankingEntry {
  rank: number;
  user_id: number;
  user_name: string;
  metric_value: number;
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
export type ExerciseRankingScope = 'global' | 'country' | 'city';
export type ExerciseRankingSex = 'male' | 'female';

export interface ExerciseRankingResponse {
  scope: ExerciseRankingScope;
  scope_label: string | null;
  sex: ExerciseRankingSex;
  exercise_id: number;
  exercise_name: string;
  entries: RankingEntry[];
  viewer: RankingEntry | null;
}
