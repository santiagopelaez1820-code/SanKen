/**
 * Postulación de un PR para Rankings públicos, con video de evidencia y
 * revisión de Super Admin — separado de PersonalRecordSummary (detección
 * automática/registro manual privado, ver types/stats.ts), que sigue sin
 * cambios y nunca pasa por este flujo.
 */
export type PrSubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface PrSubmission {
  id: number;
  user: { id: number; name: string };
  exercise: { id: number; name: string };
  weight_kg: number;
  reps: number;
  estimated_1rm: number;
  video_url: string | null;
  status: PrSubmissionStatus;
  reviewed_by: { id: number; name: string } | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export interface CreatePrSubmissionPayload {
  exercise_id: number;
  weight_kg: number;
  reps: number;
}

export interface ReviewPrSubmissionPayload {
  status: 'approved' | 'rejected';
  rejection_reason?: string;
}
