<?php

// Esta línea sirve para importar el controller de analítica del admin.
use App\Http\Controllers\Api\V1\Admin\AdminAnalyticsController;
// Esta línea sirve para importar el controller de la auditoría del admin.
use App\Http\Controllers\Api\V1\Admin\AdminAuditLogController;
// Esta línea sirve para importar el controller de plantillas de retos del admin.
use App\Http\Controllers\Api\V1\Admin\AdminChallengeTemplateController;
// Esta línea sirve para importar el controller de ejercicios del admin.
use App\Http\Controllers\Api\V1\Admin\AdminExerciseController;
// Esta línea sirve para importar el controller de noticias del admin.
use App\Http\Controllers\Api\V1\Admin\AdminNewsController;
// Esta línea sirve para importar el controller de pedidos del admin.
use App\Http\Controllers\Api\V1\Admin\AdminOrderController;
// Esta línea sirve para importar el controller de postulaciones de PR del admin.
use App\Http\Controllers\Api\V1\Admin\AdminProductController;
// Esta línea sirve para importar el controller de productos del admin.
use App\Http\Controllers\Api\V1\Admin\AdminPrSubmissionController;
// Esta línea sirve para importar el controller de reportes del admin.
use App\Http\Controllers\Api\V1\Admin\AdminReportController;
// Esta línea sirve para importar el controller de plantillas de rutina del admin.
use App\Http\Controllers\Api\V1\Admin\AdminRoutineTemplateController;
// Esta línea sirve para importar el controller de estadísticas del admin.
use App\Http\Controllers\Api\V1\Admin\AdminStatsController;
// Esta línea sirve para importar el controller de soporte del admin.
use App\Http\Controllers\Api\V1\Admin\AdminSupportController;
// Esta línea sirve para importar el controller de consentimientos de usuarios del admin.
use App\Http\Controllers\Api\V1\Admin\AdminUserConsentController;
// Esta línea sirve para importar el controller de usuarios del admin.
use App\Http\Controllers\Api\V1\Admin\AdminUserController;
// Esta línea sirve para importar el controller de rutinas personalizadas del admin.
use App\Http\Controllers\Api\V1\Admin\AdminUserRoutineController;
// Esta línea sirve para importar el controller de autenticación.
use App\Http\Controllers\Api\V1\Auth\AuthController;
// Esta línea sirve para importar el controller de verificación de correo.
use App\Http\Controllers\Api\V1\Auth\EmailVerificationController;
// Esta línea sirve para importar el controller de verificación en dos pasos.
use App\Http\Controllers\Api\V1\Auth\TwoFactorController;
// Esta línea sirve para importar el controller de medidas corporales.
use App\Http\Controllers\Api\V1\BodyMeasurementController;
// Esta línea sirve para importar el controller del calendario.
use App\Http\Controllers\Api\V1\CalendarController;
// Esta línea sirve para importar el controller de retos.
use App\Http\Controllers\Api\V1\ChallengeController;
// Esta línea sirve para importar el controller del chat.
use App\Http\Controllers\Api\V1\ChatController;
// Esta línea sirve para importar el controller del catálogo de ejercicios.
use App\Http\Controllers\Api\V1\ExerciseController;
// Esta línea sirve para importar el controller de rankings por ejercicio.
use App\Http\Controllers\Api\V1\ExerciseRankingController;
// Esta línea sirve para importar el controller del feed de novedades.
use App\Http\Controllers\Api\V1\FeedController;
// Esta línea sirve para importar el controller de gamificación.
use App\Http\Controllers\Api\V1\GamificationController;
// Esta línea sirve para importar el controller legal.
use App\Http\Controllers\Api\V1\Legal\LegalController;
// Esta línea sirve para importar el controller de mis entrenadores.
use App\Http\Controllers\Api\V1\MyTrainerController;
// Esta línea sirve para importar el controller de nutrición.
use App\Http\Controllers\Api\V1\NutritionController;
// Esta línea sirve para importar el controller del plan alimenticio.
use App\Http\Controllers\Api\V1\NutritionPlanController;
// Esta línea sirve para importar el controller del onboarding.
use App\Http\Controllers\Api\V1\OnboardingController;
// Esta línea sirve para importar el controller de pedidos.
use App\Http\Controllers\Api\V1\OrderController;
// Esta línea sirve para importar el controller del ping.
use App\Http\Controllers\Api\V1\PingController;
// Esta línea sirve para importar el controller de postulaciones de PR.
use App\Http\Controllers\Api\V1\ProductController;
// Esta línea sirve para importar el controller de productos.
use App\Http\Controllers\Api\V1\PrSubmissionController;
// Esta línea sirve para importar el controller de notificaciones push.
use App\Http\Controllers\Api\V1\PushController;
// Esta línea sirve para importar el controller de rankings.
use App\Http\Controllers\Api\V1\RankingController;
// Esta línea sirve para importar el controller de reportes.
use App\Http\Controllers\Api\V1\ReportController;
// Esta línea sirve para importar el controller de rutinas.
use App\Http\Controllers\Api\V1\RoutineController;
// Esta línea sirve para importar el controller de estadísticas.
use App\Http\Controllers\Api\V1\StatsController;
// Esta línea sirve para importar el controller de solicitudes de soporte.
use App\Http\Controllers\Api\V1\Support\SupportTicketController;
// Esta línea sirve para importar el controller del check-in semanal.
use App\Http\Controllers\Api\V1\Support\WeeklyCheckinController;
// Esta línea sirve para importar el controller de clientes del entrenador.
use App\Http\Controllers\Api\V1\Trainer\TrainerClientController;
// Esta línea sirve para importar el controller de rutinas del entrenador.
use App\Http\Controllers\Api\V1\Trainer\TrainerRoutineController;
// Esta línea sirve para importar el controller de sesiones de entrenamiento.
use App\Http\Controllers\Api\V1\WorkoutSessionController;
// Esta línea sirve para importar el controller de series.
use App\Http\Controllers\Api\V1\WorkoutSetController;
// Esta línea sirve para importar la fachada Route para definir rutas.
use Illuminate\Support\Facades\Route;

// Esta línea sirve para agrupar todas las rutas bajo /v1 con nombres que empiezan por "api.v1.".
Route::prefix('v1')->name('api.v1.')->group(function () {
    // Esta línea sirve para definir GET /ping para comprobar el estado de la API.
    Route::get('/ping', PingController::class)->name('ping');

    // Documentos legales y consentimientos — ver config/legal.php.
    // Esta línea sirve para agrupar las rutas legales bajo /legal.
    Route::prefix('legal')->name('legal.')->group(function () {
        // Esta línea sirve para definir GET /legal/documents (público) con los documentos vigentes.
        Route::get('/documents', [LegalController::class, 'documents'])->name('documents');

        // Esta línea sirve para exigir sesión iniciada para las rutas siguientes.
        Route::middleware('auth:sanctum')->group(function () {
            // Esta línea sirve para definir GET /legal/consents con el estado legal del usuario.
            Route::get('/consents', [LegalController::class, 'consents'])->name('consents.index');
            // Esta línea sirve para definir POST /legal/consents para aceptar documentos (con límite de escrituras).
            Route::post('/consents', [LegalController::class, 'accept'])->middleware('throttle:writes')->name('consents.store');
        });
    });

    // Esta línea sirve para agrupar las rutas de autenticación bajo /auth.
    Route::prefix('auth')->name('auth.')->group(function () {
        // Esta línea sirve para definir POST /auth/register para registrarse.
        Route::post('/register', [AuthController::class, 'register'])
            // Esta línea sirve para limitar a 5 intentos por minuto.
            ->middleware('throttle:5,1')
            // Esta línea sirve para nombrar la ruta "register".
            ->name('register');

        // Esta línea sirve para definir POST /auth/login para iniciar sesión.
        Route::post('/login', [AuthController::class, 'login'])
            // Esta línea sirve para limitar a 5 intentos por minuto.
            ->middleware('throttle:5,1')
            // Esta línea sirve para nombrar la ruta "login".
            ->name('login');

        // Esta línea sirve para definir POST /auth/social para iniciar sesión con Google.
        Route::post('/social', [AuthController::class, 'socialLogin'])
            // Esta línea sirve para limitar a 5 intentos por minuto.
            ->middleware('throttle:5,1')
            // Esta línea sirve para nombrar la ruta "social".
            ->name('social');

        // Esta línea sirve para definir POST /auth/forgot-password para pedir el correo de recuperación.
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])
            // Esta línea sirve para limitar a 5 intentos por minuto.
            ->middleware('throttle:5,1')
            // Esta línea sirve para nombrar la ruta "forgot-password".
            ->name('forgot-password');

        // Esta línea sirve para definir POST /auth/reset-password para cambiar la contraseña con el token.
        Route::post('/reset-password', [AuthController::class, 'resetPassword'])
            // Esta línea sirve para limitar a 5 intentos por minuto.
            ->middleware('throttle:5,1')
            // Esta línea sirve para nombrar la ruta "reset-password".
            ->name('reset-password');

        // Esta línea sirve para definir GET /auth/email/verify/{id}/{hash} para verificar el correo.
        Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
            // Esta línea sirve para exigir que el enlace esté firmado.
            ->middleware('signed')
            // Esta línea sirve para nombrar la ruta "email.verify".
            ->name('email.verify');

        // Esta línea sirve para definir POST /auth/2fa/challenge para el segundo paso del login.
        Route::post('/2fa/challenge', [TwoFactorController::class, 'challenge'])
            // Esta línea sirve para limitar a 10 intentos por minuto.
            ->middleware('throttle:10,1')
            // Esta línea sirve para nombrar la ruta "2fa.challenge".
            ->name('2fa.challenge');

        // Esta línea sirve para exigir sesión iniciada para las rutas siguientes.
        Route::middleware('auth:sanctum')->group(function () {
            // Esta línea sirve para definir POST /auth/logout para cerrar sesión.
            Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
            // Esta línea sirve para definir GET /auth/me con los datos del usuario.
            Route::get('/me', [AuthController::class, 'me'])->name('me');
            // Esta línea sirve para definir DELETE /auth/me para eliminar la cuenta.
            Route::delete('/me', [AuthController::class, 'destroyMe'])
                // Esta línea sirve para limitar a 5 intentos por minuto.
                ->middleware('throttle:5,1')
                // Esta línea sirve para nombrar la ruta "me.destroy".
                ->name('me.destroy');
            // Esta línea sirve para definir POST /auth/me/avatar para subir la foto de perfil.
            Route::post('/me/avatar', [AuthController::class, 'updateAvatar'])
                // Esta línea sirve para aplicar el límite de escrituras.
                ->middleware('throttle:writes')
                // Esta línea sirve para nombrar la ruta "me.avatar.store".
                ->name('me.avatar.store');
            // Esta línea sirve para definir DELETE /auth/me/avatar para borrar la foto de perfil.
            Route::delete('/me/avatar', [AuthController::class, 'deleteAvatar'])
                // Esta línea sirve para aplicar el límite de escrituras.
                ->middleware('throttle:writes')
                // Esta línea sirve para nombrar la ruta "me.avatar.destroy".
                ->name('me.avatar.destroy');
            // Esta línea sirve para definir POST /auth/email/resend para reenviar el correo de verificación.
            Route::post('/email/resend', [EmailVerificationController::class, 'resend'])
                // Esta línea sirve para limitar a 3 intentos cada 5 minutos.
                ->middleware('throttle:3,5')
                // Esta línea sirve para nombrar la ruta "email.resend".
                ->name('email.resend');

            // Esta línea sirve para definir POST /auth/2fa/enable para empezar a activar la verificación en dos pasos.
            Route::post('/2fa/enable', [TwoFactorController::class, 'enable'])->name('2fa.enable');
            // Esta línea sirve para definir POST /auth/2fa/confirm para confirmar la activación.
            Route::post('/2fa/confirm', [TwoFactorController::class, 'confirm'])
                // Esta línea sirve para aplicar el límite de escrituras.
                ->middleware('throttle:writes')
                // Esta línea sirve para nombrar la ruta "2fa.confirm".
                ->name('2fa.confirm');
            // Esta línea sirve para definir POST /auth/2fa/disable para desactivarla.
            Route::post('/2fa/disable', [TwoFactorController::class, 'disable'])
                // Esta línea sirve para aplicar el límite de escrituras.
                ->middleware('throttle:writes')
                // Esta línea sirve para nombrar la ruta "2fa.disable".
                ->name('2fa.disable');
        });
    });

    // Esta línea sirve para agrupar las rutas del onboarding bajo /onboarding (con sesión iniciada).
    Route::middleware('auth:sanctum')->prefix('onboarding')->name('onboarding.')->group(function () {
        // Esta línea sirve para definir GET /onboarding/questions con las opciones del cuestionario.
        Route::get('/questions', [OnboardingController::class, 'questions'])->name('questions');
        // Esta línea sirve para definir GET /onboarding/countries/{country}/cities con las ciudades de un país.
        Route::get('/countries/{country}/cities', [OnboardingController::class, 'cities'])->name('cities');
        // Esta línea sirve para definir GET /onboarding/countries/{country}/states con los estados de un país.
        Route::get('/countries/{country}/states', [OnboardingController::class, 'states'])->name('states');
        // Esta línea sirve para definir GET /onboarding/states/{state}/cities con las ciudades de un estado.
        Route::get('/states/{state}/cities', [OnboardingController::class, 'citiesByState'])->name('cities-by-state');
        // Esta línea sirve para definir GET /onboarding con las respuestas del usuario.
        Route::get('/', [OnboardingController::class, 'show'])->name('show');
        // Esta línea sirve para definir POST /onboarding para guardar las respuestas.
        Route::post('/', [OnboardingController::class, 'store'])->name('store');
        // Esta línea sirve para definir PATCH /onboarding para actualizar las respuestas.
        Route::patch('/', [OnboardingController::class, 'update'])->name('update');
        // Esta línea sirve para definir POST /onboarding/complete para completar el onboarding.
        Route::post('/complete', [OnboardingController::class, 'complete'])->name('complete');
    });

    // Esta línea sirve para definir GET /exercises con el catálogo de ejercicios.
    Route::middleware('auth:sanctum')->get('/exercises', [ExerciseController::class, 'index'])->name('exercises.index');
    // Esta línea sirve para definir GET /exercises/{exercise}/rankings con el ranking de un ejercicio.
    Route::middleware('auth:sanctum')->get('/exercises/{exercise}/rankings', [ExerciseRankingController::class, 'index'])->name('exercises.rankings');

    // Esta línea sirve para agrupar las rutas de productos bajo /products (con sesión iniciada).
    Route::middleware('auth:sanctum')->prefix('products')->name('products.')->group(function () {
        // Esta línea sirve para definir GET /products con el catálogo.
        Route::get('/', [ProductController::class, 'index'])->name('index');
        // Esta línea sirve para definir GET /products/{product} con un producto.
        Route::get('/{product}', [ProductController::class, 'show'])->name('show');
    });

    // Esta línea sirve para agrupar las rutas de pedidos bajo /orders (con sesión iniciada).
    Route::middleware('auth:sanctum')->prefix('orders')->name('orders.')->group(function () {
        // Esta línea sirve para definir GET /orders con los pedidos del usuario.
        Route::get('/', [OrderController::class, 'index'])->name('index');
        // Esta línea sirve para definir GET /orders/{order} con un pedido.
        Route::get('/{order}', [OrderController::class, 'show'])->name('show');
        // Esta línea sirve para definir POST /orders para crear un pedido (con límite de escrituras).
        Route::post('/', [OrderController::class, 'store'])->middleware('throttle:writes')->name('store');
    });

    // Esta línea sirve para agrupar las rutas de rutinas bajo /routines (con sesión iniciada).
    Route::middleware('auth:sanctum')->prefix('routines')->name('routines.')->group(function () {
        // Esta línea sirve para definir GET /routines/active con la rutina activa.
        Route::get('/active', [RoutineController::class, 'active'])->name('active');
        // Esta línea sirve para definir POST /routines/generate para regenerar la rutina.
        Route::post('/generate', [RoutineController::class, 'generate'])
            // Esta línea sirve para limitar a 10 intentos por minuto.
            ->middleware('throttle:10,1')
            // Esta línea sirve para nombrar la ruta "generate".
            ->name('generate');
        // Esta línea sirve para definir GET /routines/{routine} con una rutina.
        Route::get('/{routine}', [RoutineController::class, 'show'])->name('show');
        // Esta línea sirve para definir POST /routines/{routine}/exercises/{routineExercise}/swap para cambiar un ejercicio por su alternativa.
        Route::post('/{routine}/exercises/{routineExercise}/swap', [RoutineController::class, 'swapExercise'])
            // Esta línea sirve para aplicar el límite de escrituras.
            ->middleware('throttle:writes')
            // Esta línea sirve para nombrar la ruta "exercises.swap".
            ->name('exercises.swap');
    });

    // Esta línea sirve para agrupar las rutas de entrenamientos bajo /workout-sessions (con sesión iniciada).
    Route::middleware('auth:sanctum')->prefix('workout-sessions')->name('workout-sessions.')->group(function () {
        // Esta línea sirve para definir GET /workout-sessions con el historial.
        Route::get('/', [WorkoutSessionController::class, 'index'])->name('index');
        // Esta línea sirve para definir POST /workout-sessions para iniciar un entrenamiento.
        Route::post('/', [WorkoutSessionController::class, 'store'])->middleware('throttle:writes')->name('store');
        // Esta línea sirve para definir POST /workout-sessions/skip para saltar el entrenamiento de hoy.
        Route::post('/skip', [WorkoutSessionController::class, 'skip'])->middleware('throttle:writes')->name('skip');
        // Esta línea sirve para definir GET /workout-sessions/{workoutSession} con un entrenamiento.
        Route::get('/{workoutSession}', [WorkoutSessionController::class, 'show'])->name('show');
        // Esta línea sirve para definir PATCH /workout-sessions/{workoutSession} para editar duración o notas.
        Route::patch('/{workoutSession}', [WorkoutSessionController::class, 'update'])->middleware('throttle:writes')->name('update');
        // Esta línea sirve para definir POST .../complete para terminar el entrenamiento.
        Route::post('/{workoutSession}/complete', [WorkoutSessionController::class, 'complete'])->middleware('throttle:writes')->name('complete');
        // Esta línea sirve para definir POST .../cancel para salir sin terminarlo.
        Route::post('/{workoutSession}/cancel', [WorkoutSessionController::class, 'cancel'])->middleware('throttle:writes')->name('cancel');
        // Esta línea sirve para definir POST .../feedback para responder si se hizo como estaba planeado.
        Route::post('/{workoutSession}/feedback', [WorkoutSessionController::class, 'feedback'])->middleware('throttle:writes')->name('feedback');
        // Esta línea sirve para definir POST .../exercises para agregar un ejercicio.
        Route::post('/{workoutSession}/exercises', [WorkoutSessionController::class, 'addExercise'])->middleware('throttle:writes')->name('exercises.store');
        // Esta línea sirve para definir PATCH .../exercises/{workoutExercise} para marcar las series completadas.
        Route::patch('/{workoutSession}/exercises/{workoutExercise}', [WorkoutSessionController::class, 'updateExercise'])->middleware('throttle:writes')->name('exercises.update');
        // Esta línea sirve para definir POST .../exercises/{workoutExercise}/swap para cambiar un ejercicio por su alternativa.
        Route::post('/{workoutSession}/exercises/{workoutExercise}/swap', [WorkoutSessionController::class, 'swapExercise'])->middleware('throttle:writes')->name('exercises.swap');
        // Esta línea sirve para definir POST .../exercises/{workoutExercise}/sets para registrar una serie.
        Route::post('/{workoutSession}/exercises/{workoutExercise}/sets', [WorkoutSessionController::class, 'logSet'])->middleware('throttle:writes')->name('exercises.sets.store');
    });

    // Esta línea sirve para agrupar las rutas de series bajo /workout-sets (con sesión iniciada).
    Route::middleware('auth:sanctum')->prefix('workout-sets')->name('workout-sets.')->group(function () {
        // Esta línea sirve para definir PATCH /workout-sets/{workoutSet} para corregir una serie.
        Route::patch('/{workoutSet}', [WorkoutSetController::class, 'update'])->middleware('throttle:writes')->name('update');
    });

    // Esta línea sirve para agrupar las rutas de medidas bajo /body-measurements (con sesión iniciada).
    Route::middleware('auth:sanctum')->prefix('body-measurements')->name('body-measurements.')->group(function () {
        // Esta línea sirve para definir GET /body-measurements con las medidas del usuario.
        Route::get('/', [BodyMeasurementController::class, 'index'])->name('index');
        // Esta línea sirve para definir POST /body-measurements para registrar una medida.
        Route::post('/', [BodyMeasurementController::class, 'store'])->middleware('throttle:writes')->name('store');
    });

    // Esta línea sirve para agrupar las rutas de estadísticas bajo /stats (con sesión iniciada).
    Route::middleware('auth:sanctum')->prefix('stats')->name('stats.')->group(function () {
        // Esta línea sirve para definir GET /stats/dashboard con el resumen.
        Route::get('/dashboard', [StatsController::class, 'dashboard'])->name('dashboard');
        // Esta línea sirve para definir GET /stats/volume con el volumen por grupo muscular.
        Route::get('/volume', [StatsController::class, 'volume'])->name('volume');
        // Esta línea sirve para definir GET /stats/personal-records con los récords personales.
        Route::get('/personal-records', [StatsController::class, 'personalRecords'])->name('personal-records');
        // Esta línea sirve para definir POST /stats/personal-records para registrar un récord manual.
        Route::post('/personal-records', [StatsController::class, 'storePersonalRecord'])->middleware('throttle:writes')->name('personal-records.store');
        // Esta línea sirve para definir GET /stats/progress con la evolución de una métrica.
        Route::get('/progress', [StatsController::class, 'progress'])->name('progress');
    });

    // Esta línea sirve para agrupar las rutas de gamificación bajo /gamification (con sesión iniciada).
    Route::middleware('auth:sanctum')->prefix('gamification')->name('gamification.')->group(function () {
        // Esta línea sirve para definir GET /gamification con nivel, XP y logros.
        Route::get('/', [GamificationController::class, 'index'])->name('index');
    });

    // Esta línea sirve para agrupar las rutas de rankings bajo /rankings (con sesión iniciada).
    Route::middleware('auth:sanctum')->prefix('rankings')->name('rankings.')->group(function () {
        // Esta línea sirve para definir POST /rankings/opt-in para mostrar el perfil en los rankings.
        Route::post('/opt-in', [RankingController::class, 'optIn'])->middleware('throttle:writes')->name('opt-in');
        // Esta línea sirve para definir POST /rankings/opt-out para ocultarlo.
        Route::post('/opt-out', [RankingController::class, 'optOut'])->middleware('throttle:writes')->name('opt-out');
    });

    // Esta línea sirve para agrupar las rutas de retos bajo /challenges (con sesión iniciada).
    Route::middleware('auth:sanctum')->prefix('challenges')->name('challenges.')->group(function () {
        // Esta línea sirve para definir GET /challenges con los retos vigentes.
        Route::get('/', [ChallengeController::class, 'index'])->name('index');
        // Esta línea sirve para definir POST /challenges/{challenge}/join para unirse a un reto.
        Route::post('/{challenge}/join', [ChallengeController::class, 'join'])->middleware('throttle:writes')->name('join');
        // Esta línea sirve para definir GET /challenges/{challenge}/leaderboard con la tabla de posiciones.
        Route::get('/{challenge}/leaderboard', [ChallengeController::class, 'leaderboard'])->name('leaderboard');
    });

    // Esta línea sirve para agrupar las rutas del calendario bajo /calendar (con sesión iniciada).
    Route::middleware('auth:sanctum')->prefix('calendar')->name('calendar.')->group(function () {
        // Esta línea sirve para definir GET /calendar con los eventos de un mes.
        Route::get('/', [CalendarController::class, 'index'])->name('index');
        // Esta línea sirve para definir POST /calendar/reminders para crear un recordatorio.
        Route::post('/reminders', [CalendarController::class, 'storeReminder'])->middleware('throttle:writes')->name('reminders.store');
        // Esta línea sirve para definir DELETE /calendar/reminders/{reminder} para borrar un recordatorio.
        Route::delete('/reminders/{reminder}', [CalendarController::class, 'destroyReminder'])->middleware('throttle:writes')->name('reminders.destroy');
    });

    // Esta línea sirve para definir GET /me/trainers con los entrenadores del usuario.
    Route::middleware('auth:sanctum')->get('/me/trainers', [MyTrainerController::class, 'index'])->name('me.trainers');

    // Esta línea sirve para agrupar las rutas de relaciones entrenador-cliente bajo /trainer-clients (con sesión iniciada).
    Route::middleware('auth:sanctum')->prefix('trainer-clients')->name('trainer-clients.')->group(function () {
        // Esta línea sirve para definir GET /trainer-clients/{trainerClient}/conversation para abrir el chat.
        Route::get('/{trainerClient}/conversation', [ChatController::class, 'conversation'])->name('conversation');
    });

    // Esta línea sirve para agrupar las rutas de conversaciones bajo /conversations (con sesión iniciada).
    Route::middleware('auth:sanctum')->prefix('conversations')->name('conversations.')->group(function () {
        // Esta línea sirve para definir GET /conversations con las conversaciones del usuario.
        Route::get('/', [ChatController::class, 'index'])->name('index');
        // Esta línea sirve para definir GET /conversations/{conversation}/messages con los mensajes.
        Route::get('/{conversation}/messages', [ChatController::class, 'messages'])->name('messages.index');
        // Esta línea sirve para definir POST /conversations/{conversation}/messages para enviar un mensaje.
        Route::post('/{conversation}/messages', [ChatController::class, 'sendMessage'])->middleware('throttle:writes')->name('messages.store');
    });

    // Esta línea sirve para agrupar las rutas del feed bajo /feed (con sesión iniciada).
    Route::middleware('auth:sanctum')->prefix('feed')->name('feed.')->group(function () {
        // Esta línea sirve para definir GET /feed con las novedades.
        Route::get('/', [FeedController::class, 'index'])->name('index');
        // Esta línea sirve para definir POST /feed/{type}/{id}/read para marcar una novedad como leída.
        Route::post('/{type}/{id}/read', [FeedController::class, 'markRead'])
            // Esta línea sirve para aceptar solo los tipos "news" o "notification".
            ->where('type', 'news|notification')
            // Esta línea sirve para aplicar el límite de escrituras.
            ->middleware('throttle:writes')
            // Esta línea sirve para nombrar la ruta "read".
            ->name('read');
        // Esta línea sirve para definir POST /feed/read-all para marcar todo como leído.
        Route::post('/read-all', [FeedController::class, 'markAllRead'])->middleware('throttle:writes')->name('read-all');
    });

    // Esta línea sirve para agrupar las rutas de notificaciones push bajo /push (con sesión iniciada).
    Route::middleware('auth:sanctum')->prefix('push')->name('push.')->group(function () {
        // Esta línea sirve para definir POST /push/expo-token para registrar un celular.
        Route::post('/expo-token', [PushController::class, 'storeExpoToken'])->middleware('throttle:writes')->name('expo-token.store');
        // Esta línea sirve para definir DELETE /push/expo-token para borrar un celular.
        Route::delete('/expo-token', [PushController::class, 'destroyExpoToken'])->middleware('throttle:writes')->name('expo-token.destroy');
        // Esta línea sirve para definir POST /push/web-subscription para registrar un navegador.
        Route::post('/web-subscription', [PushController::class, 'storeWebSubscription'])->middleware('throttle:writes')->name('web-subscription.store');
        // Esta línea sirve para definir DELETE /push/web-subscription para borrar un navegador.
        Route::delete('/web-subscription', [PushController::class, 'destroyWebSubscription'])->middleware('throttle:writes')->name('web-subscription.destroy');
    });

    // Esta línea sirve para agrupar las rutas de nutrición bajo /nutrition (con sesión iniciada).
    Route::middleware('auth:sanctum')->prefix('nutrition')->name('nutrition.')->group(function () {
        // Esta línea sirve para definir GET /nutrition/targets con los objetivos del día.
        Route::get('/targets', [NutritionController::class, 'targets'])->name('targets');
        // Esta línea sirve para definir GET /nutrition/meals con las comidas de un día.
        Route::get('/meals', [NutritionController::class, 'meals'])->name('meals.index');
        // Esta línea sirve para definir POST /nutrition/meals para registrar una comida.
        Route::post('/meals', [NutritionController::class, 'logMeal'])->middleware('throttle:writes')->name('meals.store');
        // Esta línea sirve para definir DELETE /nutrition/meals/{meal} para borrar una comida.
        Route::delete('/meals/{meal}', [NutritionController::class, 'destroyMeal'])->middleware('throttle:writes')->name('meals.destroy');
        // Esta línea sirve para definir GET /nutrition/foods para buscar alimentos.
        Route::get('/foods', [NutritionController::class, 'searchFoods'])->name('foods.index');
        // Esta línea sirve para definir GET /nutrition/plan con el plan alimenticio.
        Route::get('/plan', [NutritionPlanController::class, 'show'])->name('plan.show');
        // Esta línea sirve para definir POST /nutrition/plan para generar el plan.
        Route::post('/plan', [NutritionPlanController::class, 'store'])->middleware('throttle:writes')->name('plan.store');
        // Esta línea sirve para definir PATCH /nutrition/plan/items/{item} para reemplazar un alimento del plan.
        Route::patch('/plan/items/{item}', [NutritionPlanController::class, 'substituteItem'])->middleware('throttle:writes')->name('plan.items.substitute');
    });

    // Esta línea sirve para agrupar las rutas del entrenador bajo /trainer (solo rol trainer).
    Route::middleware(['auth:sanctum', 'role:trainer'])->prefix('trainer')->name('trainer.')->group(function () {
        // Esta línea sirve para agrupar las rutas de clientes bajo /trainer/clients.
        Route::prefix('clients')->name('clients.')->group(function () {
            // Esta línea sirve para definir GET /trainer/clients con los clientes.
            Route::get('/', [TrainerClientController::class, 'index'])->name('index');
            // Esta línea sirve para definir POST /trainer/clients para agregar un cliente.
            Route::post('/', [TrainerClientController::class, 'store'])->middleware('throttle:writes')->name('store');
            // Esta línea sirve para definir GET /trainer/clients/{trainerClient} con un cliente.
            Route::get('/{trainerClient}', [TrainerClientController::class, 'show'])->name('show');
            // Esta línea sirve para definir PATCH /trainer/clients/{trainerClient} para cambiar el estado de la relación.
            Route::patch('/{trainerClient}', [TrainerClientController::class, 'update'])->middleware('throttle:writes')->name('update');
            // Esta línea sirve para definir POST /trainer/clients/{trainerClient}/routines para crear una rutina manual.
            Route::post('/{trainerClient}/routines', [TrainerRoutineController::class, 'store'])->middleware('throttle:writes')->name('routines.store');
        });

        // Esta línea sirve para agrupar las rutas de rutinas manuales bajo /trainer/routines.
        Route::prefix('routines')->name('routines.')->group(function () {
            // Esta línea sirve para definir GET /trainer/routines/{routine} con una rutina manual.
            Route::get('/{routine}', [TrainerRoutineController::class, 'show'])->name('show');
            // Esta línea sirve para definir PATCH /trainer/routines/{routine} para editarla.
            Route::patch('/{routine}', [TrainerRoutineController::class, 'update'])->middleware('throttle:writes')->name('update');
        });
    });

    // Esta línea sirve para exigir sesión iniciada para la ruta siguiente.
    Route::middleware('auth:sanctum')->group(function () {
        // Esta línea sirve para definir POST /reports para reportar contenido.
        Route::post('/reports', [ReportController::class, 'store'])->middleware('throttle:writes')->name('reports.store');
    });

    // Soporte: solicitudes del propio usuario y check-in semanal — ver
    // docs/09-soporte-y-checkin.md.
    // Esta línea sirve para agrupar las rutas de soporte bajo /support (con sesión iniciada).
    Route::middleware('auth:sanctum')->prefix('support')->name('support.')->group(function () {
        // Esta línea sirve para definir GET /support/tickets con las solicitudes del usuario.
        Route::get('/tickets', [SupportTicketController::class, 'index'])->name('tickets.index');
        // Esta línea sirve para definir POST /support/tickets para crear una solicitud (10 por minuto).
        Route::post('/tickets', [SupportTicketController::class, 'store'])->middleware('throttle:10,1')->name('tickets.store');
        // Esta línea sirve para definir GET /support/tickets/{ticket} con una solicitud.
        Route::get('/tickets/{ticket}', [SupportTicketController::class, 'show'])->name('tickets.show');
        // Esta línea sirve para definir POST /support/tickets/{ticket}/messages para responder.
        Route::post('/tickets/{ticket}/messages', [SupportTicketController::class, 'reply'])->middleware('throttle:writes')->name('tickets.messages.store');
        // Esta línea sirve para definir POST /support/tickets/{ticket}/close para cerrarla.
        Route::post('/tickets/{ticket}/close', [SupportTicketController::class, 'close'])->middleware('throttle:writes')->name('tickets.close');

        // Esta línea sirve para definir GET /support/check-ins/current con el check-in de la semana.
        Route::get('/check-ins/current', [WeeklyCheckinController::class, 'current'])->name('check-ins.current');
        // Esta línea sirve para definir POST /support/check-ins/{checkin}/answer para responderlo.
        Route::post('/check-ins/{checkin}/answer', [WeeklyCheckinController::class, 'answer'])->middleware('throttle:writes')->name('check-ins.answer');
        // Esta línea sirve para definir POST /support/check-ins/{checkin}/postpone para posponerlo.
        Route::post('/check-ins/{checkin}/postpone', [WeeklyCheckinController::class, 'postpone'])->middleware('throttle:writes')->name('check-ins.postpone');
    });

    // Esta línea sirve para agrupar las rutas de postulaciones de PR bajo /pr-submissions (con sesión iniciada).
    Route::middleware('auth:sanctum')->prefix('pr-submissions')->name('pr-submissions.')->group(function () {
        // Esta línea sirve para definir GET /pr-submissions con las postulaciones del usuario.
        Route::get('/', [PrSubmissionController::class, 'index'])->name('index');
        // Esta línea sirve para definir POST /pr-submissions para postular un PR.
        Route::post('/', [PrSubmissionController::class, 'store'])->middleware('throttle:writes')->name('store');
        // Esta línea sirve para definir POST /pr-submissions/{prSubmission}/video para subir el video.
        Route::post('/{prSubmission}/video', [PrSubmissionController::class, 'uploadVideo'])->middleware('throttle:writes')->name('video.store');
    });

    // Esta línea sirve para agrupar las rutas del panel bajo /admin (solo rol super_admin).
    Route::middleware(['auth:sanctum', 'role:super_admin'])->prefix('admin')->name('admin.')->group(function () {
        // Esta línea sirve para definir GET /admin/users con los usuarios.
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        // Esta línea sirve para definir GET /admin/users/{user} con un usuario.
        Route::get('/users/{user}', [AdminUserController::class, 'show'])->name('users.show');
        // Esta línea sirve para definir PATCH /admin/users/{user} para editar sus datos.
        Route::patch('/users/{user}', [AdminUserController::class, 'update'])->middleware('throttle:writes')->name('users.update');
        // Esta línea sirve para definir PATCH /admin/users/{user}/ban para banear o desbanear.
        Route::patch('/users/{user}/ban', [AdminUserController::class, 'ban'])->middleware('throttle:writes')->name('users.ban');
        // Esta línea sirve para definir PATCH /admin/users/{user}/verify-trainer para verificar a un entrenador.
        Route::patch('/users/{user}/verify-trainer', [AdminUserController::class, 'verifyTrainer'])->middleware('throttle:writes')->name('users.verify-trainer');
        // Esta línea sirve para definir PATCH /admin/users/{user}/role para cambiar el rol.
        Route::patch('/users/{user}/role', [AdminUserController::class, 'changeRole'])->middleware('throttle:writes')->name('users.role');
        // Esta línea sirve para definir PATCH /admin/users/{user}/activate para activar la cuenta.
        Route::patch('/users/{user}/activate', [AdminUserController::class, 'activate'])->middleware('throttle:writes')->name('users.activate');
        // Esta línea sirve para definir PATCH /admin/users/{user}/deactivate para desactivar la cuenta.
        Route::patch('/users/{user}/deactivate', [AdminUserController::class, 'deactivate'])->middleware('throttle:writes')->name('users.deactivate');
        // Esta línea sirve para definir DELETE /admin/users/{user} para eliminar la cuenta.
        Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->middleware('throttle:writes')->name('users.destroy');
        // Esta línea sirve para definir GET /admin/users/{user}/consents con sus consentimientos.
        Route::get('/users/{user}/consents', [AdminUserConsentController::class, 'index'])->name('users.consents.index');

        // Esta línea sirve para definir GET /admin/users/{user}/routine con su rutina.
        Route::get('/users/{user}/routine', [AdminUserRoutineController::class, 'show'])->name('users.routine.show');
        // Esta línea sirve para definir POST /admin/users/{user}/routine para asignarle una rutina personalizada.
        Route::post('/users/{user}/routine', [AdminUserRoutineController::class, 'store'])->middleware('throttle:writes')->name('users.routine.store');
        // Esta línea sirve para definir DELETE /admin/users/{user}/routine para volver a la rutina general.
        Route::delete('/users/{user}/routine', [AdminUserRoutineController::class, 'destroy'])->middleware('throttle:writes')->name('users.routine.destroy');
        // Esta línea sirve para definir PATCH /admin/routines/{routine} para editar una rutina personalizada.
        Route::patch('/routines/{routine}', [AdminUserRoutineController::class, 'update'])->middleware('throttle:writes')->name('routines.update');

        // Esta línea sirve para agrupar las rutas de ejercicios bajo /admin/exercises.
        Route::prefix('exercises')->name('exercises.')->group(function () {
            // Esta línea sirve para definir GET /admin/exercises con los ejercicios.
            Route::get('/', [AdminExerciseController::class, 'index'])->name('index');
            // Esta línea sirve para definir POST /admin/exercises para crear un ejercicio.
            Route::post('/', [AdminExerciseController::class, 'store'])->middleware('throttle:writes')->name('store');
            // Esta línea sirve para definir PATCH /admin/exercises/{exercise} para editarlo.
            Route::patch('/{exercise}', [AdminExerciseController::class, 'update'])->middleware('throttle:writes')->name('update');
            // Esta línea sirve para definir DELETE /admin/exercises/{exercise} para borrarlo.
            Route::delete('/{exercise}', [AdminExerciseController::class, 'destroy'])->middleware('throttle:writes')->name('destroy');
            // Esta línea sirve para definir POST /admin/exercises/{exercise}/video para subir su video.
            Route::post('/{exercise}/video', [AdminExerciseController::class, 'uploadVideo'])->middleware('throttle:writes')->name('video.store');
            // Esta línea sirve para definir DELETE /admin/exercises/{exercise}/video para borrar su video.
            Route::delete('/{exercise}/video', [AdminExerciseController::class, 'deleteVideo'])->middleware('throttle:writes')->name('video.destroy');
        });

        // Esta línea sirve para agrupar las rutas de plantillas de rutina bajo /admin/routine-templates.
        Route::prefix('routine-templates')->name('routine-templates.')->group(function () {
            // Esta línea sirve para definir GET /admin/routine-templates con las plantillas.
            Route::get('/', [AdminRoutineTemplateController::class, 'index'])->name('index');
            // Esta línea sirve para definir POST /admin/routine-templates para crear una plantilla.
            Route::post('/', [AdminRoutineTemplateController::class, 'store'])->middleware('throttle:writes')->name('store');
            // Esta línea sirve para definir GET /admin/routine-templates/{routineTemplate} con una plantilla.
            Route::get('/{routineTemplate}', [AdminRoutineTemplateController::class, 'show'])->name('show');
            // Esta línea sirve para definir PATCH /admin/routine-templates/{routineTemplate} para editarla.
            Route::patch('/{routineTemplate}', [AdminRoutineTemplateController::class, 'update'])->middleware('throttle:writes')->name('update');
            // Esta línea sirve para definir POST .../duplicate para duplicarla.
            Route::post('/{routineTemplate}/duplicate', [AdminRoutineTemplateController::class, 'duplicate'])->middleware('throttle:writes')->name('duplicate');
            // Esta línea sirve para definir PATCH .../activate para activarla.
            Route::patch('/{routineTemplate}/activate', [AdminRoutineTemplateController::class, 'activate'])->middleware('throttle:writes')->name('activate');
            // Esta línea sirve para definir PATCH .../deactivate para desactivarla.
            Route::patch('/{routineTemplate}/deactivate', [AdminRoutineTemplateController::class, 'deactivate'])->middleware('throttle:writes')->name('deactivate');
        });

        // Esta línea sirve para agrupar las rutas de plantillas de retos bajo /admin/challenge-templates.
        Route::prefix('challenge-templates')->name('challenge-templates.')->group(function () {
            // Esta línea sirve para definir GET /admin/challenge-templates con las plantillas.
            Route::get('/', [AdminChallengeTemplateController::class, 'index'])->name('index');
            // Esta línea sirve para definir POST /admin/challenge-templates para crear una plantilla.
            Route::post('/', [AdminChallengeTemplateController::class, 'store'])->middleware('throttle:writes')->name('store');
            // Esta línea sirve para definir PATCH /admin/challenge-templates/{challengeTemplate} para editarla.
            Route::patch('/{challengeTemplate}', [AdminChallengeTemplateController::class, 'update'])->middleware('throttle:writes')->name('update');
            // Esta línea sirve para definir PATCH .../activate para activarla.
            Route::patch('/{challengeTemplate}/activate', [AdminChallengeTemplateController::class, 'activate'])->middleware('throttle:writes')->name('activate');
            // Esta línea sirve para definir PATCH .../deactivate para desactivarla.
            Route::patch('/{challengeTemplate}/deactivate', [AdminChallengeTemplateController::class, 'deactivate'])->middleware('throttle:writes')->name('deactivate');
        });

        // Esta línea sirve para agrupar las rutas de soporte del panel bajo /admin/support.
        Route::prefix('support')->name('support.')->group(function () {
            // Esta línea sirve para definir GET /admin/support/tickets con todas las solicitudes.
            Route::get('/tickets', [AdminSupportController::class, 'index'])->name('tickets.index');
            // Esta línea sirve para definir GET /admin/support/tickets/{ticket} con una solicitud.
            Route::get('/tickets/{ticket}', [AdminSupportController::class, 'show'])->name('tickets.show');
            // Esta línea sirve para definir POST /admin/support/tickets/{ticket}/messages para responder como equipo.
            Route::post('/tickets/{ticket}/messages', [AdminSupportController::class, 'reply'])->middleware('throttle:writes')->name('tickets.messages.store');
            // Esta línea sirve para definir PATCH /admin/support/tickets/{ticket} para cambiar estado, prioridad o responsable.
            Route::patch('/tickets/{ticket}', [AdminSupportController::class, 'update'])->middleware('throttle:writes')->name('tickets.update');
            // Esta línea sirve para definir GET /admin/support/staff con los miembros del equipo.
            Route::get('/staff', [AdminSupportController::class, 'staff'])->name('staff');
            // Esta línea sirve para definir GET /admin/support/stats con las métricas de soporte.
            Route::get('/stats', [AdminSupportController::class, 'stats'])->name('stats');
        });

        // Esta línea sirve para definir GET /admin/reports con los reportes.
        Route::get('/reports', [AdminReportController::class, 'index'])->name('reports.index');
        // Esta línea sirve para definir PATCH /admin/reports/{report}/resolve para resolver un reporte.
        Route::patch('/reports/{report}/resolve', [AdminReportController::class, 'resolve'])->middleware('throttle:writes')->name('reports.resolve');

        // Esta línea sirve para definir GET /admin/pr-submissions con las postulaciones de PR.
        Route::get('/pr-submissions', [AdminPrSubmissionController::class, 'index'])->name('pr-submissions.index');
        // Esta línea sirve para definir PATCH /admin/pr-submissions/{prSubmission}/review para aprobar o rechazar.
        Route::patch('/pr-submissions/{prSubmission}/review', [AdminPrSubmissionController::class, 'review'])->middleware('throttle:writes')->name('pr-submissions.review');

        // Esta línea sirve para agrupar las rutas de noticias bajo /admin/news.
        Route::prefix('news')->name('news.')->group(function () {
            // Esta línea sirve para definir GET /admin/news con las noticias.
            Route::get('/', [AdminNewsController::class, 'index'])->name('index');
            // Esta línea sirve para definir POST /admin/news para crear una noticia.
            Route::post('/', [AdminNewsController::class, 'store'])->middleware('throttle:writes')->name('store');
            // Esta línea sirve para definir PATCH /admin/news/{news} para editarla.
            Route::patch('/{news}', [AdminNewsController::class, 'update'])->middleware('throttle:writes')->name('update');
            // Esta línea sirve para definir DELETE /admin/news/{news} para borrarla.
            Route::delete('/{news}', [AdminNewsController::class, 'destroy'])->middleware('throttle:writes')->name('destroy');
        });

        // Esta línea sirve para agrupar las rutas de productos bajo /admin/products.
        Route::prefix('products')->name('products.')->group(function () {
            // Esta línea sirve para definir GET /admin/products con los productos.
            Route::get('/', [AdminProductController::class, 'index'])->name('index');
            // Esta línea sirve para definir POST /admin/products para crear un producto.
            Route::post('/', [AdminProductController::class, 'store'])->middleware('throttle:writes')->name('store');
            // Esta línea sirve para definir PATCH /admin/products/{product} para editarlo.
            Route::patch('/{product}', [AdminProductController::class, 'update'])->middleware('throttle:writes')->name('update');
            // Esta línea sirve para definir DELETE /admin/products/{product} para borrarlo.
            Route::delete('/{product}', [AdminProductController::class, 'destroy'])->middleware('throttle:writes')->name('destroy');
            // Esta línea sirve para definir POST /admin/products/{product}/image para subir su imagen.
            Route::post('/{product}/image', [AdminProductController::class, 'uploadImage'])->middleware('throttle:writes')->name('image.store');
            // Esta línea sirve para definir DELETE /admin/products/{product}/image para borrar su imagen.
            Route::delete('/{product}/image', [AdminProductController::class, 'deleteImage'])->middleware('throttle:writes')->name('image.destroy');
        });

        // Esta línea sirve para agrupar las rutas de pedidos bajo /admin/orders.
        Route::prefix('orders')->name('orders.')->group(function () {
            // Esta línea sirve para definir GET /admin/orders con todos los pedidos.
            Route::get('/', [AdminOrderController::class, 'index'])->name('index');
            // Esta línea sirve para definir GET /admin/orders/{order} con un pedido.
            Route::get('/{order}', [AdminOrderController::class, 'show'])->name('show');
            // Esta línea sirve para definir PATCH /admin/orders/{order} para actualizar estado y seguimiento.
            Route::patch('/{order}', [AdminOrderController::class, 'update'])->middleware('throttle:writes')->name('update');
        });

        // Esta línea sirve para definir GET /admin/stats con las estadísticas globales.
        Route::get('/stats', [AdminStatsController::class, 'index'])->name('stats');
        // Esta línea sirve para definir GET /admin/audit-logs con el registro de auditoría.
        Route::get('/audit-logs', [AdminAuditLogController::class, 'index'])->name('audit-logs.index');

        // Esta línea sirve para agrupar las rutas de analítica bajo /admin/analytics.
        Route::prefix('analytics')->name('analytics.')->group(function () {
            // Esta línea sirve para definir GET /admin/analytics/overview con el resumen de uso.
            Route::get('/overview', [AdminAnalyticsController::class, 'overview'])->name('overview');
            // Esta línea sirve para definir GET /admin/analytics/activity con la actividad por hora y día.
            Route::get('/activity', [AdminAnalyticsController::class, 'activity'])->name('activity');
        });
    });
});
