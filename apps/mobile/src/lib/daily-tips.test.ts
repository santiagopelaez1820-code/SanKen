// Esta línea sirve para importar «describe, expect, it» desde «@jest/globals».
import { describe, expect, it } from '@jest/globals';
// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «DAILY_TIP_CATEGORIES» en la lista.
  DAILY_TIP_CATEGORIES,
  // Esta línea sirve para incluir el valor «DAILY_TIPS» en la lista.
  DAILY_TIPS,
  // Esta línea sirve para incluir el valor «buildDailyTipCycle» en la lista.
  buildDailyTipCycle,
  // Esta línea sirve para incluir el valor «getDailyTip» en la lista.
  getDailyTip,
  // Esta línea sirve para incluir el valor «localDayKey» en la lista.
  localDayKey,
  // Esta línea sirve para incluir el valor «localDayNumber» en la lista.
  localDayNumber,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from '@sanken/core';

// Esta línea sirve para declarar «normalize» con el valor «(value: string) =>».
const normalize = (value: string) =>
  // Esta línea sirve para recibir el valor a comparar.
  value
    // Esta línea sirve para encadenar la operación «toLowerCase».
    .toLowerCase()
    // Esta línea sirve para encadenar la operación «normalize».
    .normalize('NFD')
    // Esta línea sirve para encadenar la operación «replace».
    .replace(/[̀-ͯ]/g, '')
    // Esta línea sirve para encadenar la operación «replace».
    .replace(/[^a-z0-9 ]/g, ' ')
    // Esta línea sirve para encadenar la operación «replace».
    .replace(/\s+/g, ' ')
    // Esta línea sirve para encadenar la operación «trim».
    .trim();

// Esta línea sirve para crear «STOPWORDS» llamando a «Set».
const STOPWORDS = new Set(
  // Esta línea sirve para incluir el texto o las clases «a al antes con de del desde el en es esa ese …».
  'a al antes con de del desde el en es esa ese esta este la las lo los mas mejor muy no o para pero por que se si sin su sus te tu un una y ya hace cada'.split(' '),
);

// Esta línea sirve para declarar la función «contentWords».
function contentWords(text: string): Set<string> {
  // Esta línea sirve para devolver «new Set(».
  return new Set(
    // Esta línea sirve para llamar a «normalize» con «text».
    normalize(text)
      // Esta línea sirve para encadenar la operación «split».
      .split(' ')
      // Esta línea sirve para encadenar la operación «filter».
      .filter((word) => word.length > 2 && !STOPWORDS.has(word)),
  );
}

// Esta línea sirve para declarar la función «jaccard».
function jaccard(a: Set<string>, b: Set<string>): number {
  // Esta línea sirve para extraer «ntersectio» de «[...a].filter((word) => b.has(word)).len».
  const intersection = [...a].filter((word) => b.has(word)).length;
  // Esta línea sirve para devolver «intersection / (a.size + b.size - intersection)».
  return intersection / (a.size + b.size - intersection);
}

/** Avanza `days` días de calendario local a una hora dada. */
// Esta línea sirve para declarar la función «localDate».
function localDate(year: number, monthIndex: number, day: number, hour = 12, minute = 0): Date {
  // Esta línea sirve para devolver «new Date(year, monthIndex, day, hour, minute)».
  return new Date(year, monthIndex, day, hour, minute);
}

// Esta línea sirve para agrupar las pruebas de «colección de consejos del día».
describe('colección de consejos del día', () => {
  // Esta línea sirve para declarar la prueba que verifica que «tiene al menos 100 consejos».
  it('tiene al menos 100 consejos', () => {
    // Esta línea sirve para verificar que «DAILY_TIPS.length» cumple «toBeGreaterThanOrEqual».
    expect(DAILY_TIPS.length).toBeGreaterThanOrEqual(100);
  });

  // Esta línea sirve para declarar la prueba que verifica que «no repite ids, títulos ni textos».
  it('no repite ids, títulos ni textos', () => {
    // Esta línea sirve para crear «ids» llamando a «DAILY_TIPS.map».
    const ids = DAILY_TIPS.map((tip) => tip.id);
    // Esta línea sirve para crear «titles» llamando a «DAILY_TIPS.map».
    const titles = DAILY_TIPS.map((tip) => normalize(tip.title));
    // Esta línea sirve para crear «texts» llamando a «DAILY_TIPS.map».
    const texts = DAILY_TIPS.map((tip) => normalize(tip.text));
    // Esta línea sirve para verificar que «new Set(ids» cumple «size».
    expect(new Set(ids).size).toBe(DAILY_TIPS.length);
    // Esta línea sirve para verificar que «new Set(titles» cumple «size».
    expect(new Set(titles).size).toBe(DAILY_TIPS.length);
    // Esta línea sirve para verificar que «new Set(texts» cumple «size».
    expect(new Set(texts).size).toBe(DAILY_TIPS.length);
  });

  // Esta línea sirve para declarar la prueba que verifica que «no tiene consejos que sean la misma idea reescrita».
  it('no tiene consejos que sean la misma idea reescrita', () => {
    // Esta línea sirve para crear «words» llamando a «DAILY_TIPS.map».
    const words = DAILY_TIPS.map((tip) => contentWords(`${tip.title} ${tip.text}`));
    // Esta línea sirve para extraer «ooSimilar: string[» de «[]».
    const tooSimilar: string[] = [];
    // Esta línea sirve para recorrer los elementos con «let i = 0; i < DAILY_TIPS.length; i++».
    for (let i = 0; i < DAILY_TIPS.length; i++) {
      // Esta línea sirve para recorrer los elementos con «let j = i + 1; j < DAILY_TIPS.length; j++».
      for (let j = i + 1; j < DAILY_TIPS.length; j++) {
        // Esta línea sirve para llamar a «tooSimilar.push» si «jaccard(words[i], words[j]) >= 0.3».
        if (jaccard(words[i], words[j]) >= 0.3) tooSimilar.push(`${DAILY_TIPS[i].id} ~ ${DAILY_TIPS[j].id}`);
      }
    }
    // Esta línea sirve para verificar que «tooSimilar» cumple «toEqual».
    expect(tooSimilar).toEqual([]);
  });

  // Esta línea sirve para declarar la prueba que verifica que «cubre todas las categorías con la misma cantidad de consejos».
  it('cubre todas las categorías con la misma cantidad de consejos', () => {
    // Esta línea sirve para crear «counts» llamando a «DAILY_TIP_CATEGORIES.map».
    const counts = DAILY_TIP_CATEGORIES.map((category) => DAILY_TIPS.filter((tip) => tip.category === category).length);
    // Esta línea sirve para verificar que «counts.every((count) => count > 0)» cumple «toBe».
    expect(counts.every((count) => count > 0)).toBe(true);
    // Esta línea sirve para verificar que «new Set(counts» cumple «size».
    expect(new Set(counts).size).toBe(1);
  });

  // Esta línea sirve para declarar la prueba que verifica que «mantiene los consejos breves (1–3 líneas en la tarjeta)».
  it('mantiene los consejos breves (1–3 líneas en la tarjeta)', () => {
    // Esta línea sirve para recorrer los elementos con «const tip of DAILY_TIPS».
    for (const tip of DAILY_TIPS) {
      // Esta línea sirve para verificar que «tip.title.length» cumple «toBeLessThanOrEqual».
      expect(tip.title.length).toBeLessThanOrEqual(40);
      // Esta línea sirve para verificar que «tip.text.length» cumple «toBeLessThanOrEqual».
      expect(tip.text.length).toBeLessThanOrEqual(180);
    }
  });

  // Esta línea sirve para declarar la prueba que verifica que «enlaza solo en una minoría de consejos».
  it('enlaza solo en una minoría de consejos', () => {
    // Esta línea sirve para crear «linked» llamando a «DAILY_TIPS.filter».
    const linked = DAILY_TIPS.filter((tip) => tip.link).length;
    // Esta línea sirve para verificar que «linked» cumple «toBeGreaterThan».
    expect(linked).toBeGreaterThan(0);
    // Esta línea sirve para verificar que «linked» cumple «toBeLessThan».
    expect(linked).toBeLessThan(DAILY_TIPS.length * 0.15);
  });
});

// Esta línea sirve para agrupar las pruebas de «selección del consejo del día».
describe('selección del consejo del día', () => {
  // Esta línea sirve para declarar la prueba que verifica que «el ciclo contiene cada consejo exactamente una vez».
  it('el ciclo contiene cada consejo exactamente una vez', () => {
    // Esta línea sirve para crear «cycle» llamando a «buildDailyTipCycle».
    const cycle = buildDailyTipCycle();
    // Esta línea sirve para verificar que «cycle» cumple «toHaveLength».
    expect(cycle).toHaveLength(DAILY_TIPS.length);
    // Esta línea sirve para verificar que «new Set(cycle.map((tip) => tip.id)» cumple «size».
    expect(new Set(cycle.map((tip) => tip.id)).size).toBe(DAILY_TIPS.length);
  });

  // Esta línea sirve para declarar la prueba que verifica que «es estable: construir el ciclo dos veces da el mismo orden».
  it('es estable: construir el ciclo dos veces da el mismo orden', () => {
    // Esta línea sirve para verificar que «buildDailyTipCycle(» cumple «map».
    expect(buildDailyTipCycle().map((tip) => tip.id)).toEqual(buildDailyTipCycle().map((tip) => tip.id));
  });

  // Esta línea sirve para declarar la prueba que verifica que «da el mismo consejo durante todo el día local».
  it('da el mismo consejo durante todo el día local', () => {
    // Esta línea sirve para crear «morning» llamando a «getDailyTip».
    const morning = getDailyTip(localDate(2026, 9, 1, 0, 1));
    // Esta línea sirve para crear «noon» llamando a «getDailyTip».
    const noon = getDailyTip(localDate(2026, 9, 1, 12, 0));
    // Esta línea sirve para crear «night» llamando a «getDailyTip».
    const night = getDailyTip(localDate(2026, 9, 1, 23, 59));
    // Esta línea sirve para verificar que «noon.id» cumple «toBe».
    expect(noon.id).toBe(morning.id);
    // Esta línea sirve para verificar que «night.id» cumple «toBe».
    expect(night.id).toBe(morning.id);
  });

  // Esta línea sirve para declarar la prueba que verifica que «cambia al día siguiente, también cruzando medianoche».
  it('cambia al día siguiente, también cruzando medianoche', () => {
    // Esta línea sirve para verificar que «getDailyTip(localDate(2026, 9, 2, 0, 0)).id» no cumple «toBe».
    expect(getDailyTip(localDate(2026, 9, 2, 0, 0)).id).not.toBe(getDailyTip(localDate(2026, 9, 1, 23, 59)).id);
  });

  // Esta línea sirve para declarar la prueba que verifica que «no repite un consejo hasta recorrer toda la colección».
  it('no repite un consejo hasta recorrer toda la colección', () => {
    // Esta línea sirve para extraer «ee» de «new Set<string>()».
    const seen = new Set<string>();
    // Esta línea sirve para recorrer los elementos con «let offset = 0; offset < DAILY_TIPS.length; offset++».
    for (let offset = 0; offset < DAILY_TIPS.length; offset++) {
      // Esta línea sirve para registrar el id del consejo de cada día.
      seen.add(getDailyTip(localDate(2026, 0, 1 + offset)).id);
    }
    // Esta línea sirve para verificar que «seen.size» cumple «toBe».
    expect(seen.size).toBe(DAILY_TIPS.length);
  });

  // Esta línea sirve para declarar la prueba que verifica que «nunca repite categoría dos días seguidos, ni al dar la vuelta al ciclo».
  it('nunca repite categoría dos días seguidos, ni al dar la vuelta al ciclo', () => {
    // Esta línea sirve para recorrer los elementos con «let offset = 0; offset < DAILY_TIPS.length * 2 + 5; offset++».
    for (let offset = 0; offset < DAILY_TIPS.length * 2 + 5; offset++) {
      // Esta línea sirve para crear «today» llamando a «getDailyTip».
      const today = getDailyTip(localDate(2026, 0, 1 + offset));
      // Esta línea sirve para crear «tomorrow» llamando a «getDailyTip».
      const tomorrow = getDailyTip(localDate(2026, 0, 2 + offset));
      // Esta línea sirve para verificar que «tomorrow.category» no cumple «toBe».
      expect(tomorrow.category).not.toBe(today.category);
    }
  });

  // Esta línea sirve para declarar la prueba que verifica que «numera los días locales de forma consecutiva (incluye cambios de mes y».
  it('numera los días locales de forma consecutiva (incluye cambios de mes y año)', () => {
    // Esta línea sirve para verificar que los días consecutivos avanzan en uno.
    expect(localDayNumber(localDate(2026, 11, 31, 23, 59)) + 1).toBe(localDayNumber(localDate(2027, 0, 1, 0, 0)));
    // Esta línea sirve para verificar que «localDayNumber(localDate(2026, 1, 28)) + 1» cumple «toBe».
    expect(localDayNumber(localDate(2026, 1, 28)) + 1).toBe(localDayNumber(localDate(2026, 2, 1)));
    // Esta línea sirve para verificar que «localDayKey(localDate(2026, 9, 1, 23, 59))» cumple «toBe».
    expect(localDayKey(localDate(2026, 9, 1, 23, 59))).toBe('2026-10-01');
  });

  // Esta línea sirve para declarar la prueba que verifica que «selecciona rápido (sin costo apreciable en el render del Home)».
  it('selecciona rápido (sin costo apreciable en el render del Home)', () => {
    // Esta línea sirve para crear «start» llamando a «Date.now».
    const start = Date.now();
    // Esta línea sirve para recorrer 10 000 días para comprobar que siempre hay consejo.
    for (let i = 0; i < 10_000; i++) getDailyTip(localDate(2026, 0, 1 + (i % 365)));
    // Esta línea sirve para verificar que «Date.now() - start» cumple «toBeLessThan».
    expect(Date.now() - start).toBeLessThan(500);
  });
});
