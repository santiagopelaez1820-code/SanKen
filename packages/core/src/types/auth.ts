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
  response: AuthPayload | TwoFactorChallengeResponse,
): response is TwoFactorChallengeResponse {
  return 'requires_two_factor' in response;
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

export interface RegisterPayload {
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
