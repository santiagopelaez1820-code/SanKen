/**
 * Postulación de un PR para Rankings públicos, con video de evidencia y
 * revisión de Super Admin — separado de PersonalRecordSummary (detección
 * automática/registro manual privado, ver types/stats.ts), que sigue sin
 * cambios y nunca pasa por este flujo.
 */
// Esta línea sirve para declarar el tipo «PrSubmissionStatus» como «'pending' | 'approved' | 'rejected'».
export type PrSubmissionStatus = 'pending' | 'approved' | 'rejected';

// Esta línea sirve para declarar la interfaz «PrSubmission».
export interface PrSubmission {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «user» de tipo «{ id: number; name: string }».
  user: { id: number; name: string };
  // Esta línea sirve para declarar el campo «exercise» de tipo «{ id: number; name: string }».
  exercise: { id: number; name: string };
  // Esta línea sirve para declarar el campo «weight_kg» de tipo «number».
  weight_kg: number;
  // Esta línea sirve para declarar el campo «reps» de tipo «number».
  reps: number;
  // Esta línea sirve para declarar el campo «estimated_1rm» de tipo «number».
  estimated_1rm: number;
  // Esta línea sirve para declarar el campo «video_url» de tipo «string | null».
  video_url: string | null;
  // Esta línea sirve para declarar el campo «status» de tipo «PrSubmissionStatus».
  status: PrSubmissionStatus;
  // Esta línea sirve para declarar el campo «reviewed_by» de tipo «{ id: number; name: string } | null».
  reviewed_by: { id: number; name: string } | null;
  // Esta línea sirve para declarar el campo «reviewed_at» de tipo «string | null».
  reviewed_at: string | null;
  // Esta línea sirve para declarar el campo «rejection_reason» de tipo «string | null».
  rejection_reason: string | null;
  // Esta línea sirve para declarar el campo «created_at» de tipo «string».
  created_at: string;
}

// Esta línea sirve para declarar la interfaz «CreatePrSubmissionPayload».
export interface CreatePrSubmissionPayload {
  // Esta línea sirve para declarar el campo «exercise_id» de tipo «number».
  exercise_id: number;
  // Esta línea sirve para declarar el campo «weight_kg» de tipo «number».
  weight_kg: number;
  // Esta línea sirve para declarar el campo «reps» de tipo «number».
  reps: number;
}

// Esta línea sirve para declarar la interfaz «ReviewPrSubmissionPayload».
export interface ReviewPrSubmissionPayload {
  // Esta línea sirve para declarar el campo «status» de tipo «'approved' | 'rejected'».
  status: 'approved' | 'rejected';
  // Esta línea sirve para declarar el campo opcional «rejection_reason» de tipo «string».
  rejection_reason?: string;
}
