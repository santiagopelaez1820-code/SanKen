<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de administración.

namespace App\Http\Controllers\Api\V1\Admin;

// Esta línea sirve para importar la acción que crea una plantilla de rutina.
use App\Application\Admin\Actions\CreateRoutineTemplateAction;
// Esta línea sirve para importar la acción que duplica una plantilla de rutina.
use App\Application\Admin\Actions\DuplicateRoutineTemplateAction;
// Esta línea sirve para importar la acción que edita una plantilla de rutina.
use App\Application\Admin\Actions\UpdateRoutineTemplateAction;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación de los datos de una plantilla de rutina.
use App\Http\Requests\Admin\RoutineTemplateRequest;
// Esta línea sirve para importar el resource que da formato a una plantilla de rutina.
use App\Http\Resources\AdminRoutineTemplateResource;
// Esta línea sirve para importar el modelo RoutineTemplate (plantilla de rutina).
use App\Models\RoutineTemplate;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la fachada DB para usar transacciones.
use Illuminate\Support\Facades\DB;

// Esta línea sirve para agrupar este controller en la sección "Admin · Plantillas de rutina" de Swagger.
#[Group('Admin · Plantillas de rutina', 'Plantillas por sexo, frecuencia y nivel con las que el motor genera las rutinas. Solo puede haber una activa por combinación.', weight: 25)]
// Esta línea sirve para declarar el controller de plantillas de rutina.
class AdminRoutineTemplateController extends Controller
{
    // Esta línea sirve para definir las relaciones que se cargan con cada plantilla.
    private const EAGER = ['days.exercises.exercise.primaryMuscle'];

    /**
     * Listar todas las plantillas de rutina.
     *
     * Trae TODAS las plantillas (activas e inactivas/borradores) — Super
     * Admin necesita verlas todas para poder reactivar o duplicar. Mismo
     * patrón que AdminExerciseController::index().
     */
    // Esta línea sirve para declarar el endpoint que lista todas las plantillas.
    public function index(): JsonResponse
    {
        // Esta línea sirve para consultar las plantillas.
        $templates = RoutineTemplate::query()
            // Esta línea sirve para cargar sus días y ejercicios.
            ->with(self::EAGER)
            // Esta línea sirve para ordenar por sexo.
            ->orderBy('sex')
            // Esta línea sirve para ordenar luego por frecuencia semanal.
            ->orderBy('frequency_days')
            // Esta línea sirve para ordenar luego por nivel.
            ->orderBy('level')
            // Esta línea sirve para mostrar primero las activas.
            ->orderByDesc('is_active')
            // Esta línea sirve para ejecutar la consulta.
            ->get();

        // Esta línea sirve para responder con las plantillas.
        return response()->json([
            // Esta línea sirve para incluir las plantillas con su formato.
            'data' => AdminRoutineTemplateResource::collection($templates),
        ]);
    }

    /** Ver una plantilla de rutina. */
    // Esta línea sirve para declarar el endpoint que muestra una plantilla.
    public function show(RoutineTemplate $routineTemplate): JsonResponse
    {
        // Esta línea sirve para responder con la plantilla.
        return response()->json([
            // Esta línea sirve para incluir la plantilla con sus días y ejercicios cargados.
            'data' => new AdminRoutineTemplateResource($routineTemplate->load(self::EAGER)),
        ]);
    }

    /** Crear una plantilla de rutina. */
    // Esta línea sirve para declarar el endpoint que crea una plantilla.
    public function store(RoutineTemplateRequest $request, CreateRoutineTemplateAction $action): JsonResponse
    {
        // Esta línea sirve para crear la plantilla con los datos validados.
        $template = $action->execute($request->validated());

        // Esta línea sirve para responder con la plantilla creada y código 201.
        return response()->json(['data' => new AdminRoutineTemplateResource($template)], 201);
    }

    /** Editar una plantilla de rutina. */
    // Esta línea sirve para declarar el endpoint que edita una plantilla.
    public function update(RoutineTemplateRequest $request, RoutineTemplate $routineTemplate, UpdateRoutineTemplateAction $action): JsonResponse
    {
        // Esta línea sirve para actualizar la plantilla con los datos validados.
        $template = $action->execute($routineTemplate, $request->validated());

        // Esta línea sirve para responder con la plantilla actualizada.
        return response()->json(['data' => new AdminRoutineTemplateResource($template)]);
    }

    /**
     * Duplicar una plantilla de rutina.
     *
     * La copia (con sus días y ejercicios) se crea inactiva y con
     * "(copia)" en el nombre.
     */
    // Esta línea sirve para declarar el endpoint que duplica una plantilla.
    public function duplicate(RoutineTemplate $routineTemplate, DuplicateRoutineTemplateAction $action): JsonResponse
    {
        // Esta línea sirve para crear la copia de la plantilla.
        $copy = $action->execute($routineTemplate);

        // Esta línea sirve para responder con la copia y código 201.
        return response()->json(['data' => new AdminRoutineTemplateResource($copy)], 201);
    }

    /**
     * Activar una plantilla de rutina.
     *
     * Activa esta plantilla y desactiva cualquier otra con el mismo
     * sexo+frecuencia+nivel, dentro de una transacción — es el único lugar
     * que garantiza "a lo sumo una plantilla activa por combo" (la columna ya
     * no tiene un unique constraint que lo haga por sí solo, ver migraciones
     * 2026_08_18_000003 y 2026_09_05_000005).
     */
    // Esta línea sirve para declarar el endpoint que activa una plantilla.
    public function activate(RoutineTemplate $routineTemplate): JsonResponse
    {
        // Esta línea sirve para hacer el cambio dentro de una transacción.
        DB::transaction(function () use ($routineTemplate) {
            // Esta línea sirve para consultar las otras plantillas de la misma combinación.
            RoutineTemplate::query()
                // Esta línea sirve para filtrar por el mismo sexo.
                ->where('sex', $routineTemplate->sex)
                // Esta línea sirve para filtrar por la misma frecuencia semanal.
                ->where('frequency_days', $routineTemplate->frequency_days)
                // Esta línea sirve para filtrar por el mismo nivel.
                ->where('level', $routineTemplate->level)
                // Esta línea sirve para excluir la plantilla que se está activando.
                ->where('id', '!=', $routineTemplate->id)
                // Esta línea sirve para desactivar esas otras plantillas.
                ->update(['is_active' => false]);

            // Esta línea sirve para activar esta plantilla.
            $routineTemplate->update(['is_active' => true]);
        });

        // Esta línea sirve para responder con la plantilla recargada.
        return response()->json(['data' => new AdminRoutineTemplateResource($routineTemplate->fresh(self::EAGER))]);
    }

    /**
     * Desactivar una plantilla de rutina.
     *
     * Bloqueada si es la única plantilla activa para su sexo+frecuencia+nivel
     * — si se permitiera, el próximo onboarding de ese segmento fallaría con
     * un 500 en TemplateRoutineGenerator (RuntimeException: "No hay
     * plantilla de rutina para sexo=[...] frecuencia=[...] nivel=[...]").
     */
    // Esta línea sirve para declarar el endpoint que desactiva una plantilla.
    public function deactivate(RoutineTemplate $routineTemplate): JsonResponse
    {
        // Esta línea sirve para revisar si es la única plantilla activa de su combinación.
        $isOnlyActiveOne = RoutineTemplate::query()
            // Esta línea sirve para filtrar por el mismo sexo.
            ->where('sex', $routineTemplate->sex)
            // Esta línea sirve para filtrar por la misma frecuencia semanal.
            ->where('frequency_days', $routineTemplate->frequency_days)
            // Esta línea sirve para filtrar por el mismo nivel.
            ->where('level', $routineTemplate->level)
            // Esta línea sirve para filtrar solo las activas.
            ->where('is_active', true)
            // Esta línea sirve para excluir la plantilla actual.
            ->where('id', '!=', $routineTemplate->id)
            // Esta línea sirve para devolver verdadero si no existe ninguna otra.
            ->doesntExist();

        // Esta línea sirve para cortar con error si es la única activa.
        abort_if(
            // Esta línea sirve para evaluar la condición: que sea la única activa.
            $isOnlyActiveOne,
            // Esta línea sirve para indicar el código HTTP 422.
            422,
            // Esta línea sirve para indicar el mensaje que pide activar un reemplazo primero.
            "No podés desactivar la única plantilla activa para sexo={$routineTemplate->sex}, frecuencia={$routineTemplate->frequency_days} días y nivel={$routineTemplate->level} — activá un reemplazo primero.",
        );

        // Esta línea sirve para desactivar la plantilla.
        $routineTemplate->update(['is_active' => false]);

        // Esta línea sirve para responder con la plantilla recargada.
        return response()->json(['data' => new AdminRoutineTemplateResource($routineTemplate->fresh(self::EAGER))]);
    }
}
