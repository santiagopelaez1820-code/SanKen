<?php

namespace Tests\Feature\Rankings;

use App\Application\Rankings\Actions\RecalculateRankingsAction;
use App\Models\City;
use App\Models\Exercise;
use App\Models\Gym;
use App\Models\PersonalRecord;
use App\Models\RankingSnapshot;
use App\Models\User;
use App\Models\UserStatsDaily;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RecalculateRankingsCommandTest extends TestCase
{
    use RefreshDatabase;

    private function makeOptedInUser(array $profileAttrs = [], float $totalVolumeKg = 0): User
    {
        $user = User::factory()->create(['is_public_profile' => true]);
        $user->profile()->create(array_merge([
            'age' => 30,
            'sex' => 'male',
            'weight_kg' => 80,
        ], $profileAttrs));

        if ($totalVolumeKg > 0) {
            UserStatsDaily::query()->create([
                'user_id' => $user->id,
                'stat_date' => now()->toDateString(),
                'workouts_count' => 1,
                'total_sets' => 5,
                'total_volume_kg' => $totalVolumeKg,
                'training_minutes' => 45,
                'current_streak_days' => 1,
            ]);
        }

        return $user;
    }

    public function test_tied_users_share_the_same_rank_and_next_distinct_value_resumes_at_cardinal_position(): void
    {
        $city = City::factory()->create();
        $userA = $this->makeOptedInUser(['city_id' => $city->id], 1000);
        $userB = $this->makeOptedInUser(['city_id' => $city->id], 1000);
        $userC = $this->makeOptedInUser(['city_id' => $city->id], 500);

        RecalculateRankingsAction::dispatchSync();

        $rankA = RankingSnapshot::query()->where('scope_type', 'city')->where('user_id', $userA->id)->value('rank_position');
        $rankB = RankingSnapshot::query()->where('scope_type', 'city')->where('user_id', $userB->id)->value('rank_position');
        $rankC = RankingSnapshot::query()->where('scope_type', 'city')->where('user_id', $userC->id)->value('rank_position');

        $this->assertSame(1, $rankA);
        $this->assertSame(1, $rankB);
        $this->assertSame(3, $rankC);
    }

    public function test_opted_out_user_is_absent_from_every_scope(): void
    {
        $user = User::factory()->create(['is_public_profile' => false]);
        $user->profile()->create(['age' => 30, 'sex' => 'male', 'weight_kg' => 80, 'city_id' => City::factory()->create()->id]);
        UserStatsDaily::query()->create([
            'user_id' => $user->id, 'stat_date' => now()->toDateString(), 'total_volume_kg' => 5000,
        ]);

        RecalculateRankingsAction::dispatchSync();

        $this->assertDatabaseMissing('ranking_snapshots', ['user_id' => $user->id]);
    }

    public function test_user_without_city_or_gym_is_absent_only_from_those_scopes(): void
    {
        $user = $this->makeOptedInUser(['city_id' => null, 'gym_id' => null], 1000);

        RecalculateRankingsAction::dispatchSync();

        $this->assertDatabaseMissing('ranking_snapshots', ['user_id' => $user->id, 'scope_type' => 'city']);
        $this->assertDatabaseMissing('ranking_snapshots', ['user_id' => $user->id, 'scope_type' => 'country']);
        $this->assertDatabaseMissing('ranking_snapshots', ['user_id' => $user->id, 'scope_type' => 'gym']);
        $this->assertDatabaseHas('ranking_snapshots', ['user_id' => $user->id, 'scope_type' => 'global']);
        $this->assertDatabaseHas('ranking_snapshots', ['user_id' => $user->id, 'scope_type' => 'sex']);
    }

    public function test_gym_scope_derives_country_through_city(): void
    {
        $city = City::factory()->create();
        $gym = Gym::factory()->create(['city_id' => $city->id]);
        $user = $this->makeOptedInUser(['city_id' => $city->id, 'gym_id' => $gym->id], 1000);

        RecalculateRankingsAction::dispatchSync();

        $this->assertDatabaseHas('ranking_snapshots', [
            'user_id' => $user->id, 'scope_type' => 'gym', 'scope_value' => (string) $gym->id,
        ]);
        $this->assertDatabaseHas('ranking_snapshots', [
            'user_id' => $user->id, 'scope_type' => 'country', 'scope_value' => (string) $city->country_id,
        ]);
    }

    public function test_underage_or_null_age_users_are_absent_from_age_bracket(): void
    {
        $minor = $this->makeOptedInUser(['age' => 17], 1000);
        $noAge = $this->makeOptedInUser(['age' => null], 1000);

        RecalculateRankingsAction::dispatchSync();

        $this->assertDatabaseMissing('ranking_snapshots', ['user_id' => $minor->id, 'scope_type' => 'age_bracket']);
        $this->assertDatabaseMissing('ranking_snapshots', ['user_id' => $noAge->id, 'scope_type' => 'age_bracket']);
    }

    public function test_user_without_1rm_pr_or_weight_is_absent_from_strength_category(): void
    {
        $noWeight = $this->makeOptedInUser(['weight_kg' => null], 1000);
        $noPr = $this->makeOptedInUser([], 1000);

        RecalculateRankingsAction::dispatchSync();

        $this->assertDatabaseMissing('ranking_snapshots', ['user_id' => $noWeight->id, 'scope_type' => 'strength_category']);
        $this->assertDatabaseMissing('ranking_snapshots', ['user_id' => $noPr->id, 'scope_type' => 'strength_category']);
    }

    public function test_strength_category_uses_the_best_1rm_across_any_exercise(): void
    {
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
        $exerciseId = Exercise::query()->value('id');

        $user = $this->makeOptedInUser(['weight_kg' => 100], 1000);
        PersonalRecord::query()->create([
            'user_id' => $user->id, 'exercise_id' => $exerciseId, 'record_type' => '1rm', 'value' => 174, 'achieved_at' => now(),
        ]);

        RecalculateRankingsAction::dispatchSync();

        $this->assertDatabaseHas('ranking_snapshots', [
            'user_id' => $user->id, 'scope_type' => 'strength_category', 'scope_value' => 'avanzado',
        ]);
    }

    public function test_running_the_recalculation_twice_does_not_duplicate_rows(): void
    {
        $this->makeOptedInUser([], 1000);
        $this->makeOptedInUser([], 2000);

        RecalculateRankingsAction::dispatchSync();
        $firstCount = RankingSnapshot::query()->where('scope_type', 'global')->count();

        RecalculateRankingsAction::dispatchSync();
        $secondCount = RankingSnapshot::query()->where('scope_type', 'global')->count();

        $this->assertSame(2, $firstCount);
        $this->assertSame($firstCount, $secondCount);
    }
}
