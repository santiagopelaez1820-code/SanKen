// Esta línea sirve para declarar el tipo «ChallengeType» como «'weekly' | 'monthly'».
export type ChallengeType = 'weekly' | 'monthly';

// Esta línea sirve para declarar el tipo «ChallengeMetric» como «'workouts_count' | 'total_volume_kg'».
export type ChallengeMetric = 'workouts_count' | 'total_volume_kg';

// Esta línea sirve para declarar la interfaz «ChallengeCriteria».
export interface ChallengeCriteria {
  // Esta línea sirve para declarar el campo «metric» de tipo «ChallengeMetric».
  metric: ChallengeMetric;
  // Esta línea sirve para declarar el campo «target» de tipo «number».
  target: number;
}

// Esta línea sirve para declarar la interfaz «Challenge».
export interface Challenge {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «title» de tipo «string».
  title: string;
  // Esta línea sirve para declarar el campo «description» de tipo «string».
  description: string;
  // Esta línea sirve para declarar el campo «type» de tipo «ChallengeType».
  type: ChallengeType;
  // Esta línea sirve para declarar el campo «criteria» de tipo «ChallengeCriteria».
  criteria: ChallengeCriteria;
  // Esta línea sirve para declarar el campo «starts_at» de tipo «string».
  starts_at: string;
  // Esta línea sirve para declarar el campo «ends_at» de tipo «string».
  ends_at: string;
  // Esta línea sirve para declarar el campo «joined» de tipo «boolean».
  joined: boolean;
  // Esta línea sirve para declarar el campo «progress_value» de tipo «number | null».
  progress_value: number | null;
  // Esta línea sirve para declarar el campo «completed» de tipo «boolean».
  completed: boolean;
}

// Esta línea sirve para declarar la interfaz «ChallengeLeaderboardEntry».
export interface ChallengeLeaderboardEntry {
  // Esta línea sirve para declarar el campo «rank» de tipo «number».
  rank: number;
  // Esta línea sirve para declarar el campo «user_id» de tipo «number».
  user_id: number;
  // Esta línea sirve para declarar el campo «user_name» de tipo «string».
  user_name: string;
  // Esta línea sirve para declarar el campo «progress_value» de tipo «number».
  progress_value: number;
  // Esta línea sirve para declarar el campo «completed» de tipo «boolean».
  completed: boolean;
  // Esta línea sirve para declarar el campo «is_viewer» de tipo «boolean».
  is_viewer: boolean;
}

// Esta línea sirve para declarar la interfaz «ChallengeLeaderboardResponse».
export interface ChallengeLeaderboardResponse {
  // Esta línea sirve para declarar el campo «challenge_id» de tipo «number».
  challenge_id: number;
  // Esta línea sirve para declarar el campo «entries» de tipo «ChallengeLeaderboardEntry[]».
  entries: ChallengeLeaderboardEntry[];
}

/** Payload del evento `progress.updated` transmitido por Reverb en el canal privado `challenges.{id}`. */
// Esta línea sirve para declarar la interfaz «ChallengeProgressBroadcast».
export interface ChallengeProgressBroadcast {
  // Esta línea sirve para declarar el campo «leaderboard» de tipo «ChallengeLeaderboardEntry[]».
  leaderboard: ChallengeLeaderboardEntry[];
}

/**
 * Plantilla editable desde admin (reemplaza el catálogo fijo que existía
 * antes) — GenerateChallengesAction crea una instancia de Challenge por
 * cada plantilla activa, cada semana/mes según `type`.
 */
// Esta línea sirve para declarar la interfaz «ChallengeTemplate».
export interface ChallengeTemplate {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «code» de tipo «string».
  code: string;
  // Esta línea sirve para declarar el campo «title» de tipo «string».
  title: string;
  // Esta línea sirve para declarar el campo «description» de tipo «string».
  description: string;
  // Esta línea sirve para declarar el campo «type» de tipo «ChallengeType».
  type: ChallengeType;
  // Esta línea sirve para declarar el campo «metric» de tipo «ChallengeMetric».
  metric: ChallengeMetric;
  // Esta línea sirve para declarar el campo «target» de tipo «number».
  target: number;
  // Esta línea sirve para declarar el campo «is_active» de tipo «boolean».
  is_active: boolean;
  // Esta línea sirve para declarar el campo «created_at» de tipo «string».
  created_at: string;
}

// Esta línea sirve para declarar la interfaz «ChallengeTemplatePayload».
export interface ChallengeTemplatePayload {
  // Esta línea sirve para declarar el campo «code» de tipo «string».
  code: string;
  // Esta línea sirve para declarar el campo «title» de tipo «string».
  title: string;
  // Esta línea sirve para declarar el campo «description» de tipo «string».
  description: string;
  // Esta línea sirve para declarar el campo «type» de tipo «ChallengeType».
  type: ChallengeType;
  // Esta línea sirve para declarar el campo «metric» de tipo «ChallengeMetric».
  metric: ChallengeMetric;
  // Esta línea sirve para declarar el campo «target» de tipo «number».
  target: number;
}
