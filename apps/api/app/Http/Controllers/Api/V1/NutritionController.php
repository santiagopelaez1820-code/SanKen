<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de la API v1.

namespace App\Http\Controllers\Api\V1;

// Esta línea sirve para importar la acción que busca alimentos (base local y Open Food Facts).
use App\Application\Nutrition\Actions\FindOrCacheFoodItemAction;
// Esta línea sirve para importar el servicio que calcula los objetivos de nutrición.
use App\Domain\Nutrition\Services\NutritionTargetCalculator;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación del registro de una comida.
use App\Http\Requests\Nutrition\LogMealRequest;
// Esta línea sirve para importar la validación de la búsqueda de alimentos.
use App\Http\Requests\Nutrition\SearchFoodsRequest;
// Esta línea sirve para importar el resource que da formato a un alimento.
use App\Http\Resources\FoodItemResource;
// Esta línea sirve para importar el resource que da formato a una comida registrada.
use App\Http\Resources\MealLogResource;
// Esta línea sirve para importar el modelo MealLog (comida registrada).
use App\Models\MealLog;
// Esta línea sirve para importar el modelo WorkoutSession (sesión de entrenamiento).
use App\Models\WorkoutSession;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la fachada Gate para verificar permisos.
use Illuminate\Support\Facades\Gate;

// Esta línea sirve para agrupar este controller en la sección "Nutrición" de Swagger.
#[Group('Nutrición', 'Objetivos diarios de calorías y macros, registro de comidas, búsqueda de alimentos (Open Food Facts) y plan alimenticio.', weight: 14)]
// Esta línea sirve para declarar el controller de nutrición.
class NutritionController extends Controller
{
    /**
     * Obtener mis objetivos de nutrición del día.
     *
     * Calorías y macros calculados con el perfil (edad, sexo, peso y altura)
     * y el onboarding; tiene en cuenta si hoy ya se completó un
     * entrenamiento. Responde 404 si faltan esos datos.
     */
    // Esta línea sirve para declarar el endpoint que calcula los objetivos de nutrición del día.
    public function targets(Request $request, NutritionTargetCalculator $calculator): JsonResponse
    {
        // Esta línea sirve para obtener el usuario con su perfil y onboarding cargados.
        $user = $request->user()->loadMissing('profile', 'onboardingResponse');
        // Esta línea sirve para obtener el perfil.
        $profile = $user->profile;
        // Esta línea sirve para obtener las respuestas del onboarding.
        $onboarding = $user->onboardingResponse;

        // Esta línea sirve para revisar si falta edad, sexo, peso o altura.
        if (! $profile?->age || ! $profile->sex || ! $profile->weight_kg || ! $profile->height_cm
            // Esta línea sirve para completar la condición: también si falta la frecuencia o los objetivos.
            || ! $onboarding?->frequency_days || empty($onboarding->goals)) {
            // Esta línea sirve para responder con error 404.
            return response()->json([
                // Esta línea sirve para indicar el mensaje que pide completar el perfil.
                'message' => 'Completá tu perfil (edad, sexo, peso, altura) y onboarding para calcular tus objetivos de nutrición.',
                // Esta línea sirve para indicar el código HTTP 404.
            ], 404);
        }

        // Esta línea sirve para consultar si el usuario ya entrenó hoy.
        $trainedToday = WorkoutSession::query()
            // Esta línea sirve para filtrar por el usuario.
            ->where('user_id', $user->id)
            // Esta línea sirve para filtrar solo las sesiones completadas.
            ->where('completed', true)
            // Esta línea sirve para filtrar solo las de hoy.
            ->whereDate('performed_at', now()->toDateString())
            // Esta línea sirve para devolver verdadero si existe alguna.
            ->exists();

        // Esta línea sirve para calcular los objetivos del día.
        $targets = $calculator->calculate(
            // Esta línea sirve para pasar la edad.
            $profile->age,
            // Esta línea sirve para pasar el sexo.
            $profile->sex,
            // Esta línea sirve para pasar el peso en kilos.
            (float) $profile->weight_kg,
            // Esta línea sirve para pasar la altura en centímetros.
            (float) $profile->height_cm,
            // Esta línea sirve para pasar los días de entrenamiento por semana.
            $onboarding->frequency_days,
            // Esta línea sirve para pasar los objetivos.
            $onboarding->goals,
            // Esta línea sirve para pasar si ya entrenó hoy.
            $trainedToday,
        );

        // Esta línea sirve para responder con los objetivos.
        return response()->json(['data' => $targets]);
    }

    /**
     * Listar las comidas registradas en un día.
     *
     * `date` en formato `YYYY-MM-DD` (por defecto, hoy). `meta.summary` trae
     * los totales de calorías y macros del día.
     */
    // Esta línea sirve para declarar el endpoint que lista las comidas de un día.
    public function meals(Request $request): JsonResponse
    {
        // Esta línea sirve para leer la fecha pedida (hoy por defecto).
        $date = $request->query('date', now()->toDateString());

        // Esta línea sirve para consultar las comidas registradas.
        $logs = MealLog::query()
            // Esta línea sirve para filtrar por el usuario.
            ->where('user_id', $request->user()->id)
            // Esta línea sirve para filtrar por la fecha.
            ->whereDate('logged_at', $date)
            // Esta línea sirve para cargar el alimento de cada comida.
            ->with('foodItem')
            // Esta línea sirve para ordenar por hora de registro.
            ->orderBy('created_at')
            // Esta línea sirve para ejecutar la consulta.
            ->get();

        // Esta línea sirve para sumar los totales del día recorriendo cada comida.
        $summary = $logs->reduce(function (array $totals, MealLog $log) {
            // Esta línea sirve para calcular los macros de la comida según su cantidad.
            $macros = $log->foodItem->macrosFor((float) $log->quantity_grams);
            // Esta línea sirve para sumar las calorías.
            $totals['calories'] += $macros['calories'];
            // Esta línea sirve para sumar la proteína.
            $totals['protein_g'] += $macros['protein_g'];
            // Esta línea sirve para sumar los carbohidratos.
            $totals['carbs_g'] += $macros['carbs_g'];
            // Esta línea sirve para sumar la grasa.
            $totals['fat_g'] += $macros['fat_g'];

            // Esta línea sirve para devolver los totales acumulados.
            return $totals;
            // Esta línea sirve para empezar los totales en cero.
        }, ['calories' => 0.0, 'protein_g' => 0.0, 'carbs_g' => 0.0, 'fat_g' => 0.0]);

        // Esta línea sirve para responder con las comidas.
        return response()->json([
            // Esta línea sirve para incluir las comidas con su formato.
            'data' => MealLogResource::collection($logs),
            // Esta línea sirve para incluir datos extra.
            'meta' => [
                // Esta línea sirve para incluir la fecha consultada.
                'date' => $date,
                // Esta línea sirve para incluir el resumen redondeado a un decimal.
                'summary' => array_map(fn (float $v) => round($v, 1), $summary),
            ],
        ]);
    }

    /** Registrar una comida. */
    // Esta línea sirve para declarar el endpoint que registra una comida.
    public function logMeal(LogMealRequest $request): JsonResponse
    {
        // Esta línea sirve para crear la comida registrada.
        $meal = MealLog::query()->create([
            // Esta línea sirve para guardar el id del usuario.
            'user_id' => $request->user()->id,
            // Esta línea sirve para guardar el alimento.
            'food_item_id' => $request->validated('food_item_id'),
            // Esta línea sirve para guardar el tipo de comida.
            'meal_type' => $request->validated('meal_type'),
            // Esta línea sirve para guardar la cantidad en gramos.
            'quantity_grams' => $request->validated('quantity_grams'),
            // Esta línea sirve para guardar la fecha enviada o la de hoy.
            'logged_at' => $request->validated('logged_at') ?? now()->toDateString(),
        ]);

        // Esta línea sirve para responder con la comida creada y código 201.
        return response()->json(['data' => new MealLogResource($meal->load('foodItem'))], 201);
    }

    /** Eliminar una comida registrada. */
    // Esta línea sirve para declarar el endpoint que elimina una comida registrada.
    public function destroyMeal(Request $request, MealLog $meal): JsonResponse
    {
        // Esta línea sirve para verificar que la comida es del usuario.
        Gate::authorize('delete', $meal);

        // Esta línea sirve para borrar la comida.
        $meal->delete();

        // Esta línea sirve para responder con código 204 (sin contenido).
        return response()->json(status: 204);
    }

    /**
     * Buscar alimentos.
     *
     * Por texto (`q`) o por código de barras (`barcode`). Busca primero en el
     * catálogo local y solo consulta Open Food Facts si no lo encuentra. Con
     * `barcode` devuelve un solo alimento, o 404 si no existe.
     */
    // Esta línea sirve para declarar el endpoint que busca alimentos.
    public function searchFoods(SearchFoodsRequest $request, FindOrCacheFoodItemAction $action): JsonResponse
    {
        // Esta línea sirve para revisar si se buscó por código de barras.
        if ($barcode = $request->validated('barcode')) {
            // Esta línea sirve para buscar el alimento por código de barras.
            $item = $action->byBarcode($barcode);

            // Esta línea sirve para responder con el alimento, o 404 si no existe.
            return response()->json(['data' => $item ? new FoodItemResource($item) : null], $item ? 200 : 404);
        }

        // Esta línea sirve para buscar alimentos por texto.
        $items = $action->search($request->validated('q'));

        // Esta línea sirve para responder con los alimentos encontrados.
        return response()->json(['data' => FoodItemResource::collection($items)]);
    }
}
