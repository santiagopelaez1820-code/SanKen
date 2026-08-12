<?php

namespace App\Application\Chat\Actions;

use App\Events\MessageSent;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Models\User;
use App\Notifications\NewChatMessageNotification;

class SendMessageAction
{
    public function execute(ChatConversation $conversation, User $sender, string $body): ChatMessage
    {
        $message = $conversation->messages()->create([
            'sender_id' => $sender->id,
            'body' => $body,
        ]);

        // Sincrónico (no dispatch en cola): tiene que llegar al hilo abierto
        // en el mismo request, ver MessageSent.
        MessageSent::dispatch($message->load('sender'));

        $conversation->loadMissing('trainerClient.trainer', 'trainerClient.client');
        $trainerClient = $conversation->trainerClient;
        $recipient = $trainerClient->trainer_id === $sender->id ? $trainerClient->client : $trainerClient->trainer;
        $recipient->notify(new NewChatMessageNotification($message));

        return $message;
    }
}
