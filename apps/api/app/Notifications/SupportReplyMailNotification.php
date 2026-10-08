<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las notificaciones.

namespace App\Notifications;

// Esta línea sirve para importar el modelo SupportTicket (solicitud de soporte).
use App\Models\SupportTicket;
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
// Esta línea sirve para importar Throwable para recibir el error final.
use Throwable;

/**
 * Correo al usuario cuando el equipo responde su solicitud — reutiliza el
 * SMTP y la cola existentes (mismo patrón que NewOrderNotification). Solo
 * avisa y enlaza: la respuesta completa se lee en la app, así el texto no
 * queda copiado en otro sistema más allá de lo necesario.
 */
// Esta línea sirve para declarar la notificación por correo cuando el equipo responde una solicitud.
class SupportReplyMailNotification extends Notification implements ShouldQueue
{
    // Esta línea sirve para usar las opciones de cola.
    use Queueable;

    // Esta línea sirve para definir la cantidad de intentos de envío.
    public int $tries = 3;

    // Esta línea sirve para declarar el constructor.
    public function __construct(
        // Esta línea sirve para recibir la solicitud.
        public readonly SupportTicket $ticket,
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
        // Esta línea sirve para armar el enlace a la solicitud en el frontend.
        $url = rtrim((string) config('app.frontend_url', ''), '/')."/soporte/{$this->ticket->id}";

        // Esta línea sirve para crear el correo.
        return (new MailMessage)
            // Esta línea sirve para poner el asunto con el número de solicitud.
            ->subject("Respuesta a tu solicitud #{$this->ticket->id} - SanKen")
            // Esta línea sirve para saludar al usuario por su nombre.
            ->greeting('Hola, '.$notifiable->name)
            // Esta línea sirve para avisar que el equipo respondió la solicitud.
            ->line("El equipo de SanKen respondió tu solicitud #{$this->ticket->id}: \"{$this->ticket->subject}\".")
            // Esta línea sirve para indicar dónde leer la respuesta.
            ->line('Puedes leer la respuesta y continuar la conversación desde la sección Soporte de la app.')
            // Esta línea sirve para agregar el botón para ver la solicitud.
            ->action('Ver mi solicitud', $url)
            // Esta línea sirve para poner la despedida.
            ->salutation('Equipo SanKen');
    }

    // Esta línea sirve para declarar el método que se ejecuta cuando se agotan los reintentos.
    public function failed(Throwable $exception): void
    {
        // Esta línea sirve para registrar el error en el log.
        Log::error('support.reply_mail_failed', [
            // Esta línea sirve para incluir el id de la solicitud.
            'ticket_id' => $this->ticket->id,
            // Esta línea sirve para incluir el mensaje del error.
            'error' => $exception->getMessage(),
        ]);
    }
}
