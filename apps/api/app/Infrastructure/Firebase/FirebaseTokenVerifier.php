<?php

namespace App\Infrastructure\Firebase;

use Kreait\Firebase\Factory;
use RuntimeException;
use Throwable;

/**
 * Único punto del backend que confía en un Firebase ID Token: verifica
 * firma, expiración, issuer y audience contra el Admin SDK antes de leer
 * ningún claim (uid/email) — el controller/Action nunca reciben el token
 * crudo, solo el resultado ya verificado.
 *
 * Falla cerrado a propósito: sin FIREBASE_CREDENTIALS configurado, ninguna
 * request de login social puede completarse (nunca "verificación" falsa).
 */
class FirebaseTokenVerifier
{
    public function verify(string $idToken): FirebaseTokenClaims
    {
        $credentials = config('services.firebase.credentials');

        if (! $credentials) {
            throw new RuntimeException(
                'Firebase no está configurado en el backend (falta FIREBASE_CREDENTIALS). '
                .'El login social no puede verificarse hasta que se configure la service account.'
            );
        }

        $factory = (new Factory())->withServiceAccount($credentials);

        if ($projectId = config('services.firebase.project_id')) {
            $factory = $factory->withProjectId($projectId);
        }

        try {
            $verified = $factory->createAuth()->verifyIdToken($idToken);
        } catch (Throwable $e) {
            throw new InvalidFirebaseTokenException('Token de Firebase inválido o expirado.', previous: $e);
        }

        $claims = $verified->claims();

        return new FirebaseTokenClaims(
            uid: (string) $claims->get('sub'),
            email: $claims->get('email'),
            emailVerified: (bool) $claims->get('email_verified', false),
            name: $claims->get('name'),
            picture: $claims->get('picture'),
        );
    }
}
