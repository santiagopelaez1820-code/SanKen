<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Unit\Domain\Workout.

namespace Tests\Unit\Domain\Workout;

// Esta línea sirve para importar la clase SessionReadinessAdjuster.
use App\Domain\Workout\Services\SessionReadinessAdjuster;
// Esta línea sirve para importar la clase TestCase.
use PHPUnit\Framework\TestCase;

// Esta línea sirve para declarar la clase de tests SessionReadinessAdjusterTest.
class SessionReadinessAdjusterTest extends TestCase
{
    // Esta línea sirve para declarar el test que comprueba que sin respuestas del precheck no hay ajuste.
    public function test_no_precheck_answers_means_no_adjustment(): void
    {
        // Esta línea sirve para crear el ajustador.
        $adjuster = new SessionReadinessAdjuster;

        // Esta línea sirve para calcular el ajuste sin respuestas para un principiante.
        $adjustment = $adjuster->adjustmentFor([], 'beginner');

        // Esta línea sirve para exigir que el ajuste sea neutro.
        $this->assertTrue($adjustment->isNeutral());
        // Esta línea sirve para exigir que "note" sea null.
        $this->assertNull($adjustment->note);
    }

    // Esta línea sirve para declarar el test que comprueba que respuestas buenas no ajustan sin importar el nivel.
    public function test_good_precheck_answers_mean_no_adjustment_regardless_of_level(): void
    {
        // Esta línea sirve para crear el ajustador.
        $adjuster = new SessionReadinessAdjuster;

        // Esta línea sirve para calcular el ajuste.
        $adjustment = $adjuster->adjustmentFor(
            // Esta línea sirve para pasar respuestas buenas.
            ['sleep_quality' => 5, 'energy_level' => 4, 'muscle_soreness' => 1],
            // Esta línea sirve para indicar el nivel avanzado.
            'advanced',
        );

        // Esta línea sirve para exigir que el ajuste sea neutro.
        $this->assertTrue($adjustment->isNeutral());
    }

    // Esta línea sirve para declarar el test que comprueba que una señal baja recorta a un principiante pero casi no toca a un avanzado.
    public function test_a_single_low_signal_still_trims_a_beginner_but_barely_touches_an_advanced_user(): void
    {
        // Esta línea sirve para crear el ajustador.
        $adjuster = new SessionReadinessAdjuster;
        // Esta línea sirve para definir un precheck con una señal baja.
        $precheck = ['sleep_quality' => 2, 'energy_level' => 4, 'muscle_soreness' => 2];

        // Esta línea sirve para calcular el ajuste del principiante.
        $beginner = $adjuster->adjustmentFor($precheck, 'beginner');
        // Esta línea sirve para calcular el ajuste del avanzado.
        $advanced = $adjuster->adjustmentFor($precheck, 'advanced');

        // Esta línea sirve para exigir que "setsDelta" sea exactamente -1.
        $this->assertSame(-1, $beginner->setsDelta);
        // Esta línea sirve para exigir que "weightMultiplier" sea exactamente 0.90.
        $this->assertSame(0.90, $beginner->weightMultiplier);
        // Esta línea sirve para exigir que "note" no sea null.
        $this->assertNotNull($beginner->note);

        // Esta línea sirve para exigir que "setsDelta" sea exactamente 0.
        $this->assertSame(0, $advanced->setsDelta);
        // Esta línea sirve para exigir que "weightMultiplier" sea exactamente 0.95.
        $this->assertSame(0.95, $advanced->weightMultiplier);
    }

    // Esta línea sirve para declarar el test que comprueba que dos o más señales bajas recortan a todos los niveles, menos al avanzado.
    public function test_two_or_more_low_signals_trim_every_level_but_advanced_less_than_beginner(): void
    {
        // Esta línea sirve para crear el ajustador.
        $adjuster = new SessionReadinessAdjuster;
        // Esta línea sirve para definir un precheck con varias señales bajas.
        $precheck = ['sleep_quality' => 1, 'energy_level' => 2, 'muscle_soreness' => 5];

        // Esta línea sirve para calcular el ajuste del principiante.
        $beginner = $adjuster->adjustmentFor($precheck, 'beginner');
        // Esta línea sirve para calcular el ajuste del intermedio.
        $intermediate = $adjuster->adjustmentFor($precheck, 'intermediate');
        // Esta línea sirve para calcular el ajuste del avanzado.
        $advanced = $adjuster->adjustmentFor($precheck, 'advanced');

        // Esta línea sirve para exigir que "setsDelta" sea exactamente -1.
        $this->assertSame(-1, $beginner->setsDelta);
        // Esta línea sirve para exigir que "weightMultiplier" sea exactamente 0.80.
        $this->assertSame(0.80, $beginner->weightMultiplier);

        // Esta línea sirve para exigir que "setsDelta" sea exactamente -1.
        $this->assertSame(-1, $intermediate->setsDelta);
        // Esta línea sirve para exigir que "weightMultiplier" sea exactamente 0.85.
        $this->assertSame(0.85, $intermediate->weightMultiplier);

        // Esta línea sirve para exigir que "setsDelta" sea exactamente -1.
        $this->assertSame(-1, $advanced->setsDelta);
        // Esta línea sirve para exigir que "weightMultiplier" sea exactamente 0.90.
        $this->assertSame(0.90, $advanced->weightMultiplier);
    }

    // Esta línea sirve para declarar el test que comprueba que la nota nombra los motivos que se activaron.
    public function test_note_names_the_specific_reasons_that_triggered(): void
    {
        // Esta línea sirve para crear el ajustador.
        $adjuster = new SessionReadinessAdjuster;

        // Esta línea sirve para obtener la nota del ajuste por poco sueño.
        $note = $adjuster->adjustmentFor(['sleep_quality' => 1], 'intermediate')->note;

        // Esta línea sirve para exigir que mencione el poco sueño.
        $this->assertStringContainsString('dormiste poco', $note);
        // Esta línea sirve para exigir que no mencione la energía.
        $this->assertStringNotContainsString('energía', $note);
        // Esta línea sirve para exigir que no mencione el dolor muscular.
        $this->assertStringNotContainsString('dolor muscular', $note);
    }

    // Esta línea sirve para declarar el test que comprueba que ajustar un ejercicio nunca baja las series de una.
    public function test_adjust_exercise_never_drops_sets_below_one(): void
    {
        // Esta línea sirve para crear el ajustador.
        $adjuster = new SessionReadinessAdjuster;
        // Esta línea sirve para calcular el ajuste del principiante con precheck malo.
        $adjustment = $adjuster->adjustmentFor(['sleep_quality' => 1, 'energy_level' => 1], 'beginner');

        // Esta línea sirve para exigir que una serie siga siendo una.
        $this->assertSame(1, $adjuster->adjustExercise(1, null, null, null, $adjustment)['targetSets']);
        // Esta línea sirve para exigir que tres series bajen a dos.
        $this->assertSame(2, $adjuster->adjustExercise(3, null, null, null, $adjustment)['targetSets']);
    }

    /**
     * Este es el caso que un método `applyRepsPerSet` separado podía romper
     * si el caller le pasaba el targetSets original en vez del ya recortado
     * (ver el docblock de adjustExercise) — acá se prueba junto, como se usa
     * de verdad: el recorte de reps tiene que reflejar el targetSets QUE
     * DEVUELVE la misma llamada, no el original de 3.
     */
    // Esta línea sirve para declarar el test que comprueba que ajustar un ejercicio recorta las repeticiones a sus series ajustadas.
    public function test_adjust_exercise_truncates_reps_per_set_to_its_own_adjusted_target_sets(): void
    {
        // Esta línea sirve para crear el ajustador.
        $adjuster = new SessionReadinessAdjuster;
        // Esta línea sirve para calcular el ajuste del principiante con precheck malo.
        $adjustment = $adjuster->adjustmentFor(['sleep_quality' => 1, 'energy_level' => 1], 'beginner');

        // Esta línea sirve para ajustar un ejercicio de tres series.
        $result = $adjuster->adjustExercise(3, [10, 10, 12], null, null, $adjustment);

        // Esta línea sirve para exigir que queden 2 series.
        $this->assertSame(2, $result['targetSets']);
        // Esta línea sirve para exigir que las repeticiones se recorten a dos.
        $this->assertSame([10, 10], $result['repsPerSet']);
    }

    // Esta línea sirve para declarar el test que comprueba que ajustar respeta los nulos y el piso de RPE.
    public function test_adjust_exercise_respects_nulls_and_the_rpe_floor(): void
    {
        // Esta línea sirve para crear el ajustador.
        $adjuster = new SessionReadinessAdjuster;
        // Esta línea sirve para calcular el ajuste del principiante con precheck malo.
        $adjustment = $adjuster->adjustmentFor(['sleep_quality' => 1, 'energy_level' => 1], 'beginner');

        // Esta línea sirve para ajustar un ejercicio con valores.
        $withValues = $adjuster->adjustExercise(3, [10, 10, 10], 100.0, 6.0, $adjustment);
        // Esta línea sirve para exigir que el peso baje a 80.
        $this->assertSame(80.0, $withValues['weightKg']);
        // Esta línea sirve para exigir que el RPE baje a 5.
        $this->assertSame(5.0, $withValues['rpe']);

        // Esta línea sirve para ajustar un ejercicio con valores nulos.
        $withNulls = $adjuster->adjustExercise(3, null, null, null, $adjustment);
        // Esta línea sirve para exigir que las repeticiones sigan en null.
        $this->assertNull($withNulls['repsPerSet']);
        // Esta línea sirve para exigir que el peso siga en null.
        $this->assertNull($withNulls['weightKg']);
        // Esta línea sirve para exigir que el RPE siga en null.
        $this->assertNull($withNulls['rpe']);
    }

    // Esta línea sirve para declarar el test que comprueba que ajustar no hace nada si el ajuste es neutro.
    public function test_adjust_exercise_is_a_no_op_when_the_adjustment_is_neutral(): void
    {
        // Esta línea sirve para crear el ajustador.
        $adjuster = new SessionReadinessAdjuster;
        // Esta línea sirve para calcular un ajuste neutro.
        $neutral = $adjuster->adjustmentFor([], 'beginner');

        // Esta línea sirve para ajustar un ejercicio con el ajuste neutro.
        $result = $adjuster->adjustExercise(3, [10, 10, 10], 100.0, 8.0, $neutral);

        // Esta línea sirve para exigir que las series no cambien.
        $this->assertSame(3, $result['targetSets']);
        // Esta línea sirve para exigir que las repeticiones no cambien.
        $this->assertSame([10, 10, 10], $result['repsPerSet']);
        // Esta línea sirve para exigir que el peso no cambie.
        $this->assertSame(100.0, $result['weightKg']);
        // Esta línea sirve para exigir que el RPE no cambie.
        $this->assertSame(8.0, $result['rpe']);
    }
}
