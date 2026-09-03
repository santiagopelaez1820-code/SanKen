const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

/** Formatea un precio (viene como string decimal del backend, ej. "79900.00") como moneda colombiana ($79.900). */
export function formatCurrency(value: string | number): string {
  return formatter.format(Number(value));
}
