<?php

namespace App\Notifications;

use App\Domain\Order\OrderStatusCatalog;
use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\HtmlString;
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
class NewOrderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /** Reintentos ante fallo de envío (ej. SMTP caído momentáneamente) antes de darse por vencido y loguear en failed(). */
    public int $tries = 3;

    public function __construct(
        public readonly Order $order,
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Backoff creciente entre reintentos (1min, 5min, 15min) — casi siempre
     * un fallo de SMTP es transitorio, no vale la pena reintentar de
     * inmediato.
     *
     * @return array<int, int>
     */
    public function backoff(): array
    {
        return [60, 300, 900];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $order = $this->order;

        $mail = (new MailMessage)
            ->subject("🛒 Nuevo pedido #{$order->orderNumber()} - SanKen Store")
            ->greeting('🛒 Nuevo pedido en SanKen Store')
            ->line("Pedido **#{$order->orderNumber()}** — {$order->created_at->format('d/m/Y H:i')} — Estado: **{$this->statusLabel()}**")
            ->line('**CLIENTE**')
            ->line("Nombre: {$order->customer_name}")
            ->line("Teléfono: {$order->customer_phone}")
            ->line("Correo: {$order->customer_email}")
            ->line('**ENTREGA**')
            ->line("Dirección: {$order->address}")
            ->line("Ciudad: {$order->city}")
            ->line("Departamento: {$order->department}");

        if ($order->additional_info) {
            $mail->line("Observaciones: {$order->additional_info}");
        }

        $mail->line('**PRODUCTOS**')
            ->line(new HtmlString($this->itemsTableHtml()))
            ->line("Subtotal: **{$this->money($order->subtotal)}**");

        if ($order->shipping_cost !== null) {
            $mail->line("Envío: **{$this->money($order->shipping_cost)}**");
        }

        return $mail
            ->line("### TOTAL: {$this->money($order->total)}")
            ->action('Ver pedido en SanKen', $this->adminOrderUrl())
            ->salutation('SanKen Store');
    }

    /**
     * Se llama automáticamente cuando se agotan los `tries` reintentos —
     * deja constancia en el log para que se pueda notar que un pedido no
     * llegó a notificarse por correo, sin que eso afecte al pedido en sí
     * (ya existe, ya fue creado antes de que esto se dispare).
     */
    public function failed(Throwable $exception): void
    {
        Log::error('order.notification.mail_failed', [
            'order_id' => $this->order->id,
            'error' => $exception->getMessage(),
        ]);
    }

    private function statusLabel(): string
    {
        return OrderStatusCatalog::label($this->order->status);
    }

    private function money(string|float $amount): string
    {
        return '$'.number_format((float) $amount, 0, ',', '.').' COP';
    }

    /**
     * Apunta al panel web administrativo (apps/web), NO a esta API — son
     * apps distintas. Reutiliza `frontend_url`/FRONTEND_URL, ya existente
     * en el proyecto y usado con el mismo criterio en
     * EmailVerificationController para el link de verificación de correo.
     */
    private function adminOrderUrl(): string
    {
        $frontendUrl = config('app.frontend_url');

        if (! $frontendUrl) {
            return url("/admin/orders/{$this->order->id}");
        }

        return rtrim($frontendUrl, '/')."/admin/orders/{$this->order->id}";
    }

    private function itemsTableHtml(): string
    {
        $rows = $this->order->items->map(function ($item) {
            return '<tr>'
                .'<td style="padding:6px 8px;border-bottom:1px solid #e5e5e5;">'.e($item->product_name).'</td>'
                .'<td style="padding:6px 8px;border-bottom:1px solid #e5e5e5;text-align:center;">'.(int) $item->quantity.'</td>'
                .'<td style="padding:6px 8px;border-bottom:1px solid #e5e5e5;text-align:right;">'.$this->money($item->unit_price).'</td>'
                .'<td style="padding:6px 8px;border-bottom:1px solid #e5e5e5;text-align:right;">'.$this->money($item->subtotal).'</td>'
                .'</tr>';
        })->implode('');

        return '<table style="width:100%;border-collapse:collapse;font-size:14px;">'
            .'<thead><tr>'
            .'<th style="text-align:left;padding:6px 8px;border-bottom:2px solid #00B8D9;">Producto</th>'
            .'<th style="text-align:center;padding:6px 8px;border-bottom:2px solid #00B8D9;">Cant.</th>'
            .'<th style="text-align:right;padding:6px 8px;border-bottom:2px solid #00B8D9;">Precio</th>'
            .'<th style="text-align:right;padding:6px 8px;border-bottom:2px solid #00B8D9;">Subtotal</th>'
            .'</tr></thead>'
            .'<tbody>'.$rows.'</tbody>'
            .'</table>';
    }
}
