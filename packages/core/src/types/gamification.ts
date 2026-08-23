export interface Achievement {
  code: string;
  name: string;
  description: string;
  xp_bonus: number;
  unlocked: boolean;
  achieved_at: string | null;
}

export interface GamificationSummary {
  total_xp: number;
  level: number;
  xp_for_current_level: number;
  xp_for_next_level: number;
  progress_pct: number;
  unlocked_achievements: Achievement[];
  locked_achievements: Achievement[];
}

export interface GamificationEventResult {
  xp_awarded: number;
  leveled_up: boolean;
  new_level: number;
  achievements_unlocked: Pick<Achievement, 'code' | 'name' | 'description' | 'xp_bonus'>[];
}
