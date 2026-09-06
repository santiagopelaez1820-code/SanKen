<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
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
class ResetPasswordNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly string $resetUrl,
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Recupera tu contraseña — SanKen')
            ->greeting('¿Olvidaste tu contraseña? 🔑')
            ->line('Recibimos una solicitud para restablecer la contraseña de tu cuenta en SanKen.')
            ->action('Elegir nueva contraseña', $this->resetUrl)
            ->line('Este enlace vence en 60 minutos.')
            ->line('Si no fuiste tú quien lo solicitó, puedes ignorar este correo — tu contraseña actual sigue funcionando sin cambios.')
            ->salutation('Equipo SanKen 💪');
    }
}
