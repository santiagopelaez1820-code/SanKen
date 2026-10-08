<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase Builder para tipar los scopes de consulta.
use Illuminate\Database\Eloquent\Builder;
// Esta línea sirve para importar el trait que permite crear registros de prueba con factories.
use Illuminate\Database\Eloquent\Factories\HasFactory;
// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "tiene muchos" (HasMany).
use Illuminate\Database\Eloquent\Relations\HasMany;

// Esta línea sirve para declarar el modelo de los productos de la tienda.
class Product extends Model
{
    // Esta línea sirve para usar las factories para crear productos de prueba.
    use HasFactory;

    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir el nombre.
        'name',
        // Esta línea sirve para permitir el slug.
        'slug',
        // Esta línea sirve para permitir la descripción.
        'description',
        // Esta línea sirve para permitir la descripción corta.
        'short_description',
        // Esta línea sirve para permitir la imagen.
        'image',
        // Esta línea sirve para permitir la categoría.
        'category',
        // Esta línea sirve para permitir el precio.
        'price',
        // Esta línea sirve para permitir si está activo.
        'active',
        // Esta línea sirve para permitir la referencia del proveedor Dropi.
        'dropi_reference',
    ];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir el precio a decimal con 2 decimales.
            'price' => 'decimal:2',
            // Esta línea sirve para convertir "activo" a booleano.
            'active' => 'boolean',
        ];
    }

    // Esta línea sirve para declarar el scope que filtra solo los productos activos.
    public function scopeActive(Builder $query): Builder
    {
        // Esta línea sirve para filtrar los productos activos.
        return $query->where('active', true);
    }

    // Esta línea sirve para declarar la relación con los productos vendidos en pedidos.
    public function orderItems(): HasMany
    {
        // Esta línea sirve para definir que el producto tiene muchos ítems de pedido.
        return $this->hasMany(OrderItem::class);
    }
}
