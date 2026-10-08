<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar el catálogo de estados de pedido.
use App\Domain\Order\OrderStatusCatalog;
// Esta línea sirve para importar el trait que permite crear registros de prueba con factories.
use Illuminate\Database\Eloquent\Factories\HasFactory;
// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;
// Esta línea sirve para importar el tipo de relación "tiene muchos" (HasMany).
use Illuminate\Database\Eloquent\Relations\HasMany;
// Esta línea sirve para importar las opciones del registro de actividad de Spatie.
use Spatie\Activitylog\LogOptions;
// Esta línea sirve para importar el trait que registra los cambios del modelo (auditoría).
use Spatie\Activitylog\Traits\LogsActivity;

// Esta línea sirve para declarar el modelo de los pedidos.
class Order extends Model
{
    // Esta línea sirve para usar las factories para crear pedidos de prueba.
    use HasFactory;

    // Esta línea sirve para registrar en la auditoría los cambios del pedido.
    use LogsActivity;

    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir el id del usuario.
        'user_id',
        // Esta línea sirve para permitir el estado.
        'status',
        // Esta línea sirve para permitir el nombre del cliente.
        'customer_name',
        // Esta línea sirve para permitir el correo del cliente.
        'customer_email',
        // Esta línea sirve para permitir el celular del cliente.
        'customer_phone',
        // Esta línea sirve para permitir el WhatsApp del cliente.
        'customer_whatsapp',
        // Esta línea sirve para permitir el departamento.
        'department',
        // Esta línea sirve para permitir la ciudad.
        'city',
        // Esta línea sirve para permitir la dirección.
        'address',
        // Esta línea sirve para permitir la información adicional.
        'additional_info',
        // Esta línea sirve para permitir el subtotal.
        'subtotal',
        // Esta línea sirve para permitir el costo de envío.
        'shipping_cost',
        // Esta línea sirve para permitir el total.
        'total',
        // Esta línea sirve para permitir el número de guía.
        'tracking_number',
        // Esta línea sirve para permitir la transportadora.
        'carrier',
        // Esta línea sirve para permitir el mensaje para el cliente.
        'customer_message',
        // Esta línea sirve para permitir las notas internas del admin.
        'admin_notes',
    ];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir el subtotal a decimal con 2 decimales.
            'subtotal' => 'decimal:2',
            // Esta línea sirve para convertir el costo de envío a decimal con 2 decimales.
            'shipping_cost' => 'decimal:2',
            // Esta línea sirve para convertir el total a decimal con 2 decimales.
            'total' => 'decimal:2',
        ];
    }

    // Esta línea sirve para declarar la relación con el usuario.
    public function user(): BelongsTo
    {
        // Esta línea sirve para definir que el pedido pertenece a un usuario.
        return $this->belongsTo(User::class);
    }

    // Esta línea sirve para declarar la relación con los productos del pedido.
    public function items(): HasMany
    {
        // Esta línea sirve para definir que el pedido tiene muchos productos.
        return $this->hasMany(OrderItem::class);
    }

    // Esta línea sirve para declarar el método que devuelve el nombre del estado en texto.
    public function statusLabel(): string
    {
        // Esta línea sirve para traducir el estado con el catálogo.
        return OrderStatusCatalog::label($this->status);
    }

    /**
     * Número de pedido formateado (#000042) — antes duplicado por separado
     * en NewOrderNotification y OrderWhatsAppMessageBuilder.
     */
    // Esta línea sirve para declarar el método que devuelve el número de pedido formateado.
    public function orderNumber(): string
    {
        // Esta línea sirve para rellenar el id con ceros a la izquierda hasta 6 dígitos.
        return str_pad((string) $this->id, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Solo se registran los campos de seguimiento (no datos del cliente,
     * eso no aporta al historial de "qué le pasó a este pedido") —
     * mismo criterio que User::getActivitylogOptions().
     */
    // Esta línea sirve para declarar las opciones del registro de auditoría.
    public function getActivitylogOptions(): LogOptions
    {
        // Esta línea sirve para partir de las opciones por defecto.
        return LogOptions::defaults()
            // Esta línea sirve para guardar los cambios con el nombre de log "order".
            ->useLogName('order')
            // Esta línea sirve para registrar solo los campos de seguimiento.
            ->logOnly(['status', 'tracking_number', 'carrier', 'customer_message', 'admin_notes'])
            // Esta línea sirve para registrar solo los campos que cambiaron.
            ->logOnlyDirty()
            // Esta línea sirve para evitar guardar registros sin cambios.
            ->dontSubmitEmptyLogs();
    }
}
