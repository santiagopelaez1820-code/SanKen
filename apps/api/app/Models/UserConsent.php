<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use LogicException;

/**
 * Una aceptación (o futura revocación) de un documento legal en una versión
 * concreta. Inmutable: ni la API ni el código de la app pueden editar o
 * borrar una fila ya registrada — solo se agregan filas nuevas. Las filas
 * desaparecen únicamente si se borra la cuenta (FK cascade a nivel DB).
 */
class UserConsent extends Model
{
    public const STATUS_ACCEPTED = 'accepted';

    public const SOURCE_REGISTRATION = 'registration';

    public const SOURCE_SOCIAL_REGISTRATION = 'social_registration';

    public const SOURCE_REACCEPTANCE = 'reacceptance';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'consent_type',
        'document_version',
        'status',
        'source',
        'recorded_at',
    ];

    protected function casts(): array
    {
        return [
            'recorded_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::updating(fn () => throw new LogicException('Un consentimiento registrado no se puede modificar.'));
        static::deleting(fn () => throw new LogicException('Un consentimiento registrado no se puede borrar.'));
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
