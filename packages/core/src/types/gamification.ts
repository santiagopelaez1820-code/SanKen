// Esta línea sirve para declarar la interfaz «Achievement».
export interface Achievement {
  // Esta línea sirve para declarar el campo «code» de tipo «string».
  code: string;
  // Esta línea sirve para declarar el campo «name» de tipo «string».
  name: string;
  // Esta línea sirve para declarar el campo «description» de tipo «string».
  description: string;
  // Esta línea sirve para declarar el campo «xp_bonus» de tipo «number».
  xp_bonus: number;
  // Esta línea sirve para declarar el campo «unlocked» de tipo «boolean».
  unlocked: boolean;
  // Esta línea sirve para declarar el campo «achieved_at» de tipo «string | null».
  achieved_at: string | null;
}

// Esta línea sirve para declarar la interfaz «GamificationSummary».
export interface GamificationSummary {
  // Esta línea sirve para declarar el campo «total_xp» de tipo «number».
  total_xp: number;
  // Esta línea sirve para declarar el campo «level» de tipo «number».
  level: number;
  // Esta línea sirve para declarar el campo «xp_for_current_level» de tipo «number».
  xp_for_current_level: number;
  // Esta línea sirve para declarar el campo «xp_for_next_level» de tipo «number».
  xp_for_next_level: number;
  // Esta línea sirve para declarar el campo «progress_pct» de tipo «number».
  progress_pct: number;
  // Esta línea sirve para declarar el campo «unlocked_achievements» de tipo «Achievement[]».
  unlocked_achievements: Achievement[];
  // Esta línea sirve para declarar el campo «locked_achievements» de tipo «Achievement[]».
  locked_achievements: Achievement[];
}

// Esta línea sirve para declarar la interfaz «GamificationEventResult».
export interface GamificationEventResult {
  // Esta línea sirve para declarar el campo «xp_awarded» de tipo «number».
  xp_awarded: number;
  // Esta línea sirve para declarar el campo «leveled_up» de tipo «boolean».
  leveled_up: boolean;
  // Esta línea sirve para declarar el campo «new_level» de tipo «number».
  new_level: number;
  // Esta línea sirve para declarar el campo «achievements_unlocked» con los datos básicos de cada logro.
  achievements_unlocked: Pick<Achievement, 'code' | 'name' | 'description' | 'xp_bonus'>[];
}
