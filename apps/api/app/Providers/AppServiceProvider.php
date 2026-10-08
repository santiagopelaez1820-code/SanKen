<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los service providers.

namespace App\Providers;

// Esta línea sirve para importar el servicio que arma los enlaces de WhatsApp de los pedidos.
use App\Domain\Order\Services\OrderWhatsAppMessageBuilder;
// Esta línea sirve para importar el contrato del generador de rutinas.
use App\Domain\Routine\Contracts\RoutineGeneratorInterface;
// Esta línea sirve para importar el generador de rutinas basado en plantillas.
use App\Domain\Routine\TemplateRoutineGenerator;
// Esta línea sirve para importar el evento de onboarding completado.
use App\Events\OnboardingCompleted;
// Esta línea sirve para importar el evento de récord personal superado.
use App\Events\PRBroken;
// Esta línea sirve para importar el evento de racha alcanzada.
use App\Events\StreakMilestone;
// Esta línea sirve para importar el evento de entrenamiento completado.
use App\Events\WorkoutCompleted;
// Esta línea sirve para importar el transformador que limpia las descripciones de Swagger.
use App\Http\ApiDocs\StripLineCommentsFromDescriptions;
// Esta línea sirve para importar el cliente de Cloudinary.
use App\Infrastructure\Media\CloudinaryClient;
// Esta línea sirve para importar el almacenamiento de archivos en Cloudinary.
use App\Infrastructure\Media\CloudinaryMediaStorage;
// Esta línea sirve para importar el almacenamiento de archivos en disco local.
use App\Infrastructure\Media\LocalPublicMediaStorage;
// Esta línea sirve para importar la interfaz de almacenamiento de archivos.
use App\Infrastructure\Media\MediaStorage;
// Esta línea sirve para importar el listener que otorga XP por récord.
use App\Listeners\AwardXpForPrBroken;
// Esta línea sirve para importar el listener que otorga XP por entrenamiento.
use App\Listeners\AwardXpForWorkoutCompleted;
// Esta línea sirve para importar el listener que evalúa logros de racha.
use App\Listeners\EvaluateStreakAchievement;
// Esta línea sirve para importar el listener que genera la rutina al terminar el onboarding.
use App\Listeners\GenerateRoutineOnOnboardingCompleted;
// Esta línea sirve para importar el listener que actualiza los retos al entrenar.
use App\Listeners\UpdateChallengeProgressOnWorkoutCompleted;
// Esta línea sirve para importar el modelo ChatMessage (mensaje de chat).
use App\Models\ChatMessage;
// Esta línea sirve para importar Scramble para configurar la documentación de la API.
use Dedoc\Scramble\Scramble;
// Esta línea sirve para importar el evento de usuario registrado.
use Illuminate\Auth\Events\Registered;
// Esta línea sirve para importar el listener que envía el correo de verificación.
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
// Esta línea sirve para importar la notificación de verificación de correo.
use Illuminate\Auth\Notifications\VerifyEmail;
// Esta línea sirve para importar la clase Limit para definir límites de peticiones.
use Illuminate\Cache\RateLimiting\Limit;
// Esta línea sirve para importar la clase Relation para registrar alias polimórficos.
use Illuminate\Database\Eloquent\Relations\Relation;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la fachada Broadcast para la autenticación de canales.
use Illuminate\Support\Facades\Broadcast;
// Esta línea sirve para importar la fachada Event para registrar listeners.
use Illuminate\Support\Facades\Event;
// Esta línea sirve para importar la fachada RateLimiter para definir límites de peticiones.
use Illuminate\Support\Facades\RateLimiter;
// Esta línea sirve para importar la fachada URL para crear enlaces firmados.
use Illuminate\Support\Facades\URL;
// Esta línea sirve para importar la clase base de los service providers.
use Illuminate\Support\ServiceProvider;

// Esta línea sirve para declarar el service provider principal de la aplicación.
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    // Esta línea sirve para declarar el método que registra servicios en el contenedor.
    public function register(): void
    {
        // TemplateRoutineGenerator (plantillas curadas por sexo+frecuencia) es
        // el motor activo. El algoritmico original (RoutineGenerator, en
        // Domain/Routine/RoutineGenerator.php) queda intacto y con tests
        // propios pasando, pero ya no esta bindeado a la interfaz.
        // Esta línea sirve para usar el generador por plantillas cuando se pida el contrato de generador de rutinas.
        $this->app->bind(RoutineGeneratorInterface::class, TemplateRoutineGenerator::class);

        // Sin estado propio (solo arma strings a partir del Order que recibe
        // cada llamada) — singleton para no reinstanciarlo por cada fila de
        // OrderResource/AdminOrderResource al listar pedidos.
        // Esta línea sirve para registrar el armador de enlaces de WhatsApp como instancia única.
        $this->app->singleton(OrderWhatsAppMessageBuilder::class);

        // Archivos subidos (avatar, producto, videos): Cloudinary cuando
        // MEDIA_STORAGE=cloudinary y hay credenciales; si no, el disco
        // 'public' local de siempre (dev/tests). Ver docs/CLOUDINARY.md.
        // Esta línea sirve para registrar el cliente de Cloudinary como instancia única.
        $this->app->singleton(CloudinaryClient::class, fn () => new CloudinaryClient(
            // Esta línea sirve para pasar el nombre de la cuenta.
            (string) config('services.cloudinary.cloud_name'),
            // Esta línea sirve para pasar la API key.
            (string) config('services.cloudinary.api_key'),
            // Esta línea sirve para pasar el API secret.
            (string) config('services.cloudinary.api_secret'),
        ));
        // Esta línea sirve para elegir el almacenamiento de archivos cada vez que se pida.
        $this->app->bind(MediaStorage::class, function ($app) {
            // Esta línea sirve para revisar si Cloudinary no está habilitado.
            if (! self::cloudinaryEnabled()) {
                // Esta línea sirve para usar el disco local.
                return $app->make(LocalPublicMediaStorage::class);
            }

            // Esta línea sirve para usar Cloudinary.
            return new CloudinaryMediaStorage(
                // Esta línea sirve para pasar el cliente de Cloudinary.
                $app->make(CloudinaryClient::class),
                // Esta línea sirve para pasar el almacenamiento local para archivos viejos.
                $app->make(LocalPublicMediaStorage::class),
                // Esta línea sirve para pasar la carpeta raíz en Cloudinary.
                (string) config('services.cloudinary.folder'),
            );
        });
    }

    // Esta línea sirve para declarar el método que indica si Cloudinary está habilitado.
    public static function cloudinaryEnabled(): bool
    {
        // Esta línea sirve para revisar que el almacenamiento configurado sea Cloudinary.
        return config('services.cloudinary.storage') === 'cloudinary'
            // Esta línea sirve para exigir el nombre de la cuenta.
            && filled(config('services.cloudinary.cloud_name'))
            // Esta línea sirve para exigir la API key.
            && filled(config('services.cloudinary.api_key'))
            // Esta línea sirve para exigir el API secret.
            && filled(config('services.cloudinary.api_secret'));
    }

    /**
     * Bootstrap any application services.
     */
    // Esta línea sirve para declarar el método que configura la aplicación al iniciar.
    public function boot(): void
    {
        // Esta línea sirve para enviar el correo de verificación al registrarse.
        Event::listen(Registered::class, SendEmailVerificationNotification::class);
        // Esta línea sirve para generar la rutina al completar el onboarding.
        Event::listen(OnboardingCompleted::class, GenerateRoutineOnOnboardingCompleted::class);
        // Esta línea sirve para otorgar XP al completar un entrenamiento.
        Event::listen(WorkoutCompleted::class, AwardXpForWorkoutCompleted::class);
        // Registrado después de AwardXpForWorkoutCompleted a propósito: ese
        // listener sigue siendo el único cuyo valor de retorno lee
        // CompleteWorkoutSessionAction (índice [0] del array que devuelve
        // Event::dispatch()); este no devuelve nada, así que el orden no
        // cambia el contrato de la respuesta HTTP.
        // Esta línea sirve para actualizar los retos al completar un entrenamiento.
        Event::listen(WorkoutCompleted::class, UpdateChallengeProgressOnWorkoutCompleted::class);
        // Esta línea sirve para otorgar XP al superar un récord.
        Event::listen(PRBroken::class, AwardXpForPrBroken::class);
        // Esta línea sirve para evaluar logros al alcanzar una racha.
        Event::listen(StreakMilestone::class, EvaluateStreakAchievement::class);

        // API-only, autenticada por Bearer token (Sanctum guard "sanctum")
        // en vez de cookie de sesión: el endpoint de auth de canales
        // privados (POST /broadcasting/auth, primer uso en la app —
        // Sprint 10, retos) tiene que exigir el mismo guard que el resto
        // de la API, no el "web" por defecto de Broadcast::routes().
        // Esta línea sirve para registrar la ruta de autenticación de canales privados con Sanctum.
        Broadcast::routes(['middleware' => ['auth:sanctum']]);

        // Primer uso propio de relación polimórfica en la app
        // (reports.reportable) — pero NO es la primera polimórfica del
        // proyecto: activity_log (Spatie: causer/subject) y las
        // notifications de Laravel (notifiable) ya usan morphs con el
        // FQCN crudo. enforceMorphMap() es GLOBAL y estricto — exige que
        // TODO morph de la app esté en el mapa o tira
        // ClassMorphViolationException, lo que rompía esas dos relaciones
        // preexistentes (confirmado: 217 tests caían con "No morph map
        // defined for model [App\Models\User]"). morphMap() (no
        // "enforce") solo registra el alias corto para 'chat_message' sin
        // tocar el resto — la validación de "qué tipos se aceptan" queda
        // en el allow-list de StoreReportRequest (Rule::in), no acá.
        // Esta línea sirve para registrar los alias de las relaciones polimórficas.
        Relation::morphMap([
            // Esta línea sirve para usar "chat_message" como alias del modelo ChatMessage.
            'chat_message' => ChatMessage::class,
        ]);

        // Piso global para todo el grupo `api` (ver bootstrap/app.php: throttleApi()).
        // Se apila con los throttle específicos ya existentes en rutas de auth.
        // Esta línea sirve para limitar la API a 120 peticiones por minuto por usuario (o por IP).
        RateLimiter::for('api', fn (Request $request) => Limit::perMinute(120)->by($request->user()?->id ?: $request->ip()));

        // Límite más estricto para endpoints de escritura sin throttle propio.
        // Esta línea sirve para limitar las escrituras a 30 peticiones por minuto por usuario (o por IP).
        RateLimiter::for('writes', fn (Request $request) => Limit::perMinute(30)->by($request->user()?->id ?: $request->ip()));

        // API-only app: el enlace del correo apunta a un endpoint firmado de la propia API
        // en lugar de a una ruta web (que no existe en esta aplicación).
        // Esta línea sirve para personalizar el enlace del correo de verificación.
        VerifyEmail::createUrlUsing(function ($notifiable) {
            // Esta línea sirve para devolver un enlace firmado y temporal.
            return URL::temporarySignedRoute(
                // Esta línea sirve para apuntar a la ruta de verificación de la API.
                'api.v1.auth.email.verify',
                // Esta línea sirve para hacer que venza en 60 minutos.
                now()->addMinutes(60),
                [
                    // Esta línea sirve para incluir el id del usuario.
                    'id' => $notifiable->getKey(),
                    // Esta línea sirve para incluir el hash del correo.
                    'hash' => sha1($notifiable->getEmailForVerification()),
                ],
            );
        });

        // Swagger (/docs/api) no debe mostrar los comentarios línea por línea
        // del código como descripción de los campos — ver la clase.
        // Esta línea sirve para limpiar de Swagger los comentarios línea por línea.
        Scramble::configure()->withDocumentTransformers(StripLineCommentsFromDescriptions::class);
    }
}
