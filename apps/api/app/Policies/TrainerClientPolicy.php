<?php

namespace App\Policies;

use App\Models\TrainerClient;
use App\Models\User;

class TrainerClientPolicy
{
    public function view(User $user, TrainerClient $trainerClient): bool
    {
        return $user->is($trainerClient->trainer);
    }

    public function update(User $user, TrainerClient $trainerClient): bool
    {
        return $user->is($trainerClient->trainer);
    }
}
