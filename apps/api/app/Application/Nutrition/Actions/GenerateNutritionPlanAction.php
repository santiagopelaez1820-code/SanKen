<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de nutrición.

namespace App\Application\Nutrition\Actions;

// Esta línea sirve para importar el catálogo de planes alimenticios curados.
use App\Domain\Nutrition\Services\NutritionPlanTemplateCatalog;
// Esta línea sirve para importar el servicio que calcula los objetivos diarios de nutrición.
use App\Domain\Nutrition\Services\NutritionTargetCalculator;
// Esta línea sirve para importar el modelo FoodItem (alimento).
use App\Models\FoodItem;
// Esta línea sirve para importar el modelo NutritionPlan (plan alimenticio).
use App\Models\NutritionPlan;
// Esta línea sirve para importar el modelo NutritionPlanMeal (comida del plan).
use App\Models\NutritionPlanMeal;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el modelo WorkoutSession (sesión de entrenamiento).
use App\Models\WorkoutSession;
// Esta línea sirve para importar la fachada DB para usar transacciones.
use Illuminate\Support\Facades\DB;
// Esta línea sirve para importar la excepción que se lanza si faltan datos del perfil.
use RuntimeException;

/**
 * Genera (o regenera, reemplazando el anterior) el plan alimenticio opt-in
 * de un usuario: reparte sus objetivos diarios (NutritionTargetCalculator)
 * entre 4 comidas según config('nutrition.meal_split_ratio'), y arma cada
 * comida con alimentos del catálogo curado (food_items source='manual').
 * Solo usa el catálogo curado, nunca productos de Open Food Facts (marcas/
 * porciones no controladas).
 *
 * Qué alimento entra en cada comida sale de NutritionPlanTemplateCatalog
 * (20 planes curados según el objetivo primario del usuario, elegidos de
 * forma estable por usuario) en vez de elegirse al azar — así dos usuarios
 * con datos distintos no terminan viendo la misma combinación de comidas.
 * Las CANTIDADES siguen calculándose exactamente igual que siempre
 * (gramsForMacro/FIXED_PORTION_GRAMS), eso no cambió.
 */
// Esta línea sirve para declarar la acción que genera el plan alimenticio de un usuario.
class GenerateNutritionPlanAction
{
    // Porción fija para categorías que no se dimensionan contra un macro
    // objetivo puntual del ítem (a diferencia de protein/carb, ver
    // gramsForMacro). Valores de sentido común para una porción de comida.
    // Esta línea sirve para definir las porciones fijas en gramos por categoría de alimento.
    private const FIXED_PORTION_GRAMS = [
        // Esta línea sirve para fijar la porción de grasas en 15 gramos.
        'fat' => 15,
        // Esta línea sirve para fijar la porción de verduras en 100 gramos.
        'vegetable' => 100,
        // Esta línea sirve para fijar la porción de frutas en 120 gramos.
        'fruit' => 120,
        // Esta línea sirve para fijar la porción de lácteos en 150 gramos.
        'dairy' => 150,
    ];

    // Esta línea sirve para declarar el constructor que recibe sus dependencias.
    public function __construct(
        // Esta línea sirve para recibir y guardar el calculador de objetivos de nutrición.
        private readonly NutritionTargetCalculator $calculator,
    ) {}

    // Esta línea sirve para declarar el método que genera el plan del usuario recibido.
    public function generate(User $user): NutritionPlan
    {
        // Esta línea sirve para cargar el perfil y las respuestas del onboarding si faltan.
        $user->loadMissing('profile', 'onboardingResponse');
        // Esta línea sirve para obtener el perfil del usuario.
        $profile = $user->profile;
        // Esta línea sirve para obtener las respuestas del onboarding.
        $onboarding = $user->onboardingResponse;

        // Mismo chequeo que NutritionController::targets() -- si no se
        // pueden calcular los objetivos diarios, tampoco se puede generar
        // un plan a partir de ellos.
        // Esta línea sirve para revisar si falta edad, sexo, peso o altura.
        if (! $profile?->age || ! $profile->sex || ! $profile->weight_kg || ! $profile->height_cm
            // Esta línea sirve para completar la condición: también falla si falta la frecuencia o los objetivos.
            || ! $onboarding?->frequency_days || empty($onboarding->goals)) {
            // Esta línea sirve para lanzar una excepción porque el perfil está incompleto.
            throw new RuntimeException('profile_incomplete');
        }

        // Esta línea sirve para consultar si el usuario ya entrenó hoy.
        $trainedToday = WorkoutSession::query()
            // Esta línea sirve para filtrar por el usuario.
            ->where('user_id', $user->id)
            // Esta línea sirve para quedarse solo con sesiones completadas.
            ->where('completed', true)
            // Esta línea sirve para quedarse solo con sesiones de hoy.
            ->whereDate('performed_at', now()->toDateString())
            // Esta línea sirve para devolver verdadero si existe alguna.
            ->exists();

        // Esta línea sirve para calcular los objetivos diarios de calorías y macros.
        $targets = $this->calculator->calculate(
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
            // Esta línea sirve para pasar los objetivos del usuario.
            $onboarding->goals,
            // Esta línea sirve para pasar si ya entrenó hoy.
            $trainedToday,
        );

        // Mismo criterio que NutritionTargetCalculator: solo la meta
        // primaria (primer elemento) decide qué plan curado se usa.
        // Esta línea sirve para elegir el plan curado según el objetivo principal del usuario.
        $template = NutritionPlanTemplateCatalog::pickForUser($user->id, $onboarding->goals[0] ?? '');

        // Esta línea sirve para crear el plan dentro de una transacción y devolverlo.
        return DB::transaction(function () use ($user, $targets, $template) {
            // Un usuario tiene a lo sumo un plan (unique en user_id):
            // regenerar reemplaza el anterior por completo, cascade borra
            // sus meals/items.
            // Esta línea sirve para borrar el plan anterior del usuario (sus comidas se borran en cascada).
            NutritionPlan::query()->where('user_id', $user->id)->delete();

            // Esta línea sirve para crear el plan nuevo con los objetivos diarios.
            $plan = NutritionPlan::query()->create([
                // Esta línea sirve para guardar el id del usuario.
                'user_id' => $user->id,
                // Esta línea sirve para guardar las calorías diarias.
                'calories' => $targets['calories'],
                // Esta línea sirve para guardar los gramos de proteína.
                'protein_g' => $targets['protein_g'],
                // Esta línea sirve para guardar los gramos de carbohidratos.
                'carbs_g' => $targets['carbs_g'],
                // Esta línea sirve para guardar los gramos de grasa.
                'fat_g' => $targets['fat_g'],
            ]);

            // Esta línea sirve para iniciar el contador del orden de las comidas.
            $order = 0;
            // Esta línea sirve para recorrer cada tipo de comida con su proporción del día.
            foreach (config('nutrition.meal_split_ratio') as $mealType => $ratio) {
                // Esta línea sirve para aumentar el número de orden de la comida.
                $order++;

                // Esta línea sirve para crear la comida dentro del plan.
                $meal = $plan->meals()->create([
                    // Esta línea sirve para guardar el tipo de comida (desayuno, almuerzo...).
                    'meal_type' => $mealType,
                    // Esta línea sirve para guardar el orden de la comida en el día.
                    'order' => $order,
                    // Esta línea sirve para guardar las calorías objetivo de la comida según su proporción.
                    'target_calories' => (int) round($targets['calories'] * $ratio),
                    // Esta línea sirve para guardar la proteína objetivo de la comida.
                    'target_protein_g' => (int) round($targets['protein_g'] * $ratio),
                    // Esta línea sirve para guardar los carbohidratos objetivo de la comida.
                    'target_carbs_g' => (int) round($targets['carbs_g'] * $ratio),
                    // Esta línea sirve para guardar la grasa objetivo de la comida.
                    'target_fat_g' => (int) round($targets['fat_g'] * $ratio),
                ]);

                // Esta línea sirve para llenar la comida con alimentos según el plan curado.
                $this->fillMeal($meal, $mealType, $template['meals'][$mealType] ?? []);
            }

            // Esta línea sirve para devolver el plan con sus comidas, ítems y alimentos cargados.
            return $plan->load('meals.items.foodItem');
        });
    }

    /**
     * @param  array<string, string>  $templateFoodNames  categoría -> nombre del FoodItem elegido para esta comida en el plan curado (vacío si no hay plantilla para el objetivo del usuario).
     */
    // Esta línea sirve para declarar el método privado que llena una comida con alimentos.
    private function fillMeal(NutritionPlanMeal $meal, string $mealType, array $templateFoodNames): void
    {
        // Esta línea sirve para obtener las categorías de alimento que lleva ese tipo de comida.
        $categories = config("nutrition.meal_categories.{$mealType}", []);

        // Esta línea sirve para recorrer cada categoría de la comida.
        foreach ($categories as $category) {
            // Esta línea sirve para empezar sin alimento elegido.
            $food = null;

            // Primero el alimento que indica el plan curado para esta
            // categoría; si no existe en el catálogo (no debería pasar,
            // pero un catálogo desactualizado no tiene por qué tumbar la
            // generación) o no hay plantilla para el objetivo del usuario,
            // cae al azar de siempre dentro de la misma categoría.
            // Esta línea sirve para revisar si el plan curado indica un alimento para esta categoría.
            if (isset($templateFoodNames[$category])) {
                // Esta línea sirve para buscar ese alimento en el catálogo.
                $food = FoodItem::query()
                    // Esta línea sirve para filtrar solo alimentos del catálogo curado.
                    ->where('source', 'manual')
                    // Esta línea sirve para filtrar por la misma categoría.
                    ->where('category', $category)
                    // Esta línea sirve para filtrar por el nombre que indica el plan curado.
                    ->where('name', $templateFoodNames[$category])
                    // Esta línea sirve para obtener el primero que coincida.
                    ->first();
            }

            // Esta línea sirve para buscar otro alimento como alternativa si no se encontró el del plan.
            $food ??= FoodItem::query()
                // Esta línea sirve para filtrar solo alimentos del catálogo curado.
                ->where('source', 'manual')
                // Esta línea sirve para filtrar por la misma categoría.
                ->where('category', $category)
                // Esta línea sirve para ordenar los resultados al azar.
                ->inRandomOrder()
                // Esta línea sirve para obtener el primero.
                ->first();

            // Esta línea sirve para revisar si no hay ningún alimento de esta categoría.
            if (! $food) {
                // El catálogo curado no tiene ningún alimento de esta
                // categoría todavía -- no debería pasar con el seeder
                // actual, pero no tiene sentido reventar la generación
                // entera del plan por una categoría faltante.
                // Esta línea sirve para saltar a la siguiente categoría.
                continue;
            }

            // Esta línea sirve para calcular los gramos según la categoría del alimento.
            $grams = match ($category) {
                // Esta línea sirve para calcular, si es proteína, los gramos que cubren la proteína objetivo.
                'protein' => $this->gramsForMacro($meal->target_protein_g, (float) $food->protein_per_100g),
                // Esta línea sirve para calcular, si es carbohidrato, los gramos que cubren los carbohidratos objetivo.
                'carb' => $this->gramsForMacro($meal->target_carbs_g, (float) $food->carbs_per_100g),
                // Esta línea sirve para usar la porción fija de la categoría (o 100 gramos) en el resto de casos.
                default => self::FIXED_PORTION_GRAMS[$category] ?? 100,
            };

            // Esta línea sirve para agregar el alimento como ítem de la comida.
            $meal->items()->create([
                // Esta línea sirve para guardar el id del alimento.
                'food_item_id' => $food->id,
                // Esta línea sirve para guardar la cantidad en gramos.
                'quantity_grams' => $grams,
            ]);
        }
    }

    // Esta línea sirve para declarar el método privado que calcula los gramos para cubrir un macro.
    private function gramsForMacro(int $targetGrams, float $per100g): float
    {
        // Esta línea sirve para revisar si el alimento no aporta ese macro.
        if ($per100g <= 0) {
            // Esta línea sirve para devolver 100 gramos por defecto.
            return 100.0;
        }

        // Esta línea sirve para calcular los gramos necesarios con regla de tres.
        $grams = ($targetGrams / $per100g) * 100;

        // Clamp a una porción físicamente razonable (20g-500g) para que un
        // objetivo muy chico/grande no genere una cantidad absurda.
        // Esta línea sirve para limitar el resultado entre 20 y 500 gramos y redondear a un decimal.
        return round(max(20.0, min($grams, 500.0)), 1);
    }
}
