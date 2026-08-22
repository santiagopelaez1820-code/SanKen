import type { WorkoutSession } from '../types/workout';

export type WorkoutSessionStatus = 'completed' | 'cancelled' | 'skipped' | 'active';

/**
 * `WorkoutSession` no trae un único campo `status` -- son 3 booleans
 * independientes (`completed`/`cancelled`/`skipped`). Nada en el backend
 * impide que una sesión abandonada (app cerrada a mitad de entrenamiento)
 * quede para siempre con los 3 en false, así que "active" acá NO garantiza
 * que el usuario la esté entrenando ahora mismo -- solo que nunca se marcó
 * como terminada de ninguna forma.
 */
export function getWorkoutSessionStatus(
  session: Pick<WorkoutSession, 'completed' | 'cancelled' | 'skipped'>,
): WorkoutSessionStatus {
  if (session.completed) return 'completed';
  if (session.cancelled) return 'cancelled';
  if (session.skipped) return 'skipped';
  return 'active';
}

export const WORKOUT_SESSION_STATUS_LABEL: Record<WorkoutSessionStatus, string> = {
  completed: 'Completada',
  cancelled: 'Cancelada',
  skipped: 'Omitida',
  active: 'En curso',
};
