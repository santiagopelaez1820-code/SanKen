<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Unit\Domain\Routine.

namespace Tests\Unit\Domain\Routine;

// Esta línea sirve para importar la clase ProgressiveOverloadCalculator.
use App\Domain\Routine\Services\ProgressiveOverloadCalculator;
// Esta línea sirve para importar la clase PerformanceSummary.
use App\Domain\Routine\ValueObjects\PerformanceSummary;
// Esta línea sirve para importar la clase TestCase.
use PHPUnit\Framework\TestCase;

// Esta línea sirve para declarar la clase de tests ProgressiveOverloadCalculatorTest.
class ProgressiveOverloadCalculatorTest extends TestCase
{
    // Esta línea sirve para declarar el método auxiliar que arma un resumen de desempeño.
    private function performance(array $overrides = []): PerformanceSummary
    {
        // Esta línea sirve para devolver el resumen con los valores indicados o por defecto.
        return new PerformanceSummary(
            // Esta línea sirve para definir las series objetivo.
            targetSets: $overrides['targetSets'] ?? 3,
            // Esta línea sirve para definir las repeticiones reales por serie.
            actualRepsPerSet: $overrides['actualRepsPerSet'] ?? [10, 9, 9],
            // Esta línea sirve para definir el peso real por serie.
            actualWeightPerSet: $overrides['actualWeightPerSet'] ?? [100.0, 100.0, 100.0],
            // Esta línea sirve para definir las repeticiones objetivo por serie.
            targetRepsPerSet: $overrides['targetRepsPerSet'] ?? null,
            // Esta línea sirve para definir si se completó como estaba planeado.
            completedAsPlanned: $overrides['completedAsPlanned'] ?? true,
        );
    }

    // Esta línea sirve para declarar el test que comprueba que coincide con el ejemplo documentado de rampa de repeticiones.
    public function test_matches_the_documented_reps_ramp_example(): void
    {
        // Esta línea sirve para crear el calculador.
        $calc = new ProgressiveOverloadCalculator;

        // Sin objetivo previo: 20kg, 10/9/9 reales -> siguiente objetivo 11/10/10, mismo peso.
        // Esta línea sirve para calcular la progresión.
        $result = $calc->calculate(
            // Esta línea sirve para pasar un desempeño de 10, 9 y 9 repeticiones con 20 kg.
            $this->performance(['actualRepsPerSet' => [10, 9, 9], 'actualWeightPerSet' => [20.0, 20.0, 20.0]]),
            // Esta línea sirve para indicar el equipamiento de barra.
            'barbell',
            // Esta línea sirve para indicar cero fallas consecutivas.
            0,
            // Esta línea sirve para indicar el piso de 8 repeticiones.
            floorReps: 8,
        );

        // Esta línea sirve para exigir que "suggestedWeightKg" sea exactamente 20.0.
        $this->assertSame(20.0, $result->suggestedWeightKg);
        // Esta línea sirve para exigir que se sugieran 11, 10 y 10 repeticiones.
        $this->assertSame([11, 10, 10], $result->suggestedRepsPerSet);
        // Esta línea sirve para exigir que "succeeded" sea verdadero.
        $this->assertTrue($result->succeeded);
        // Esta línea sirve para exigir que "weightIncreased" sea falso.
        $this->assertFalse($result->weightIncreased);
    }

    // Esta línea sirve para declarar el test que comprueba que sigue subiendo repeticiones si se cumple la meta anterior.
    public function test_ramps_reps_further_when_the_prior_target_is_met_again(): void
    {
        // Esta línea sirve para crear el calculador.
        $calc = new ProgressiveOverloadCalculator;

        // Esta línea sirve para calcular la progresión.
        $result = $calc->calculate(
            // Esta línea sirve para pasar un desempeño que cumple la meta anterior.
            $this->performance([
                // Esta línea sirve para asignar [11, 10, 10] al campo "targetRepsPerSet".
                'targetRepsPerSet' => [11, 10, 10],
                // Esta línea sirve para asignar [11, 10, 10] al campo "actualRepsPerSet".
                'actualRepsPerSet' => [11, 10, 10],
                // Esta línea sirve para asignar [20.0, 20.0, 20.0] al campo "actualWeightPerSet".
                'actualWeightPerSet' => [20.0, 20.0, 20.0],
            ]),
            // Esta línea sirve para indicar el equipamiento de barra.
            'barbell',
            // Esta línea sirve para indicar cero fallas consecutivas.
            0,
            // Esta línea sirve para indicar el piso de 8 repeticiones.
            floorReps: 8,
        );

        // Esta línea sirve para exigir que se sugieran 12, 11 y 11 repeticiones.
        $this->assertSame([12, 11, 11], $result->suggestedRepsPerSet);
        // Esta línea sirve para exigir que "suggestedWeightKg" sea exactamente 20.0.
        $this->assertSame(20.0, $result->suggestedWeightKg);
        // Esta línea sirve para exigir que "weightIncreased" sea falso.
        $this->assertFalse($result->weightIncreased);
    }

    // Esta línea sirve para declarar el test que comprueba que superar la meta solo sube una repetición sobre lo real.
    public function test_exceeding_the_target_still_only_ramps_by_one_from_the_actual(): void
    {
        // Esta línea sirve para crear el calculador.
        $calc = new ProgressiveOverloadCalculator;

        // Esta línea sirve para calcular la progresión.
        $result = $calc->calculate(
            // Esta línea sirve para pasar un desempeño que supera la meta.
            $this->performance([
                // Esta línea sirve para asignar [8, 8, 8] al campo "targetRepsPerSet".
                'targetRepsPerSet' => [8, 8, 8],
                // Esta línea sirve para asignar [10, 9, 9] al campo "actualRepsPerSet".
                'actualRepsPerSet' => [10, 9, 9],
                // Esta línea sirve para asignar [100.0, 100.0, 100.0] al campo "actualWeightPerSet".
                'actualWeightPerSet' => [100.0, 100.0, 100.0],
            ]),
            // Esta línea sirve para indicar el equipamiento de barra.
            'barbell',
            // Esta línea sirve para indicar cero fallas consecutivas.
            0,
            // Esta línea sirve para indicar el piso de 8 repeticiones.
            floorReps: 8,
        );

        // Esta línea sirve para exigir que se sugieran 11, 10 y 10 repeticiones.
        $this->assertSame([11, 10, 10], $result->suggestedRepsPerSet);
    }

    // Esta línea sirve para declarar el test que comprueba que el peso solo sube si el techo ya era la meta y se cumple otra vez.
    public function test_weight_only_increases_once_the_ceiling_was_already_the_target_and_gets_met_again(): void
    {
        // Esta línea sirve para crear el calculador.
        $calc = new ProgressiveOverloadCalculator;

        // Esta línea sirve para calcular la progresión.
        $result = $calc->calculate(
            // Esta línea sirve para pasar un desempeño que cumple el techo.
            $this->performance([
                // Esta línea sirve para asignar [12, 12, 12] al campo "targetRepsPerSet".
                'targetRepsPerSet' => [12, 12, 12],
                // Esta línea sirve para asignar [12, 12, 12] al campo "actualRepsPerSet".
                'actualRepsPerSet' => [12, 12, 12],
                // Esta línea sirve para asignar [100.0, 100.0, 100.0] al campo "actualWeightPerSet".
                'actualWeightPerSet' => [100.0, 100.0, 100.0],
            ]),
            // Esta línea sirve para indicar el equipamiento de barra.
            'barbell',
            // Esta línea sirve para indicar cero fallas consecutivas.
            0,
            // Esta línea sirve para indicar el piso de 8 repeticiones.
            floorReps: 8,
        );

        // Esta línea sirve para exigir que "suggestedWeightKg" sea exactamente 102.5.
        $this->assertSame(102.5, $result->suggestedWeightKg);
        // Esta línea sirve para exigir que "weightIncreased" sea verdadero.
        $this->assertTrue($result->weightIncreased);
        // Las reps vuelven al piso del rango original al subir de peso.
        // Esta línea sirve para exigir que las repeticiones vuelvan a 8, 8 y 8.
        $this->assertSame([8, 8, 8], $result->suggestedRepsPerSet);
    }

    // Esta línea sirve para declarar el test que comprueba que las repeticiones nunca pasan del techo de doce.
    public function test_reps_never_ramp_past_the_ceiling_of_twelve(): void
    {
        // Esta línea sirve para crear el calculador.
        $calc = new ProgressiveOverloadCalculator;

        // Esta línea sirve para calcular la progresión.
        $result = $calc->calculate(
            // Esta línea sirve para pasar un desempeño en el techo.
            $this->performance([
                // Esta línea sirve para asignar [11, 11, 11] al campo "targetRepsPerSet".
                'targetRepsPerSet' => [11, 11, 11],
                // Esta línea sirve para asignar [15, 12, 20] al campo "actualRepsPerSet".
                'actualRepsPerSet' => [15, 12, 20],
                // Esta línea sirve para asignar [100.0, 100.0, 100.0] al campo "actualWeightPerSet".
                'actualWeightPerSet' => [100.0, 100.0, 100.0],
            ]),
            // Esta línea sirve para indicar el equipamiento de barra.
            'barbell',
            // Esta línea sirve para indicar cero fallas consecutivas.
            0,
            // Esta línea sirve para indicar el piso de 8 repeticiones.
            floorReps: 8,
        );

        // Esta línea sirve para exigir que se sugieran 12, 12 y 12 repeticiones.
        $this->assertSame([12, 12, 12], $result->suggestedRepsPerSet);
        // Esta línea sirve para exigir que "weightIncreased" sea falso.
        $this->assertFalse($result->weightIncreased);
    }

    // Esta línea sirve para declarar el test que comprueba que mantiene la meta sin bajar carga si una serie se queda corta.
    public function test_holds_the_same_target_without_deloading_when_a_set_falls_short(): void
    {
        // Esta línea sirve para crear el calculador.
        $calc = new ProgressiveOverloadCalculator;

        // Esta línea sirve para calcular la progresión.
        $result = $calc->calculate(
            // Esta línea sirve para pasar un desempeño con una serie corta.
            $this->performance([
                // Esta línea sirve para asignar [8, 8, 8] al campo "targetRepsPerSet".
                'targetRepsPerSet' => [8, 8, 8],
                // Esta línea sirve para asignar [7, 8, 8] al campo "actualRepsPerSet".
                'actualRepsPerSet' => [7, 8, 8],
                // Esta línea sirve para asignar [100.0, 100.0, 100.0] al campo "actualWeightPerSet".
                'actualWeightPerSet' => [100.0, 100.0, 100.0],
            ]),
            // Esta línea sirve para indicar el equipamiento de barra.
            'barbell',
            // Esta línea sirve para indicar cero fallas consecutivas.
            0,
            // Esta línea sirve para indicar el piso de 8 repeticiones.
            floorReps: 8,
        );

        // Esta línea sirve para exigir que "succeeded" sea falso.
        $this->assertFalse($result->succeeded);
        // Esta línea sirve para exigir que se mantengan 8, 8 y 8 repeticiones.
        $this->assertSame([8, 8, 8], $result->suggestedRepsPerSet);
        // Esta línea sirve para exigir que "suggestedWeightKg" sea exactamente 100.0.
        $this->assertSame(100.0, $result->suggestedWeightKg);
        // Esta línea sirve para exigir que "consecutiveFailures" sea exactamente 1.
        $this->assertSame(1, $result->consecutiveFailures);
    }

    // Esta línea sirve para declarar el test que comprueba que mantiene la meta si se completaron menos series que el objetivo.
    public function test_holds_when_fewer_sets_were_completed_than_the_target(): void
    {
        // Esta línea sirve para crear el calculador.
        $calc = new ProgressiveOverloadCalculator;

        // Esta línea sirve para calcular la progresión.
        $result = $calc->calculate(
            // Esta línea sirve para pasar un desempeño con menos series.
            $this->performance([
                // Esta línea sirve para asignar [8, 8, 8] al campo "targetRepsPerSet".
                'targetRepsPerSet' => [8, 8, 8],
                // Esta línea sirve para asignar [10, 9] al campo "actualRepsPerSet".
                'actualRepsPerSet' => [10, 9],
                // Esta línea sirve para asignar [100.0, 100.0] al campo "actualWeightPerSet".
                'actualWeightPerSet' => [100.0, 100.0],
            ]),
            // Esta línea sirve para indicar el equipamiento de barra.
            'barbell',
            // Esta línea sirve para indicar cero fallas consecutivas.
            0,
            // Esta línea sirve para indicar el piso de 8 repeticiones.
            floorReps: 8,
        );

        // Esta línea sirve para exigir que "succeeded" sea falso.
        $this->assertFalse($result->succeeded);
        // Esta línea sirve para exigir que se mantengan 8, 8 y 8 repeticiones.
        $this->assertSame([8, 8, 8], $result->suggestedRepsPerSet);
    }

    // Esta línea sirve para declarar el test que comprueba que un primer intento corto empieza la rampa en el piso original.
    public function test_first_attempt_ever_that_falls_short_starts_the_ramp_at_the_original_floor(): void
    {
        // Esta línea sirve para crear el calculador.
        $calc = new ProgressiveOverloadCalculator;

        // Primera vez con este ejercicio (sin objetivo previo) y no llega a
        // completar las 3 series -- no hay "objetivo previo" que sostener,
        // así que el próximo objetivo arranca en el piso del rango original.
        // Esta línea sirve para calcular la progresión.
        $result = $calc->calculate(
            // Esta línea sirve para pasar un desempeño de un primer intento corto.
            $this->performance([
                // Esta línea sirve para asignar null al campo "targetRepsPerSet".
                'targetRepsPerSet' => null,
                // Esta línea sirve para asignar [10, 9] al campo "actualRepsPerSet".
                'actualRepsPerSet' => [10, 9],
                // Esta línea sirve para asignar [100.0, 100.0] al campo "actualWeightPerSet".
                'actualWeightPerSet' => [100.0, 100.0],
            ]),
            // Esta línea sirve para indicar el equipamiento de barra.
            'barbell',
            // Esta línea sirve para indicar cero fallas consecutivas.
            0,
            // Esta línea sirve para indicar el piso de 8 repeticiones.
            floorReps: 8,
        );

        // Esta línea sirve para exigir que "succeeded" sea falso.
        $this->assertFalse($result->succeeded);
        // Esta línea sirve para exigir que se sugieran 8, 8 y 8 repeticiones.
        $this->assertSame([8, 8, 8], $result->suggestedRepsPerSet);
        // Esta línea sirve para exigir que "suggestedWeightKg" sea exactamente 100.0.
        $this->assertSame(100.0, $result->suggestedWeightKg);
    }

    // Esta línea sirve para declarar el test que comprueba que las fallas consecutivas siguen sumando sin bajar carga.
    public function test_consecutive_failures_keep_incrementing_without_ever_deloading(): void
    {
        // Esta línea sirve para crear el calculador.
        $calc = new ProgressiveOverloadCalculator;

        // Esta línea sirve para calcular la progresión.
        $result = $calc->calculate(
            // Esta línea sirve para pasar un desempeño por debajo de la meta.
            $this->performance(['targetRepsPerSet' => [8, 8, 8], 'actualRepsPerSet' => [7, 7, 7]]),
            // Esta línea sirve para indicar el equipamiento de barra.
            'barbell',
            // Esta línea sirve para indicar cinco fallas consecutivas.
            5,
            // Esta línea sirve para indicar el piso de 8 repeticiones.
            floorReps: 8,
        );

        // Esta línea sirve para exigir que "consecutiveFailures" sea exactamente 6.
        $this->assertSame(6, $result->consecutiveFailures);
        // Esta línea sirve para exigir que "suggestedWeightKg" sea exactamente 100.0.
        $this->assertSame(100.0, $result->suggestedWeightKg);
    }

    // Esta línea sirve para declarar el test que comprueba que no avanza si el usuario dice que no pudo completarlo como estaba planeado.
    public function test_never_advances_when_the_user_reports_they_could_not_complete_it_as_planned(): void
    {
        // Esta línea sirve para crear el calculador.
        $calc = new ProgressiveOverloadCalculator;

        // Sobre el papel completó series y reps, pero respondió "No" al feedback:
        // la regla de negocio manda sobre los números.
        // Esta línea sirve para calcular la progresión.
        $result = $calc->calculate(
            // Esta línea sirve para pasar un desempeño marcado como no completado.
            $this->performance([
                // Esta línea sirve para asignar false al campo "completedAsPlanned".
                'completedAsPlanned' => false,
                // Esta línea sirve para asignar [8, 8, 8] al campo "targetRepsPerSet".
                'targetRepsPerSet' => [8, 8, 8],
                // Esta línea sirve para asignar [10, 10, 10] al campo "actualRepsPerSet".
                'actualRepsPerSet' => [10, 10, 10],
            ]),
            // Esta línea sirve para indicar el equipamiento de barra.
            'barbell',
            // Esta línea sirve para indicar cero fallas consecutivas.
            0,
            // Esta línea sirve para indicar el piso de 8 repeticiones.
            floorReps: 8,
        );

        // Esta línea sirve para exigir que "succeeded" sea falso.
        $this->assertFalse($result->succeeded);
        // Esta línea sirve para exigir que se mantengan 8, 8 y 8 repeticiones.
        $this->assertSame([8, 8, 8], $result->suggestedRepsPerSet);
    }

    // Esta línea sirve para declarar el test que comprueba que con mancuernas los incrementos son menores que con barra.
    public function test_uses_smaller_increments_for_dumbbells_than_barbells(): void
    {
        // Esta línea sirve para crear el calculador.
        $calc = new ProgressiveOverloadCalculator;
        // Esta línea sirve para definir un desempeño en el techo de repeticiones.
        $atCeiling = ['targetRepsPerSet' => [12, 12, 12], 'actualRepsPerSet' => [12, 12, 12], 'actualWeightPerSet' => [20.0, 20.0, 20.0]];

        // Esta línea sirve para calcular la progresión con barra.
        $barbell = $calc->calculate($this->performance($atCeiling), 'barbell', 0, floorReps: 8);
        // Esta línea sirve para calcular la progresión con mancuernas.
        $dumbbell = $calc->calculate($this->performance($atCeiling), 'dumbbells', 0, floorReps: 8);

        // Esta línea sirve para exigir que "suggestedWeightKg" sea exactamente 22.5.
        $this->assertSame(22.5, $barbell->suggestedWeightKg);
        // Esta línea sirve para exigir que "suggestedWeightKg" sea exactamente 21.0.
        $this->assertSame(21.0, $dumbbell->suggestedWeightKg);
    }

    // Esta línea sirve para declarar el test que comprueba que los ejercicios de peso corporal nunca sugieren peso.
    public function test_bodyweight_exercises_never_suggest_a_weight(): void
    {
        // Esta línea sirve para crear el calculador.
        $calc = new ProgressiveOverloadCalculator;

        // Esta línea sirve para calcular la progresión.
        $result = $calc->calculate(
            // Esta línea sirve para pasar un desempeño en el techo.
            $this->performance([
                // Esta línea sirve para asignar [12, 12, 12] al campo "targetRepsPerSet".
                'targetRepsPerSet' => [12, 12, 12],
                // Esta línea sirve para asignar [12, 12, 12] al campo "actualRepsPerSet".
                'actualRepsPerSet' => [12, 12, 12],
                // Esta línea sirve para asignar [0.0, 0.0, 0.0] al campo "actualWeightPerSet".
                'actualWeightPerSet' => [0.0, 0.0, 0.0],
            ]),
            // Esta línea sirve para indicar el equipamiento de solo peso corporal.
            'bodyweight_only',
            // Esta línea sirve para indicar cero fallas consecutivas.
            0,
            // Esta línea sirve para indicar el piso de 8 repeticiones.
            floorReps: 8,
        );

        // Esta línea sirve para exigir que "suggestedWeightKg" sea exactamente 0.0.
        $this->assertSame(0.0, $result->suggestedWeightKg);
    }
}
