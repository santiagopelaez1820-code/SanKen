// Esta línea sirve para importar «describe, expect, it» desde «@jest/globals».
import { describe, expect, it } from '@jest/globals';

// Esta línea sirve para importar «LOGO_K, LOGO_S, LOGO_VIEWBOX» desde «@sanken/core».
import { LOGO_K, LOGO_S, LOGO_VIEWBOX } from '@sanken/core';

// Esta línea sirve para agrupar las pruebas de «geometría del isotipo SK (intro de marca)».
describe('geometría del isotipo SK (intro de marca)', () => {
  // Esta línea sirve para probar cada trazo del logo.
  it.each([
    // Esta línea sirve para incluir el trazo de la S.
    ['S', LOGO_S],
    // Esta línea sirve para incluir el trazo de la K.
    ['K', LOGO_K],
  // Esta línea sirve para verificar que cada trazo es una polilínea cerrada con longitud consistente.
  ])('%s es una polilínea cerrada con longitud acumulada consistente', (_name, stroke) => {
    // Esta línea sirve para extraer «irs» de «stroke.points[0]».
    const first = stroke.points[0];
    // Esta línea sirve para extraer «as» de «stroke.points[stroke.points.length - 1]».
    const last = stroke.points[stroke.points.length - 1];
    // Esta línea sirve para verificar que «last» cumple «toEqual».
    expect(last).toEqual(first);
    // Esta línea sirve para verificar que «stroke.cumulative» cumple «toHaveLength».
    expect(stroke.cumulative).toHaveLength(stroke.points.length);
    // Esta línea sirve para verificar que «stroke.cumulative[0]» cumple «toBe».
    expect(stroke.cumulative[0]).toBe(0);
    // Esta línea sirve para recorrer los elementos con «let i = 1; i < stroke.cumulative.length; i++».
    for (let i = 1; i < stroke.cumulative.length; i++) {
      // Esta línea sirve para verificar que «stroke.cumulative[i]» cumple «toBeGreaterThanOrEqual».
      expect(stroke.cumulative[i]).toBeGreaterThanOrEqual(stroke.cumulative[i - 1]);
    }
    // Esta línea sirve para verificar que «stroke.length» cumple «toBeGreaterThan».
    expect(stroke.length).toBeGreaterThan(100);
  });

  // Esta línea sirve para declarar la prueba que verifica que «todo el contorno cae dentro del recorte que usa la intro».
  it('todo el contorno cae dentro del recorte que usa la intro', () => {
    // Esta línea sirve para recorrer los elementos con «const [x, y] of [...LOGO_S.points, ...LOGO_K.points]».
    for (const [x, y] of [...LOGO_S.points, ...LOGO_K.points]) {
      // Esta línea sirve para verificar que «x» cumple «toBeGreaterThanOrEqual».
      expect(x).toBeGreaterThanOrEqual(LOGO_VIEWBOX.x);
      // Esta línea sirve para verificar que «x» cumple «toBeLessThanOrEqual».
      expect(x).toBeLessThanOrEqual(LOGO_VIEWBOX.x + LOGO_VIEWBOX.width);
      // Esta línea sirve para verificar que «y» cumple «toBeGreaterThanOrEqual».
      expect(y).toBeGreaterThanOrEqual(LOGO_VIEWBOX.y);
      // Esta línea sirve para verificar que «y» cumple «toBeLessThanOrEqual».
      expect(y).toBeLessThanOrEqual(LOGO_VIEWBOX.y + LOGO_VIEWBOX.height);
    }
  });
});
