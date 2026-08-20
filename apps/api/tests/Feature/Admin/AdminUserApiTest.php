<?php

namespace Tests\Feature\Admin;

use App\Models\City;
use App\Models\Country;
use App\Models\Routine;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_access_admin_user_routes(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->getJson('/api/v1/admin/users')->assertForbidden();
    }

    public function test_unauthenticated_request_is_rejected(): void
    {
        $this->getJson('/api/v1/admin/users')->assertUnauthorized();
    }

    public function test_admin_can_list_users_with_filters(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        User::factory()->create(['name' => 'Carlos Trainer', 'role' => 'trainer']);
        User::factory()->create(['name' => 'Ana Cliente', 'role' => 'user']);
        User::factory()->create(['name' => 'Beto Baneado', 'is_banned' => true]);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/users?role=trainer');
        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame('Carlos Trainer', $response->json('data.0.name'));

        $banned = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/users?is_banned=1');
        $this->assertCount(1, $banned->json('data'));

        $search = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/users?q=ana');
        $this->assertCount(1, $search->json('data'));
    }

    public function test_admin_user_list_exposes_current_routine_for_each_user(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $withRoutine = User::factory()->create();
        Routine::query()->create([
            'user_id' => $withRoutine->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            'split_type' => 'full_body', 'frequency_days' => 3, 'duration_weeks' => 6, 'is_active' => true,
        ]);
        $withoutRoutine = User::factory()->create();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/users');

        $response->assertOk();
        $byId = collect($response->json('data'))->keyBy('id');
        $this->assertSame('General 3 días', $byId[$withRoutine->id]['current_routine']['label']);
        $this->assertNull($byId[$withoutRoutine->id]['current_routine']);
    }

    public function test_admin_can_ban_a_user_and_it_revokes_their_active_tokens(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create();
        $user->createToken('device');

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/users/{$user->id}/ban");

        $response->assertOk();
        $this->assertTrue($response->json('data.is_banned'));
        $this->assertDatabaseHas('users', ['id' => $user->id, 'is_banned' => true]);
        $this->assertSame(0, $user->tokens()->count());
    }

    public function test_admin_can_unban_a_user(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create(['is_banned' => true]);

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/users/{$user->id}/ban");

        $response->assertOk();
        $this->assertFalse($response->json('data.is_banned'));
    }

    public function test_admin_cannot_ban_themselves(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/users/{$admin->id}/ban")
            ->assertForbidden();
    }

    public function test_admin_can_toggle_trainer_verification(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $trainer = User::factory()->create(['role' => 'trainer']);

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/users/{$trainer->id}/verify-trainer");

        $response->assertOk();
        $this->assertNotNull($response->json('data.trainer_verified_at'));

        $toggledOff = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/users/{$trainer->id}/verify-trainer");
        $this->assertNull($toggledOff->json('data.trainer_verified_at'));
    }

    public function test_verifying_a_non_trainer_fails(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $regular = User::factory()->create(['role' => 'user']);

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/users/{$regular->id}/verify-trainer")
            ->assertStatus(422);
    }

    public function test_admin_can_filter_users_by_country_and_city(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $country = Country::factory()->create();
        $otherCountry = Country::factory()->create();
        $city = City::factory()->create(['country_id' => $country->id]);
        $otherCity = City::factory()->create(['country_id' => $otherCountry->id]);

        $inCity = User::factory()->create(['name' => 'En la ciudad']);
        $inCity->profile()->create(['age' => 25, 'sex' => 'male', 'city_id' => $city->id]);
        $elsewhere = User::factory()->create(['name' => 'En otro lado']);
        $elsewhere->profile()->create(['age' => 25, 'sex' => 'male', 'city_id' => $otherCity->id]);

        $byCity = $this->actingAs($admin, 'sanctum')->getJson("/api/v1/admin/users?city_id={$city->id}");
        $byCity->assertOk();
        $this->assertCount(1, $byCity->json('data'));
        $this->assertSame('En la ciudad', $byCity->json('data.0.name'));
        $this->assertSame($city->name, $byCity->json('data.0.city'));
        $this->assertSame($country->name, $byCity->json('data.0.country'));

        $byCountry = $this->actingAs($admin, 'sanctum')->getJson("/api/v1/admin/users?country_id={$country->id}");
        $byCountry->assertOk();
        $this->assertCount(1, $byCountry->json('data'));
    }

    public function test_admin_can_filter_users_by_state(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $country = Country::factory()->create();
        $antioquia = \App\Models\State::factory()->create(['country_id' => $country->id, 'name' => 'Antioquia']);
        $cundinamarca = \App\Models\State::factory()->create(['country_id' => $country->id, 'name' => 'Cundinamarca']);
        $medellin = City::factory()->create(['country_id' => $country->id, 'state_id' => $antioquia->id]);
        $bogota = City::factory()->create(['country_id' => $country->id, 'state_id' => $cundinamarca->id]);

        $inAntioquia = User::factory()->create(['name' => 'En Antioquia']);
        $inAntioquia->profile()->create(['age' => 25, 'sex' => 'male', 'city_id' => $medellin->id]);
        $inCundinamarca = User::factory()->create(['name' => 'En Cundinamarca']);
        $inCundinamarca->profile()->create(['age' => 25, 'sex' => 'male', 'city_id' => $bogota->id]);

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/v1/admin/users?state_id={$antioquia->id}");

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame('En Antioquia', $response->json('data.0.name'));
        $this->assertSame('Antioquia', $response->json('data.0.state'));
    }

    public function test_admin_can_view_user_detail_with_trainings_and_prs(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create();
        $user->profile()->create(['age' => 28, 'sex' => 'female']);

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/v1/admin/users/{$user->id}");

        $response->assertOk();
        $response->assertJsonPath('data.id', $user->id);
        $response->assertJsonPath('data.age', 28);
        $response->assertJsonPath('data.trainings_completed', 0);
        $response->assertJsonPath('data.personal_records', []);
    }

    public function test_admin_can_promote_a_user_to_trainer_and_demote_back(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create(['role' => 'user']);

        $promoted = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/users/{$user->id}/role", ['role' => 'trainer']);
        $promoted->assertOk();
        $promoted->assertJsonPath('data.role', 'trainer');

        $demoted = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/users/{$user->id}/role", ['role' => 'user']);
        $demoted->assertOk();
        $demoted->assertJsonPath('data.role', 'user');
    }

    public function test_role_change_to_super_admin_is_rejected_even_by_a_super_admin(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create(['role' => 'user']);

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/users/{$user->id}/role", ['role' => 'super_admin'])
            ->assertStatus(422);

        $this->assertSame('user', $user->fresh()->role);
    }

    public function test_admin_cannot_change_their_own_role(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/users/{$admin->id}/role", ['role' => 'user'])
            ->assertForbidden();

        $this->assertSame('super_admin', $admin->fresh()->role);
    }

    public function test_admin_can_deactivate_and_reactivate_a_user(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create();
        $user->createToken('device');

        $deactivated = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/users/{$user->id}/deactivate");
        $deactivated->assertOk();
        $this->assertTrue($deactivated->json('data.is_deactivated'));
        $this->assertSame(0, $user->tokens()->count());

        $reactivated = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/users/{$user->id}/activate");
        $reactivated->assertOk();
        $this->assertFalse($reactivated->json('data.is_deactivated'));
    }

    public function test_a_deactivated_user_cannot_log_in(): void
    {
        $user = User::factory()->create(['deactivated_at' => now(), 'password' => bcrypt('password123')]);

        $this->postJson('/api/v1/auth/login', ['email' => $user->email, 'password' => 'password123'])
            ->assertStatus(422);
    }

    public function test_admin_can_delete_a_user_account(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create();
        $user->createToken('device');

        $response = $this->actingAs($admin, 'sanctum')->deleteJson("/api/v1/admin/users/{$user->id}");

        $response->assertOk();
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_admin_cannot_delete_themselves(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);

        $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/v1/admin/users/{$admin->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }
}
