<?php

namespace App\Models;

use App\Domain\Order\OrderStatusCatalog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Order extends Model
{
    use HasFactory;
    use LogsActivity;

    protected $fillable = [
        'user_id',
        'status',
        'customer_name',
        'customer_email',
        'customer_phone',
        'customer_whatsapp',
        'department',
        'city',
        'address',
        'additional_info',
        'subtotal',
        'shipping_cost',
        'total',
        'tracking_number',
        'carrier',
        'customer_message',
        'admin_notes',
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

    public function statusLabel(): string
    {
        return OrderStatusCatalog::label($this->status);
    }

    /**
     * Número de pedido formateado (#000042) — antes duplicado por separado
     * en NewOrderNotification y OrderWhatsAppMessageBuilder.
     */
    public function orderNumber(): string
    {
        return str_pad((string) $this->id, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Solo se registran los campos de seguimiento (no datos del cliente,
     * eso no aporta al historial de "qué le pasó a este pedido") —
     * mismo criterio que User::getActivitylogOptions().
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('order')
            ->logOnly(['status', 'tracking_number', 'carrier', 'customer_message', 'admin_notes'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

}
