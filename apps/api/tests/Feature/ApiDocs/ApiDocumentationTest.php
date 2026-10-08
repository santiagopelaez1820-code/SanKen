<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\ApiDocs.

namespace Tests\Feature\ApiDocs;

// Esta línea sirve para importar la clase StripLineCommentsFromDescriptions.
use App\Http\ApiDocs\StripLineCommentsFromDescriptions;
// Esta línea sirve para importar la clase Generator.
use Dedoc\Scramble\Generator;
// Esta línea sirve para importar la clase Scramble.
use Dedoc\Scramble\Scramble;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la fachada Route.
use Illuminate\Support\Facades\Route;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

/**
 * Documentación OpenAPI generada con Scramble (config/scramble.php). Hace
 * cumplir el "Endpoint documentado en OpenAPI" de la Definition of Done
 * (docs/06-roadmap-sprints.md): un endpoint nuevo sin título en el PHPDoc o
 * sin #[Group] en su controller rompe este test.
 */
// Esta línea sirve para declarar la clase de tests ApiDocumentationTest.
class ApiDocumentationTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el test que comprueba que todas las rutas v1 están documentadas sin problemas.
    public function test_every_v1_route_is_documented_without_generation_issues(): void
    {
        // Directo al Generator (sin la caché de CacheableGenerator) para
        // poder leer también los diagnósticos de la generación.
        // Esta línea sirve para generar la documentación directamente con el Generator (sin caché).
        $result = app(Generator::class)->generate(Scramble::getGeneratorConfig(Scramble::DEFAULT_API));
        // Esta línea sirve para obtener la especificación OpenAPI como arreglo.
        $spec = $result->spec();

        // Esta línea sirve para exigir que la generación no tenga diagnósticos (problemas).
        $this->assertTrue($result->diagnostics()->isEmpty(), json_encode($result->diagnostics()->toArray(), JSON_PRETTY_PRINT));
        // Esta línea sirve para exigir que sea OpenAPI 3.1.0.
        $this->assertSame('3.1.0', $spec['openapi']);

        // Esta línea sirve para armar la lista de operaciones recorriendo cada ruta y sus métodos.
        $operations = collect($spec['paths'])->flatMap(fn (array $methods, string $path) => collect($methods)
            // Esta línea sirve para convertir cada método en "MÉTODO /ruta" junto con su operación.
            ->map(fn (array $operation, string $method) => [strtoupper($method).' '.$path, $operation])
            // Esta línea sirve para reindexar la lista.
            ->values());

        // Esta línea sirve para contar las rutas de la API v1.
        $v1Routes = collect(Route::getRoutes()->getRoutes())
            // Esta línea sirve para quedarse con las que empiezan por api/v1/.
            ->filter(fn ($route) => str_starts_with($route->uri(), 'api/v1/'))
            // Esta línea sirve para sumar sus métodos HTTP sin contar HEAD.
            ->sum(fn ($route) => count(array_diff($route->methods(), ['HEAD'])));
        // Esta línea sirve para exigir que haya una operación documentada por cada ruta.
        $this->assertCount($v1Routes, $operations);

        // Esta línea sirve para obtener los nombres de los grupos (tags).
        $groups = collect($spec['tags'])->pluck('name');
        // Esta línea sirve para recorrer cada operación.
        foreach ($operations as [$endpoint, $operation]) {
            // Esta línea sirve para exigir que tenga título.
            $this->assertNotEmpty($operation['summary'] ?? null, "{$endpoint}: falta el título (primera línea del PHPDoc del método).");
            // Esta línea sirve para exigir que pertenezca a un grupo existente.
            $this->assertContains($operation['tags'][0] ?? null, $groups, "{$endpoint}: falta #[Group] en el controller.");
        }
    }

    // Esta línea sirve para declarar el test que comprueba la autenticación Bearer y las rutas públicas.
    public function test_bearer_auth_is_documented_and_public_routes_are_marked_as_such(): void
    {
        // Esta línea sirve para generar la especificación OpenAPI.
        $spec = app(Generator::class)->generate(Scramble::getGeneratorConfig(Scramble::DEFAULT_API))->spec();

        // Esta línea sirve para exigir que el esquema de seguridad sea Bearer.
        $this->assertSame(['type' => 'http', 'scheme' => 'bearer'], $spec['components']['securitySchemes']['http']);
        // Esta línea sirve para exigir que la seguridad global sea ese esquema.
        $this->assertSame([['http' => []]], $spec['security']);

        // Sin auth:sanctum => `security: []` (público); con auth:sanctum
        // hereda el Bearer global.
        // Esta línea sirve para exigir que el login sea público (sin seguridad).
        $this->assertSame([], $spec['paths']['/auth/login']['post']['security']);
        // Esta línea sirve para exigir que /auth/me use la seguridad global.
        $this->assertArrayNotHasKey('security', $spec['paths']['/auth/me']['get']);

        // DeleteRequestBodyExtension: la contraseña de DELETE /auth/me va en
        // el body JSON, nunca como query param.
        // Esta línea sirve para obtener la operación DELETE /auth/me.
        $deleteAccount = $spec['paths']['/auth/me']['delete'];
        // Esta línea sirve para exigir que no tenga parámetros en la query.
        $this->assertSame([], $deleteAccount['parameters'] ?? []);
        // Esta línea sirve para exigir que la contraseña vaya en el body JSON.
        $this->assertArrayHasKey('password', $deleteAccount['requestBody']['content']['application/json']['schema']['properties']);
    }

    // Esta línea sirve para declarar el test que comprueba que los comentarios línea por línea no llegan a las descripciones.
    public function test_line_by_line_code_comments_do_not_leak_into_descriptions(): void
    {
        // Esta línea sirve para generar la especificación OpenAPI.
        $spec = app(Generator::class)->generate(Scramble::getGeneratorConfig(Scramble::DEFAULT_API))->spec();

        // Scramble toma el comentario `//` de cada clave de un arreglo como
        // descripción del campo: los comentarios línea por línea del código
        // no deben llegar a Swagger.
        // Esta línea sirve para exigir que el texto de los comentarios no aparezca en la especificación.
        $this->assertStringNotContainsString(
            // Esta línea sirve para buscar el texto marcador de los comentarios.
            StripLineCommentsFromDescriptions::MARKER,
            // Esta línea sirve para convertir la especificación a JSON sin escapar tildes.
            json_encode($spec, JSON_UNESCAPED_UNICODE),
        );

        // Un comentario que sí describe el campo se conserva.
        // Esta línea sirve para obtener el campo frequency_days de la respuesta de /onboarding/questions.
        $frequency = $spec['paths']['/onboarding/questions']['get']['responses'][200]['content']['application/json']['schema']['properties']['data']['properties']['frequency_days'];
        // Esta línea sirve para exigir que su descripción empiece con el comentario original.
        $this->assertStringStartsWith('Reemplaza el config estático', $frequency['description']);
        // Esta línea sirve para exigir que su descripción termine con el comentario original.
        $this->assertStringEndsWith('la habilita sin deploy.', $frequency['description']);
    }

    // Esta línea sirve para declarar el test que comprueba que Swagger UI se sirve en local.
    public function test_swagger_ui_is_served_in_local(): void
    {
        // Esta línea sirve para simular que la app corre en el entorno local.
        $this->app['env'] = 'local';

        // Esta línea sirve para pedir la página de la documentación.
        $this->get('/docs/api')
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk()
            // Esta línea sirve para exigir que la página contenga swagger-ui-bundle.js.
            ->assertSee('swagger-ui-bundle.js', false)
            // Esta línea sirve para exigir que la página contenga <title>SanKen API</title>.
            ->assertSee('<title>SanKen API</title>', false);
    }

    // Esta línea sirve para declarar el test que comprueba que la documentación está prohibida fuera de local.
    public function test_docs_are_forbidden_outside_local(): void
    {
        // Esta línea sirve para simular que la app corre en el entorno production.
        $this->app['env'] = 'production';

        // Esta línea sirve para exigir 403 al pedir la interfaz.
        $this->get('/docs/api')->assertForbidden();
        // Esta línea sirve para exigir 403 al pedir el JSON.
        $this->get('/docs/api.json')->assertForbidden();
    }
}
