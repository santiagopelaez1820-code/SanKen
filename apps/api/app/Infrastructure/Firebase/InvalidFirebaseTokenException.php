<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de la integración con Firebase.

namespace App\Infrastructure\Firebase;

// Esta línea sirve para importar la excepción base RuntimeException.
use RuntimeException;

// Esta línea sirve para declarar la excepción de token de Firebase inválido.
class InvalidFirebaseTokenException extends RuntimeException {}
