<?php

// Esta línea sirve para importar la extensión que documenta el body de los DELETE.
use App\Http\ApiDocs\DeleteRequestBodyExtension;
// Esta línea sirve para importar el middleware que restringe el acceso a la documentación.
use Dedoc\Scramble\Http\Middleware\RestrictedDocsAccess;
// Esta línea sirve para importar la estrategia que marca la seguridad según el middleware de auth.
use Dedoc\Scramble\SecurityDocumentation\MiddlewareAuthSecurityStrategy;

/**
 * Documentación OpenAPI 3.1 de la API (Scramble), generada a partir del
 * código: rutas de routes/api.php, reglas de los FormRequests, API Resources
 * y el PHPDoc de cada método de controller (primera línea = título del
 * endpoint, el resto = descripción). Los grupos y su orden salen del
 * atributo #[Group] de cada controller.
 *
 * - UI (Swagger UI): GET /docs/api — vista resources/views/api-docs/swagger.blade.php
 * - JSON:            GET /docs/api.json
 * - Exportar:        php artisan scramble:export --path=storage/app/openapi.json
 * - Diagnóstico:     php artisan scramble:analyze
 *
 * Fuera de APP_ENV=local las dos rutas responden 403 salvo que se defina el
 * gate `viewApiDocs` (ver RestrictedDocsAccess y docs/03-api.md §16).
 */
// Esta línea sirve para devolver el arreglo de configuración de Scramble (Swagger).
return [
    /*
     * Solo la v1: con un único prefijo, Scramble usa `/api/v1` como servidor
     * y documenta las rutas sin él (`/auth/login`, igual que docs/03-api.md).
     */
    // Esta línea sirve para documentar solo las rutas bajo api/v1.
    'api_path' => 'api/v1',

    /*
     * Your API domain. By default, app domain is used. This is also a part of the default API routes
     * matcher, so when implementing your own, make sure you use this config if needed.
     */
    // Esta línea sirve para usar el dominio de la app.
    'api_domain' => null,

    /*
     * The path where your OpenAPI specification will be exported.
     */
    // Esta línea sirve para definir el archivo donde se exporta la especificación.
    'export_path' => 'api.json',

    /*
     * Cache configuration for the generated OpenAPI document.
     *
     * Use `scramble:cache` to warm the cache and `scramble:clear` to invalidate it.
     */
    // Esta línea sirve para configurar la caché del documento generado.
    'cache' => [
        // Esta línea sirve para definir la clave de caché.
        'key' => 'scramble.openapi',
        // Esta línea sirve para guardar la caché en archivos.
        'store' => 'file',
    ],

    // Esta línea sirve para definir la información general de la API.
    'info' => [
        // Esta línea sirve para definir la versión de la API (API_VERSION, 1.0.0 por defecto).
        'version' => env('API_VERSION', '1.0.0'),

        /*
         * Portada de la documentación (Markdown).
         */
        // Esta línea sirve para definir la portada de la documentación en Markdown.
        'description' => <<<'MD'
API REST de SanKen, consumida por la app móvil y la web. Todas las rutas de esta documentación cuelgan de `/api/v1`. Se genera automáticamente desde el código (rutas, FormRequests y API Resources); el JSON OpenAPI está en `/docs/api.json`.

## Autenticación

Los endpoints con candado requieren un token de Sanctum en el header `Authorization: Bearer {token}`. El token se obtiene con `POST /auth/login`, `POST /auth/register`, `POST /auth/social` o, si la cuenta tiene 2FA activo, `POST /auth/2fa/challenge`.

Para probarlos desde acá: copiar el `token` de la respuesta del login, abrir **Authorize** y pegarlo sin el prefijo `Bearer`.

## Formato de las respuestas

- Éxito: `{ "data": ..., "meta": ... }`; `meta` aparece solo cuando aplica (paginación, resúmenes).
- Error: `{ "message": "..." }`; los 422 de validación incluyen además `errors` con los mensajes por campo.
- Paginación: parámetro `page` y `meta.current_page`, `meta.last_page` y `meta.total` en la respuesta.

## Códigos de estado comunes

- `401`: token ausente, inválido o revocado.
- `403`: sin permiso sobre el recurso o sin el rol requerido. También responde `403` con `code: consent_required` cuando el usuario tiene documentos legales pendientes de aceptar (ver **Legal y consentimientos**).
- `404`: el recurso no existe.
- `422`: datos inválidos o una regla de negocio que no se cumple.
- `429`: límite de peticiones (120 por minuto en general, 30 por minuto en la mayoría de las escrituras y límites más estrictos en autenticación, por ejemplo 5 por minuto en login y registro).

## Roles

- `user`: todos los endpoints salvo las secciones **Entrenador** y **Admin**.
- `trainer`: además, la sección **Entrenador**.
- `super_admin`: además, las secciones **Admin**.
MD,
    ],

    // Esta línea sirve para configurar la interfaz.
    'ui' => [
        // Esta línea sirve para definir el título de la página.
        'title' => 'SanKen API',
    ],

    /*
     * Load Scramble's development tools on documentation pages. An explicit
     * SCRAMBLE_DEV_TOOLS value takes precedence over APP_DEBUG.
     *
     * Solo aplica a los renderers 'elements' y 'scalar' de Scramble; la vista
     * de Swagger UI no los carga (los diagnósticos se ven con
     * `php artisan scramble:analyze`).
     */
    // Esta línea sirve para configurar las herramientas de desarrollo de Scramble.
    'dev_tools' => [
        // Esta línea sirve para activarlas según SCRAMBLE_DEV_TOOLS o APP_DEBUG.
        'enabled' => env('SCRAMBLE_DEV_TOOLS', env('APP_DEBUG', false)),
    ],

    /*
     * Swagger UI. 'elements' (Stoplight, el default de Scramble) y 'scalar'
     * siguen disponibles cambiando solo este valor.
     */
    // Esta línea sirve para usar Swagger UI para mostrar la documentación.
    'renderer' => 'swagger',

    // Esta línea sirve para configurar cada interfaz disponible.
    'renderers' => [
        /*
         * Todo lo que no sea `view` se pasa tal cual a SwaggerUIBundle():
         * https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/
         */
        // Esta línea sirve para configurar Swagger UI.
        'swagger' => [
            // Esta línea sirve para usar la vista propia api-docs/swagger.
            'view' => 'api-docs.swagger',
            // Esta línea sirve para actualizar la URL al navegar por los endpoints.
            'deepLinking' => true,
            // Esta línea sirve para mostrar todas las secciones cerradas al inicio.
            'docExpansion' => 'none',
            // Esta línea sirve para mostrar el buscador de endpoints.
            'filter' => true,
            // Esta línea sirve para recordar el token después de recargar la página.
            'persistAuthorization' => true,
            // Esta línea sirve para mostrar cuánto tardó cada petición.
            'displayRequestDuration' => true,
        ],
        /*
         * Stoplight Elements config options: https://docs.stoplight.io/docs/elements/b074dc47b2826-elements-configuration-options
         */
        // Esta línea sirve para configurar Stoplight Elements.
        'elements' => [
            // Esta línea sirve para usar la vista de Scramble.
            'view' => 'scramble::docs',
            // Esta línea sirve para usar el tema claro.
            'theme' => 'light',
            // Esta línea sirve para mostrar el botón "Try it".
            'hideTryIt' => false,
            // Esta línea sirve para mostrar los schemas.
            'hideSchemas' => false,
            // Esta línea sirve para dejar el logo vacío.
            'logo' => '',
            // Esta línea sirve para enviar las cookies en las pruebas.
            'tryItCredentialsPolicy' => 'include',
            // Esta línea sirve para usar el diseño adaptable.
            'layout' => 'responsive',
            // Esta línea sirve para navegar con el hash de la URL.
            'router' => 'hash',
        ],
        /*
         * Scalar API reference config options: https://scalar.com/products/api-references/configuration
         */
        // Esta línea sirve para configurar Scalar.
        'scalar' => [
            // Esta línea sirve para usar la vista de Scalar de Scramble.
            'view' => 'scramble::scalar',
            // Esta línea sirve para cargar Scalar desde jsDelivr.
            'cdn' => 'https://cdn.jsdelivr.net/npm/@scalar/api-reference',
            // Esta línea sirve para usar el tema de Laravel.
            'theme' => 'laravel',
            // Esta línea sirve para usar el proxy de Scalar para las pruebas.
            'proxyUrl' => 'https://proxy.scalar.com',
            // Esta línea sirve para desactivar el modo oscuro.
            'darkMode' => false,
            // Esta línea sirve para ocultar las herramientas de desarrollo.
            'showDeveloperTools' => 'never',
            // Esta línea sirve para desactivar el agente de Scalar.
            'agent' => ['disabled' => true],
            // Esta línea sirve para enviar las cookies en las pruebas.
            'credentials' => 'include',
        ],
    ],

    /*
     * The list of servers of the API. By default, when `null`, server URL will be created from
     * `scramble.api_path` and `scramble.api_domain` config variables. When providing an array, you
     * will need to specify the local server URL manually (if needed).
     *
     * Example of non-default config (final URLs are generated using Laravel `url` helper):
     *
     * ```php
     * 'servers' => [
     *     'Live' => 'api',
     *     'Prod' => 'https://scramble.dedoc.co/api',
     * ],
     * ```
     */
    // Esta línea sirve para armar la URL del servidor con api_path y api_domain.
    'servers' => null,

    /**
     * Determines how Scramble stores the descriptions of enum cases.
     * Available options:
     * - 'description' – Case descriptions are stored as the enum schema's description using table formatting.
     * - 'extension' – Case descriptions are stored in the `x-enumDescriptions` enum schema extension.
     *
     *    @see https://redocly.com/docs-legacy/api-reference-docs/specification-extensions/x-enum-descriptions
     * - false - Case descriptions are ignored.
     */
    // Esta línea sirve para guardar las descripciones de los enums en la descripción del schema.
    'enum_cases_description_strategy' => 'description',

    /**
     * Determines how Scramble stores the names of enum cases.
     * Available options:
     * - 'names' – Case names are stored in the `x-enumNames` enum schema extension.
     * - 'varnames' - Case names are stored in the `x-enum-varnames` enum schema extension.
     * - false - Case names are not stored.
     */
    // Esta línea sirve para evitar guardar los nombres de los casos de los enums.
    'enum_cases_names_strategy' => false,

    /**
     * When Scramble encounters deep objects in query parameters, it flattens the parameters so the generated
     * OpenAPI document correctly describes the API. Flattening deep query parameters is relevant until
     * OpenAPI 3.2 is released and query string structure can be described properly.
     *
     * For example, this nested validation rule describes the object with `bar` property:
     * `['foo.bar' => ['required', 'int']]`.
     *
     * When `flatten_deep_query_parameters` is `true`, Scramble will document the parameter like so:
     * `{"name":"foo[bar]", "schema":{"type":"int"}, "required":true}`.
     *
     * When `flatten_deep_query_parameters` is `false`, Scramble will document the parameter like so:
     *  `{"name":"foo", "schema": {"type":"object", "properties":{"bar":{"type": "int"}}, "required": ["bar"]}, "required":true}`.
     */
    // Esta línea sirve para aplanar los parámetros de query anidados.
    'flatten_deep_query_parameters' => true,

    /*
     * RestrictedDocsAccess: libre en APP_ENV=local; en cualquier otro entorno
     * exige el gate `viewApiDocs` (sin definir => 403 para todos).
     */
    // Esta línea sirve para definir los middleware de la documentación.
    'middleware' => [
        // Esta línea sirve para usar el grupo de middleware web.
        'web',
        // Esta línea sirve para restringir el acceso fuera del entorno local.
        RestrictedDocsAccess::class,
    ],

    // Esta línea sirve para registrar las extensiones de Scramble.
    'extensions' => [
        // Esta línea sirve para registrar la extensión que documenta el body de los DELETE.
        DeleteRequestBodyExtension::class,
    ],

    /*
     * Toda ruta con `auth:sanctum` queda documentada con seguridad Bearer (el
     * candado y el botón Authorize de Swagger UI); las que no lo tienen
     * (login, registro, ping, documentos legales...) quedan como públicas.
     */
    // Esta línea sirve para marcar como protegidas con Bearer las rutas con auth:sanctum.
    'security_strategy' => MiddlewareAuthSecurityStrategy::class,
];
