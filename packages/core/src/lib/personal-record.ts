// Esta línea sirve para importar el tipo del resumen de récord personal.
import type { PersonalRecordSummary } from '../types/stats';

/**
 * "110 kg × 3" — cómo se muestra un récord en toda la app. Los récords
 * manuales anteriores a guardar reps (reps null) se muestran solo con kg.
 */
// Esta línea sirve para declarar la función que da formato a un récord personal.
export function formatPersonalRecord(record: Pick<PersonalRecordSummary, 'value' | 'reps'>): string {
  // Esta línea sirve para formatear el peso en kilogramos con hasta dos decimales.
  const kg = `${Number(record.value).toLocaleString('es-AR', { maximumFractionDigits: 2 })} kg`;
  // Esta línea sirve para devolver el peso con las repeticiones si existen.
  return record.reps ? `${kg} × ${record.reps}` : kg;
}
