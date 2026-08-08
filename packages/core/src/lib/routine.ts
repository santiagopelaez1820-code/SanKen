import type { Routine, RoutineDay } from '../types/routine';

/**
 * Resuelve qué día de la rutina activa corresponde entrenar hoy, usando el
 * `next_day_id` que devuelve `GET /routines/active` en `meta`. Si no hay
 * match (o no hay `nextDayId`), cae al primer día de la rutina.
 */
export function findNextDay(routine: Routine | null, nextDayId: number | null): RoutineDay | null {
  if (!routine || nextDayId === null) return null;
  return routine.days.find((d) => d.id === nextDayId) ?? routine.days[0] ?? null;
}

/** Estima la duración de un día (minutos), con un piso de 15 min. */
export function estimateWorkoutMinutes(day: RoutineDay | null): number {
  if (!day) return 0;
  const seconds = day.exercises.reduce((acc, e) => acc + e.target_sets * (45 + e.rest_seconds), 0);
  return Math.max(15, Math.round(seconds / 60));
}
