<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones del chat.

namespace App\Application\Chat\Actions;

// Esta línea sirve para importar el modelo ChatConversation (conversación).
use App\Models\ChatConversation;
// Esta línea sirve para importar el modelo TrainerClient (relación entrenador-cliente).
use App\Models\TrainerClient;

// Esta línea sirve para declarar la acción que obtiene o crea la conversación de una relación.
class GetOrCreateConversationAction
{
    // Esta línea sirve para declarar el método que recibe la relación y devuelve su conversación.
    public function execute(TrainerClient $trainerClient): ChatConversation
    {
        // Esta línea sirve para buscar la conversación de la relación o crearla si no existe.
        return ChatConversation::query()->firstOrCreate(['trainer_client_id' => $trainerClient->id]);
    }
}
