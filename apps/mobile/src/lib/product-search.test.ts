import { describe, expect, it } from '@jest/globals';
import type { Product, ProductCategory } from '@sanken/core';

import { filterProducts, normalizeSearchText } from './product-search';

const LABELS: Record<ProductCategory, string> = {
  protein: 'Proteínas',
  creatine: 'Creatinas',
  pre_workout: 'Pre-entrenos',
  amino_acids: 'Aminoácidos',
  vitamins: 'Vitaminas',
  other: 'Otros',
};

function product(id: number, overrides: Partial<Product>): Product {
  return {
    id,
    name: `Producto ${id}`,
    slug: `producto-${id}`,
    description: '',
    short_description: '',
    image: null,
    category: 'other',
    price: '10000.00',
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

const CATALOG: Product[] = [
  product(1, { name: 'Whey Protein Gold', short_description: 'Proteína de suero', category: 'protein' }),
  product(2, { name: 'Creatina Monohidratada', short_description: 'Fuerza y potencia', category: 'creatine' }),
  product(3, { name: 'Shaker SanKen', description: 'Vaso mezclador para tu batido de proteína', category: 'other' }),
  product(4, { name: 'Multivitamínico', short_description: 'Vitaminas diarias', category: 'vitamins' }),
];

const search = (query: string, category: ProductCategory | null = null) =>
  filterProducts(CATALOG, { query, category, categoryLabels: LABELS }).map((p) => p.id);

describe('normalizeSearchText', () => {
  it('quita tildes, mayúsculas y espacios de los extremos', () => {
    expect(normalizeSearchText('  Proteína ÁCIDA ')).toBe('proteina acida');
  });
});

describe('filterProducts', () => {
  it('sin búsqueda ni categoría devuelve todo el catálogo', () => {
    expect(search('')).toEqual([1, 2, 3, 4]);
    expect(search('   ')).toEqual([1, 2, 3, 4]);
  });

  it('busca por nombre sin importar mayúsculas ni tildes', () => {
    expect(search('WHEY')).toEqual([1]);
    expect(search('multivitaminico')).toEqual([4]);
  });

  it('busca también en la descripción corta y la larga', () => {
    expect(search('potencia')).toEqual([2]);
    expect(search('mezclador')).toEqual([3]);
  });

  it('busca por la etiqueta visible de la categoría', () => {
    expect(search('creatinas')).toEqual([2]);
  });

  it('exige que todas las palabras coincidan', () => {
    expect(search('proteina')).toEqual([1, 3]);
    expect(search('proteina suero')).toEqual([1]);
  });

  it('se combina con la categoría elegida', () => {
    expect(search('proteina', 'other')).toEqual([3]);
    expect(search('', 'vitamins')).toEqual([4]);
  });

  it('devuelve vacío cuando nada coincide', () => {
    expect(search('bicicleta')).toEqual([]);
  });
});
