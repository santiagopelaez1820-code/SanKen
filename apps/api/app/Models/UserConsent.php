<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;
// Esta línea sirve para importar la excepción que indica un error de lógica.
use LogicException;

/**
 * Una aceptación (o futura revocación) de un documento legal en una versión
 * concreta. Inmutable: ni la API ni el código de la app pueden editar o
 * borrar una fila ya registrada — solo se agregan filas nuevas. Las filas
 * desaparecen únicamente si se borra la cuenta (FK cascade a nivel DB).
 */
// Esta línea sirve para declarar el modelo de los consentimientos legales.
class UserConsent extends Model
{
    // Esta línea sirve para definir el estado "aceptado".
    public const STATUS_ACCEPTED = 'accepted';

    // Esta línea sirve para definir el origen "registro con correo".
    public const SOURCE_REGISTRATION = 'registration';

    // Esta línea sirve para definir el origen "registro con Google".
    public const SOURCE_SOCIAL_REGISTRATION = 'social_registration';

    // Esta línea sirve para definir el origen "re-aceptación de documentos actualizados".
    public const SOURCE_REACCEPTANCE = 'reacceptance';

    // Esta línea sirve para desactivar las columnas created_at y updated_at.
    public $timestamps = false;

    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir el id del usuario.
        'user_id',
        // Esta línea sirve para permitir el tipo de consentimiento.
        'consent_type',
        // Esta línea sirve para permitir la versión del documento.
        'document_version',
        // Esta línea sirve para permitir el estado.
        'status',
        // Esta línea sirve para permitir el origen.
        'source',
        // Esta línea sirve para permitir cuándo se registró.
        'recorded_at',
    ];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir la fecha de registro a fecha y hora.
            'recorded_at' => 'datetime',
        ];
    }

    // Esta línea sirve para declarar el método que se ejecuta al iniciar el modelo.
    protected static function booted(): void
    {
        // Esta línea sirve para impedir que se modifique un consentimiento ya registrado.
        static::updating(fn () => throw new LogicException('Un consentimiento registrado no se puede modificar.'));
        // Esta línea sirve para impedir que se borre un consentimiento ya registrado.
        static::deleting(fn () => throw new LogicException('Un consentimiento registrado no se puede borrar.'));
    }

    // Esta línea sirve para declarar la relación con el usuario.
    public function user(): BelongsTo
    {
        // Esta línea sirve para definir que el consentimiento pertenece a un usuario.
        return $this->belongsTo(User::class);
    }
}
