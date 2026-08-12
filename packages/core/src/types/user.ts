export type UserRole = 'user' | 'trainer' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  two_factor_enabled: boolean;
  is_public_profile: boolean;
  trainer_verified_at: string | null;
  email_verified_at: string | null;
  onboarding_completed: boolean;
  created_at: string;
}
