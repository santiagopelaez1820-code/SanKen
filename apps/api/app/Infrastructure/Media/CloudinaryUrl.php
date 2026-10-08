<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres del manejo de archivos multimedia.

namespace App\Infrastructure\Media;

/**
 * Lee resource_type y public_id de un secure_url de Cloudinary tal como lo
 * devuelve una subida:
 *   https://res.cloudinary.com/{cloud}/{image|video}/upload/v{n}/{public_id}.{ext}
 * Solo acepta URLs de NUESTRA cuenta — cualquier otra cosa devuelve null.
 */
// Esta línea sirve para declarar la clase que lee los datos de una URL de Cloudinary.
final class CloudinaryUrl
{
    /**
     * @return array{public_id: string, resource_type: string}|null
     */
    // Esta línea sirve para declarar el método que extrae el tipo y el public_id de la URL.
    public static function parse(?string $url, string $cloudName): ?array
    {
        // Esta línea sirve para revisar si no hay URL o no hay nombre de cuenta.
        if (! $url || $cloudName === '') {
            // Esta línea sirve para devolver null.
            return null;
        }

        // Esta línea sirve para armar la expresión regular con el nombre de la cuenta.
        $pattern = '#^https://res\.cloudinary\.com/'.preg_quote($cloudName, '#')
            // Esta línea sirve para completar la expresión con el tipo, la versión opcional y el public_id.
            .'/(image|video)/upload/(?:v\d+/)?(.+?)(?:\.[A-Za-z0-9]+)?$#';

        // Esta línea sirve para revisar si la URL no coincide con el patrón.
        if (! preg_match($pattern, $url, $matches)) {
            // Esta línea sirve para devolver null.
            return null;
        }

        // Esta línea sirve para devolver el tipo de archivo y el public_id.
        return ['resource_type' => $matches[1], 'public_id' => $matches[2]];
    }

    // Esta línea sirve para declarar el método que indica si una URL es de Cloudinary.
    public static function isCloudinary(?string $url): bool
    {
        // Esta línea sirve para revisar que sea texto y empiece con el dominio de Cloudinary.
        return is_string($url) && str_starts_with($url, 'https://res.cloudinary.com/');
    }
}
