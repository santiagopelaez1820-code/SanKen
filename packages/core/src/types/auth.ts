// Esta línea sirve para importar los tipos que usa este archivo.
import type { ConsentAcceptanceFields, SocialConsentRequiredResponse } from '../legal/types';
// Esta línea sirve para importar los tipos que usa este archivo.
import type { User } from './user';

// Esta línea sirve para declarar la interfaz «AuthPayload».
export interface AuthPayload {
  // Esta línea sirve para declarar el campo «user» de tipo «User».
  user: User;
  // Esta línea sirve para declarar el campo «token» de tipo «string».
  token: string;
}

// Esta línea sirve para declarar la interfaz «TwoFactorChallengeResponse».
export interface TwoFactorChallengeResponse {
  // Esta línea sirve para declarar el campo «requires_two_factor» de tipo «true».
  requires_two_factor: true;
  // Esta línea sirve para declarar el campo «challenge_token» de tipo «string».
  challenge_token: string;
}

// Esta línea sirve para declarar la función que detecta si la respuesta pide verificación en dos pasos.
export function isTwoFactorChallenge(
  // Esta línea sirve para declarar el campo «response».
  response: AuthPayload | TwoFactorChallengeResponse | SocialConsentRequiredResponse,
// Esta línea sirve para indicar con el tipo de retorno que la respuesta es un desafío 2FA.
): response is TwoFactorChallengeResponse {
  // Esta línea sirve para devolver verdadero si la respuesta incluye el campo de dos pasos.
  return 'requires_two_factor' in response;
}

/**
 * POST /auth/social respondió que la cuenta de Google es NUEVA y faltan los
 * consentimientos obligatorios: no se creó nada todavía. Mostrar las
 * casillas y reenviar el mismo id_token con `accept_*`.
 */
// Esta línea sirve para declarar la función que detecta si el login social requiere consentimientos.
export function isSocialConsentRequired(
  // Esta línea sirve para declarar el campo «response».
  response: AuthPayload | TwoFactorChallengeResponse | SocialConsentRequiredResponse,
// Esta línea sirve para indicar con el tipo de retorno que la respuesta pide consentimientos.
): response is SocialConsentRequiredResponse {
  // Esta línea sirve para devolver verdadero si la respuesta incluye el campo de consentimiento.
  return 'requires_consent' in response;
}

// Esta línea sirve para declarar el tipo «SocialLoginResponse».
export type SocialLoginResponse = AuthPayload | TwoFactorChallengeResponse | SocialConsentRequiredResponse;

// Esta línea sirve para declarar la interfaz «SocialLoginPayload».
export interface SocialLoginPayload extends ConsentAcceptanceFields {
  // Esta línea sirve para declarar el campo «id_token» de tipo «string».
  id_token: string;
  // Esta línea sirve para declarar el campo «provider» de tipo «'google'».
  provider: 'google';
  // Esta línea sirve para declarar el campo opcional «device_name» de tipo «string».
  device_name?: string;
}

// Esta línea sirve para declarar la interfaz «TwoFactorEnableResponse».
export interface TwoFactorEnableResponse {
  // Esta línea sirve para declarar el campo «secret» de tipo «string».
  secret: string;
  // Esta línea sirve para declarar el campo «otpauth_uri» de tipo «string».
  otpauth_uri: string;
  // Esta línea sirve para declarar el campo «qr_svg» de tipo «string».
  qr_svg: string;
}

// Esta línea sirve para declarar la interfaz «TwoFactorConfirmResponse».
export interface TwoFactorConfirmResponse {
  // Esta línea sirve para declarar el campo «recovery_codes» de tipo «string[]».
  recovery_codes: string[];
}

// Esta línea sirve para declarar la interfaz «TwoFactorChallengePayload».
export interface TwoFactorChallengePayload {
  // Esta línea sirve para declarar el campo «challenge_token» de tipo «string».
  challenge_token: string;
  // Esta línea sirve para declarar el campo «code» de tipo «string».
  code: string;
  // Esta línea sirve para declarar el campo opcional «device_name» de tipo «string».
  device_name?: string;
}

/** Los `accept_*` son obligatorios en el registro — el backend rechaza la cuenta sin ellos. */
// Esta línea sirve para declarar la interfaz «RegisterPayload».
export interface RegisterPayload extends ConsentAcceptanceFields {
  // Esta línea sirve para declarar el campo «name» de tipo «string».
  name: string;
  // Esta línea sirve para declarar el campo «email» de tipo «string».
  email: string;
  // Esta línea sirve para declarar el campo «password» de tipo «string».
  password: string;
  // Esta línea sirve para declarar el campo «password_confirmation» de tipo «string».
  password_confirmation: string;
  // Esta línea sirve para declarar el campo opcional «phone» de tipo «string».
  phone?: string;
}

// Esta línea sirve para declarar la interfaz «LoginPayload».
export interface LoginPayload {
  // Esta línea sirve para declarar el campo «email» de tipo «string».
  email: string;
  // Esta línea sirve para declarar el campo «password» de tipo «string».
  password: string;
  // Esta línea sirve para declarar el campo opcional «device_name» de tipo «string».
  device_name?: string;
}
