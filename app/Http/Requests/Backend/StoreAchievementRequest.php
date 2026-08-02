<?php

namespace App\Http\Requests\Backend;

use App\Models\Achievement;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAchievementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user('admin') !== null;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'icon' => ['required', 'string', Rule::in(Achievement::ICONS)],
            'value' => ['required', 'integer', 'min:0', 'max:999999999'],
            'suffix' => ['nullable', 'string', 'max:16'],
            'title' => ['required', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'icon.required' => 'Please choose an icon.',
            'icon.in' => 'The selected icon is not supported.',
            'value.required' => 'The number field is required.',
            'title.required' => 'The title field is required.',
        ];
    }
}
