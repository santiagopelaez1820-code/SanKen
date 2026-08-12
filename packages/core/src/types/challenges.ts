export type ChallengeType = 'weekly' | 'monthly';

export type ChallengeMetric = 'workouts_count' | 'total_volume_kg';

export interface ChallengeCriteria {
  metric: ChallengeMetric;
  target: number;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  type: ChallengeType;
  criteria: ChallengeCriteria;
  starts_at: string;
  ends_at: string;
  joined: boolean;
  progress_value: number | null;
  completed: boolean;
}

export interface ChallengeLeaderboardEntry {
  rank: number;
  user_id: number;
  user_name: string;
  progress_value: number;
  completed: boolean;
  is_viewer: boolean;
}

export interface ChallengeLeaderboardResponse {
  challenge_id: number;
  entries: ChallengeLeaderboardEntry[];
}

/** Payload del evento `progress.updated` transmitido por Reverb en el canal privado `challenges.{id}`. */
export interface ChallengeProgressBroadcast {
  leaderboard: ChallengeLeaderboardEntry[];
}
