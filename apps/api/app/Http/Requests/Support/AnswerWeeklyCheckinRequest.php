<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones de soporte.

namespace App\Http\Requests\Support;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;
// Esta línea sirve para importar Rule para reglas de validación avanzadas.
use Illuminate\Validation\Rule;

/**
 * Respuesta del check-in: cómo se sintió (mood), si quiere contar algo
 * (topic) y, si eligió contar algo, el comentario (obligatorio en ese caso,
 * opcional si eligió "No, todo está bien" — y en ese caso se ignora).
 */
// Esta línea sirve para declarar la validación de la respuesta del check-in semanal.
class AnswerWeeklyCheckinRequest extends FormRequest
{
    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (el dueño del check-in lo verifica el controller).
        return true;
    }

    // Esta línea sirve para declarar el método que prepara los datos antes de validar.
    protected function prepareForValidation(): void
    {
        // Esta línea sirve para quitar los espacios al inicio y al final del comentario.
        $this->merge(['comment' => is_string($this->comment) ? trim($this->comment) : $this->comment]);
    }

    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar las reglas de validación.
    public function rules(): array
    {
        // Esta línea sirve para devolver las reglas.
        return [
            // Esta línea sirve para exigir un estado de ánimo de los configurados.
            'mood' => ['required', 'string', Rule::in(config('support.checkin.moods'))],
            // Esta línea sirve para exigir un tema de los configurados.
            'topic' => ['required', 'string', Rule::in(config('support.checkin.topics'))],
            // Esta línea sirve para validar el comentario.
            'comment' => [
                // Esta línea sirve para exigirlo si el tema elegido no es "none".
                Rule::requiredIf(fn () => $this->input('topic') !== 'none'),
                // Esta línea sirve para permitir que sea null.
                'nullable',
                // Esta línea sirve para exigir que sea texto.
                'string',
                // Esta línea sirve para exigir al menos 3 caracteres.
                'min:3',
                // Esta línea sirve para limitarlo a 2000 caracteres.
                'max:2000',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    // Esta línea sirve para declarar los mensajes de error personalizados.
    public function messages(): array
    {
        // Esta línea sirve para devolver los mensajes.
        return [
            // Esta línea sirve para definir el mensaje si falta el estado de ánimo.
            'mood.required' => 'Elige cómo te sentiste esta semana.',
            // Esta línea sirve para definir el mensaje si falta el tema.
            'topic.required' => 'Elige una opción.',
            // Esta línea sirve para definir el mensaje si falta el comentario.
            'comment.required' => 'Cuéntanos qué ocurrió.',
            // Esta línea sirve para definir el mensaje si el comentario es muy corto.
            'comment.min' => 'Cuéntanos un poco más.',
            // Esta línea sirve para definir el mensaje si el comentario es muy largo.
            'comment.max' => 'El comentario no puede superar los 2000 caracteres.',
        ];
    }
}
