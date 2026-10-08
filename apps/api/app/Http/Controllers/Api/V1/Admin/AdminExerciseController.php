<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de administración.

namespace App\Http\Controllers\Api\V1\Admin;

// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación de los datos de un ejercicio.
use App\Http\Requests\Admin\ExerciseRequest;
// Esta línea sirve para importar la validación del video de un ejercicio.
use App\Http\Requests\Admin\UploadExerciseVideoRequest;
// Esta línea sirve para importar el resource que da formato a un ejercicio para el admin.
use App\Http\Resources\AdminExerciseResource;
// Esta línea sirve para importar el helper que define dónde se guarda cada archivo.
use App\Infrastructure\Media\MediaSlot;
// Esta línea sirve para importar la interfaz de almacenamiento de archivos.
use App\Infrastructure\Media\MediaStorage;
// Esta línea sirve para importar el modelo Exercise (ejercicio).
use App\Models\Exercise;
// Esta línea sirve para importar el modelo MuscleGroup (grupo muscular).
use App\Models\MuscleGroup;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar el helper Arr para manejar arreglos.
use Illuminate\Support\Arr;
// Esta línea sirve para importar la fachada DB para usar transacciones.
use Illuminate\Support\Facades\DB;

// Esta línea sirve para agrupar este controller en la sección "Admin · Ejercicios" de Swagger.
#[Group('Admin · Ejercicios', 'Catálogo de ejercicios: alta, edición, desactivación, alternativa A/B y video demostrativo.', weight: 24)]
// Esta línea sirve para declarar el controller de ejercicios del panel admin.
class AdminExerciseController extends Controller
{
    // Esta línea sirve para definir las relaciones que se cargan con cada ejercicio.
    private const EAGER = ['primaryMuscle', 'alternatives'];

    /**
     * Listar todos los ejercicios.
     *
     * A diferencia de ExerciseController::index (solo activos, para el
     * selector del editor de rutinas), acá se listan todos — el admin
     * necesita ver los inactivos para poder reactivarlos.
     */
    // Esta línea sirve para declarar el endpoint que lista todos los ejercicios.
    public function index(): JsonResponse
    {
        // Esta línea sirve para consultar todos los ejercicios con sus relaciones, ordenados por nombre.
        $exercises = Exercise::query()->with(self::EAGER)->orderBy('name')->get();

        // Esta línea sirve para responder con los ejercicios.
        return response()->json([
            // Esta línea sirve para incluir los ejercicios con su formato.
            'data' => AdminExerciseResource::collection($exercises),
            // Esta línea sirve para incluir datos extra.
            'meta' => [
                // Esta línea sirve para incluir los grupos musculares para el formulario.
                'muscle_groups' => MuscleGroup::query()->orderBy('name')->get(['id', 'name']),
            ],
        ]);
    }

    /** Crear un ejercicio. */
    // Esta línea sirve para declarar el endpoint que crea un ejercicio.
    public function store(ExerciseRequest $request): JsonResponse
    {
        // Esta línea sirve para obtener los datos validados.
        $data = $request->validated();
        // Esta línea sirve para sacar de los datos el id de la alternativa.
        $alternativeId = Arr::pull($data, 'alternative_exercise_id');

        // Esta línea sirve para crear el ejercicio activo.
        $exercise = Exercise::query()->create($data + ['is_active' => true]);
        // Esta línea sirve para sincronizar su alternativa A/B.
        $this->syncAlternative($exercise, $alternativeId);

        // Esta línea sirve para responder con el ejercicio creado y código 201.
        return response()->json(['data' => new AdminExerciseResource($exercise->load(self::EAGER))], 201);
    }

    /**
     * Editar un ejercicio.
     *
     * Si se envía `alternative_exercise_id`, reemplaza la alternativa A/B en
     * ambas direcciones (`null` la quita).
     */
    // Esta línea sirve para declarar el endpoint que edita un ejercicio.
    public function update(ExerciseRequest $request, Exercise $exercise): JsonResponse
    {
        // Esta línea sirve para obtener los datos validados.
        $data = $request->validated();
        // Esta línea sirve para revisar si se envió el campo de alternativa.
        $hasAlternativeKey = array_key_exists('alternative_exercise_id', $data);
        // Esta línea sirve para sacar de los datos el id de la alternativa.
        $alternativeId = Arr::pull($data, 'alternative_exercise_id');

        // Esta línea sirve para actualizar el ejercicio.
        $exercise->update($data);

        // Esta línea sirve para revisar si se envió la alternativa.
        if ($hasAlternativeKey) {
            // Esta línea sirve para sincronizar la alternativa A/B.
            $this->syncAlternative($exercise, $alternativeId);
        }

        // Esta línea sirve para responder con el ejercicio actualizado.
        return response()->json(['data' => new AdminExerciseResource($exercise->load(self::EAGER))]);
    }

    /**
     * Reemplaza la alternativa A/B de $exercise por $alternativeId (o la
     * quita si es null), sincronizando exercise_alternatives en ambas
     * direcciones — así el swap del atleta (RoutineController::swapExercise
     * / WorkoutSessionController::swapExercise) sigue siendo reversible.
     */
    // Esta línea sirve para declarar el método privado que sincroniza la alternativa en ambas direcciones.
    private function syncAlternative(Exercise $exercise, ?int $alternativeId): void
    {
        // Esta línea sirve para hacer la sincronización dentro de una transacción.
        DB::transaction(function () use ($exercise, $alternativeId) {
            // Esta línea sirve para recorrer las alternativas anteriores del ejercicio.
            foreach ($exercise->alternatives()->get() as $previous) {
                // Esta línea sirve para quitar la relación inversa en cada una.
                $previous->alternatives()->detach($exercise->id);
            }

            // Esta línea sirve para dejar como alternativa solo la nueva (o ninguna).
            $exercise->alternatives()->sync($alternativeId ? [$alternativeId] : []);

            // Esta línea sirve para revisar si hay una alternativa nueva.
            if ($alternativeId) {
                // Esta línea sirve para agregar la relación inversa en la alternativa nueva.
                Exercise::query()->find($alternativeId)?->alternatives()->syncWithoutDetaching([$exercise->id]);
            }
        });
    }

    /**
     * Desactivar un ejercicio.
     *
     * No borra la fila: exercises.id está referenciado por
     * routine_exercises/workout_exercises ya generados, un hard delete
     * rompería esos historiales. is_active existe para esto — el ejercicio
     * deja de aparecer en el selector de rutinas pero el historial pasado
     * sigue íntegro.
     */
    // Esta línea sirve para declarar el endpoint que desactiva un ejercicio.
    public function destroy(Exercise $exercise): JsonResponse
    {
        // Esta línea sirve para marcar el ejercicio como inactivo.
        $exercise->update(['is_active' => false]);

        // Esta línea sirve para responder con el ejercicio actualizado.
        return response()->json(['data' => new AdminExerciseResource($exercise->load(self::EAGER))]);
    }

    /**
     * Subir el video de un ejercicio.
     *
     * El admin sube su propio archivo — nunca se busca video automáticamente
     * ni se integra con YouTube/APIs externas (instrucción explícita del
     * pedido). MediaStorage::store() confirma que el nuevo archivo quedó
     * guardado ANTES de borrar el anterior — así un upload fallido a mitad
     * de camino nunca deja al ejercicio sin video.
     */
    // Esta línea sirve para declarar el endpoint que sube el video de un ejercicio.
    public function uploadVideo(UploadExerciseVideoRequest $request, Exercise $exercise, MediaStorage $media): JsonResponse
    {
        // Esta línea sirve para guardar el video y obtener su URL.
        $videoUrl = $media->store(
            // Esta línea sirve para pasar el archivo subido.
            $request->file('video'),
            // Esta línea sirve para pasar el destino del archivo.
            MediaSlot::exerciseVideo($exercise->id),
            // Esta línea sirve para pasar la URL anterior para borrarla después.
            $exercise->video_url,
            // Esta línea sirve para pasar el mensaje de error si falla.
            'No se pudo guardar el video.',
        );
        // Esta línea sirve para guardar la URL del video en el ejercicio.
        $exercise->update(['video_url' => $videoUrl]);

        // Esta línea sirve para responder con el ejercicio recargado.
        return response()->json(['data' => new AdminExerciseResource($exercise->fresh(self::EAGER))]);
    }

    /**
     * Eliminar el video de un ejercicio.
     *
     * Borra el archivo y limpia video_url — el ejercicio sigue existiendo y
     * sigue siendo usable sin video (el reproductor ya maneja video_url null).
     */
    // Esta línea sirve para declarar el endpoint que elimina el video de un ejercicio.
    public function deleteVideo(Exercise $exercise, MediaStorage $media): JsonResponse
    {
        // Esta línea sirve para borrar el archivo del video.
        $media->delete($exercise->video_url);
        // Esta línea sirve para limpiar la URL del video en el ejercicio.
        $exercise->update(['video_url' => null]);

        // Esta línea sirve para responder con el ejercicio recargado.
        return response()->json(['data' => new AdminExerciseResource($exercise->fresh(self::EAGER))]);
    }
}
