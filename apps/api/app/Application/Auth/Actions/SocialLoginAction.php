<?php

namespace App\Application\Auth\Actions;

use App\Application\Auth\DTOs\AuthenticationResult;
use App\Domain\User\Contracts\UserRepositoryInterface;
use App\Infrastructure\Firebase\FirebaseTokenClaims;
use App\Infrastructure\Firebase\FirebaseTokenVerifier;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class SocialLoginAction
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
        private readonly FirebaseTokenVerifier $verifier,
    ) {}

    public function execute(string $idToken, string $provider, string $deviceName): AuthenticationResult
    {
        $claims = $this->verifier->verify($idToken);
        $user = $this->resolveUser($claims, $provider);

        if ($user->is_banned) {
            throw ValidationException::withMessages([
                'id_token' => ['Esta cuenta ha sido suspendida.'],
            ]);
        }

        if ($user->deactivated_at) {
            throw ValidationException::withMessages([
                'id_token' => ['Esta cuenta está desactivada.'],
            ]);
        }

        if ($user->two_factor_enabled) {
            $challengeToken = bin2hex(random_bytes(32));
            Cache::put("2fa_challenge:{$challengeToken}", $user->id, now()->addMinutes(5));

            return AuthenticationResult::challenge($challengeToken);
        }

        return AuthenticationResult::token($user->createToken($deviceName));
    }

    /**
     * 1) ¿Ya hay una cuenta vinculada a este firebase_uid? esa.
     * 2) Si no, ¿existe una cuenta con el mismo email — y Firebase lo
     *    marca como verificado? se vincula esa cuenta (evita duplicar la
     *    cuenta de alguien que ya se había registrado con email+password).
     * 3) Si no, se crea una cuenta nueva.
     *
     * Solo se confía en el email para el paso 2 cuando viene con
     * email_verified=true en el token ya verificado por Firebase — nunca
     * en un email suelto enviado por el cliente.
     */
    private function resolveUser(FirebaseTokenClaims $claims, string $provider): User
    {
        if ($existing = $this->users->findByFirebaseUid($claims->uid)) {
            return $existing;
        }

        if (! $claims->email) {
            throw ValidationException::withMessages([
                'id_token' => ['No se pudo obtener un correo desde la cuenta de Google.'],
            ]);
        }

        $byEmail = $this->users->findByEmail($claims->email);

        if ($byEmail) {
            // Ya existe una cuenta con este email pero Firebase no lo marca
            // como verificado: no la vinculamos (agujero de seguridad) ni
            // podemos crear una cuenta nueva con el mismo email (columna
            // unique) — se rechaza con un mensaje claro.
            if (! $claims->emailVerified) {
                throw ValidationException::withMessages([
                    'id_token' => ['Ya existe una cuenta con este correo. Inicia sesión con tu contraseña para vincularla.'],
                ]);
            }

            $byEmail->forceFill([
                'firebase_uid' => $claims->uid,
                'auth_provider' => $provider,
            ])->save();

            return $byEmail;
        }

        $user = $this->users->create([
            'name' => $claims->name ?: Str::before($claims->email, '@'),
            'email' => $claims->email,
            'phone' => null,
            'avatar_url' => $claims->picture,
            'firebase_uid' => $claims->uid,
            'auth_provider' => $provider,
            // Cuenta creada por login social: nunca inicia sesión con esta
            // password, pero la columna es NOT NULL — se genera una al azar
            // e inutilizable en vez de tocar el esquema de `users`.
            'password' => Hash::make(Str::random(40)),
            'role' => 'user',
            'is_public_profile' => false,
            'is_banned' => false,
            'two_factor_enabled' => false,
        ]);

        if ($claims->emailVerified) {
            $user->markEmailAsVerified();
        }

        event(new Registered($user));

        return $user;
    }
}
