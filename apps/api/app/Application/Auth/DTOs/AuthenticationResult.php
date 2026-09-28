<?php

namespace App\Application\Auth\DTOs;

use Laravel\Sanctum\NewAccessToken;

/**
 * Resultado de un intento de login: o bien un token Sanctum ya emitido, o
 * bien un desafío de 2FA pendiente (sin token) que debe resolverse contra
 * POST /auth/2fa/challenge antes de emitir uno, o bien (solo login social
 * que crearía una cuenta nueva) la lista de consentimientos legales que el
 * usuario debe aceptar antes de que la cuenta se cree.
 */
final class AuthenticationResult
{
    /**
     * @param  list<array{type: string, document: string, version: string, accepted_version: ?string}>|null  $requiredConsents
     */
    private function __construct(
        public readonly ?NewAccessToken $token,
        public readonly ?string $challengeToken,
        public readonly ?array $requiredConsents = null,
    ) {}

    public static function token(NewAccessToken $token): self
    {
        return new self($token, null);
    }

    public static function challenge(string $challengeToken): self
    {
        return new self(null, $challengeToken);
    }

    /**
     * @param  list<array{type: string, document: string, version: string, accepted_version: ?string}>  $consents
     */
    public static function consentRequired(array $consents): self
    {
        return new self(null, null, $consents);
    }

    public function requiresTwoFactor(): bool
    {
        return $this->challengeToken !== null;
    }

    public function requiresConsent(): bool
    {
        return $this->requiredConsents !== null;
    }
}
