<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Unit\Domain\Gamification.

namespace Tests\Unit\Domain\Gamification;

// Esta línea sirve para importar la clase XpLevelCalculator.
use App\Domain\Gamification\Services\XpLevelCalculator;
// Esta línea sirve para importar la clase TestCase.
use PHPUnit\Framework\TestCase;

// Esta línea sirve para declarar la clase de tests XpLevelCalculatorTest.
class XpLevelCalculatorTest extends TestCase
{
    // Esta línea sirve para declarar el test que comprueba el nivel en los límites de XP.
    public function test_level_at_xp_boundaries(): void
    {
        // Esta línea sirve para crear el calculador.
        $calc = new XpLevelCalculator;

        // Esta línea sirve para exigir nivel 1 con 0 XP.
        $this->assertSame(1, $calc->level(0));
        // Esta línea sirve para exigir nivel 1 con 99 XP.
        $this->assertSame(1, $calc->level(99));
        // Esta línea sirve para exigir nivel 2 con 100 XP.
        $this->assertSame(2, $calc->level(100));
        // Esta línea sirve para exigir nivel 2 con 399 XP.
        $this->assertSame(2, $calc->level(399));
        // Esta línea sirve para exigir nivel 3 con 400 XP.
        $this->assertSame(3, $calc->level(400));
        // Esta línea sirve para exigir nivel 4 con 900 XP.
        $this->assertSame(4, $calc->level(900));
        // Esta línea sirve para exigir nivel 5 con 1600 XP.
        $this->assertSame(5, $calc->level(1600));
    }

    // Esta línea sirve para declarar el test que comprueba la XP necesaria para cada nivel.
    public function test_xp_for_level(): void
    {
        // Esta línea sirve para crear el calculador.
        $calc = new XpLevelCalculator;

        // Esta línea sirve para exigir 0 XP para el nivel 1.
        $this->assertSame(0, $calc->xpForLevel(1));
        // Esta línea sirve para exigir 100 XP para el nivel 2.
        $this->assertSame(100, $calc->xpForLevel(2));
        // Esta línea sirve para exigir 400 XP para el nivel 3.
        $this->assertSame(400, $calc->xpForLevel(3));
        // Esta línea sirve para exigir 900 XP para el nivel 4.
        $this->assertSame(900, $calc->xpForLevel(4));
        // Esta línea sirve para exigir 1600 XP para el nivel 5.
        $this->assertSame(1600, $calc->xpForLevel(5));
    }

    // Esta línea sirve para declarar el test que comprueba que el progreso informa nivel y porcentaje hacia el siguiente.
    public function test_progress_reports_level_and_percent_towards_next(): void
    {
        // Esta línea sirve para crear el calculador.
        $calc = new XpLevelCalculator;

        // Esta línea sirve para calcular el progreso con 150 XP.
        $progress = $calc->progress(150);

        // Esta línea sirve para exigir nivel 2.
        $this->assertSame(2, $progress['level']);
        // Esta línea sirve para exigir 100 XP para el nivel actual.
        $this->assertSame(100, $progress['xp_for_current_level']);
        // Esta línea sirve para exigir 400 XP para el siguiente.
        $this->assertSame(400, $progress['xp_for_next_level']);
        // Esta línea sirve para exigir un progreso de un sexto.
        $this->assertEqualsWithDelta(50 / 300, $progress['progress_pct'], 0.0001);
    }

    // Esta línea sirve para declarar el test que comprueba que en el límite exacto de un nivel el progreso es 0%.
    public function test_progress_at_exact_level_boundary_is_zero_pct(): void
    {
        // Esta línea sirve para crear el calculador.
        $calc = new XpLevelCalculator;

        // Esta línea sirve para calcular el progreso con 400 XP.
        $progress = $calc->progress(400);

        // Esta línea sirve para exigir nivel 3.
        $this->assertSame(3, $progress['level']);
        // Esta línea sirve para exigir 0% de progreso.
        $this->assertSame(0.0, $progress['progress_pct']);
    }
}
