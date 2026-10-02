import { describe, expect, it } from '@jest/globals';
import {
  DAILY_TIP_CATEGORIES,
  DAILY_TIPS,
  buildDailyTipCycle,
  getDailyTip,
  localDayKey,
  localDayNumber,
} from '@sanken/core';

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const STOPWORDS = new Set(
  'a al antes con de del desde el en es esa ese esta este la las lo los mas mejor muy no o para pero por que se si sin su sus te tu un una y ya hace cada'.split(' '),
);

function contentWords(text: string): Set<string> {
  return new Set(
    normalize(text)
      .split(' ')
      .filter((word) => word.length > 2 && !STOPWORDS.has(word)),
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  const intersection = [...a].filter((word) => b.has(word)).length;
  return intersection / (a.size + b.size - intersection);
}

/** Avanza `days` días de calendario local a una hora dada. */
function localDate(year: number, monthIndex: number, day: number, hour = 12, minute = 0): Date {
  return new Date(year, monthIndex, day, hour, minute);
}

describe('colección de consejos del día', () => {
  it('tiene al menos 100 consejos', () => {
    expect(DAILY_TIPS.length).toBeGreaterThanOrEqual(100);
  });

  it('no repite ids, títulos ni textos', () => {
    const ids = DAILY_TIPS.map((tip) => tip.id);
    const titles = DAILY_TIPS.map((tip) => normalize(tip.title));
    const texts = DAILY_TIPS.map((tip) => normalize(tip.text));
    expect(new Set(ids).size).toBe(DAILY_TIPS.length);
    expect(new Set(titles).size).toBe(DAILY_TIPS.length);
    expect(new Set(texts).size).toBe(DAILY_TIPS.length);
  });

  it('no tiene consejos que sean la misma idea reescrita', () => {
    const words = DAILY_TIPS.map((tip) => contentWords(`${tip.title} ${tip.text}`));
    const tooSimilar: string[] = [];
    for (let i = 0; i < DAILY_TIPS.length; i++) {
      for (let j = i + 1; j < DAILY_TIPS.length; j++) {
        if (jaccard(words[i], words[j]) >= 0.3) tooSimilar.push(`${DAILY_TIPS[i].id} ~ ${DAILY_TIPS[j].id}`);
      }
    }
    expect(tooSimilar).toEqual([]);
  });

  it('cubre todas las categorías con la misma cantidad de consejos', () => {
    const counts = DAILY_TIP_CATEGORIES.map((category) => DAILY_TIPS.filter((tip) => tip.category === category).length);
    expect(counts.every((count) => count > 0)).toBe(true);
    expect(new Set(counts).size).toBe(1);
  });

  it('mantiene los consejos breves (1–3 líneas en la tarjeta)', () => {
    for (const tip of DAILY_TIPS) {
      expect(tip.title.length).toBeLessThanOrEqual(40);
      expect(tip.text.length).toBeLessThanOrEqual(180);
    }
  });

  it('enlaza solo en una minoría de consejos', () => {
    const linked = DAILY_TIPS.filter((tip) => tip.link).length;
    expect(linked).toBeGreaterThan(0);
    expect(linked).toBeLessThan(DAILY_TIPS.length * 0.15);
  });
});

describe('selección del consejo del día', () => {
  it('el ciclo contiene cada consejo exactamente una vez', () => {
    const cycle = buildDailyTipCycle();
    expect(cycle).toHaveLength(DAILY_TIPS.length);
    expect(new Set(cycle.map((tip) => tip.id)).size).toBe(DAILY_TIPS.length);
  });

  it('es estable: construir el ciclo dos veces da el mismo orden', () => {
    expect(buildDailyTipCycle().map((tip) => tip.id)).toEqual(buildDailyTipCycle().map((tip) => tip.id));
  });

  it('da el mismo consejo durante todo el día local', () => {
    const morning = getDailyTip(localDate(2026, 9, 1, 0, 1));
    const noon = getDailyTip(localDate(2026, 9, 1, 12, 0));
    const night = getDailyTip(localDate(2026, 9, 1, 23, 59));
    expect(noon.id).toBe(morning.id);
    expect(night.id).toBe(morning.id);
  });

  it('cambia al día siguiente, también cruzando medianoche', () => {
    expect(getDailyTip(localDate(2026, 9, 2, 0, 0)).id).not.toBe(getDailyTip(localDate(2026, 9, 1, 23, 59)).id);
  });

  it('no repite un consejo hasta recorrer toda la colección', () => {
    const seen = new Set<string>();
    for (let offset = 0; offset < DAILY_TIPS.length; offset++) {
      seen.add(getDailyTip(localDate(2026, 0, 1 + offset)).id);
    }
    expect(seen.size).toBe(DAILY_TIPS.length);
  });

  it('nunca repite categoría dos días seguidos, ni al dar la vuelta al ciclo', () => {
    for (let offset = 0; offset < DAILY_TIPS.length * 2 + 5; offset++) {
      const today = getDailyTip(localDate(2026, 0, 1 + offset));
      const tomorrow = getDailyTip(localDate(2026, 0, 2 + offset));
      expect(tomorrow.category).not.toBe(today.category);
    }
  });

  it('numera los días locales de forma consecutiva (incluye cambios de mes y año)', () => {
    expect(localDayNumber(localDate(2026, 11, 31, 23, 59)) + 1).toBe(localDayNumber(localDate(2027, 0, 1, 0, 0)));
    expect(localDayNumber(localDate(2026, 1, 28)) + 1).toBe(localDayNumber(localDate(2026, 2, 1)));
    expect(localDayKey(localDate(2026, 9, 1, 23, 59))).toBe('2026-10-01');
  });

  it('selecciona rápido (sin costo apreciable en el render del Home)', () => {
    const start = Date.now();
    for (let i = 0; i < 10_000; i++) getDailyTip(localDate(2026, 0, 1 + (i % 365)));
    expect(Date.now() - start).toBeLessThan(500);
  });
});
