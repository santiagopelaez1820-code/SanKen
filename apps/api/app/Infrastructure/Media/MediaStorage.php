<?php

// Esta línea sirve para ubicar esta interfaz en el espacio de nombres del manejo de archivos multimedia.

namespace App\Infrastructure\Media;

// Esta línea sirve para importar la clase UploadedFile (archivo subido).
use Illuminate\Http\UploadedFile;

/**
 * Dónde se guardan los archivos que suben usuarios y admins (avatar, imagen
 * de producto, videos de ejercicio y de PR). Lo que se guarda en la columna
 * de la base es siempre lo que devuelve store(): una URL absoluta de
 * Cloudinary o una ruta relativa "/storage/..." en modo local. Los clientes
 * resuelven ambas con ApiClient::mediaUrl() (packages/core).
 *
 * Implementación según MEDIA_STORAGE (ver AppServiceProvider):
 * CloudinaryMediaStorage en producción, LocalPublicMediaStorage en dev/tests.
 */
// Esta línea sirve para declarar la interfaz de los almacenamientos de archivos.
interface MediaStorage
{
    /**
     * Guarda $file en el destino de $slot y borra el archivo apuntado por
     * $previousUrl si es nuestro y ya no corresponde. Nunca deja la fila
     * sin archivo: si la subida falla, aborta antes de borrar nada.
     */
    // Esta línea sirve para declarar el método que guarda un archivo y devuelve su URL.
    public function store(UploadedFile $file, MediaSlot $slot, ?string $previousUrl, string $failureMessage): string;

    /**
     * Borra el archivo de esa URL si lo subió esta app (Cloudinary dentro de
     * nuestra carpeta raíz, o "/storage/..." local). Una URL ajena (link
     * externo pegado por un admin) se ignora a propósito.
     */
    // Esta línea sirve para declarar el método que borra un archivo a partir de su URL.
    public function delete(?string $url): void;
}
