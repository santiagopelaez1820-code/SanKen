<?php

namespace App\Notifications;

use App\Models\User;
use App\Models\WeeklyCheckin;
use App\Notifications\Concerns\SendsInAppAndPush;
use Illuminate\Notifications\Notification;

/**
 * "¿Cómo te fue esta semana?" — una sola vez por semana y usuario
 * (WeeklyCheckin.notified_at, ver SendWeeklyCheckinRemindersCommand).
 */
class WeeklyCheckinAvailableNotification extends Notification
{
    use SendsInAppAndPush;

    public function __construct(
        public readonly WeeklyCheckin $checkin,
    ) {}

    protected function payload(User $notifiable): array
    {
        return [
            'kind' => 'weekly_checkin',
            'checkin_id' => $this->checkin->id,
            'week' => $this->checkin->week,
            'title' => '¿Cómo te fue esta semana? 💪',
            'body' => 'Queremos saber cómo te has sentido con tus entrenamientos. Te toma menos de un minuto.',
            'link' => '/soporte/check-in',
        ];
    }
}
