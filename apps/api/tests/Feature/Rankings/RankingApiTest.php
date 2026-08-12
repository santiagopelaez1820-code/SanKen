<?php

namespace Tests\Feature\Rankings;

use App\Application\Rankings\Actions\RecalculateRankingsAction;
use App\Models\City;
use App\Models\User;
use App\Models\UserStatsDaily;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RankingApiTest extends TestCase
{
    use RefreshDatabase;

    private function makeOptedInUser(array $profileAttrs = [], float $totalVolumeKg = 1000): User
    {
        $user = User::factory()->create(['is_public_profile' => true]);
        $user->profile()->create(array_merge(['age' => 30, 'sex' => 'male', 'weight_kg' => 80], $profileAttrs));
        UserStatsDaily::query()->create([
            'user_id' => $user->id, 'stat_date' => now()->toDateString(), 'total_volume_kg' => $totalVolumeKg,
        ]);

        return $user;
    }

    public function test_unauthenticated_request_is_rejected(): void
    {
        $this->getJson('/api/v1/rankings?scope=global')->assertUnauthorized();
    }

    public function test_invalid_scope_is_rejected(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/rankings?scope=made_up')
            ->assertUnprocessable();
    }

    public function test_global_scope_returns_opted_in_users_ranked_by_volume(): void
    {
        $viewer = $this->makeOptedInUser([], 1500);
        $this->makeOptedInUser([], 2000);
        RecalculateRankingsAction::dispatchSync();

        $response = $this->actingAs($viewer, 'sanctum')->getJson('/api/v1/rankings?scope=global');

        $response->assertOk();
        $response->assertJsonPath('data.scope', 'global');
        $response->assertJsonCount(2, 'data.entries');
        $response->assertJsonPath('data.entries.0.rank', 1);
        $response->assertJsonPath('data.viewer.rank', 2);
        $response->assertJsonPath('data.viewer.is_viewer', true);
    }

    public function test_city_scope_returns_city_name_as_label(): void
    {
        $city = City::factory()->create(['name' => 'Rosario']);
        $viewer = $this->makeOptedInUser(['city_id' => $city->id]);
        RecalculateRankingsAction::dispatchSync();

        $response = $this->actingAs($viewer, 'sanctum')->getJson('/api/v1/rankings?scope=city');

        $response->assertOk();
        $response->assertJsonPath('data.scope_label', 'Rosario');
    }

    public function test_viewer_ineligible_for_a_scope_gets_an_empty_result_not_an_error(): void
    {
        $viewer = $this->makeOptedInUser(['city_id' => null]);
        RecalculateRankingsAction::dispatchSync();

        $response = $this->actingAs($viewer, 'sanctum')->getJson('/api/v1/rankings?scope=city');

        $response->assertOk();
        $response->assertJsonPath('data.entries', []);
        $response->assertJsonPath('data.viewer', null);
    }

    public function test_opted_out_viewer_can_still_browse_global(): void
    {
        $this->makeOptedInUser([], 1000);
        RecalculateRankingsAction::dispatchSync();
        $viewer = User::factory()->create(['is_public_profile' => false]);

        $response = $this->actingAs($viewer, 'sanctum')->getJson('/api/v1/rankings?scope=global');

        $response->assertOk();
        $response->assertJsonCount(1, 'data.entries');
        $response->assertJsonPath('data.viewer', null);
    }

    public function test_opt_in_and_opt_out_toggle_the_flag(): void
    {
        $user = User::factory()->create(['is_public_profile' => false]);
        $client = $this->actingAs($user, 'sanctum');

        $client->postJson('/api/v1/rankings/opt-in')->assertOk();
        $this->assertTrue($user->fresh()->is_public_profile);

        $client->postJson('/api/v1/rankings/opt-out')->assertOk();
        $this->assertFalse($user->fresh()->is_public_profile);
    }
}
