<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status',
        'customer_name',
        'customer_email',
        'customer_phone',
        'department',
        'city',
        'address',
        'additional_info',
        'subtotal',
        'shipping_cost',
        'total',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'shipping_cost' => 'decimal:2',
            'total' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Mensaje listo para reenviar por WhatsApp/correo cuando exista ese
     * canal (ver NotifyOrderCreatedAction) — hoy solo se deja en el log.
     * Método puro (sin I/O) para poder testearlo sin mockear nada.
     */
    public function toNotificationText(): string
    {
        $lines = [
            '🛒 NUEVO PEDIDO SANKEN',
            '',
            'Pedido: #'.str_pad((string) $this->id, 6, '0', STR_PAD_LEFT),
            '',
            'Cliente:',
            $this->customer_name,
            '',
            'Teléfono:',
            $this->customer_phone,
            '',
        ];

        foreach ($this->items as $item) {
            $lines[] = 'Producto:';
            $lines[] = $item->product_name;
            $lines[] = 'Cantidad:';
            $lines[] = (string) $item->quantity;
            $lines[] = '';
        }

        $lines[] = 'Total:';
        $lines[] = '$'.number_format((float) $this->total, 0, ',', '.');
        $lines[] = '';
        $lines[] = 'Dirección:';
        $lines[] = $this->address;
        $lines[] = '';
        $lines[] = 'Ciudad:';
        $lines[] = "{$this->city}, {$this->department}";

        return implode("\n", $lines);
    }
}
