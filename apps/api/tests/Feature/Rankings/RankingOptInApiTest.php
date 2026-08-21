<?php

namespace Tests\Feature\Rankings;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RankingOptInApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $this->postJson('/api/v1/rankings/opt-in')->assertUnauthorized();
        $this->postJson('/api/v1/rankings/opt-out')->assertUnauthorized();
    }

    public function test_opt_in_makes_the_users_profile_public(): void
    {
        $user = User::factory()->create(['is_public_profile' => false]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/rankings/opt-in');

        $response->assertOk();
        $response->assertJsonPath('data.is_public_profile', true);
        $this->assertDatabaseHas('users', ['id' => $user->id, 'is_public_profile' => true]);
    }

    public function test_opt_out_makes_the_users_profile_private(): void
    {
        $user = User::factory()->create(['is_public_profile' => true]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/rankings/opt-out');

        $response->assertOk();
        $response->assertJsonPath('data.is_public_profile', false);
        $this->assertDatabaseHas('users', ['id' => $user->id, 'is_public_profile' => false]);
    }

    public function test_opt_in_only_affects_the_authenticated_user(): void
    {
        $user = User::factory()->create(['is_public_profile' => false]);
        $stranger = User::factory()->create(['is_public_profile' => false]);

        $this->actingAs($user, 'sanctum')->postJson('/api/v1/rankings/opt-in')->assertOk();

        $this->assertDatabaseHas('users', ['id' => $user->id, 'is_public_profile' => true]);
        $this->assertDatabaseHas('users', ['id' => $stranger->id, 'is_public_profile' => false]);
    }
}
