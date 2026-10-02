<?php

namespace App\Http\Requests\Support;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Respuesta del check-in: cómo se sintió (mood), si quiere contar algo
 * (topic) y, si eligió contar algo, el comentario (obligatorio en ese caso,
 * opcional si eligió "No, todo está bien" — y en ese caso se ignora).
 */
class AnswerWeeklyCheckinRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['comment' => is_string($this->comment) ? trim($this->comment) : $this->comment]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'mood' => ['required', 'string', Rule::in(config('support.checkin.moods'))],
            'topic' => ['required', 'string', Rule::in(config('support.checkin.topics'))],
            'comment' => [
                Rule::requiredIf(fn () => $this->input('topic') !== 'none'),
                'nullable',
                'string',
                'min:3',
                'max:2000',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'mood.required' => 'Elige cómo te sentiste esta semana.',
            'topic.required' => 'Elige una opción.',
            'comment.required' => 'Cuéntanos qué ocurrió.',
            'comment.min' => 'Cuéntanos un poco más.',
            'comment.max' => 'El comentario no puede superar los 2000 caracteres.',
        ];
    }
}
