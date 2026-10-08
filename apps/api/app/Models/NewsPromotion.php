<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase Builder para tipar los scopes de consulta.
use Illuminate\Database\Eloquent\Builder;
// Esta línea sirve para importar el trait que permite crear registros de prueba con factories.
use Illuminate\Database\Eloquent\Factories\HasFactory;
// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Esta línea sirve para declarar el modelo de las noticias y promociones.
class NewsPromotion extends Model
{
    // Esta línea sirve para usar las factories para crear noticias de prueba.
    use HasFactory;

    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir el id del admin que la creó.
        'admin_id',
        // Esta línea sirve para permitir el título.
        'title',
        // Esta línea sirve para permitir el cuerpo.
        'body',
        // Esta línea sirve para permitir la URL de la imagen.
        'image_url',
        // Esta línea sirve para permitir la fecha de publicación.
        'published_at',
    ];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir la fecha de publicación a fecha y hora.
            'published_at' => 'datetime',
        ];
    }

    // Esta línea sirve para declarar la relación con el admin que la creó.
    public function admin(): BelongsTo
    {
        // Esta línea sirve para definir que la noticia pertenece a un usuario (columna admin_id).
        return $this->belongsTo(User::class, 'admin_id');
    }

    // Esta línea sirve para declarar el scope que filtra solo las noticias publicadas.
    public function scopePublished(Builder $query): Builder
    {
        // Esta línea sirve para filtrar las que tienen fecha de publicación y esa fecha ya llegó.
        return $query->whereNotNull('published_at')->where('published_at', '<=', now());
    }
}
