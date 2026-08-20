<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Stats\Actions\RegisterManualPersonalRecordAction;
use App\Domain\Stats\Services\StreakCalculator;
use App\Http\Controllers\Controller;
use App\Http\Requests\Stats\ProgressQueryRequest;
use App\Http\Requests\Stats\RegisterPersonalRecordRequest;
use App\Http\Requests\Stats\VolumeQueryRequest;
use App\Http\Resources\PersonalRecordResource;
use App\Models\BodyMeasurement;
use App\Models\PersonalRecord;
use App\Models\UserStatsDaily;
use App\Models\WorkoutSession;
use App\Support\CacheKeys;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class StatsController extends Controller
{
    public function dashboard(Request $request, StreakCalculator $streakCalculator): JsonResponse
    {
        $user = $request->user();

        $data = Cache::remember(CacheKeys::statsDashboard($user->id), now()->addHour(), function () use ($user, $streakCalculator) {
            $totals = UserStatsDaily::query()
                ->where('user_id', $user->id)
                ->selectRaw('SUM(total_sets) as total_sets, SUM(total_volume_kg) as total_volume_kg, SUM(training_minutes) as training_minutes')
                ->first();

            $workoutDates = WorkoutSession::query()
                ->where('user_id', $user->id)
                ->where('completed', true)
                ->distinct()
                ->pluck('performed_at')
                ->map(fn ($date) => $date->toDateString())
                ->all();

            $streak = $streakCalculator->calculate($workoutDates, CarbonImmutable::now());

            $recentPrs = PersonalRecord::query()
                ->where('user_id', $user->id)
                ->with('exercise')
                ->orderByDesc('achieved_at')
                ->limit(5)
                ->get();

            return [
                'total_hours' => round((float) ($totals->training_minutes ?? 0) / 60, 1),
                'total_sets' => (int) ($totals->total_sets ?? 0),
                'total_volume_kg' => round((float) ($totals->total_volume_kg ?? 0), 2),
                'current_streak_days' => $streak,
                'recent_personal_records' => PersonalRecordResource::collection($recentPrs)->resolve(),
            ];
        });

        return response()->json(['data' => $data]);
    }

    public function volume(VolumeQueryRequest $request): JsonResponse
    {
        $days = $request->validated('range', 'weekly') === 'monthly' ? 30 : 7;
        $from = now()->subDays($days - 1)->toDateString();

        $sessions = WorkoutSession::query()
            ->where('user_id', $request->user()->id)
            ->where('completed', true)
            ->whereDate('performed_at', '>=', $from)
            ->with('exercises.sets', 'exercises.exercise.primaryMuscle')
            ->get();

        $volumeByMuscle = $sessions
            ->flatMap(fn (WorkoutSession $session) => $session->exercises)
            ->groupBy(fn ($exercise) => $exercise->exercise->primaryMuscle->name)
            ->map(function ($exercises) {
                return $exercises
                    ->flatMap(fn ($exercise) => $exercise->sets)
                    ->filter(fn ($set) => $set->completed && ! $set->is_warmup)
                    ->sum(fn ($set) => (float) $set->weight_kg * $set->reps);
            })
            ->map(fn (float $volume) => round($volume, 2))
            ->sortDesc();

        return response()->json([
            'data' => $volumeByMuscle->map(fn (float $volume, string $muscle) => [
                'muscle_group' => $muscle,
                'volume_kg' => $volume,
            ])->values(),
        ]);
    }

    public function personalRecords(Request $request): JsonResponse
    {
        $records = PersonalRecord::query()
            ->where('user_id', $request->user()->id)
            ->with('exercise')
            ->orderByDesc('achieved_at')
            ->get();

        return response()->json([
            'data' => PersonalRecordResource::collection($records),
        ]);
    }

    public function storePersonalRecord(RegisterPersonalRecordRequest $request, RegisterManualPersonalRecordAction $action): JsonResponse
    {
        $record = $action->execute(
            $request->user(),
            (int) $request->validated('exercise_id'),
            (float) $request->validated('weight_kg'),
            (int) $request->validated('reps'),
        );

        $isNewBest = $record !== null;

        $record ??= PersonalRecord::query()
            ->where('user_id', $request->user()->id)
            ->where('exercise_id', $request->validated('exercise_id'))
            ->where('record_type', '1rm')
            ->firstOrFail();

        return response()->json([
            'data' => (new PersonalRecordResource($record))->resolve(),
            'meta' => ['is_new_best' => $isNewBest],
        ], $isNewBest ? 201 : 200);
    }

    public function progress(ProgressQueryRequest $request): JsonResponse
    {
        $user = $request->user();
        $metric = $request->validated('metric');

        $series = match ($metric) {
            'weight' => BodyMeasurement::query()
                ->where('user_id', $user->id)
                ->whereNotNull('weight_kg')
                ->orderBy('measured_at')
                ->get()
                ->map(fn (BodyMeasurement $m) => [
                    'date' => $m->measured_at->toDateString(),
                    'value' => (float) $m->weight_kg,
                ]),
            'volume' => UserStatsDaily::query()
                ->where('user_id', $user->id)
                ->whereDate('stat_date', '>=', now()->subDays(89)->toDateString())
                ->orderBy('stat_date')
                ->get()
                ->map(fn (UserStatsDaily $s) => [
                    'date' => $s->stat_date->toDateString(),
                    'value' => (float) $s->total_volume_kg,
                ]),
            '1rm' => $this->estimated1RmSeries($user->id, (int) $request->validated('exercise_id')),
        };

        return response()->json(['data' => $series->values()]);
    }

    /**
     * @return Collection<int, array{date: string, value: float}>
     *
     * Reconstruida a partir de las series históricas (fórmula de Epley) en
     * lugar de leer `personal_records`, porque esa tabla solo conserva el
     * mejor valor actual (updateOrCreate), no un historial por fecha.
     */
    private function estimated1RmSeries(int $userId, int $exerciseId): Collection
    {
        $sessions = WorkoutSession::query()
            ->where('user_id', $userId)
            ->where('completed', true)
            ->whereHas('exercises', fn ($q) => $q->where('exercise_id', $exerciseId))
            ->with(['exercises' => fn ($q) => $q->where('exercise_id', $exerciseId), 'exercises.sets'])
            ->orderBy('performed_at')
            ->get();

        return $sessions
            ->map(function (WorkoutSession $session) {
                $best = $session->exercises
                    ->flatMap(fn ($exercise) => $exercise->sets)
                    ->filter(fn ($set) => $set->completed && ! $set->is_warmup && (float) $set->weight_kg > 0)
                    ->map(fn ($set) => (float) $set->weight_kg * (1 + $set->reps / 30))
                    ->max();

                return $best === null ? null : [
                    'date' => $session->performed_at->toDateString(),
                    'value' => round($best, 2),
                ];
            })
            ->filter()
            ->values();
    }
}
