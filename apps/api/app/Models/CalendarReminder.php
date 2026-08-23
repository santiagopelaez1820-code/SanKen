<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CalendarReminder extends Model
{
    protected $fillable = ['user_id', 'event_date', 'title', 'notes'];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
