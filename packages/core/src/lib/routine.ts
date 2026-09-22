import type { DailyLock, Routine, RoutineDay } from '../types/routine';

/**
 * Resuelve qué día de la rutina activa corresponde entrenar hoy, usando el
 * `next_day_id` que devuelve `GET /routines/active` en `meta`. Si no hay
 * match (o no hay `nextDayId`), cae al primer día de la rutina.
 */
export function findNextDay(routine: Routine | null, nextDayId: number | null): RoutineDay | null {
  if (!routine || nextDayId === null) return null;
  return routine.days.find((d) => d.id === nextDayId) ?? routine.days[0] ?? null;
}

const UNLOCKED: DailyLock = { locked: false, unlocks_at: null, reason: null };

/**
 * Lee `meta.daily_lock` de `GET /routines/active` de forma segura (meta es
 * `Record<string, unknown>` sin tipar). Si el campo no viene (backend viejo,
 * respuesta inesperada) cae a "desbloqueado" — nunca al revés: un dato
 * ausente no debe trabar a nadie por un bug de parseo del lado del cliente.
 */
export function parseDailyLock(meta: Record<string, unknown> | undefined): DailyLock {
  const raw = meta?.daily_lock as Partial<DailyLock> | undefined;
  if (!raw) return UNLOCKED;
  return {
    locked: raw.locked ?? false,
    unlocks_at: raw.unlocks_at ?? null,
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
export function formatUnlockCountdown(unlocksAt: string | null, now: Date = new Date()): string | null {
  if (!unlocksAt) return null;
  const diffMs = new Date(unlocksAt).getTime() - now.getTime();
  if (diffMs <= 0) return null;

  const totalMinutes = Math.ceil(diffMs / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
}

/** Estima la duración de un día (minutos), con un piso de 15 min. */
export function estimateWorkoutMinutes(day: RoutineDay | null): number {
  if (!day) return 0;
  const seconds = day.exercises.reduce((acc, e) => acc + e.target_sets * (45 + e.rest_seconds), 0);
  return Math.max(15, Math.round(seconds / 60));
}
