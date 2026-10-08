<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las notificaciones.

namespace App\Notifications;

// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el modelo WeeklyCheckin (check-in semanal).
use App\Models\WeeklyCheckin;
// Esta línea sirve para importar el trait que envía a la app y por push.
use App\Notifications\Concerns\SendsInAppAndPush;
// Esta línea sirve para importar la clase base de las notificaciones.
use Illuminate\Notifications\Notification;

/**
 * "¿Cómo te fue esta semana?" — una sola vez por semana y usuario
 * (WeeklyCheckin.notified_at, ver SendWeeklyCheckinRemindersCommand).
 */
// Esta línea sirve para declarar la notificación de que hay un check-in semanal disponible.
class WeeklyCheckinAvailableNotification extends Notification
{
    // Esta línea sirve para usar el envío a la app y por push.
    use SendsInAppAndPush;

    // Esta línea sirve para declarar el constructor.
    public function __construct(
        // Esta línea sirve para recibir el check-in.
        public readonly WeeklyCheckin $checkin,
    ) {}

    // Esta línea sirve para declarar el método que arma el contenido de la notificación.
    protected function payload(User $notifiable): array
    {
        // Esta línea sirve para devolver el contenido.
        return [
            // Esta línea sirve para indicar el tipo de notificación.
            'kind' => 'weekly_checkin',
            // Esta línea sirve para incluir el id del check-in.
            'checkin_id' => $this->checkin->id,
            // Esta línea sirve para incluir la semana.
            'week' => $this->checkin->week,
            // Esta línea sirve para poner el título.
            'title' => '¿Cómo te fue esta semana? 💪',
            // Esta línea sirve para poner el texto.
            'body' => 'Queremos saber cómo te has sentido con tus entrenamientos. Te toma menos de un minuto.',
            // Esta línea sirve para incluir el enlace al check-in.
            'link' => '/soporte/check-in',
        ];
    }
}
