import type { ConsentAcceptanceFields, SocialConsentRequiredResponse } from '../legal/types';
import type { User } from './user';

export interface AuthPayload {
  user: User;
  token: string;
}

export interface TwoFactorChallengeResponse {
  requires_two_factor: true;
  challenge_token: string;
}

export function isTwoFactorChallenge(
  response: AuthPayload | TwoFactorChallengeResponse | SocialConsentRequiredResponse,
): response is TwoFactorChallengeResponse {
  return 'requires_two_factor' in response;
}

/**
 * POST /auth/social respondió que la cuenta de Google es NUEVA y faltan los
 * consentimientos obligatorios: no se creó nada todavía. Mostrar las
 * casillas y reenviar el mismo id_token con `accept_*`.
 */
export function isSocialConsentRequired(
  response: AuthPayload | TwoFactorChallengeResponse | SocialConsentRequiredResponse,
): response is SocialConsentRequiredResponse {
  return 'requires_consent' in response;
}

export type SocialLoginResponse = AuthPayload | TwoFactorChallengeResponse | SocialConsentRequiredResponse;

export interface SocialLoginPayload extends ConsentAcceptanceFields {
  id_token: string;
  provider: 'google';
  device_name?: string;
}

export interface TwoFactorEnableResponse {
  secret: string;
  otpauth_uri: string;
  qr_svg: string;
}

export interface TwoFactorConfirmResponse {
  recovery_codes: string[];
}

export interface TwoFactorChallengePayload {
  challenge_token: string;
  code: string;
  device_name?: string;
}

/** Los `accept_*` son obligatorios en el registro — el backend rechaza la cuenta sin ellos. */
export interface RegisterPayload extends ConsentAcceptanceFields {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  device_name?: string;
}
