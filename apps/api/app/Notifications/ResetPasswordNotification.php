<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las notificaciones.

namespace App\Notifications;

// Esta línea sirve para importar el trait que permite enviar la notificación a la cola.
use Illuminate\Bus\Queueable;
// Esta línea sirve para importar el contrato que indica que se procesa en cola.
use Illuminate\Contracts\Queue\ShouldQueue;
// Esta línea sirve para importar la clase que arma correos.
use Illuminate\Notifications\Messages\MailMessage;
// Esta línea sirve para importar la clase base de las notificaciones.
use Illuminate\Notifications\Notification;

/**
 * Correo de "olvidé mi contraseña" — reemplaza la notificación
 * `Illuminate\Auth\Notifications\ResetPassword` por defecto (en inglés, sin
 * marca) por una en español acorde al resto de la app (ver
 * NewOrderNotification para el mismo criterio de branding).
 *
 * El link apunta al FRONTEND (apps/web), no a esta API — el usuario necesita
 * escribir la contraseña nueva en algún lado, y esta API no sirve HTML. Se
 * arma en `App\Models\User::sendPasswordResetNotification()`, mismo patrón
 * que EmailVerificationController usando `frontend_url`/FRONTEND_URL.
 */
// Esta línea sirve para declarar la notificación por correo para restablecer la contraseña.
class ResetPasswordNotification extends Notification implements ShouldQueue
{
    // Esta línea sirve para usar las opciones de cola.
    use Queueable;

    // Esta línea sirve para declarar el constructor.
    public function __construct(
        // Esta línea sirve para recibir el enlace para restablecer la contraseña.
        private readonly string $resetUrl,
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

    // Esta línea sirve para declarar el método que arma el correo.
    public function toMail(object $notifiable): MailMessage
    {
        // Esta línea sirve para crear el correo.
        return (new MailMessage)
            // Esta línea sirve para poner el asunto.
            ->subject('Recupera tu contraseña — SanKen')
            // Esta línea sirve para poner el saludo.
            ->greeting('¿Olvidaste tu contraseña? 🔑')
            // Esta línea sirve para explicar que se pidió restablecer la contraseña.
            ->line('Recibimos una solicitud para restablecer la contraseña de tu cuenta en SanKen.')
            // Esta línea sirve para agregar el botón con el enlace.
            ->action('Elegir nueva contraseña', $this->resetUrl)
            // Esta línea sirve para avisar que el enlace vence en 60 minutos.
            ->line('Este enlace vence en 60 minutos.')
            // Esta línea sirve para aclarar que se puede ignorar si no lo pidió.
            ->line('Si no fuiste tú quien lo solicitó, puedes ignorar este correo — tu contraseña actual sigue funcionando sin cambios.')
            // Esta línea sirve para poner la despedida.
            ->salutation('Equipo SanKen 💪');
    }
}
