<?php

namespace App\Http\Requests\Backend;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreApprovedRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user('admin') !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['nullable', 'string', 'max:255'],
            'file' => ['nullable', 'file', 'mimes:pdf'],
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,gif'],
            'link' => ['nullable', 'url', 'max:2048'],
        ];
    }

    /**
     * Get the custom error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'file.mimes' => 'The file must be a PDF document.',
            'image.required' => 'The image field is required.',
            'image.image' => 'The image must be a valid image file.',
            'link.url' => 'The link must be a valid URL.',
        ];
    }
}
