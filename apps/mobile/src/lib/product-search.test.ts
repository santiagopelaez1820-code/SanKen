// Esta línea sirve para importar «describe, expect, it» desde «@jest/globals».
import { describe, expect, it } from '@jest/globals';
// Esta línea sirve para importar los tipos «Product, ProductCategory» desde «@sanken/core».
import type { Product, ProductCategory } from '@sanken/core';

// Esta línea sirve para importar «filterProducts, normalizeSearchText» desde «./product-search».
import { filterProducts, normalizeSearchText } from './product-search';

// Esta línea sirve para declarar «LABELS» con el valor «{».
const LABELS: Record<ProductCategory, string> = {
  // Esta línea sirve para declarar la propiedad «protein» con el valor o tipo «'Proteínas'».
  protein: 'Proteínas',
  // Esta línea sirve para declarar la propiedad «creatine» con el valor o tipo «'Creatinas'».
  creatine: 'Creatinas',
  // Esta línea sirve para declarar la propiedad «pre_workout» con el valor o tipo «'Pre-entrenos'».
  pre_workout: 'Pre-entrenos',
  // Esta línea sirve para declarar la propiedad «amino_acids» con el valor o tipo «'Aminoácidos'».
  amino_acids: 'Aminoácidos',
  // Esta línea sirve para declarar la propiedad «vitamins» con el valor o tipo «'Vitaminas'».
  vitamins: 'Vitaminas',
  // Esta línea sirve para declarar la propiedad «other» con el valor o tipo «'Otros'».
  other: 'Otros',
};

// Esta línea sirve para declarar la función «product».
function product(id: number, overrides: Partial<Product>): Product {
  // Esta línea sirve para devolver «{».
  return {
    // Esta línea sirve para incluir el valor «id» en la lista.
    id,
    // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «`Producto ${id}`».
    name: `Producto ${id}`,
    // Esta línea sirve para declarar la propiedad «slug» con el valor o tipo «`producto-${id}`».
    slug: `producto-${id}`,
    // Esta línea sirve para declarar la propiedad «description» con el valor o tipo «''».
    description: '',
    // Esta línea sirve para declarar la propiedad «short_description» con el valor o tipo «''».
    short_description: '',
    // Esta línea sirve para declarar la propiedad «image» con el valor o tipo «null».
    image: null,
    // Esta línea sirve para declarar la propiedad «category» con el valor o tipo «'other'».
    category: 'other',
    // Esta línea sirve para declarar la propiedad «price» con el valor o tipo «'10000.00'».
    price: '10000.00',
    // Esta línea sirve para declarar la propiedad «created_at» con el valor o tipo «'2026-01-01T00:00:00Z'».
    created_at: '2026-01-01T00:00:00Z',
    // Esta línea sirve para copiar las propiedades de «overrides».
    ...overrides,
  };
}

// Esta línea sirve para declarar «CATALOG» con el valor «[».
const CATALOG: Product[] = [
  // Esta línea sirve para declarar el producto de ejemplo de proteína.
  product(1, { name: 'Whey Protein Gold', short_description: 'Proteína de suero', category: 'protein' }),
  // Esta línea sirve para declarar el producto de ejemplo de creatina.
  product(2, { name: 'Creatina Monohidratada', short_description: 'Fuerza y potencia', category: 'creatine' }),
  // Esta línea sirve para declarar el producto de ejemplo del shaker.
  product(3, { name: 'Shaker SanKen', description: 'Vaso mezclador para tu batido de proteína', category: 'other' }),
  // Esta línea sirve para declarar el producto de ejemplo del multivitamínico.
  product(4, { name: 'Multivitamínico', short_description: 'Vitaminas diarias', category: 'vitamins' }),
];

// Esta línea sirve para extraer «earc» de «(query: string, category: ProductCategor».
const search = (query: string, category: ProductCategory | null = null) =>
  // Esta línea sirve para devolver los ids de los productos filtrados.
  filterProducts(CATALOG, { query, category, categoryLabels: LABELS }).map((p) => p.id);

// Esta línea sirve para agrupar las pruebas de «normalizeSearchText».
describe('normalizeSearchText', () => {
  // Esta línea sirve para declarar la prueba que verifica que «quita tildes, mayúsculas y espacios de los extremos».
  it('quita tildes, mayúsculas y espacios de los extremos', () => {
    // Esta línea sirve para verificar que «normalizeSearchText('  Proteína ÁCIDA ')» cumple «toBe».
    expect(normalizeSearchText('  Proteína ÁCIDA ')).toBe('proteina acida');
  });
});

// Esta línea sirve para agrupar las pruebas de «filterProducts».
describe('filterProducts', () => {
  // Esta línea sirve para declarar la prueba que verifica que «sin búsqueda ni categoría devuelve todo el catálogo».
  it('sin búsqueda ni categoría devuelve todo el catálogo', () => {
    // Esta línea sirve para verificar que «search('')» cumple «toEqual».
    expect(search('')).toEqual([1, 2, 3, 4]);
    // Esta línea sirve para verificar que «search('   ')» cumple «toEqual».
    expect(search('   ')).toEqual([1, 2, 3, 4]);
  });

  // Esta línea sirve para declarar la prueba que verifica que «busca por nombre sin importar mayúsculas ni tildes».
  it('busca por nombre sin importar mayúsculas ni tildes', () => {
    // Esta línea sirve para verificar que «search('WHEY')» cumple «toEqual».
    expect(search('WHEY')).toEqual([1]);
    // Esta línea sirve para verificar que «search('multivitaminico')» cumple «toEqual».
    expect(search('multivitaminico')).toEqual([4]);
  });

  // Esta línea sirve para declarar la prueba que verifica que «busca también en la descripción corta y la larga».
  it('busca también en la descripción corta y la larga', () => {
    // Esta línea sirve para verificar que «search('potencia')» cumple «toEqual».
    expect(search('potencia')).toEqual([2]);
    // Esta línea sirve para verificar que «search('mezclador')» cumple «toEqual».
    expect(search('mezclador')).toEqual([3]);
  });

  // Esta línea sirve para declarar la prueba que verifica que «busca por la etiqueta visible de la categoría».
  it('busca por la etiqueta visible de la categoría', () => {
    // Esta línea sirve para verificar que «search('creatinas')» cumple «toEqual».
    expect(search('creatinas')).toEqual([2]);
  });

  // Esta línea sirve para declarar la prueba que verifica que «exige que todas las palabras coincidan».
  it('exige que todas las palabras coincidan', () => {
    // Esta línea sirve para verificar que «search('proteina')» cumple «toEqual».
    expect(search('proteina')).toEqual([1, 3]);
    // Esta línea sirve para verificar que «search('proteina suero')» cumple «toEqual».
    expect(search('proteina suero')).toEqual([1]);
  });

  // Esta línea sirve para declarar la prueba que verifica que «se combina con la categoría elegida».
  it('se combina con la categoría elegida', () => {
    // Esta línea sirve para verificar que «search('proteina', 'other')» cumple «toEqual».
    expect(search('proteina', 'other')).toEqual([3]);
    // Esta línea sirve para verificar que «search('', 'vitamins')» cumple «toEqual».
    expect(search('', 'vitamins')).toEqual([4]);
  });

  // Esta línea sirve para declarar la prueba que verifica que «devuelve vacío cuando nada coincide».
  it('devuelve vacío cuando nada coincide', () => {
    // Esta línea sirve para verificar que «search('bicicleta')» cumple «toEqual».
    expect(search('bicicleta')).toEqual([]);
  });
});
