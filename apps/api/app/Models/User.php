<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la notificación de restablecer contraseña.
use App\Notifications\ResetPasswordNotification;
// Esta línea sirve para importar la factory de usuarios (para tipar HasFactory).
use Database\Factories\UserFactory;
// Esta línea sirve para importar el trait que implementa la verificación de correo.
use Illuminate\Auth\MustVerifyEmail;
// Esta línea sirve para importar el contrato de verificación de correo.
use Illuminate\Contracts\Auth\MustVerifyEmail as MustVerifyEmailContract;
// Esta línea sirve para importar el trait que permite crear registros de prueba con factories.
use Illuminate\Database\Eloquent\Factories\HasFactory;
// Esta línea sirve para importar el tipo de relación "muchos a muchos" (BelongsToMany).
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
// Esta línea sirve para importar el tipo de relación "tiene muchos" (HasMany).
use Illuminate\Database\Eloquent\Relations\HasMany;
// Esta línea sirve para importar el tipo de relación "tiene uno" (HasOne).
use Illuminate\Database\Eloquent\Relations\HasOne;
// Esta línea sirve para importar la clase base de los usuarios que pueden iniciar sesión.
use Illuminate\Foundation\Auth\User as Authenticatable;
// Esta línea sirve para importar el trait que permite enviar notificaciones.
use Illuminate\Notifications\Notifiable;
// Esta línea sirve para importar el trait de Sanctum para crear tokens de API.
use Laravel\Sanctum\HasApiTokens;
// Esta línea sirve para importar las opciones del registro de actividad de Spatie.
use Spatie\Activitylog\LogOptions;
// Esta línea sirve para importar el trait que registra los cambios del modelo (auditoría).
use Spatie\Activitylog\Traits\LogsActivity;

// Esta línea sirve para declarar el modelo de los usuarios, que exige verificar el correo.
class User extends Authenticatable implements MustVerifyEmailContract
{
    /** @use HasFactory<UserFactory> */
    // Esta línea sirve para usar tokens de API, factories, auditoría, verificación de correo y notificaciones.
    use HasApiTokens, HasFactory, LogsActivity, MustVerifyEmail, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir el nombre.
        'name',
        // Esta línea sirve para permitir el correo.
        'email',
        // Esta línea sirve para permitir el teléfono.
        'phone',
        // Esta línea sirve para permitir la URL de la foto.
        'avatar_url',
        // Esta línea sirve para permitir el uid de Firebase.
        'firebase_uid',
        // Esta línea sirve para permitir el proveedor de login.
        'auth_provider',
        // Esta línea sirve para permitir la contraseña.
        'password',
        // Esta línea sirve para permitir el rol.
        'role',
        // Esta línea sirve para permitir si el perfil es público.
        'is_public_profile',
        // Esta línea sirve para permitir si está baneado.
        'is_banned',
        // Esta línea sirve para permitir la fecha de desactivación.
        'deactivated_at',
        // Esta línea sirve para permitir si tiene la verificación en dos pasos.
        'two_factor_enabled',
        // Esta línea sirve para permitir la última actividad.
        'last_active_at',
        // Esta línea sirve para permitir la fecha de verificación como entrenador.
        'trainer_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    // Esta línea sirve para definir los campos que se ocultan al convertir a JSON.
    protected $hidden = [
        // Esta línea sirve para ocultar la contraseña.
        'password',
        // Esta línea sirve para ocultar el token de "recordarme".
        'remember_token',
        // Esta línea sirve para ocultar el secreto de la verificación en dos pasos.
        'two_factor_secret',
        // Esta línea sirve para ocultar los códigos de recuperación.
        'two_factor_recovery_codes',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir la fecha de verificación del correo a fecha y hora.
            'email_verified_at' => 'datetime',
            // Esta línea sirve para guardar la contraseña siempre hasheada.
            'password' => 'hashed',
            // Esta línea sirve para convertir "verificación en dos pasos" a booleano.
            'two_factor_enabled' => 'boolean',
            // Esta línea sirve para guardar el secreto de la verificación en dos pasos cifrado.
            'two_factor_secret' => 'encrypted',
            // Esta línea sirve para convertir los códigos de recuperación de JSON a arreglo.
            'two_factor_recovery_codes' => 'array',
            // Esta línea sirve para convertir "perfil público" a booleano.
            'is_public_profile' => 'boolean',
            // Esta línea sirve para convertir "baneado" a booleano.
            'is_banned' => 'boolean',
            // Esta línea sirve para convertir la fecha de desactivación a fecha y hora.
            'deactivated_at' => 'datetime',
            // Esta línea sirve para convertir la última actividad a fecha y hora.
            'last_active_at' => 'datetime',
            // Esta línea sirve para convertir la fecha de verificación como entrenador a fecha y hora.
            'trainer_verified_at' => 'datetime',
        ];
    }

    /**
     * Reemplaza el correo de "olvidé mi contraseña" por defecto de Laravel
     * (en inglés, sin marca) por ResetPasswordNotification — mismo criterio
     * que usa VerifyEmail::createUrlUsing() en AppServiceProvider: la API no
     * sirve HTML, así que el link apunta al frontend (FRONTEND_URL) para que
     * el usuario pueda escribir la contraseña nueva ahí.
     */
    // Esta línea sirve para declarar el método que envía el correo para restablecer la contraseña.
    public function sendPasswordResetNotification($token): void
    {
        // Esta línea sirve para leer la URL del frontend de la configuración.
        $frontendUrl = config('app.frontend_url');
        // Esta línea sirve para armar los parámetros con el token y el correo.
        $query = http_build_query(['token' => $token, 'email' => $this->email]);

        // Esta línea sirve para armar el enlace de restablecimiento según haya frontend configurado.
        $resetUrl = $frontendUrl
            // Esta línea sirve para usar la página del frontend si existe.
            ? rtrim($frontendUrl, '/')."/reset-password?{$query}"
            // Esta línea sirve para usar la URL de la propia API si no hay frontend.
            : url("/reset-password?{$query}");

        // Esta línea sirve para enviar la notificación con el enlace.
        $this->notify(new ResetPasswordNotification($resetUrl));
    }

    // Esta línea sirve para declarar la relación con el perfil.
    public function profile(): HasOne
    {
        // Esta línea sirve para definir que el usuario tiene un perfil.
        return $this->hasOne(UserProfile::class);
    }

    // Esta línea sirve para declarar la relación con las respuestas del onboarding.
    public function onboardingResponse(): HasOne
    {
        // Esta línea sirve para definir que el usuario tiene unas respuestas de onboarding.
        return $this->hasOne(OnboardingResponse::class);
    }

    // Esta línea sirve para declarar la relación con las rutinas.
    public function routines(): HasMany
    {
        // Esta línea sirve para definir que el usuario tiene muchas rutinas.
        return $this->hasMany(Routine::class);
    }

    // Esta línea sirve para declarar la relación con la rutina activa.
    public function activeRoutine(): HasOne
    {
        // Esta línea sirve para definir que tiene una rutina activa (la más reciente).
        return $this->hasOne(Routine::class)->where('is_active', true)->latestOfMany();
    }

    // Esta línea sirve para declarar la relación con las sesiones de entrenamiento.
    public function workoutSessions(): HasMany
    {
        // Esta línea sirve para definir que el usuario tiene muchas sesiones.
        return $this->hasMany(WorkoutSession::class);
    }

    // Esta línea sirve para declarar la relación con las medidas corporales.
    public function bodyMeasurements(): HasMany
    {
        // Esta línea sirve para definir que el usuario tiene muchas medidas.
        return $this->hasMany(BodyMeasurement::class);
    }

    // Esta línea sirve para declarar la relación con las estadísticas diarias.
    public function statsDaily(): HasMany
    {
        // Esta línea sirve para definir que el usuario tiene muchas estadísticas diarias.
        return $this->hasMany(UserStatsDaily::class);
    }

    // Esta línea sirve para declarar la relación con los récords personales.
    public function personalRecords(): HasMany
    {
        // Esta línea sirve para definir que el usuario tiene muchos récords.
        return $this->hasMany(PersonalRecord::class);
    }

    // Esta línea sirve para declarar la relación con los pedidos.
    public function orders(): HasMany
    {
        // Esta línea sirve para definir que el usuario tiene muchos pedidos.
        return $this->hasMany(Order::class);
    }

    // Esta línea sirve para declarar la relación con las solicitudes de soporte.
    public function supportTickets(): HasMany
    {
        // Esta línea sirve para definir que el usuario tiene muchas solicitudes.
        return $this->hasMany(SupportTicket::class);
    }

    // Esta línea sirve para declarar la relación con los check-ins semanales.
    public function weeklyCheckins(): HasMany
    {
        // Esta línea sirve para definir que el usuario tiene muchos check-ins.
        return $this->hasMany(WeeklyCheckin::class);
    }

    /** Historial append-only de consentimientos legales — ver UserConsent. */
    // Esta línea sirve para declarar la relación con los consentimientos legales.
    public function consents(): HasMany
    {
        // Esta línea sirve para definir que el usuario tiene muchos consentimientos.
        return $this->hasMany(UserConsent::class);
    }

    // Esta línea sirve para declarar la relación con sus clientes (si es entrenador).
    public function trainerClients(): HasMany
    {
        // Esta línea sirve para definir que tiene muchas relaciones como entrenador (columna trainer_id).
        return $this->hasMany(TrainerClient::class, 'trainer_id');
    }

    /**
     * Inverso de trainerClients(): las filas trainer_clients donde este
     * usuario es el cliente, no el entrenador. Sin uso hasta Sprint 11 (chat)
     * — antes no existía ninguna vista del lado cliente de la relación.
     */
    // Esta línea sirve para declarar la relación con sus entrenadores (como cliente).
    public function clientRelationships(): HasMany
    {
        // Esta línea sirve para definir que tiene muchas relaciones como cliente (columna client_id).
        return $this->hasMany(TrainerClient::class, 'client_id');
    }

    // Esta línea sirve para declarar la relación con la XP acumulada.
    public function xp(): HasOne
    {
        // Esta línea sirve para definir que el usuario tiene un registro de XP.
        return $this->hasOne(UserXp::class);
    }

    // Esta línea sirve para declarar la relación con los logros desbloqueados.
    public function achievements(): BelongsToMany
    {
        // Esta línea sirve para definir la relación muchos a muchos con la tabla user_achievements.
        return $this->belongsToMany(Achievement::class, 'user_achievements')
            // Esta línea sirve para usar el modelo intermedio UserAchievement.
            ->using(UserAchievement::class)
            // Esta línea sirve para incluir la fecha en que se desbloqueó.
            ->withPivot('achieved_at')
            // Esta línea sirve para guardar las fechas de creación y actualización de la tabla intermedia.
            ->withTimestamps();
    }

    // Esta línea sirve para declarar el método que indica si es super admin.
    public function isAdmin(): bool
    {
        // Esta línea sirve para devolver si el rol es "super_admin".
        return $this->role === 'super_admin';
    }

    // Esta línea sirve para declarar el método que indica si es entrenador.
    public function isTrainer(): bool
    {
        // Esta línea sirve para devolver si el rol es "trainer".
        return $this->role === 'trainer';
    }

    // Esta línea sirve para declarar las opciones del registro de auditoría.
    public function getActivitylogOptions(): LogOptions
    {
        // Esta línea sirve para partir de las opciones por defecto.
        return LogOptions::defaults()
            // Esta línea sirve para guardar los cambios con el nombre de log "user".
            ->useLogName('user')
            // Esta línea sirve para registrar solo rol, baneo, desactivación, verificación en dos pasos y verificación de entrenador.
            ->logOnly(['role', 'is_banned', 'deactivated_at', 'two_factor_enabled', 'trainer_verified_at'])
            // Esta línea sirve para registrar solo los campos que cambiaron.
            ->logOnlyDirty()
            // Esta línea sirve para evitar guardar registros sin cambios.
            ->dontSubmitEmptyLogs();
    }
}
