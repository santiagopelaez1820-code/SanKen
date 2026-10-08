// Esta línea sirve para importar el tipo de sesión de entrenamiento.
import type { WorkoutSession } from '../types/workout';

// Esta línea sirve para declarar los estados posibles de una sesión.
export type WorkoutSessionStatus = 'completed' | 'cancelled' | 'skipped' | 'active';

/**
 * `WorkoutSession` no trae un único campo `status` -- son 3 booleans
 * independientes (`completed`/`cancelled`/`skipped`). Nada en el backend
 * impide que una sesión abandonada (app cerrada a mitad de entrenamiento)
 * quede para siempre con los 3 en false, así que "active" acá NO garantiza
 * que el usuario la esté entrenando ahora mismo -- solo que nunca se marcó
 * como terminada de ninguna forma.
 */
// Esta línea sirve para declarar la función que deduce el estado de una sesión.
export function getWorkoutSessionStatus(
  // Esta línea sirve para recibir los indicadores de completada, cancelada y omitida.
  session: Pick<WorkoutSession, 'completed' | 'cancelled' | 'skipped'>,
// Esta línea sirve para devolver el estado de la sesión.
): WorkoutSessionStatus {
  // Esta línea sirve para devolver completada si terminó.
  if (session.completed) return 'completed';
  // Esta línea sirve para devolver cancelada si se canceló.
  if (session.cancelled) return 'cancelled';
  // Esta línea sirve para devolver omitida si se omitió.
  if (session.skipped) return 'skipped';
  // Esta línea sirve para devolver activa si ninguna de las anteriores aplica.
  return 'active';
}

// Esta línea sirve para declarar la etiqueta de cada estado de sesión.
export const WORKOUT_SESSION_STATUS_LABEL: Record<WorkoutSessionStatus, string> = {
  // Esta línea sirve para definir la etiqueta de completada.
  completed: 'Completada',
  // Esta línea sirve para definir la etiqueta de cancelada.
  cancelled: 'Cancelada',
  // Esta línea sirve para definir la etiqueta de omitida.
  skipped: 'Omitida',
  // Esta línea sirve para definir la etiqueta de en curso.
  active: 'En curso',
};
