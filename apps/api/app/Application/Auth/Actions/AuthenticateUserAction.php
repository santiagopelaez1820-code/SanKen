<?php

namespace App\Application\Auth\Actions;

use App\Application\Auth\DTOs\AuthenticationResult;
use App\Domain\User\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthenticateUserAction
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
    ) {}

    public function execute(string $email, string $password, string $deviceName): AuthenticationResult
    {
        $user = $this->users->findByEmail($email);

        if (! $user || ! Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        if ($user->is_banned) {
            throw ValidationException::withMessages([
                'email' => ['Esta cuenta ha sido suspendida.'],
            ]);
        }

        if ($user->two_factor_enabled) {
            $challengeToken = bin2hex(random_bytes(32));
            Cache::put("2fa_challenge:{$challengeToken}", $user->id, now()->addMinutes(5));

            return AuthenticationResult::challenge($challengeToken);
        }

        return AuthenticationResult::token($user->createToken($deviceName));
    }
}
