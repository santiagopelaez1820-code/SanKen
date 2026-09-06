<?php

namespace App\Domain\Order;

/**
 * Única fuente de verdad de los estados de pedido — la usan la migration
 * (definición del enum), UpdateOrderTrackingRequest (validación),
 * Order::statusLabel() y OrderWhatsAppMessageBuilder (plantillas por
 * estado). Igual criterio que ChallengeCatalog para los tipos/métricas de
 * reto: constantes acá, todo lo demás referencia esta clase en vez de
 * repetir el array de strings.
 */
class OrderStatusCatalog
{
    public const PENDING = 'pending';

    public const CONFIRMING = 'confirming';

    public const PROCESSING = 'processing';

    public const SHIPPED = 'shipped';

    public const DELIVERED = 'delivered';

    public const PROBLEM = 'problem';

    public const CANCELLED = 'cancelled';

    /** @var array<int, string> */
    public const STATUSES = [
        self::PENDING,
        self::CONFIRMING,
        self::PROCESSING,
        self::SHIPPED,
        self::DELIVERED,
        self::PROBLEM,
        self::CANCELLED,
    ];

    /** @var array<string, string> */
    public const LABELS = [
        self::PENDING => 'Pedido recibido',
        self::CONFIRMING => 'Confirmando pedido',
        self::PROCESSING => 'Procesando pedido',
        self::SHIPPED => 'En camino',
        self::DELIVERED => 'Entregado',
        self::PROBLEM => 'Problema con el pedido',
        self::CANCELLED => 'Cancelado',
    ];

    public static function label(string $status): string
    {
        return self::LABELS[$status] ?? $status;
    }
}
