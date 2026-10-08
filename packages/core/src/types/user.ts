// Esta línea sirve para importar los tipos que usa este archivo.
import type { ConsentType } from '../legal/types';

// Esta línea sirve para declarar los roles posibles de un usuario.
export type UserRole ='user' | 'trainer' | 'super_admin';

// Esta línea sirve para declarar la interfaz «User».
export interface User {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «name» de tipo «string».
  name: string;
  // Esta línea sirve para declarar el campo «email» de tipo «string».
  email: string;
  // Esta línea sirve para declarar el campo «avatar_url» de tipo «string | null».
  avatar_url: string | null;
  // Esta línea sirve para declarar el campo «role» de tipo «UserRole».
  role: UserRole;
  // Esta línea sirve para declarar el campo «two_factor_enabled» de tipo «boolean».
  two_factor_enabled: boolean;
  // Esta línea sirve para declarar el campo «is_public_profile» de tipo «boolean».
  is_public_profile: boolean;
  // Esta línea sirve para declarar el campo «trainer_verified_at» de tipo «string | null».
  trainer_verified_at: string | null;
  // Esta línea sirve para declarar el campo «email_verified_at» de tipo «string | null».
  email_verified_at: string | null;
  // Esta línea sirve para declarar el campo «onboarding_completed» de tipo «boolean».
  onboarding_completed: boolean;
  /** true si el perfil ya tiene city_id — gate independiente de onboarding_completed, ver RequireAuth. */
  // Esta línea sirve para declarar el campo «has_location» de tipo «boolean».
  has_location: boolean;
  // Esta línea sirve para declarar el campo «created_at» de tipo «string».
  created_at: string;
  /**
   * Consentimientos legales que el usuario todavía no aceptó en su versión
   * vigente (ver config/legal.php). Solo viene para el propio usuario
   * autenticado; opcional porque un `user` persistido por una versión
   * anterior de la app no lo tiene.
   */
  // Esta línea sirve para declarar el campo opcional «pending_consents» de tipo «ConsentType[]».
  pending_consents?: ConsentType[];
  /**
   * Solo para el propio usuario. null = cuenta creada con correo y
   * contraseña (eliminarla pide la contraseña); 'google' = login social.
   */
  // Esta línea sirve para declarar el campo opcional «auth_provider» de tipo «string | null».
  auth_provider?: string | null;
}
