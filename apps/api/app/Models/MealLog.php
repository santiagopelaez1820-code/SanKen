<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Esta línea sirve para declarar el modelo de las comidas registradas.
class MealLog extends Model
{
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = ['user_id', 'food_item_id', 'meal_type', 'quantity_grams', 'logged_at'];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir la cantidad a decimal con 2 decimales.
            'quantity_grams' => 'decimal:2',
            // Esta línea sirve para convertir la fecha a fecha.
            'logged_at' => 'date',
        ];
    }

    // Esta línea sirve para declarar la relación con el usuario.
    public function user(): BelongsTo
    {
        // Esta línea sirve para definir que la comida pertenece a un usuario.
        return $this->belongsTo(User::class);
    }

    // Esta línea sirve para declarar la relación con el alimento.
    public function foodItem(): BelongsTo
    {
        // Esta línea sirve para definir que la comida pertenece a un alimento.
        return $this->belongsTo(FoodItem::class);
    }
}
