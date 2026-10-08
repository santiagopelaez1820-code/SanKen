// Esta línea sirve para importar los tipos «Product, ProductCategory» desde «@sanken/core».
import type { Product, ProductCategory } from '@sanken/core';

/** "Proteína" → "proteina": sin tildes ni mayúsculas, para que "creatina" encuentre "Creatína" y viceversa. */
// Esta línea sirve para declarar la función «normalizeSearchText».
export function normalizeSearchText(value: string): string {
  // Esta línea sirve para devolver «value».
  return value
    // Esta línea sirve para encadenar la operación «normalize».
    .normalize('NFD')
    // Esta línea sirve para encadenar la operación «replace».
    .replace(/[̀-ͯ]/g, '')
    // Esta línea sirve para encadenar la operación «toLowerCase».
    .toLowerCase()
    // Esta línea sirve para encadenar la operación «trim».
    .trim();
}

// Esta línea sirve para declarar la interfaz «ProductFilter».
interface ProductFilter {
  // Esta línea sirve para declarar la propiedad «category» con el valor o tipo «ProductCategory | null».
  category: ProductCategory | null;
  // Esta línea sirve para declarar la propiedad «query» con el valor o tipo «string».
  query: string;
  /** Etiquetas visibles de cada categoría — así "proteinas" también encuentra los productos de esa categoría. */
  // Esta línea sirve para declarar la propiedad «categoryLabels» con el valor o tipo «Record<ProductCategory, string>».
  categoryLabels: Record<ProductCategory, string>;
}

/**
 * Filtro local del catálogo de la Tienda: GET /products ya trae el
 * catálogo completo (sin paginación), así que buscar en el cliente evita
 * una segunda fuente de datos y requests por cada tecla. Cada palabra de la
 * búsqueda tiene que aparecer en el nombre, las descripciones o la
 * categoría (AND entre palabras), y se combina con la categoría elegida.
 */
// Esta línea sirve para declarar la función «filterProducts».
export function filterProducts(products: Product[], { category, query, categoryLabels }: ProductFilter): Product[] {
  // Esta línea sirve para extraer «erm» de «normalizeSearchText(query).split(/\s+/).».
  const terms = normalizeSearchText(query).split(/\s+/).filter(Boolean);

  // Esta línea sirve para devolver «products.filter((product) => {».
  return products.filter((product) => {
    // Esta línea sirve para devolver «false» si «category && product.category !== category».
    if (category && product.category !== category) return false;
    // Esta línea sirve para devolver «true» si «terms.length === 0».
    if (terms.length === 0) return true;

    // Esta línea sirve para extraer «aystac» de «normalizeSearchText(».
    const haystack = normalizeSearchText(
      // Esta línea sirve para reunir los textos donde se busca: nombre, descripciones y categoría.
      [product.name, product.short_description, product.description, categoryLabels[product.category] ?? ''].join(' '),
    );
    // Esta línea sirve para devolver «terms.every((term) => haystack.includes(term))».
    return terms.every((term) => haystack.includes(term));
  });
}
