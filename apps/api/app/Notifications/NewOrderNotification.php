<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las notificaciones.

namespace App\Notifications;

// Esta línea sirve para importar el catálogo de estados de pedido.
use App\Domain\Order\OrderStatusCatalog;
// Esta línea sirve para importar el modelo Order (pedido).
use App\Models\Order;
// Esta línea sirve para importar el trait que permite enviar la notificación a la cola.
use Illuminate\Bus\Queueable;
// Esta línea sirve para importar el contrato que indica que se procesa en cola.
use Illuminate\Contracts\Queue\ShouldQueue;
// Esta línea sirve para importar la clase que arma correos.
use Illuminate\Notifications\Messages\MailMessage;
// Esta línea sirve para importar la clase base de las notificaciones.
use Illuminate\Notifications\Notification;
// Esta línea sirve para importar la fachada Log para escribir en el log.
use Illuminate\Support\Facades\Log;
// Esta línea sirve para importar HtmlString para insertar HTML en el correo.
use Illuminate\Support\HtmlString;
// Esta línea sirve para importar Throwable para recibir el error final.
use Throwable;

/**
 * Aviso por correo a los superadmin cuando se crea un pedido nuevo — ver
 * NotifyOrderCreatedAction, que la despacha a todos los usuarios con
 * role=super_admin justo DESPUÉS de que CreateOrderAction confirma la
 * transacción del pedido (nunca antes: si esto fallara dentro de la
 * transacción, revertiría el pedido ya creado).
 *
 * Implementa ShouldQueue porque el proyecto ya tiene Redis como cola
 * (QUEUE_CONNECTION=redis, mismo patrón que GenerateRoutineAction) — así un
 * SMTP lento o caído nunca alarga ni arriesga el request de checkout. Para
 * que se entregue de verdad hace falta `php artisan queue:work` corriendo
 * (documentado en el reporte de esta fase).
 */
// Esta línea sirve para declarar la notificación por correo de pedido nuevo, que se envía en cola.
class NewOrderNotification extends Notification implements ShouldQueue
{
    // Esta línea sirve para usar las opciones de cola.
    use Queueable;

    /** Reintentos ante fallo de envío (ej. SMTP caído momentáneamente) antes de darse por vencido y loguear en failed(). */
    // Esta línea sirve para definir la cantidad de intentos de envío.
    public int $tries = 3;

    // Esta línea sirve para declarar el constructor.
    public function __construct(
        // Esta línea sirve para recibir el pedido.
        public readonly Order $order,
    ) {}

    /**
     * @return array<int, string>
     */
    // Esta línea sirve para declarar el método que elige los canales de envío.
    public function via(object $notifiable): array
    {
        // Esta línea sirve para enviar solo por correo.
        return ['mail'];
    }

    /**
     * Backoff creciente entre reintentos (1min, 5min, 15min) — casi siempre
     * un fallo de SMTP es transitorio, no vale la pena reintentar de
     * inmediato.
     *
     * @return array<int, int>
     */
    // Esta línea sirve para declarar el método que define la espera entre reintentos.
    public function backoff(): array
    {
        // Esta línea sirve para esperar 1, 5 y 15 minutos.
        return [60, 300, 900];
    }

    // Esta línea sirve para declarar el método que arma el correo.
    public function toMail(object $notifiable): MailMessage
    {
        // Esta línea sirve para obtener el pedido.
        $order = $this->order;

        // Esta línea sirve para crear el correo.
        $mail = (new MailMessage)
            // Esta línea sirve para poner el asunto con el número de pedido.
            ->subject("🛒 Nuevo pedido #{$order->orderNumber()} - Tienda SanKen")
            // Esta línea sirve para poner el saludo.
            ->greeting('🛒 Nuevo pedido en la Tienda SanKen')
            // Esta línea sirve para escribir el número, la fecha y el estado del pedido.
            ->line("Pedido **#{$order->orderNumber()}** — {$order->created_at->format('d/m/Y H:i')} — Estado: **{$this->statusLabel()}**")
            // Esta línea sirve para escribir el título de la sección del cliente.
            ->line('**CLIENTE**')
            // Esta línea sirve para escribir el nombre del cliente.
            ->line("Nombre: {$order->customer_name}")
            // Esta línea sirve para escribir el teléfono del cliente.
            ->line("Teléfono: {$order->customer_phone}")
            // Esta línea sirve para escribir el correo del cliente.
            ->line("Correo: {$order->customer_email}")
            // Esta línea sirve para escribir el título de la sección de entrega.
            ->line('**ENTREGA**')
            // Esta línea sirve para escribir la dirección.
            ->line("Dirección: {$order->address}")
            // Esta línea sirve para escribir la ciudad.
            ->line("Ciudad: {$order->city}")
            // Esta línea sirve para escribir el departamento.
            ->line("Departamento: {$order->department}");

        // Esta línea sirve para revisar si hay observaciones.
        if ($order->additional_info) {
            // Esta línea sirve para escribir las observaciones.
            $mail->line("Observaciones: {$order->additional_info}");
        }

        // Esta línea sirve para escribir el título de la sección de productos.
        $mail->line('**PRODUCTOS**')
            // Esta línea sirve para insertar la tabla de productos en HTML.
            ->line(new HtmlString($this->itemsTableHtml()))
            // Esta línea sirve para escribir el subtotal.
            ->line("Subtotal: **{$this->money($order->subtotal)}**");

        // Esta línea sirve para revisar si hay costo de envío.
        if ($order->shipping_cost !== null) {
            // Esta línea sirve para escribir el costo de envío.
            $mail->line("Envío: **{$this->money($order->shipping_cost)}**");
        }

        // Esta línea sirve para devolver el correo.
        return $mail
            // Esta línea sirve para escribir el total.
            ->line("### TOTAL: {$this->money($order->total)}")
            // Esta línea sirve para agregar el botón para ver el pedido en el panel.
            ->action('Ver pedido en SanKen', $this->adminOrderUrl())
            // Esta línea sirve para poner la despedida.
            ->salutation('Tienda SanKen');
    }

    /**
     * Se llama automáticamente cuando se agotan los `tries` reintentos —
     * deja constancia en el log para que se pueda notar que un pedido no
     * llegó a notificarse por correo, sin que eso afecte al pedido en sí
     * (ya existe, ya fue creado antes de que esto se dispare).
     */
    // Esta línea sirve para declarar el método que se ejecuta cuando se agotan los reintentos.
    public function failed(Throwable $exception): void
    {
        // Esta línea sirve para registrar el error en el log.
        Log::error('order.notification.mail_failed', [
            // Esta línea sirve para incluir el id del pedido.
            'order_id' => $this->order->id,
            // Esta línea sirve para incluir el mensaje del error.
            'error' => $exception->getMessage(),
        ]);
    }

    // Esta línea sirve para declarar el método privado que devuelve el estado en texto.
    private function statusLabel(): string
    {
        // Esta línea sirve para traducir el estado con el catálogo.
        return OrderStatusCatalog::label($this->order->status);
    }

    // Esta línea sirve para declarar el método privado que da formato de dinero.
    private function money(string|float $amount): string
    {
        // Esta línea sirve para formatear el monto en pesos colombianos sin decimales.
        return '$'.number_format((float) $amount, 0, ',', '.').' COP';
    }

    /**
     * Apunta al panel web administrativo (apps/web), NO a esta API — son
     * apps distintas. Reutiliza `frontend_url`/FRONTEND_URL, ya existente
     * en el proyecto y usado con el mismo criterio en
     * EmailVerificationController para el link de verificación de correo.
     */
    // Esta línea sirve para declarar el método privado que arma el enlace al pedido en el panel.
    private function adminOrderUrl(): string
    {
        // Esta línea sirve para leer la URL del frontend de la configuración.
        $frontendUrl = config('app.frontend_url');

        // Esta línea sirve para revisar si no hay frontend configurado.
        if (! $frontendUrl) {
            // Esta línea sirve para usar la URL de la propia API.
            return url("/admin/orders/{$this->order->id}");
        }

        // Esta línea sirve para armar el enlace con la URL del frontend.
        return rtrim($frontendUrl, '/')."/admin/orders/{$this->order->id}";
    }

    // Esta línea sirve para declarar el método privado que arma la tabla HTML de productos.
    private function itemsTableHtml(): string
    {
        // Esta línea sirve para armar una fila por cada producto.
        $rows = $this->order->items->map(function ($item) {
            // Esta línea sirve para abrir la fila.
            return '<tr>'
                // Esta línea sirve para agregar la celda con el nombre (escapado).
                .'<td style="padding:6px 8px;border-bottom:1px solid #e5e5e5;">'.e($item->product_name).'</td>'
                // Esta línea sirve para agregar la celda con la cantidad.
                .'<td style="padding:6px 8px;border-bottom:1px solid #e5e5e5;text-align:center;">'.(int) $item->quantity.'</td>'
                // Esta línea sirve para agregar la celda con el precio unitario.
                .'<td style="padding:6px 8px;border-bottom:1px solid #e5e5e5;text-align:right;">'.$this->money($item->unit_price).'</td>'
                // Esta línea sirve para agregar la celda con el subtotal.
                .'<td style="padding:6px 8px;border-bottom:1px solid #e5e5e5;text-align:right;">'.$this->money($item->subtotal).'</td>'
                // Esta línea sirve para cerrar la fila.
                .'</tr>';
            // Esta línea sirve para unir todas las filas.
        })->implode('');

        // Esta línea sirve para devolver la tabla empezando por la etiqueta de apertura.
        return '<table style="width:100%;border-collapse:collapse;font-size:14px;">'
            // Esta línea sirve para abrir el encabezado.
            .'<thead><tr>'
            // Esta línea sirve para agregar el encabezado "Producto".
            .'<th style="text-align:left;padding:6px 8px;border-bottom:2px solid #00B8D9;">Producto</th>'
            // Esta línea sirve para agregar el encabezado "Cant.".
            .'<th style="text-align:center;padding:6px 8px;border-bottom:2px solid #00B8D9;">Cant.</th>'
            // Esta línea sirve para agregar el encabezado "Precio".
            .'<th style="text-align:right;padding:6px 8px;border-bottom:2px solid #00B8D9;">Precio</th>'
            // Esta línea sirve para agregar el encabezado "Subtotal".
            .'<th style="text-align:right;padding:6px 8px;border-bottom:2px solid #00B8D9;">Subtotal</th>'
            // Esta línea sirve para cerrar el encabezado.
            .'</tr></thead>'
            // Esta línea sirve para agregar el cuerpo con las filas.
            .'<tbody>'.$rows.'</tbody>'
            // Esta línea sirve para cerrar la tabla.
            .'</table>';
    }
}
