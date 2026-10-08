<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Unit\Domain\Admin.

namespace Tests\Unit\Domain\Admin;

// Esta línea sirve para importar la clase GlobalMetricsCalculator.
use App\Domain\Admin\Services\GlobalMetricsCalculator;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar la clase CarbonImmutable.
use Carbon\CarbonImmutable;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests GlobalMetricsCalculatorTest.
class GlobalMetricsCalculatorTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el test que comprueba que la retención es cero si la cohorte está vacía.
    public function test_retention_is_zero_when_the_cohort_is_empty(): void
    {
        // Esta línea sirve para tomar el momento actual.
        $now = CarbonImmutable::now();

        // Esta línea sirve para calcular las métricas.
        $metrics = (new GlobalMetricsCalculator)->calculate($now);

        // Esta línea sirve para exigir que la retención sea 0.
        $this->assertSame(0.0, $metrics['retention_pct']);
    }

    // Esta línea sirve para declarar el test que comprueba que la retención es el porcentaje de la cohorte activo en los últimos 7 días.
    public function test_retention_is_the_percentage_of_the_cohort_still_active_in_the_last_7_days(): void
    {
        // Esta línea sirve para tomar el momento actual.
        $now = CarbonImmutable::now();

        // Cohort: creados hace 30-37 días.
        // Esta línea sirve para crear un usuario retenido.
        User::factory()->create(['created_at' => $now->subDays(33), 'last_active_at' => $now->subDays(2)]); // retenido
        // Esta línea sirve para crear un usuario no retenido por inactividad.
        User::factory()->create(['created_at' => $now->subDays(35), 'last_active_at' => $now->subDays(20)]); // no retenido
        // Esta línea sirve para crear un usuario no retenido que nunca volvió.
        User::factory()->create(['created_at' => $now->subDays(31), 'last_active_at' => null]); // no retenido
        // Fuera del cohort (demasiado reciente) — no debe contar ni a favor ni en contra.
        // Esta línea sirve para crear un usuario nuevo que no entra a la cohorte.
        User::factory()->create(['created_at' => $now->subDays(5), 'last_active_at' => $now]);

        // Esta línea sirve para calcular las métricas.
        $metrics = (new GlobalMetricsCalculator)->calculate($now);

        // Esta línea sirve para exigir que la retención sea 33,3.
        $this->assertSame(33.3, $metrics['retention_pct']);
    }

    // Esta línea sirve para declarar el test que comprueba que DAU, WAU y MAU usan las ventanas correctas.
    public function test_dau_wau_mau_use_the_right_windows(): void
    {
        // Esta línea sirve para tomar el momento actual.
        $now = CarbonImmutable::now();

        // Esta línea sirve para crear un usuario activo hoy.
        User::factory()->create(['last_active_at' => $now]); // dau+wau+mau
        // Esta línea sirve para crear un usuario activo esta semana.
        User::factory()->create(['last_active_at' => $now->subDays(3)]); // wau+mau
        // Esta línea sirve para crear un usuario activo este mes.
        User::factory()->create(['last_active_at' => $now->subDays(20)]); // mau only
        // Esta línea sirve para crear un usuario sin actividad reciente.
        User::factory()->create(['last_active_at' => $now->subDays(40)]); // none
        // Esta línea sirve para crear un usuario sin actividad registrada.
        User::factory()->create(['last_active_at' => null]); // none

        // Esta línea sirve para calcular las métricas.
        $metrics = (new GlobalMetricsCalculator)->calculate($now);

        // Esta línea sirve para exigir 1 usuario activo hoy.
        $this->assertSame(1, $metrics['dau']);
        // Esta línea sirve para exigir 2 activos en la semana.
        $this->assertSame(2, $metrics['wau']);
        // Esta línea sirve para exigir 3 activos en el mes.
        $this->assertSame(3, $metrics['mau']);
    }
}
