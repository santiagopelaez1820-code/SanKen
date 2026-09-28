import type { PersonalRecordSummary } from '../types/stats';

/**
 * "110 kg × 3" — cómo se muestra un récord en toda la app. Los récords
 * manuales anteriores a guardar reps (reps null) se muestran solo con kg.
 */
export function formatPersonalRecord(record: Pick<PersonalRecordSummary, 'value' | 'reps'>): string {
  const kg = `${Number(record.value).toLocaleString('es-AR', { maximumFractionDigits: 2 })} kg`;
  return record.reps ? `${kg} × ${record.reps}` : kg;
}
