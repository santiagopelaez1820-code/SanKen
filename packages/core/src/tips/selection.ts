import { DAILY_TIP_CATEGORIES, DAILY_TIPS, type DailyTip } from './collection';

/**
 * Selección del "Consejo del día" — determinista, sin estado ni red:
 *
 * 1. La colección se ordena UNA vez en un ciclo fijo (ver buildCycle): se
 *    intercalan las categorías en rondas, con el orden de cada ronda y el de
 *    los consejos dentro de cada categoría barajados con una semilla fija.
 * 2. Cada día local toma la posición `díaNúmero % largo del ciclo`.
 *
 * Consecuencias que el Home necesita:
 * - El mismo día siempre da el mismo consejo (abrir/cerrar la app no lo
 *   cambia) y no hace falta guardar nada en el dispositivo.
 * - Un consejo no se repite hasta recorrer la colección completa (104 días).
 * - Dos días seguidos nunca comparten categoría, ni siquiera al dar la
 *   vuelta del ciclo.
 * - Cambia a medianoche según la hora LOCAL del dispositivo, no UTC.
 */

/** PRNG mulberry32: pequeño, rápido y reproducible a partir de una semilla. */
function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Semilla fija: cambiarla reordena el ciclo para todos los usuarios. */
const CYCLE_SEED = 20261001;

export function buildDailyTipCycle(tips: readonly DailyTip[] = DAILY_TIPS): DailyTip[] {
  const random = mulberry32(CYCLE_SEED);
  const queues = new Map(
    DAILY_TIP_CATEGORIES.map((category) => [
      category,
      shuffled(
        tips.filter((tip) => tip.category === category),
        random,
      ),
    ]),
  );

  const cycle: DailyTip[] = [];
  while (cycle.length < tips.length) {
    const available = DAILY_TIP_CATEGORIES.filter((category) => (queues.get(category)?.length ?? 0) > 0);
    const round = shuffled(available, random);
    // Evita repetir categoría en el borde entre una ronda y la siguiente.
    const previous = cycle[cycle.length - 1]?.category;
    if (round.length > 1 && round[0] === previous) {
      [round[0], round[1]] = [round[1], round[0]];
    }
    for (const category of round) {
      cycle.push(queues.get(category)!.shift()!);
    }
  }

  // Al dar la vuelta, el último día del ciclo precede al primero: tampoco
  // deben compartir categoría.
  const last = cycle.length - 1;
  if (cycle.length > 2 && cycle[last].category === cycle[0].category) {
    const swapWith = last - 1;
    [cycle[last], cycle[swapWith]] = [cycle[swapWith], cycle[last]];
  }

  return cycle;
}

let cachedCycle: DailyTip[] | null = null;

/**
 * Número de día según el calendario LOCAL (año/mes/día del dispositivo),
 * inmune a horario de verano: dos instantes del mismo día local siempre dan
 * el mismo número, y días consecutivos dan números consecutivos.
 */
export function localDayNumber(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

/** Clave del día local ("2026-10-01") — útil para saber cuándo recalcular. */
export function localDayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function getDailyTip(date: Date = new Date()): DailyTip {
  cachedCycle ??= buildDailyTipCycle();
  const index = ((localDayNumber(date) % cachedCycle.length) + cachedCycle.length) % cachedCycle.length;
  return cachedCycle[index];
}
