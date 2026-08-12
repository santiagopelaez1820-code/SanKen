<?php

use App\Models\ChallengeParticipant;
use App\Models\ChatConversation;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('challenges.{challengeId}', function ($user, $challengeId) {
    return ChallengeParticipant::query()
        ->where('challenge_id', $challengeId)
        ->where('user_id', $user->id)
        ->exists();
});

Broadcast::channel('conversations.{conversationId}', function ($user, $conversationId) {
    return ChatConversation::query()
        ->where('id', $conversationId)
        ->whereHas('trainerClient', fn ($q) => $q->where('trainer_id', $user->id)->orWhere('client_id', $user->id))
        ->exists();
});
