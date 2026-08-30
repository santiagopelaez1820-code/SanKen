<?php

namespace App\Application\Order\Actions;

use App\Models\Order;
use Illuminate\Support\Facades\Log;

/**
 * Punto de enganche para la notificación de pedido nuevo. Hoy solo deja
 * constancia en el log con el mismo texto que se enviaría; cuando exista un
 * canal real (WhatsApp Business API, correo transaccional) este método pasa
 * a invocarlo, sin tocar CreateOrderAction ni el resto del checkout.
 */
class NotifyOrderCreatedAction
{
    public function execute(Order $order): void
    {
        Log::info('order.notification.pending', [
            'order_id' => $order->id,
            'message' => $order->toNotificationText(),
        ]);
    }
}
