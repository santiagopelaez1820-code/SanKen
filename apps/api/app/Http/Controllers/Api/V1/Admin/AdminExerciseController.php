<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ExerciseRequest;
use App\Http\Requests\Admin\UploadExerciseVideoRequest;
use App\Http\Resources\AdminExerciseResource;
use App\Models\Exercise;
use App\Models\MuscleGroup;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AdminExerciseController extends Controller
{
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
     * pedido). Reemplazo seguro: sube y confirma que el nuevo archivo quedó
     * guardado ANTES de borrar el anterior — así un upload fallido a mitad
     * de camino nunca deja al ejercicio sin video.
     */
    public function uploadVideo(UploadExerciseVideoRequest $request, Exercise $exercise): JsonResponse
    {
        $previousPath = $this->publicPathFromUrl($exercise->video_url);

        $path = $request->file('video')->store('exercise-videos', 'public');

        abort_unless(Storage::disk('public')->exists($path), 500, 'No se pudo guardar el video.');

        // Ruta relativa, NO Storage::disk('public')->url($path): esa función
        // antepone APP_URL, que en dev es "http://localhost" — inalcanzable
        // desde un celular físico (localhost ahí es el propio celular, no
        // esta máquina) y frágil incluso en prod si el dominio cambia. Cada
        // cliente resuelve esta ruta contra su propio API baseUrl vía
        // ApiClient::mediaUrl() (ver packages/core/src/api/client.ts).
        $exercise->update(['video_url' => '/storage/'.$path]);

        if ($previousPath && Storage::disk('public')->exists($previousPath)) {
            Storage::disk('public')->delete($previousPath);
        }

        return response()->json(['data' => new AdminExerciseResource($exercise->fresh(self::EAGER))]);
    }

    /**
     * Borra el archivo y limpia video_url — el ejercicio sigue existiendo y
     * sigue siendo usable sin video (el reproductor ya maneja video_url null).
     */
    public function deleteVideo(Exercise $exercise): JsonResponse
    {
        $previousPath = $this->publicPathFromUrl($exercise->video_url);

        $exercise->update(['video_url' => null]);

        if ($previousPath && Storage::disk('public')->exists($previousPath)) {
            Storage::disk('public')->delete($previousPath);
        }

        return response()->json(['data' => new AdminExerciseResource($exercise->fresh(self::EAGER))]);
    }

    /**
     * video_url guarda la URL pública completa (Storage::disk('public')->url()
     * ya antepone APP_URL . '/storage/'), así que para volver a encontrar el
     * archivo en el disco hay que recortar todo lo anterior a ese marcador.
     * Si video_url viene de una carga vieja por texto libre (URL externa,
     * sin '/storage/'), esto devuelve null a propósito: nunca se intenta
     * borrar un archivo que esta app no subió.
     */
    private function publicPathFromUrl(?string $url): ?string
    {
        if (! $url) {
            return null;
        }

        $marker = '/storage/';
        $position = strpos($url, $marker);

        return $position === false ? null : substr($url, $position + strlen($marker));
    }
}
