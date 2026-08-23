<?php

namespace App\Policies;

use App\Models\CalendarReminder;
use App\Models\User;

class CalendarReminderPolicy
{
    public function delete(User $user, CalendarReminder $reminder): bool
    {
        return $user->id === $reminder->user_id;
    }
}
