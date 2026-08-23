<?php

namespace App\Application\Progress\Actions;

use App\Models\BodyMeasurement;
use App\Models\User;

class RecordBodyMeasurementAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(User $user, array $data): BodyMeasurement
    {
        return $user->bodyMeasurements()->create([
            ...$data,
            'measured_at' => $data['measured_at'] ?? now()->toDateString(),
        ]);
    }
}
