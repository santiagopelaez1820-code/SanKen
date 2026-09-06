<?php

namespace App\Application\Order\Actions;

use App\Models\Order;
use App\Models\User;
use App\Notifications\NewOrderNotification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Throwable;

/**
 * Punto de enganche para la notificación de pedido nuevo. Fase 2: envía
 * NewOrderNotification (correo) a todos los usuarios con role=super_admin.
 * Cuando exista WhatsApp (Fase 3), este es el único lugar que cambia — el
 * resto del flujo de checkout no se entera.
 *
 * IMPORTANTE: CreateOrderAction llama a este método DESPUÉS de que su
 * DB::transaction() ya confirmó — nunca adentro. Además, todo acá está
 * envuelto en try/catch: un pedido ya creado nunca debe fallar ni
 * revertirse porque la notificación no se pudo despachar.
 */
class NotifyOrderCreatedAction
{
    public function execute(Order $order): void
    {
        try {
            $superAdmins = User::query()->where('role', 'super_admin')->get();

            if ($superAdmins->isEmpty()) {
                Log::warning('order.notification.no_super_admins', ['order_id' => $order->id]);

                return;
            }

            Notification::send($superAdmins, new NewOrderNotification($order));

            Log::info('order.notification.dispatched', [
                'order_id' => $order->id,
                'recipients' => $superAdmins->pluck('id')->all(),
            ]);
        } catch (Throwable $e) {
            // Nunca debe llegar hasta acá en circunstancias normales
            // (Notification::send() de una ShouldQueue solo encola un job),
            // pero si algo fallara en ese mismo instante (ej. Redis caído),
            // el pedido ya existe y el checkout ya respondió — esto es
            // puramente defensa extra, se loguea y se sigue.
            Log::error('order.notification.dispatch_failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
