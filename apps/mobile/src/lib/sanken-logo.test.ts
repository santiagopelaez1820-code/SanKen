import { describe, expect, it } from '@jest/globals';

import { LOGO_K, LOGO_S, LOGO_VIEWBOX } from '@sanken/core';

describe('geometría del isotipo SK (intro de marca)', () => {
  it.each([
    ['S', LOGO_S],
    ['K', LOGO_K],
  ])('%s es una polilínea cerrada con longitud acumulada consistente', (_name, stroke) => {
    const first = stroke.points[0];
    const last = stroke.points[stroke.points.length - 1];
    expect(last).toEqual(first);
    expect(stroke.cumulative).toHaveLength(stroke.points.length);
    expect(stroke.cumulative[0]).toBe(0);
    for (let i = 1; i < stroke.cumulative.length; i++) {
      expect(stroke.cumulative[i]).toBeGreaterThanOrEqual(stroke.cumulative[i - 1]);
    }
    expect(stroke.length).toBeGreaterThan(100);
  });

  it('todo el contorno cae dentro del recorte que usa la intro', () => {
    for (const [x, y] of [...LOGO_S.points, ...LOGO_K.points]) {
      expect(x).toBeGreaterThanOrEqual(LOGO_VIEWBOX.x);
      expect(x).toBeLessThanOrEqual(LOGO_VIEWBOX.x + LOGO_VIEWBOX.width);
      expect(y).toBeGreaterThanOrEqual(LOGO_VIEWBOX.y);
      expect(y).toBeLessThanOrEqual(LOGO_VIEWBOX.y + LOGO_VIEWBOX.height);
    }
  });
});
