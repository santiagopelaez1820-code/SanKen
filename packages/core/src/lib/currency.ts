// Esta línea sirve para crear el formateador de pesos colombianos sin decimales.
const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

/** Formatea un precio (viene como string decimal del backend, ej. "79900.00") como moneda colombiana ($79.900). */
// Esta línea sirve para declarar la función que da formato de moneda a un valor.
export function formatCurrency(value: string | number): string {
  // Esta línea sirve para devolver el valor convertido a número y formateado.
  return formatter.format(Number(value));
}
