<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Concerns\ReplacesPublicFile;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ExerciseRequest;
use App\Http\Requests\Admin\UploadExerciseVideoRequest;
use App\Http\Resources\AdminExerciseResource;
use App\Models\Exercise;
use App\Models\MuscleGroup;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class AdminExerciseController extends Controller
{
    use ReplacesPublicFile;

    private const EAGER = ['primaryMuscle', 'alternatives'];

    /**
     * A diferencia de ExerciseController::index (solo activos, para el
     * selector del editor de rutinas), acá se listan todos — el admin
     * necesita ver los inactivos para poder reactivarlos.
     */
    public function index(): JsonResponse
    {
        $exercises = Exercise::query()->with(self::EAGER)->orderBy('name')->get();

        return response()->json([
            'data' => AdminExerciseResource::collection($exercises),
            'meta' => [
                'muscle_groups' => MuscleGroup::query()->orderBy('name')->get(['id', 'name']),
            ],
        ]);
    }

    public function store(ExerciseRequest $request): JsonResponse
    {
        $data = $request->validated();
        $alternativeId = Arr::pull($data, 'alternative_exercise_id');

        $exercise = Exercise::query()->create($data + ['is_active' => true]);
        $this->syncAlternative($exercise, $alternativeId);

        return response()->json(['data' => new AdminExerciseResource($exercise->load(self::EAGER))], 201);
    }

    public function update(ExerciseRequest $request, Exercise $exercise): JsonResponse
    {
        $data = $request->validated();
        $hasAlternativeKey = array_key_exists('alternative_exercise_id', $data);
        $alternativeId = Arr::pull($data, 'alternative_exercise_id');

        $exercise->update($data);

        if ($hasAlternativeKey) {
            $this->syncAlternative($exercise, $alternativeId);
        }

        return response()->json(['data' => new AdminExerciseResource($exercise->load(self::EAGER))]);
    }

    /**
     * Reemplaza la alternativa A/B de $exercise por $alternativeId (o la
     * quita si es null), sincronizando exercise_alternatives en ambas
     * direcciones — así el swap del atleta (RoutineController::swapExercise
     * / WorkoutSessionController::swapExercise) sigue siendo reversible.
     */
    private function syncAlternative(Exercise $exercise, ?int $alternativeId): void
    {
        DB::transaction(function () use ($exercise, $alternativeId) {
            foreach ($exercise->alternatives()->get() as $previous) {
                $previous->alternatives()->detach($exercise->id);
            }

            $exercise->alternatives()->sync($alternativeId ? [$alternativeId] : []);

            if ($alternativeId) {
                Exercise::query()->find($alternativeId)?->alternatives()->syncWithoutDetaching([$exercise->id]);
            }
        });
    }

    /**
     * No borra la fila: exercises.id está referenciado por
     * routine_exercises/workout_exercises ya generados, un hard delete
     * rompería esos historiales. is_active existe para esto — el ejercicio
     * deja de aparecer en el selector de rutinas pero el historial pasado
     * sigue íntegro.
     */
    public function destroy(Exercise $exercise): JsonResponse
    {
        $exercise->update(['is_active' => false]);

        return response()->json(['data' => new AdminExerciseResource($exercise->load(self::EAGER))]);
    }

    /**
     * El admin sube su propio archivo — nunca se busca video automáticamente
     * ni se integra con YouTube/APIs externas (instrucción explícita del
     * pedido). storePublicFileReplacing() confirma que el nuevo archivo
     * quedó guardado ANTES de borrar el anterior — así un upload fallido a
     * mitad de camino nunca deja al ejercicio sin video.
     */
    public function uploadVideo(UploadExerciseVideoRequest $request, Exercise $exercise): JsonResponse
    {
        $videoUrl = $this->storePublicFileReplacing(
            $request->file('video'),
            'exercise-videos',
            $exercise->video_url,
            'No se pudo guardar el video.',
        );
        $exercise->update(['video_url' => $videoUrl]);

        return response()->json(['data' => new AdminExerciseResource($exercise->fresh(self::EAGER))]);
    }

    /**
     * Borra el archivo y limpia video_url — el ejercicio sigue existiendo y
     * sigue siendo usable sin video (el reproductor ya maneja video_url null).
     */
    public function deleteVideo(Exercise $exercise): JsonResponse
    {
        $this->deletePublicFileByUrl($exercise->video_url);
        $exercise->update(['video_url' => null]);

        return response()->json(['data' => new AdminExerciseResource($exercise->fresh(self::EAGER))]);
    }
}
