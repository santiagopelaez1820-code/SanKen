<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres del dominio de pedidos.

namespace App\Domain\Order;

/**
 * Única fuente de verdad de los estados de pedido — la usan la migration
 * (definición del enum), UpdateOrderTrackingRequest (validación),
 * Order::statusLabel() y OrderWhatsAppMessageBuilder (plantillas por
 * estado). Igual criterio que ChallengeCatalog para los tipos/métricas de
 * reto: constantes acá, todo lo demás referencia esta clase en vez de
 * repetir el array de strings.
 */
// Esta línea sirve para declarar el catálogo de estados de un pedido.
class OrderStatusCatalog
{
    // Esta línea sirve para definir el estado "pedido recibido".
    public const PENDING = 'pending';

    // Esta línea sirve para definir el estado "confirmando pedido".
    public const CONFIRMING = 'confirming';

    // Esta línea sirve para definir el estado "procesando pedido".
    public const PROCESSING = 'processing';

    // Esta línea sirve para definir el estado "en camino".
    public const SHIPPED = 'shipped';

    // Esta línea sirve para definir el estado "entregado".
    public const DELIVERED = 'delivered';

    // Esta línea sirve para definir el estado "problema con el pedido".
    public const PROBLEM = 'problem';

    // Esta línea sirve para definir el estado "cancelado".
    public const CANCELLED = 'cancelled';

    // Esta línea sirve para definir la lista de todos los estados válidos.
    /** @var array<int, string> */
    public const STATUSES = [
        // Esta línea sirve para incluir pendiente.
        self::PENDING,
        // Esta línea sirve para incluir confirmando.
        self::CONFIRMING,
        // Esta línea sirve para incluir procesando.
        self::PROCESSING,
        // Esta línea sirve para incluir enviado.
        self::SHIPPED,
        // Esta línea sirve para incluir entregado.
        self::DELIVERED,
        // Esta línea sirve para incluir problema.
        self::PROBLEM,
        // Esta línea sirve para incluir cancelado.
        self::CANCELLED,
    ];

    // Esta línea sirve para definir el texto que se muestra para cada estado.
    /** @var array<string, string> */
    public const LABELS = [
        // Esta línea sirve para definir el texto del estado pendiente.
        self::PENDING => 'Pedido recibido',
        // Esta línea sirve para definir el texto del estado confirmando.
        self::CONFIRMING => 'Confirmando pedido',
        // Esta línea sirve para definir el texto del estado procesando.
        self::PROCESSING => 'Procesando pedido',
        // Esta línea sirve para definir el texto del estado enviado.
        self::SHIPPED => 'En camino',
        // Esta línea sirve para definir el texto del estado entregado.
        self::DELIVERED => 'Entregado',
        // Esta línea sirve para definir el texto del estado problema.
        self::PROBLEM => 'Problema con el pedido',
        // Esta línea sirve para definir el texto del estado cancelado.
        self::CANCELLED => 'Cancelado',
    ];

    // Esta línea sirve para declarar el método que devuelve el texto de un estado.
    public static function label(string $status): string
    {
        // Esta línea sirve para devolver el texto del estado, o el mismo valor si no está definido.
        return self::LABELS[$status] ?? $status;
    }
}
