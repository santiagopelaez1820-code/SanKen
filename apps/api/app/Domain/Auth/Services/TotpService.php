<?php

namespace App\Domain\Auth\Services;

use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use PragmaRX\Google2FA\Google2FA;

/**
 * Genera y verifica secretos TOTP compatibles con Google Authenticator y
 * apps equivalentes, y renderiza el QR de activación como SVG.
 */
final class TotpService
{
    public function __construct(private readonly Google2FA $google2fa) {}

    public function generateSecret(): string
    {
        return $this->google2fa->generateSecretKey();
    }

    public function otpauthUri(string $email, string $secret): string
    {
        $issuer = rawurlencode(config('app.name'));
        $label = rawurlencode(config('app.name').':'.$email);

        return "otpauth://totp/{$label}?secret={$secret}&issuer={$issuer}&algorithm=SHA1&digits=6&period=30";
    }

    public function qrCodeSvg(string $email, string $secret): string
    {
        $renderer = new ImageRenderer(
            new RendererStyle(240),
            new SvgImageBackEnd,
        );

        return (new Writer($renderer))->writeString($this->otpauthUri($email, $secret));
    }

    public function verify(string $secret, string $code): bool
    {
        return $this->google2fa->verifyKey($secret, $code) === true;
    }
}
