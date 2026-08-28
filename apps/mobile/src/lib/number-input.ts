/**
 * Convierte un input de texto tipo "80,5" a número — los teclados numéricos
 * en español suelen escribir coma decimal en vez de punto. Repetido
 * idéntico en varias pantallas (PRs, medidas corporales) antes de esto.
 */
export function parseDecimalInput(value: string): number {
  return Number(value.replace(',', '.'));
}
