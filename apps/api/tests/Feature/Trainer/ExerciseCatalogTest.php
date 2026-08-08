<?php

namespace Tests\Feature\Trainer;

use App\Models\User;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExerciseCatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_list_the_exercise_catalog(): void
    {
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/exercises');

        $response->assertOk();
        $this->assertGreaterThan(0, count($response->json('data')));
        $this->assertArrayHasKey('primary_muscle', $response->json('data.0'));
    }

    public function test_guest_cannot_list_the_exercise_catalog(): void
    {
        $this->getJson('/api/v1/exercises')->assertUnauthorized();
    }
}
