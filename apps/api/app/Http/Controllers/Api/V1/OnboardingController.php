<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de la API v1.

namespace App\Http\Controllers\Api\V1;

// Esta línea sirve para importar la acción que completa el onboarding.
use App\Application\Onboarding\Actions\CompleteOnboardingAction;
// Esta línea sirve para importar la acción que guarda las respuestas del onboarding.
use App\Application\Onboarding\Actions\SubmitOnboardingAction;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación de las respuestas del onboarding.
use App\Http\Requests\Onboarding\OnboardingRequest;
// Esta línea sirve para importar el resource que da formato al onboarding.
use App\Http\Resources\OnboardingResource;
// Esta línea sirve para importar el modelo City (ciudad).
use App\Models\City;
// Esta línea sirve para importar el modelo Country (país).
use App\Models\Country;
// Esta línea sirve para importar el modelo RoutineTemplate (plantilla de rutina).
use App\Models\RoutineTemplate;
// Esta línea sirve para importar el modelo State (departamento o estado).
use App\Models\State;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la excepción que indica que no hay plantilla de rutina.
use RuntimeException;

// Esta línea sirve para agrupar este controller en la sección "Onboarding" de Swagger.
#[Group('Onboarding', 'Cuestionario inicial (nivel, objetivos, frecuencia, equipamiento y ubicación). Completarlo genera la primera rutina del usuario.', weight: 4)]
// Esta línea sirve para declarar el controller del onboarding.
class OnboardingController extends Controller
{
    /**
     * Obtener las opciones del cuestionario.
     *
     * Niveles, objetivos, frecuencias (solo las que tienen una plantilla de
     * rutina activa), equipamiento y países.
     */
    // Esta línea sirve para declarar el endpoint que devuelve las opciones del cuestionario.
    public function questions(): JsonResponse
    {
        // Esta línea sirve para responder con las opciones.
        return response()->json([
            // Esta línea sirve para armar los datos.
            'data' => [
                // Esta línea sirve para incluir los niveles configurados.
                'levels' => config('onboarding.levels'),
                // Esta línea sirve para incluir los objetivos configurados.
                'goals' => config('onboarding.goals'),
                // Reemplaza el config estático — una frecuencia solo aparece
                // acá si existe al menos una plantilla activa para ella (ver
                // RoutineTemplate::activeFrequencyDays), así que agregar una
                // plantilla nueva desde Super Admin la habilita sin deploy.
                // Esta línea sirve para incluir solo las frecuencias que tienen una plantilla activa.
                'frequency_days' => RoutineTemplate::activeFrequencyDays(),
                // Esta línea sirve para incluir el equipamiento configurado.
                'equipment' => config('onboarding.equipment'),
                // Solo id/name — las ciudades de cada país (potencialmente
                // miles en total) se piden bajo demanda vía cities() una vez
                // que el usuario elige un país, no todas de una.
                // Esta línea sirve para incluir los países.
                'countries' => Country::query()
                    // Esta línea sirve para ordenar los países por nombre.
                    ->orderBy('name')
                    // Esta línea sirve para obtener solo id y nombre.
                    ->get(['id', 'name'])
                    // Esta línea sirve para convertir cada país en un objeto simple.
                    ->map(fn (Country $country) => [
                        // Esta línea sirve para incluir el id del país.
                        'id' => $country->id,
                        // Esta línea sirve para incluir el nombre del país.
                        'name' => $country->name,
                    ]),
            ],
        ]);
    }

    /** Listar las ciudades de un país. */
    // Esta línea sirve para declarar el endpoint que lista las ciudades de un país.
    public function cities(Country $country): JsonResponse
    {
        // Esta línea sirve para responder con las ciudades.
        return response()->json([
            // Esta línea sirve para consultar las ciudades.
            'data' => City::query()
                // Esta línea sirve para filtrar por el país.
                ->where('country_id', $country->id)
                // Esta línea sirve para ordenar por nombre.
                ->orderBy('name')
                // Esta línea sirve para obtener solo id y nombre.
                ->get(['id', 'name'])
                // Esta línea sirve para convertir cada ciudad en un objeto simple.
                ->map(fn (City $city) => ['id' => $city->id, 'name' => $city->name]),
        ]);
    }

    /**
     * Listar los departamentos o estados de un país.
     *
     * Departamentos/estados/provincias de un país — nivel intermedio entre
     * país y ciudad.
     *
     * "Nacional" es el placeholder que StateSeeder creaba antes de que
     * ImportLocationData trajera departamentos/estados reales para casi
     * todos los países — ver el docblock de ese comando para por qué esas
     * filas viejas siguen existiendo en la tabla (no se borran mientras
     * alguna ciudad las siga referenciando, por seguridad). Acá, en cambio,
     * es seguro ocultarlo de la lista que ve el usuario apenas hay
     * alternativas reales: no se toca ningún dato, solo se filtra qué se
     * muestra. Si "Nacional" es la ÚNICA fila para ese país (no hay datos
     * reales en la fuente), se sigue mostrando — mejor esa opción que
     * ninguna.
     */
    // Esta línea sirve para declarar el endpoint que lista los departamentos/estados de un país.
    public function states(Country $country): JsonResponse
    {
        // Esta línea sirve para consultar los estados.
        $states = State::query()
            // Esta línea sirve para filtrar por el país.
            ->where('country_id', $country->id)
            // Esta línea sirve para ordenar por nombre.
            ->orderBy('name')
            // Esta línea sirve para obtener solo id y nombre.
            ->get(['id', 'name']);

        // Esta línea sirve para revisar si hay más de un estado.
        if ($states->count() > 1) {
            // Esta línea sirve para ocultar el estado "Nacional" y reindexar.
            $states = $states->reject(fn (State $state) => $state->name === 'Nacional')->values();
        }

        // Esta línea sirve para responder con los estados.
        return response()->json([
            // Esta línea sirve para convertir cada estado en un objeto simple.
            'data' => $states->map(fn (State $state) => ['id' => $state->id, 'name' => $state->name]),
        ]);
    }

    /**
     * Buscar ciudades de un departamento o estado.
     *
     * Con datos reales importados, un solo estado puede tener miles de
     * ciudades (ver ImportLocationData) — nunca se devuelven todas de una.
     * `search` filtra por coincidencia parcial case-insensitive sobre el
     * nombre; `limit` topea el tamaño de página (default 50, tope 100 para
     * no volver a habilitar el "traer todo" por la puerta de atrás).
     */
    // Esta línea sirve para declarar el endpoint que busca ciudades de un departamento/estado.
    public function citiesByState(Request $request, State $state): JsonResponse
    {
        // Esta línea sirve para leer el texto de búsqueda (vacío por defecto).
        $search = trim((string) $request->query('search', ''));
        // Esta línea sirve para leer el límite de resultados (50 por defecto).
        $limit = (int) $request->query('limit', 50);
        // Esta línea sirve para mantener el límite entre 1 y 100.
        $limit = max(1, min($limit, 100));

        // Esta línea sirve para responder con las ciudades.
        return response()->json([
            // Esta línea sirve para consultar las ciudades.
            'data' => City::query()
                // Esta línea sirve para filtrar por el estado.
                ->where('state_id', $state->id)
                // Esta línea sirve para filtrar por el texto si se envió.
                ->when($search !== '', fn ($query) => $query->where('name', 'like', '%'.$search.'%'))
                // Esta línea sirve para ordenar por nombre.
                ->orderBy('name')
                // Esta línea sirve para limitar la cantidad de resultados.
                ->limit($limit)
                // Esta línea sirve para obtener solo id y nombre.
                ->get(['id', 'name'])
                // Esta línea sirve para convertir cada ciudad en un objeto simple.
                ->map(fn (City $city) => ['id' => $city->id, 'name' => $city->name]),
        ]);
    }

    /** Obtener mis respuestas del onboarding. */
    // Esta línea sirve para declarar el endpoint que devuelve las respuestas del onboarding.
    public function show(Request $request): JsonResponse
    {
        // Esta línea sirve para responder con el onboarding.
        return response()->json([
            // Esta línea sirve para incluir el perfil con su ciudad y las respuestas.
            'data' => new OnboardingResource($request->user()->loadMissing('profile.city', 'onboardingResponse')),
        ]);
    }

    /** Enviar las respuestas del onboarding. */
    // Esta línea sirve para declarar el endpoint que guarda las respuestas del onboarding.
    public function store(OnboardingRequest $request, SubmitOnboardingAction $action): JsonResponse
    {
        // Esta línea sirve para guardar las respuestas validadas.
        $action->execute($request->user(), $request->validated());

        // Esta línea sirve para responder con el onboarding.
        return response()->json([
            // Esta línea sirve para incluir el perfil y las respuestas recargados.
            'data' => new OnboardingResource($request->user()->fresh(['profile', 'onboardingResponse'])),
            // Esta línea sirve para indicar el código 201 (creado).
        ], 201);
    }

    /** Actualizar las respuestas del onboarding. */
    // Esta línea sirve para declarar el endpoint que actualiza las respuestas del onboarding.
    public function update(OnboardingRequest $request, SubmitOnboardingAction $action): JsonResponse
    {
        // Esta línea sirve para guardar las respuestas validadas.
        $action->execute($request->user(), $request->validated());

        // Esta línea sirve para responder con el onboarding.
        return response()->json([
            // Esta línea sirve para incluir el perfil y las respuestas recargados.
            'data' => new OnboardingResource($request->user()->fresh(['profile', 'onboardingResponse'])),
        ]);
    }

    /**
     * Completar el onboarding.
     *
     * Marca el onboarding como completo y genera la rutina del usuario con la
     * plantilla que corresponde a su sexo, frecuencia y nivel. Responde 422 si
     * no hay plantilla para esa combinación.
     */
    // Esta línea sirve para declarar el endpoint que completa el onboarding.
    public function complete(Request $request, CompleteOnboardingAction $action): JsonResponse
    {
        // RuntimeException = TemplateRoutineGenerator no encontro plantilla
        // para la combinacion sexo+frecuencia+nivel del usuario (ver el
        // comentario en CompleteOnboardingAction) — mismo idioma que
        // NutritionPlanController::store() para el mismo tipo de falla.
        // Esta línea sirve para intentar completar el onboarding.
        try {
            // Esta línea sirve para completar el onboarding y generar la rutina.
            $user = $action->execute($request->user());
            // Esta línea sirve para capturar el error de plantilla inexistente.
        } catch (RuntimeException) {
            // Esta línea sirve para responder con error 422.
            return response()->json([
                // Esta línea sirve para indicar que no hay rutina para esa combinación.
                'message' => 'No hay una rutina disponible todavía para tu combinación de sexo, frecuencia y nivel. Contactá soporte.',
                // Esta línea sirve para indicar el código HTTP 422.
            ], 422);
        }

        // Esta línea sirve para responder con el onboarding completo.
        return response()->json([
            // Esta línea sirve para incluir el usuario con su formato de onboarding.
            'data' => new OnboardingResource($user),
        ]);
    }
}
