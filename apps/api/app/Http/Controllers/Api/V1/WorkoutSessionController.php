<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Workout\Actions\AddExerciseToSessionAction;
use App\Application\Workout\Actions\CompleteWorkoutSessionAction;
use App\Application\Workout\Actions\DetectPersonalRecordAction;
use App\Application\Workout\Actions\LogSetAction;
use App\Application\Workout\Actions\StartWorkoutSessionAction;
use App\Application\Workout\Actions\SubmitSessionFeedbackAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Workout\AddSessionExerciseRequest;
use App\Http\Requests\Workout\CompleteWorkoutSessionRequest;
use App\Http\Requests\Workout\LogSetRequest;
use App\Http\Requests\Workout\StartWorkoutSessionRequest;
use App\Http\Requests\Workout\SubmitFeedbackRequest;
use App\Http\Requests\Workout\UpdateSessionExerciseRequest;
use App\Http\Requests\Workout\UpdateWorkoutSessionRequest;
use App\Http\Resources\WorkoutExerciseResource;
use App\Http\Resources\WorkoutSessionResource;
use App\Http\Resources\WorkoutSetResource;
use App\Models\RoutineDay;
use App\Models\WorkoutExercise;
use App\Models\WorkoutSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class WorkoutSessionController extends Controller
{
    private const EAGER = ['exercises.exercise.primaryMuscle', 'exercises.sets', 'routineDay'];

    public function index(Request $request): JsonResponse
    {
        $sessions = $request->user()->workoutSessions()
            ->with(self::EAGER)
            ->orderByDesc('performed_at')
            ->paginate(15);

        return response()->json([
            'data' => WorkoutSessionResource::collection($sessions->items()),
            'meta' => [
                'current_page' => $sessions->currentPage(),
                'last_page' => $sessions->lastPage(),
                'total' => $sessions->total(),
            ],
        ]);
    }

    public function store(StartWorkoutSessionRequest $request, StartWorkoutSessionAction $action): JsonResponse
    {
        $routineDay = null;

        if ($routineDayId = $request->validated('routine_day_id')) {
            $routineDay = RoutineDay::query()->with('exercises')->findOrFail($routineDayId);

            Gate::authorize('view', $routineDay->routine);
        }

        $session = $action->execute($request->user(), $routineDay, $request->validated());

        return response()->json([
            'data' => new WorkoutSessionResource($session->load(self::EAGER)),
        ], 201);
    }

    public function show(Request $request, WorkoutSession $workoutSession): JsonResponse
    {
        $this->authorizeOwner($workoutSession);

        return response()->json([
            'data' => new WorkoutSessionResource($workoutSession->load(self::EAGER)),
        ]);
    }

    public function update(UpdateWorkoutSessionRequest $request, WorkoutSession $workoutSession): JsonResponse
    {
        $this->authorizeOwner($workoutSession);

        $workoutSession->update($request->validated());

        return response()->json([
            'data' => new WorkoutSessionResource($workoutSession->load(self::EAGER)),
        ]);
    }

    public function addExercise(AddSessionExerciseRequest $request, WorkoutSession $workoutSession, AddExerciseToSessionAction $action): JsonResponse
    {
        $this->authorizeOwner($workoutSession);

        $exercise = $action->execute($workoutSession, $request->validated('exercise_id'));

        return response()->json(['data' => new WorkoutExerciseResource($exercise)], 201);
    }

    public function updateExercise(UpdateSessionExerciseRequest $request, WorkoutSession $workoutSession, WorkoutExercise $workoutExercise): JsonResponse
    {
        $this->authorizeOwner($workoutSession);
        $this->authorizeExerciseBelongsToSession($workoutSession, $workoutExercise);

        $workoutExercise->update($request->validated());

        return response()->json(['data' => new WorkoutExerciseResource($workoutExercise->load('exercise.primaryMuscle', 'sets'))]);
    }

    public function logSet(
        LogSetRequest $request,
        WorkoutSession $workoutSession,
        WorkoutExercise $workoutExercise,
        LogSetAction $action,
        DetectPersonalRecordAction $prAction,
    ): JsonResponse {
        $this->authorizeOwner($workoutSession);
        $this->authorizeExerciseBelongsToSession($workoutSession, $workoutExercise);

        $set = $action->execute($workoutExercise, $request->validated());
        $record = $prAction->execute($request->user(), $set, $workoutExercise->exercise_id);

        return response()->json([
            'data' => [
                ...(new WorkoutSetResource($set))->resolve(),
                'is_personal_record' => $record !== null,
            ],
        ], 201);
    }

    public function complete(CompleteWorkoutSessionRequest $request, WorkoutSession $workoutSession, CompleteWorkoutSessionAction $action): JsonResponse
    {
        $this->authorizeOwner($workoutSession);

        $session = $action->execute($workoutSession, $request->validated('duration_minutes'), $request->validated('notes'));

        return response()->json([
            'data' => new WorkoutSessionResource($session),
        ]);
    }

    public function feedback(SubmitFeedbackRequest $request, WorkoutSession $workoutSession, SubmitSessionFeedbackAction $action): JsonResponse
    {
        $this->authorizeOwner($workoutSession);

        $session = $action->execute($workoutSession, $request->validated('completed_as_planned'));

        return response()->json([
            'data' => new WorkoutSessionResource($session),
        ]);
    }

    private function authorizeOwner(WorkoutSession $session): void
    {
        Gate::authorize('view', $session);
    }

    private function authorizeExerciseBelongsToSession(WorkoutSession $session, WorkoutExercise $exercise): void
    {
        if ($exercise->workout_session_id !== $session->id) {
            abort(404);
        }
    }
}
