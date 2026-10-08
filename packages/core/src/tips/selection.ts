// Esta línea sirve para importar las categorías, los consejos y el tipo de consejo.
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
// Esta línea sirve para declarar el generador pseudoaleatorio determinista mulberry32.
function mulberry32(seed: number): () => number {
  // Esta línea sirve para convertir la semilla en entero sin signo.
  let state = seed >>> 0;
  // Esta línea sirve para devolver la función que genera cada número.
  return () => {
    // Esta línea sirve para avanzar el estado interno.
    state = (state + 0x6d2b79f5) >>> 0;
    // Esta línea sirve para copiar el estado a una variable temporal.
    let t = state;
    // Esta línea sirve para mezclar los bits de la variable.
    t = Math.imul(t ^ (t >>> 15), t | 1);
    // Esta línea sirve para mezclar de nuevo con operaciones XOR.
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    // Esta línea sirve para devolver un número entre 0 y 1.
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Esta línea sirve para declarar la función que baraja una lista con un generador dado.
function shuffled<T>(items: readonly T[], random: () => number): T[] {
  // Esta línea sirve para copiar la lista para no modificar la original.
  const result = [...items];
  // Esta línea sirve para recorrer la lista desde el final.
  for (let i = result.length - 1; i > 0; i--) {
    // Esta línea sirve para elegir una posición aleatoria anterior.
    const j = Math.floor(random() * (i + 1));
    // Esta línea sirve para intercambiar los dos elementos.
    [result[i], result[j]] = [result[j], result[i]];
  }
  // Esta línea sirve para devolver la lista barajada.
  return result;
}

/** Semilla fija: cambiarla reordena el ciclo para todos los usuarios. */
// Esta línea sirve para definir la semilla fija para que el ciclo sea igual en todos los dispositivos.
const CYCLE_SEED = 20261001;

// Esta línea sirve para declarar la función que construye el ciclo completo de consejos.
export function buildDailyTipCycle(tips: readonly DailyTip[] = DAILY_TIPS): DailyTip[] {
  // Esta línea sirve para crear el generador con la semilla fija.
  const random = mulberry32(CYCLE_SEED);
  // Esta línea sirve para crear una cola de consejos por categoría.
  const queues = new Map(
    // Esta línea sirve para recorrer cada categoría.
    DAILY_TIP_CATEGORIES.map((category) => [
      // Esta línea sirve para usar la categoría como clave de la cola.
      category,
      // Esta línea sirve para barajar los consejos de la categoría.
      shuffled(
        // Esta línea sirve para filtrar los consejos de esa categoría.
        tips.filter((tip) => tip.category === category),
        // Esta línea sirve para usar el generador determinista.
        random,
      ),
    ]),
  );

  // Esta línea sirve para crear la lista del ciclo.
  const cycle: DailyTip[] = [];
  // Esta línea sirve para repetir hasta incluir todos los consejos.
  while (cycle.length < tips.length) {
    // Esta línea sirve para obtener las categorías que todavía tienen consejos.
    const available = DAILY_TIP_CATEGORIES.filter((category) => (queues.get(category)?.length ?? 0) > 0);
    // Esta línea sirve para barajar el orden de las categorías de esta ronda.
    const round = shuffled(available, random);
    // Evita repetir categoría en el borde entre una ronda y la siguiente.
    // Esta línea sirve para obtener la categoría del último consejo agregado.
    const previous = cycle[cycle.length - 1]?.category;
    // Esta línea sirve para revisar si la ronda empezaría con la misma categoría.
    if (round.length > 1 && round[0] === previous) {
      // Esta línea sirve para intercambiar las dos primeras categorías para no repetir.
      [round[0], round[1]] = [round[1], round[0]];
    }
    // Esta línea sirve para recorrer las categorías de la ronda.
    for (const category of round) {
      // Esta línea sirve para sacar el siguiente consejo de la categoría y agregarlo.
      cycle.push(queues.get(category)!.shift()!);
    }
  }

  // Al dar la vuelta, el último día del ciclo precede al primero: tampoco
  // deben compartir categoría.
  // Esta línea sirve para obtener la posición del último consejo.
  const last = cycle.length - 1;
  // Esta línea sirve para revisar si el ciclo cerraría con la categoría con la que empieza.
  if (cycle.length > 2 && cycle[last].category === cycle[0].category) {
    // Esta línea sirve para elegir el consejo anterior para intercambiar.
    const swapWith = last - 1;
    // Esta línea sirve para intercambiar para que el ciclo no repita categoría al reiniciar.
    [cycle[last], cycle[swapWith]] = [cycle[swapWith], cycle[last]];
  }

  // Esta línea sirve para devolver el ciclo completo.
  return cycle;
}

// Esta línea sirve para declarar el caché del ciclo para calcularlo una sola vez.
let cachedCycle: DailyTip[] | null = null;

/**
 * Número de día según el calendario LOCAL (año/mes/día del dispositivo),
 * inmune a horario de verano: dos instantes del mismo día local siempre dan
 * el mismo número, y días consecutivos dan números consecutivos.
 */
// Esta línea sirve para declarar la función que cuenta los días locales desde 1970.
export function localDayNumber(date: Date): number {
  // Esta línea sirve para devolver los días transcurridos usando la fecha local como UTC.
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

/** Clave del día local ("2026-10-01") — útil para saber cuándo recalcular. */
// Esta línea sirve para declarar la función que crea la clave de fecha local AAAA-MM-DD.
export function localDayKey(date: Date): string {
  // Esta línea sirve para formatear el mes con dos dígitos.
  const month = String(date.getMonth() + 1).padStart(2, '0');
  // Esta línea sirve para formatear el día con dos dígitos.
  const day = String(date.getDate()).padStart(2, '0');
  // Esta línea sirve para devolver la clave de fecha.
  return `${date.getFullYear()}-${month}-${day}`;
}

// Esta línea sirve para declarar la función que devuelve el consejo del día.
export function getDailyTip(date: Date = new Date()): DailyTip {
  // Esta línea sirve para construir el ciclo si todavía no existe.
  cachedCycle ??= buildDailyTipCycle();
  // Esta línea sirve para calcular la posición del día dentro del ciclo, también para fechas anteriores a 1970.
  const index = ((localDayNumber(date) % cachedCycle.length) + cachedCycle.length) % cachedCycle.length;
  // Esta línea sirve para devolver el consejo de esa posición.
  return cachedCycle[index];
}
