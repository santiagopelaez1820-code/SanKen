<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de utilidades.

namespace App\Support;

// Esta línea sirve para declarar la clase que arma las claves de caché.
final class CacheKeys
{
    // Esta línea sirve para declarar el método que arma la clave de la rutina activa de un usuario.
    public static function activeRoutine(int $userId): string
    {
        // Esta línea sirve para devolver la clave "routines:active:{id}".
        return "routines:active:{$userId}";
    }

    // Esta línea sirve para declarar el método que arma la clave del dashboard de estadísticas de un usuario.
    public static function statsDashboard(int $userId): string
    {
        // Esta línea sirve para devolver la clave "stats:dashboard:{id}".
        return "stats:dashboard:{$userId}";
    }
}
