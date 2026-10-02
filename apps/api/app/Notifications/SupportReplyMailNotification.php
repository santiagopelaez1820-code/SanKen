<?php

namespace App\Notifications;

use App\Models\SupportTicket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Correo al usuario cuando el equipo responde su solicitud — reutiliza el
 * SMTP y la cola existentes (mismo patrón que NewOrderNotification). Solo
 * avisa y enlaza: la respuesta completa se lee en la app, así el texto no
 * queda copiado en otro sistema más allá de lo necesario.
 */
class SupportReplyMailNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(
        public readonly SupportTicket $ticket,
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * @return array<int, int>
     */
    public function backoff(): array
    {
        return [60, 300, 900];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $url = rtrim((string) config('app.frontend_url', ''), '/')."/soporte/{$this->ticket->id}";

        return (new MailMessage)
            ->subject("Respuesta a tu solicitud #{$this->ticket->id} - SanKen")
            ->greeting('Hola, '.$notifiable->name)
            ->line("El equipo de SanKen respondió tu solicitud #{$this->ticket->id}: \"{$this->ticket->subject}\".")
            ->line('Puedes leer la respuesta y continuar la conversación desde la sección Soporte de la app.')
            ->action('Ver mi solicitud', $url)
            ->salutation('Equipo SanKen');
    }

    public function failed(Throwable $exception): void
    {
        Log::error('support.reply_mail_failed', [
            'ticket_id' => $this->ticket->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
