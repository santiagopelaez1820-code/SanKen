<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;

// Esta línea sirve para declarar el modelo que registra qué noticias leyó cada usuario.
class NewsPromotionRead extends Model
{
    // Esta línea sirve para desactivar las columnas created_at y updated_at.
    public $timestamps = false;

    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = ['user_id', 'news_promotion_id', 'read_at'];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir la fecha de lectura a fecha y hora.
            'read_at' => 'datetime',
        ];
    }
}
