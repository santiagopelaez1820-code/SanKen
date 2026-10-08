<?php

// Esta línea sirve para importar el modelo ChallengeParticipant (participación en un reto).
use App\Models\ChallengeParticipant;
// Esta línea sirve para importar el modelo ChatConversation (conversación de chat).
use App\Models\ChatConversation;
// Esta línea sirve para importar la fachada Broadcast para definir canales privados.
use Illuminate\Support\Facades\Broadcast;

// Esta línea sirve para definir el canal privado de cada usuario.
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    // Esta línea sirve para permitir el acceso solo al propio usuario.
    return (int) $user->id === (int) $id;
});

// Esta línea sirve para definir el canal privado de cada reto.
Broadcast::channel('challenges.{challengeId}', function ($user, $challengeId) {
    // Esta línea sirve para consultar las participaciones.
    return ChallengeParticipant::query()
        // Esta línea sirve para filtrar por el reto.
        ->where('challenge_id', $challengeId)
        // Esta línea sirve para filtrar por el usuario.
        ->where('user_id', $user->id)
        // Esta línea sirve para permitir el acceso solo si participa en el reto.
        ->exists();
});

// Esta línea sirve para definir el canal privado de cada conversación.
Broadcast::channel('conversations.{conversationId}', function ($user, $conversationId) {
    // Esta línea sirve para consultar las conversaciones.
    return ChatConversation::query()
        // Esta línea sirve para filtrar por la conversación.
        ->where('id', $conversationId)
        // Esta línea sirve para exigir que el usuario sea el entrenador o el cliente.
        ->whereHas('trainerClient', fn ($q) => $q->where('trainer_id', $user->id)->orWhere('client_id', $user->id))
        // Esta línea sirve para permitir el acceso solo si es parte de la conversación.
        ->exists();
});
