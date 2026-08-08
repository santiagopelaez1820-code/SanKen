<?php

namespace App\Application\Auth\Actions;

use App\Domain\Auth\Services\RecoveryCodeService;
use App\Domain\Auth\Services\TotpService;
use App\Domain\User\Contracts\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\NewAccessToken;

class ChallengeTwoFactorAction
{
    private const MAX_ATTEMPTS = 5;

    public function __construct(
        private readonly UserRepositoryInterface $users,
        private readonly TotpService $totp,
        private readonly RecoveryCodeService $recoveryCodes,
    ) {}

    public function execute(string $challengeToken, string $code, string $deviceName): NewAccessToken
    {
        $cacheKey = "2fa_challenge:{$challengeToken}";
        $userId = Cache::get($cacheKey);

        if (! $userId) {
            throw ValidationException::withMessages([
                'challenge_token' => ['El desafío de verificación no es válido o expiró.'],
            ]);
        }

        $attemptsKey = "2fa_challenge_attempts:{$challengeToken}";

        if (RateLimiter::tooManyAttempts($attemptsKey, self::MAX_ATTEMPTS)) {
            Cache::forget($cacheKey);
            RateLimiter::clear($attemptsKey);

            throw ValidationException::withMessages([
                'challenge_token' => ['Se agotaron los intentos. Volvé a iniciar sesión.'],
            ]);
        }

        $user = $this->users->findById($userId);

        if (! $user || ! $this->attemptVerification($user, $code)) {
            RateLimiter::hit($attemptsKey, 300);

            throw ValidationException::withMessages([
                'code' => ['El código ingresado no es válido.'],
            ]);
        }

        Cache::forget($cacheKey);
        RateLimiter::clear($attemptsKey);

        return $user->createToken($deviceName);
    }

    private function attemptVerification(User $user, string $code): bool
    {
        if ($user->two_factor_secret && $this->totp->verify($user->two_factor_secret, $code)) {
            return true;
        }

        return DB::transaction(function () use ($user, $code) {
            /** @var User $locked */
            $locked = User::query()->lockForUpdate()->findOrFail($user->id);

            $result = $this->recoveryCodes->verifyAndConsume($locked->two_factor_recovery_codes ?? [], $code);

            if (! $result['matched']) {
                return false;
            }

            $locked->forceFill(['two_factor_recovery_codes' => $result['remaining']])->save();

            return true;
        });
    }
}
