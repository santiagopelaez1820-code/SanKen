<?php

namespace App\Application\Chat\Actions;

use App\Models\ChatConversation;
use App\Models\TrainerClient;

class GetOrCreateConversationAction
{
    public function execute(TrainerClient $trainerClient): ChatConversation
    {
        return ChatConversation::query()->firstOrCreate(['trainer_client_id' => $trainerClient->id]);
    }
}
