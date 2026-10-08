<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de la API v1.

namespace App\Http\Controllers\Api\V1;

// Esta línea sirve para importar la acción que genera el plan alimenticio.
use App\Application\Nutrition\Actions\GenerateNutritionPlanAction;
// Esta línea sirve para importar la acción que reemplaza un alimento del plan.
use App\Application\Nutrition\Actions\SubstituteMealItemAction;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación del reemplazo de un alimento.
use App\Http\Requests\Nutrition\SubstituteMealItemRequest;
// Esta línea sirve para importar el resource que da formato a un alimento del plan.
use App\Http\Resources\NutritionPlanMealItemResource;
// Esta línea sirve para importar el resource que da formato a un plan alimenticio.
use App\Http\Resources\NutritionPlanResource;
// Esta línea sirve para importar el modelo NutritionPlan (plan alimenticio).
use App\Models\NutritionPlan;
// Esta línea sirve para importar el modelo NutritionPlanMealItem (alimento de una comida del plan).
use App\Models\NutritionPlanMealItem;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la fachada Gate para verificar permisos.
use Illuminate\Support\Facades\Gate;
// Esta línea sirve para importar la excepción que indica categoría distinta.
use InvalidArgumentException;
// Esta línea sirve para importar la excepción que indica perfil incompleto.
use RuntimeException;

// Esta línea sirve para agrupar este controller en la sección "Nutrición" de Swagger.
#[Group('Nutrición', weight: 14)]
// Esta línea sirve para declarar el controller del plan alimenticio.
class NutritionPlanController extends Controller
{
    /**
     * Ver mi plan alimenticio.
     *
     * Responde 404 si todavía no se generó.
     */
    // Esta línea sirve para declarar el endpoint que muestra el plan del usuario.
    public function show(Request $request): JsonResponse
    {
        // Esta línea sirve para consultar el plan.
        $plan = NutritionPlan::query()
            // Esta línea sirve para filtrar por el usuario.
            ->where('user_id', $request->user()->id)
            // Esta línea sirve para cargar sus comidas, alimentos y datos nutricionales.
            ->with('meals.items.foodItem')
            // Esta línea sirve para obtener el primero.
            ->first();

        // Esta línea sirve para revisar si el usuario no tiene plan.
        if (! $plan) {
            // Esta línea sirve para responder con error 404.
            return response()->json([
                // Esta línea sirve para indicar que todavía no se generó el plan.
                'message' => 'Todavía no generaste tu plan alimenticio.',
                // Esta línea sirve para indicar el código HTTP 404.
            ], 404);
        }

        // Esta línea sirve para responder con el plan con su formato.
        return response()->json(['data' => new NutritionPlanResource($plan)]);
    }

    /**
     * Generar mi plan alimenticio.
     *
     * Reparte los objetivos diarios entre las comidas del día con alimentos
     * del catálogo curado. Si ya había un plan, lo reemplaza. Responde 422 si
     * faltan datos del perfil o del onboarding.
     */
    // Esta línea sirve para declarar el endpoint que genera el plan alimenticio.
    public function store(Request $request, GenerateNutritionPlanAction $action): JsonResponse
    {
        // Esta línea sirve para intentar generar el plan.
        try {
            // Esta línea sirve para generar el plan del usuario.
            $plan = $action->generate($request->user());
            // Esta línea sirve para capturar el error de perfil incompleto.
        } catch (RuntimeException) {
            // Esta línea sirve para responder con error 422.
            return response()->json([
                // Esta línea sirve para indicar que hay que completar el perfil y el onboarding.
                'message' => 'Completá tu perfil (edad, sexo, peso, altura) y onboarding para generar tu plan.',
                // Esta línea sirve para indicar el código HTTP 422.
            ], 422);
        }

        // Esta línea sirve para responder con el plan creado y código 201.
        return response()->json(['data' => new NutritionPlanResource($plan)], 201);
    }

    /**
     * Reemplazar un alimento del plan.
     *
     * El alimento nuevo tiene que ser de la misma categoría que el actual (si
     * no, 422).
     */
    // Esta línea sirve para declarar el endpoint que reemplaza un alimento del plan.
    public function substituteItem(
        // Esta línea sirve para recibir el alimento nuevo validado.
        SubstituteMealItemRequest $request,
        // Esta línea sirve para recibir el ítem del plan a reemplazar.
        NutritionPlanMealItem $item,
        // Esta línea sirve para recibir la acción que hace el reemplazo.
        SubstituteMealItemAction $action,
        // Esta línea sirve para indicar que el método devuelve una respuesta JSON.
    ): JsonResponse {
        // Esta línea sirve para verificar que el ítem pertenece al plan del usuario.
        Gate::authorize('update', $item);

        // Esta línea sirve para intentar el reemplazo.
        try {
            // Esta línea sirve para reemplazar el alimento ajustando la cantidad.
            $item = $action->substitute($item, (int) $request->validated('food_item_id'));
            // Esta línea sirve para capturar el error de categoría distinta.
        } catch (InvalidArgumentException) {
            // Esta línea sirve para responder con error 422.
            return response()->json([
                // Esta línea sirve para indicar que el alimento no es de la misma categoría.
                'message' => 'El alimento elegido no pertenece a la misma categoría que el que estás reemplazando.',
                // Esta línea sirve para indicar el código HTTP 422.
            ], 422);
        }

        // Esta línea sirve para responder con el ítem actualizado.
        return response()->json(['data' => new NutritionPlanMealItemResource($item)]);
    }
}
