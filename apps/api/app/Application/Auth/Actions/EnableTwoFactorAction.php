<?php

namespace App\Application\Auth\Actions;

use App\Domain\Auth\Services\TotpService;
use App\Models\User;

class EnableTwoFactorAction
{
    public function __construct(
        private readonly TotpService $totp,
    ) {}

    /**
     * @return array{secret: string, otpauth_uri: string, qr_svg: string}
     */
    public function execute(User $user): array
    {
        $secret = $this->totp->generateSecret();

        $user->forceFill(['two_factor_secret' => $secret])->save();

        return [
            'secret' => $secret,
            'otpauth_uri' => $this->totp->otpauthUri($user->email, $secret),
            'qr_svg' => $this->totp->qrCodeSvg($user->email, $secret),
        ];
    }
}
