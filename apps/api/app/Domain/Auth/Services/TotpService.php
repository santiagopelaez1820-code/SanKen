<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los servicios de autenticación.

namespace App\Domain\Auth\Services;

// Esta línea sirve para importar el generador de imágenes SVG de la librería de QR.
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
// Esta línea sirve para importar el renderizador de imágenes de QR.
use BaconQrCode\Renderer\ImageRenderer;
// Esta línea sirve para importar el estilo de renderizado del QR.
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
// Esta línea sirve para importar el escritor que genera el código QR.
use BaconQrCode\Writer;
// Esta línea sirve para importar la librería Google2FA para los códigos TOTP.
use PragmaRX\Google2FA\Google2FA;

/**
 * Genera y verifica secretos TOTP compatibles con Google Authenticator y
 * apps equivalentes, y renderiza el QR de activación como SVG.
 */
// Esta línea sirve para declarar el servicio que genera y verifica códigos TOTP.
final class TotpService
{
    // Esta línea sirve para declarar el constructor que recibe y guarda la librería Google2FA.
    public function __construct(private readonly Google2FA $google2fa) {}

    // Esta línea sirve para declarar el método que genera un secreto TOTP nuevo.
    public function generateSecret(): string
    {
        // Esta línea sirve para generar y devolver la clave secreta.
        return $this->google2fa->generateSecretKey();
    }

    // Esta línea sirve para declarar el método que arma la URI otpauth para las apps autenticadoras.
    public function otpauthUri(string $email, string $secret): string
    {
        // Esta línea sirve para codificar el nombre de la app como emisor.
        $issuer = rawurlencode(config('app.name'));
        // Esta línea sirve para codificar la etiqueta "App:correo".
        $label = rawurlencode(config('app.name').':'.$email);

        // Esta línea sirve para devolver la URI con el secreto, el emisor y los parámetros TOTP.
        return "otpauth://totp/{$label}?secret={$secret}&issuer={$issuer}&algorithm=SHA1&digits=6&period=30";
    }

    // Esta línea sirve para declarar el método que genera el QR en SVG.
    public function qrCodeSvg(string $email, string $secret): string
    {
        // Esta línea sirve para crear el renderizador del QR.
        $renderer = new ImageRenderer(
            // Esta línea sirve para fijar el tamaño del QR en 240 píxeles.
            new RendererStyle(240),
            // Esta línea sirve para generar el QR en formato SVG.
            new SvgImageBackEnd,
        );

        // Esta línea sirve para generar el QR de la URI otpauth y devolverlo.
        return (new Writer($renderer))->writeString($this->otpauthUri($email, $secret));
    }

    // Esta línea sirve para declarar el método que verifica un código TOTP.
    public function verify(string $secret, string $code): bool
    {
        // Esta línea sirve para devolver verdadero si el código es válido para el secreto.
        return $this->google2fa->verifyKey($secret, $code) === true;
    }
}
