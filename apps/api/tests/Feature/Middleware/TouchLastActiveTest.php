<?php

namespace Tests\Feature\Middleware;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class TouchLastActiveTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_authenticated_request_stamps_last_active_at(): void
    {
        $user = User::factory()->create(['last_active_at' => null]);

        $this->actingAs($user, 'sanctum')->getJson('/api/v1/exercises')->assertOk();

        $this->assertNotNull($user->fresh()->last_active_at);
    }

    public function test_it_does_not_rewrite_last_active_at_within_the_5_minute_window(): void
    {
        $user = User::factory()->create(['last_active_at' => Carbon::now()->subMinutes(2)]);
        // La columna es `timestamp` (precisión de segundo) — comparar
        // contra el valor ya truncado que devolvió la DB, no contra el
        // Carbon original con microsegundos, para no comparar peras con
        // manzanas.
        $recent = $user->fresh()->last_active_at;

        $this->actingAs($user, 'sanctum')->getJson('/api/v1/exercises')->assertOk();

        $this->assertTrue($user->fresh()->last_active_at->equalTo($recent));
    }

    public function test_it_refreshes_last_active_at_once_the_5_minute_window_has_passed(): void
    {
        $stale = Carbon::now()->subMinutes(10);
        $user = User::factory()->create(['last_active_at' => $stale]);

        $this->actingAs($user, 'sanctum')->getJson('/api/v1/exercises')->assertOk();

        $this->assertTrue($user->fresh()->last_active_at->gt($stale));
    }
}
