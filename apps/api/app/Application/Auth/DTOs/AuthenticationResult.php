<?php

namespace App\Application\Auth\DTOs;

use Laravel\Sanctum\NewAccessToken;

/**
 * Resultado de un intento de login: o bien un token Sanctum ya emitido, o
 * bien un desafío de 2FA pendiente (sin token) que debe resolverse contra
 * POST /auth/2fa/challenge antes de emitir uno.
 */
final class AuthenticationResult
{
    private function __construct(
        public readonly ?NewAccessToken $token,
        public readonly ?string $challengeToken,
    ) {}

    public static function token(NewAccessToken $token): self
    {
        return new self($token, null);
    }

    public static function challenge(string $challengeToken): self
    {
        return new self(null, $challengeToken);
    }

    public function requiresTwoFactor(): bool
    {
        return $this->challengeToken !== null;
    }
}
