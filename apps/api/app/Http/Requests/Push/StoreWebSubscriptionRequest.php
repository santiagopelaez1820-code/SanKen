<?php

namespace App\Http\Requests\Push;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Acepta la forma cruda de PushSubscription.toJSON() del navegador
 * (endpoint + keys.p256dh + keys.auth), sin aplanar del lado del cliente.
 */
class StoreWebSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'endpoint' => ['required', 'string', 'max:500'],
            'keys.p256dh' => ['required', 'string'],
            'keys.auth' => ['required', 'string'],
        ];
    }
}
