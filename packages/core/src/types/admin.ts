export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'trainer' | 'admin';
  is_banned: boolean;
  trainer_verified_at: string | null;
  last_active_at: string | null;
  created_at: string;
}

export type ReportReason = 'abuse' | 'spam' | 'inappropriate_content' | 'other';
export type ReportStatus = 'pending' | 'resolved' | 'dismissed';

export interface Report {
  id: number;
  reporter: { id: number; name: string };
  reportable_type: string;
  reportable_id: number;
  reportable_preview?: string;
  reason: ReportReason;
  details: string | null;
  status: ReportStatus;
  resolved_by?: { id: number; name: string };
  resolved_at: string | null;
  resolution_notes: string | null;
  created_at: string;
}

export interface StoreReportPayload {
  reportable_type: 'chat_message';
  reportable_id: number;
  reason: ReportReason;
  details?: string;
}

export interface NewsPromotion {
  id: number;
  title: string;
  body: string;
  image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface AdminStats {
  total_users: number;
  new_users_7d: number;
  trainers_count: number;
  banned_users_count: number;
  pending_reports_count: number;
  dau: number;
  wau: number;
  mau: number;
  retention_pct: number;
}

export interface AuditLogEntry {
  id: number;
  log_name: string | null;
  description: string;
  event: string | null;
  subject_type: string | null;
  subject_id: number | null;
  causer?: { id: number; name: string };
  changes: unknown;
  created_at: string;
}

export interface MuscleGroupOption {
  id: number;
  name: string;
}

export interface AdminExercise {
  id: number;
  name: string;
  primary_muscle_id: number;
  primary_muscle: MuscleGroupOption;
  equipment: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  type: 'compound' | 'isolation' | 'cardio' | 'mobility';
  instructions: string | null;
  common_mistakes: string | null;
  tips: string | null;
  video_url: string | null;
  image_url: string | null;
  is_active: boolean;
}
