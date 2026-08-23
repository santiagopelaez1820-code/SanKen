<?php

namespace App\Application\Auth\Actions;

use App\Domain\Auth\Services\RecoveryCodeService;
use App\Domain\Auth\Services\TotpService;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class ConfirmTwoFactorAction
{
    public function __construct(
        private readonly TotpService $totp,
        private readonly RecoveryCodeService $recoveryCodes,
    ) {}

    /**
     * @return string[] códigos de recuperación en texto plano
     */
    public function execute(User $user, string $code): array
    {
        if (! $user->two_factor_secret || ! $this->totp->verify($user->two_factor_secret, $code)) {
            throw ValidationException::withMessages([
                'code' => ['El código ingresado no es válido.'],
            ]);
        }

        $plainCodes = $this->recoveryCodes->generate();

        $user->forceFill([
            'two_factor_enabled' => true,
            'two_factor_recovery_codes' => array_map(
                fn (string $plainCode) => $this->recoveryCodes->hash($plainCode),
                $plainCodes,
            ),
        ])->save();

        return $plainCodes;
    }
}
