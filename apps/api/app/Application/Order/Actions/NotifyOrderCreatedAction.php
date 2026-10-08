<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de pedidos.

namespace App\Application\Order\Actions;

// Esta línea sirve para importar el modelo Order (pedido).
use App\Models\Order;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar la notificación de pedido nuevo.
use App\Notifications\NewOrderNotification;
// Esta línea sirve para importar la fachada Log para escribir en el registro de la app.
use Illuminate\Support\Facades\Log;
// Esta línea sirve para importar la fachada Notification para enviar notificaciones a varios usuarios.
use Illuminate\Support\Facades\Notification;
// Esta línea sirve para importar Throwable para capturar cualquier error.
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
// Esta línea sirve para declarar la acción que avisa a los administradores de un pedido nuevo.
class NotifyOrderCreatedAction
{
    // Esta línea sirve para declarar el método que recibe el pedido recién creado.
    public function execute(Order $order): void
    {
        // Esta línea sirve para intentar enviar la notificación sin que un error afecte al pedido.
        try {
            // Esta línea sirve para obtener a todos los usuarios con rol super_admin.
            $superAdmins = User::query()->where('role', 'super_admin')->get();

            // Esta línea sirve para revisar si no hay ningún super admin.
            if ($superAdmins->isEmpty()) {
                // Esta línea sirve para dejar una advertencia en el registro.
                Log::warning('order.notification.no_super_admins', ['order_id' => $order->id]);

                // Esta línea sirve para terminar sin enviar nada.
                return;
            }

            // Esta línea sirve para enviar la notificación de pedido nuevo a todos los super admins.
            Notification::send($superAdmins, new NewOrderNotification($order));

            // Esta línea sirve para dejar en el registro que la notificación se envió.
            Log::info('order.notification.dispatched', [
                // Esta línea sirve para incluir el id del pedido.
                'order_id' => $order->id,
                // Esta línea sirve para incluir los ids de quienes la recibieron.
                'recipients' => $superAdmins->pluck('id')->all(),
            ]);
            // Esta línea sirve para capturar cualquier error al enviar la notificación.
        } catch (Throwable $e) {
            // Nunca debe llegar hasta acá en circunstancias normales
            // (Notification::send() de una ShouldQueue solo encola un job),
            // pero si algo fallara en ese mismo instante (ej. Redis caído),
            // el pedido ya existe y el checkout ya respondió — esto es
            // puramente defensa extra, se loguea y se sigue.
            // Esta línea sirve para registrar el error sin afectar el pedido.
            Log::error('order.notification.dispatch_failed', [
                // Esta línea sirve para incluir el id del pedido.
                'order_id' => $order->id,
                // Esta línea sirve para incluir el mensaje del error.
                'error' => $e->getMessage(),
            ]);
        }
    }
}
