export type UserRole = 'user' | 'trainer' | 'super_admin';

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
  /** true si el perfil ya tiene city_id — gate independiente de onboarding_completed, ver RequireAuth. */
  has_location: boolean;
  created_at: string;
}
