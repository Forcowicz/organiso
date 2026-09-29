<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
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

    protected function prepareForValidation(): void
    {
        $data = [
            'is_urgent' => filter_var($this->input('is_urgent', false), FILTER_VALIDATE_BOOLEAN),
            'is_important' => filter_var($this->input('is_important', false), FILTER_VALIDATE_BOOLEAN),
        ];

        if ($this->filled('raw_due') && ! $this->filled('due_date')) {
            try {
                $carbon = Carbon::parse($this->input('raw_due'));
                $data['due_date'] = $carbon->format('Y-m-d');
                $data['due_time'] = $carbon->format('H:i');
            } catch (\Throwable $e) {
                // Incorrect format, remains null
            }
        }

        $this->merge($data);
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
