<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los servicios de autenticación.

namespace App\Domain\Auth\Services;

/**
 * Genera y valida códigos de recuperación de 2FA. Los códigos son valores
 * de alta entropía generados por el servidor (no secretos elegidos por
 * humanos), por lo que se hashean con sha256 en vez de bcrypt — mismo
 * criterio que usa Sanctum para sus personal access tokens.
 */
// Esta línea sirve para declarar el servicio que genera y valida códigos de recuperación de 2FA.
final class RecoveryCodeService
{
    // Esta línea sirve para definir las letras y números permitidos (sin caracteres confusos).
    private const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

    /**
     * @return string[] códigos en texto plano, formato XXXX-XXXX
     */
    // Esta línea sirve para declarar el método que genera varios códigos (8 por defecto).
    public function generate(int $count = 8): array
    {
        // Esta línea sirve para generar la cantidad pedida de códigos y devolverlos.
        return array_map(fn () => $this->generateOne(), range(1, $count));
    }

    // Esta línea sirve para declarar el método que cifra un código.
    public function hash(string $code): string
    {
        // Esta línea sirve para devolver el hash SHA-256 del código normalizado.
        return hash('sha256', $this->normalize($code));
    }

    /**
     * @param  string[]  $hashedCodes
     * @return array{matched: bool, remaining: string[]}
     */
    // Esta línea sirve para declarar el método que verifica un código y lo consume si coincide.
    public function verifyAndConsume(array $hashedCodes, string $candidate): array
    {
        // Esta línea sirve para cifrar el código ingresado.
        $candidateHash = $this->hash($candidate);
        // Esta línea sirve para buscar el código cifrado en la lista.
        $index = array_search($candidateHash, $hashedCodes, true);

        // Esta línea sirve para revisar si no se encontró.
        if ($index === false) {
            // Esta línea sirve para devolver que no coincidió y la lista intacta.
            return ['matched' => false, 'remaining' => $hashedCodes];
        }

        // Esta línea sirve para quitar el código usado de la lista.
        unset($hashedCodes[$index]);

        // Esta línea sirve para devolver que coincidió y la lista restante reindexada.
        return ['matched' => true, 'remaining' => array_values($hashedCodes)];
    }

    // Esta línea sirve para declarar el método privado que genera un solo código.
    private function generateOne(): string
    {
        // Esta línea sirve para iniciar el código vacío.
        $raw = '';

        // Esta línea sirve para repetir 8 veces.
        for ($i = 0; $i < 8; $i++) {
            // Esta línea sirve para agregar un carácter al azar del alfabeto.
            $raw .= self::ALPHABET[random_int(0, strlen(self::ALPHABET) - 1)];
        }

        // Esta línea sirve para devolver el código con formato XXXX-XXXX.
        return substr($raw, 0, 4).'-'.substr($raw, 4, 4);
    }

    // Esta línea sirve para declarar el método privado que normaliza un código.
    private function normalize(string $code): string
    {
        // Esta línea sirve para quitar espacios y guiones y pasar a mayúsculas.
        return strtoupper(str_replace('-', '', trim($code)));
    }
}
