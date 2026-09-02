<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:256'],
            'description' => ['string', 'nullable'],
            'is_urgent' => ['boolean', 'required'],
            'is_important' => ['boolean', 'required'],
            'due_date' => [
                Rule::date()->format('Y-m-d'),
                'nullable'
            ],
            'due_time' => [
                'exclude_without:due_date',
                'nullable',
                Rule::date()->format('H:i')
            ]
        ];
    }
}
