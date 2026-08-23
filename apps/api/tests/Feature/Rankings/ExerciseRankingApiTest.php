<?php

namespace Tests\Feature\Rankings;

use App\Models\City;
use App\Models\Country;
use App\Models\Exercise;
use App\Models\PrSubmission;
use App\Models\User;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExerciseRankingApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
    }

    private function makeOptedInUserWithApprovedPr(int $exerciseId, float $value, array $profileAttrs = []): User
    {
        $user = User::factory()->create(['is_public_profile' => true]);
        $user->profile()->create(array_merge(['age' => 30, 'sex' => 'male', 'weight_kg' => 80], $profileAttrs));
        PrSubmission::query()->create([
            'user_id' => $user->id, 'exercise_id' => $exerciseId,
            'weight_kg' => $value, 'reps' => 1, 'estimated_1rm' => $value,
            'status' => 'approved', 'video_url' => '/storage/pr-submission-videos/proof.mp4',
        ]);

        return $user;
    }

    public function test_unauthenticated_request_is_rejected(): void
    {
        $exerciseId = Exercise::query()->value('id');

        $this->getJson("/api/v1/exercises/{$exerciseId}/rankings?scope=global&sex=male")->assertUnauthorized();
    }

    public function test_invalid_scope_is_rejected(): void
    {
        $exerciseId = Exercise::query()->value('id');
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson("/api/v1/exercises/{$exerciseId}/rankings?scope=made_up&sex=male")
            ->assertUnprocessable();
    }

    public function test_sex_is_required(): void
    {
        $exerciseId = Exercise::query()->value('id');
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson("/api/v1/exercises/{$exerciseId}/rankings?scope=global")
            ->assertUnprocessable();
    }

    public function test_global_scope_ranks_by_best_1rm_with_competition_tie_breaking(): void
    {
        $exerciseId = Exercise::query()->value('id');
        $viewer = $this->makeOptedInUserWithApprovedPr($exerciseId, 150);
        $this->makeOptedInUserWithApprovedPr($exerciseId, 200);
        $this->makeOptedInUserWithApprovedPr($exerciseId, 200);

        $response = $this->actingAs($viewer, 'sanctum')->getJson("/api/v1/exercises/{$exerciseId}/rankings?scope=global&sex=male");

        $response->assertOk();
        $response->assertJsonCount(3, 'data.entries');
        $response->assertJsonPath('data.entries.0.rank', 1);
        $response->assertJsonPath('data.entries.1.rank', 1);
        $response->assertJsonPath('data.entries.2.rank', 3);
        $response->assertJsonPath('data.viewer.rank', 3);
        $response->assertJsonPath('data.viewer.is_viewer', true);
    }

    public function test_only_ranks_the_selected_exercise(): void
    {
        $exercises = Exercise::query()->limit(2)->pluck('id');
        $viewer = $this->makeOptedInUserWithApprovedPr($exercises[0], 100);
        $this->makeOptedInUserWithApprovedPr($exercises[1], 999);

        $response = $this->actingAs($viewer, 'sanctum')->getJson("/api/v1/exercises/{$exercises[0]}/rankings?scope=global&sex=male");

        $response->assertOk();
        $response->assertJsonCount(1, 'data.entries');
        $response->assertJsonPath('data.entries.0.metric_value', 100);
    }

    public function test_city_scope_returns_city_name_as_label_and_filters_by_city(): void
    {
        $exerciseId = Exercise::query()->value('id');
        $city = City::factory()->create(['name' => 'Rosario']);
        $otherCity = City::factory()->create(['name' => 'Cordoba']);
        $viewer = $this->makeOptedInUserWithApprovedPr($exerciseId, 150, ['city_id' => $city->id]);
        $this->makeOptedInUserWithApprovedPr($exerciseId, 999, ['city_id' => $otherCity->id]);

        $response = $this->actingAs($viewer, 'sanctum')->getJson("/api/v1/exercises/{$exerciseId}/rankings?scope=city&sex=male");

        $response->assertOk();
        $response->assertJsonPath('data.scope_label', 'Rosario');
        $response->assertJsonCount(1, 'data.entries');
        $response->assertJsonPath('data.entries.0.user_id', $viewer->id);
    }

    public function test_country_scope_groups_across_cities_in_the_same_country(): void
    {
        $exerciseId = Exercise::query()->value('id');
        $country = Country::factory()->create(['name' => 'Argentina']);
        $cityA = City::factory()->create(['country_id' => $country->id]);
        $cityB = City::factory()->create(['country_id' => $country->id]);
        $viewer = $this->makeOptedInUserWithApprovedPr($exerciseId, 150, ['city_id' => $cityA->id]);
        $this->makeOptedInUserWithApprovedPr($exerciseId, 180, ['city_id' => $cityB->id]);

        $response = $this->actingAs($viewer, 'sanctum')->getJson("/api/v1/exercises/{$exerciseId}/rankings?scope=country&sex=male");

        $response->assertOk();
        $response->assertJsonPath('data.scope_label', 'Argentina');
        $response->assertJsonCount(2, 'data.entries');
    }

    public function test_viewer_without_a_city_gets_an_empty_result_for_city_scope(): void
    {
        $exerciseId = Exercise::query()->value('id');
        $viewer = $this->makeOptedInUserWithApprovedPr($exerciseId, 150, ['city_id' => null]);

        $response = $this->actingAs($viewer, 'sanctum')->getJson("/api/v1/exercises/{$exerciseId}/rankings?scope=city&sex=male");

        $response->assertOk();
        $response->assertJsonPath('data.entries', []);
        $response->assertJsonPath('data.viewer', null);
    }

    public function test_opted_out_users_are_excluded_from_rankings(): void
    {
        $exerciseId = Exercise::query()->value('id');
        $viewer = $this->makeOptedInUserWithApprovedPr($exerciseId, 150);
        $optedOut = User::factory()->create(['is_public_profile' => false]);
        $optedOut->profile()->create(['age' => 30, 'sex' => 'male', 'weight_kg' => 80]);
        PrSubmission::query()->create([
            'user_id' => $optedOut->id, 'exercise_id' => $exerciseId,
            'weight_kg' => 999, 'reps' => 1, 'estimated_1rm' => 999,
            'status' => 'approved', 'video_url' => '/storage/pr-submission-videos/proof.mp4',
        ]);

        $response = $this->actingAs($viewer, 'sanctum')->getJson("/api/v1/exercises/{$exerciseId}/rankings?scope=global&sex=male");

        $response->assertOk();
        $response->assertJsonCount(1, 'data.entries');
    }

    public function test_sex_filters_out_the_other_sex(): void
    {
        $exerciseId = Exercise::query()->value('id');
        $viewer = $this->makeOptedInUserWithApprovedPr($exerciseId, 150, ['sex' => 'male']);
        $this->makeOptedInUserWithApprovedPr($exerciseId, 999, ['sex' => 'female']);

        $response = $this->actingAs($viewer, 'sanctum')->getJson("/api/v1/exercises/{$exerciseId}/rankings?scope=global&sex=male");

        $response->assertOk();
        $response->assertJsonCount(1, 'data.entries');
        $response->assertJsonPath('data.entries.0.metric_value', 150);
    }

    public function test_pending_and_rejected_submissions_never_appear_in_rankings(): void
    {
        $exerciseId = Exercise::query()->value('id');
        $viewer = $this->makeOptedInUserWithApprovedPr($exerciseId, 100);

        $pendingUser = User::factory()->create(['is_public_profile' => true]);
        $pendingUser->profile()->create(['age' => 30, 'sex' => 'male', 'weight_kg' => 80]);
        PrSubmission::query()->create([
            'user_id' => $pendingUser->id, 'exercise_id' => $exerciseId,
            'weight_kg' => 999, 'reps' => 1, 'estimated_1rm' => 999, 'status' => 'pending',
        ]);

        $rejectedUser = User::factory()->create(['is_public_profile' => true]);
        $rejectedUser->profile()->create(['age' => 30, 'sex' => 'male', 'weight_kg' => 80]);
        PrSubmission::query()->create([
            'user_id' => $rejectedUser->id, 'exercise_id' => $exerciseId,
            'weight_kg' => 999, 'reps' => 1, 'estimated_1rm' => 999, 'status' => 'rejected',
        ]);

        $response = $this->actingAs($viewer, 'sanctum')->getJson("/api/v1/exercises/{$exerciseId}/rankings?scope=global&sex=male");

        $response->assertOk();
        $response->assertJsonCount(1, 'data.entries');
        $response->assertJsonPath('data.entries.0.user_id', $viewer->id);
    }

    public function test_only_the_best_approved_submission_per_user_counts(): void
    {
        $exerciseId = Exercise::query()->value('id');
        $viewer = $this->makeOptedInUserWithApprovedPr($exerciseId, 100);
        // Una segunda postulación aprobada, mejor que la primera, del mismo usuario.
        PrSubmission::query()->create([
            'user_id' => $viewer->id, 'exercise_id' => $exerciseId,
            'weight_kg' => 130, 'reps' => 1, 'estimated_1rm' => 130,
            'status' => 'approved', 'video_url' => '/storage/pr-submission-videos/proof2.mp4',
        ]);

        $response = $this->actingAs($viewer, 'sanctum')->getJson("/api/v1/exercises/{$exerciseId}/rankings?scope=global&sex=male");

        $response->assertOk();
        $response->assertJsonCount(1, 'data.entries');
        $response->assertJsonPath('data.entries.0.metric_value', 130);
    }
}
