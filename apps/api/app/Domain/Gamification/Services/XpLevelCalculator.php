<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los servicios de gamificación.

namespace App\Domain\Gamification\Services;

/**
 * Curva de nivel simple y determinista: nivel(xp) = floor(sqrt(xp/100)) + 1.
 * Nivel 1 = 0xp, 2 = 100xp, 3 = 400xp, 4 = 900xp, 5 = 1600xp.
 */
// Esta línea sirve para declarar el servicio que calcula niveles a partir de la experiencia.
final class XpLevelCalculator
{
    // Esta línea sirve para declarar el método que calcula el nivel para una XP total.
    public function level(int $totalXp): int
    {
        // Esta línea sirve para aplicar la fórmula: raíz cuadrada de XP/100, redondeada hacia abajo, más 1.
        return (int) floor(sqrt($totalXp / 100)) + 1;
    }

    // Esta línea sirve para declarar el método que calcula la XP necesaria para un nivel.
    public function xpForLevel(int $level): int
    {
        // Esta línea sirve para aplicar la fórmula inversa: 100 por (nivel - 1) al cuadrado.
        return 100 * ($level - 1) ** 2;
    }

    /**
     * @return array{level: int, xp_for_current_level: int, xp_for_next_level: int, progress_pct: float}
     */
    // Esta línea sirve para declarar el método que calcula el progreso hacia el siguiente nivel.
    public function progress(int $totalXp): array
    {
        // Esta línea sirve para calcular el nivel actual.
        $level = $this->level($totalXp);
        // Esta línea sirve para calcular la XP donde empieza el nivel actual.
        $xpForCurrentLevel = $this->xpForLevel($level);
        // Esta línea sirve para calcular la XP donde empieza el siguiente nivel.
        $xpForNextLevel = $this->xpForLevel($level + 1);
        // Esta línea sirve para calcular cuánta XP hay entre ambos niveles.
        $span = $xpForNextLevel - $xpForCurrentLevel;

        // Esta línea sirve para devolver el progreso.
        return [
            // Esta línea sirve para incluir el nivel.
            'level' => $level,
            // Esta línea sirve para incluir la XP del nivel actual.
            'xp_for_current_level' => $xpForCurrentLevel,
            // Esta línea sirve para incluir la XP del siguiente nivel.
            'xp_for_next_level' => $xpForNextLevel,
            // Esta línea sirve para incluir el avance entre 0 y 1 hacia el siguiente nivel.
            'progress_pct' => $span > 0 ? round(($totalXp - $xpForCurrentLevel) / $span, 4) : 1.0,
        ];
    }
}
