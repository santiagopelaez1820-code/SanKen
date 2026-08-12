<?php

namespace Tests\Unit\Domain\Admin;

use App\Domain\Admin\Services\GlobalMetricsCalculator;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GlobalMetricsCalculatorTest extends TestCase
{
    use RefreshDatabase;

    public function test_retention_is_zero_when_the_cohort_is_empty(): void
    {
        $now = CarbonImmutable::now();

        $metrics = (new GlobalMetricsCalculator)->calculate($now);

        $this->assertSame(0.0, $metrics['retention_pct']);
    }

    public function test_retention_is_the_percentage_of_the_cohort_still_active_in_the_last_7_days(): void
    {
        $now = CarbonImmutable::now();

        // Cohort: creados hace 30-37 días.
        User::factory()->create(['created_at' => $now->subDays(33), 'last_active_at' => $now->subDays(2)]); // retenido
        User::factory()->create(['created_at' => $now->subDays(35), 'last_active_at' => $now->subDays(20)]); // no retenido
        User::factory()->create(['created_at' => $now->subDays(31), 'last_active_at' => null]); // no retenido
        // Fuera del cohort (demasiado reciente) — no debe contar ni a favor ni en contra.
        User::factory()->create(['created_at' => $now->subDays(5), 'last_active_at' => $now]);

        $metrics = (new GlobalMetricsCalculator)->calculate($now);

        $this->assertSame(33.3, $metrics['retention_pct']);
    }

    public function test_dau_wau_mau_use_the_right_windows(): void
    {
        $now = CarbonImmutable::now();

        User::factory()->create(['last_active_at' => $now]); // dau+wau+mau
        User::factory()->create(['last_active_at' => $now->subDays(3)]); // wau+mau
        User::factory()->create(['last_active_at' => $now->subDays(20)]); // mau only
        User::factory()->create(['last_active_at' => $now->subDays(40)]); // none
        User::factory()->create(['last_active_at' => null]); // none

        $metrics = (new GlobalMetricsCalculator)->calculate($now);

        $this->assertSame(1, $metrics['dau']);
        $this->assertSame(2, $metrics['wau']);
        $this->assertSame(3, $metrics['mau']);
    }
}
