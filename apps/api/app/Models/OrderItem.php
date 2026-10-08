<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar el trait que permite crear registros de prueba con factories.
use Illuminate\Database\Eloquent\Factories\HasFactory;
// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Esta línea sirve para declarar el modelo de los productos de un pedido.
class OrderItem extends Model
{
    // Esta línea sirve para usar las factories para crear ítems de prueba.
    use HasFactory;

    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir el id del pedido.
        'order_id',
        // Esta línea sirve para permitir el id del producto.
        'product_id',
        // Esta línea sirve para permitir el nombre del producto.
        'product_name',
        // Esta línea sirve para permitir la cantidad.
        'quantity',
        // Esta línea sirve para permitir el precio unitario.
        'unit_price',
        // Esta línea sirve para permitir el subtotal.
        'subtotal',
    ];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir el precio unitario a decimal con 2 decimales.
            'unit_price' => 'decimal:2',
            // Esta línea sirve para convertir el subtotal a decimal con 2 decimales.
            'subtotal' => 'decimal:2',
        ];
    }

    // Esta línea sirve para declarar la relación con el pedido.
    public function order(): BelongsTo
    {
        // Esta línea sirve para definir que el ítem pertenece a un pedido.
        return $this->belongsTo(Order::class);
    }

    // Esta línea sirve para declarar la relación con el producto.
    public function product(): BelongsTo
    {
        // Esta línea sirve para definir que el ítem pertenece a un producto.
        return $this->belongsTo(Product::class);
    }
}
