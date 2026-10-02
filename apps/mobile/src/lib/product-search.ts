import type { Product, ProductCategory } from '@sanken/core';

/** "Proteína" → "proteina": sin tildes ni mayúsculas, para que "creatina" encuentre "Creatína" y viceversa. */
export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

interface ProductFilter {
  category: ProductCategory | null;
  query: string;
  /** Etiquetas visibles de cada categoría — así "proteinas" también encuentra los productos de esa categoría. */
  categoryLabels: Record<ProductCategory, string>;
}

/**
 * Filtro local del catálogo de la Tienda: GET /products ya trae el
 * catálogo completo (sin paginación), así que buscar en el cliente evita
 * una segunda fuente de datos y requests por cada tecla. Cada palabra de la
 * búsqueda tiene que aparecer en el nombre, las descripciones o la
 * categoría (AND entre palabras), y se combina con la categoría elegida.
 */
export function filterProducts(products: Product[], { category, query, categoryLabels }: ProductFilter): Product[] {
  const terms = normalizeSearchText(query).split(/\s+/).filter(Boolean);

  return products.filter((product) => {
    if (category && product.category !== category) return false;
    if (terms.length === 0) return true;

    const haystack = normalizeSearchText(
      [product.name, product.short_description, product.description, categoryLabels[product.category] ?? ''].join(' '),
    );
    return terms.every((term) => haystack.includes(term));
  });
}
