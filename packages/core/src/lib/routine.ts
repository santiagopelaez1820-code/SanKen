// Esta línea sirve para importar los tipos de rutina.
import type { DailyLock, Routine, RoutineDay } from '../types/routine';

/**
 * Resuelve qué día de la rutina activa corresponde entrenar hoy, usando el
 * `next_day_id` que devuelve `GET /routines/active` en `meta`. Si no hay
 * match (o no hay `nextDayId`), cae al primer día de la rutina.
 */
// Esta línea sirve para declarar la función que busca el siguiente día de entrenamiento.
export function findNextDay(routine: Routine | null, nextDayId: number | null): RoutineDay | null {
  // Esta línea sirve para devolver null si no hay rutina o siguiente día.
  if (!routine || nextDayId === null) return null;
  // Esta línea sirve para devolver el día pedido o el primero de la rutina.
  return routine.days.find((d) => d.id === nextDayId) ?? routine.days[0] ?? null;
}

// Esta línea sirve para definir el estado por defecto de rutina desbloqueada.
const UNLOCKED: DailyLock = { locked: false, unlocks_at: null, reason: null };

/**
 * Lee `meta.daily_lock` de `GET /routines/active` de forma segura (meta es
 * `Record<string, unknown>` sin tipar). Si el campo no viene (backend viejo,
 * respuesta inesperada) cae a "desbloqueado" — nunca al revés: un dato
 * ausente no debe trabar a nadie por un bug de parseo del lado del cliente.
 */
// Esta línea sirve para declarar la función que lee el bloqueo diario desde la metadata.
export function parseDailyLock(meta: Record<string, unknown> | undefined): DailyLock {
  // Esta línea sirve para obtener el bloqueo enviado por la API.
  const raw = meta?.daily_lock as Partial<DailyLock> | undefined;
  // Esta línea sirve para devolver desbloqueado si no hay datos.
  if (!raw) return UNLOCKED;
  // Esta línea sirve para devolver el bloqueo normalizado.
  return {
    // Esta línea sirve para indicar si está bloqueado.
    locked: raw.locked ?? false,
    // Esta línea sirve para indicar cuándo se desbloquea.
    unlocks_at: raw.unlocks_at ?? null,
    // Esta línea sirve para indicar el motivo del bloqueo.
    reason: raw.reason ?? null,
  };
}

/**
 * Formatea el tiempo restante hasta `unlocksAt` como "03h 25m". Puramente
 * visual -- quien decide si el entrenamiento está disponible es siempre
 * `daily_lock.locked` (backend), nunca este cálculo del lado del cliente.
 * Devuelve null si ya pasó (la UI debería estar re-consultando el backend
 * en ese punto, no confiando en que el conteo llegó a cero).
 */
// Esta línea sirve para declarar la función que calcula la cuenta regresiva de desbloqueo.
export function formatUnlockCountdown(unlocksAt: string | null, now: Date = new Date()): string | null {
  // Esta línea sirve para devolver null si no hay fecha de desbloqueo.
  if (!unlocksAt) return null;
  // Esta línea sirve para calcular los milisegundos que faltan.
  const diffMs = new Date(unlocksAt).getTime() - now.getTime();
  // Esta línea sirve para devolver null si el tiempo ya pasó.
  if (diffMs <= 0) return null;

  // Esta línea sirve para calcular los minutos totales redondeando hacia arriba.
  const totalMinutes = Math.ceil(diffMs / 60_000);
  // Esta línea sirve para calcular las horas completas.
  const hours = Math.floor(totalMinutes / 60);
  // Esta línea sirve para calcular los minutos restantes.
  const minutes = totalMinutes % 60;
  // Esta línea sirve para devolver el texto con horas y minutos de dos dígitos.
  return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
}

/** Estima la duración de un día (minutos), con un piso de 15 min. */
// Esta línea sirve para declarar la función que estima la duración de un entrenamiento.
export function estimateWorkoutMinutes(day: RoutineDay | null): number {
  // Esta línea sirve para devolver cero si no hay día.
  if (!day) return 0;
  // Esta línea sirve para sumar el tiempo de series y descansos de cada ejercicio.
  const seconds = day.exercises.reduce((acc, e) => acc + e.target_sets * (45 + e.rest_seconds), 0);
  // Esta línea sirve para devolver los minutos, con un mínimo de 15.
  return Math.max(15, Math.round(seconds / 60));
}
