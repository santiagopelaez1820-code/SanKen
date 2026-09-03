<?php

namespace App\Infrastructure\Firebase;

/**
 * Subconjunto de claims de un Firebase ID Token ya verificado (firma +
 * expiración + issuer/audience) — nunca se construye a partir de datos
 * enviados sueltos por el cliente, solo desde FirebaseTokenVerifier::verify().
 */
final class FirebaseTokenClaims
{
    public function __construct(
        public readonly string $uid,
        public readonly ?string $email,
        public readonly bool $emailVerified,
        public readonly ?string $name,
        public readonly ?string $picture,
    ) {}
}
