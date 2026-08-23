<?php

namespace Tests\Feature\Progress;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BodyMeasurementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_log_a_measurement(): void
    {
        $this->postJson('/api/v1/body-measurements', ['weight_kg' => 80])->assertUnauthorized();
    }

    public function test_user_can_log_a_measurement(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/body-measurements', [
            'weight_kg' => 82.5,
            'body_fat_pct' => 18.2,
            'measured_at' => '2026-08-01',
        ]);

        $response->assertCreated();
        $response->assertJsonPath('data.weight_kg', 82.5);
        $response->assertJsonPath('data.measured_at', '2026-08-01');
        $this->assertDatabaseHas('body_measurements', ['user_id' => $user->id, 'weight_kg' => 82.5]);
    }

    public function test_measured_at_defaults_to_today_when_omitted(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/body-measurements', ['weight_kg' => 80]);

        $response->assertCreated();
        $response->assertJsonPath('data.measured_at', now()->toDateString());
    }

    public function test_at_least_one_metric_is_required(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/body-measurements', []);

        $response->assertUnprocessable();
    }

    public function test_history_is_paginated_and_ordered_by_most_recent_first(): void
    {
        $user = User::factory()->create();
        $client = $this->actingAs($user, 'sanctum');

        $client->postJson('/api/v1/body-measurements', ['weight_kg' => 80, 'measured_at' => '2026-07-01']);
        $client->postJson('/api/v1/body-measurements', ['weight_kg' => 79, 'measured_at' => '2026-08-01']);

        $response = $client->getJson('/api/v1/body-measurements');

        $response->assertOk();
        $response->assertJsonPath('data.0.measured_at', '2026-08-01');
        $response->assertJsonPath('data.1.measured_at', '2026-07-01');
        $response->assertJsonPath('meta.total', 2);
    }

    public function test_user_only_sees_their_own_measurements(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $this->actingAs($owner, 'sanctum')->postJson('/api/v1/body-measurements', ['weight_kg' => 80]);

        $response = $this->actingAs($other, 'sanctum')->getJson('/api/v1/body-measurements');

        $response->assertOk();
        $response->assertJsonPath('meta.total', 0);
    }
}
